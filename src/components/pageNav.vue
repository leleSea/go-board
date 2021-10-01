<template>
    <div class="page-nav" :list="list" :page="page">
        <div class="menu-top">
            <div class="logo item page-logo" @click="jumpToPageNew('/index')"></div>
            <div class="item b" v-if="page != 'menu'">
                <div class="plan-text" v-show="engineStatus.id && page != 'play'">{{planSelect.value}}</div>
                <div class="quit-area">
                    <span class="txt">{{pageTxt[page]}}</span>
                    <div class="quit-icon page-nav-icon8" @click="engineStop"></div>
                </div>
            </div>
        </div>
        <div class="menu page-panel-bcg">
            <div class="main-menu-list">
                <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect" :unique-opened="true" menu-trigger="hover" ref="mainMenu">
                    <el-submenu v-for="(v, i) in list" :index="v.index" :key="i" text-color="#fff" class="main-manu" :hide-bcg="v.hideBcg" @click="mainMenuClick(v)">
                        <template slot="title">
                            <div class="title-body">
                                <div class="icon" :class="v.icon" v-if="v.icon"></div>
                                <div class="txt">{{v.name}}</div>
                                <div class="icon" :class="v.icon2" v-if="v.icon2"></div>
                            </div>
                        </template>
                        <div v-for="(s, k) in v.submenu" :key="k" :class="{'border': s.border}" class="submenu-box">
                            <el-menu-item :index="s.indexLabel" :disabled="s.disabled || (!engineStatus.id && s.engine)" v-if="!s.submenu" @click="menuHandle(s)">
                                <div>
                                    <!-- <img v-if="s.labelIcon" :src="activeIcon" v-show="s.active && !s.labelIcon" class="menu-active-icon">
                                    <span class="txt" v-if="!s.balance">{{s.name}}</span>
                                    <span class="txt" v-else>
                                        <div class="b">余额：<span class="balance-box" v-loading="balance == null" element-loading-background="rgba(0, 0, 0, 0.0)">￥{{balance}}</span></div>
                                    </span>
                                    <img v-if="s.labelIcon" :src="`${GLOBAL.assetsUrl}/img/${s.labelOn}`" v-show="s.active && s.labelIcon" class="menu-active-icon">
                                    <img v-if="s.labelIcon" :src="`${GLOBAL.assetsUrl}/img/${s.labelOff}`" v-show="!s.active && s.labelIcon" class="menu-active-icon"> -->
                                </div>
                            </el-menu-item>
                            <el-submenu :index="s.indexLabel"  v-else :disabled="(!engineStatus.id && s.engine)">
                                <template slot="title">{{s.name}}</template>
                                <el-menu-item :index="d.indexLabel"  v-for="(d, j) in s.submenu" :key="j" @click="menuHandle(d)" :disabled="d.disabled || (!engineStatus.id && d.engine)">
                                    <div>
                                        <!-- <img :src="activeIcon" v-show="d.label == s.active" class="menu-active-icon"> -->
                                        <span class="txt">{{d.name}}</span>
                                    </div>
                                </el-menu-item>
                            </el-submenu>
                        </div>
                    </el-submenu>
                </el-menu>
            </div>
            <div class="item user">
                <el-dropdown class="engine-head-dropdown" trigger="hover" @command="dropCommandHandle" @visible-change="myMenuChange">
                    <div class="it-i a tem">
                        <!-- <img v-if="cardPlanNow && cardPlanNow.card" class="user-role-icon" :src="`${GLOBAL.assetsUrl}/img/${cardPlanNow.card.name}.png`" alt=""> -->
                        <div class="icon page-nav-icon7" v-if="!GLOBAL.userRole[$store.state.role]"></div>
                        <!-- <img v-if="GLOBAL.userRole[$store.state.role]" class="user-role-icon" :src="GLOBAL.userRole[$store.state.role].icon" alt=""> -->
                        
                        <div class="el-dropdown-link hidepoint">
                            {{$store.state.nickname || $store.state.username}}
                        </div>
                        <div class="new-notice" v-show="newNoticeStatus"></div>
                    </div>
                    <el-dropdown-menu slot="dropdown" class="it-menu engine-nav-user-menu">
                        <el-dropdown-item class="user-menu-item">
                            <div class="b">余额：<span class="balance-box" 
                            v-loading="balance == null" 
                            element-loading-background="rgba(0, 0, 0, 0.0)"
                            element-loading-spinner="page-loading-icon-css">￥{{balance}}</span></div>
                        </el-dropdown-item>
                        
                        <el-dropdown-item command="cardRemain">{{GLOBAL.language.headPage.h13}}</el-dropdown-item>
                        <el-dropdown-item command="activity">
                            <span class="activity-txt">
                                <span>礼金券</span>
                                <div class="new-notice" v-show="notice.activity"></div>
                            </span>
                        </el-dropdown-item>
                        <el-dropdown-item command="record">消费记录</el-dropdown-item>
                        <el-dropdown-item command="changePsw">修改密码</el-dropdown-item>
                        <el-dropdown-item command="logoToIndex">返回主页</el-dropdown-item>
                        <el-dropdown-item command="loginOut">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>
        <pageOl ref="pageOl"></pageOl>
        <configSet v-on:update="update" v-on:confirmSet="confirmSet" ref="config"></configSet>
        <service ref="service"></service>
    </div>
</template>

<script>
    import configSet from './configSet.vue'
    import pageOl from './pageOl.vue'
    import service from './service.vue'

    export default {
        name: 'pageNav',
        props: {
            list: Array,
            page: String
        },
        data(){
            return {
                cardPlanNow: {},
                newNoticeStatus: false,
                notice: {
                    activity: false
                },
                pageTxt: {
                    'play': '智能对弈',
                    'engine': '分析研究',
                    'playEngine': '智能对弈'
                },
                balance: null,
                engineStatus: {
                    id: null,
                    txt: '启动'
                },
                engine_id: null,
                options: [{
                label: '热门城市',
                options: [{
                    value: 'Shanghai',
                    label: '上海'
                }, {
                    value: 'Beijing',
                    label: '北京'
                }]
                }, {
                label: '城市名',
                options: [{
                    value: 'Chengdu',
                    label: '成都'
                }, {
                    value: 'Shenzhen',
                    label: '深圳'
                }, {
                    value: 'Guangzhou',
                    label: '广州'
                }, {
                    value: 'Dalian',
                    label: '大连'
                }]
                }],
                planSelect: {
                    data: [],
                    value: null
                },
                activeIcon: `${this.GLOBAL.assetsUrl}/img/p67.png`,
                submenuStyle: {
                    'padding-right': '0.5rem',
                },
                activeIndex: null,
                stoneLabel: 0,
                planNow: {}
            }
        },
        methods: {
            service(){
                this.$refs['service'].open()
            },
            useImg(){
                this.$refs['pageOl'].open()
            },
            mainMenuClick(v){
                
            },
            myMenuChange(v){
                if(!v) return
                this.balanceInit()
                this.activityInit()
                
            },
            configSetOff(){
                // this.configSetActive = false
                this.$refs['config'].configOff()
            },
            testfun(){
                
                this.GLOBAL.jumpPageWithNone()
            },
            confirmSet(opt){
                let res = opt.res, enginePlan = opt.enginePlan
                
                // this.$router.push({path: '/engine'})
                this.configSetOff()
                if(res && res.code == 0){
                    let options = {
                        engine_id: res.data,
                        planId: enginePlan.id
                    }
                    this.GLOBAL.engineSet(options)
                    let userInfo = this.GLOBAL.getUserInfo();
                    let path = this.GLOBAL.getRouter(userInfo.status, this.$route.path)
                    // this.$router.push({path: '/engine'})
                    // this.boardHasInit()
                    // this.startEngineControl()
                    this.$emit('takeFun', {
                        fun: 'startEngineControl'
                    })
                }else{
                    this.GLOBAL.errorHandle(res, 'gpu_plans')
                    this.getPlanList().then(res => {
                        if(res && res.code == 0){
                            try{
                                res.data = JSON.parse(res.data)
                            }catch(e){}
                            this.$refs['config'].initList(res.data)
                        }
                    })
                    // this.errorHandle(res)
                }
            },
            errorHandle(res){
                if(res && res.code == 0) return
                let obj = this.GLOBAL.copy(this.GLOBAL.engineErrorFun[res.code])
                if(!obj) return false
                if(this[obj.fun]) this[obj.fun]()
                if(!obj.displayError) return false
                // this.errorOpen({
                //     message: res.errorMsg,
                //     duration: obj.duration ? undefined : 0
                // })
                this.GLOBAL.MessageOpen({
                    // message: res.errorMsg,
                    message: errorMsg.setEngines[res.code] || errorMsg.main.autoQuit,
                    duration: obj.duration ? undefined : 0
                })
            },
            update(options){
                for(var i in options){
                    this[i] = options[i]
                }
            },
            checkEnterEngineTime(){
                this.$emit('takeFun', {
                    fun: 'checkEnterEngineTime'
                })
            },
            // engineControl(){
            //     this.$emit('takeFun', {
            //         fun: 'engineControl',
            //         data: null
            //     })
            // },
            engineControl(){
                this.GLOBAL.clearPageMsgAction()
                this.$store.state.engine_id ? this.engineStop() : this.engineStart()
                // if(!this.$store.state.engine_id){
                //     this.configSetOn()
                //     return
                // }
                // this.$confirm('要认输吗？', {
                //     message: `<div class="engine-quit-confirm">
                //                     <h2>确定要停止吗？</h2>
                //                     <p>停止使用以后分析数据将不可见，部分功能将不可用</p>
                //                 </div>`,
                //     dangerouslyUseHTMLString: true,
                //     confirmButtonText: '确定',
                //     cancelButtonText: '取消',
                //     center: true
                // }).then(() =>{
                //     this.quit()
                // })
            },
            engineStart(){
                if(this.$store.state.engine_id){
                    return
                }
                this.configSetOn()
            },
            engineStop(){
                if(this.page == 'play'){
                    this.quit()
                    return
                }
                this.$confirm('要认输吗？', {
                    message: `<div class="engine-quit-confirm">
                                    <h2>确定要停止吗？</h2>
                                    <p>停止使用以后分析数据将不可见，部分功能将不可用</p>
                                </div>`,
                    dangerouslyUseHTMLString: true,
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    center: true
                }).then(() =>{
                    this.quit()
                })
            },
            logoToIndexAction(){
                this.toIndex()
            },
            logoToIndex(){
                if(this.engineStatus.id){
                    this.$confirm('', {
                        message: `<div class="engine-quit-confirm">
                                        <h2>确定要返回主页吗？</h2>
                                        <p>您正在使用分析引擎，返回主页可能导致结束使用</p>
                                    </div>`,
                        dangerouslyUseHTMLString: true,
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        center: true
                    }).then(() =>{
                        // this.quit()
                        this.logoToIndexAction()
                    })
                    return
                }
                this.logoToIndexAction()
            },
            loginOutAction(){
                this.LOADING.open()
                this.GLOBAL.engineQuitSend()
                .then(res => {
                    this.LOADING.close()
                    this.setEngineId()
                    this.GLOBAL.quit()
                    this.jumpToPage('/index')
                    this.GLOBAL.clearPageMsgAction()
                })
                // this.quit()
                
            },
            loginOut(){
                if(this.engineStatus.id){
                    this.$confirm('要认输吗？', {
                        message: `<div class="engine-quit-confirm">
                                        <h2>确定要退出吗？</h2>
                                        <p>您正在使用分析引擎，退出登录将自动结束使用并返回主页</p>
                                    </div>`,
                        dangerouslyUseHTMLString: true,
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        center: true
                    }).then(() =>{
                        // this.quit()
                        this.loginOutAction()
                    })
                    return
                }
                this.loginOutAction()
            },
            quit(){
                // engineStatus
                this.$emit('takeFun', {
                    fun: 'quit'
                })
            },
            
            async getPlanList(){
                this.LOADING.open()
                let res = await this.request('engine', {
                    url: '/gpu/plans',
                    method: 'GET',
                    noMsg: true
                })
                this.LOADING.close()
                return res
            },
            async request(type, options){
                if(!this.GLOBAL.checkEnterEngineTime()) return
                let res = await this.GLOBAL.request(type, options)
                return res
            },
            configSetOn(){
                this.getPlanList().then(res => {
                    try{
                        res.data = JSON.parse(res.data)
                    }catch(e){}
                    // this.lists = res.data
                    this.GLOBAL.setItem({
                        planList: res.data
                    })
                    this.$refs['config'].configSetOn(res.data)
                    if(res && res.code == 0) this.GLOBAL.clearPageMsg()
                })
                // this.configSetActive = true
            },
            dropCommandHandle(command){
                if(this[command]){
                    this[command]()
                    return
                } 
                this.$emit('takeFun', {
                    fun: command,
                    data: null
                })
            },
            rechargeRecord(){
                this.jumpToPageNew('/rechargeRecord')
            },
            changePsw(){
                this.jumpToPageNew('/changePsw')
            },
            record(){
                this.jumpToPageNew('/record')
            },
            recharge(){
                this.jumpToPageNew('/recharge')
            },
            toIndex(){
                this.jumpToPageNew('/index')
            },
            activity(){
                this.jumpToPageNew('/activity')
            },
            cardRemain(){
                this.jumpToPageNew('/card/remain')
            },
            cardBuy(){
                this.jumpToPageNew('/card/item')
            },
            jumpToPage(path){
                this.GLOBAL.jumpToPage(path, this.$route.path, this.$route.path)
                // 
                // this.$router.push({
                //     path: path,
                //     query: {
                //         from: this.$route.path,
                //         to: this.$route.path
                //     }
                // })
            },
            jumpToPageNew(path){
                this.GLOBAL.jumpToPageNew(path)
                // const {href} = this.$router.resolve({
                //     path: path
                // })
                // window.open(href, '_blank')
            },
            menuHandle(val){
                this.commandHandle(val)
            },
            handleSelect(index, indexPath){
                // if(indexPath.length < 3){
                //     let indexP = indexPath[0]
                //     this.commandHandle(this.list[indexP].submenu[index])
                //     return
                // }
                // let indexP = indexPath[0]
                // let indexN = indexPath[1]
                // this.commandHandle(this.list[indexP].submenu[indexN].submenu[index])
            },
            commandHandle(val){
                let command = val.command
                if(this[command]) this[command](val)
                else
                    this.$emit('takeFun', {
                        fun: command,
                        data: val
                    })
            },
            voiceSet(val){
                // 
                // if(active != undefined){
                //     this.list[val.indexP].submenu[val.index].active = active
                // }else{
                //     this.list[val.indexP].submenu[val.index].active = !val.active
                // }
                let active = !val.active
                this.voiceSetAction(active, val.indexP, val.index)
            },
            voiceSetAction(active, indexP, indexN){
                this.list[indexP].submenu[indexN].active = active
                this.$forceUpdate()
                this.GLOBAL.setItem({
                    voice: this.list[indexP].submenu[indexN].active ? 1 : 0
                })
            },
            // newGameOptionsOn(){
            //     this.$emit('takeFun', {
            //         fun: 'newGameOptionsOn',
            //         data: null
            //     })
            // },
            propByclick(menu){
                let val = this.list[menu.indexP].submenu[menu.index]
                this.list[menu.indexP].submenu[menu.index].active = !this.list[menu.indexP].submenu[menu.index].active
                this.$emit('takeFun', {
                    fun: 'propByClick',
                    data: this.list[menu.indexP].submenu[menu.index].active
                })
            },
            winrateChange(menu){
                let val = this.list[menu.indexP].submenu[menu.index]
                this.list[menu.indexP].submenu[menu.index].active = !this.list[menu.indexP].submenu[menu.index].active
                this.$emit('takeFun', {
                    fun: 'winrateChange',
                    data: this.list[menu.indexP].submenu[menu.index].active
                })
            },
            changeLabel(menu, label){
                label = label || menu.label
                
                // 
                // this.list[menu.indexP].submenu[menu.indexN].active = menu.label
                // this.stoneLabelSet(menu.label,)
                this.$emit('takeFun', {
                    fun: 'changeLabel',
                    data: label
                })
                this.GLOBAL.setItem({
                    stoneLabel: label
                })
            },
            changeTheme(menu){
                
                this.list[menu.indexP].submenu[menu.indexN].active = menu.label
                this.$emit('takeFun', {
                    fun: 'changeTheme',
                    data: menu.label
                })
                this.GLOBAL.setItem({
                    theme: menu.label
                })
            },
            stoneLabelSet(label, i1, i2){
                // let list = this.list[2].submenu[2].submenu
                
                let list = this.list
                i1 = i1 == undefined ? 2 : i1
                i2 = i2 == undefined ? 2 : i2 
                list[i1].submenu[i2].active = label
                // for(var i in list[2].submenu[2].submenu){
                //     if(list[2].submenu[2].submenu[i].label == label){
                //         list[2].submenu[2].submenu[i].active = label
                //     }else{
                //         list[2].submenu[2].submenu[i].active = false
                //     }
                // }
                this.list = list
                this.$forceUpdate()
                
                this.GLOBAL.setItem({
                    stoneLabel: label
                })
            },
            changeCoor(menu){
                // let val = this.list[menu.indexP].submenu[menu.index]
                
                this.list[menu.indexP].submenu[menu.indexN].active = menu.label
                this.$emit('takeFun', {
                    fun: 'changeCoor',
                    data: menu.label
                })
                this.GLOBAL.setItem({
                    coor: menu.label
                })
            },
            changeCoorSet(label){
                let list = this.list
                for(var i in list[3].submenu[0].submenu){
                    
                    if(list[3].submenu[0].submenu[i].label == label){
                        list[3].submenu[0].submenu[i].active = true
                    }else{
                        list[3].submenu[0].submenu[i].active = false
                    }
                }
                this.list = list
                this.$forceUpdate()
            },
            setMenu(list){
                // this.list = list
                this.listInit(list)
                
            },
            closeAll(){
                let list = this.list
                
                for(var i in list){
                    
                    this.$refs['mainMenu'].close(list[i].index)
                }
            },
            listInit(){
                // {
                //     name: '充值',
                //     icon: 'page-nav-icon6',
                //     submenu: [
                //         {name: '立即充值', command: 'recharge',},
                //         {name: '充值记录', command: 'rechargeRecord',},
                //     ]
                // },
                let list = this.list
                // list.push({
                //     name: '购买会员卡',
                //     icon: 'page-nav-icon6',
                //     command: 'cardBuy'
                // })
                for(var i in list){
                    list[i].index = i
                    if(!list[i].submenu) continue
                    for(var j in list[i].submenu){
                        list[i].submenu[j].index = j
                        list[i].submenu[j].indexP = i
                        list[i].submenu[j].indexLabel = i + '-' + j
                        if(!list[i].submenu[j].submenu) continue
                        for(var k in list[i].submenu[j].submenu){
                            list[i].submenu[j].submenu[k].index = k
                            list[i].submenu[j].submenu[k].indexP = i
                            list[i].submenu[j].submenu[k].indexN = j
                            list[i].submenu[j].submenu[k].indexLabel = i + '-' + j + '-' + k
                        }
                    }
                }
                this.list = list
            },
            planInit(planList){
                
                let planId = this.$store.state.planId
                
                let data = [], i = 0, j = 0, type, disabled = false
                if(!planId) return
                while(j < planList.length){
                    type = planList[j].planType
                    i = j
                    data.push({
                        name: this.GLOBAL.planType[type].name,
                        options: [],
                    })
                    for(i = j; i < planList.length; i++){
                        disabled = false
                        if(planList[i].id == planId){
                            this.planSelect.value = planList[i].name
                            this.planNow = this.GLOBAL.copy(planList[i])
                        }
                        if(planList[i].planType == type){
                            if(planList[i].id != planId){
                                disabled = true
                            }
                            data[data.length - 1].options.push({
                                name: planList[i].name,
                                id: planList[i].id,
                                available: planList[i].available,
                                disabled: disabled
                            })
                        }else{
                            break
                        }
                    }
                    j = i
                }
                
                this.planSelect.data = data
                // for(var i in planList){
                //     data.push({
                //         value: planList[i].name,
                //     })
                //     if(planId == planList[i].id){
                //         this.planSelect.value = planList[i].name
                //     }
                // }
            },
            comInit(opt){
                let planList = opt.planList || []
                
                this.planInit(planList)
                this.attInit()
            },
            setEngineId(){
                this.engineStatus = {
                    id: this.$store.state.engine_id || null,
                    txt: this.$store.state.engine_id ? '停止' : '启动'
                }
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
            initBalances(balance){
                this.balance = balance
            },
            async activityInit(){
                
                if(!this.$store.state.username) return
                let res = await this.GLOBAL.userActivityAvailableGet()
                if(res && res.code == 0){
                    this.newNoticeStatus = res.data.available
                    this.notice.activity = res.data.available
                }
                
            },
            stoneLabelInit(menu){
                let label = this.$store.state.stoneLabel || 0
                
                
                for(var i in menu.submenu){
                    if(menu.submenu[i].label == label){
                        this.changeLabel(menu.submenu[i])
                        break
                    }
                }
            },
            coorInit(menu){
                let label = this.$store.state.coor || 1
                for(var i in menu.submenu){
                    if(menu.submenu[i].label == label){
                        this.changeCoor(menu.submenu[i])
                        break
                    }
                }
            },
            themeInit(menu){
                let label = this.$store.state.theme || 'dark'
                for(var i in menu.submenu){
                    if(menu.submenu[i].label == label){
                        this.changeTheme(menu.submenu[i])
                        break
                    }
                }
            },
            voiceInit(menu){
                let label = this.$store.state.voice != undefined ? Number(this.$store.state.voice) : 1
                this.voiceSetAction(label, menu.indexP, menu.index)
                // for(var i in menu){
                //     if(menu[i].label == label){
                        
                //         break
                //     }
                // }
            },
            attInit(){
                // this.changeCoor(this.$store.state.coor || 1)
                // this.changeLabel(this.$store.state.stoneLabel || 0)
                let fun = {
                    'stoneLabel': true,
                    'coor': true,
                    'theme': true,
                    'voice': true
                }
                let label = this.$store.state.coor || 1
                let list = this.list
                for(var i in list){
                    if(!list[i].submenu) continue
                    for(var j in list[i].submenu){
                        if(!list[i].submenu[j].menuLabel || !fun[list[i].submenu[j].menuLabel]) continue
                        
                        this[`${list[i].submenu[j].menuLabel}Init`](list[i].submenu[j])
                    }
                }
                
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
            async cardPlanNowInit(){
                let res = await this.GLOBAL.cardPlanRemain()
                if(res && res.code == 0 && res.data){
                    this.cardPlanNow = res.data
                    this.cardPlanNowHandle()
                }
                return res
            },
            cardPlanNowHandle(){
                let list = this.cardPlanList
                if(!list || !list[this.cardPlanNow.cardPlan]) return
                this.cardPlanNow.card = list[this.cardPlanNow.cardPlan]
            }
        },
        created(){
            this.listInit() 
            this.page = this.page || 'engine'
            // this.balanceInit()
            // this.activityInit()
            // this.cardPlanInit()
        },
        computed: {
            
        },
        components: {
            configSet,
            pageOl,
            service
        }
    }
</script>

<style lang="less">
    .page-nav{
        
        .el-menu--horizontal>.el-submenu .el-submenu__title{
            color: inherit;
        }
        .menu .item.user .icon, .page-nav .el-menu .el-submenu .el-submenu__title .icon{
            width: 0.8rem;
            height: 0.8rem;
            margin-right: 0.15rem;
        }
        .menu{
            height: 1.4rem;
            // padding: 0px 0.75rem;
            background: #373E48;
            position: relative;
            .item.user{
                position: absolute;
                right: 0px;
                top: 0px;
                height: 100%;
                width: 24%;
                display: flex;
                align-items: center;
                justify-content: flex-end;
                padding-right: 0.5rem;
                .new-notice{
                    top: -0.2rem;
                    right: -0.4rem;
                }
                .el-dropdown-link{
                    max-width: 5rem;
                }
                .it-i.a.tem{
                    display: flex;
                    align-items: center;
                }
                .el-dropdown{
                    color: inherit;
                }
            }
            .main-menu-list{
                height: 100%;
            }
        }
        height: 100%;
        // display: flex;
        .el-menu.el-menu--horizontal{
            border: 0px;
        }
        .el-menu--horizontal>.el-submenu .el-submenu__icon-arrow{
            display: none;
        }
        .el-menu--horizontal>.el-submenu:focus .el-submenu__title, 
            .el-menu--horizontal>.el-submenu:hover .el-submenu__title{
                color: inherit;
            }
        .el-menu{
            width: 100%;
            background: none;
            height: 100%;
            // .el-submenu:hover{
            //     outline: 1;
            // }
            .el-submenu:last-child .el-submenu__title .title-body{
                //  background: none;
                //  color: #bbb;
                //  border: 0px;
            }
            .el-submenu:last-child .el-submenu__title .title-body:hover{
                background: none;
            }
            // .el-submenu:first-child .el-submenu__title{
            //     justify-content: flex-start;
            // }
            .el-submenu:last-child .el-submenu__title .title-body{
                // justify-content: flex-end;
            }
            
            .el-submenu:last-child{
                margin: 0px;
                .title-body{
                    .txt{
                        max-width: 2.5rem;
                        white-space:nowrap;
                        text-overflow:ellipsis;
                        overflow:hidden;
                    }
                }
            }
            .el-submenu:last-child{
                margin: 0px;
            }
            
            .el-submenu{
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                // margin-right: 1.5rem;
                width: 12%;
                // width: 17.5%;
                // width: 20%;
                // margin-right: 3.1%;
                .el-submenu__title:hover{
                    background: none;
                }
                .el-submenu__title .title-body:hover{
                    // background: #373E48;
                    color: inherit;
                    background: none;
                }
                
                .el-submenu__title{
                    width: 100%;
                    padding: 0px;
                    display: flex;
                    justify-content: flex-start;
                    height: 100%;
                    border: 0px;
                    .title-body{
                        // border: 1px solid #aaa;
                        // width: 100%;
                        // width: 4.8rem;
                        width: 100%;
                        height: 100%;
                        // background: #373E48;
                        color: inherit;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        // justify-content: center;
                        // border-radius: 0.25rem;
                        .txt{
                            font-size: 0.7rem;
                            line-height: normal;
                        }
                    }
                }
                .user-box{
                    .icon{
                        width: 0.8rem;
                        height: 0.8rem;
                        margin-right: 0.35rem;
                    }
                }
                .el-submenu__title .icon{
                    width: 0.8rem;
                    height: 0.8rem;
                    margin-right: 0.15rem;
                }
                .el-submenu__title .icon.c1{
                    margin-left: 0.2rem;
                    width: 0.7rem;
                    height: 0.7rem;
                    transform: rotate(-90deg);
                    background-size: 100% 100%;
                }
            }
        }
        .el-menu--horizontal>.el-submenu:focus, .el-menu--horizontal>.el-submenu:hover{
            color: inherit;
            outline: 1 !important;
        }
        .el-menu--horizontal>.el-submenu.is-active .el-submenu__title{
            border-bottom: 0px;
            color: inherit;
        }
        .menu-li{
            display: flex;
            height: 100%;
            align-items: center;
            justify-content: center;
            padding: 0px 0.5rem;
            width: 25%;
            .menu-li-cell{
                // border: 1px solid #fff;
                background: #373E48;
                border-radius: 0.25rem;
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .el-menu{
                // .el-menu-item{
                //     position: relative;
                //     .item-icon{
                //         position: absolute;
                //         height: 0.9rem;
                //         top: 0px;
                //         bottom: 0px;
                //         margin: auto;
                //         right: 0px;
                //     }
                // }
            }
            
            .menu-li-title{
                .el-dropdown-link{
                    font-size: 0.9rem;
                }
                // color: #fff;
                cursor: pointer;
                display: flex;
                .el-dropdown-link{
                    float: left;
                }
                // .el-dropdown-link, .menu-ico{
                //     height: 0.75rem;
                // }
                .menu-icon-body{
                    width: 1rem;
                    height: 1.1rem;
                    margin-right: 0.35rem;
                    padding-top: 0.1rem; 
                }
                .menu-ico{
                    width: 100%;
                    height: 100%;
                }
            }
            
        }
        .menu-top{
            // display: flex;
            height: 2rem;
            margin-bottom: 0.5rem;
            .item{
                float: left;
            }
            .logo.item{
                cursor: pointer;
                width: 6rem;
                height: 2rem;
                background-size: 100% auto;
            }
            .item.start-engine{
                margin-left: 0.5rem;
                display: flex;
                align-items: center;
                height: 100%;
                .el-button{
                    width: 4.55rem;
                    height: 1.4rem;
                    padding: 0px;
                    border: 0px;
                    color: inherit;
                    border-radius: 0px;
                    // display: flex;
                    // align-items: center;
                    // justify-content: center;
                    span{
                        // display: inline-block;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }
                    .start-stop-btn-icon{
                        width: 1rem;
                        height: 1rem;
                        float: right;
                        margin-left: 0.5rem;
                    }
                }
            }
            .item.b{
                height: 100%;
                // margin-left: 2.5rem;
                // min-width: 3.65rem;
                display: flex;
                float: right;
                @itemBSize: 0.8rem;
                .quit-area{
                    margin-left: 0.8rem;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    .txt{
                        font-size: @itemBSize;
                    }
                    .quit-icon{
                        width: 1.2rem;
                        height: 1.2rem;
                        margin-left: 0.3rem;
                        cursor: pointer;
                    }
                }
                .el-select{
                    .el-input{
                        padding-right: 0.75rem;
                    }
                }
                .plan-text{
                    height: 100%;
                    display: flex;
                    align-items: center;
                    // color: #fff;
                    font-size: @itemBSize;
                }
                .el-input__inner{
                    background: none;
                    border: 0px;
                    padding: 0px;
                    color: inherit;
                    font-size: 0.8rem;
                    width: 4.5rem;
                }
                .el-input__prefix, .el-input__suffix{
                    width: 0.6rem;
                    height: 0.6rem;
                    background-size: 100% 100%;
                    transform: rotate(-90deg);
                    display: inline-block;
                    top: 0px;
                    bottom: 0px;
                    margin: auto;
                    right: 0px;
                    left: auto;
                    .el-input__suffix-inner{
                        display: none;
                    }
                }
            }
            .item.user{
                float: right;
                height: 100%;
                display: flex;
                align-items: center;
                cursor: pointer;
                .el-dropdown{
                    color: inherit;
                }
                .it-i{
                    display: flex;
                    align-items: center;
                    position: relative;
                    .el-dropdown-link{
                        font-size: 0.8rem;
                    }
                    .icon{
                        width: 0.6rem;
                        height: 0.6rem;
                        transform: rotate(-90deg);
                        margin-left: 0.3rem;
                    }
                    .user-box-template{
                        display: flex;
                        align-items: center;
                    }
                    .user-box-content{
                        position: absolute;
                    }
                    .user-photo{
                        width: 1rem;
                        height: 1rem;
                        background: url('@{assetsUrl}photo.png') no-repeat;
                        background-size: 100% 100%;
                    }
                    
                }
                
            }
        }
    }
    .it-menu{
        .user-menu-item{
            display: flex;
            align-items: center;
            .el-button{
                margin-left: 0.5rem;
            }
            .balance-box{
                display: inline-block;
                min-width: 3.5rem;
            }
        }
        .el-dropdown-menu__item{
            padding-right: 1rem !important;
            position: relative;
        }
        .item-icon{
            position: absolute;
            right: 0.5rem;
            height: 0.7rem;
            top: 0px;
            bottom: 0px;
            margin: auto;
        }
        .engine-head-dropdown{
            .tem{
                display: flex;
                align-items: center;
            }
        }
    }
    .el-menu--horizontal .el-menu .el-menu-item, .el-menu--horizontal .el-menu .el-submenu__title{
        height: 1.8rem;
        line-height: 1.8rem;
        padding-left: 1.45rem;
        color: inherit;
    }
</style>