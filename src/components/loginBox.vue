<!--  -->
<template>
    <div class='login-component-box'>
        <div class="none-login-box">
            <div class="login-item login">
                <router-link to="/engine/login">
                    <el-button class="btn-login">
                        <span class="txt">{{ $t('登录') }}</span>
                    </el-button>
                </router-link>
            </div>
            <div class="login-item register">
                <router-link to="/engine/register">
                    <el-button class="btn-register">
                        <span class="txt">{{ $t('免费注册') }}</span>
                    </el-button>
                </router-link>
                <!-- {'hide': registerNotice.hide} -->
                <div class="register-notice-box" :class="noticeCssCul" v-show="registerNotice.active" @click="GLOBAL.jumpToPage('/engine/register')">
                    <span class="el-icon-close close-btn" @click.stop="registerNoticeClose"></span>
                    <div class="notice-icon">
                        <img :src="`${GLOBAL.assetsUrl}/img/reg1.png`" alt="">
                    </div>
                    <span class="txt">{{ $t('注册可领新手大礼包') }}！</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: '',
        props: {
            notice: String
        },
        data() {
            return {
                registerNotice: {
                        hide: false,
                        active: true
                    },
            };
        },
        methods: {
            registerNoticeClose(){
                this.registerNotice.hide = true
                setTimeout(() => {
                    this.registerNotice.active = false
                }, 500);
            }
        },
        created() {

        },
        components: {
        },
        computed: {
            noticeCssCul(){
                let css = ''
                if(this.registerNotice.hide) css += 'hide'
                let notice = this.notice || 'top'
                css = `${css} ${notice}`
                return css
            }
        },
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
    .login-component-box{
        .none-login-box{
            width: 100%;
            display: flex;
            .login-item{
                width: 50%;
                .el-button{
                    padding: 0px;
                    height: 1.5rem;
                    width: 100%;
                    border: 0px;
                    border-radius: 0.15rem;
                }
            }
            .login-item.login{
                padding-right: 0.25rem;
            }
            .login-item.register{
                padding-left: 0.25rem;
                position: relative;
                .register-notice-box.hide{
                    opacity: 0;
                }
                .register-notice-box.top{
                    top: -2.3rem;
                    left: 0rem;
                    .notice-icon{
                        bottom: -0.6rem;
                        left: 1rem;
                    }
                }
                .register-notice-box.bottom{
                    bottom: -3rem;
                    left: 0rem;
                    .notice-icon{
                        top: -0.6rem;
                        left: 1rem;
                        transform: rotate(180deg);
                    }
                }
                .register-notice-box{
                    transition: all .3s;
                    position: absolute;
                    padding: 0.2rem 0.7rem;
                    // padding: 0px;
                    border-radius: 0.1rem;
                    background: #fff;
                    color: #E10000;
                    z-index: 999;
                    height: 1.4rem;
                    // width: 7.4rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    .txt{
                        font-size: 0.6rem;
                    }
                    .notice-icon{
                        position: absolute;
                        img{
                            width: 0.5rem;
                        }
                    }
                    .close-btn{
                        position: absolute;
                        right: 0.05rem;
                        top: 0.05rem;
                        font-size: 0.6rem;
                        color: #999;
                        width: auto;
                        margin: 0;
                    }
                }
            }
            .btn-login{
                background: @loginBtnBcg;
                color: @loginBtnColor;
            }
            .btn-register{
                background: @registerBtnBcg;
                color: @registerBtnColor;
                position: relative;
                
                
            }
            .txt{
                font-size: 0.7rem;
            }
        }
    }
    
</style>