import baseApi from "."

const startChunkFile = (file, chunkSize, sessionId) => {
    return new Promise((resolve, reject) => {
        if (!file || !(file instanceof Blob)) {
            throw new Error('Invalid file object');
        }
        const totalChunks = Math.ceil(file.size / chunkSize);
        const chunks = [];

        for (let i = 0; i < totalChunks; i++) {
            const start = i * chunkSize;
            const end = Math.min(start + chunkSize, file.size);
            chunks.push({
                sessionId,          // 会话ID（用于断点续传）
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
        })
    })

};

const uploadFileChunk = (data) => {
    return baseApi({
        method: 'post',
        url: '/file/chunk/upload',
        data: data
    })
}
const uploadFileChunks = async (chunks) => {
    while (chunks.length > 0) {
        try {
            let curChunk = chunks[0]
            const response = await uploadFileChunk(curChunk);
            // 正确的成功判断（根据你的实际API响应结构调整）
            if (response && response.code === 200) {
                chunks.shift(); // 只有成功才移除
                console.log('分片上传成功:', curChunk);
            } else {
                // 上传失败处理
                console.error('分片上传失败:', response?.message || '未知错误');
                break; // 或者实现重试逻辑
            }
        } catch (error) {
            console.error('上传请求异常:', error);
            break; // 或者实现重试逻辑
        }
    }
}
export const uploadFile = (filePath, clbck) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!filePath) return reject('文件不存在')
            // 开启上传会话 
            const res = await baseApi({
                method: 'get',
                url: 'file/chunk/start',
            });
            if (!res || res.code != 200) reject(res || '上传失败')
            console.log('开启会话成功');
            console.log(res);
            // 进行分片: chunk={data:'',upload:false,id:'',sessionId:'',nextId:'',}
            let chunkSize = 1 * 1024 * 1024
            const chunkRes = await startChunkFile(filePath, chunkSize, res.sessionId)
            console.log(chunkRes);
            let chunks = chunkRes.chunks.slice()
            await uploadFileChunks(chunks)
            // 创建两个数组,一个完整的分片数组(备份),一个待上传的分片数组(上传成功后移除上传成功的分片,这样待上传的分片就一直减少)
            // 调用并发函数发送分片数据,标记已经上传完的分片
            // 前端发完之后,通知后端,返回缺失的分片id,前端进行断点续传,直到所有的分片发送成功
            // 
        } catch (error) {
            console.error(error);
        }
    })
}
