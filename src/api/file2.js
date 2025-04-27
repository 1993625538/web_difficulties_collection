import baseApi from ".";

/**
 * 创建文件分片
 * @param {File} file - 要上传的文件
 * @param {number} chunkSize - 分片大小(字节)
 * @param {string} sessionId - 上传会话ID
 * @returns {Promise} 包含分片数组的Promise
 */
const startChunkFile = (file, chunkSize, sessionId) => {
    return new Promise((resolve) => {
        if (!file || !(file instanceof Blob)) {
            throw new Error('Invalid file object');
        }

        const totalChunks = Math.ceil(file.size / chunkSize);
        const chunks = [];

        for (let i = 0; i < totalChunks; i++) {
            const start = i * chunkSize;
            const end = Math.min(start + chunkSize, file.size);
            chunks.push({
                sessionId,          // 会话ID
                chunkId: i,         // 分片序号
                totalChunks,        // 总分片数
                blob: file.slice(start, end),  // 分片数据
                filename: file.name,// 原始文件名
                size: end - start,  // 当前分片大小
                uploaded: false     // 上传状态标记
            });
        }

        resolve({
            code: 200,
            chunks
        });
    });
};

/**
 * 上传单个文件分片
 * @param {Object} chunk - 分片对象
 * @returns {Promise} 上传结果的Promise
 */
const uploadFileChunk = (chunk) => {
    const formData = new FormData();
    formData.append('sessionId', chunk.sessionId);
    formData.append('chunkId', chunk.chunkId);
    formData.append('totalChunks', chunk.totalChunks);
    formData.append('file', chunk.blob, chunk.filename);

    return baseApi({
        method: 'post',
        url: '/file/chunk/upload',
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

/**
 * 上传所有分片
 * @param {Array} chunks - 分片数组
 * @param {Function} [progressCallback] - 进度回调
 * @returns {Promise} 上传结果的Promise
 */
const uploadFileChunks = async (chunks, progressCallback) => {
    const totalChunks = chunks.length;
    let uploadedCount = 0;
    const failedChunks = [];

    // 创建副本避免修改原数组
    const chunksToUpload = [...chunks];

    while (chunksToUpload.length > 0) {
        const chunk = chunksToUpload[0];

        try {
            console.log(`正在上传分片 ${chunk.chunkId + 1}/${totalChunks}`);
            const response = await uploadFileChunk(chunk);

            if (response && response.code === 200) {
                chunksToUpload.shift();
                uploadedCount++;
                chunk.uploaded = true;

                if (progressCallback) {
                    progressCallback({
                        uploaded: uploadedCount,
                        total: totalChunks,
                        percentage: Math.round((uploadedCount / totalChunks) * 100)
                    });
                }

                console.log(`分片 ${chunk.chunkId} 上传成功`);
            } else {
                throw new Error(response?.message || '上传失败');
            }
        } catch (error) {
            console.error(`分片 ${chunk.chunkId} 上传失败:`, error.message);
            failedChunks.push(chunk);

            // 简单的重试机制 - 等待2秒后重试
            await new Promise(resolve => setTimeout(resolve, 2000));

            // 如果重试3次仍然失败，则跳过
            if (chunk.retryCount >= 3) {
                console.error(`分片 ${chunk.chunkId} 重试3次后仍失败，跳过`);
                chunksToUpload.shift();
            } else {
                chunk.retryCount = (chunk.retryCount || 0) + 1;
            }
        }
    }

    if (failedChunks.length > 0) {
        throw new Error(`${failedChunks.length}个分片上传失败`);
    }

    return {
        code: 200,
        message: '所有分片上传完成'
    };
};

/**
 * 主上传函数
 * @param {File} file - 要上传的文件
 * @param {Function} [progressCallback] - 进度回调
 * @returns {Promise} 上传结果的Promise
 */
export const uploadFile = async (file, progressCallback) => {
    try {
        if (!file) {
            throw new Error('文件不存在');
        }

        // 1. 开启上传会话
        console.log('正在开启上传会话...');
        const sessionRes = await baseApi({
            method: 'get',
            url: 'file/chunk/start',
        });

        if (!sessionRes || sessionRes.code !== 200) {
            throw new Error(sessionRes?.message || '开启会话失败');
        }

        console.log('上传会话开启成功，sessionId:', sessionRes.sessionId);

        // 2. 文件分片
        const chunkSize = 1 * 1024 * 1024; // 1MB
        console.log(`正在分片处理，分片大小: ${chunkSize / 1024}KB`);

        const chunkRes = await startChunkFile(file, chunkSize, sessionRes.sessionId);
        console.log(`分片完成，共 ${chunkRes.chunks.length} 个分片`);

        // 3. 上传所有分片
        console.log('开始上传分片...');
        const uploadResult = await uploadFileChunks(chunkRes.chunks, progressCallback);

        // 4. 通知后端合并文件
        console.log('所有分片上传完成，通知后端合并...');
        const mergeRes = await baseApi({
            method: 'post',
            url: 'file/chunk/merge',
            data: {
                sessionId: sessionRes.sessionId,
                filename: file.name,
                totalChunks: chunkRes.chunks.length
            }
        });

        if (!mergeRes || mergeRes.code !== 200) {
            throw new Error(mergeRes?.message || '文件合并失败');
        }

        console.log('文件上传并合并成功');
        return {
            code: 200,
            message: '文件上传成功',
            data: mergeRes.data
        };

    } catch (error) {
        console.error('文件上传失败:', error.message);
        throw error;
    }
};