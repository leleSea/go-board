<!--  -->
<template>
    <div class='time-interval'>
        <span class="time-txt">{{timeText}}</span>
    </div>
</template>

<script>
    export default {
        name: 'timeInterval',
        props: {
            time: {
                type: Number,
                default: 0
            },
            name: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                timeData: null,
                timeAction: false,
            };
        },
        methods: {
            action(){
                return new Promise(resolve => {
                    this.intervalAction(() => {
                        resolve()
                    })
                })
            },
            intervalAction(callback){
                let interval = null
                let fun = () => {
                    this.timeData = this.time
                    this.timeAction = true
                    interval = setInterval(() => {
                        if(this.timeData <= 0){
                            clearInterval(interval)
                            this.timeAction = false
                            callback()
                            return
                        }
                        this.timeData--
                    }, 1000);
                }
                return fun()
            },
        },
        created() {

        },
        components: {
        },
        computed: {
            timeText(){
                if(!this.timeAction) return this.name
                return this.timeData
            }
        },
        watch: {
            timeAction: {
                handler(val){
                    this.$emit('intervalChange', val)
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
<style lang='less'>
    .time-interval{
        .time-txt{
            font-size: 0.6rem;
        }
    }
</style>