/**
 * 检查 WebSocket URL 是否合法
 * @param {string} url - 要检查的 WebSocket URL
 * @returns {boolean} - 返回 true 如果 URL 合法，否则返回 false
 */
export const checkWsUrl = (url) => {
    try {
        // 基本检查：非空字符串
        if (typeof url !== 'string' || !url.trim()) {
            return false;
        }

        // 创建 URL 对象进行解析（会抛出异常如果URL无效）
        const urlObj = new URL(url);

        // 检查协议：支持 ws 和 wss
        if (urlObj.protocol !== 'ws:' && urlObj.protocol !== 'wss:') {
            return false;
        }

        // 检查主机名不为空
        if (!urlObj.hostname) {
            return false;
        }

        // 检查端口（如果有）是有效数字
        if (urlObj.port && isNaN(parseInt(urlObj.port))) {
            return false;
        }

        // 所有检查通过
        return true;
    } catch (e) {
        // 如果 URL 解析失败，捕获异常并返回 false
        return false;
    }
}


export const getDataType = (data) => {
    return Object.prototype.toString.call(data).slice(8, -1).toLowerCase()
}