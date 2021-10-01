<!--  -->
<template>
   <div class='vioce'>
       <!-- <audio v-for="v in list" :key="v.id" :src="`${GLOBAL.assetsUrl}/voice/${v.name}`" :id="v.id"></audio> -->
       <audio id="voiceMain"></audio>
   </div>
</template>

<script>
    export default {
        name: 'vioce',
        data() {
            return {
                list: {}
            };
        },
        methods: {
            pageInit(){
                setTimeout(() => {
                    this.audio = document.getElementById('voiceMain')
                }, 500);
            },
            play(){
                this.audio.stop()
                this.audio.play()
            },
            setPath(src){
                this.audio.setAttribute('src', src);
            },
            removePlay(num){
                let data = this.list['remove' + num] || this.list['remove0']
                this.setPath(data.path)
                this.play()
            },
            stonePlay(){
                let data = this.list['play']
                this.setPath(data.path)
                this.play()
            },
            readPlay(num){
                let data = this.list[`readSec${num}`] || null
                if(!data) return
                this.setPath(data.path)
                this.play()
            },
        },
        created() {
            this.list = this.GLOBAL.voiceList
            this.pageInit()
        },
        components: {
        },
        computed: {},
        watch: {},
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