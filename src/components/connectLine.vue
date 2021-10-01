<!--  -->
<template>
    <div class='connect-line' v-show="active">
        <le-confirm ref="leConfirm"></le-confirm>
        <div class="connect-line-body">
            <h1 class="connect-line-title">
                <div class="line-title-body">
                    <span class="txt">{{ $t('连线器') }}</span>
                    <!-- <span class="el-icon-question title--help-icon"></span> -->
                    <div class="connector-oi-icon" @click="connectorOICon">
                        <span class="txt">{{ $t('使用说明') }}</span>
                        <img class="connector-oi-icon-img" :src="`${GLOBAL.assetsUrl}/img/chi.png`" >
                    </div>
                </div>
                <span class="close-icon el-icon-close" @click="close"></span>
            </h1>
            <div class="connect-line-content">
                <p class="content-notice">{{ $t('开通AI引擎端口，通过GTP连接到对弈网站。') }}</p>
                <div class="content-link-box">
                    <div class="content-link-box-body">
                        <div class="link-item IP">
                            <span>{{ $t('IP地址：') }}</span>
                            <el-input type="text" auto-complete="off" v-model="status.ip" disabled></el-input>
                        </div>
                        <div class="link-item port">
                            <span>{{ $t('端口：') }}</span>
                            <el-input type="text" auto-complete="off" v-model="status.port" disabled></el-input>
                        </div>
                        <el-popover
                        placement="top-start"
                        popper-class="connect-line-port-notice"
                        trigger="hover"
                        :disabled="!getPortDisabled"
                        :content="$t('连线器需在研究开始状态下使用。')">
                            <div class="link-item btn" slot="reference">
                                <el-button :disabled="getPortDisabled" @click="portCon" :class="{'on': clineStatus, 'off': !clineStatus}">
                                    {{clineStatus ?  $t('断开连接')  :$t('获取端口') }}
                                </el-button>
                            </div>
                        </el-popover>
                    </div>
                    
                </div>
                <div class="connect-set">
                    <div class="connect-set-body">
                        <h1 class="connect-set-title" @click="connectorSetCon" :class="{'disabled': !clineStatus}">
                            <div class="connect-set-title-body">
                                <span class="txt">{{ $t('连线器设置') }}</span>
                                <i class="el-icon-arrow-down connect-set-title-icon" :class="{'rotate180': connectorSetActive}"></i>
                            </div>
                        </h1>
                        <div class="connect-set-content" :class="{'active': connectorSetActive}" 
                        v-loading="connectorSet.loading"
                        element-loading-spinner="page-loading-icon-css">
                            <div class="set-content-ct-body">
                                <ul class="set-content-t">
                                    <li class="t-item global-speed">
                                        <span class="txt">{{ $t('整体对弈速度：') }}</span>
                                    </li>
                                    <li class="t-item single-time">
                                        <span class="txt">{{ $t('单步棋用时：') }}</span>
                                    </li>
                                    <li class="t-item network-delay">
                                        <span class="txt">{{ $t('网络延时预留：') }}</span>
                                    </li>
                                    <li class="t-item resign-con">
                                        <span class="txt">{{ $t('认输条件：') }}</span>
                                    </li>
                                    <li class="t-item play-random">
                                        <span class="txt">{{ $t('落子随机性：') }}</span>
                                    </li>
                                </ul>
                                <ul class="set-content-c">
                                    <li class="c-item global-speed">
                                        <div class="txt">{{ $t('慢') }}</div>
                                        <div class="c-item-speed-slider">
                                            <el-slider 
                                            v-model="connectorSet.globalSpeed.value"
                                            :min="connectorSet.globalSpeed.min" 
                                            :max="connectorSet.globalSpeed.max"
                                            :show-tooltip="false"
                                            @change="globalSpeedChange"
                                            ></el-slider>
                                        </div>
                                        <div class="txt">{{ $t('快') }}</div>
                                    </li>
                                    <li class="c-item single-time">
                                        <div class="single-time-min">
                                            <span class="txt">{{ $t('最短：') }}</span>
                                            <el-select class="c-item-select" v-model="connectorSet.singleTime.min.value" :popper-append-to-body="false"
                                            popper-class="c-item-select-options">
                                                <el-option
                                                v-for="item in connectorSet.singleTime.min.data"
                                                :key="item.name"
                                                :label="$t(item.name)"
                                                :value="item.value">
                                                    <span>{{$t(item.label)}}</span>
                                                </el-option>
                                            </el-select>
                                        </div>
                                        <div class="single-time-max">
                                            <span class="txt">{{ $t('最长：') }}</span>
                                            <el-select class="c-item-select" v-model="connectorSet.singleTime.max.value" :popper-append-to-body="false"
                                            popper-class="c-item-select-options">
                                                <el-option
                                                v-for="item in connectorSet.singleTime.max.data"
                                                :key="item.name"
                                                :label="$t(item.name)"
                                                :value="item.value">
                                                    <span>{{$t(item.label)}}</span>
                                                </el-option>
                                            </el-select>
                                        </div>
                                    </li>
                                    <li class="c-item network-delay">
                                        <el-select class="c-item-select" v-model="connectorSet.networkDelay.value" :popper-append-to-body="false"
                                        popper-class="c-item-select-options">
                                            <el-option
                                            v-for="item in connectorSet.networkDelay.data"
                                            :key="item.name"
                                            :label="$t(item.name)"
                                            :value="item.value">
                                                <span>{{$t(item.label)}}</span>
                                            </el-option>
                                        </el-select>
                                    </li>
                                    <li class="c-item resign-con">
                                        <span class="txt">{{ $t('胜率低于：') }}</span>
                                        <el-select class="c-item-select" v-model="connectorSet.resignCon.value" :popper-append-to-body="false"
                                        popper-class="c-item-select-options">
                                            <el-option
                                            v-for="item in connectorSet.resignCon.data"
                                            :key="item.name"
                                            :label="$t(item.name)"
                                            :value="item.value">
                                                <span>{{$t(item.label)}}</span>
                                            </el-option>
                                        </el-select>
                                    </li>
                                    <li class="c-item play-random">
                                        <div class="play-random-position">
                                            <span class="txt">{{ $t('前：') }}</span>
                                            <el-select class="c-item-select" v-model="connectorSet.playRandom.position.value" :popper-append-to-body="false"
                                            popper-class="c-item-select-options">
                                                <el-option
                                                v-for="item in connectorSet.playRandom.position.data"
                                                :key="item.name"
                                                :label="$t(item.name)"
                                                :value="item.value">
                                                    <span>{{$t(item.label)}}</span>
                                                </el-option>
                                            </el-select>
                                        </div>
                                        <div class="play-random-value">
                                            <span class="txt">{{ $t('随机性：') }}</span>
                                            <el-select class="c-item-select" v-model="connectorSet.playRandom.randomVal.value" :popper-append-to-body="false"
                                            popper-class="c-item-select-options">
                                                <el-option
                                                v-for="item in connectorSet.playRandom.randomVal.data"
                                                :key="item.name"
                                                :label="$t(item.name)"
                                                :value="item.value">
                                                    <span>{{$t(item.label)}}</span>
                                                </el-option>
                                            </el-select>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div class="connector-submit-box">
                                <el-button class="connector-set-submit" @click="connectorSetSubmit()">
                                    <span class="txt">{{ $t('应用') }}</span>
                                </el-button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="connect-line-foot">
            </div>
        </div>
        <connectorOI ref="connectorOI"></connectorOI>
    </div>
</template>

<script>
    import connectorOI from './connectorOI.vue'

    export default {
        name: 'connect-line',
        props: {
            clineStatus: Boolean,
            engineId: String,
            pathNowApp: String
        },
        data() {
            return {
                previewImg: [
                    `${this.GLOBAL.assetsUrl}/img/connector-oi.png`
                ],
                localDataKey: this.GLOBAL.connectorLocalKey,
                connectorSetActive: false,
                connectorSetCopy: {},
                globalSpeedSliderValue: 0,
                connectorSet: {
                    loading: false,
                    active: false,
                    globalSpeed: {
                        min: -3,
                        max: 9,
                        labelTxt: [],
                        value: 0,
                        valueSlider: 0
                    },
                    singleTime: {
                        min: {
                            data: [
                                {name: '0秒', label: '0秒', value: 0},
                                {name: '1秒', label: '1秒', value: 1},
                                {name: '2秒', label: '2秒', value: 2},
                                {name: '3秒', label: '3秒', value: 3},
                                {name: '4秒', label: '4秒', value: 4},
                                {name: '5秒', label: '5秒', value: 5},
                            ],
                            value: 0
                        },
                        max: {
                            data: [
                                {name: '30秒', label: '30秒', value: 30},
                                {name: '60秒', label: '60秒', value: 60},
                                {name: '90秒', label: '90秒', value: 90},
                                {name: '120秒', label: '120秒', value: 120},
                                {name: '150秒', label: '150秒', value: 150},
                                {name: '180秒', label: '180秒', value: 180},
                            ],
                            value: 120
                        }
                    },
                    networkDelay: {
                        data: [
                            {name: '2秒', label: '2秒', value: 2},
                            {name: '3秒', label: '3秒', value: 3},
                            {name: '4秒', label: '4秒', value: 4},
                            {name: '5秒', label: '5秒', value: 5},
                        ],
                        value: 2
                    },
                    resignCon: {
                        data: [
                            {name: '永不', label: '永不', value: -1},
                            {name: '0%', label: '0%', value: 0},
                            {name: '5%', label: '5%', value: 0.05},
                            {name: '10%', label: '10%', value: 0.1},
                            {name: '15%', label: '15%', value: 0.15},
                            {name: '20%', label: '20%', value: 0.2},
                        ],
                        value: 0.05
                    },
                    playRandom: {
                        position: {
                            data: [
                                {name: '10手', label: '10手', value: 10},
                                {name: '20手', label: '20手', value: 20},
                                {name: '30手', label: '30手', value: 30},
                            ],
                            value: 10
                        },
                        randomVal: {
                            data: [
                                {name: '较大', label: '较大', value: 1},
                                {name: '适中', label: '适中', value: 0.75},
                                {name: '少量', label: '少量', value: 0.5},
                            ],
                            value: 1
                        },
                    }
                },
                active: false,
                ip: null,
                port: null,
                status: {
                    ip: null,
                    port: null,
                    active: false,
                    loading: true
                },
                queryInterval: {
                    active: false,
                    interval: null,
                    time: this.GLOBAL.clineQueryTime
                }
            };
        },
        methods: {
            open(opt){
                this.checkPortStatus()
                this.active = true
            },
            close(){
                this.active = false
                this.connectorSetOff()
            },
            checkPortStatus(){
                let avtive = this.$store.state.clinePort && this.$store.state.clineIp
                this.status = {
                    ip: this.$store.state.clineIp,
                    port: this.$store.state.clinePort,
                    active: avtive
                }
                this.$emit('change', {
                    'clineStatus': this.status.active
                })
            },
            service(){
                this.$refs['service'].open()
            },
            portCon(){
                this.clineStatus ? this.portDelete() : this.portCreate()
            },
            async portCreate(){
                if(this.getPortDisabled) return
                let path = this.$route.path
                if(!this.$store.state.engine_id || path.indexOf('/engine/analyse') <= -1){
                    this.$refs['leConfirm'].open({
                        message: '请先在研究模式下开始研究。',
                        button: [
                            {name: '确定'}
                        ]
                    })
                    return
                }
                this.LOADING.open(document.querySelector('.connect-line-content .content-link-box .link-item.btn .el-button'))
                let res = await this.GLOBAL.connectPortsCreate()
                this.LOADING.close()
                this.$forceUpdate()
                if(res && res.code == 0){
                    return this.checkPortStatus({port: res.data})
                }
                
            },
            async portDelete(){
                if(!this.clineStatus) return
                this.LOADING.open(document.querySelector('.connect-line-content .content-link-box .link-item.btn .el-button'))
                let res = await this.GLOBAL.connectPortsDelete()
                this.LOADING.close()
                this.$forceUpdate()
                if(res && res.code == 0){
                    return this.checkPortStatus({port: res.data})
                }
                
            },
            setLinePort(opt){
                let ip = opt.ip || this.GLOBAL.clineIp
                let port = opt.port
                if(!port) return
                this.status = {
                    ip: ip,
                    port: opt.port,
                    active: true
                }
            },
            async queryLinePort(){
                if(!this.$store.state.engine_id) return
                let res = await this.GLOBAL.connectPortsQuery()
                if(res && res.code == 0 && res.data != -1)
                return this.checkPortStatus({port: res.data})
            },
            clineQueryIntervalCon(){
                this.clineStatus ? this.clineQueryIntervalOn() : this.clineQueryIntervalOff()
            },
            async clineQueryIntervalOn(){
                this.queryInterval.active = true
                this.clineQueryInterva()
            },
            clineQueryIntervalOff(){
                this.clearQueryInterval()
                this.queryInterval.active = false
            },
            clearQueryInterval(){
                if(this.queryInterval.interval == null) return
                clearInterval(this.queryInterval.interval)
                this.queryInterval.interval = null
            },
            clineQueryInterva(time){
                // this.clearQueryInterval()
                if(!this.queryInterval.active) return
                time = time || 0
                let timeOut = this.queryInterval.time - time
                setTimeout(() => {
                    let tNow = new Date().getTime()
                    this.GLOBAL.connectLineCheck().then(res => {
                        this.checkPortStatus()
                        let tAft = new Date().getTime()
                        this.clineQueryInterva(tAft - tNow)
                    })
                }, timeOut)
                // this.queryInterval.interval = setInterval(() => {
                //     if(!this.queryInterval.active) return this.clearQueryInterval()
                //     this.GLOBAL.connectLineCheck()
                // }, this.queryInterval.time)
                
            },
            connectorSetCon(){
                this.connectorSetActive ? this.connectorSetOff() : this.connectorSetOn()
            },
            connectorSetOn(){
                if(!this.clineStatus) return
                this.connectorSetActive = true
            },
            connectorSetOff(){
                this.connectorSetActive = false
            },
            async connectorSetQuery(){
                if(!this.$store.state.engine_id || !this.clineStatus) return
                this.connectorSet.loading = true
                let opt = {
                    command: 'connector_flag'
                }
                let res = await this.sendEngineCode(opt)
                if(res && res.code == 0) this.connectorAttSet(res.data)
                this.connectorSet.loading = false
            },
            setConnectorAttByServerData(data){
                let opt = this.GLOBAL.deepCopy(this.connectorSet)
                data = data.split(' ')
                data[0] = isNaN(Number(data[0])) ? 0 : Number(data[0])
                opt.globalSpeed.value = data[0]
                data[1] = isNaN(Number(data[1])) ? 120 : Number(data[1])
                opt.singleTime.max.value = data[1]
                data[2] = isNaN(Number(data[2])) ? 0 : Number(data[2])
                opt.singleTime.min.value = data[2]
                data[3] = isNaN(Number(data[3])) ? 2 : Number(data[3])
                opt.networkDelay.value = data[3]
                data[4] = isNaN(Number(data[4])) ? 0.05 : Number(data[4])
                opt.resignCon.value = data[4]
                let random = data[5].split('/')
                let p0 = random[0].split('_')
                let p1 = random[1].split('_')
                let p2 = random[2].split('_')
                opt.playRandom.position.value = Number(p2[0]) - 1
                opt.playRandom.randomVal.value = Number(p1[1])
                return opt
            },
            getConnectorAttForServerData(opt){
                opt = opt || this.connectorSet
                let data = ''
                let random = `0_${opt.playRandom.randomVal.value}/${opt.playRandom.position.value}_${opt.playRandom.randomVal.value}/${opt.playRandom.position.value + 1}_0`
                data = `${data}${opt.globalSpeed.value} ${opt.singleTime.max.value} ${opt.singleTime.min.value} ${opt.networkDelay.value} ${opt.resignCon.value} ${random}`
                return data
            },
            connectorAttSet(data){
                let opt = this.setConnectorAttByServerData(data)
                this.connectorSet = opt
                this.$forceUpdate()
                this.connectorAttServerDataSet(data)
            },
            connectorAttServerDataSet(){
                this.connectorSetCopy = this.GLOBAL.deepCopy(this.connectorSet)
            },
            async connectorSetSubmit(data){
                if(!this.$store.state.engine_id || !this.clineStatus) return
                this.connectorSet.loading = true
                data = data || this.getConnectorAttForServerData()
                let saveData = data
                data = data.split(' ')
                data = data.join(':')
                let post = {
                    command: 'connector_flag',
                    params: data
                }
                let res = await this.sendEngineCode(post)
                this.GLOBAL.errorHandle(res, 'connectSet')
                if(res && res.code == 0) this.saveConnectorSet(saveData)
                this.connectorSet.loading = false
            },
            async connectorSetSubmitAction(post, index, resData){
                // let opt = this.connectorSet, optCopy = this.connectorSetCopy
                // let post = []
                // if(opt.globalSpeed.value != optCopy.globalSpeed.value) post.push({command: 'clock_accelerate', params: opt.globalSpeed.value})
                // if(opt.singleTime.max.value != optCopy.singleTime.max.value) post.push({command: 'max_move_time', params: opt.singleTime.max.value})
                // if(opt.singleTime.min.value != optCopy.singleTime.min.value) post.push({command: 'min_move_time', params: opt.singleTime.min.value})
                // if(opt.networkDelay.value != optCopy.networkDelay.value) post.push({command: 'clock_mouse_time', params: opt.networkDelay.value})
                // if(opt.resignCon.value != optCopy.resignCon.value) post.push({command: 'resign_thres', params: opt.resignCon.value})
                // if(opt.playRandom.position.value != optCopy.playRandom.position.value || opt.playRandom.randomVal.value != optCopy.playRandom.randomVal.value){
                //     let random = `0:${opt.playRandom.randomVal.value}/${opt.playRandom.position.value}:${opt.playRandom.randomVal.value}/${opt.playRandom.position.value + 1}:0` 
                //     post.push({
                //         command: 'resign_thres', params: random
                //     })
                // }
                // this.connectorSetSubmitAction(post)
                // .then(resData => {
                // })
                index = index || 0
                resData = resData || []
                let sendData = post[index]
                let res = await this.sendEngineCode(sendData)
                resData.push(res)
                if(index >= post.length - 1){
                    return resData
                }
                index++
                return this.connectorSetSubmitAction(post, index, resData)
            },
            async sendEngineCode(opt){
                let method = opt.method || 'POST'
                let timeout = opt.timeout || 25000
                let options = {
                    url: '/engines/' + this.$store.state.engine_id,
                    timeout: timeout,
                    method: method,
                    data: {
                        command: opt.command,
                        params: opt.params,
                    }
                }
                let res = await this.GLOBAL.request('engine', options)
                return res
            },
            globalSpeedChange(val){
                // this.connectorSet.globalSpeed.value = -val
            },
            saveConnectorSet(data){
                let saveData = {}
                saveData[this.localDataKey] = data
                this.GLOBAL.setItem(saveData)
            },
            connectorOICon(){
                this.$refs['connectorOI'].panelCon()
            }
        },
        created() {
            this.connectorAttServerDataSet()
        },
        components: {
            connectorOI
        },
        computed: {
            getPortDisabled(){
                let path = this.pathNowApp
                if(!this.engineId || path.indexOf('/engine/analyse') <= -1) return true
                return false
            }
        },
        watch: {
            status: {
                handler(){

                },
                immediate: true,
                deep: true,
            },
            clineStatus: {
                handler(val){
                    this.clineQueryIntervalCon()
                    // this.connectorSetQuery()
                    if(!val) this.connectorSetOff()
                },
                deep: true,
                immediate: true
            },
            connectorSetActive: {
                handler(val){
                    if(val) this.connectorSetQuery()
                },
                immediate: true,
                deep: true,
            },
            connectorSet: {
                handler(val){
                    // this.globalSpeedSliderValue = -this.connectorSet.globalSpeed.value
                },
                immediate: true,
                deep: true,
            }
        },
        mounted() {
            // let data = this.$store.state[this.localDataKey]
            // if(!data) return
            // let opt = this.setConnectorAttByServerData(data)
            // this.connectorSet = opt
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
<style lang='less'>
    @c-item-single-time-height: 1.2rem;
    @c-item-global-speed-height: 1.2rem;
    @c-item-num: 5;
    @ct-item-margin-top: 1rem;
    @connector-set-submit-height: 1.6rem;
    @connector-set-submit-margin-top: 1.5rem;
    @content-link-box-body-width: 26.45rem;
    .connect-line{
        position: fixed;
        top: 0px;
        left: 0px;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 99999;
        
    }
    .connect-line-body{
        width: 40rem;
        background: #fff;
        color: #333;
        padding: 0px;
        
    }
    .connect-line-title{
        padding: 0.8rem 0px;
        text-align: center;
        position: relative;
        color: #fff;
        background: #416692;
        .line-title-body{
            display: flex;
            align-items: flex-start;
            justify-content: center;
            width: @content-link-box-body-width;
            margin: 0px auto;
            position: relative;
            .title--help-icon{
                margin-left: 0.3rem;
                font-size: 1rem;
            }
            .connector-oi-icon{
                cursor: pointer;
                position: absolute;
                right: 0px;
                bottom: 0rem;
                display: flex;
                align-items: center;
                .txt{
                    font-size: 0.7rem;
                    font-weight: normal;
                }
                .connector-oi-icon-img{
                    margin-left: 0.2rem;
                    width: 0.7rem;
                }
            }
        }
        .txt{
            font-size: 1rem;
        }
        .close-icon{
            cursor: pointer;
            position: absolute;
            right: 0.2rem;
            top: 0.2rem;
            font-size: 1.1rem;
        }
    }
    .connect-line-content{
        padding: 1rem 0px;
        font-size: 0.8rem;
        .content-notice{
            font-size: 1rem;
        }
        .content-link-box{
            display: flex;
            justify-content: center;
            margin-top: 1rem;
            .content-link-box-body{
                display: flex;
                justify-content: center;
                width: ;
            }
            .link-item:last-child{
                margin: 0px;
            }
            .link-item.btn{
                .el-button{
                    padding: 0px;
                    width: 6rem;
                    height: 2rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #fff;
                    border: 0px;
                }
                .el-button:disabled{
                    opacity: 0.6;
                }
                .el-button.on{
                    background: #C30606;
                }
                .el-button.off{
                    background: #416692;
                }
            }
            .link-item{
                display: flex;
                align-items: center;
                margin-right: 0.8rem;
                white-space: nowrap;
                .el-input__inner{
                    width: 8rem;
                    height: 1.5rem;
                    padding: 0px 0.5rem;
                }
                
            }
            .link-item.port{
                .el-input__inner{
                    width: 6rem;
                }
            }
        }
        .connect-set{
            @connect-set-title-size: 0.8rem;
            margin-top: 1rem;
            .connect-set-title.disabled{
                color: #999;
                .connect-set-title-body{
                    cursor: not-allowed;
                }
            }
            .connect-set-title{
                font-weight: 600;
                color: #000;
                display: flex;
                align-items: center;
                justify-content: center;
                .txt{
                    font-size: @connect-set-title-size;
                }
                .connect-set-title-icon{
                    font-size: 1rem;
                    font-weight: 600;
                }
                .connect-set-title-body{
                    cursor: pointer;
                }
            }
    //         @c-item-single-time-height: 1.5rem;
    // @c-item-global-speed-height: 1.2rem;
    // @c-item-num: 5;
            .connect-set-content.active{
                height: calc(@c-item-single-time-height * (@c-item-num - 1) + @c-item-global-speed-height + @ct-item-margin-top * (@c-item-num - 1) + @connector-set-submit-height + @connector-set-submit-margin-top);
            }
            .set-content-ct-body{
                display: flex;
                justify-content: center;
            }
            .connect-set-content{
                position: relative;
                transition: height .3s;
                @el-slider__button-wrapper-size: 0.75rem;
                height: 0px;
                overflow: hidden;
                
                margin-top: 1rem;
                .txt{
                    font-size: 0.8rem;
                }
                .c-item.single-time, .t-item.single-time{
                    margin-top: @ct-item-margin-top;
                    height: @c-item-single-time-height;
                }
                .c-item.global-speed, .t-item.global-speed{
                    height: @c-item-global-speed-height;
                }
                .c-item.network-delay, .t-item.network-delay{
                    margin-top: @ct-item-margin-top;
                    height: @c-item-single-time-height;
                }
                .c-item.resign-con, .t-item.resign-con{
                    margin-top: @ct-item-margin-top;
                    height: @c-item-single-time-height;
                }
                .c-item.play-random, .t-item.play-random{
                    margin-top: @ct-item-margin-top;
                    height: @c-item-single-time-height;
                }
                
                .set-content-t{
                    margin-right: 0.3rem;
                    .t-item{
                        display: flex;
                        align-items: center;
                    }
                }
                .set-content-c{
                    .c-item.global-speed{
                        display: flex;
                        white-space: nowrap;
                        align-items: center;
                        .c-item-speed-slider{
                            margin: 0px 0.3rem;
                            padding: 0px calc(@el-slider__button-wrapper-size / 2);
                            width: 13rem;
                            .el-slider__runway{
                                height: 0.2rem;
                                background: #000;
                                margin: 0px;
                                .el-slider__bar{
                                    background: inherit;
                                    height: 100%;
                                }
                            }
                            .el-slider__button-wrapper{
                                width: @el-slider__button-wrapper-size;
                                height: @el-slider__button-wrapper-size;
                                top: 0px;
                                bottom: 0px;
                                margin: auto;
                                .el-slider__button{
                                    width: 100%;
                                    height: 100%;
                                    background: #000;
                                    border: 0px;
                                    float: left;
                                }
                                
                            }
                        }
                    }
                    
                    .c-item.single-time{
                        display: flex;
                        .single-time-max{
                            margin-left: 1rem;
                        }
                    }
                    .c-item.play-random{
                        display: flex;
                        .play-random-value{
                            margin-left: 1rem;
                        }
                    }
                    .c-item{
                        text-align: left;
                        .c-item-select{
                            width: 5rem;
                            height: @c-item-single-time-height;
                            .el-input--suffix{
                                height: 100%;
                                .el-input__inner{
                                    padding: 0px;
                                    padding-right: 0.2rem;
                                    height: 100%;
                                    text-align: center;
                                    color: #000;
                                    border-color: #000;
                                    font-size: 0.8rem;
                                }
                            }
                            .el-input__suffix{
                                right: 0.2rem;
                            }
                            .el-select__caret{
                                display: flex;
                                align-items: center;
                                font-size: 0.8rem;
                                color: #000;
                                width: auto;
                            }
                            .c-item-select-options{
                                .el-select-dropdown__item{
                                    color: #000;
                                    span{
                                        font-size: 0.8rem;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    .connector-submit-box{
        padding-top: @connector-set-submit-margin-top;
        .connector-set-submit:hover{
            color: #fff;
            background: #416692;
        }
        .connector-set-submit:active{
            color: #fff;
            background: #416692;
        }
        .connector-set-submit:focus{
            color: #fff;
            background: #416692;
        }
        .connector-set-submit{
            color: #fff;
            padding: 0px;
            width: 8rem;
            height: @connector-set-submit-height;
            background: #416692;
            .txt{
                font-size: 1rem;
            }
        }
    }
    .connect-line-foot{
        // // padding: 0.5rem 0px;
        // padding-bottom: 0.8rem;
        // display: flex;
        // align-items: center;
        // justify-content: center;
        // .el-button:last-child{
        //     margin: 0px;
        // }
        // .el-button.cancel{
        //     background: #C0C0C0;
        //     color: #6C6C6C;
        // }
        // .el-button.confirm{
        //     background: #416692;
        //     color: #fff;
        // }
        // .el-button{
        //     margin: 0px;
        //     display: flex;
        //     justify-content: center;
        //     align-items: center;
        //     padding: 0px;
        //     background: #416692;
        //     color: #fff;
        //     width: 6rem;
        //     height: 1.6rem;
        //     margin-right: 1rem;
        // }
        
    }
</style>