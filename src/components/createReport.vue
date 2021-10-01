<!--  -->
<template>
    <div class='create-report prob-7003'>
        <le-confirm ref="leConfirm">
            <template v-slot:message>
                <div class="report-select-box" v-if="selectReportType">
                    <h1 class="report-select-title">
                        <span class="txt">{{$t('请选择报告类型')}}</span>
                    </h1>
                    <div class="report-select">
                        <el-radio-group v-model="reportId">
                            <ul class="report-select-list">
                                <li class="report-type-list-item report-select-data" v-for="(v, i) in reportPlanCul" :key="i" >
                                    <el-radio :label="v.id">
                                        <div class="report-type-list-item-body">
                                            <img :src="`${GLOBAL.assetsUrl}/img/${v.icon}.png`" class="report-type-icon" alt="">
                                            <span class="txt">{{$t(v.name)}}{{ $t('报告') }}({{v.num}})</span>
                                        </div>
                                    </el-radio>
                                </li>
                            </ul>
                        </el-radio-group>
                    </div>
                </div>
                 <!-- v-show="confirmDisabled" -->
                  <!-- :class="{'visibility-hidden': !confirmDisabled}" -->
                <div class="report-purchase-box" :class="{'visibility-hidden': !confirmDisabled}">
                    <div class="balance-box" v-if="selectReport && selectReport.id">
                        <div class="balance-not-enough">
                            <div class="message">
                                <span class="txt">
                                {{ $t('您的') }}
                                <img :src="`${GLOBAL.assetsUrl}/img/${probInfoCul.icon}.png`" class="notice-icon">
                                {{`${$t(probInfoCul.name)}${$t('券已用尽')} `}}</span>
                                <span class="extend-txt txt" v-if="extendTxtCul" v-html="$t(extendTxtCul)"></span>
                                <el-button class="le-button recharge-btn recharge-button" type="text" @click="gotoRecharge" v-if="rechargeBtnDisplay">
                                    <span class="txt">{{ $t('充值') }}</span>
                                </el-button>
                            </div>
                        </div>
                    </div>
                    <div class="get-prob-type" v-if="selecteNow">
                        <div class="purchase-7003" v-for="(v, i) in selecteNow.data" :key="i">
                            <div class="purchase-item">
                                <div class="props-buy-i-body store-good">
                                    <div class="prop-item-box i-it">
                                        <propItem :icon="getIcon(v.icon)" :name="v.name" :num="v.num"></propItem>
                                    </div>
                                    <div class="prop-price-box i-it" v-if="v.price">
                                        <div class="orginal-price" v-if="v.singlePrice != null && v.singlePrice > v.price / v.num">
                                            <span class="txt txt-delete"> ￥ {{v.singlePrice * v.num}} <span class="currency"> CNY </span></span>
                                        </div>
                                        <div class="discount-price">
                                            <span class="txt"> ￥ {{v.price}} <span class="currency"> CNY </span></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="purchase-fun">
                                <el-button :loading="actionLoading" :disabled="v.btnDisabled" class="le-button confirm store-button-bcg" @click="takeFun({fun: selecteNow.btnFun, data: v})">{{$t(selecteNow.btnName)}}</el-button>
                            </div>
                        </div>
                    </div>
                    <div class="get-prob-type" v-if="!selecteNow">
                        
                    </div>
                </div>
            
                <div class="le-confirm-foot">
                    <el-button class="le-confirm-btn confirm store-button-bcg" @click="immdiateCreate" v-if="!selecteNow">{{$t('余额生成')}}</el-button>
                    <el-button class="le-confirm-btn confirm store-button-bcg" @click="immdiateCreate" :disabled="confirmDisabled" v-if="selectReportType">{{$t('确认')}}</el-button>
                    <el-button class="le-confirm-btn cancel-login-register-button-bcg cancel" @click="cancel">{{$t('取消')}}</el-button>
                </div>
            </template>
        </le-confirm>
    </div>
</template>

<script>
    import propItem from '../views/store/propItem.vue'

    export default {
        name: 'createReport',
        props: {},
        data() {
            return {
                selectReportType: false,
                userProbs: null,
                actionLoading: false,
                balance: 0,
                gameId: null,
                reportId: null,
                moves: null,
                dataLoading: false,
                activity: {
                    data: null,
                    active: false
                },
                purchase: {
                    data: null,
                    active: false
                },
                openFun: null,
                probList: [],
                reportPlan: null
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
                console.log(this.response)
                if(this.response) this.response(res)
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
            async reportPlanInit(){
                let res = await this.GLOBAL.reportPrice()
                if(res && res.code == 0){
                    this.reportPlan = res.data
                }
            },
            open(opt){
                let promise = new Promise((success) => {
                    this.openBefore()
                    
                    opt = opt || {}
                    this.response = success
                    this.reportId = opt.reportId || 1
                    this.gameId = opt.gameId || null
                    this.moves = opt.moves || ''
                    this.selectReportType = opt.select
                    this.LOADING.open()
                    this.checkType().then(fun => {
                        this.LOADING.close()
                        if(!fun && !this.selectReportType) return this.immdiateCreate()
                        if(this[`${fun}Open`] || this.selectReportType){
                            let button = [
                                {name: '取消', label: 1, type: 'cancel'},
                            ]
                            if(this.selectReportType){
                                button.unshift({
                                    name: '确认', label: 0, disabled: this.confirmDisabled
                                })
                            }
                            this.openFun = fun
                            if(this[`${fun}Open`]) this[`${fun}Open`]()
                            this.$refs['leConfirm'].open({
                                // button: button
                            }).then(res => {
                                if(!res) this.cancel()
                                else{
                                    let label = res.label
                                    if(label == 1) this.cancel()
                                    else if(label == 0) this.createReportConfirm()
                                }
                                
                            })
                            
                        }
                    })
                })
                return promise
            },
            createReportConfirm(){
                
            },
            activityOpen(){
                if(!this.activity.data) return
                this.activity.active = true
            },
            async purchaseOpen(){
                let res = await this.userBalanceInit()
                res = await this.GLOBAL.getStoreListProps()
                if(res && res.code == 0){
                    this.probList = res.data
                }
            },
            openBefore(){
                this.selectReportType = false
                this.actionLoading = false
                this.gameId = null
                this.reportId = null
                this.moves = null
                this.dataLoading = false
                this.activity = {
                    data: null,
                    active: false
                }
                this.purchase = {
                    data: null,
                    active: false
                }
            },
            async checkType(){
                await this.reportPlanInit()
                await this.userReportProbInit()
                this.reportId = this.reportIdCul
                if(this.createReportImmdiate && !this.selectReportType) return null
                let res = await this.GLOBAL.haveActivityByType(this.selectReport.k2)
                if(res){
                    this.activity.data = res
                    return 'activity'
                }
                return 'purchase'
            },
            getProbNameIcon(name){
                let propsIcon = this.GLOBAL.propsIconStore, reportIcon = this.GLOBAL.storeReportIconStore
                let info = {}
                if(propsIcon[name]){
                    info.icon =  propsIcon[name].icon
                    info.name =  propsIcon[name].name
                    info.key =  name
                }
                if(reportIcon[name]){
                    info.icon = reportIcon[name].icon
                    info.name = reportIcon[name].name
                    info.key =  name
                }
                // if(!Object.keys(info).length && this.reportNonePurchase){
                //     info.icon = this.GLOBAL.reportKeyCha['超准'].icon
                // }
                return info
            },
            getIcon(icon){
                if(!icon) return []
                if(!this.GLOBAL.isArray(icon)) icon = [icon]
                return icon 
            },
            takeFun(opt){
                let fun = opt.fun
                if(this[fun]) this[fun](opt.data)
            },
            async purchaseAction(val){
                if(!val || val.id == undefined) return
                this.actionLoading = true
                let res = await this.GLOBAL.propBuy(val.id, this.username)
                if(res && res.code == 0){
                    this.purchaseReportAfter()
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
            async activityAction(val){
                let data = {activity: val}
                if(!data || !data.activity || data.activity.activity_id == undefined) return
                data = data.activity
                this.actionLoading = true
                let res = await this.GLOBAL.activityRe(data.activity_id)
                this.GLOBAL.errorHandle(res, 'activityReceive')
                if(res && res.code == 0){
                    this.purchaseReportAfter()
                    let msg = this.GLOBAL.getRequestMsg(res, 'activityReceive')
                    this.GLOBAL.MessageOpen({
                        message: msg,
                        type: 'success'
                    })
                }
                this.actionLoading = false
            },
            purchaseReportAfter(){
                if(!this.selectReportType) this.immdiateCreate()
                else this.userReportProbInit()
            },
            async userReportProbInit(){
                let res = await this.GLOBAL.getTool()
                if(res && res.code == 0){
                    this.userProbs = res.data
                }
                return res
            },
            async immdiateCreate(){
                if(this.gameId === null || this.reportId === null) return false
                if(this.confirmDisabled && this.selectReportType) return false
                let res = this.GLOBAL.reportCreateaction(this.gameId, this.reportId, this.moves)
                this.returnByRes(res)
            },
        },
        created() {

        },
        components: {
            propItem
        },
        computed: {
            reportIdCul(){
                let reportId = this.reportId
                if(!this.selectReportType) return reportId
                let list = this.reportPlanCul || []
                let id = null
                for(var i in list){
                    if(list[i].num > 0) id = list[i].id
                }
                if(id === null) return reportId
                return id
            },
            reportItemPurchase(){

            },
            confirmDisabled(){
                let reportId = this.reportId
                let list = this.reportPlanCul
                let data = null
                for(var i in list){
                    if(list[i].id == reportId){
                        data = list[i]
                        break
                    }
                }
                if(!data) return true
                data.num = data.num || 0
                return data.num <= 0
            },
            createReportImmdiate(){
                let userProbs = this.userProbs
                let selectReport = this.selectReport
                if(userProbs[selectReport.k1] && userProbs[selectReport.k1] > 0) return true
                return false
            },
            rechargeBtnDisplay(){
                let data = this.selecteNow
                if(!data || !data.recharge) return null
                return data.recharge
            },
            probInfoCul(){
                let name = this.probKeyCul
                let info = this.getProbNameIcon(name)
                return info
            },
            reportPlanCul(){
                let list = this.reportPlan || []
                let reportKeyCha = this.GLOBAL.reportKeyCha
                let userProbs = this.userProbs || {}
                let rd = []
                for(var i in list){
                    list[i].index = i
                    if(!reportKeyCha[list[i].name]) continue
                    list[i].k1 = reportKeyCha[list[i].name].k1
                    list[i].k2 = reportKeyCha[list[i].name].k2
                    list[i].icon = reportKeyCha[list[i].name].icon
                    list[i].num = userProbs[list[i].k1] || 0
                    if(list[i].name == '特训') continue
                    rd.push(list[i])
                }
                return rd
            },
            reportNonePurchase(){
                if(!this.probKeyCul || this.probKeyCul == '') return true
                return false
                // let id = this.reportId
                // let list = this.reportPlanCul
                // if(!list || !list.length) return false
                // let val = null
                // for(var i in list){
                //     if(list[i].id == id){
                //         val = list[i]
                //         break
                //     }
                // }
                // if(!val || val.name == '超准')
            },
            selectReport(){
                let list = this.reportPlan || []
                let reportId = this.reportId || null
                let reportKeyCha = this.GLOBAL.reportKeyCha
                if(reportId === null) return {}
                let data = {}
                for(var i in list){
                    if(list[i].id == reportId){
                        data = this.GLOBAL.deepCopy(list[i])
                        if(reportKeyCha[data.name]){
                            data.k1 = reportKeyCha[data.name].k1
                            data.k2 = reportKeyCha[data.name].k2
                            data.icon = reportKeyCha[data.name].icon
                        }
                    }
                }
                return data
            },
            probKeyCul(){
                let selectReport = this.selectReport || {}
                // let probKey = selectReport.k2 || 'precision_report'
                let probKey = selectReport.k2
                return probKey
            },
            probListCul(){
                let data = {}, propsIcon = this.GLOBAL.propsIconStore, reportIcon = this.GLOBAL.storeReportIconStore
                let list = this.probList
                if(this.probList && this.probList.length){
                    let singleNum = 1
                    let singlePrice = {}
                    for(var i in list){
                        if(list[i].num == singleNum && !singlePrice[list[i].name]){
                            singlePrice[list[i].name] = list[i].price
                        }
                    }
                    for(var i in list){
                        if(!singlePrice[list[i].name]) continue
                        list[i].singlePrice = singlePrice[list[i].name]
                        list[i].singleNum = singleNum
                    }
                }
                return list
            },
            probKeyListCul(){
                let data = [], propsIcon = this.GLOBAL.propsIconStore, reportIcon = this.GLOBAL.storeReportIconStore
                let key = this.probKeyCul
                if(this.probList && this.probList.length){
                    let list = this.probListCul
                    for(var i in list){
                        let name = list[i].name
                        if(name != key || (!propsIcon[name] && !reportIcon[name])) continue
                        let d = propsIcon[name] || reportIcon[name]
                        let tem = this.GLOBAL.deepCopy(list[i])
                        tem.name = d.name
                        tem.icon = d.icon
                        data.push(tem)
                    }
                }
                return data
            },
            purchaseDataCul(){
                let data = this.probKeyListCul
                if(!data || !data.length) return null
                let reData = {
                    data: data,
                    btnName: this.$i18n.t('余额兑换'),
                    btnFun: 'purchaseAction',
                    extendTxt: `，${this.$i18n.t('可用余额兑换，当前余额')}￥${this.balance}`
                }
                if(this.balance < data.price){
                    reData.btnDisabled = true
                    reData.recharge = true
                }
                return reData

                // data.btnName = this.$i18n.t('余额兑换')
                // data.btnFun = this.purchaseAction
                // data.extendTxt = `，${this.$i18n.t('可用余额兑换，当前余额')}￥${this.balance}`
                // if(this.balance < data.price){
                //     data.btnDisabled = true
                //     data.recharge = true
                // }
                // return data
            },
            activityDataCul(){
                if(!this.activity.data) return null
                let data = this.GLOBAL.deepCopy(this.activity.data)
                let info = this.getProbNameIcon(data.bonusType)
                // info = this.GLOBAL.deepCopy(data)
                info.num = data.bonus
                if(data.bonusType == 'mixed') info.name = ''
                info.btnName = this.$i18n.t('领取')
                info.btnFun = 'activityAction'
                info.extendTxt = `，${this.$i18n.t('可领取')}${data.name}`
                info.activity = data
                // let rd = [{icon: info.icon, num: info.num, name: info.name}]
                let rd = this.GLOBAL.deepCopy(data)
                rd.icon = info.icon
                rd.num = info.num
                rd.name = info.name
                rd = [rd]
                info.data = rd
                return info
            },
            selecteNow(){
                let fun = this.openFun
                if(!fun) return null
                let rd = this[fun]
                if(!rd || !this[`${fun}DataCul`]) return null
                let data = this[`${fun}DataCul`]
                console.log(this.GLOBAL.deepCopy(data))
                return data
            },
            extendTxtCul(){
                let data = this.selecteNow
                if(!data || !data.extendTxt){
                    // return null
                    return `，${this.$i18n.t('可直接用余额生成报告，当前余额')}￥${this.balance}`
                }
                return data.extendTxt
            },
            storeReportName(){
                let reportId = this.reportId

            },
            ordinaryReport(){
                let list = this.GLOBAL.storeReportIcon
                return list['ordinaryReport'] || {}
            },
            precisionReport(){
                let list = this.GLOBAL.storeReportIcon
                return list['precisionReport'] || {}
            },
            probIcon(){
                if(!this.selecteNow) return []
                let icon = this.selecteNow.icon
                if(!this.GLOBAL.isArray(icon)) icon = [icon]
                return icon 
            },
        },
        watch: {
            reportId(val){
            }
        },
        mounted() {
            // this.open({select: true})
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
    .create-report{
        .props-item{
            .txt{
                font-size: 0.7rem;
            }
            .props-item-icon{
                width: 0.8rem;
            }
        } 
        .purchase-7003{
            .purchase-item{
                .props-item{
                    height: 1.5rem;
                }
            }
        }
    }
</style>