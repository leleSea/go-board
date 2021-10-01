<!--  -->
<template>
    <div class='prob-purchase-panel prob-7003'>
        <le-confirm ref="leConfirm">
            <template v-slot:message v-if="probInfoCul.name">
                <div class="balance-box">
                    <div class="balance-not-enough">
                        <div class="message">
                            <span class="txt">
                            {{ $t('您的') }}
                            <img :src="`${GLOBAL.assetsUrl}/img/${probInfoCul.icon}.png`" class="notice-icon">
                            {{`${$t(probInfoCul.name)}${$t('道具已用尽')} `}}</span>
                            <span class="extend-txt txt" v-if="extendTxtCul" v-html="$t(extendTxtCul)"></span>
                            <el-button class="le-button recharge-btn recharge-button" type="text" @click="gotoRecharge" v-if="rechargeBtnDisplay">
                                <span class="txt">{{ $t('充值') }}</span>
                            </el-button>
                        </div>
                    </div>
                </div>
                <div class="get-prob-type" v-if="selecteNow">
                    <div class="purchase-7003">
                        <div class="purchase-item">
                            <propItem ref="propItem" :icon="probIcon" :name="selecteNow.name" :num="selecteNow.num"></propItem>
                            <div class="item-price" v-if="selecteNow && selecteNow.price">
                                <span class="txt">￥{{selecteNow.price}}</span>
                            </div>
                        </div>
                        <div class="purchase-fun">
                            <el-button :loading="actionLoading" :disabled="selecteNow.btnDisabled" class="le-button confirm store-button-bcg" @click="selecteNow.btnFun">{{$t(selecteNow.btnName)}}</el-button>
                        </div>
                    </div>
                </div>
                
            </template>
        </le-confirm>
    </div>
</template>

<script>
    import propItem from '../views/store/propItem.vue'

    export default {
        name: 'prob7003',
        props: {
            username: String
        },
        data() {
            return {
                actionLoading: false,
                response: null,
                probList: [],
                probKey: null,
                balance: 0,
                probInfo: null,
                activity: {
                    data: null,
                    active: false
                },
                sign: {
                    data: null,
                    active: false
                },
                purchase: {
                    data: null,
                    active: false
                },
                openFun: null
            };
        },
        methods: {
            close(){
                this.$refs['leConfirm'].close()
            },
            cancel(){
                this.returnByRes(false)
            },
            returnByRes(res){
                this.close()
                this.responseAction(res)
            },
            responseAction(res){
                if(this.response) this.response(res)
            },
            open(probKey){
                let promise = new Promise((success) => {
                    this.probKey = probKey || 'area'
                    this.response = success
                    this.openBefore()
                    this.checkType().then(fun => {
                        if(this[`${fun}Open`]){
                            this.openFun = fun
                            this[`${fun}Open`]()
                            this.$refs['leConfirm'].open({
                                button: [
                                    {name: '取消', label: 1, type: 'cancel'}
                                ]
                            }).then(res => {
                                this.cancel()
                            })
                            
                        }
                    })
                })
                return promise
            },
            openBefore(){
                this.activity = {
                    data: null,
                    active: false
                }
                this.sign = {
                    data: null,
                    active: false
                }
                this.purchase = {
                    data: null,
                    active: false
                }
                this.probList = []
                this.actionLoading = false
            },
            activityOpen(){
                if(!this.activity.data) return
                this.activity.active = true
            }, 
            signOpen(){},
            async purchaseOpen(){
                let res = await this.userBalanceInit()
                res = await this.GLOBAL.getStoreListProps()
                if(res && res.code == 0){
                    this.probList = res.data
                }
            },




            async pageInit(){
                this.purchaseProb()
            },
            async purchaseProb(){
                let res = await this.GLOBAL.getStoreListProps()
                if(res && res.code == 0){
                    this.probList = res.data
                    this.$refs['leConfirm'].open({
                        button: [
                            {name: '取消', label: 1, type: 'cancel'}
                        ]
                    })
                }
            },
            async purchaseProbAction(){
                let data = this.selecteNow
                if(!data || data.id == undefined || !this.username) return false
                this.LOADING.open()
                let res = await this.GLOBAL.propBuy(data.id, this.username)
                if(res && res.code == 0){
                    let msg = this.$i18n.t('购买成功！')
                    try{
                        msg = this.errorMsg.main['purchase success']
                    }catch(e){}
                    this.GLOBAL.MessageOpen({
                        message: msg,
                        type: 'success'
                    })
                }
                this.LOADING.close()
                return res
            },
            async codeHandle7003(errKey, res){
                let key = 'default'
                if(!errKey || !this.GLOBAL.propsIcon[errKey]) return
                let icon = this.propsIcon[errKey].icon
                let name = this.propsIcon[errKey].name
                let index = this.propsIcon[errKey].sort - 1
                // let res = await this.havePropsGet()
                let msg = this.$i18n.t('请前往商城购买。')
                let gotoPath = `/engine/store/purchase/prop/${index}`
                let btnName = this.$i18n.t('去购买')
                if(res){
                    msg = this.$i18n.t('您还有未领取的道具。')
                    btnName = this.$i18n.t('去领取')
                    gotoPath = '/engine/activity'
                }
                let message = `
                    <div class="balance-not-enough">
                        <div class="message">
                            <span class="txt">
                            ${this.$i18n.t('您的')}
                            <img src="${this.assetsUrl}/img/${icon}.png" class="notice-icon" alt="">
                            ${this.$i18n.t(name)}${this.$i18n.t('道具已用尽')}，${msg}</span>
                        </div>
                    </div>
                `
                if(!this.leConfirm[key]) return
                this.leConfirm[key].open({
                    message: message,
                    button: [
                        {name: btnName, label: 0}
                    ]
                }).then(res => {
                    if(res && res.label == 0){
                        if(this.gotoStoreBefore){
                            this.gotoStoreBefore().then(res => {
                                this.jumpToPage(gotoPath)
                            })
                        }
                    } 
                })
            },
            async checkType(){
                let res = await this.GLOBAL.haveActivityByType('mixed')
                if(res){
                    this.activity.data = res
                    return 'activity'
                }
                res = await this.GLOBAL.userBonusCheck({noCache: true})
                if(res && res.code == 0 && res.data){
                    this.sign.data = res.data
                    return 'sign'
                }
                return 'purchase'
            },
            async userBalanceInit(){
                this.balance = 0
                let username = this.$store.state.username
                let res = await this.GLOBAL.getUserBalances(username)
                if(res && res.code == 0){
                    try{
                        res.data = JSON.parse(res.data)
                    }catch(e){}
                    this.balance = res.data.balance
                }
            },
            probIconGet(icon){
                if(this.GLOBAL.isArray(icon)) return icon
                return [icon]
            },
            getProbNameIcon(name){
                let propsIcon = this.GLOBAL.propsIconStore, reportIcon = this.GLOBAL.storeReportIcon
                let info = {}
                if(propsIcon[name]){
                    info.icon =  propsIcon[name].icon
                    info.name =  propsIcon[name].name
                }
                if(reportIcon[name]){
                    info.icon = reportIcon[name].icon
                    info.name = reportIcon[name].name
                }
                return info
            },
            async activityAction(){
                let data = this.selecteNow
                if(!data || !data.activity || data.activity.activity_id == undefined) return
                data = data.activity
                this.actionLoading = true
                let res = await this.GLOBAL.activityRe(data.activity_id)
                this.GLOBAL.errorHandle(res, 'activityReceive')
                if(res && res.code == 0){
                    this.returnByRes(true)
                    let msg = this.GLOBAL.getRequestMsg(res, 'activityReceive')
                    this.GLOBAL.MessageOpen({
                        message: msg,
                        type: 'success'
                    })
                }
                this.actionLoading = false
            },
            async signAction(){
                let data = this.selecteNow
                if(!data) return
                this.actionLoading = true
                let res = await this.GLOBAL.bonusEverydayByMessage()
                if(!res){
                    let msg = this.$i18n.t('今日已签到')
                    try{
                        msg = this.errorMsg.main['aleady sign']
                    }catch(e){}
                    this.MessageOpen({
                        message: msg,
                        type: 'info'
                    })
                    this.actionLoading = false
                    this.open()
                    return
                }
                this.returnByRes(true)
            },
            async purchaseAction(){
                let data = this.selecteNow
                if(!data || data.id == undefined) return
                this.actionLoading = true
                let res = await this.GLOBAL.propBuy(data.id)
                if(res && res.code == 0){
                    this.returnByRes(true)
                    let msg = this.$i18n.t('购买成功！')
                    try{
                        msg = this.errorMsg.propBuy['0']
                    }catch(e){}
                    this.GLOBAL.MessageOpen({
                        message: msg,
                        type: 'success'
                    })
                }
                this.actionLoading = false
            },
            gotoRecharge(){
                this.GLOBAL.gotoRecharge()
                this.cancel()
            },
        },
        created() {

        },
        components: {
            propItem
        },
        computed: {
            rechargeBtnDisplay(){
                let data = this.selecteNow
                if(!data || !data.recharge) return null
                return data.recharge
            },
            extendTxtCul(){
                let data = this.selecteNow
                if(!data || !data.extendTxt) return null
                return data.extendTxt
            },
            probInfoCul(){
                let name = this.probKeyCul
                let info = this.getProbNameIcon(name)
                return info
            },
            activityDataCul(){
                if(!this.activity.data) return null
                let data = this.GLOBAL.deepCopy(this.activity.data)
                let info = this.getProbNameIcon(data.bonusType)
                info.num = data.bonus
                if(data.bonusType == 'mixed') info.name = ''
                info.btnName = this.$i18n.t('领取')
                info.btnFun = this.activityAction
                info.extendTxt = `，${this.$i18n.t('可领取')}${data.name}`
                info.activity = data
                return info
            },
            signDataCul(){
                if(!this.sign.data) return null
                let info = this.getProbNameIcon('mixed')
                info.num = this.GLOBAL.bonusConfigNum
                info.name = ''
                info.btnName = this.$i18n.t('签到领取')
                info.btnFun = this.signAction
                info.extendTxt = `，${this.$i18n.t('可签到领取道具奖励')}`
                return info
            },
            purchaseDataCul(){
                let data = this.probListCul[this.probKeyCul]
                if(!data) return null
                data.btnName = this.$i18n.t('余额兑换')
                data.btnFun = this.purchaseAction
                data.extendTxt = `，${this.$i18n.t('可用余额兑换，当前余额')}￥${this.balance}`
                if(this.balance < data.price){
                    data.btnDisabled = true
                    data.recharge = true
                }
                return data
            },
            probKeyCul(){
                let probKey = this.probKey
                if(!probKey) return 'area'
                return this.probKey
            },
            selecteNow(){
                let fun = this.openFun
                if(!fun) return null
                let rd = this[fun]
                if(!rd || !this[`${fun}DataCul`]) return null
                return this[`${fun}DataCul`]
                // let data = this.probListCul[this.probKeyCul]
                // if(!data) return null
                // return data
            },
            probListCul(){
                let data = {}, propsIcon = this.GLOBAL.propsIconStore, reportIcon = this.GLOBAL.storeReportIcon
                if(this.probList && this.probList.length){
                    let list = this.probList
                    for(var i in list){
                        let name = list[i].name
                        if(propsIcon[name]){
                            list[i].icon = propsIcon[name].icon
                            list[i].name = propsIcon[name].name
                        }
                        if(reportIcon[name]){
                            list[i].icon = reportIcon[name].icon
                            list[i].name = reportIcon[name].name
                        }
                        data[name] = list[i]
                    }
                }
                return data
            },
            storeProbListCul(){
                let data = {}, propsIcon = this.GLOBAL.propsIconStore, reportIcon = this.GLOBAL.storeReportIcon
                if(this.probList && this.probList.length){
                    let list = this.probList
                    for(var i in list){
                        let name = list[i].name
                        if(propsIcon[name]){
                            list[i].icon = propsIcon[name].icon
                            list[i].name = propsIcon[name].name
                        }
                        if(reportIcon[name]){
                            list[i].icon = reportIcon[name].icon
                            list[i].name = reportIcon[name].name
                        }
                        data[name] = list[i]
                    }
                }
                return data
            },

            probIcon(){
                if(!this.selecteNow) return []
                let icon = this.selecteNow.icon
                if(!this.GLOBAL.isArray(icon)) icon = [icon]
                return icon 
            },
        },
        watch: {},
        mounted() {
        },
        beforeCreate() {}, //生命周期 - 创建之前
        beforeMount() {}, //生命周期 - 挂载之前
        beforeUpdate() {}, //生命周期 - 更新之前
        updated() {}, //生命周期 - 更新之后
        beforeDestroy() {}, //生命周期 - 销毁之前
        destroyed() {}, //生命周期 - 销毁完成
        activated() {}, //如果页面有keep-alive缓存功能，这个函数会触发
    }
</script>
<style lang='less' src="../assets/css/prob7003.less"></style>
<style lang='less'>
    .prob-purchase-panel{
        .props-item{
            .txt{
                font-size: 0.7rem;
            }
            .props-item-icon{
                width: 0.8rem;
            }
        } 
    }
</style>