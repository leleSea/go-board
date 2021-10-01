<template>
    <div class="plan-select-com" v-show="configSetActive" :class="{'on': configSetAction, 'off': !configSetAction, 'normal': openType == 0, 'nor-mal': isNormalModel, 'mini': !isNormalModel}" 
    data-click="planSelect" @mouseenter="mouseenter" @mouseleave="mouseleave">
        <div class="page-body-theme" :class="theme">
            <div class="plan-body">
                <h1 class="plan-title">
                    <span class="m">{{ $t('选择配置') }}：</span>
                </h1>
                <ul class="plan-select-ul" 
                v-loading="dataLoading" 
                element-loading-background="rgba(0, 0, 0, 0.0)"
                element-loading-spinner="page-loading-icon-css">
                    <li class="select-item" v-for="(v, i) in lists" :key="v.id" 
                    @click="configSet(v.index)" @dblclick="confirmSet(v.index)"
                    :class="{'available': v.available.active, 'unavailable': !v.available.active, 'selected': selected == v.index && openType == 0}">
                        <div class="item-i name">
                            <span class="plan-txt">{{$t(v.name)}}</span>
                            <div class="info-price-orl txt-sp con-item"
                            :class="{'delete theme-status-unavailable-font-color': cardRemainNow && cardRemainNow.discounts}"
                            >
                                <span class="txt" >￥{{v.price | tofixed2}}/分钟</span>
                            </div>
                        </div>
                        <div class="sel-tw">
                            <div class="item-i status left" 
                            v-if="!isNormalModel"
                            :class="{'theme-status-available-font-color': v.available.active, 
                            'theme-status-unavailable-font-color': !v.available.active,}">
                                <span v-if="!v.available.active || openType == 0">{{$t(v.available.txt)}}</span>
                                <span v-if="v.available.active && openType == 1">
                                    <el-button class="theme-start-button-bcg" v-if="v.id != planNow" @click.stop="planChange(v)">{{$t('立即切换')}}</el-button>
                                    <div class="using" v-if="planNow == v.id">{{$t('正在使用')}}</div>
                                </span>
                            </div>
                            <cardEdInfo ref="cardEdInfo">
                                <template v-slot:card-name>
                                    <div class="card-name">
                                        <div class="card-icon">
                                            <img :src="`${GLOBAL.assetsUrl}/img/card_ed.png`" alt="">
                                        </div>
                                        <div class="card-title" v-if="cardRemainNow">
                                            <span class="txt">{{cardName}}</span>
                                        </div>
                                    </div>
                                </template>
                                <template v-slot:card-discounts>
                                    <div class="price-discounts" v-if="cardRemainNow">
                                        <span class="txt" v-if="cardRemainNow && cardRemainNow.gpuPlanId == v.id && cardRemainNow.remainTime > 0">
                                            {{ $t('本月剩余') }}{{cardRemainNow.remainTime}}{{ $t('分钟') }}
                                        </span>
                                        <span class="txt" v-else>￥{{v.price * cardRemainNow.discounts | tofixed3plan}}</span>
                                    </div>
                                    <div class="price-discounts" v-else>
                                        <span class="txt">{{$t('低至')}}</span>
                                        <span class="txt">￥{{maxDiscountsPrice(v) | tofixed3plan}}</span>
                                    </div>
                                </template>
                            </cardEdInfo>
                            <div class="item-i status right" 
                            v-if="isNormalModel"
                            :class="{'theme-status-available-font-color': v.available.active, 
                            'theme-status-unavailable-font-color': !v.available.active,}">
                                <span class="using" v-if="!v.available.active || openType == 0">{{$t(v.available.txt)}}</span>
                                <span v-if="v.available.active && openType == 1">
                                    <el-button class="theme-start-button-bcg" v-if="v.id != planNow" @click.stop="planChange(v)">{{$t('立即切换')}}</el-button>
                                    <div class="using" v-if="planNow == v.id">{{$t('正在使用')}}</div>
                                </span>
                            </div>
                        </div>
                        
                        
                    </li>
                </ul>
            </div>
        </div>
        
        <leConfirm ref="leConfirm"></leConfirm>
    </div>
</template>

<script>
import http from '../http.js'
import cardEdInfo from '../views/store/cardEdInfo.vue'

export default {
    name: 'configSet',
    props: {
        theme: String,
        komi: Number
    },
    data(){
        return {
            botSize: 0,
            screenWidth: null,
            selected: null,
            cardRemainNow: {},
            activePlan: null,
            jarIntro: {
                active: false,
                data: {
                    table: []
                }
            },
            lockConfigId: 3,
            lists: [
                // {name: '专业版', intro: '使用1GPU算力', price: '15/小时', status: 1, id: 0},
                // {name: '专业版', intro: '使用1GPU算力', price: '15/小时', status: 1, id: 1},
                // {name: '专业版', intro: '使用1GPU算力', price: '15/小时', status: 1, id: 2},
            ],
            active: null,
            http: new http('/userApi'),
            configSetActive: false,
            configSetAction: false,
            dataLoading: false,
            openType: 0,
            cardList: [],
        }
    },
    methods: {
        configOff(){
            // this.configSetActive = false
            this.panelOffAnimation()
        },
        async getPlanList(data, komi){
            if(data) return data
            this.dataLoading = true
            komi = komi || this.komi
            komi = 7.5
            let res = await this.GLOBAL.enginePlan(komi)
            try{
                res.data = JSON.parse(res.data)
            }catch(e){}
            data = null
            if(res && res.code == 0){
                this.GLOBAL.setItem({
                    planList: res.data
                })
                data = res.data
            }
            this.dataLoading = false
            return data
        },
        configSetOn(type){
            this.openType = type || 0
            this.planNow = this.$store.state.engine_id ? this.$store.state.planId : null
            this.userCardRemainInit()
            .then(res => {
                this.panelOnAnimation()
                this.getPlanList().then(res => {
                    this.initListNew(res)
                })
            })
        },
        panelOnAnimation(){
            this.configSetActive = true
            setTimeout(() => {
                this.configSetAction = true
            }, 300);
        },
        panelOffAnimation(){
            this.configSetAction = false
            setTimeout(() => {
                this.configSetActive = false
            }, 300);
        },
        async userCardRemainInit(){
            this.LOADING.open()
            let res = await this.GLOBAL.cardPlanRemain()
            if(res && res.code == 0){
                this.cardRemainNow = res.data
            }
            this.LOADING.close()
        },
        planDisabled(){
            this.GLOBAL.MessageOpen({
                message: this.GLOBAL.__ERRORMSGDEFINE.errorMsg.gpu_plans.disabled
            })
        },
        JarIntroOn(){
            let path = this.GLOBAL.assetsUrl + '/txt/productIntro.json'
            this.GLOBAL.getStaticData(path)
            .then(res => {
                let data = this.getJarTable(res)
                this.jarIntro.data = data
                this.jarIntro.active = true
            })
        },
        JarIntroOff(){
            this.jarIntro.active = false
        },
        getJarTable(data){
            return data.content[data.content.length - 1].content[data.content[data.content.length - 1].content.length - 1]
        },
        confirmSet(index){
            if(this.openType != 0) return
            index = index || this.selected
            let plan = this.lists[index]
            if(!plan.available.active){
                this.planDisabled(plan)
                return
            }
            let options = {
                url: '/engines',
                timeout: 20000,
                data: {
                    plan_id: plan.id
                }
            }
            this.request('engine', options)
            .then(res => {
                if(res && res.code == 0){
                    this.GLOBAL.engineSet({
                        planId: plan.id,
                        engine_id: res.data,
                        device: 'web'
                    })
                }
                this.$emit('confirmSet', {
                    res: res,
                    enginePlan: plan
                })
                this.configOff()
            })
        },
        configEnter(index, indexP){
            let plan = this.lists[indexP].planList[index]
            if(plan.available.active || plan.available.type != 1 ) return
        },
        configSet(index){
            // let plan = this.lists[indexP].planList[index]
            // if(!plan.available.active && plan.available.type != 1){
            //     this.unavailableHandle(plan)
            //     return
            // }
            // let id = plan.id
            // this.active = id;
            // this.activePlan = plan
            // this.index = index
            // this.indexP = indexP
            let plan = this.lists[index]
            this.selected = index
            // if(!plan.available.active)
        },
        unavailableHandle(plan){
            if(plan.available.active) return
            if(plan.available.type == 1){
                this.JarIntroOn()
            }
        },
        submit(){
            let options = {
                url: '/engines',
                msgKey: 'setEngines',
                data: {
                    plan_id: this.active
                }
            }
            this.request('engine', options)
            .then(res => {
            })
        },


        async request(type, options){
            // if(!this.GLOBAL.checkEnterEngineTime()) return
            let loading = this.$loading({
                background: 'rgba(0, 0, 0, 0.7)'
            });
            let res = await this.http.request(type, options)
            // this.errHandle(res, options)
            loading.close()
            return res
        },
        errHandle(res, options){
            if(options.noMsg) return
            let code = Number(res.code)
            let txt = res.errorMsg;
            let type = code != 0 ? 'error' : 'success';
            this.$message({
                type: type,
                message: txt,
                duration: 3000,
                showClose: true
            })
        },
        
        async pageInit(){
            await this.cardPlanInit()
            let r = await this.userCardRemainInit()
            this.getPlanList().then(res => {
                this.initListNew(res)
            })
        },
        async cardPlanInit(){
            this.cardList = []
            let res = await this.GLOBAL.cardPlan()
            if(res && res.code == 0){
                this.cardList = res.data
            }
            return res
        },
        initListNew(list){
            this.lists = []
            if(!list || list.length <= 0) return
            let planRole = this.GLOBAL.deepCopy(this.GLOBAL.planRole)
            for(var i in list){
                list[i].index = i
                if(list[i].available){
                    list[i].available = {
                        active: true,
                        txt: '当前可用',
                    }
                }else{
                    let reason = this.GLOBAL.planUnavailableReason(list[i].unavailableReason) || {type: 2, txt: '当前不可用'}
                    list[i].available = {
                        active: false,
                        txt: reason.txt,
                    }
                }
                list[i].planRole = planRole[list[i].id] || {}
                if(this.cardRemainNow && this.cardRemainNow.gpuPlanId && this.cardRemainNow.gpuPlanId == list[i].id && this.cardRemainNow.remainTime > 0 && list[i].available){
                    this.selected = list[i].index
                }
                if(!this.cardRemainNow || !this.cardRemainNow.gpuPlanId || this.cardRemainNow.remainTime <= 0){
                    if(list[i].available.active && list[i].id <= this.lockConfigId){
                        this.selected = list[i].index
                    }
                }
            }
            this.lists = list
        },
        initList(list){
            let data = [], type, j = 0, i = 0, listCopy = this.GLOBAL.copy(list), k = 0
            let config = false
            let planRole = this.GLOBAL.deepCopy(this.GLOBAL.planRole)
            while(j <= list.length - 1){
                type = list[j].planType
                i = j
                data.push({
                    name: this.GLOBAL.planType[type].name,
                    planList: [],
                })
                data[data.length - 1].index = data.length - 1
                for(i = j; i < list.length; i++){
                    if(list[i].planType == type){
                        // list[i].index = i
                        if(list[i].available){
                            list[i].available = {
                                active: true,
                                txt: '当前可用',
                                css: 'available',
                                txtCss: 'available'
                            }
                        }else{
                            let reason = this.GLOBAL.planUnavailableReason(list[i].unavailableReason) || {type: 2, txt: '当前不可用'}
                            list[i].available = {
                                active: false,
                                txt: reason.txt,
                                css: reason.type != 1 ? 'unavailable' : 'available',
                                // css: 'unavailable',
                                type: reason.type,
                                txtCss: 'unavailable'
                            }
                        }
                        list[i].planRole = planRole[list[i].id] || {}
                        data[data.length - 1].planList.push(list[i])
                        data[data.length - 1].planList[data[data.length - 1].planList.length - 1].index = data[data.length - 1].planList.length - 1
                        if(this.cardRemainNow && this.cardRemainNow.gpuPlanId && this.cardRemainNow.gpuPlanId == list[i].id && this.cardRemainNow.remainTime > 0 && list[i].available){
                            this.active = list[i].id
                            this.index = data[data.length - 1].planList[data[data.length - 1].planList.length - 1].index
                            this.indexP = data[data.length - 1].index
                            this.activePlan = list[i]
                        }
                        if(!this.cardRemainNow || !this.cardRemainNow.gpuPlanId){
                            if(list[i].available.active && list[i].id <= this.lockConfigId){
                                this.active = list[i].id
                                this.index = data[data.length - 1].planList[data[data.length - 1].planList.length - 1].index
                                this.indexP = data[data.length - 1].index
                                this.activePlan = list[i]
                            }
                        }
                        
                    }else{
                        break
                    }
                }
                j = i
            }
            this.lists = data
        },
        getMoreJar(){
            this.GLOBAL.jumpToPageNew('recharge')
        },
        appClick(e){
            if(!this.configSetActive) return
            let ele = e.target
            let atrName = 'planSelect'
            let f = false
            while(ele){
                let atr = ele.getAttribute('data-click')
                if(atr && atr == atrName){
                    f = true
                    break
                }
                ele = ele.parentElement
            }
            if(!f) this.configOff()
        },
        async planChangeCheck(){
            let opt = {
                title: '确定要切换配置吗？',
                message: '切换配置将自动结算您当前引擎账单并更换到新的配置，分析数据将会保留',
            }
            let res = await this.$refs['leConfirm'].open({
                title: '',
                message: '切换配置将自动结算您当前引擎账单并更换到新的配置，分析数据将会保留',
                button: [
                    {name: '确定', label: 0},
                    {name: '取消', label: 1, type: 'cancel'},
                ]
            }).then(res => {
                let label = Number(res.label)
                return (label == 0 ? true : false)
            })
            // let res = await this.GLOBAL.ConfirmOpen(opt).then(res => {
            //     return true
            // }).catch(res => {
            //     return false
            // })
            return res
        },
        async planChange(plan, komi){
            if(!plan.available.active){
                this.planDisabled(plan)
                return
            }
            let r = await this.planChangeCheck()
           if(!r) return
            this.LOADING.open()
            // let res = await this.GLOBAL.planChange(plan.id)
            komi = komi || this.komi
            // komi = 7.5
            this.GLOBAL.planChange(plan.id, komi).then(res => {
                if(res && res.code == 0){
                    let planIdOld = this.$store.state.planId
                    this.GLOBAL.engineSet({
                        planId: plan.id,
                        engine_id: this.$store.state.engine_id,
                        device: 'web'
                    })
                    this.GLOBAL.engineBillDisplay(planIdOld, res)
                }
                this.$emit('takeFun', {
                    fun: 'planChangeEnd',
                    data: {
                        res: res,
                        enginePlan: plan
                    }
                })
                this.configOff()
                this.LOADING.close()
            })
        },
        async planChangeByPrice(price, komi){
            let plan = this.getPlanDataByPrice(price)
            if(!plan) return false
            let id = plan.id
            this.LOADING.open()
            let res = await this.GLOBAL.planChange(id, komi)
            if(res && res.code == 0){
                let planIdOld = this.$store.state.planId
                this.GLOBAL.engineSet({
                    planId: plan.id,
                    engine_id: this.$store.state.engine_id,
                    device: 'web'
                })
                this.GLOBAL.engineBillDisplay(planIdOld, res)
            }
            this.$emit('takeFun', {
                fun: 'planChangeEnd',
                data: {
                    res: res,
                    enginePlan: plan
                }
            })
            this.LOADING.close()
        },
        getPlanDataByPrice(price){
            let list = this.lists
            let plan = null
            for(var i in list){
                if(list[i].price == price){
                    plan = list[i]
                    break
                }
            }
            return plan
        },
        maxDiscountsPrice(val, cardList){
            val = val || {}
            cardList = cardList || this.cardListCul
            let data = null, maxDiscountsCard = null
            for(var i in cardList){
                if(!maxDiscountsCard) maxDiscountsCard = cardList[i]
                if(maxDiscountsCard.discounts > cardList[i].discounts) maxDiscountsCard = cardList[i]
                if(val.id == cardList[i].giftGpuPlan){
                    if(!data) data = cardList[i]
                    if(data.discounts > cardList[i].discounts) data = cardList[i]
                }
            }
            if(!data && !maxDiscountsCard) return null
            // if(!data) data = maxDiscountsCard
            let price
            if(data) price = data.price * 10 / 12 / data.giftGpuTime
            else price = val.price * maxDiscountsCard.discounts
            return price
        },
        mouseenter(){
            this.GLOBAL.setStoreItem({
                planSelectEnter: true
            })
        },
        mouseleave(){
            this.GLOBAL.setStoreItem({
                planSelectEnter: false
            })
        },
        sizeChange(){
            let width = document.body.offsetWidth
            console.log(width)
            this.screenWidth = width
        },
    },
    created(){
        this.botSize = this.$store.state.enginePlan.botSizeCom
        this.sizeChange()
        this.pageInit()
    },
    mounted() {
        this.GLOBAL.onresizeFunction['plan-select-engine-ch'] = this.sizeChange
    },
    computed: {
        isNormalModel(){
            return this.screenWidth === null || this.screenWidth > this.botSize
        },
        maxDiscountsCard(){
            let list = this.cardListCul || []
            let card = null
            for(var i in list){
                if(card === null) card = list[i]
                if(list[i].discounts < card.discounts){
                    card = list[i]
                }
            }
            return card
        },
        cardListCul(){
            let list = this.GLOBAL.deepCopy(this.cardList) || []
            let rd = []
            for(var i in list){
                if(!list[i].canPurchase) continue
                rd.push(list[i])
            }
            return rd
        },
        cardName(){
            let card = this.cardPlanData || {}
            let list = this.lists || []
            if(!Object.keys(card) || !list.length) return null
            let engineData = null
            for(var i in list){
                if(card.giftGpuPlan == list[i].id){
                    engineData = list[i]
                    break
                }
            }
            if(!engineData) return null
            return this.GLOBAL.cardNameGet(card, engineData)
        },
        cardPlanData(){
            let card = this.cardRemainNow || {}
            let cardList = this.cardList || []
            let rd = {}
            for(var i in cardList){
                if(cardList[i].id == card.cardPlan){
                    rd = cardList[i]
                    break
                }
            }
            return rd
        },
    },
    components: {
        cardEdInfo
    },
    beforeDestroy(){
        this.mouseleave()
        this.GLOBAL.onresizeFunction['plan-select-engine-ch'] = null

    }
}
</script>

<style lang="less">
    @boxPaddingSide: 0.5rem;
    @boxPaddingtop: 1rem;
    @titleH: 1.5rem;
    @boxMaxH: 16rem;
    @itemH: 1.8rem;
    @changeBtnH: 1.15rem;
    @changeBtnW: 4.2rem;
    .plan-select-com.off{
        transform: translateY(2rem);
        opacity: 0;
    }
    .plan-select-com.on{
        transform: '';
        opacity: 1;
    }
    .plan-select-com.normal{
        .plan-body .plan-select-ul .select-item:hover{
            background: rgba(49,164,32,.5);
        }
        .plan-body .plan-select-ul .select-item.selected:hover{
            background: rgba(49,164,32,1);
        }
        .plan-body .plan-select-ul .select-item{
            cursor: pointer;
        }
    }
    .plan-select-com{
        transition: all .3s;
        
        padding: @boxPaddingtop 0px;
        max-height: @boxMaxH;
        color: #fff;
        .plan-body{
            .plan-title{
                text-align: left;
                // margin-bottom: 0.5rem;
                padding: 1rem @boxPaddingSide 0px;
                height: @titleH;
                line-height: @titleH;
                .m{
                    font-size: 0.9rem;
                }
                .s{
                    font-size: 0.6rem;
                    color: #ddd;
                }
            }
            .plan-select-ul::-webkit-scrollbar{
                width: 4px;
            }
            .plan-select-ul::-webkit-scrollbar-thumb{
                border-radius: 10px;
                -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
                background: rgba(0,0,0,0.2);
            }
            .plan-select-ul::-webkit-scrollbar-track{
                -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
                border-radius: 0;
                background: rgba(0,0,0,0.1);
            }
            .plan-select-ul{
                @planNameWidth: 6.5rem;
                @planStatusWidth: 4.2rem;
                max-height: calc(@boxMaxH - @boxPaddingtop * 2 - @titleH);
                overflow-y: auto;
                .select-item{
                    display: flex;
                    // padding: 0px @boxPaddingSide;
                    padding: 0.2rem @boxPaddingSide;
                    // height: @itemH;
                    height: auto;
                    justify-content: space-between;
                    align-items: center;
                    // line-height: @itemH;
                    .item-i.name, .item-i.status{
                        // width: @planStatusWidth;
                        width: 100%;
                        white-space: nowrap;
                    }
                    .item-i.name{
                        text-align: left;
                        width: @planNameWidth;
                    }
                    .card-ed-info{
                        // width: calc(100% - @planNameWidth - @planStatusWidth);
                        width: auto;
                    }
                    .item-i.status{
                        text-align: right;
                        // color: inherit;
                        .el-button{
                            text-align: center;
                            padding: 0px;
                            width: @changeBtnW;
                            height: @changeBtnH;
                            line-height: @changeBtnH;
                            // background: #417939;
                            border: 0px;
                            color: #fff;
                            font-size: 0.6rem;
                        }
                        .using{
                            display: inline-block;
                            text-align: center;
                            padding: 0px;
                            width: @changeBtnW;
                            height: @changeBtnH;
                            line-height: @changeBtnH; 
                        }
                        .el-button:active{
                            transform: scale(0.99);
                        }
                    }
                    .item-i.price{
                        width: 50%;
                        .or-price.delete{
                            text-decoration: line-through;
                            // color: #C6C6C6;
                        }
                        .real-price{
                            margin-left: 0.3rem;
                        }
                    }
                    .item-i, .sel-tw{
                        display: flex;
                        align-items: center;
                        .item-i.status.left{
                            margin-right: 0.5rem;
                        }
                        .item-i.status.right{
                            margin-left: 0.5rem;
                        }
                        .plan-txt{
                            margin-right: 0.5rem;
                        }
                    }
                }
                .select-item.available{
                    .item-i.status{
                        // color: #6AFF54;
                    }
                }
                .select-item.unavailable{
                    .item-i.status{
                        // color: #B9B9B9;
                    }
                }
                // .select-item:hover{
                //     background: rgba(49,164,32,.5);
                // }
                .select-item.selected{
                    background: rgba(49,164,32);
                }
            }
        }
        .page-body-theme.dark{
            background: #272727;
        }
        .page-body-theme.light{
            background: #CECDCD;
        }
    }

    .plan-select-com.mini{
        .plan-body{
            .plan-select-ul{
                .select-item{
                    .item-i, .sel-tw{
                        display: block;
                    }
                }
            }
        }
    }

</style>


