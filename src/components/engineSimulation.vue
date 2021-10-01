<!--  -->
<template>
    <div class='engine-simulation'>
        <span class="txt">{{display_po | tofixed0 | sicNumber}}</span>
    </div>
</template>

<script>
    export default {
        name: 'engineSimulation',
        props: {
            engineStatus: {
                default: false,
                type: Boolean
            },
            num: Object,
            planId: Number,
            requestTime: {
                default: 2000,
                type: Number
            },
            planData: Object
        },
        data() {
            return {
                speed: null,
                engine_po: 0,
                display_po: 0,
                delta_po: 0,
                engine_time: 0,
                current_time: 0,
                adjust_speed: 0,
                adjust_time: 4,
                interT: this.GLOBAL.optSpeInterval,
                intervalData: null,
                status: false
            };
        },
        methods: {
            currentTime(){
                return parseInt((new Date()).getTime() / 1000)
            },
            restart(){
                if(this.status) return
                this.clear()
                this.speedUpdate()
                this.status = true
                this.intervalData = setInterval(() => {
                    this.display_po = this.display_po + this.deltaT * this.speedCul
                    if((this.currentTime() - this.engine_time) < this.adjust_time){
                        let data = this.adjust_speed * this.deltaT
                        // if(data > 0) this.display_po += data
                        if(data <= this.speedCul * -0.5){
                            data = this.speedCul * -0.5
                        }
                        this.display_po += data
                    }
                    // if(this.delta_po > 0){
                    //     this.display_po += this.delta_po * (this.interT / this.requestTime)
                    // }
                }, this.interT)
            },
            clear(){
                if(this.intervalData === null) return
                this.status = false
                clearInterval(this.intervalData)
            },
            resetData(){
                this.display_po = 0
                this.engine_po = 0
                this.delta_po = 0

            },
            proportionCul(proportion){
                if(proportion == 1) return
                this.display_po *= proportion
                this.engine_po *= proportion
                this.delta_po *= proportion
                this.adjust_speed *= proportion

            },
            speedUpdate(){
                if(this.planData && this.GLOBAL.isObject(this.planData)){
                    // this.speed = this.planData
                }
                this.speed = this.GLOBAL.getEngineSpeed(this.planId)
            },
        },
        created() {

        },
        components: {
        },
        computed: {
            speedCul(){
                if(!this.planId) return 0
                if(this.planData && this.GLOBAL.isObject(this.planData)){
                    return this.planData.po
                }
                return this.GLOBAL.getEngineSpeed(this.planId)
            },
            deltaT(){
                return this.interT / 1000
            },
        },
        watch: {
            engineStatus: {
                handler(val){
                    if(val){
                        this.restart()
                    }else{
                        this.clear()
                        this.resetData()
                    }
                    
                },
                deep: true,
                immediate: true
            },
            num: {
                handler(newVal, oldVal){
                    newVal = newVal || {}
                    oldVal = oldVal || {}
                    let num = newVal.num
                    let oldNum = oldVal.num
                    let proportion = newVal.specProportion || 1
                    if(num == 0){
                        this.resetData()
                    }else if(num < oldNum){
                        // proportion = newVal / oldVal
                        // this.clear()
                        // this.display_po = newVal
                        this.proportionCul(proportion)
                    }else{
                        this.engine_po = num
                        this.delta_po = this.engine_po - this.display_po
                        this.engine_time = this.currentTime()
                        this.adjust_speed = this.delta_po / this.adjust_time
                    }
                    // if(!this.status) this.restart()
                },
                deep: true,
                immediate: true
            },
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
<style lang='less' >
    .engine-simulation{
        display: flex;
    }
</style>