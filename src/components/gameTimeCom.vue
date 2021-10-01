<!--  -->
<template>
    <div class='game-time-com'>
        <span v-show="!displayReadSecond" class="txt t">{{timeShowMinute.m | timeMinute}}分{{timeShowMinute.s | timeMinute}}秒</span>
        <div class="game-time-read-second" v-show="displayReadSecond">
            <div class="read-second-box">
                <div class="read-second-num" :style="{width: `${readSecondStyle.width}%`}">
                    <div class="read-second-num-warning" v-show="readSecondStyle.warning"></div>
                    <div class="read-second-num-normal"></div>
                </div>
            </div>
            <div class="read-second-num-box">
                <span class="txt">{{timeShowMinute.s}}</span>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'gameTimeCom',
        props: {
            username: String,
            coor: Number,
            userRole: String,
            theme: String,
            minute: Number,
            second: Number,
            num: Number
        },
        data() {
            return {
                timeInterval: null,
                timeMinute: 0,
                timeSecond: 0,
                timeNum: 0,
                intervalTime: 0,
                intervalActive: false,
                readSecondStyle: {
                    width: 100,
                    warning: false
                },

            };
        },
        methods: {
            restart(){
                this.init()
                this.start()
            },
            start(){
                this.timeIntervalOn()
            },
            stop(){
                this.timeIntervalOff()
            },
            timeContinue(){
                this.timeIntervalOn(parseInt(this.intervalTime / 1000))
            },
            timeIntervalOn(amount){
                this.timeIntervalOff()
                this.intervalActive = true
                amount = amount || this.remainTime
                let t = 0
                this.intervalTime = amount * 1000
                setTimeout(() => {
                    this.timeInterval = setInterval(() => {
                        if(!this.intervalActive) return
                        this.intervalTime -= 100
                        if(this.intervalTime <= 0){
                            this.timeIntervalOff()
                            this.timesup()
                        }
                        this.minuteCalculate()
                        this.readSecondStyle = this.readSecondStyleCul()
                    }, 100);
                }, 1000);
            },
            minuteCalculate(){
                if(this.timeMinute <= 0) return
                let t = parseInt(this.intervalTime / 1000 / 60)
                let ts = parseInt(this.intervalTime / 1000) % 60
                if(ts > 0) t++
                this.timeMinute = t
            },
            timesup(){
                this.timeMinute = -1
                if(this.second <= 0 || this.timeNum <= 1) this.timeOut()
                else{
                    this.timeNum--
                    this.start()
                }
                this.$emit('update', {minute: this.timeMinute, second: this.timeSecond, num: this.timeNum})
                
            },
            timeOut(){
            },
            timeIntervalOff(){
                this.intervalActive = false
                clearInterval(this.timeInterval)
            },
            init(){
                this.timeMinute = this.minute
                this.timeSecond = this.second
                this.timeNum = this.num
                this.intervalTime = this.remainTime * 1000
            },
            readSecondStyleCul(){
                if(!this.displayReadSecond) return {width: 0, warning: false}
                let amount = this.timeSecond * 1000
                let remain = this.intervalTime
                let per = (remain / amount * 100).toFixed(2)
                let warning = false
                if(per <= this.GLOBAL.timeWarning) warning = true
                return {width : per, warning: warning}
            },
        },
        created() {
        },
        components: {
        },
        computed: {
            displayReadSecond(){
                return this.timeMinute < 0
            },
            timeShowMinute(){
                let time = parseInt(this.intervalTime / 1000)
                let m, s
                if(!this.displayReadSecond){
                    m = parseInt(time / 60)
                    s = time % 60
                }else{
                    m = 0, s = time
                }
                return {m: m, s: s}
            },
            
            remainTime(){
                let minute = this.timeMinute
                let second = this.timeSecond
                if(minute <= 0) return second
                return minute * 60
            },
        },
        watch: {
            minute:{
                handler(){
                    if(!this.intervalActive) this.init()
                },
                immediate: true,
                deep: true
            },
            second:{
                handler(){
                    if(!this.intervalActive) this.init()
                },
                immediate: true,
                deep: true
            },
            num:{
                handler(){
                    if(!this.intervalActive) this.init()
                },
                immediate: true,
                deep: true
            },
        },
        mounted() {},
        beforeCreate() {}, //生命周期 - 创建之前
        beforeMount() {}, //生命周期 - 挂载之前
        beforeUpdate() {}, //生命周期 - 更新之前
        updated() {}, //生命周期 - 更新之后
        beforeDestroy() {
            this.timeIntervalOff()
        }, //生命周期 - 销毁之前
        destroyed() {}, //生命周期 - 销毁完成
        activated() {}, //如果页面有keep-alive缓存功能，这个函数会触发
    }
</script>
<style lang='less' >
    .game-time-read-second{
        display: flex;
        align-items: center;
        .read-second-num-box{
            margin-left: 0.5rem;
        }
        .read-second-box{
            width: 100%;
            height: 0.5rem;
            box-shadow: inset 0 1px 2px rgba(0,0,0,.5);
            overflow: hidden;
            .read-second-num{
                position: relative;
                width: 100%;
                height: 100%;
                float: right;
                .read-second-num-normal{
                    background: #9dd9fd;
                    width: 100%;
                    height: 100%;
                }
                .read-second-num-warning{
                    position: absolute;
                    top: 0px;
                    left: 0px;
                    background: #f56c6c;
                    width: 100%;
                    height: 100%;
                    -webkit-animation: timeWarning 1.5s infinite;
                    animation: timeWarning 1.5s infinite;
                }
            }
        }
    }
</style>