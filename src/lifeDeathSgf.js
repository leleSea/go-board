import global from './global'
import appData from './localDataControl'

export default class lifeDeathSgf{
    constructor(opt){
        this._appData = new appData('lifeDeathData')
        this.username = opt.username || this._appData.getStoreItem('username')
    }
    getLifeDeathSgfList(){
        
    }
}