

export default class timer{
    constructor(opt){
        this.status = false
        this.init(opt)
    }
    init(opt){
        opt = opt || {}
        for(let i in opt){
            this[i] = opt[i]
        }
    }
    start(type, params){
        if(!this[`${type}_start`]) return
        this.init(params)
        this.status = true
        this[`${type}_start`]()
    }
    stop(){
        this.status = false
    }
    count_down_start(){
        let {minute, second} = this
        minute = minute || 0, second = second || 0
        second = second + minute * 60
        this.count_down_action(second * 1000)
    }
    count_down_action(second, ){
        if(!this.status) return
        
        let step = this.step || 1000
        this.responseHand(second)
        if(second < 0){
            return
        }
        second -= step 
        setTimeout(() => {
            this.count_down_action(second)
        }, step);
    }
    responseHand(num){
        let ms = num
        num = parseInt(num / 1000)
        let time = this.timeFormat(num) || {}
        time.remain = num
        time.ms = ms
        if(this.response) this.response(time)
    }
    timeFormat(num){
        let minute = parseInt(num / 60)
        let second = num % 60
        return {minute, second}
    }
}