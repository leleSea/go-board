<!--  -->
<template>
    <div class='plan-select-engine' 
    :class="[locale, {'normal': isNormalModel, 'mini': !isNormalModel}]"
    v-loading="dataLoading" 
    element-loading-background="rgba(0, 0, 0, 0.0)"
    element-loading-spinner="page-loading-icon-css">
        <el-select class="item-i-body input-select-area-bcg" v-model="enginePlanSelect.value" 
        :popper-append-to-body="false"
        :popper-class="`play-ready-game-set-s engine-plan-select ${theme} input-select-area-bcg card-style-box mini-scrollbar`">
            <div v-if="enginePlanSelect.data[enginePlanSelect.value]" slot="prefix" class="engine-pan-options head card-style" :class="{'available': enginePlanSelect.data[enginePlanSelect.value].available.active, 'unavailable': !enginePlanSelect.data[enginePlanSelect.value].available.active,}">
                <div class="item-i name">
                    <span>{{$t(enginePlanSelect.data[enginePlanSelect.value].name)}}</span>
                </div>
                <div class="item-i price">
                    <cardEdInfo ref="cardEdInfo">
                        <template v-slot:price>
                            <div class="info-price-orl txt-sp con-item"
                            :class="{'delete': cardRemainNow && cardRemainNow.discounts}"
                            >
                                <span class="txt" >￥{{enginePlanSelect.data[enginePlanSelect.value].price | tofixed2}}/{{$t('分钟')}}</span>
                            </div>
                        </template>
                        <template v-slot:card-name v-if="cardRemainNow">
                            <div class="card-name">
                                <div class="card-icon">
                                    <img :src="`${GLOBAL.assetsUrl}/img/card_ed.png`" alt="">
                                </div>
                                <div class="card-title">
                                    <span class="txt">{{cardName}}</span>
                                </div>
                            </div>
                        </template>
                        <template v-slot:card-discounts v-if="cardRemainNow">
                            <div class="price-discounts" v-if="cardRemainNow && cardRemainNow.gpuPlanId == enginePlanSelect.data[enginePlanSelect.value].id && cardRemainNow.remainTime > 0">
                                <span class="txt">{{ $t('本月剩余') }}{{cardRemainNow.remainTime}}{{ $t('分钟') }}</span>
                            </div>
                            <div class="price-discounts" v-else>
                                <span class="txt">
                                    ￥{{enginePlanSelect.data[enginePlanSelect.value].price * cardRemainNow.discounts | tofixed3plan}}
                                </span>
                            </div>
                        </template>
                    </cardEdInfo>
                </div>
            </div>
            <el-option
            v-for="v in enginePlanSelectData"
            :key="v.name"
            :label="v.name"
            :value="v.value">
                <div class="engine-pan-options opt card-style" :class="{'available': v.available.active, 'unavailable': !v.available.active,}">
                    <div class="item-i name">
                        <span class="s txt opt-plan-name">{{$t(v.name)}}</span>
                        <div class="info-price-orl txt-sp con-item"
                        :class="{'delete': cardRemainNow && cardRemainNow.discounts}"
                        >
                            <span class="txt" >￥{{v.price | tofixed2}}/{{$t('分钟')}}</span>
                        </div>
                    </div>
                    <div class="item-i price" :class="{'text-center': !cardRemainNow, 'text-left': cardRemainNow}">
                        <div class="item-i status left" :class="{'theme-status-available-font-color': v.available.active, 'theme-status-unavailable-font-color': !v.available.active,}" v-if="!isNormalModel">
                            <span>{{$t(v.available.txt)}}</span>
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
                                    <span class="txt" v-if="locale != 'en'">{{$t('低至')}}</span>
                                    <span class="txt">￥{{maxDiscountsPrice(v) | tofixed3plan}}</span>
                                    <span class="txt" v-if="locale == 'en'">{{$t('低至')}}</span>
                                </div>
                            </template>
                        </cardEdInfo>
                        <div class="item-i status right" :class="{'theme-status-available-font-color': v.available.active, 'theme-status-unavailable-font-color': !v.available.active,}" v-if="isNormalModel">
                            <span>{{$t(v.available.txt)}}</span>
                        </div>
                    </div>
                </div>
            </el-option>
        </el-select>
        <div class="card-store-box card-bcg-white" v-if="cardStore">
            <div class="card-store-item a">
                <img :src="`${GLOBAL.assetsUrl}/img/card_ed.png`">
            </div>
            <div class="card-store-item b">
                <span class="txt">
                    <span class="txt" v-if="locale != 'en'">{{$t('办理')}}{{$t('星光卡')}}，</span>
                    {{planSelectedCardStoreName}}
                    <span class="txt" v-if="locale != 'en'">{{$t('低至')}}</span>
                </span>
                <span class="txt price text-red">￥{{maxDiscountsPrice(planSelected) | tofixed3plan}}</span>
                <span class="txt" v-if="locale == 'en'">{{$t('低至')}}</span>
                <span class="txt">/{{$t('分钟')}}</span>
            </div>
            <div class="card-store-item c">
                <router-link :to="`${GLOBAL.pageList.store.cardNormal}/${cardStore.giftGpuPlan}/${cardStore.id}`">
                    <span class="txt">{{$t('立即办理')}}</span>
                    <span class="txt el-icon-arrow-right"></span>
                </router-link>
            </div>
        </div>
    </div>
</template>

<script>
    import help from '../views/play/levelHelp.vue'
    import cardEdInfo from '../views/store/cardEdInfo.vue'

    export default {
        name: 'planSelectEngine',
        props: {
            theme: String,
            cardPlanNowApp: Object,
            username: String,
            komi: Number
        },
        data() {
            return {
                botSize: 0,
                screenWidth: null,
                locale: 'zh',
                helpMessage: '',
                dataLoading: false,
                planNow: null,
                planVlue: null,
                lockConfigId: 3,
                cardRemainNow: null,
                localPlanKey: 'enginePlanValue',
                enginePlanSelect: {
                    value: null,
                    data: []
                },
                cardList: [],
            };
        },
        methods: {
            // pageinit(){
            //     this.planNow = this.$store.state.engine_id ? this.$store.state.planId : null
            //     this.userCardRemainInit()
            //     .then(res => {
            //         this.getPlanList().then(res => {
            //             this.initListNew(res, {
            //                 localSave: true
            //             })
            //         })
            //     })
            // },
            pageRefresh(){
                // this.planNow = this.$store.state.engine_id ? this.$store.state.planId : null
                // this.userCardRemainInit()
                // .then(res => {
                //     this.getPlanList().then(res => {
                //         this.initListNew(res, {
                //             localSave: true
                //         })
                //     })
                // })
                this.pageinit()
            },
            async pageinit(opt){
                opt = opt || {}
                if(opt.type == 'init') await this.cardPlanInit()
                this.planNow = this.$store.state.engine_id ? this.$store.state.planId : null
                await this.userCardRemainInit()
                let res = await this.getPlanList()
                this.initListNew(res, {localSave: true})
            },
            async cardPlanInit(){
                this.cardList = []
                let res = await this.GLOBAL.cardPlan()
                if(res && res.code == 0){
                    this.cardList = res.data
                }
                return res
            },
            async userCardRemainInit(){
                this.LOADING.open()
                let res = await this.GLOBAL.cardPlanRemain()
                if(res && res.code == 0){
                    this.cardRemainNow = res.data
                }
                this.LOADING.close()
            },
            async getPlanList(komi){
                this.dataLoading = true
                komi = komi || this.komi
                // komi = 7.5
                let res = await this.GLOBAL.enginePlan(komi)
                try{
                    res.data = JSON.parse(res.data)
                }catch(e){}
                let data = false
                if(res && res.code == 0){
                    data = res.data
                    this.$emit('takeFun', {
                        fun: 'planListUpdate',
                        data: this.GLOBAL.deepCopy(data)
                    })
                }
                this.dataLoading = false
                return data
            },
            initListNew(list, opt){
                opt = opt || {}
                let localDefault = this.GLOBAL.getLocalItem(this.localPlanKey) || null
                if(!list || list.length <= 0) return
                this.enginePlanSelect.data = []
                this.enginePlanSelect.value = null
                let planRole = this.GLOBAL.deepCopy(this.GLOBAL.planRole)
                let lockConfigIdIndex = null
                let userDefaultIndex = null
                let cardDefaultIndex = null
                for(var i in list){
                    list[i].value = Number(i)
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
                    // if(this.cardRemainNow && this.cardRemainNow.gpuPlanId && this.cardRemainNow.gpuPlanId == list[i].id && this.cardRemainNow.remainTime > 0 && list[i].available.active){
                    //     cardDefaultIndex = Number(list[i].index)
                    // }
                    if(this.cardRemainNow && this.cardRemainNow.gpuPlanId && this.cardRemainNow.gpuPlanId == list[i].id && list[i].available.active){
                        cardDefaultIndex = Number(list[i].index)
                    }
                    if(list[i].id <= this.lockConfigId && list[i].available.active) lockConfigIdIndex = Number(list[i].index)
                    // if(!this.cardRemainNow || !this.cardRemainNow.gpuPlanId){
                    //     if(list[i].available.active && list[i].id <= this.lockConfigId){
                    //         cardDefaultIndex = Number(list[i].index)
                    //     }
                    // }
                    if(localDefault && localDefault == list[i].id && list[i].available.active && list[i].price > 0){
                        userDefaultIndex = Number(list[i].index)
                    }
                }
                this.enginePlanSelect.data = list
                
                // else if(userDefaultIndex != null) this.enginePlanSelect.value = userDefaultIndex
                // else if(cardDefaultIndex != null) this.enginePlanSelect.value = cardDefaultIndex
                if(cardDefaultIndex !== null){
                    this.enginePlanSelect.value = cardDefaultIndex
                }else if(userDefaultIndex !== null){
                    this.enginePlanSelect.value = userDefaultIndex
                }else if(lockConfigIdIndex !== null){
                    this.enginePlanSelect.value = lockConfigIdIndex
                }
            },
            async planChange(id, komi, planIdOld){
                let res = await this.GLOBAL.planChange(id, komi)
                if(res && res.code == 0){
                    this.GLOBAL.engineSet({
                        planId: id,
                        engine_id: this.$store.state.engine_id,
                        device: 'web'
                    })
                    // this.GLOBAL.engineBillDisplay(planIdOld, res)
                }
                this.$emit('takeFun', {
                    fun: 'planChangeEnd',
                    data: {
                        res: res,
                    }
                })
            },
            async planChangeByPrice(price, komi){
                let plan = this.getPlanDataByPrice(price)
                if(!plan) return false
                let id = plan.id
                let res = await this.GLOBAL.planChange(id, komi)
                if(res && res.code == 0){
                    this.GLOBAL.engineSet({
                        planId: id,
                        engine_id: this.$store.state.engine_id,
                        device: 'web'
                    })
                }
                this.$emit('takeFun', {
                    fun: 'planChangeEnd',
                    data: {
                        res: res,
                    }
                })
            },
            async confirmSetAction(planId){
                if(planId === undefined) return
                this.LOADING.open()
                let komi = this.komi || 7.5
                let res = await this.GLOBAL.planSet(planId, komi)
                this.LOADING.close()
                let saveData = {}
                saveData[this.localPlanKey] = planId
                this.GLOBAL.setItem(saveData)
                return res
            },
            async confirmSet(index){
                this.LOADING.open()
                index = index || this.enginePlanSelect.value
                if(index === undefined || index === null || !this.enginePlanSelect.data[index]){
                    this.LOADING.close()
                    return
                }
                let plan = this.enginePlanSelect.data[index]
                if(!plan.available.active) return false
                let res = await this.confirmSetAction(plan.id)
                // let komi = this.komi || 7.5
                // // let komi = 7.5
                // let res = await this.GLOBAL.planSet(plan.id, komi)
                // this.LOADING.close()
                // let saveData = {}
                // saveData[this.localPlanKey] = plan.id
                // this.GLOBAL.setItem(saveData)
                this.$emit('confirmSet', {
                    res: res,
                    enginePlan: plan
                })
                return res
            },
            getPlanDataByPrice(price){
                let list = this.enginePlanSelect.data
                let plan = null
                for(var i in list){
                    if(list[i].price == price){
                        plan = list[i]
                        break
                    }
                }
                return plan
            },
            async confirmSetByPrace(price){
                if(price === undefined) return false
                let plan = this.getPlanDataByPrice(price)
                if(!plan) return false
                let res = await this.confirmSetAction(plan.id)
                return res
            },
            async confirmSetLdp(){
                let plan = await this._enginePlan.getLdpInitPlanId()
                if(!plan) return false
                let res = await this.confirmSetAction(plan.id)
                return res
            },
            discountsPriceGet(val){
                val = val || {}
                let cardList = this.cardListCul || []
                let discounts = 1
                if(!val || !Object.keys(val).length) return 0
                for(var i in cardList){
                    if(cardList[i].giftGpuPlan == val.id && cardList[i].discounts < discounts){
                        discounts = cardList[i].discounts
                    }
                }
                return val.price * discounts
            },
            cardNameGet(val){
                let list = this.enginePlanSelect.data || []
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
            sizeChange(){
                let width = document.body.offsetWidth
                console.log(width)
                this.screenWidth = width
            },
        },
        created() {
            this.botSize = this.$store.state.enginePlan.botSize
            this.sizeChange()
            this.helpMessage = `
                <img class="content-img" src="${this.GLOBAL.assetsUrl}/img/${this.$i18n.t('hl2')}.png">
            `
            this.pageinit({type: 'init'})
        },
        components: {
            help,
            cardEdInfo
        },
        computed: {
            isNormalModel(){
                return this.screenWidth === null || this.screenWidth > this.botSize
            },
            enginePlanSelectData(){
                let list = this.GLOBAL.deepCopy(this.enginePlanSelect.data) || []
                let rd = []
                for(var i in list){
                    if(list[i].price <= 0 && list[i].po <= 0) continue
                    rd.push(list[i])
                }
                return rd
            },
            planList(){
                let list = this.GLOBAL.deepCopy(this.enginePlanSelect.data) || []
                return list
            },
            planSelected(){
                let index = this.enginePlanSelect.value
                if(index === undefined || index === null || !this.enginePlanSelect.data[index]){
                    return
                }
                let plan = this.enginePlanSelect.data[index]
                return plan
            },
            planSelectedCardStoreName(){
                let plan = this.planSelected || {}
                if(!plan.name) return null
                let name = plan.name
                name = name.replace('专业版', '')
                name = name.replace('旗舰版', '')
                name = name.replace(' ', '')
                return name
            },
            cardStore(){
                if(this.cardRemainNow) return null
                if(!this.enginePlanSelect.data[this.enginePlanSelect.value]) return null
                let data = this.enginePlanSelect.data[this.enginePlanSelect.value]
                let cardList = this.cardListCul || []
                let card = {discounts: 1}
                let maxDiscountsCard = null
                let f = false
                for(var i in cardList){
                    let tem = false
                    if(!maxDiscountsCard){
                        maxDiscountsCard = cardList[i]
                        tem = true
                    }
                    if(maxDiscountsCard.discounts > cardList[i].discounts){
                        maxDiscountsCard = cardList[i]
                        tem = true
                    }
                    if(tem){

                    }
                    if(cardList[i].giftGpuPlan == data.id && card.discounts > cardList[i].discounts){
                        card = cardList[i]
                        f = true
                    }
                }
                if(!f){
                    if(maxDiscountsCard) card = maxDiscountsCard
                    else return null
                }
                card.discountsPrice = data.price * card.discounts
                return card
            },
            cardStoreName(){
                let card = this.cardStore
                if(!card) return null
                let list = this.enginePlanSelect.data
                let plan = null
                for(var i in list){
                    if(card.giftGpuPlan == list[i].id){
                        plan = list[i]
                        break
                    }
                }
                if(!plan) return null
                let name = plan.name
                name = name.replace('专业版', '')
                name = name.replace('旗舰版', '')
                name = name.replace(' ', '')
                return name
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
                let list = this.enginePlanSelect.data || []
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
            helpImg(){
                return `${this.GLOBAL.assetsUrl}/img/l1_${this.theme}.png`
            },
            engineValueCul(){
                let index = this.enginePlanSelect.value
                let data = this.enginePlanSelect.data
                if(isNaN(Number(index)) || !data[index]) return false
                return data[index]
            },
        },
        watch: {
            languageLang: {
                handler(){
                    this.locale = this.$i18n.locale
                },
                immediate: true,
                deep: true
            },
            engineValueCul:{
                handler(val){
                    this.$emit('takeFun', {
                        fun: 'enginePlanValueSet',
                        data: val
                    })
                    this.$emit('enginePlanValueSet', val)
                },
                immediate: true,
                deep: true
            },
            planList: {
                handler(val){
                    // this.$emit('planListChange', val)
                    this.$emit('takeFun', {
                        fun: 'planListChange',
                        data: val
                    })
                },
                immediate: true,
                deep: true
            },
            enginePlanSelect: {
                handler(val){
                    let planVal = val.value
                    this.$emit('change', planVal)

                    // let index = this.enginePlanSelect.value
                    // let data = this.enginePlanSelect.data
                    // if(isNaN(Number(index)) || !data[index]) return false
                    // this.$emit('enginePlanValueSet', data[index])
                },
                immediate: true,
                deep: true
            }
        },
        mounted() {
            this.GLOBAL.onresizeFunction['plan-select-engine'] = this.sizeChange
        },
        beforeCreate() {}, //生命周期 - 创建之前
        beforeMount() {}, //生命周期 - 挂载之前
        beforeUpdate() {}, //生命周期 - 更新之前
        updated() {}, //生命周期 - 更新之后
        beforeDestroy() {
            console.log('beforeDestroy')
            this.GLOBAL.onresizeFunction['plan-select-engine'] = null
        }, //生命周期 - 销毁之前
        destroyed() {}, //生命周期 - 销毁完成
        activated() {}, //如果页面有keep-alive缓存功能，这个函数会触发
    }
</script>
<style lang='less'>
    // .plan-select-engine.en{
    //     .engine-pan-options.head{
    //         .item-i.name{
    //             width: 35%;
    //         }
    //     }
    // }
    .plan-select-engine{
        // display: flex;
        width: 100%;
        .engine-pan-options{
            white-space: nowrap;
            height: 100%;
            padding-right: 1.2rem;
        }
        .engine-pan-options.opt{
            padding: 0px 0.5rem;
            .item-i{
                // width: 50%;
                display: flex;
                align-items: center;
                .item-i.status.left{
                    margin-right: 0.5rem;
                }
                .item-i.status.right{
                    margin-left: 0.5rem;
                }
            } 
        }
        .item-i-body{
            width: 100%;
            .el-input--suffix.is-disabled{
                .el-input__suffix{
                    color: inherit;
                    .el-input__icon{
                        display: none;
                    }
                }
                .el-input__inner{
                    padding: 0px;
                }
            }
            .el-input--suffix{
                height: 1.8rem;
                .el-input__suffix{
                    color: inherit;
                    right: 0.2rem;
                    .el-input__icon{
                        width: 1rem;
                        line-height: normal;
                        display: flex;
                        align-items: center;
                        font-size: 0.9rem;
                        // display: none;
                    }
                }
                .el-input__inner:disabled{
                    opacity: 0.5;
                }
                .el-input__prefix{
                    width: 100%;
                    color: inherit;
                    left: 0px;
                }
                .el-input__inner{
                    padding: 0px;
                    height: 100%;
                    background: none;
                    color: inherit;
                    border: 0px;
                    text-align: center;
                    padding-right: 1rem;
                    display: none;
                }
            }
        }
        .card-store-box{
            margin-top: 0.7rem;
            height: 1.6rem;
            display: flex;
            color: #333;
            padding: 0px 0.25rem;
            border-radius: 0.15rem;
            font-weight: 700;
            white-space: nowrap;
            .card-store-item{
                height: 100%;
                display: flex;
                align-items: center;
            }
            .card-store-item.a{
                margin-right: 0.3rem;
                img{
                    height: 80%;
                }
            }
            .card-store-item.b{
                width: 100%;
            }
        }
    }

    .plan-select-engine.mini{
        .engine-pan-options.opt{
            .item-i{
                display: block;
            } 
        }
    }
    
</style>