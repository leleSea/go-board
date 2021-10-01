<!--  -->
<template>
    <div class='iframe-dom'>
        <iframe id="iframe_dom_window" :src="src" v-if="src"></iframe>
    </div>
</template>

<script>

    export default {
        name: 'iframeDom',
        props: {
            src: String
        },
        data() {
            return {
                maxNum: 5
            };
        },
        methods: {
            pageInit(num){
                document.domain = 'foxwq.com'
                num = num || 0
                let data = document.getElementById("iframe_dom_window").contentWindow;  
                
                // if(!data) return
                // let obj = data.document.getElementById('btnPrev')
                // console.log(obj)
                // if(!obj && num <= this.maxNum){
                //     console.log('enter')
                //     num++
                //     setTimeout(() => {
                //         console.log('time out')
                //         this.pageInit(num)
                //     }, 1000);
                //     return
                // } 
                // console.log(obj)
            },
        },
        created() {

        },
        components: {
        },
        computed: {},
        watch: {},
        mounted() {
            setTimeout(() => {
                this.pageInit()
            }, 7000);
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
<style lang='less' >
    .iframe-dom{
        width: 26rem;
        height: 40rem;
        position: absolute;
        top: 0px;
        left: 0px;
        z-index: 999;
        iframe{
            width: 100%;
            height: 100%;
        }
    }
</style>