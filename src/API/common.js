import localDataControl from '../localDataControl'
import global from '../global'
import Vue from 'vue'

export default class commonApi{
    constructor(opt){
        opt = opt || {}
        let localKey = opt.localKey || ''
        this._appData = new localDataControl({key: localKey})
        this._global = global
        this._loading = Vue.prototype.LOADING
        this._errorHand = Vue.prototype._errorHand
        this.apiList = {}
    }
    usernameGet(){
        return this._appData.getStoreItem('username') || null
    }
    async requestAction(api, options, errorKey, ser){
        errorKey = errorKey || 'common'
        options = options || {}

        if(!options.noLoad) this._loading.open()
        let res = await this.requestData(api, options, ser, errorKey)
        if(!options.noLoad) this._loading.close()
        let resData = res || {}
        let noError = resData.noError || options.noError
        if((!res || res.code != 0) && !noError) this._errorHand.hand(res, errorKey)
        if(options.fullData) return res
        if(res && res.code == 0){
            return res.data || null
        }
        return false
    }

    async requestData(api, opt, ser, errorKey){
        
        ser = ser || 'engine'
        opt = opt || {}
        let apiData = this.apiList[api]
        let username = this.usernameGet()
        if(!apiData) return false
        let url = apiData.url
        url = this.urlParse(url, opt)
        let login = apiData.login === undefined ? true : apiData.login
        if(login && !username) return false
        let method = opt.method || 'GET'
        let data = opt.data || null
        let header = opt.header || null
        let option = {
            url: url,
            method: method,
            data: data,
            header: header
        }
        for(var i in opt){
            if(option[i] !== undefined) continue
            option[i] = opt[i]
        }
        let rd = {}
        if(data === null) delete option['data']
        if(header === null) delete option['header']
        let res = await this._global.request(ser, option)
        if(!res || res.code != 0){
            if(!this._global.errorHandleSpecHandle(res.code, errorKey)){
                return {noError: true}
            }
        }
        return res
    }
    urlParse(url, opt){
        opt = opt || {}
        url = url || ''
        url = url.replace(new RegExp("{","gm"), "${")
        // url = url.replaceAll('{', '${')
        url = url.split('$')
        let rUrl = []
        for(var i in url){
            let tem = url[i] || ''
            if(tem.indexOf('{') > -1 && tem.indexOf('}') > -1){
                let funKey = tem.substring(tem.indexOf('{') + 1, tem.indexOf('}'))
                let params = ''
                // if(this[`${funKey}Get`]) params = this[`${funKey}Get`]()
                // else if(opt[funKey]) params = opt[funKey]

                if(opt[funKey]) params = opt[funKey]
                else if(this[`${funKey}Get`]) params = this[`${funKey}Get`]()
                if(params) tem = tem.replace(`{${funKey}}`, params)
            }
            rUrl.push(tem)
        }
        return rUrl.join('')
    }

    async noticeTimeout(opt){
        opt = opt || {}
        let timeout = opt.timeout || 1500
        this._global.MessageOpen(opt)
        return this._global.timeoutDefine(timeout)
    }

    async noticeByCodeConfirm(opt){
        opt = opt || {}
        let {buttons, message, code, key} = opt
        if(!message && code !== undefined){
            message = this._errorHand.getMsg(code, key)
        }
        buttons = buttons || [{name: '确定', label: 0}]
        let res = await this._global.leConfirm.default.open({
            message: message,
            button: buttons
        })
        return res
    }
}