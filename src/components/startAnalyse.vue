<!--  -->
<template>
    <div class='start-analyse'>
        <le-confirm ref="leConfirm">
            <template v-slot:message>
                <div class="balance-box">
                    <div class="balance-not-enough">
                        <div class="message">
                            <span class="txt">{{$t('请选择研究配置')}}</span>
                            <!-- <span class="el-icon-refresh refresh-icon"></span> -->
                        </div>
                    </div>
                </div>
                <div class="get-prob-type" >
                    <div class="purchase-7003">
                        <planSelectEngine ref="planSelectEngine" 
                        v-on:update="update" 
                        v-on:confirmSet="confirmSet" 
                        @takeFun="takeFun" 
                        @change="planChange"
                        :username.sync="username"
                        :cardPlanNowApp.sync="cardPlanNowApp"
                        :theme.sync="theme"></planSelectEngine>
                        <div class="purchase-fun">
                            <el-button :loading="actionLoading" class="le-button confirm store-button-bcg" @click="confirm">{{$t('确定')}}</el-button>
                            <el-button :disabled="actionLoading" class="le-button confirm store-button-bcg cancel-login-register-button-bcg cancel" @click="cancel">{{$t('取消')}}</el-button>
                        </div>
                    </div>
                </div>
                
            </template>
        </le-confirm>
    </div>
</template>

<script>
    import planSelectEngine from './planSelectEngine.vue'
    export default {
        name: 'startAnalyse',
        props: {
            username: String,
            cardPlanNowApp: Object,
            theme: String
        },
        data() {
            return {
                actionLoading: false,
                response: null,
                planValue: null
            };
        },
        methods: {
            close(){
                this.$refs['leConfirm'].close()
            },
            cancel(){
                this.returnByRes(false)
            },
            returnByRes(res){
                this.close()
                this.responseAction(res)
            },
            responseAction(res){
                if(this.response) this.response(res)
            },
            update(options){
                let position = this.position
                for(var i in options){
                    this[i] = options[i]
                }
            },
            confirmSet(opt){
                let res = opt.res, enginePlan = opt.enginePlan
                if(res && res.code == 0){
                    // this.GLOBAL.gotoEngine()
                    this.returnByRes(res)
                }
                this.actionLoading = false
            },
            takeFun(opt){
                let fun = opt.fun
                if(this[fun]) this[fun](opt.data)
            },
            open(){
                this.openBefore()
                let promise = new Promise((success) => {
                    this.response = success
                    this.openCheck().then((res) => {
                        if(res == 0)
                            this.$refs['leConfirm'].open({
                                autoClose: false,
                            })
                        else{
                            success(res)
                        }
                    })
                    
                })
                return promise
            },
            openBefore(){
                this.actionLoading = false
            },
            async engineCheck(){
                await this.GLOBAL.pageEngineCheck()
                if(!this.$store.state.engine_id){
                    return 0
                }else{
                    let f = this.GLOBAL.engineIsAvailable()
                    if(!f) return -1
                    return -2
                }
            },
            async openCheck(){
                let res = await this.engineCheck()
                if(res == 0) await this.planRefresh()
                return res
                
            },
            async planRefresh(){
                if(!this.$refs['planSelectEngine']) return
                return this.$refs['planSelectEngine'].pageRefresh()
            },
            confirm(){
                if(this.planValue === null) return
                this.actionLoading = true
                this.$refs['planSelectEngine'].confirmSet()
                this.LOADING.close()
            },
            planChange(val){
                console.log(val)
                this.planValue = val
            },
        },
        created() {

        },
        components: {
            planSelectEngine
        },
        computed: {
            
        },
        watch: {},
        mounted() {
            // this.open()
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
<style lang='less' src="../assets/css/prob7003.less"></style>
<style lang='less'>
    .start-analyse{
        .get-prob-type{
            .purchase-7003{
                width: 22rem;
                .purchase-fun{
                    margin-top: 1rem;
                    display: flex;
                    justify-content: center;
                    .el-button{
                        width: 6rem;
                        height: 1.6rem;
                        margin-right: 1rem;
                    }
                    .el-button:last-child{
                        margin: 0px;
                    }
                }
            }
        }
        .balance-box{
            .balance-not-enough{
                .message{
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    .refresh-icon{
                        font-size: 1rem;
                        margin-left: 0.5rem;
                    }
                }
            }
        }
    }
</style>
