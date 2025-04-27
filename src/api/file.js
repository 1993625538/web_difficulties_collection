import baseApi from "."

const startChunkFile = (file, chunkSize, sessionId) => {
    return new Promise((resolve, reject) => {
        if (!file || !(file instanceof Blob)) {
            throw new Error('Invalid file object');
        }
        const total = Math.ceil(file.size / chunkSize);
        const chunks = [];

        for (let i = 0; i < total; i++) {
            const start = i * chunkSize;
            const end = Math.min(start + chunkSize, file.size);
            chunks.push({
                sessionId,          // 会话ID（用于断点续传）
                chunkId: i,         // 分片序号
                total,        // 总分片数
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

const uploadFileChunk = (chunk) => {
    return new Promise((resolve, reject) => {
        const formData = new FormData();
        formData.append('sessionId', chunk.sessionId);
        formData.append('chunkId', chunk.chunkId);
        formData.append('total', chunk.total);
        formData.append('filename', chunk.filename);
        formData.append('size', chunk.size);
        formData.append('blob', chunk.blob, `chunk-${chunk.chunkId}`);
        fetch('http://localhost:5000/file/chunk/upload', {
            method: 'POST',
            body: formData,
        }).then(async (response) => {
            if (!response.ok) throw new Error('网络响应异常');
            const res = await response.json()
            resolve(res)
        }).catch(error => {
            reject(error)
        });
    })

}
const uploadFileChunks = (chunks) => {
    return new Promise(async (resolve, reject) => {
        let success = true
        while (chunks.length > 0) {
            try {
                let curChunk = chunks[0]
                const response = await uploadFileChunk(curChunk);
                console.log(response);
                // if (time === 5) break
                // // 正确的成功判断（根据你的实际API响应结构调整）
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
                success = false
                break; // 或者实现重试逻辑
            }
        }
        success ? resolve({
            code: 200,
            message: '上传成功'
        }) : reject(
            {
                code: 500,
                message: '上传失败'
            }
        )
    })


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
            const res2 = await uploadFileChunks(chunks)
            // 创建两个数组,一个完整的分片数组(备份),一个待上传的分片数组(上传成功后移除上传成功的分片,这样待上传的分片就一直减少)
            if (res2 && res2.code === 200) {
                const res3 = await baseApi({
                    method: 'post',
                    url: 'file/chunk/merge',
                    data: {
                        sessionId: res.sessionId,
                    }
                })
            }
            // 调用并发函数发送分片数据,标记已经上传完的分片
            // 前端发完之后,通知后端,返回缺失的分片id,前端进行断点续传,直到所有的分片发送成功
            // 
        } catch (error) {
            console.error(error);
        }
    })
}
