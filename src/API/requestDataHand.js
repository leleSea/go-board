

export default class requestHand{
    constructor(opt){
        opt = opt || {}
        let localKey = 'requestData'
        this.requestCache = {}
        this.minTime = 10
        this.cacheUrlData = ['/items/bonus/check', '/activities/available']
    }
    getKey(url, data){
        data = data || {}
        data = JSON.stringify(data)
        let key = `${url}:${data}`
        return key
    }
    checkUrl(url){
        let f = false, list = this.cacheUrlData
        for(var i in list){
            if(url.indexOf(list[i]) > -1){
                f = true
                break
            }
        }
        return f
    }
    setRequest(url, data, res){
        if(!this.checkUrl(url)) return false
        let key = this.getKey(url, data)
        let timeNow = parseInt((new Date()).getTime() / 1000)
        this.requestCache[key] = {
            time: timeNow,
            res: res
        }
    }
    checkRequest(url, data, noCache){
        if(!this.checkUrl(url)) return false
        if(noCache) return false
        let key = this.getKey(url, data)
        let dataCache = this.requestCache[key] || {}
        let time = dataCache.time || 0
        let timeNow = parseInt((new Date()).getTime() / 1000)
        let res = null
        if(timeNow - time < this.minTime) res = dataCache.res
        else this.requestCache[key] = null
        return res
    }
}