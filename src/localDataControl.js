import localData from './localData'
import global from './global'
import store from './store'

export default class localDataControl{
    constructor(opt){
        opt = opt || {}
        this.GLOBAL = global
        this.localData = localData
        this.localKey = opt.key
    }
    setKey(key){
        if(!key) return
        this.localKey = key
    }
    getData(key){
        key = key || this.localKey
        let data = this.localData.getItem(this.localKey)
        try{
            data = JSON.parse(data)
        }catch(e){
            data = {}
        }
        data = data || {}
        return data
    }
    setItem(opt, key){
        key = key || this.localKey
        let data = this.localData.getItem(key)
        try{
            data = JSON.parse(data)
        }catch(e){
            data = {}
        }
        data = data || {}
        let saveData = {}
        
        if(!this.GLOBAL.isObject(opt)){
            if(!this.GLOBAL.isString(opt)) data = JSON.stringify(opt)
        }else{
            for(var i in opt){
                data[i] = opt[i]
            }
            data = JSON.stringify(data)
        }
        saveData[key] = data
        this.localData.setItem(saveData)
    }
    getAll(key){
        key = key || this.localKey
        let data = this.localData.getItem(key)
        try{
            data = JSON.parse(data)
        }catch(e){
            data = {}
        }
        return data
    }
    getItem(key){
        let data = this.localData.getItem(this.localKey)
        try{
            data = JSON.parse(data)
        }catch(e){
            data = {}
        }
        data = data || {}
        return data[key]
    }
    removeAll(key){
        key = key || this.localKey
        let item = {}
        item[key] = true
        this.localData.removeItem(item)
    }
    removeItem(items, key){
        key = key || this.localKey
        let data = this.localData.getItem(key)
        try{
            data = JSON.parse(data)
        }catch(e){
            data = {}
        }
        data = data || {}
        let removeItems = {}
        if(this.GLOBAL.isObject(items)) removeItems = items
        else{
            removeItems[items] = true
        }
        for(var i in removeItems){
            delete data[i]
        }
        this.removeAll()
        this.setItem(data)
    }

    //vuex
    getAllDataByKey(key){
        key = key || this.localKey
        return store.state[key] || {}
    }
    setStoreItemByCom(items, key){
        items = items || {}
        key = key || this.localKey
        let data = this.getAllDataByKey(key)
        for(var i in items){
            data[i] = items[i]
        }
        let setData = {}
        setData[key] = data
        store.dispatch('setItem', setData)
    }
    removeStoreItemByCom(items, key){
        items = items || {}
        key = key || this.localKey
        let data = this.getAllDataByKey(key)
        let rd = {}
        for(var i in items){
            if(data[i] !== undefined) delete data[i]
        }
        this.removeAllStore(key)
        let setData = {}
        setData[key] = data
        this.setStoreItem(setData)
    }
    removeAllStore(key){
        key = key || this.localKey
        let data = {}
        data[key] = true
        store.dispatch('removeItem', data)
    }
    getStoreItemByCom(dataKey, key){
        key = key || this.localKey
        let data = this.getAllDataByKey(key)
        return data[dataKey]
    }



    setStoreItem(items) {
        store.dispatch('setItem', items)
    }
    removeStoreItem(items) {
        store.dispatch('removeItem', items)
    }
    getStoreItem(key){
        return store.state[key]
    }


    getRootItem(key){
        return this.localData.getItem(key)
    }
    setRootItem(items){
        return this.localData.setItem(items)
    }
    removeRootItem(items){
        return this.localData.removeItem(items)
    }
}
