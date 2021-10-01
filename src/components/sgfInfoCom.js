export default {
    name: 'sgfInfoCom',
    props: {
        theme: String,
        sgfInfo: Object,
        options: Object,
        remove: Object,
        edit: Boolean,
        reviewBoard: Boolean
    },
    data() {
        return {
            sgfInfoStatus: {
                edit: false
            },
            sgfInfoCopy: {},
            komiSelect: {
                data: [],
                value: null
            },
            resultSelect: {
                value: null,
                data: []
            },
            computerLevelSelect: {
                valueB: 0,
                valueW: 0,
                data: []
            },
        };
    },
    methods: {
        pageInit(){
            this.komiSelect.data = this.GLOBAL.deepCopy(this.GLOBAL.komi)
            this.komiSelect.value = 7.5
            this.resultSelect.data = this.GLOBAL.deepCopy(this.GLOBAL.resultSelect)
            this.resultSelect.value = 'N+R'
            this.computerLevelInit()
        },
        pageSelectInit(){

        },
        openSgfInfoEdit(){
            this.sgfInfoCopy = this.GLOBAL.deepCopy(this.sgfInfo)
            this.openEditKmCheck()
            this.openEditReCheck()
            this.sgfInfoEditOn()
            this.sgfLevelInit()
        },
        openEditKmCheck(){
            let km = this.sgfInfoCopy.km.value
            let data = this.komiSelect.data
            if(isNaN(Number(km)) || km == null || km == undefined) return
            for(var i in data){
                if(data[i].value == km){
                    this.komiSelect.value = km
                    // this.sgfInfoCopy.km.label = data[i].label
                    break
                }
            }
        },
        openEditReCheck(){
            let re = this.sgfInfoCopy.re.value
            let data = this.resultSelect.data
            if(re == null || re == undefined) return
            for(var i in data){
                if(data[i].value == re || data[i].label == re){
                    this.resultSelect.value = data[i].value
                    // this.sgfInfoCopy.re.label = data[i].label
                    break
                }
            }
        },
        saveSgfInfoEdit(){
            let sgfInfo = this.sgfInfoCopy
            sgfInfo.km.value = this.komiSelect.value
            sgfInfo.re.value = this.resultSelect.value
            sgfInfo.br.value = this.computerLevelSelect.valueB
            sgfInfo.wr.value = this.computerLevelSelect.valueW
            this.$emit('takeFun', {
                fun: 'saveSgfInfoEdit',
                data: this.GLOBAL.deepCopy(sgfInfo)
            })
            this.sgfInfoEditOff()
        },
        cancelSgfInfoEdit(){
            this.sgfInfoEditOff()
        },
        sgfInfoEditOn(){
            this.sgfInfoStatus.edit = true
        },
        sgfInfoEditOff(){
            this.sgfInfoStatus.edit = false
        },
        computerLevelInit(){
            let level = this.GLOBAL.deepCopy(this.GLOBAL.computerLevel)
            let data = []
            for(var i in level){
                if(!level[i].sgf) continue
                data.push(level[i])
            }
            this.computerLevelSelect.data = data
            this.sgfInfoChange()
        },
        sgfInfoChange(newVal){
            this.sgfLevelInit()
        },
        sgfLevelInit(){
            if(this.computerLevelSelect.data.length <= 0) return
            let lb = this.sgfInfoCopy.br.value
            let lw = this.sgfInfoCopy.wr.value
            let lbl = this.levelChangeHandle(lb)
            let lwl = this.levelChangeHandle(lw)
            this.computerLevelSelect.valueB = lbl.value
            this.computerLevelSelect.valueW = lwl.value
        },
        levelChangeHandle(level){
            let computerLevel = this.computerLevelSelect.data
            let rLevel = computerLevel[computerLevel.length - 1]
            if(level == '' || level == undefined) return rLevel
            let key = isNaN(Number(level)) ? 'label' : 'value'
            for(var i in computerLevel){
                if(computerLevel[i][key] == level){
                    rLevel = computerLevel[i]
                    break
                }
            }
            return rLevel
        },
        dtChange(val){
            let data = this.GLOBAL.getTimeNow(val)
            this.sgfInfoCopy.dt.value = data
        }
    },
    
    created() {
        this.pageInit()
    },
    components: {
    },
    computed: {
        culGn(){
            if(!this.sgfInfo.gn.value) return '棋谱名'
            return this.sgfInfo.gn.value
        },
        culKomi(){
            let data = null
            if(this.sgfInfo.ha.value && this.sgfInfo.ha.value > 0){
                if(!isNaN(Number(this.sgfInfo.ha.value))) data = `${this.sgfInfo.ha.value / 2}子`
            }
            if(!data){
                let komi = this.GLOBAL.komi
                for(var i in komi){
                    if(komi[i].value == this.sgfInfo.km.value){
                        data = komi[i].label
                        break
                    }
                }
                if(!data) data = this.sgfInfo.km.value
            }
            return data
        },
        culResult(){
            let result = this.sgfInfo.re.value
            if(!result) return '无胜负'
            result = this.GLOBAL.parseResultSelect(result)
            return result.label
        },
        culPb(){
            if(!this.sgfInfo.pb.value) return '黑方'
            return this.sgfInfo.pb.value
        },
        culPw(){
            if(!this.sgfInfo.pw.value) return '白方'
            return this.sgfInfo.pw.value
        },
        culBr(){
            // let data = this.computerLevelSelect.data
            // let value = this.computerLevelSelect.valueB
            // let level = '无等级'
            // for(var i in data){
            //     if(data[i].value == value){
            //         level = data[i].label
            //         break
            //     }
            // }
            let level = this.sgfInfo.br.value
            let br = this.levelChangeHandle(level)
            // if(br.value == 0) return '段位'
            return br.label
        },
        culWr(){
            let level = this.sgfInfo.wr.value
            let wr = this.levelChangeHandle(level)
            // if(wr.value == 0) return '段位'
            return wr.label
        },
        culRemoveB(){
            if(!this.remove || !this.remove.w) return 0
            return this.remove.w
            // if(!this.sgfInfo.remove || this.sgfInfo.remove.w) return 0
            // return this.sgfInfo.remove.w
        },
        culRemoveW(){
            if(!this.remove || !this.remove.b) return 0
            return this.remove.b
            // if(!this.sgfInfo.remove || this.sgfInfo.remove.b) return 0
            // return this.sgfInfo.remove.b
        },
        culWinrate(){
            if(!this.options || !this.options.winrate) return {
                b: {
                    style: {width: '50%'},
                    data: 50
                },
                w: {
                    style: {width: '50%'},
                    data: 50
                },
            }
            let b = (this.options.winrate.b * 100).toFixed(1)
            let w = (100 - b).toFixed(1)
            let data = {
                b: {
                    style: {width: `${b}%`},
                    data: b
                },
                w: {
                    style: {width: `${w}%`},
                    data: w
                }
            }
            return data
        },
        winrateW(){
            if(!this.options || !this.options.winrate) return {width: '50%'}
            let data = {width: `${(this.options.winrate.w * 100).toFixed(1)}%`}
            return data
        },
        editPb(){
        }
    },
    watch: {
        sgfInfo: {
            handler(newVal){
                this.sgfInfoCopy = newVal
                this.sgfInfoChange()
                // if(newVal && newVal.km != undefined){
                //     if(newVal.ha && newVal.ha > 0)
                // }
            },
            immediate: true,
            deep: true
        },
        reviewBoard: {
            handler(val){
            },
            immediate: true
        },
        sgfInfoStatus: {
            handler(newVal){
                // this.sgfInfoCopy = this.sgfInfoStatus.edit ? this.GLOBAL.deepCopy(this.sgfInfo) : {}
            },
            immediate: true,
            deep: true
        }
    },
    mounted() {},
    beforeCreate() {}, //生命周期 - 创建之前
    beforeMount() {}, //生命周期 - 挂载之前
    beforeUpdate() {}, //生命周期 - 更新之前
    updated() {}, //生命周期 - 更新之后
    beforeDestroy() {}, //生命周期 - 销毁之前
    destroyed() {}, //生命周期 - 销毁完成
    activated() {}, //如果页面有keep-alive缓存功能，这个函数会触发
}