import commonApi from './common'
import errorCode from './errorCode'

export default class errorHand extends commonApi{
    constructor(opt){
        opt = opt || {}
        let localKey = 'error_hand'
        super({localKey: localKey})
        this._errorCode = errorCode
    }
    hand(res, key, opt){
        opt = opt || {}
        res = res || {}
        let code
        if(!this._global.isObject(res)) code = res
        else code = res.code
        if(code == 0) return
        let msg = this.getMsg(code, key)
        if(!msg) return
        opt.message = msg
        this._global.MessageOpen(opt)
    }
    getMsg(code, key){
        key = key || 'default'
        let msgData = this._errorCode[key]
        if(!msgData) msgData = this._errorCode.defaultMsg
        if(this._global.isObject(msgData)) msgData = msgData[code]
        if(!msgData) msgData = this._errorCode.defaultMsg
        return msgData
    }
}