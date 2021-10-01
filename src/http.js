import axios from 'axios'
import errorMsgCopy from './assets/errorMsg.js'
import 'url-search-params-polyfill'
import resHandClass from './API/requestDataHand'
// import localData from './localData.js';
let __ERRORMSGDEFINE
try {
    __ERRORMSGDEFINE = window.__ERRORMSG
} catch (e) {
    __ERRORMSGDEFINE = {
        errorMsg: errorMsgCopy
    }
}
export default class http {
    constructor(url) {
        this._resCache = new resHandClass()
        this.url = url;
        this.logApi = '/logApi'
        this.CQApi = '/testApiCQ'
        this.retryMax = 3
        // this.userApi = '/userApi'
        // this.engineApi = '/engineApi'
        this.MT = '/MT'
        this.socket = '/socket'

        this.userApi = '/api/auth' // www.19x19.com:8083
        this.engineApi = '/api/engine' // www.19x19.com:8084
        this.classApi = '/api/training' // www.19x19.com:8085
        this.gameApi = '/api/game' //https://222.74.63.156:8089
        this.schoolApi = '/api/school' // http://www.19x19.com:8081
        this.socialApi = '/api/social' //http://www.19x19.com:8081
        this.ldpApi = '/api/lifeai'
        this.liveApi = '/api/live' 
    }
    headersHand(options){
        options = options || {}
        options.headers = options.headers || {}
        let contentType = 'application/x-www-form-urlencoded; charset=UTF-8'
        if(options.headers['Content-Type']) contentType = options.headers['Content-Type']
        options.headers['Content-Type'] = contentType
        return options
    }
    request(type, options) {
        if (options.uploadFile) return this.requestUpload(type, options)
        options.data = options.data || {}
        options.msgKey = options.msgKey || options.url
        options = this.headersHand(options)
        if (options.method != 'GET' && options.method != 'get' && !options.requestBody) {
            // let params = new URLSearchParams();
            // for (var i in options.data) {
            //     params.append(i, options.data[i])
            // }
            // options.data = params;

            let contentType = options.headers['Content-Type']
            console.log(contentType)
            if(contentType != 'application/json;charset=UTF-8'){
                let params = new URLSearchParams();
                for(var i in options.data){
                    params.append(i, options.data[i])
                }
                options.data = params;
            }else{
                console.log('to string')
                options.data = JSON.stringify(options.data)
            }
        } else {
            let sendData = '?'
            for (var i in options.data) {
                sendData = sendData + i + '=' + options.data[i] + '&'
            }
            sendData = sendData.substring(0, sendData.length - 1)
            options.url = options.url + sendData
        }
        options.method = options.method || 'post'
        options.timeout = options.timeout || 0

        return this[type + 'SendCode'](options)
            .then(res => {
                return res
            })
    }
    requestUpload(type, options) {
        options.data = options.data || {}
        options.msgKey = options.msgKey || options.url
        let file = options.file;
        let param = new FormData();
        if (Object.prototype.toString.call(file) != '[object Array]') {
            file = [{
                key: 'file',
                data: file
            }]
        }
        for (var i in file) {
            param.append('file', file[i].data, file[i].data.name);
        }
        if (options.extendParams) {
            for (var i in options.extendParams) {
                param.append(i, options.extendParams[i])
            }
        }
        options.data = param;
        // options.headers = {'Content-Type':'multipart/form-data'}
        options.method = options.method || 'post'
        options.timeout = options.timeout || 0
        return this[type + 'SendCode'](options)
            .then(res => {
                return res
            })
    }
    // async logSendCode(options){
    //     options.url = this.logApi + options.url
    //     options.msgKey = '/logApi' + options.msgKey
    //     let res = await this.sendCode(options)
    //     return res
    // }
    async MTSendCode(options) {
        options.url = this.MT + options.url
        options.msgKey = '' + options.msgKey
        let res = await this.sendCode(options)
        return res
    }
    async socketSendCode(options) {
        options.url = this.socket + options.url
        options.msgKey = '' + options.msgKey
        let res = await this.sendCode(options)
        return res
    }
    async classSendCode(options) {
        options.url = this.classApi + options.url
        options.msgKey = '/class' + options.msgKey
        let res = await this.sendCode(options)
        return res
    }
    async userSendCode(options) {
        options.url = this.userApi + options.url
        options.msgKey = '/userApi' + options.msgKey
        let res = await this.sendCode(options)
        return res
    }
    async engineSendCode(options) {
        options.url = this.engineApi + options.url
        options.msgKey = '/engineApi' + options.msgKey
        let res = await this.sendCode(options)
        return res
    }
    async gameSendCode(options) {
        options.url = this.gameApi + options.url
        options.msgKey = '/gameApi' + options.msgKey
        let res = await this.sendCode(options)
        return res
    }
    async schoolSendCode(options) {
        options.url = this.schoolApi + options.url
        options.msgKey = '/schoolApi' + options.msgKey
        let res = await this.sendCode(options)
        return res
    }
    async socialSendCode(options) {
        options.url = this.socialApi + options.url
        options.msgKey = '/socialApi' + options.msgKey
        let res = await this.sendCode(options)
        return res
    }

    async ldpSendCode(options){
        options.url = this.ldpApi + options.url
        options.msgKey = '/ldpApi' + options.msgKey
        let res = await this.sendCode(options)
        return res
    }

    async liveSendCode(options){
        options.url = this.liveApi + options.url
        options.msgKey = '/liveApi' + options.msgKey
        let res = await this.sendCode(options)
        return res
    }

    async CQSendCode(options) {

        options.url = this.CQApi + options.url
        options.msgKey = '/testApiCQ' + options.msgKey
        let res = await this.sendCode(options)
        return res
    }
    async staticSendCode(options) {
        // options.url = options.url
        let opt = {}
        for (var i in options) {
            if (i == 'path') continue
            opt[i] = options[i]
        }
        let res = await axios.get(options.path, opt)
        // options.msgKey = '/engineApi' + options.msgKey
        // let res = await this.sendCode(options)
        if (res.status !== 200) return false
        return res.data
    }
    async sendCode(options) {
        options.msgKey = options.msgKey || options.url
        let res = await this.sendCodeAction(options)
            .then(res => {
                if (!options.downloadFile) {
                    try {
                        res.data = JSON.parse(res.data)
                    } catch (e) {}
                }
                if (res.status) {
                    if (!VARHANDLE.isObject(res.data)) res.data = {
                        data: res.data
                    }
                    if (res.status == 200) {
                        res.data.headers = res.headers
                        if (res.data.code === undefined) res.data.code = 0
                    }
                    if (res.status != 200) res.data.code = res.status
                    return res
                } else {
                    return {
                        code: -1,
                        msg: __ERRORMSGDEFINE.errorMsg.main.timeout,
                    }
                }

            }).catch(err => {
                options.msgKey = 'main'
                return {
                    data: {
                        code: -1,
                        data: ''
                    }
                }
            })
        // let res = await axios(options).then(res => {
        //     try{
        //         res.data = JSON.parse(res.data)
        //     }catch(e){}
        //     if(res.status == 200 && res.data.code === undefined) res.data.code = 0
        //     return res
        // })
        // .catch(err => {
        //     options.msgKey = 'main'
        //     return {
        //         data: {
        //             code: -1,
        //             data: ''
        //         }
        //     }
        // })
        return this.reply(res.data, options.msgKey)
    }
    async sendCodeAction(options) {
        // options.msgKey = options.msgKey || options.url
        let {url, data, noCache} = options
        if(noCache) console.log('no cache')
        let resCac = this._resCache.checkRequest(url, data, noCache)
        if(resCac) return resCac
        let res = await axios(options)
        if(res) this._resCache.setRequest(url, data, res)
        return res
    }
    reply(data, key) {
        key = key || 'main'
        data.errorMsg = ''
        if (__ERRORMSGDEFINE.errorMsg[key] && __ERRORMSGDEFINE.errorMsg[key][data.code]) {
            data.errorMsg = __ERRORMSGDEFINE.errorMsg[key][data.code];
        } else if (__ERRORMSGDEFINE.errorMsg[key] && __ERRORMSGDEFINE.errorMsg[key][data.msg]) {
            data.errorMsg = __ERRORMSGDEFINE.errorMsg[key][data.msg]
        } else {
            data.errorMsg = data.msg
        }
        return data;
    }
    async responseHandle(opt, res) {
        if (res.status == 200) return res
        return this.retry(opt, 0, res => {
            return res
        })
    }
    async retry(opt, num, callback) {
        num = num || 0
        let res = this.sendCodeAction(opt)
        if (res && res.status == 200) {
            callback(res)
            return
        }
        num++
        if (num > this.retryMax) {
            callback(res)
            return
        }
        setTimeout(() => {
            this.retry(opt, num, callback)
        }, 1000)
    }
}