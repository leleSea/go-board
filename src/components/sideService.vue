<!--  -->
<template>
    <div class='side-service' :class="{'on': status, 'off': !status}">
        <div class="side-hand" @click="con">
            <span class="hand-icon el-icon-d-arrow-right" :class="{'rotate180': !status}"></span>
        </div>
        <div class="side-body">
            <h1 class="title">{{$t('微信扫一扫添加客服微信')}}</h1>
            <div class="content">
                <div class="ser-qr-code service-wechat-img"></div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: '',
        props: {},
        data() {
            return {
                status: true
            };
        },
        methods: {
            con(){
                this.status ? this.off() : this.on()
            },
            on(){
                this.status = true
            },
            off(){
                this.status = false
            },
        },
        created() {

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
    @sideWidth: 8.5rem;
    @animationSpeed: .3s;
    .side-service.on{
        right: 0px;
    }
    .side-service.off{
        right: calc(-@sideWidth);
    }
    .side-service{
        position: fixed;
        right: 0px;
        top: 40vh;
        z-index: 2;
        display: flex;
        align-items: center;
        height: 9.45rem;
        transition: all @animationSpeed;
        .side-hand{
            background: #216EF4;
            border-radius: 0.15rem 0px 0px 0.15rem;
            color: #fff;
            padding: 0.2rem;
            height: 100%;
            display: flex;
            align-items: center;
            width: 1.5rem;
            cursor: pointer;
            .hand-icon{
                font-size: 1.1rem;
                transition: all @animationSpeed;
            }
        }
        .side-body{
            padding: 0px 0.5rem;
            background: #fff;
            .title{
                padding: 1rem 0px 0.5rem;
            }
            .service-wechat-img{
                width: 7rem;
                height: 7rem;
            }
        }
    }
</style>