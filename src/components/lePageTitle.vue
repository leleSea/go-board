<!--  -->
<template>
    <div class='le-page-title'>
        <div class="le-page-title-box">
             <!-- :style="contentWidthCul" -->
            <div class="le-page-title-body">
                <div class="title-content">
                    <img class="title-icon" :src="icon" alt="">
                    <span class="title-txt">{{$t(message)}}</span>
                </div>
                <div class="share-content" v-if="share && share.show" :style="share.style">
                    <div class="share-content-body" :class="{'cursor-pointer': share.fun}" @click="shareHandle">
                        <img class="title-icon" :src="`${GLOBAL.assetsUrl}/img/sht.png`" alt="">
                        <span class="title-txt">{{ $t('分享') } </span>
                    </div>
                </div>
                <div class="le-solt-store">
                    <slot name="store"></slot>
                    <slot name="webclass"></slot>
                </div>
            </div>
        </div>      
    </div>
</template>

<script>
    export default {
        name: 'lePageTitle',
        props: {
            contentWidth: String,
            icon: String,
            message: String,
            share: Object,
            width: String

        },
        data() {
            return {
                contentWidthCopy: '90%'
            };
        },
        methods: {
            shareHandle(){
                if(!this.share || !this.share.fun) return
                this.$emit('shareFun')
            }
        },
        created() {
        },
        components: {
        },
        computed: {
            contentWidthCul(){
                let width = this.width || this.contentWidthCopy
                return {width: width}
            }
        },
        watch: {
            contentWidth(val){
                if(val) this.contentWidthCopy = val
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
    .le-page-title{
        position: relative;
        .le-page-title-box{
            width: 100%;
            height: @lePageTitleH;
            //padding-top: 1rem;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #C3C3C3;
            color: #333;
            background: url('@{assetsUrl}wb1_store.png') no-repeat;
            background-size: 100% auto;
            .le-page-title-body{
                height: 100%;
                white-space: nowrap;
                text-align: left;
                width: @pageTitleWidth;
                display: flex;
                align-items: center;
                justify-content: flex-start;
                .title-content, .share-content{
                    display: flex;
                }
                .title-content{
                    justify-content: flex-start;
                    align-items: flex-end;
                    width: auto;
                    width: 100%;
                    .title-icon{
                        height: 1.5rem;
                        margin-right: 0.5rem;
                    }
                    .title-txt{
                        color: #fff;
                        font-size: 1rem;
                    }
                }
                
                .share-content{
                    justify-content: flex-end;
                    position: absolute;
                    left: 0px;
                    right: 0px;
                    margin: auto;
                    height: 100%;
                    align-items: flex-end;
                    padding-bottom: 0.5rem;
                    .title-icon{
                        height: 1.1rem;
                        margin-right: 0.5rem;
                    }
                    .title-txt{
                        color: #fff;
                        font-size: 1rem;
                    }
                    .share-content-body{
                        display: flex;
                        align-items: center;
                    }
                }
            }
        }
    }
    .le-solt-store{
        .txt.link{
            color: #fff;
        }
    }
</style>