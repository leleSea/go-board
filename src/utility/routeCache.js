import commonApi from '../API/common'
import { from } from 'core-js/fn/array'

export default class game extends commonApi{
    constructor(opt){
        opt = opt || {}
        let localKey = 'routeCache'
        super({localKey: localKey})
        this.init(opt)
    }
    init(opt){
        this.cacheList = {
            '/engine/store/purchase/peripheral': 'storePeripheral'
        }
    }
    setCache(path){
        let list = this.cacheList
        let key = null
        for(var i in list){
            if(path.indexOf(i) > -1){
                key = list[i]
                break
            }
        }
        if(!key) key = path
        let setItems = {}
        setItems[key] = path
        this._appData.setStoreItemByCom(setItems)
    }
    getCache(path){
        let list = this.cacheList
        let key = null
        for(var i in list){
            if(path.indexOf(i) > -1){
                key = list[i]
                break
            }
        }
        if(!key) key = path
        let realPath = this._appData.getStoreItemByCom(key)
        if(!realPath) realPath = path
        return realPath
    }
    getPathWithoutParams(data){
        let {path, params} = data
        path = path || ''
        params = params || {}
        for(let i in params){
            let val = params[i]
            path = path.replace(`/${val}`, '')
        }
        return path
    }
    setHistory(to, from){
        if(!this._global.isObject(to) || !this._global.isObject(from)) return
        let toPath = to.path, fromPath = from.path
        let toParams = to.params || {}, fromParams = from.params || {}
        toPath = this.getPathWithoutParams({path: toPath, params: toParams})
        fromPath = this.getPathWithoutParams({path: fromPath, params: fromParams})
        if(toPath == fromPath) return
        if(fromPath.indexOf('login') > -1) return
        let his = this._appData.getStoreItemByCom('history') || {}
        his[toPath] = fromPath
        this._appData.setStoreItemByCom({
            history: his
        })
    }
    getHistory(pathData){
        let path = this.getPathWithoutParams(pathData)
        let his = this._appData.getStoreItemByCom('history') || {}
        console.log(this._global.deepCopy(his))
        console.log(path)
        path = path || ''
        let data = null
        for(var i in his){
            if(i == path){
                data = his[i]
                break
            }
        }
        console.log(data)
        return data
    }
}