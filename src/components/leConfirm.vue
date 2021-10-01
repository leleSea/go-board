<!--  -->
<template>
<!-- :class="classCul" -->
    <div class='le-confirm' v-show="active">
        <div class="le-confirm-body">
            <h1 class="le-confirm-title">
                <span class="txt">{{options.title}}</span>
                <span class="close-icon el-icon-close" @click="closeConfirm"></span>
            </h1>
            <div class="le-confirm-content" v-show="options.message">
                <p class="txt" v-html="options.message"></p>
            </div>
            <div class="le-confirm-content-s">
                <slot name="message"></slot>
            </div>
            <div class="le-confirm-foot" v-if="options.button && options.button.length">
                <el-button 
                :loading="loadingCul(i)"
                class="le-confirm-btn" :class="btnCssCul(v)" v-for="(v, i) in options.button" :key="i" @click="funHandle(v)" :disabled="v.disabled">{{v.name}}</el-button>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'leConfirm',
        props: {
            // class: String
            loading: Array
        },
        data() {
            return {
                active: false,
                options: {},
                defaultOpt: {
                    title: '',
                    message: '',
                    autoClose: true,
                    button: [
                    ],
                },
            };
        },
        methods: {
            loadingCul(index){
                if(!this.loading || !this.loading.length) return false
                return this.loading[index]
            },
            open(opt){
                opt = opt || {}
                this.options = this.GLOBAL.deepCopy(this.defaultOpt)
                this.response = null
                let promise = new Promise((res, rej) => {
                    this.response = res
                    let options = this.options
                    for(var i in options){
                        if(opt[i] != undefined) options[i] = opt[i]
                    }
                    this.options = options
                    this.active = true
                })
                return promise
            },
            close(){
                this.active = false
                this.$forceUpdate()
            },
            closeConfirm(){
                if(this.response){
                    let button = this.options.button
                    let res
                    if(button && button.length){
                        for(var i in button){
                            if(button[i].name == '取消'){
                                res = button[i]
                            }
                        }
                    }
                    this.response(res)
                }
                this.close()
            },
            funHandle(val){
                // if(!val.fun) return
                if(val.fun)val.fun()
                else if(this.response) this.response(val)
                if(this.options && this.options.autoClose) this.close()
            },
            btnCssCul(val){
                if(!val.type || val.type == 'confirm') return 'confirm store-button-bcg'
                if(val.type == 'cancel') return 'cancel-login-register-button-bcg cancel'
                return val.type
            }
        },
        created() {
            this.options = this.GLOBAL.deepCopy(this.defaultOpt)
        },
        components: {
        },
        computed: {
            classCul(){
                return this.class ||''
            },
        },
        watch: {
            active: {
                handler(val){
                    val ? this.$emit('open') : this.$emit('close')
                },
                deep: true
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
    .le-confirm{
        position: fixed;
        top: 0px;
        left: 0px;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        // z-index: 99999;
        z-index: @leConfirmZIndex;
        
    }
    .le-confirm-body{
        min-width: 30rem;
        // background: #ccc;
        background: @leconfirmContentBcg;
        color: #333;
    }
    .le-confirm-title{
        padding: 0.8rem 0px;
        text-align: center;
        background: @leconfirmTitleBcg;
        position: relative;
        color: #333;
        .txt{
            font-size: 1rem;
        }
        .close-icon{
            cursor: pointer;
            position: absolute;
            right: 0.2rem;
            top: 0.2rem;
            font-size: 1.1rem;
            color: #999;
        }
    }
    .le-confirm-content{
        padding: 1rem 2rem;
        line-height: 1.5rem;
        text-align: center;
        .txt{
            font-size: 0.8rem;
            display: inline-block;
            text-align: center;
        }
        i{
            font-size: 0px;
            width: 0px;
            height: 100%;
            display: inline-block;
            vertical-align: middle;
        }
    }
    .le-confirm-content-s{
        padding: 0px 3rem;
    }
    .le-confirm-foot{
        // padding: 0.5rem 0px;
        padding-bottom: 1rem;
        display: flex;
        align-items: center;
        justify-content: center;
        .el-button:last-child{
            margin: 0px;
        }
        .el-button.cancel{
            // background: @leconfirmCancelBcg;
            // color: #333;
            // border: 1px solid #ccc;
        }
        .el-button.confirm{
            // background: @storeRechargeCOlor;
            // color: #333;
            // border: 1px solid #333;
        }
        .el-button{
            margin: 0px;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 0px;
            width: 6rem;
            height: 1.6rem;
            margin-right: 1rem;
        }
    }
</style>