
import localDataControl from '../localDataControl'
import global from '@/global'

export default class komi{
    constructor(opt){
        this._global = global
        this._appData = new localDataControl({
            key: 'game'
        })
        this.init(opt)
        this.listInit()
    }
    init(opt){
        opt = opt || {}
        for(let i in opt){
            this[i] = opt[i]
        }
        if(!this.rule) this.maxRange = 0
        else{
            let {max, min} = this._appData.getStoreItemByCom(`komiRange_${this.rule}`)
            this.maxRange = max
            this.minRange = min
        }
        this.unit = this._appData.getStoreItemByCom(`komiUnit_${this.rule}`)
    }
    setRule(rule){
        if(!rule) return
        this.rule = rule
    }
    listInit(){
        let {maxRange, unit, rule} = this
        let rd = []
        let r = this._appData.getStoreItemByCom(`komiInit_${rule}`)
        if(!r) return rd
        rd.push({
            value: 0, label: `0${unit}`, name: `黑贴0${unit}`, cul: 0
        })
        let komi = r
        while(komi <= maxRange){
            rd.push({
                cul: -komi,
                value: this.valueParse(-komi),
                name: `白贴${this.nameParse(komi)}${unit}`,
            })
            rd.unshift({
                cul: komi,
                value: this.valueParse(komi),
                name: `黑贴${this.nameParse(komi)}${unit}`
            })
            komi = komi + r
        }
        this.list = rd
    }
    valueParse(komi){
        return this.rule == 'chinese' ? komi * 2 : komi
    }
    nameParse(komi){
        return this.rule == 'chinese' ? this._global.decimalsToFractional(komi) : komi
    }
    isChinese(){
        return this.rule == 'chinese'
    }
    isJapanese(){
        return this.rule == 'japanese'
    }
    getKomiLabel(komi, rule){
        this.setRule(rule)
        komi = Math.abs(komi)
        if(this.isChinese()) return this._global.decimalsToFractional(komi) + '子'
        return komi + '目'
    }
}