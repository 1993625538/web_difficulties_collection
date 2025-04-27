import { checkWsUrl, getDataType } from "./normal";
export const SOCKET_STATE = Object.freeze(
    {
        INIT: { CODE: 1, desc: "Initial state", event: '' },
        OPENING: { CODE: 10, desc: "Socket is opening", event: '' },
        OPENED: { CODE: 20, desc: "Socket is open", event: 'onopen' },
        CLOSING: { CODE: 30, desc: "Socket is closing", event: '' },
        CLOSED: { CODE: 40, desc: "Socket is closed", event: 'onclose' },
        ERROR: { CODE: 50, desc: "Socket error occurred", event: 'onerror' },
        MESSAGE: { CODE: 60, desc: "Socket received a message", event: 'onmessage' },
    }
);

export class WebSocketServer {
    constructor(url, errLinkTime, reLinkTime, maxRetryTimes, heartBitTime) {
        this.checkConfig(url, errLinkTime, reLinkTime, maxRetryTimes, heartBitTime)
        this.url = url;
        this.errLinkTime = errLinkTime
        this.reLinkTime = reLinkTime
        this.heartBitTime = heartBitTime
        this.maxRetryTimes = maxRetryTimes
        this.hasRetryTimes = 0
        this.errors = []
        this.socket = null;
        this.state = SOCKET_STATE.INIT;
        this.callbacks = new Map();
        this.heartBitCounter = 0
        this.heartBitInterval = null
    }
    checkConfig(url, errLinkTime, reLinkTime, maxRetryTimes, heartBitTime) {
        if (checkWsUrl(url)) return (new Error("Invalid URL"));
        if (getDataType(errLinkTime) != 'number') return (new Error("Invalid errLinkTime"));
        if (getDataType(reLinkTime) != 'number') return (new Error("Invalid reLinkTime"));
        if (getDataType(maxRetryTimes) != 'number') return (new Error("Invalid maxRetryTimes"));
        if (getDataType(heartBitTime) != 'number') return (new Error("Invalid heartBitTime"));
    }
    removeOnHandlers() {
        if (!this.socket) return
        this.socket.onopen = null
        this.socket.onerror = null
        this.socket.onmessage = null
        this.socket.onclose = null
    }
    connect() {
        try {
            if (this.hasRetryTimes > this.maxRetryTimes) throw new Error('maxRetryTimes')
            this.setState(SOCKET_STATE.OPENING)
            delete this.socket
            this.socket = new WebSocket(this.url);
            // this.initSocketListeners();
            this.socket.onopen = () => {
                console.log('onopen');
                // this.startHeartBitInterval()
            }
            this.socket.onerror = () => {
                console.log('error');
                this.reConnect(this.errLinkTime)
            }
            this.socket.onmessage = (event) => {
                console.log(JSON.parse(event.data));
                let data = JSON.parse(event.data)
                if (data.type == 'pong') {
                    this.heartBitCounter += 1
                    console.log('收到心跳数据:');
                    console.log(this.heartBitCounter);

                }
            }
            this.socket.onclose = () => {
                console.log('onclose');
                this.reConnect(this.reLinkTime)
            }
        } catch (error) {
            this.setState(SOCKET_STATE.ERROR)
            this.reConnect()
        }
    }
    sendMessage(data) {
        if (!this.isSocketValid()) {
            this.reConnect(this.errLinkTime)
            setTimeout(() => {
                this.sendMessage(data)
            }, this.errLinkTime);
        }
        this.socket.send(JSON.stringify(data))
    }
    checkHeartBit() {
        let oldHeartBitCounter = this.heartBitCounter
        setTimeout(() => {
            console.log('比对心跳数据');
            console.log(oldHeartBitCounter);
            console.log(this.heartBitCounter);
            if (oldHeartBitCounter == this.heartBitCounter) {
                this.disconnect()
            }
        }, Math.floor(this.heartBitTime / 5));
    }
    sendHeartBit() {
        let data = {
            type: 'ping',
            data: new Date().getTime()
        }
        this.sendMessage(data)
        this.checkHeartBit()
    }
    startHeartBitInterval() {
        clearInterval(this.heartBitInterval)
        this.heartBitInterval = setInterval(() => {
            this.sendHeartBit()
        }, this.heartBitTime);
    }
    reConnect(time) {
        setTimeout(() => {
            this.hasRetryTimes += 1
            this.removeOnHandlers()
            this.connect()
        }, time);
    }
    removeListener(state) {
        this.socket[state.event] = null
    }
    removeClbck(state) {
        this.callbacks.delete(state)
    }
    registerClbck(state, data) {
        console.log(state);
        this.state = state
        this.callbacks.get(state)?.(data);
    };
    disconnect() {
        if (this.socket) {
            this.socket.close();
            this.socket = null;
            this.state = SOCKET_STATE.CLOSED;
        }
        return this;
    }
    setCallback(state, clbck) {
        if (!Object.values(SOCKET_STATE).includes(state))
            throw new Error("Invalid state");
        if (getDataType(clbck) !== "function")
            throw new Error("Callback must be a function");
        this.callbacks.set(state, clbck);
        return this;
    }
    setState(state) {
        if (!Object.values(SOCKET_STATE).includes(state))
            throw new Error("Invalid state");
        this.state = state;
        return this;
    }

    setUrl(url) {
        this.url = url;
        return this;
    }
    isSocketValid() {
        return this.socket != null
    }
    isWsUrlValid() {
        return checkWsUrl(this.url);
    }
}