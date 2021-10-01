import localDataControl from '../localDataControl'

export default class gameConfig{
    constructor(){
        this._appData = new localDataControl({
            key: 'game_config'
        })
    }
    setItem(items){
        this._appData.setItem(items)
    }
    getItem(key){
        return this._appData.getItem(key)
    }
    removeItem(item){
        this._appData.removeItem(item)
    }
    removeAll(){
        this._appData.removeAll()
    }
}
