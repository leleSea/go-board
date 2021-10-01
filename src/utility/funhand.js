export default class funHand{
    constructor(opt){
        this.init(opt)
    }
    init(opt){
        opt = opt || {}
        for(var i in opt){
            this[i] = opt[i]
        }
    }
    funhandAct(list){
        list = this.GLOBAL.deepCopy(list)
        let rd = []
        let normal = []
        let extend = []
        for(var i in list){
            if(list[i].selectedCul && this[list[i].selectedCul] !== undefined) list[i].selected = this[list[i].selectedCul]
            if(list[i].disabledCul && this[list[i].disabledCul] !== undefined) list[i].isDisabled = this[list[i].disabledCul]
            if(list[i].popoverCul && this[list[i].popoverCul] !== undefined) list[i].popover = this[list[i].popoverCul]
            if(list[i].difineTemplate && this[list[i].difineTemplate] !== undefined) list[i].template = this[list[i].difineTemplate]
            if(list[i].nameReset && this[list[i].nameReset] !== undefined) list[i].name = this[list[i].nameReset]
            if(list[i].sizeCul && this[list[i].sizeCul] !== undefined) list[i].size = this[list[i].sizeCul]
            if(list[i].btnClassCul && this[list[i].btnClassCul] !== undefined) list[i].btnClass = this[list[i].btnClassCul]
            if(list[i].boxClassCul && this[list[i].boxClassCul] !== undefined) list[i].boxClass = this[list[i].boxClassCul]
            if(list[i].boxClassCul &&  this[list[i].boxClassCul] !== undefined) list[i].boxClass = this[list[i].boxClassCul]
            if(list[i].loadingCul && this[list[i].loadingCul] !== undefined) list[i].loading = this[list[i].loadingCul]
            else list[i].size = 1
            if(list[i].sortCul && this[list[i].sortCul] !== undefined) list[i].sort = this[list[i].sortCul]
            else list[i].sort = i
            if(list[i].iconCul && this[list[i].iconCul] !== undefined) list[i].icon = this[list[i].iconCul]
            if(list[i].nameCul &&  this[list[i].nameCul] !== undefined) list[i].name = this[list[i].nameCul]
            if(list[i].propNumCul &&  this[list[i].propNumCul] !== undefined) list[i].propNum = this[list[i].propNumCul]
            if(list[i].funIconDefine &&  this[list[i].funIconDefine] !== undefined) list[i].funIconCul = this[list[i].funIconDefine]
            if(list[i].clickToOpenCul &&  this[list[i].clickToOpenCul] !== undefined) list[i].clickToOpen = this[list[i].clickToOpenCul]
            
            if(list[i].display && this[list[i].display] !== undefined){
                if(!this[list[i].display]) continue
            }

            if(list[i].extendList && list[i].extendList.length){
                let extendList = []
                for(var j in list[i].extendList){
                    if(list[i].extendList[j].selectedCul && this[list[i].extendList[j].selectedCul] !== undefined) list[i].extendList[j].selected = this[list[i].extendList[j].selectedCul]
                    if(list[i].extendList[j].disabledCul && this[list[i].extendList[j].disabledCul] !== undefined) list[i].extendList[j].isDisabled = this[list[i].extendList[j].disabledCul]
                    if(list[i].extendList[j].popoverCul && this[list[i].extendList[j].popoverCul] !== undefined) list[i].extendList[j].popover = this[list[i].extendList[j].popoverCul]
                    if(list[i].extendList[j].difineTemplate && this[list[i].extendList[j].difineTemplate] !== undefined) list[i].extendList[j].template = this[list[i].extendList[j].difineTemplate]
                    if(list[i].extendList[j].nameReset && this[list[i].extendList[j].nameReset] !== undefined) list[i].extendList[j].name = this[list[i].extendList[j].nameReset]
                    if(list[i].extendList[j].sizeCul && this[list[i].extendList[j].sizeCul] !== undefined) list[i].extendList[j].size = this[list[i].extendList[j].sizeCul]
                    if(list[i].extendList[j].btnClassCul && this[list[i].extendList[j].btnClassCul] !== undefined) list[i].extendList[j].btnClass = this[list[i].extendList[j].btnClassCul]
                    if(list[i].extendList[j].boxClassCul && this[list[i].extendList[j].boxClassCul] !== undefined) list[i].extendList[j].boxClass = this[list[i].extendList[j].boxClassCul]
                    if(list[i].extendList[j].boxClassCul &&  this[list[i].extendList[j].boxClassCul] !== undefined) list[i].extendList[j].boxClass = this[list[i].extendList[j].boxClassCul]
                    if(list[i].extendList[j].loadingCul && this[list[i].extendList[j].loadingCul] !== undefined) list[i].extendList[j].loading = this[list[i].extendList[j].loadingCul]
                    else list[i].extendList[j].size = 1
                    if(list[i].extendList[j].iconCul && this[list[i].extendList[j].iconCul] !== undefined) list[i].extendList[j].icon = this[list[i].extendList[j].iconCul]
                    if(list[i].extendList[j].nameCul &&  this[list[i].extendList[j].nameCul] !== undefined) list[i].extendList[j].name = this[list[i].extendList[j].nameCul]
                    if(list[i].extendList[j].propNumCul &&  this[list[i].extendList[j].propNumCul] !== undefined) list[i].extendList[j].propNum = this[list[i].extendList[j].propNumCul]
                    if(list[i].extendList[j].funIconDefine &&  this[list[i].extendList[j].funIconDefine] !== undefined) list[i].extendList[j].funIconCul = this[list[i].extendList[j].funIconDefine]
                    if(list[i].extendList[j].display && this[list[i].extendList[j].display] !== undefined){
                        if(!this[list[i].extendList[j].display]) continue
                    }
                    extendList.push(list[i].extendList[j])
                }
                list[i].extendList = extendList
            }


            rd.push(list[i])
            if(list[i].clickToOpen) extend.push(1)
            else normal.push(1)
        }
        if(extend.length && (normal.length + 1) >  extend.length){
            let l = normal.length - extend.length + 1
            for(var i = 1; i <= l; i++){
                rd.push({name: '', fun: '', clickToOpen: true})
            }
        }
        rd = this.GLOBAL.sortData(rd, (v1, v2) => {
            return Number(v1.sort) < Number(v2.sort)
        })
        return rd
    }
    paramsSet(obj, values){
        values = values || {}
        for(var i in values){
            this.$set(obj, i, values[i])
        }
    }
    nextTick(){
        return new Promise(res => {
            this.$nextTick(() => {
                res(true)
            })
        })
    }
    getNickname(){
        return this.$store.state.nickname
    }
}
