<template>
    <el-dialog
    class="register"
    title="新用户注册"
    :visible.sync="registerActive"
    width="30%"
    :close-on-click-modal="false"
    :before-close="turnOff">
    <!-- <span>这是一段信息</span> -->
    <el-form :model="info" :rules="rules" ref="ruleForm">
        <el-form-item prop="username">
            <el-tooltip placement="top-start" effect="light" :content="infoNotice.username">
                <el-input v-model.number="info.username" clearable placeholder="请输入手机号"></el-input>
            </el-tooltip>
        </el-form-item>
        <el-form-item class="mobile-code-box" prop="mobileCode">
            <el-tooltip placement="top-start" effect="light" :content="infoNotice.mobileCode">
                <el-input v-model="info.mobileCode" clearable placeholder="短信验证码"></el-input>
            </el-tooltip>
            <el-button class="mobile-code-btn" @click="sendMobileCode()" :disabled="timer.active">
                <span v-show="!timer.active">发送</span>
                <span>
                    <timer v-show="timer.active" :type="timer.type" :active="timer.active" :count="timer.count" v-on:countEnd="countEnd"></timer>
                </span>
            </el-button>
        </el-form-item>
        <el-form-item prop="password">
            
            <el-tooltip placement="top-start" effect="light" :content="infoNotice.password">
                <el-input type="password" v-model="info.password" show-password  placeholder="请设置您的密码"></el-input>
            </el-tooltip>
        </el-form-item>
        <el-form-item prop="conPsw">
            <el-tooltip placement="top-start" effect="light" :content="infoNotice.conPsw">
                <el-input type="password" v-model="info.conPsw" show-password  placeholder="请再次输入您的密码"></el-input>
            </el-tooltip>
        </el-form-item>
        <el-form-item prop="nickname">
            <el-tooltip placement="top-start" effect="light" :content="infoNotice.nickname">
                <el-input v-model="info.nickname" placeholder="请输入昵称" ></el-input>
            </el-tooltip>
        </el-form-item>
        <el-form-item class="submit-btn">
            <!-- <span slot="footer" class="dialog-footer"> -->
                <el-button @click="turnOff()">取 消</el-button>
                <el-button type="primary" @click="submit('ruleForm')">确 定</el-button>
            <!-- </span> -->
        </el-form-item>
    </el-form>
    </el-dialog>
</template>

<script>
    import http from '../http.js'
    import errMsg from '../assets/errorMsg.js'
    import { Promise } from 'q';
    import timer from './timer'

    export default {
        name: 'app-register',
        data(){
            let dataCheck = (rule, val, callback) => {
                let n = rule.field;
                let msg, c
                if(!val || val === '') {
                    msg = new Error(errMsg['form'][n]['1'])
                }else{
                    switch(n){
                        case 'username':
                            c = /^1[3456789]\d{9}$/
                            msg = c.test(val) ? undefined: new Error(errMsg['form'][n]['2'])
                            break
                        case 'password':
                            c = /^.*(?=.{6,})(?=.*\d)(?=.*[a-z,A-Z]).*$/
                            msg = c.test(val) ? undefined: new Error(errMsg['form'][n]['2'])
                            break
                        case 'conPsw':
                            if(val !== this.info.password){
                                msg = new Error(errMsg['form'][n]['2'])
                            }
                            break
                        case 'nickname':
                            if(!val || val == ''){
                                msg = new Error(errMsg['form'][n]['1'])
                            }
                    }
                }
                this.infoStatus[n] = msg ? false: true
                callback(msg)
            }

            return {
                timer:{
                    count: 60,
                    active: false,
                    type: 'minus'
                },
                info:{
                    delivery: false,
                    username: null,
                    password: null,
                    mobileCode:null,
                    conPsw:null,
                    nickname:'',
                    registerActives: false
                },
                infoNotice:{
                    username: '请输入11位手机号',
                    mobileCode: '请输入6位验证码',
                    password: '请输入6-16位密码，至少包含一位字母及数字',
                    conPsw: '请再次输入密码',
                    nickname: '请输入昵称'
                },
                infoStatus:{
                    username: false,
                    password: false,
                    mobileCode:false,
                    conPsw:false,
                },
                http: new http('/userApi'),
                rules:{
                    username:[
                        {validator: dataCheck, trigger: 'blur'}
                    ],
                    mobileCode:[
                        { required: true, message: '请输入短信验证码', trigger: 'blur' },
                        { min: 6, max: 6, message: '请输入正确的验证码', trigger: 'blur' }
                    ],
                    password: [
                        {validator: dataCheck, trigger: 'blur'}
                        // { required: true, message: '请输入短信验证码', trigger: 'blur' },
                        // { min: 6, max: 16, message: '请输入短信验证码', trigger: 'blur' },
                    ],
                    conPsw: [
                        {validator: dataCheck, trigger: 'blur'}
                        // { required: true, message: '请确认您的密码', trigger: 'blur' },
                    ],
                    nickname: [
                        {validator: dataCheck, trigger: 'blur'}
                    ]
                }
            }
        },
        props: {
            registerActive: Boolean
        },
        created:function(){
            this.registerActives = this.registerActive
        },
        methods:{
            turnOff:function(){
                this.$emit('update', {registerActive: false})
                this.registerActives = false;
                this.$refs['ruleForm'].resetFields();
            },
            async infoCheck(formName){
                let val = await this.$refs[formName].validate()
                return val
            },
            async sendCode(){
                // return {
                //     code: 0,
                //     msg: '发送成功'
                // }
                let res = await this.request('user' ,{
                    url: '/sms/code',
                    method: 'GET',
                    data:{
                        username: this.info.username,
                        login: false
                    }
                })
                return res
            },
            async sendMobileCode(){
                if(this.timer.active) return
                this.$refs['ruleForm'].validateField('username')
                if(!this.infoStatus.username) return
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
            submit(formName){
                this.$refs[formName].validate()
                .then(val => {
                    if(!val) return new Promise(res => { res(false) })
                    return this.request('user', {
                        url: '/register',
                        data:{
                            username: this.info.username,
                            password: this.info.password,
                            code: this.info.mobileCode,
                            nickname: this.info.nickname
                        }
                    }).then((res) => {
                        if(res && res.code == 0){
                            setTimeout(() => {
                                this.login()
                                this.turnOff()
                            }, 1000);
                        }
                    })
                }).then(res => {
                })
            },
            timerUpdate(val){
            },
            login(){
                this.$emit('loginForRegister', {
                    username: this.info.username,
                    mobileCode: this.info.mobileCode
                })
            },
            async request(type, options){
                this.LOADING.open()
                let res = await this.http.request(type, options)
                this.errHandle(res)
                this.LOADING.close()
                return res
            },
            errHandle(res){
                let code = Number(res.code)
                let txt = res.errorMsg;
                let type = code != 0 ? 'error' : 'success';
                this.$message({
                    type: type,
                    message: txt,
                    duration: 3000,
                    showClose: true
                })
            }
        },
        components: {
            timer
        },
        beforeDestory(){
            this.timer.active = false
        }
    }
</script>

<style lang='less'>
    .register{
        .el-dialog{
            // border-radius: 0.5rem;
            border-radius: 0px;
        }
        .mobile-code-box{
            .el-form-item__content{
                display: flex;
                align-items: center;
                .mobile-code-btn{
                    margin-left: 2rem;
                    width: 6rem;
                    height: 1.84rem;
                    border-radius: 0px;
                    padding: 0px;
                }
            }
        }
        .el-input{
            input{
                border-radius: 0px;
            }
        }   
        .submit-btn{
            button{
                width: 6rem;
                height: 1.84rem;
                border-radius: 0px;
                padding: 0px;
            }
        }
    }
    
    
</style>


