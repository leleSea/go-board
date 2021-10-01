<!--  -->
<template>
    <div class='le-page-title'>  
        <leConfirm ref="leConfirm"></leConfirm>  
    </div>
</template>

<script>
    export default {
        name: 'lePageTitle',
        props: {
            engineId: String,
            planId: String,
            username: String
        },
        data() {
            return {
                interval: null,
                loading: false,
                cardRemainNow: null,
                balance: 0,
                warnTime: null,
                warningTimeSave: {}
            };
        },
        methods: {
            watchOn(){
                console.log('watchOn')
                this.warningTimeSave = {}
                this.warnTime = this.GLOBAL.deepCopy(this.GLOBAL.watchEngineInfoTime.warnTime) 
                this.watchClear()
                let t = this.GLOBAL.watchEngineInfoTime.interval
                // let t = 10000
                this.watchClear()
                this.interval = setInterval(() => {
                    this.watchAction()
                }, t)
            },
            // async watchAction(){
            //     if(this.loading) return
            //     if(!this.engineId) return this.watchOff()
            //     let resBalance = await this.userBalanceInit()
            //     let resCard = await this.userCardRemainInit()
            //     let resPlan = await this.planListInit()
            //     let res = await this.GLOBAL.engineUseInfo()
            //     if(!resBalance || resBalance.code != 0) return
            //     if(!resCard || resCard.code != 0) return
            //     if(!resPlan || resPlan.code != 0) return
            //     if(res && res.code == 0){
            //         let plan = this.planNow
            //         let bill = res.data.bill
            //         let balance = this.balance
            //         let minute = res.data.minutes
            //         if(!plan) return
            //         let message = null, remainTime = 0, type = 0
            //         if(plan.freeTime && plan.freeTime > 0) return
            //         message = '您的余额即将用尽，请及时充值，以免影响您的使用。'
            //         let remain = balance - bill
            //         remainTime = Math.ceil(remain / plan.realPrice)
            //         let warnTime = this.warnTime
            //         let f = false
            //         for(var i in warnTime){
            //             if(remainTime <= warnTime[i].time && !warnTime[i].remain){
            //                 this.warnTime[i].remain = true
            //                 message = message.replace('#{time}', warnTime[i])
            //                 f = true
            //                 break
            //             }
            //         }
            //         if(!f) return
            //         let button = type == 0 ? [{name: '去充值', label: 0}] : [{name: '确定', label: 1}]
            //         this.$refs['leConfirm'].open({
            //             message: message,
            //             button: button
            //         }).then(res => {
            //             if(res.label == 0) this.GLOBAL.jumpToPage('/engine/recharge')
            //         })
            //     }
            // },
            async watchAction(){
                console.log('watchAction')
                if(!this.engineId) return this.watchOff()
                let res = await this.userBalanceInit()
                if(res && res.code == 0){
                    let data = res.data
                    let cardRemainTime = data.cardRemainTime || 0
                    let price = data.price
                    let realTimeBill = data.realTimeBill || 0
                    let balance = data.balance || 0
                    let realBalance = balance - realTimeBill
                    let remainTime = Number(cardRemainTime) + Math.ceil(realBalance / price)
                    let warnTime = this.warnTime, warningTimeSave = this.warningTimeSave
                    // console.log(cardRemainTime)
                    // console.log(realBalance)
                    // console.log(price)
                    // console.log(remainTime)
                    let f = false
                    for(var i in warnTime){
                        if(remainTime <= warnTime[i].time){
                            if(!warningTimeSave[warnTime[i].time]){
                                this.warningTimeSave[warnTime[i].time] = true
                                f = true
                            }
                            break
                        }
                    }
                    if(!f) return
                    let button = [{name: '去充值', label: 0}]
                    let message = '您的余额即将用尽，请及时充值，以免影响您的使用。'
                    this.$refs['leConfirm'].open({
                        message: message,
                        button: button
                    }).then(res => {
                        if(res && res.label == 0) this.GLOBAL.jumpToPage('/engine/recharge')
                    })
                }
            },
            watchOff(){
                console.log('watchOff')
                this.watchClear()
            },
            watchClear(){
                clearInterval(this.interval)
            },
            async userCardRemainInit(){
                let res = await this.GLOBAL.cardPlanRemain()
                if(res && res.code == 0){
                    this.cardRemainNow = res.data
                }
                return res
            },
            async planListInit(){
                let res = await this.GLOBAL.enginePlan()
                try{
                    res.data = JSON.parse(res.data)
                }catch(e){}
                if(res && res.code == 0){
                    this.planListParse(res.data)
                }
                return res
            },
            planListParse(list){
                let card = this.cardRemainNow
                let planId = this.planId
                let planNow = null
                this.planNow = planNow
                for(var i in list){
                    if(list[i].id == planId){
                        if(card){
                            if(card.gpuPlanId == list[i].id){
                                list[i].freeTime = card.remainTime
                            }
                            list[i].realPrice = list[i].price * card.discounts
                        }else{
                            list[i].realPrice = list[i].price
                        }
                        planNow = list[i]
                        break
                    }
                }
                this.planNow = planNow
            },
            async userBalanceInit(){
                if(this.loading) return false
                this.loading = true
                this.balance = 0
                let username = this.$store.state.username
                let res = await this.GLOBAL.getUserBalances(username)
                if(res && res.code == 0){
                    try{
                        res.data = JSON.parse(res.data)
                    }catch(e){}
                    this.balance = res.data.balance
                }
                this.loading = false
                return res
            },
        },
        created() {
            this.planListInit()
        },
        components: {
        },
        computed: {
        },
        watch: {
            engineId: {
                handler(val){
                    try{
                        val = JSON.parse(val)
                        val = eval(val)
                    }catch(e){}
                    val ? this.watchOn() : this.watchOff()
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
</script>
<style lang='less'>
    
</style>