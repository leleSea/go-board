
import commonApi from './common'


export default class enginePlan extends commonApi{
    constructor(){
        let localKey = 'engine_plan'
        super({localKey: localKey})
    }
    async getLdpInitPlanId(){
        console.log(this._global)
        let res = await this._global.getLdpInitPlanId()
        if(res && res.code == 0){
            let data = res.data
            if(!this._global.isArray(data)) return data
            let rd = null
            for(var i in data){
                if(data[i].price == 0){
                    rd = data[i]
                    break
                }
            }
            return rd
        }
        return false
    }
}
