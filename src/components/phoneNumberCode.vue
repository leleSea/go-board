<!--  -->
<template>
    <div class='phone-number-code'>
        <div class="number-input-box">
            <countryCode ref="countryCode" :value.sync="countryVal" @change="countryCodeChange" class="country-code"></countryCode>
            <el-input class="phone-number-input" v-model="number" @input="numberInput" type="number"></el-input>
            <div class="error-box recharge-button">
                <span class="txt">{{$t(errorTxt)}}</span>
            </div>
        </div>
        <el-button class="send-code-btn" @click="sendSmsCode" :disabled="timeShow !== null" :loading="loading">
            <span class="txt">{{$t(sendTxtCul)}}</span>
        </el-button>
        
    </div>
</template>

<script>
    import countryCode from "./countryCode.vue"

    export default {
        name: 'phoneNumberCode',
        props: {
            sendTxt: String,
            countTimeNum: Number
        },
        data() {
            return {
                number: null,
                code: null,
                errorTxt: null,
                countryVal: null,
                interval: null,
                timeout: null,
                timeShow: null,
                status: 0,
                defaultTime: 60,
                loading: false,
            };
        },
        methods: {
            sendSmsCode(){
                if(this.timeShow !== null) return
                let res = this.dataCheck()
                if(res.code != 0) this.errorTxt = res.errorMsg
                else this.errorTxt = null
                if(this.errorTxt) return
                this.loading = true
                let phoneNumber = this.number
                this.$emit('sendSmsCode', {
                    // phoneNumber: this.numberTxt,
                    phoneNumber: this.number,
                    area: this.countryVal
                })
            },
            sendSmsCodeAfter(res){
                this.loading = false
                if(!res || res.code != 0) return
                this.countTimeAction()
            },
            numberInput(){
                this.errorTxt = null
            },
            countryCodeChange(val){
                this.countryVal = val
            },
            countTimeAction(){
                this.timeClear()
                let num = this.countTimeNumCul * 1000
                this.timeShow = this.countTimeNumCul
                setTimeout(() => {
                    this.timeClear()
                    this.timeShow = null
                }, num);
                this.interval = setInterval(() => {
                    if(this.timeShow > 0)
                        this.timeShow--
                }, 1000);
            },
            timeClear(){
                clearInterval(this.interval)
            },
            dataCheck(){
                let c = /^1[3456789]\d{9}$/
                let msg = c.test(this.number) ? null : '请填写正确的手机号'
                let res = {code: 0}
                if(msg){
                    res.code = 1
                    res.error = 'phoneNumber'
                    res.errorMsg = msg
                }
                return res
            },
        },
        created() {

        },
        components: {
            countryCode
        },
        computed: {
            numberTxt(){
                let code = this.countryVal, number = this.number
                return `${code}${number}`
            },
            numberTxtSplit(){
                let code = this.countryVal, number = this.number
                return `${code}-${number}`
            },
            countTimeNumCul(){
                return this.countTimeNum === undefined ? this.defaultTime : this.countTimeNum
            },
            sendTxtCul(){
                if(this.timeShow === null) return this.sendTxt || '发送验证码'
                return this.timeShow
            },
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
    .phone-number-code{
        position: relative;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        .el-input{
            width: auto;
        }
        
        .el-button{
            padding: 0px;
            height: 1.5rem;
            width: 5rem;
            margin-left: 0.5rem;
        }
        .number-input-box{
            position: relative;
            display: flex;
            .country-code{
                margin-right: 0.2rem;
                .el-input__inner{
                    width: 3.5rem;
                }
            }
            .el-input__inner{
                height: 1.5rem;
                width: auto;
                padding: 0px 0px 0px 0.2rem;
            }
        }
        .error-box{
            position: absolute;
            bottom: -1rem;
            left: 0px;
            width: 100%;
            text-align: center;
            .txt{
                font-size: 0.6rem;
            }
        }
    }
</style>