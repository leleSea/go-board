import global from './global.js'

export default class timeToQuit{
    constructor(opt){
        this.countTime = opt.countTime * 60 || 5 * 60 //计时时间
        this.endCallback = opt.endCallback || null
        this.timeoutObj = null
        this.surplusTime = this.countTime
        this.type = opt.type
    }
    countTimeSet(time){
        this.countTime = time * 60 || 5 * 60
        this.start()
    }
    start(){
        if(!global.pageAutoQuit) return
        this.stop()
        let countTime = this.countTime * 1000
        let type = this.type
        this.timeoutObj = setTimeout(() => {
            if(this.endCallback != null){
                this.endCallback()
            }
        }, countTime)
    }
    stop(){
        
        clearTimeout(this.timeoutObj)
    }
    restart(){
        this.start()
    }
}