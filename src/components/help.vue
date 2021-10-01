<!--  -->
<template>
    <div class='help'>
        <el-tooltip class="item" :effect="theme" placement="top-start">
            <div class="help-component-tooltip" slot="content" v-html="message"></div>
            <img class="help-icon" :src="`${GLOBAL.assetsUrl}/img/p34.png`" alt="">
        </el-tooltip>
    </div>
</template>

<script>
    export default {
        name: 'help',
        props: {
            theme: String
        },
        data() {
            return {
                message: ''
            };
        },
        methods: {
            changeMsg(message){
                this.message = message
            }
        },
        created() {
            this.theme = this.theme || 'light'
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
    .help{
        position: absolute;
        width: 0.8rem;
        top: 0px;
        right: -1rem;
        .help-icon{
            width: 100%;
        }
    }
</style>