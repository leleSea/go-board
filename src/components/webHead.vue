<template>
    <div class="web-head" :class="fontColor">
        <div class="body">
            <!-- <div class="item logo">
                <div class="logo-img" @click="toindex"></div>
            </div> -->
            <div class="item menu">
                <el-menu class="el-menu-demo" :class="{'login': $store.state.username, 'guest': !$store.state.username}" mode="horizontal" menu-trigger="hover" :unique-opened="true">
                    <el-menu-item index="3" @click="jumpToPage('/indx')">{{ $t('主页') }}</el-menu-item>
                    <!-- <el-menu-item index="3" v-if="$route.path != '/index'" @click="jumpToPage('/index')">{{GLOBAL.language.index}}</el-menu-item> -->
                    <el-menu-item index="3" @click="jumpToPage('/productIntro')">{{$t(GLOBAL.language.headPage.h1)}}</el-menu-item>
                    <el-menu-item index="3" @click="jumpToPage('/weblink')">{{$t(GLOBAL.language.headPage.h2)}}</el-menu-item>
                    <el-menu-item index="3" @click="jumpToPage('/intro')">{{$t(GLOBAL.language.headPage.h3)}}</el-menu-item>
                    <el-menu-item index="3" @click="jumpToPage('/contactus')">{{$t(GLOBAL.language.headPage.h4)}}</el-menu-item>
                    <!-- <el-submenu index="4" :popper-append-to-body="false">
                        <template slot="title">{{GLOBAL.language.headPage.h5}}</template>
                        <el-menu-item index="2-1" @click="gotoRecharge">{{GLOBAL.language.headPage.h6}}</el-menu-item>
                        <el-menu-item index="2-2" @click="gotoRechargeRecord">{{GLOBAL.language.headPage.h7}}</el-menu-item>
                    </el-submenu> -->
                    <!-- <el-menu-item index="3" @click="gotoCard">{{GLOBAL.language.headPage.h12}}</el-menu-item> -->
                    <el-menu-item class="menu-item-sp" v-if="!$store.state.username" index="5" @click="jumpToPage('/engine/login')">
                        <!-- <span>{{GLOBAL.language.public.login}}</span> -->
                        <!-- <el-button class="login-register-btn">
                            <span>{{GLOBAL.language.public.login}}/{{GLOBAL.language.public.register}}</span>
                        </el-button> -->
                        <loginBox ref="loginBox" notice="bottom"></loginBox>
                    </el-menu-item>
                    <!-- <el-menu-item index="6" v-if="!$store.state.username" @click="jumpToPage('/register')">{{GLOBAL.language.public.register}}</el-menu-item> -->
                </el-menu>
                <el-dropdown class="web-head-dropdown" trigger="hover" @command="dropCommandHandle" @visible-change="myMenuChange" v-if="$store.state.username">
                    <div class="it-i a tem">
                        <div class="el-dropdown-link">
                            <!-- <span>{{GLOBAL.language.headPage.h8}}，</span> -->
                            <img v-if="cardPlanNow && cardPlanNow.card" class="user-role-icon" :src="`${GLOBAL.assetsUrl}/img/${cardPlanNow.card.name}.png`" alt="">
                            <img v-if="GLOBAL.userRole[$store.state.role]" class="user-role-icon" :src="GLOBAL.userRole[$store.state.role].icon" alt="">
                            <img v-if="!GLOBAL.userRole[$store.state.role]" class="user-role-icon" :src="GLOBAL.userRole['default'].icon" alt="">
                            <span class="hidepoint user-txt">{{$store.state.nickname || $store.state.username}}</span>
                            <div class="new-notice" v-show="newNoticeStatus"></div>
                        </div>
                        <div class="icon page-down-icon"></div>
                        <i class="el-icon-arrow-down el-icon--right"></i>
                    </div>
                    <el-dropdown-menu slot="dropdown" class="it-menu web-head-my-menu">
                        <el-dropdown-item class="user-menu-item not-select user-balance-box">
                            <div class="b">
                                <div class="b-body">
                                    <span>{{GLOBAL.language.headPage.h9}}：</span>
                                    <span class="balance-box" 
                                    v-loading="balance == null" 
                                    element-loading-background="rgba(0, 0, 0, 0.0)"
                                    element-loading-spinner="page-loading-icon-css">
                                        ￥{{balance}}
                                    </span>
                                </div>
                            </div>
                        </el-dropdown-item>
                        <!-- <el-dropdown-item command="store/set/card/remain/normal" v-if="cardPlanNow != null">{{GLOBAL.language.headPage.h13}}</el-dropdown-item> -->
                        <el-dropdown-item command="engine/certificate">我的成就</el-dropdown-item>
                        <!-- <el-dropdown-item command="signInOn">
                            <div class="activity-txt" command="">
                                <span>每日签到</span>
                                <div class="new-notice" v-show="notice.userBonus"></div>
                            </div>
                        </el-dropdown-item> -->
                        <el-dropdown-item command="engine/activity">
                            <span class="activity-txt">
                                <span>{{GLOBAL.language.headPage.h10}}</span>
                                <div class="new-notice" v-show="notice.activity || notice.userBonus"></div>
                            </span>
                        </el-dropdown-item>
                        <el-dropdown-item command="engine/record/0">{{GLOBAL.language.headPage.h11}}</el-dropdown-item>
                        <!-- <el-dropdown-item command="engine/rechargeRecord">充值记录</el-dropdown-item> -->
                        <el-dropdown-item command="engine/changePsw">{{GLOBAL.language.public.changePsw}}</el-dropdown-item>
                        <el-dropdown-item command="logoToIndex" v-if="$route.path != '/index'">{{GLOBAL.language.headPage.logoToIndex}}</el-dropdown-item>
                        <el-dropdown-item command="quit">{{GLOBAL.language.public.quit}}</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>
        <service ref="service"></service>
        <leConfirm ref="leConfirm"></leConfirm>
    </div>
</template>

<script>
import service from './service.vue'
import signIn from './signIn.vue'
import loginBox from './loginBox.vue'
    export default {
        name: 'webHandle',
        props: {
            color: String,
        },
        data(){
            return {
                cardPlanNow: null,
                balance: null,
                newNoticeStatus: false,
                notice: {
                    activity: false,
                    userBonus: false
                },
                fontColor: 'light'
                // chart
            }
        },
        methods: {
            service(){
                this.$refs['service'].open()
            },
            dropCommandHandle(command){
                if(command == undefined) return
                if(this[command]){
                    this[command]()
                    return
                }
                this.jumpToPageNew('/' + command)
            },
            logoToIndex(){
                this.jumpToPage('/index')
            },
            myMenuChange(v){
                if(!v) return
                // this.balanceInit()
                this.pageStatusUpdate()
            },
            jumpToPageNew(path){
                this.GLOBAL.jumpToPageNew(path)
                // const {href} = this.$router.resolve({
                //     path: path
                // })
                // window.open(href, '_blank')
            },
            // changePsw(){
            //     this.jumpToPage('/changePsw', this.$route.path, this.$route.path)
            //     // this.$router.push({
            //     //     path: '/changePsw',
            //     //     query: {
            //     //         from: this.$route.path,
            //     //         to: this.$route.path
            //     //     }
            //     // })
            // },
            toindex(){
                this.jumpToPage('/index')
                // this.$router.push({
                //     path: '/index'
                // })
            },
            toRecord(){
                let path = this.$route
            },
            jumpToPage(path, from, to){
                from = from || this.$route.path
                to = to || this.$route.path
                this.GLOBAL.jumpToPage(path, from, to)
                // this.$router.push({
                //     path: path,
                //     query: {
                //         from: this.$route.path,
                //         to: this.$route.path
                //     }
                // })
            },
            quit(){
                // this.$emit('takeFun', {
                //     fun: 'quit',
                //     data: null
                // })
                this.GLOBAL.quit()
                this.$router.go(0)
            },
            pageStatusUpdate(){
                this.balanceInit()
                this.activityInit()
                this.cardPlanInit()
            },
            balanceInit(){
                if(!this.$store.state.username) return
                this.balance = null
                // this.LOADING.open()
                let username = this.$store.state.username
                this.GLOBAL.getUserBalances(username)
                .then(res => {
                    if(res && res.code == 0){
                        try{
                            res.data = JSON.parse(res.data)
                        }catch(e){}
                        this.initBalances(res.data.balance)
                    }
                    // this.LOADING.close()
                })
            },
            async activityInit(){
                if(!this.$store.state.username) return
                let res = await this.GLOBAL.userActivityAvailableGet()
                let newNoticeStatus = this.newNoticeStatus
                if(res && res.code == 0){
                    newNoticeStatus = res.data.available
                    this.notice.activity = res.data.available
                }
                let resBonus = await this.GLOBAL.userBonusCheck()
                if(resBonus && resBonus.code == 0){
                    if(!newNoticeStatus) newNoticeStatus = resBonus.data
                    this.notice.userBonus = resBonus.data
                }
                this.newNoticeStatus = newNoticeStatus
                // this.GLOBAL.userActivityListGet()
                // .then(r => {
                // })
                
            },
            initBalances(balance){
                this.balance = balance
            },
            gotoRecharge(){
                let path = '/engine/recharge'
                let route = {
                    path: path,
                    query: {
                        from: this.$route.path,
                        to: this.$route.path,
                    }
                }
                if(!this.$store.state.username){
                    route.path = '/engine/login'
                    route.query.to = path
                    this.jumpToPage(route.path, route.query.from, route.query.to)
                    return
                }
                this.jumpToPageNew(path)
            },
            gotoRechargeRecord(){
                let path = '/engine/rechargeRecord'
                let route = {
                    path: path,
                    query: {
                        from: this.$route.path,
                        to: this.$route.path,
                    }
                }
                if(!this.$store.state.username){
                    route.path = '/engine/login'
                    route.query.to = path
                    this.jumpToPage(route.path, route.query.from, route.query.to)
                    return
                }
                this.jumpToPageNew(path)
            },
            gotoCard(){
                let path = '/card/item/normal'
                let route = {
                    path: path,
                    query: {
                        from: this.$route.path,
                        to: this.$route.path,
                    }
                }
                if(!this.$store.state.username){
                    route.path = '/engine/login'
                    route.query.to = path
                    this.jumpToPage(route.path, route.query.from, route.query.to)
                    return
                }
                this.jumpToPageNew(path)
            },
            setLanguage(code){
                this.LOADING.open()
                this.GLOBAL.setLanguage(code)
                .then(res => {
                    this.$forceUpdate()
                     this.LOADING.close()
                })
            },
            async cardPlanNowInit(){
                let res = await this.GLOBAL.cardPlanRemain()
                if(res && res.code == 0 && res.data){
                    this.cardPlanNow = res.data
                    this.cardPlanNowHandle()
                }
                return res
            },
            async cardPlanInit(){
                if(!this.$store.state.username) return
                this.GLOBAL.cardPlan()
                .then(res => {
                    if(res && res.code == 0){
                        let list = {}
                        for(var i in res.data){
                            list[res.data[i].id] = res.data[i]
                        }
                        this.cardPlanList = list
                        
                        this.cardPlanNowInit()
                    }
                })
            },
            cardPlanNowHandle(){
                let list = this.cardPlanList
                if(!list || !list[this.cardPlanNow.cardPlan]) return
                this.cardPlanNow.card = list[this.cardPlanNow.cardPlan]
            },
            signInOn(){
                // this.$refs['signIn'].signInEveryDay()
                this.LOADING.open()
                this.GLOBAL.bonusEverydayNew()
                .then(res => {
                    this.LOADING.close()
                    this.activityInit()
                    if(res) return
                    this.$refs['leConfirm'].open({
                        message: '今日已签到',
                        button: [
                            {name: '确定', label: 0}
                        ]
                    })
                })
            }
        },
        created(){
            // this.balanceInit()
            // this.activityInit()
            this.pageStatusUpdate()
        },
        components: {
            service,
            signIn,
            loginBox
        },
        watch: {
            color: {
                handler(val){
                    if(val) this.fontColor = val
                },
                immediate: true
            }
        }
    }
</script>

<style lang="less">
    .web-head.dark{
        color: #fff;
    }
    .web-head.light{
        color: #333;
    }
    .web-head{
        @login-register-btn-height: 2.25rem;
        @page-height: calc(2.25 + 1.5rem * 2);
        color: #fff;
        // background: #353434;
        width: 100%;
        height: @webHeadHeight;
        padding: 0px;
        display: flex;
        justify-content: center;
        .el-menu--horizontal> .el-menu-item:not(.is-disabled):focus, .el-menu--horizontal> .el-submenu .el-submenu__title:hover{
            background: none;
        }
        .body .item.menu .el-menu--horizontal > .el-menu-item:hover{
            background: none;
        }
        .body .item.menu .el-menu--horizontal > .el-menu-item{
            padding: 0px;
        }
        .el-dropdown{
            padding: 0px;
            color: inherit;
            cursor: pointer;
            // width: 16.66%;
            width: 7rem;
            white-space: nowrap;
        }
        .body{
            display: flex;
            // width: @webBodyWidth;
            width: 53.5rem;
            margin: 0px auto;
            height: 100%;
            // min-width: 800px;
            justify-content: center;
            .item{
                
            }
            .item.logo{
                height: 100%;
                .logo-img{
                    cursor: pointer;
                    background: url('@{assetsUrl}logoDark.png') no-repeat;
                    background-size: auto 100%; 
                    height: 100%;
                    width: 7rem;
                }
            }
            .item.menu{
                @menuTitleFontSize: 0.8rem;
                height: 100%;
                width: 100%;
                display: flex;
                align-items: center;
                .user-balance{
                    border-bottom: 1px solid #EBEEF5;
                    .balance-box{
                        display: inline-block;
                        min-width: 3.5rem;
                    }
                }
                .el-menu--horizontal>.el-submenu .el-submenu__title{
                    color: inherit;
                    height: auto;
                    line-height: normal;
                    border: 0px;
                    font-size: @menuTitleFontSize;
                }
                .el-menu--horizontal>.el-menu-item{
                    color: inherit;
                    height: auto;
                    line-height: normal;
                    border: 0px;
                    font-size: @menuTitleFontSize;
                    padding: 0px 1rem;
                }
                .el-submenu__title i{
                    color: #fff;
                }
                .el-submenu__title{
                     color: inherit;
                }
                .el-menu{
                    background: none;
                }
                .el-menu.el-menu--horizontal{
                    border: 0px;
                    display: flex;
                    align-items: center;
                }
                .el-menu.el-menu--horizontal.login .el-menu-item{
                    width: 20%;
                    // width: 7rem;
                }
                .el-menu.el-menu--horizontal.guest .el-menu-item{
                    width: 16.66%;
                    // width: 7rem;
                }
                .el-menu.el-menu--horizontal.login{
                    width: 83.3%;
                }
                .el-menu.el-menu--horizontal.guest{
                    width: 100%;
                }
                .el-menu--popup{
                    background: #fff;
                    .el-menu-item{
                        color: #666;
                        font-size: 0.6rem;
                    }
                }
                .menu-item-sp{
                    // margin-left: 2rem;
                    margin: 0px;
                    width: 10rem;
                }
            }
            .item.user-box{
                margin-left: 2rem;
                li{
                    float: left;
                    margin-right: 0.5rem
                }
                .el-button{
                    color: #fff;
                    padding: 0px;
                    height: auto;
                }
            }
        }
        .web-head-dropdown{
            .tem{
                display: flex;
                align-items: center;
                justify-content: center;
                .el-dropdown-link{
                    display: flex;
                    align-items: center;
                    .user-txt{
                        max-width: 6rem;
                        display: inline-block;
                    }
                    position: relative;
                    .new-notice{
                        top: -0.2rem;
                        right: -0.4rem;
                    }
                }
            }
            .activity-txt{
                position: relative;
                display: flex;
                align-items: center;
                .new-notice{
                    margin-left: 0.5rem;
                }
            }
        }
        .login-register-btn:hover{
            background: #E53935;
            color: #fff;
        }
        .login-register-btn:active{
            background: #E53935;
            color: #fff;
        }
        .login-register-btn:focus{
            background: #E53935;
            color: #fff;
        }
        .login-register-btn{
            padding: 0px;
            width: 8rem;
            height: @login-register-btn-height;
            background: #E53935;
            color: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 0.2rem;
            border: 0px;
        }
    }
</style>