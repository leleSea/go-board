<!--  -->
<template>
    <div class='engine-web-foot'>
        <div class="web-foot-body">
            <!-- <ul class="foot-page-intro-box">
                <li class="intro-item">
                    <router-link to="/engine/productNavView/productIntro">
                        <span class="txt">{{ $t('产品介绍') }}</span>
                    </router-link>
                </li>
                <li class="intro-item">
                    <router-link to="/engine/productNavView/weblink">
                        <span class="txt">{{ $t('原创内容') }}</span>
                    </router-link>
                </li>
                <li class="intro-item">
                    <router-link to="/engine/productNavView/intro">
                        <span class="txt">{{ $t('了解星阵') }}</span>
                    </router-link>
                </li>
                <li class="intro-item">
                    <router-link to="/engine/productNavView/contactus">
                        <span class="txt">{{ $t('关注我们') }}</span>
                    </router-link>
                </li>
            </ul> -->
            <p class="common-txt">{{ $t('©2018-2020 北京深客科技有限公司 版权所有 深客科技 京ICP备 19032835 增值电信业务经营许可证编号：京B-220192143') }}</p>
        </div>
    </div>
</template>

<script>
    export default {
        name: '',
        props: {},
        data() {
            return {

            };
        },
        methods: {
            
        },
        created() {
        },
        components: {
        },
        computed: {},
        watch: {
            
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
    .engine-web-foot{
        color: #929292;
        padding: 2rem 0px;
        .web-foot-body{
            .foot-page-intro-box{
                overflow: hidden;
                width: 30%;
                margin: 0px auto;
                .intro-item:first-child{
                    border-left: 0px;
                }
                .intro-item:last-child{
                    border-right: 0px;
                }
                .intro-item{
                    width: 25%;
                    float: left;
                    border-left: 1px solid #929292;
                    border-right: 1px solid #929292;
                    font-weight: 600;
                    a{
                        color: inherit;
                    }
                }
            }
            .common-txt{
                font-size: 0.6rem;
                margin-top: 1.5rem;
            }
        }
    }
</style>