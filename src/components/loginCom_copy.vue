<template>
    <div class="app-login">
        <div class="page-content">
            <div class="page-content-body">
                <div class="content-right">
                    <div class="login-body">
                        <div>
                            <slot name="extend"></slot>
                        </div>
                        <div class="login-title">
                            <el-menu mode="horizontal" v-bind:default-active="loginType" @select="loginTypeChange">
                                <el-menu-item index="1">密码登录</el-menu-item>
                                <el-menu-item index="2">验证码登录</el-menu-item>
                            </el-menu>
                        </div>
                        <el-form :model="info" :rules="rules" ref="ruleForm">
                            <div class="login-form">
                                <div class="input-box-user input-box-item">
                                    <el-form-item prop="username" class="with-country-code-select-box">
                                        <!-- <countryCodeCom :value.sync="info.countryVal" @change="countryCodeChange"></countryCodeCom> -->
                                        <el-input class="input-box-user-id" 
                                        name="login-username"
                                        @keyup.enter.native="loginSubmit"
                                        clearable placeholder="手机号" 
                                        v-model="info.username">
                                        </el-input>
                                    </el-form-item>
                                    
                                </div>
                                <div class="input-box-psw  input-box-item">
                                    <div class="psw-i" v-show="loginType==1">
                                        <el-form-item prop="password">
                                            <el-input class="input-box-user-psw" 
                                            name="login-password"
                                            @keyup.enter.native="loginSubmit"
                                            show-password placeholder="密码" 
                                            v-model="info.password"></el-input>
                                        </el-form-item>
                                    </div>
                                    <div class="code-i" v-show="loginType==2">
                                        <el-form-item prop="mobileCode">
                                            <el-input clearable placeholder="短信验证码" 
                                            @keyup.enter.native="loginSubmit"
                                            v-model="info.mobileCode"></el-input>
                                            <el-button class="send-code-btn" @click="sendMobileCode()" :disabled="timer.active">
                                                <span>发送</span>
                                                <span>
                                                    <timer v-show="timer.active" :type="timer.type" :active="timer.active" :count="timer.count" v-on:countEnd="countEnd"></timer>
                                                </span>
                                            </el-button>
                                        </el-form-item>
                                    </div>
                                </div>
                                <div class="login-sub  input-box-item">
                                    <el-button class="login-sub-btn login-register-button-bcg confirm" @click="loginSubmit()">
                                        <span class="txt">登录</span>
                                    </el-button>
                                </div>
                                <div class="login-options">
                                    <router-link to="/engine/forgetPsw"><el-button type="text">忘记密码</el-button></router-link>
                                    &nbsp;&nbsp;&nbsp;
                                    <router-link to="/engine/register"><el-button type="text">注册</el-button></router-link>
                                </div>
                            </div>
                        </el-form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import http from '../http.js'
    import localData from '../localData.js'
    import timer from './timer.vue'
    import countryCodeCom from './countryCode.vue'


    export default {
        name: 'login',
        props: {
            to: String,
            from: String
        },
        data(){
            return {
                loadDataStatus: false,
                fromRouter: this.$route.query.from || '/index',
                toRouter: this.$route.query.to || '/index',
                info: {
                    username: null,
                    password: null,
                    mobileCode: null,
                    countryVal: '',
                },
                loginType: '1',
                http: new http('/userApi'),
                timer:{
                    count: 60,
                    active: false,
                    type: 'minus'
                },
                rules: {
                    username: [
                        { required: true, message: '请输入您的手机号', trigger: 'blur' },
                    ],
                    password: [
                        { required: true, message: '请输入您的密码', trigger: 'blur' },
                    ],
                    mobileCode: [
                        { required: true, message: '请输入手机验证码', trigger: 'blur' },
                    ]
                },
            }
        },
        methods:{
            loginTypeChange(key){
                this.loginType = key;
            },
            infoCheck(){
                if(!this.info.username || this.info.username == '') return false
                let type = this.loginType;
                if(type == '1' && (!this.info.password || this.info.password == '')) return false
                if(type == '2' && (!this.info.mobileCode || this.info.mobileCode == '')) return false
                this.$forceUpdate()
                this.info.username = this.GLOBAL.ToCDB(this.info.username + '')
                return true
            },
            async loginForRegister(options){
                let post = {
                    username: options.username,
                    grant_type: 'sms_code',
                    client_id: 'golaxy_web',
                    sms_code: options.mobileCode,
                    scope: 'any'
                }
                let res = await this.request('user', {
                    url: '/oauth/token',
                    data: post,
                    headers:{
                        'Authorization': 'Basic Z29sYXh5X3dlYjp4aW5nemhlbjA3MzA='
                    }
                })
                this.loginHandle(res)
            },
            async loginSubmit(){
                this.LOADING.open()
                this.$refs['ruleForm'].validate()
                let grant_type = this.loginType == 1?'password': 'sms_code'
                if(!this.infoCheck()) return
                let post = {
                    username: this.info.username,
                    // username: this.loginUsername,
                    password: this.info.password,
                    grant_type: grant_type,
                    client_id: 'golaxy_web',
                    sms_code: this.info.mobileCode,
                    scope: 'any',
                    area: this.getCountryCode
                }
                let res = await this.request('user', {
                    url: '/oauth/token',
                    data: post,
                    headers:{
                        'Authorization': 'Basic Z29sYXh5X3dlYjp4aW5nemhlbjA3MzA='
                    }
                })
                this.loginHandle(res)
            },
            async loginHandle(res){
                if(!res || res.code != 0){
                    this.LOADING.close()
                    return
                }
                this.setLocalData(res)
                let r = await this.GLOBAL.userLevelInit()
                this.LOADING.close()
                this.$emit('close')
                this.turnOn()
            },
            setLocalData(res){
                if(!res.username) res.username = this.info.username
                let item = {
                    username: res.username,
                    access_token: res.access_token,
                    expires_in: res.expires_in,
                    refresh_token: res.refresh_token,
                    token_type: res.token_type,
                    nickname: res.nickname
                }
                this.GLOBAL.loginSet(res)
            },
            clearLocalData(){
                localData.clear();
            },
            update(data){
                for(var i in data){
                    this[i] = data[i]
                }
            },
            async sendCode(){
                let res = await this.request('user' ,{
                    url: '/sms/code',
                    method: 'GET',
                    data:{
                        username: this.info.username,
                        login: true,
                        // area: this.getCountryCode
                    }
                })
                return res
            },
            async sendMobileCode(){
                if(this.timer.active) return
                this.$refs['ruleForm'].validateField('username')
                if(!this.info.username || this.info.username == '') return
                let res = await this.sendCode()
                this.sendMobileCodeHandle(res)
            },
            sendMobileCodeHandle(res){
                if(!res || res.code != 0) return
                this.timer.active = true
            },
            countEnd(){
                this.timer.active = false
            },
            
            async request(type, options){
                let res = await this.GLOBAL.request(type, options)
                this.errHandle(res)
                return res
            },
            errHandle(res){
                let code = Number(res.code)
                let txt = res.errorMsg || res.error_description;
                let type = code != 0 ? 'error' : 'success';
                this.GLOBAL.MessageOpen({
                    type: type,
                    message: txt,
                    duration: 3000,
                    showClose: true
                })
                // this.GLOBAL.errHandle(res, 'login')
            },
            turnOff(){
                let path = this.fromRouter
                this.jumpToPage(path)
            },
            turnOn(){
                // let path = this.to || this.toRouter
                let path = this.to
                if(this.loginSuccessCallback) this.loginSuccessCallback()
                if(!path) return
                let f = this.GLOBAL.loginRouterCheck({path: path})
                if(!f){
                    this.GLOBAL.jumpToPageReplace(path)
                    return
                }
                this.GLOBAL.gotoGame()

            },
            jumpToPage(path, from, to){
                from = from || this.$route.path
                to = to || this.$route.path
                this.GLOBAL.jumpToPage(path, from, to)
            },
            setCallback(callback){
                this.loginSuccessCallback = callback
            },
            countryCodeChange(val){
                this.info.countryVal = val
            }
        },
        
        created(){
            // this.pageInit()
        },
        components: {
            timer,
            countryCodeCom
        },
        computed: {
            getCountryCode(){
                let data = this.info.countryVal
                if(data[0] != '0' || data[1] != '0') data = `00${this.info.countryVal}`
                return data
            },
            loginUsername(){
                return this.getCountryCode + '-' + this.info.username
            }
        },
        watch: {
            info: {
                handler(){
                    let username = this.info.username
                    let area
                    username = '' + username
                    if(!username || username.indexOf('-') == -1) return
                    username = username.substring(username.indexOf('-') + 1, username.length)
                    area = username.substring(0, username.length - (username.length - username.indexOf('-')))
                    this.info.countryVal = area
                    this.info.username = username
                },
                deep: true,
                immediate: true
            },
        }
    }
</script>

<style lang='less'>
    .app-login{
        width: 100%;
        min-height: 100%;
        background-size: 100% 100%;
        .login-box{
            .title{
                color: #fff;
                font-size: 2rem;
                position: absolute;
                top: -4rem;
                width: 100%;
                text-align: center;
            }
            width: 20rem;
            height: 13rem;
            position: absolute;
            top: 0px;
            left: 0px;
            bottom: 0px;
            right: 0px;
            margin: auto;
            
        }
        .login-body{
            width: 100%;
            height: 100%;
            // border-radius: 0.5rem;
            background: #fff;
            overflow: hidden;
            .login-form{
                padding: 0rem 1rem; 
            }
            .el-menu--horizontal>.el-menu-item{
                height: 2.5rem;
                line-height: 2.5rem;
                font-size: 0.7rem;
            }
            .login-sub-btn:active{
                // background: #292C34;
            }
            .login-sub-btn{
                width: 100%;
                // background: @storeRechargeCOlor;
                // color: #333;
                height: 2rem;
                font-size: 0.7rem;
                border-radius: 0px;
                padding: 0px;
                display: flex;
                align-items: center;
                justify-content: center;
                .txt{
                    font-size: 0.8rem;
                }
            }
            .el-input__inner{
                border-radius: 0px;
                border: 0px;
                border-bottom: 1px solid #DCDFE6;
            }
            .input-box-item{
                margin-bottom: 1rem;
            }
            .input-box-user{
                margin-top: 0.5rem;
                .el-form-item{
                    margin: 0px
                }
                .el-form-item__content{
                    display: flex;
                }
                .el-select-dropdown__wrap{
                    max-height: 10rem;
                }
            }
            .input-box-psw{
                .code-i{
                    .el-form-item{
                        width: 100%;
                        margin: 0px;
                        .el-form-item__content{
                            display: flex;
                        }
                    }
                    display: flex;
                    .send-code-btn{
                        margin-left: 1rem;
                        border-radius: 0px;
                        padding: 0px;
                        width: 5rem;
                    }
                }
            }
            .login-sub{
                margin: 0px;
                margin-top: 1.5rem;
            }
            .login-options{
                text-align: right;
                position: absolute;
                bottom: 1.7rem;
                right: 1rem;
                
                button{
                    span{
                        font-size: 0.75rem
                    }
                    padding: 0px;
                    line-height: 1rem;
                    height: 1rem;
                    color: #4B5569;
                }
            }
        }
        .page-content:after{
            content:'';
            min-height:inherit;
            font-size:0;
        }
        .page-content{
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            .page-content-body{
                width: 55.25rem;
                position: relative;
                // display: flex;
                // align-items: center;
                // justify-content: center;
                .content-left{
                    float: left;
                    width: 20.25rem;
                    height: 16.4rem;
                    background: url('@{assetsUrl}v6_2.png') no-repeat;
                    background-size: 100% auto;
                }
                .content-right{
                    width: 21.75rem;
                    height: 15rem;
                    position: relative;
                    top: 0px;
                    bottom: 0px;
                    right: 0px;
                    margin: auto;
                }
            }
        }
    }
</style>


