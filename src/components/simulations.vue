<!--  -->
<template>
    <div class='simulations-page'>
        <span class="txt">{{nextNumber | tofixed0 | sicNumber}}</span>
    </div>
</template>

<script>
    export default {
        name: 'simulations',
        props: {
            number: Number,
            position: Number,
            step: Number,
            optIntervalTimeDefined: Number,
            isLastPosition: Boolean,
            needLastPos: Boolean
        },
        data() {
            return {
                nextNumber: 0,
                delta: 0,
                intervalNumber: 0,
                interval: null,
                optIntervalTime: this.GLOBAL.optIntervalTimeLive,
                optSperate: {
                    interval: null,
                    step: this.GLOBAL.optSpeInterval / this.GLOBAL.optIntervalTimeLive,
                    num: 0
                },
            };
        },
        methods: {
            optionsIntervalOn(){
                this.optionsIntervalOff()
                this.interval = setInterval(() => {
                    this.optSperate.num++
                    // this.optSperate.step = (this.GLOBAL.optSpeInterval / this.optIntervalTime)
                    this.optSperate.step = (this.GLOBAL.optSpeInterval / this.optIntervalTimeLiveCul)
                    this.nextNumberSet()
                    if(this.optSperate.step * this.optSperate.num == 1){
                        this.optionsIntervalOff()
                        return
                    }
                }, this.GLOBAL.optSpeInterval)
            },
            nextNumberSet(){
                this.nextNumber = this.nextNumber + this.delta * this.optSperate.step
            },
            optionsIntervalOff(){
                this.optSperate.num = 0
                clearInterval(this.interval)
            },
            reset(){
                let number = this.number || 0
                this.delta = number - this.nextNumber
                this.nextNumber = this.number - this.delta
                this.optSperate = {
                    interval: null,
                    step: this.GLOBAL.optSpeInterval / this.optIntervalTime,
                    num: 0
                }
            },
            clear(){
                this.nextNumber = this.number
                this.delta = 0
                this.optSperate = {
                    interval: null,
                    step: this.GLOBAL.optSpeInterval / this.optIntervalTime,
                    num: 0
                }
                this.optionsIntervalOff()
            },
        },
        created() {

        },
        components: {
            numberCul(){
                return this.nextNumber + this.delta * this.optSperate.step * this.optSperate.num
            },
        },
        computed: {
            optIntervalTimeLiveCul(){
                if(this.optIntervalTimeDefined === undefined) return this.GLOBAL.optIntervalTimeLive
                return this.optIntervalTimeDefined
                // return this.GLOBAL.optIntervalTimeLive
            },
        },
        watch: {
            number: {
                handler(val, oldVal){
                    // if(oldVal > val){
                    //     this.nextNumber = 0
                    // }
                    // this.reset()
                    // this.optionsIntervalOn()
                    // if(this.needLastPos && !this.isLastPosition) this.nextNumber = val
                    // else this.optionsIntervalOn()

                    if(oldVal > val){
                        this.nextNumber = 0
                    }
                    this.reset()
                    if(this.nextNumber > 0) this.optionsIntervalOn()
                    else this.nextNumber = val


                    // if(oldVal > val){
                    //     this.nextNumber = val
                    // }else{
                    //     this.reset()
                    //     this.optionsIntervalOn()
                    // }
                },
                immediate: true,
                deep: true
            },
            position: {
                handler(){
                    this.clear()
                },
                deep: true,
                immediate: true
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
<style lang='less' >

</style>