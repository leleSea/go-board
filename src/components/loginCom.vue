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
                                <el-menu-item index="1">{{ $t('密码登录') }}</el-menu-item>
                                <el-menu-item index="2">{{ $t('验证码登录') }}</el-menu-item>
                                <el-menu-item index="3">{{ $t('扫码登录') }}</el-menu-item>
                            </el-menu>
                        </div>
                        <el-form :model="info" :rules="rules" ref="ruleForm" v-show="loginType == 1 || loginType == 2">
                            <div class="login-form">
                                <div class="input-box-user input-box-item">
                                    <el-form-item prop="username" class="with-country-code-select-box">
                                        <!-- name="login-area" -->
                                        <countryCodeCom ref="countryCodeCom" @init="countryCodeComInit" :value.sync="info.countryVal" @change="countryCodeChange"></countryCodeCom>
                                        <!--  -->
                                        <el-input class="input-box-user-id" 
                                        name="login-username"
                                        @keyup.enter.native="loginSubmit"
                                        clearable :placeholder="$t('手机号')" 
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
                                            show-password :placeholder="$t('密码')" 
                                            v-model="info.password"></el-input>
                                        </el-form-item>
                                    </div>
                                    <div class="code-i" v-show="loginType==2">
                                        <el-form-item prop="mobileCode">
                                            <el-input clearable :placeholder="$t('短信验证码')" 
                                            @keyup.enter.native="loginSubmit"
                                            v-model="info.mobileCode"></el-input>
                                            <el-button class="send-code-btn" @click="sendMobileCode()" :disabled="timer.active">
                                                <span>{{ $t('发送') }}</span>
                                                <span>
                                                    <timer v-show="timer.active" :type="timer.type" :active="timer.active" :count="timer.count" v-on:countEnd="countEnd"></timer>
                                                </span>
                                            </el-button>
                                        </el-form-item>
                                    </div>
                                </div>
                                <div class="login-sub  input-box-item">
                                    <el-button class="login-sub-btn login-register-button-bcg confirm" @click="loginSubmit()">
                                        <span class="txt">{{ $t('登录') }}</span>
                                    </el-button>
                                </div>
                                <div class="login-options">
                                    <router-link to="/engine/forgetPsw"><el-button type="text">{{ $t('忘记密码') }}</el-button></router-link>
                                    &nbsp;&nbsp;&nbsp;
                                    <router-link to="/engine/register"><el-button type="text">{{ $t('注册') }}</el-button></router-link>
                                </div>
                            </div>
                        </el-form>
                        <div class="scan-login-box" v-show="loginType == 3" 
                            v-loading="qrCodeLoading"
                            element-loading-background="rgba(0, 0, 0, 0.0)"
                            element-loading-spinner="page-loading-icon-css light"
                        >
                            <div class="scan-body" v-show="uuid">
                                <div class="scan-qr-code-box item" ref="qrCodeBox">
                                    
                                    <div class="qrcode-box" :class="{'hand': qrcodeStateShow}">
                                        <div class="qrcode-state" v-if="qrcodeStateShow">
                                            <div class="qrcode-state-body">
                                                <div class="scan-icon-box">
                                                    <span class="state-icon" :class="{'success-icon el-icon-circle-check ': (qrcodeState == 1 || qrcodeState == 2) && 
                                                    !qrcodeInvalid, 'el-icon-circle-close fault-icon': qrcodeInvalid}"></span>
                                                </div>
                                                <div class="scan-state-txt">
                                                    <span class="txt" :class="{'success-icon': (qrcodeState == 1 || qrcodeState == 2) && 
                                                    !qrcodeInvalid, 'fault-icon': qrcodeInvalid}">{{$t(scanStateWord)}}</span>
                                                </div>
                                                <div class="qr-code-hand" v-if="qrcodeInvalid">
                                                    <el-button class="le-button store-button-bcg" @click="refreshQrcode">
                                                        <span class="txt">{{$t('刷新二维码')}}</span>
                                                    </el-button>
                                                </div>
                                            </div>
                                            
                                        </div>
                                        <div class="qr-code-box" id="qr_code_box"></div>
                                    </div>
                                </div>
                                <div class="scan-notice-box item">
                                    <img :src="`${GLOBAL.assetsUrl}/img/sca1_light.png`" class="scan-icon">
                                    <span class="txt">{{$t('打开星阵围棋APP扫一扫')}}</span>
                                </div>
                            </div>
                            
                        </div>
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
    import userApi from '../API/user'
    import QRCode from 'qrcodejs2'


    export default {
        name: 'login',
        props: {
            to: String,
            from: String
        },
        data(){
            return {
                _user: null,
                qrCodeLoading: false,
                qrcodeClass: null,
                scanStatueCheck: false,
                qrcodeState: 6016,
                uuid: null,
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
                rulesCopy: {
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
                this.qrCodeControl(key)
            },
            qrCodeControl(){
                this.$nextTick(() => {
                    let ele = document.getElementById('qr_code_box')
                    console.log(ele)
                    if(ele) document.getElementById('qr_code_box').innerHTML = ''
                    this.qrCodeLoading = false
                    this.qrcodeClass = null
                    this.scanStatueCheck = false
                    this.qrcodeState = false
                    this.uuid = null
                    this.loadDataStatus = false
                    let index = this.loginType
                    if(index != 3){
                        this.uuid = null
                        return
                    }  
                    this.qrCodeDataRequest()
                })
                
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
                this.$refs['ruleForm'].validate()
                let grant_type = this.loginType == 1 ? 'password': 'sms_code'
                if(!this.infoCheck()) return
                this.LOADING.open()
                let post = {
                    // username: this.info.username,
                    username: this.loginUsername,
                    password: this.info.password,
                    grant_type: grant_type,
                    client_id: 'golaxy_web',
                    sms_code: this.info.mobileCode,
                    scope: 'any',
                }
                let res = await this.request('user', {
                    url: '/oauth/token',
                    data: post,
                    headers:{
                        'Authorization': 'Basic Z29sYXh5X3dlYjp4aW5nemhlbjA3MzA='
                    }
                })
                if(res.code == 0){
                    localStorage.setItem('classtoken',res.token_type+' '+res.access_token)
                }
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
                if(!res.username) res.username = this.loginUsername
                let item = {
                    username: this.loginUsername,
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
                // let res = await this.request('user' ,{
                //     url: '/sms/code',
                //     method: 'GET',
                //     data:{
                //         username: this.info.username,
                //         login: true,
                //         area: this.getCountryCode
                //     }
                // })
                // return res
                let res = await this.GLOBAL.sendSmsCodeLogin(this.info.username, this.getCountryCode, true)
                if(res && res.code == 0){
                    this.GLOBAL.MessageOpen({
                        type: 'success',
                        message: this.$i18n.t(this.GLOBAL.__ERRORMSGDEFINE.errorMsg['smsCodeRegister']['0'])
                    })
                }
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
                if(!txt){
                    try{
                        txt = this.GLOBAL.__ERRORMSGDEFINE.errorMsg['/userApi/oauth/token'][res.msg] || this.GLOBAL.__ERRORMSGDEFINE.errorMsg['/userApi/oauth/token'][res.code]
                    }catch(e){}
                }
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
            },
            countryCodeReset(area){
                area = area || this.info.countryVal
                if(!this.$refs['countryCodeCom']) return
                this.$refs['countryCodeCom'].countryCodeReset(area)
            },
            countryCodeComInit(){
                let username = this.GLOBAL.getLocalItem('keep_login_username')
                if(!username) return
                this.info.username = username
            },
            async qrCodeDataRequest(){
                console.log(this._user)
                this.qrCodeLoading = true
                let res = await this._user.loginUuidGet()
                if(!res){
                    this.qrCodeLoading = false
                    return
                }
                this.qrCodeHandl(res)
            },
            qrCodeHandl(uuid){
                let text = `golaxy_url&&&${uuid}`
                this.qrcodeClass = new QRCode('qr_code_box', {
                    width: 300,
                    height: 300,
                    text: text,
                })
                this.$nextTick(() => {
                    setTimeout(() => {
                        this.uuid = uuid
                        this.qrCodeLoading = false
                        this.qrcodeStatusCheckOn()
                    }, 100);
                })
            },
            async qrcodeStatusCheckOn(){
                if(!this.uuid) return
                let sp = 1000
                let timeBefore = parseInt((new Date).getTime() / 1000)
                this.scanStatueCheck = true
                let res = await this._user.scanStateGet(this.uuid)
                let timeAfter = parseInt((new Date).getTime() / 1000)
                if(res === false)
                console.log(res)
                this.qrcodeStatusSet(res)
                if(this.qrcodeCheckOver(res)){
                    if(res == 2) this.loginByUuid()
                    if(this.scanLoginCancel){
                        setTimeout(() => {
                            this.refreshQrcode()
                        }, 1500);
                    }
                    return
                }
                let t = sp - (timeAfter - timeBefore)
                console.log(t)
                setTimeout(() => {
                    this.qrcodeStatusCheckOn()
                }, t);
            },
            qrcodeStatusCheckOff(){
                this.scanStatueCheck = false
            },
            qrcodeCheckOver(state){
                if(state === false) return
                state = Number(state)
                console.log(this.qrcodeInvalid)
                return state === 2 || this.qrcodeInvalid || this.scanLoginCancel
            },
            qrcodeStatusSet(data){
                this.qrcodeState = data
            },
            async loginByUuid(){
                


                let uuid = this.uuid
                let res = await this._user.loginByUuid(uuid)
                if(!res || res.code != 0) return false
                let username = await this._user.getUsernameByUuid(uuid)
                console.log(username)
                if(username) res.username = username
                this.GLOBAL.MessageOpen({
                    type: 'success',
                    message: this.$i18n.t(this.GLOBAL.__ERRORMSGDEFINE.errorMsg['smsCodeRegister']['0'])
                })
                console.log(this.GLOBAL.deepCopy(res))
                this.setLocalData(res)
                let r = await this.GLOBAL.userLevelInit()
                this.LOADING.close()
                this.$emit('close')
                this.turnOn()

            },
            refreshQrcode(){
                this.qrCodeControl()
            },
        },
        
        created(){
            this._user = new userApi()
            // this.pageInit()
        },
        mounted() {
            
        },
        components: {
            timer,
            countryCodeCom
        },
        computed: {
            qrcodeStateShow(){
                return this.qrcodeState !== null && this.qrcodeState != 0
            },
            qrcodeInvalid(){
                return Number(this.qrcodeState) == 6016
            },
            scanLoginCancel(){
                return Number(this.qrcodeState) == 6019
            },
            scanStateWord(){
                let state = Number(this.qrcodeState)
                let word = ''
                switch(state){
                    case 0:
                        word = ''
                        break
                    case 1:
                        word = '扫描成功'
                        break
                    case 2:
                        word = '已确认'
                        break
                    case 6016:
                        word = '二维码已失效'
                        break
                    case 6019:
                        word = '已取消登录'
                        break
                }
                return word
            },
            getCountryCode(){
                let data = this.info.countryVal
                if(data[0] != '0' || data[1] != '0') data = `00${this.info.countryVal}`
                return data
            },
            loginUsername(){
                return this.getCountryCode + '-' + this.info.username
            }
        },
        beforeDestroy(){
            this.uuid = null
        },
        watch: {
            info: {
                handler(){
                    let username = this.info.username
                    let area
                    username = '' + username
                    if(!username || username.indexOf('-') == -1) return
                    area = username.substring(0, username.length - (username.length - username.indexOf('-')))
                    username = username.substring(username.indexOf('-') + 1, username.length)
                    
                    this.info.countryVal = area
                    this.info.username = username
                    this.countryCodeReset(area)
                },
                deep: true,
                immediate: true
            },
            languageLang: {
                handler(){
                    let list = this.GLOBAL.deepCopy(this.rulesCopy)
                    for(var i in list){
                        if(!this.GLOBAL.isArray(list[i])) continue
                        for(var j in list[i]){
                            list[i][j].message = this.$i18n.t(list[i][j].message )
                        }
                    }
                    this.rules = list
                },
                immediate: true,
                deep: true
            }
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
            .scan-login-box{
                padding: 1rem 0px;
                width: 100%;
                height: calc(100% - 2.5rem);
                .scan-qr-code-box{
                    .qr-code-box{
                        width: 100%;
                    }
                    .qrcode-box{
                        position: relative;
                        width: 8rem;
                        margin: 0px auto;
                        // width: 100%;
                        display: flex;
                        justify-content: center;
                        img{
                            width: 100%;
                            height: auto;
                        }
                    }
                    .qrcode-box.hand{
                        img{
                            opacity: 0.1;
                        }
                    }
                    .qrcode-state{
                        position: absolute;
                        top: 0px;
                        left: 0px;
                        width: 100%;
                        height: 100%;
                        // background: rgba(0, 0, 0, 0.4);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        .scan-icon-box{
                            margin-bottom: 0.5rem;
                        }
                        .qr-code-hand{
                            margin-top: 0.5rem;
                            .le-button{
                                width: 5rem;
                                height: 1.5rem;
                            }
                        }
                        .state-icon{
                            font-size: 1.5rem;
                        }
                        .success-icon{
                            color: #59c828;
                        }
                        .fault-icon{
                            color: @textButtonColor;
                        }
                        .qrcode-state-body{
                            z-index: 1;
                        }
                        .scan-state-txt{
                            
                        }
                    }
                    .qr-code-img{
                        
                    }
                }
                .scan-notice-box{
                    margin-top: 0.5rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 100%;
                    color: @mainButtonBcg;
                    .scan-icon{
                        width: 1rem;
                        margin-right: 0.3rem;
                    }
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
        .login-title{
            .el-menu{
                display: flex;
            }
        }
    }
</style>


