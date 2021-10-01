<!--  -->
<template>
   <div class='line-chat page-panel-bcg'>
        <!-- <div class="chat-middle-line"></div> -->
        <div class="line-chat-fun">
            <div class="line-chat-f-opt">
                <ul class="type-box" v-show="!hideType" v-if="!defineTypeBox">
                    <li class="type-item line-chat-card-bcg" v-for="v in lineTypeCul" :key="v.value" :class="{'select line-chat-card-select': lineType.value == v.value}" @click="typeChange(v)">
                        <span class="txt">{{$t(v.name)}}</span>
                    </li>
                </ul>
                <!-- <ul class="type-box">

                </ul> -->
                <slot name="lineType" v-if="defineTypeBox"></slot>
                <div class="data-loading" v-show="reportWatching">
                    <div class="data-loading-body">
                        <div class="data-loading-range-box">
                            <div class="data-loading-range-value">
                                <div class="range-value-s" :style="{'width': `${culDataLoadRange}%`}"></div>
                            </div>
                            <div class="data-loading-txt">
                                <span class="">{{culDataLoadRange}}%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="line-chat-s-opt">
                <ul class="chat-label">
                    <li class="chat-label-item" v-for="(v, i) in winrateItem" :key="i" v-show="lineType.value == 0" 
                    :class="{'line-hide': !v.show}" @click="winrateLineShowCon(v)">
                        <div class="label-item-icon" :style="{'background': v.color}"></div>
                        <span>{{$t(v.name)}}</span>
                    </li>
                </ul>
                <!-- <div class="data-loading" v-show="reportWatching">
                    <div class="data-loading-body">
                        <div class="data-loading-range-box">
                            <div class="data-loading-range-value">
                                <div class="range-value-s" :style="{'width': `${culDataLoadRange}%`}"></div>
                            </div>
                            <div class="data-loading-txt">
                                <span class="">{{culDataLoadRange}}%</span>
                            </div>
                        </div>
                    </div>
                </div> -->
            </div>
        </div>
        <div class="line-chat-box" v-show="lineType.data[lineType.value].label != 'comment'">
            <div class="sub-type-box" v-show="lineType.data[lineType.value].label != 'winrate'">
                <ul class="type-level-box" v-show="lineType.data[lineType.value].label != 'winrate' && lineType.data[lineType.value].label != 'comment'">
                    <li class="type-level-item" v-for="v in subType.data" :key="v.value" :class="{'select': subType.value == v.value}" @click="subTypeChange(v)">{{$t(v.name)}}</li>
                </ul>
                <ul class="type-level-box" v-show="lineType.data[lineType.value].label == 'badPoint'">
                    <li class="type-level-item" v-for="v in subTypeColor.data" :key="v.value" :class="{'select': subTypeColor.value == v.value}" @click="subTypeColorChange(v)">{{$t(v.name)}}</li>
                </ul>
            </div>
            <div class="line-chat-body" id="lineChatBox" :class="{'pointer': chatClass, 'level-type': lineType.data[lineType.value].label == 'level' || lineType.data[lineType.value].label == 'badPoint', 'visibility-hidden': hideChat}">
                
            </div>
        </div>
        
    </div>
</template>

<script>
    import echarts from 'echarts'
    import {langRequireHandle} from '../mixin/languageMixin'

    
    // window.__darkChatColor = ['#A0E8FF', '#FFF584']
    // window.__lightChatColor = ['#4088BF', '#FFF584']
    window.__CHATCOLORCONFIG = {
        __darkChatColor : ['#A0E8FF', '#FFF584'],
        __lightChatColor : ['#4088BF', '#FFF584'],
        __datkSplitLineColor: '#AFAFB2',
        __lightSplitLineColor: '#AFAFB2',
        __darkXLineColor: '#CCCCCC',
        __lightXLineColor: '#333',
        __darkXFontColor: '#fff',
        __lightXFontColor: '#333',
    }
    let winrateItem = [
        {name: '黑胜率', color: '#A0E8FF', show: true},
        {name: '黑领先目', color: '#FFF584', show: true},
    ]
    let theme = localStorage.getItem('theme') || 'dark'
    export default {
        name: '',
        props: {
            defineTypeBox: Boolean,
            minNum: Number,
            position: Number,
            list: Object,
            theme: String,
            reportWatching: Boolean,
            createNum: Number,
            step: Number,
            reportPlan: Object,
            reportFinished: Number,
            hideType: Boolean,
            lineTypeDisplay: Array,
            username: String,
            isAdmin: Boolean,
            limitFun: Boolean,
            extendTypeName: String
        },
        data() {
            return {
                pathNow: this.$route.path,
                lang: 'zh',
                winrateItem: winrateItem,
                chatClass: null,
                lineType: {
                    value: 0,
                    data: [
                        {name: '走势图', value: 0, label: 'winrate'},
                        {name: '问题手', value: 1, label: 'badPoint', clickCallback: 'badPointClickCallback', subType: true},
                        {name: '发挥水准', value: 2, label: 'level', subType: true},
                        {name: '评论', fun: 'commentOn', value: 3, label: 'comment', noneChat: true, extendType: true},
                    ]
                },
                subType: {
                    value: 0,
                    data: [
                        // {name: '全盘', value: 0, min: 0, max: -1},
                        // {name: '布局', value: 1, min: 0, max: 60},
                        // {name: '中盘', value: 2, min: 61, max: 180},
                        // {name: '官子', value: 3, min: 181, max: -1},
                        {name: '全盘', value: 0, min: 0, max: -1},
                        {name: '布局', value: 1, min: 0, max: 59},
                        {name: '中盘', value: 2, min: 60, max: 149},
                        {name: '官子', value: 3, min: 150, max: -1},
                    ]
                },
                subTypeColor: {
                    value: 0,
                    data: [
                        {name: '双方', value: 0},
                        {name: '黑方', value: 1},
                        {name: '白方', value: -1},
                    ]
                },
                yAxis: [],
                chatColor: __CHATCOLORCONFIG.__darkChatColor,
                splitLineColor:__CHATCOLORCONFIG.__datkSplitLineColor,
                xLineColor: __CHATCOLORCONFIG.__darkXLineColor,
                xFontColor: __CHATCOLORCONFIG.__darkXFontColor,
        //         __darkXLineColor: '#CCCCCC',
        // __lightXLineColor: '#333',
        // __darkXFontColor: '#fff',
        // __lightXFontColor: '#333',
                echarts: null,
                option: {
                    animation: false,
                    legend: {
                        show: false
                    },
                    xAxis: {
                        // name: '手数',
                        type: 'category',
                        boundaryGap: false,
                        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                        show: true,
                        axisLine: {
                            show: true,
                            lineStyle: {
                                color: '#CCCCCC',
                                width: 2,
                            }
                        },
                        axisTick: {
                            show: false,
                            length: 200,
                            inside: true
                        },
                        axisLabel: {
                            show: true,
                            showMaxLabel: true,
                            showMinLabel: true,
                        },
                        axisPointer: {
                            show: true,
                            snap: true,
                            lineStyle: {
                                width: 2,
                            },
                        },
                    },
                    axisPointer: {
                        triggerOn: 'mousemove',
                        lineStyle: {
                            color: '#CCCCCC',
                            type: 'dashed'
                        }
                        
                    },
                    yAxis: {},
                    grid: {  
                        left: '3%',  
                        right: '3%',  
                        bottom: '10%', 
                        top: '10%',
                        containLabel: true  
                    },
                    tooltip: {
                        show: true,
                        trigger: 'axis',
                        axisPointer: {
                            type: 'line'
                        },
                        formatter: '{b}手 {c0}% {c1}目',
                        textStyle: {
                            align: 'left'
                        }
                    },
                    series: [
                        
                    ],
                    seriesTemplate: {
                        type: 'line',
                        lineStyle: {
                            color: '#fff'
                        },
                        symbol: 'circle',
                        symbolSize: 8,
                        itemStyle: {
                            normal: {
                                color: '#fff'
                            }
                        },
                    }
                }
            };
        },
        methods: {
            pageInit(){
                setTimeout(() => {
                    this.echarts = echarts.init(document.querySelector('.line-chat .line-chat-body')) 
                    this.echarts.hideLoading()
                }, 500);
            },
            setEchartsObj(){
                let promise = new Promise(res => {
                    if(this.echarts != null) res()
                    setTimeout(() => {
                        this.echarts = echarts.init(document.querySelector('.line-chat .line-chat-body')) 
                        this.echarts.getZr().on('click', this.chatClick)
                        this.echarts.getZr().on('mousemove', this.charMouseMove)
                        res()
                    }, 500);
                })
                return promise
            },
            filterOptions(opt){
                let data = this.lineType.data[this.lineType.value]
                if(data.noneChat) return opt
                let fun = `${data.label}FilterOpt`
                if(!this[fun]) return opt
                opt = this[fun](opt)
                return opt
            },
            winrateFilterOpt(opt){
                try{
                    if(this.GLOBAL.isArray(opt.series)){
                        for(var i in opt.series){
                            opt.series[i].data = opt.series[i].data.splice(this.minNumCul, opt.series[i].data.length - this.minNumCul)
                        }
                    }else{
                        opt.series.data = opt.series.data.splice(this.minNumCul, opt.series.data.length - this.minNumCul)
                    }
                    opt.xAxis.data = opt.xAxis.data.splice(this.minNumCul, opt.xAxis.data.length - this.minNumCul)
                }catch(e){}
                return opt
            },
            setOptions(opt){
                this.setEchartsObj().then(() => {
                    this.echarts.setOption(opt, {
                        notMerge: true
                    })
                })
            },
            dataUpdate(newVal){
                this.chatData = null
                this.chatData = this.GLOBAL.deepCopy(newVal)
                this.optionsReset()
            },
            optionsReset(opt){
                if(!this.chatData) return
                let fun = this.lineType.data[this.lineType.value].label
                if(this[`${fun}ChatUpdate`]) this[`${fun}ChatUpdate`](opt)
            },
            badPointChatUpdate(opt){
                let data = this.parseDataBadPoint(null, opt)
                if(!data.xData.length) return
                let option = this.GLOBAL.deepCopy(this.option)
                option.tooltip.formatter = (val) => {
                    this.tooltipPoint = val
                    return `${window.i18n.t('第')}${Number(val[0].data.index) + 1}${window.i18n.t('手')}<br />${window.i18n.t('胜率')}${val[0].data.bestPointWinrate}%<span class="el-icon-right"></span>${val[0].data.actualPointWinrate}%
                    <br />${window.i18n.t('目差')}${val[0].data.bestPointDelta}<span class="el-icon-right"></span>${val[0].data.actualPointDelta}`
                }
                option.yAxis = this.GLOBAL.deepCopy(this.yAxis)
                let minValue = -90
                option.yAxis[0].min = minValue
                option.yAxis[0].max = 100
                option.yAxis[0].interval = 100
                option.yAxis[0].splitLine.show = false
                option.yAxis[1].splitLine.show = false
                option.yAxis[0].show = false
                option.yAxis[0].axisLabel.show = true
                option.yAxis[0].axisLine.lineStyle.color = this.GLOBAL.themeConfig[this.theme].panelBackground
                option.yAxis[0].axisLabel.color = this.GLOBAL.themeConfig[this.theme].panelBackground
                option.yAxis[0].axisLabel.formatter = val => {
                    if(val == 100) return val
                    if(val == 50) return val
                    return ''
                }
                option.yAxis[1].show = false
                option.yAxis[1].min = this.winrateDeltaMaxTem || 100
                option.yAxis[1].max = -this.winrateDeltaMaxTem || -100
                option.yAxis[1].interval = this.winrateDeltaMaxTem || 50
                option.yAxis[1].axisLabel.show = true
                option.yAxis[1].axisLine.lineStyle.color = this.GLOBAL.themeConfig[this.theme].panelBackground
                option.yAxis[1].axisLabel.color = this.GLOBAL.themeConfig[this.theme].panelBackground
                option.yAxis[1].axisLabel.formatter = val => {
                    if(val == 0) return val
                    if(val == option.yAxis[1].min) return val
                    if(val == option.yAxis[1].max) return val
                    return ''
                }
                option.xAxis.data = data.xData
                option.xAxis.max = data.xData.length - 1
                // option.xAxis.axisLabel.interval = this.culXaisLabel(data.xData.length)
                // option.xAxis.axisLabel.interval = this.culXaisLabel(data.xDataShow.length)
                // option.xAxis.data = data.xDataShow
                // option.xAxis.max = data.xDataShow.length - 1
                option.xAxis.min = 0
                option.xAxis.axisLine.onZero = false
                option.xAxis.axisLabel.formatter = val => {
                    return Number(val) + 1 + ''
                }
                option.series = []
                let seriesTemplate = this.GLOBAL.deepCopy(option.seriesTemplate)
                seriesTemplate.type = 'scatter'
                option.series.push(seriesTemplate)
                option.series.push(this.GLOBAL.deepCopy(seriesTemplate))
                // option.series.data = data.seriesData
                option.series[0].data = data.yDataShow
                option.series[0].zlevel = 99
                option.series[0].markLine = {
                    symbol: 'none',
                    lineStyle: {
                        color: '#FFFFFF',
                        width: 2,
                        type: 'solid',
                        zIndex: -1
                    },
                    data: [
                        [
                            {
                                coord: [this.position + '', minValue]
                            },
                            {
                                coord: [this.position + '', 100]
                            },
                        ],
                    ]
                }
                option.series[1].yAxisIndex = 1
                option.series[1].data = data.yData2
                let f = false
                for(var i in data.xData){
                    if(data.xData[i] == this.position){
                        f = true
                        break
                    }
                }
                if(!f){
                    option.series[0].markLine = undefined
                }
                this.setOptions(option)
            },
            parseDataBadPoint(data, opt){
                data = data || this.chatData
                let xData = [], seriesData = [], color, c = 1, winrate, w = [], b = [], xDataShow = [], yDataShow = []
                let yData2 = []
                opt = opt || {}
                opt = this.getMinMax()
                let DataMax = opt.max || this.step - 1, DataMin = opt.min || 0, typeColor = opt.color
                for(var i in data){
                    // if(i < this.minNumCul) continue
                    // xDataShow.push('' + i)
                    if((data[i] && data[i].userScore && this.GLOBAL.badPointList[data[i].userScore.key] && Number(i) >= DataMin && Number(i) <= DataMax && (!typeColor || typeColor == c)) && i >= this.minNumCul){
                        color = data[i].userScore ? data[i].userScore.color : null
                        winrate = data[i].value
                        let ck = c == 1 ? 'b' : 'w'
                        let badPointcon = data[i].userScore.badPointcon ? `${this.GLOBAL.assetsUrl}/img/${data[i].userScore.badPointcon}_${ck}.png` : '' 
                        let badPointconL = badPointcon != '' ?  `${this.GLOBAL.assetsUrl}/img/bl_${ck}.png` : ''
                        let borderColor = c == 1 ? '#000' : '#fff'
                        // let sort1 = data[i].options[0].winrate - data[i].actualValue
                        let sort = data[i].evaluate
                        let bestPointWinrate = 0, bestPointDelta = 0
                        if(data[i].options && data[i].options[0]){
                            if(data[i].options[0].winrate != undefined) bestPointWinrate = data[i].options[0].winrate
                            if(data[i].options[0].delta != undefined) bestPointDelta = data[i].options[0].delta
                        }else if(data[i].optionsFirstDelta != undefined && data[i].optionsFirstWinrate != undefined){
                            bestPointWinrate = data[i].optionsFirstWinrate
                            bestPointDelta = data[i].optionsFirstDelta
                        }else if(data[i].ofd != undefined && data[i].ofw != undefined){
                            bestPointWinrate = data[i].ofw
                            bestPointDelta = data[i].ofd
                        }
                        bestPointDelta = Number(bestPointDelta)
                        let actualValuePage = 0, actualScorePage = 0
                        actualValuePage = (data[i].actualValue * 100).toFixed(1)
                        actualScorePage = (data[i].actualScore).toFixed(1)
                        let d = {
                            userScore: data[i].userScore,
                            bestPointWinrate: (bestPointWinrate * 100).toFixed(1),
                            // actualPointWinrate: ((1 - data[Number(i) + 1].actualValue) * 100).toFixed(1),
                            actualPointWinrate: actualValuePage,
                            bestPointDelta: Number(bestPointDelta).toFixed(1),
                            // actualPointDelta: (-data[Number(i) + 1].actualScore).toFixed(1),
                            actualPointDelta: actualScorePage,
                            index: i,
                            name: i,
                            value: [i, (winrate * 100).toFixed(1)],
                            // value: [i, 50],
                            // symbolSize: 30,
                            symbolSize: 1.7 * this.GLOBAL.htmlFontSize,
                            // symbol: 'circle',
                            symbol: `image://${badPointcon}`,
                            showAllSymbol: false,
                            itemStyle: {
                                normal: {
                                    // color: color,
                                    // borderColor: borderColor,
                                    // borderWidth: 2,
                                    opacity: 1
                                }
                            },
                            sort: sort,
                            c: c
                        }
                        yData2.push({
                            bestPointWinrate: (bestPointWinrate * 100).toFixed(1),
                            actualPointWinrate: (data[i].actualValue * 100).toFixed(1),
                            bestPointDelta: bestPointDelta.toFixed(1),
                            actualPointDelta: data[i].actualScore.toFixed(1),
                            index: i,
                            name: i,
                            value: [i, (winrate * 100).toFixed(1)],
                            symbolSize: 0,
                            symbol: 'circle',
                            // symbol: `image://${this.GLOBAL.assetsUrl}/img/${data[i].userScore.icon}${ck}.png`,
                            showAllSymbol: false,
                            itemStyle: {
                                normal: {
                                    color: color,
                                    borderColor: borderColor,
                                    borderWidth: 2
                                }
                            },
                            sort: sort,
                        })
                        c == 1 ? b.push(d) : w.push(d)
                    }
                    // yDataShow.push(null)
                    c = -c
                }
                b = this.GLOBAL.sortData(b, (v1, v2) => {
                    return Number(v1.sort) > Number(v2.sort)
                })
                w = this.GLOBAL.sortData(w, (v1, v2) => {
                    return Number(v1.sort) > Number(v2.sort)
                })
                let spliceNum = typeColor == 0 ? this.GLOBAL.reportFilter.badPoint.num : this.GLOBAL.reportFilter.badPoint.num * 2
                b.splice(spliceNum, b.length - spliceNum)
                w.splice(spliceNum, w.length - spliceNum)
                console.log(b)
                console.log(w)
                yData2.splice(this.GLOBAL.reportFilter.badPoint.num * 2, yData2.length - this.GLOBAL.reportFilter.badPoint.num * 2)
                let realData = b.concat(w)
                realData = this.GLOBAL.sortData(realData, (v1, v2) => {
                    return Number(v1.index) < Number(v2.index)
                })
                let realData2 = []
                for(var i in realData){
                    let ck = realData[i].c == 1 ? 'b' : 'w'
                    let badPointconL = `${this.GLOBAL.assetsUrl}/img/bl_${ck}.png`
                    yDataShow = yDataShow.concat(this.badPointEvaluateCheck(realData[i]))
                    xData.push('' + (Number(realData[i].index)))
                }
                return {seriesData: realData, xData: xData, xDataShow: xDataShow, yDataShow: yDataShow, yData2: yData2}
            },
            badPointEvaluateCheck(data){
                // let evaluate = data.sort
                let userScore = data.userScore
                let size = 0.7 * this.GLOBAL.htmlFontSize
                let evaluate = data.bestPointWinrate - data.actualPointWinrate
                let d = [], value = Math.ceil(evaluate / 10)
                let dis = 13
                value = value > this.GLOBAL.badPointMaxLabelNum ? this.GLOBAL.badPointMaxLabelNum : value
                for(var i = 0; i< value; i++){
                    let dist =  i * dis
                    // if(Number(i) > 1) {
                    //     dist = dist - 20 * (i - 1)
                    // }
                    // if(Number(i) == value) {
                    //     dist = dist - 20 * (i - 1)
                    // }
                    let rd = this.GLOBAL.deepCopy(data)
                    let ck = rd.c == 1 ? 'b' : 'w'
                    let badPointconL = `${this.GLOBAL.assetsUrl}/img/bl_${ck}.png`
                    let y = Number(rd.value[1])
                    rd.symbol = `image://${badPointconL}`
                    // rd.symbolSize = [20, 20 * 0.23]
                    rd.symbolSize = size
                    // rd.value = [rd.value[0], Number(rd.value[1]) + dist]
                    rd.value = [rd.value[0], rd.value[1] - dist]
                    d.push(rd)
                }
                data.value = [data.value[0], data.value[1] - dis * (value + 1.7)]
                d.unshift(data)
                return d
            },
            winrateChatUpdate(){
                let data = this.parseData()
                if(!data.xData.length || !data.winrate.length){
                    // let dx = this.getXdataNone()
                    // let option = this.GLOBAL.deepCopy(this.option)
                    // option.xAxis.data = dx
                    // this.setOptions(option)
                    return
                }
                let option = this.GLOBAL.deepCopy(this.option)
                option.yAxis = this.GLOBAL.deepCopy(this.yAxis)
                option.tooltip.formatter = `{b}${window.i18n.t('手')} {c0}% {c1}${window.i18n.t('目')}`
                option.xAxis.data = data.xData
                // option.xAxis.min = 0
                // option.xAxis.max = data.xData.length - 1
                // option.xAxis.interval = 10
                option.xAxis.axisLabel.interval = this.culXaisLabel(data.xData.length)
                
                option.series = []
                let seriesTemplate = this.GLOBAL.deepCopy(option.seriesTemplate)
                option.series.push(seriesTemplate)
                option.yAxis[0].axisLabel.formatter = val => {
                    if(val == 0) return val
                    if(val == 50) return val
                    if(val == 100) return val
                    return ''
                }
                option.yAxis[0].show = this.winrateItem[0].show
                option.series[0].data = this.winrateItem[0].show ? data.winrate : []
                option.series[0].yAxisIndex = 0
                option.series[0].name = '胜率'
                option.series[0].lineStyle = {
                    color: this.chatColor[0]
                }
                option.series[0].markLine = {
                    symbol: 'none',
                    lineStyle: {
                        color: '#FFFFFF',
                        width: 2,
                        type: 'solid'
                    },
                    data: [
                        [
                            {
                                coord: [this.position, 0]
                            },
                            {
                                coord: [this.position, 100]
                            },
                        ],
                    ]
                }
                seriesTemplate = this.GLOBAL.deepCopy(this.option.seriesTemplate)
                option.series.push(seriesTemplate)
                option.series[1].name = '子差'
                // option.series[1].data = data.delta
                option.series[1].yAxisIndex = 1
                option.yAxis[1].max = data.deltaMax
                option.yAxis[1].min = -data.deltaMax
                option.yAxis[1].interval = data.deltaMax
                this.winrateDeltaMaxTem = data.deltaMax
                option.yAxis[1].axisLabel.formatter = val => {
                    if(val == 0) return val
                    if(val == data.deltaMax) return val
                    if(val == -data.deltaMax) return val
                    return ''
                }
                option.yAxis[1].show = this.winrateItem[1].show
                option.series[1].data = this.winrateItem[1].show ? data.delta : []
                option.series[1].lineStyle = {
                    color: this.chatColor[1]
                }
                this.setOptions(option)
            },
            parseData(data){
                data = data || this.chatData
                let xData = [], seriesData = [], delta = [], c = 1, winrate, d, max = 0
                for(var i in data){
                    // if(i < this.minNumCul) continue
                    if(i >= this.minNumCul){
                        xData.push(`${i}`)
                        if(!data[i]){
                            delta.push(null)
                            seriesData.push(null)
                        }else{
                            data[i].value = Number(data[i].value)
                            data[i].score = Number(data[i].score)
                            winrate = c == 1 ? data[i].value : 1 - data[i].value
                            d = c == 1 ? data[i].score : -data[i].score
                            if(Math.abs(d) > max) max = this.culDeltaMax(Math.ceil((Math.abs(d)))) 
                            delta.push({
                                name: '子差',
                                value: d.toFixed(1),
                                axisPointer: {},
                                symbolSize: 0,
                                symbol: 'circle',
                                showAllSymbol: false,
                                itemStyle: {
                                    normal: {
                                        color: '#fff'
                                    }
                                }
                            })
                            seriesData.push({
                                index: i,
                                name: i,
                                value: (winrate * 100).toFixed(1),
                                axisPointer: {},
                                symbolSize: 0,
                                symbol: 'circle',
                                showAllSymbol: false,
                                itemStyle: {
                                    normal: {
                                        color: '#fff'
                                    }
                                }
                            })
                        }
                    }
                    
                    
                    c = -c
                }
                return {xData: xData, winrate: seriesData, delta: delta, deltaMax: max}
            },
            levelChatUpdate(opt){
                let data = this.parseDataLevel(null, opt)
                if(!data.xData.length) return
                let option = this.GLOBAL.deepCopy(this.option)
                let barWidth = this.GLOBAL.htmlFontSize * 1.1
                
                option.grid.top = '20%'
                option.yAxis = this.GLOBAL.deepCopy(this.yAxis[0])
                option.yAxis.show = false
                option.yAxis.min = 0
                option.yAxis.max = data.max
                option.xAxis.data = data.xData
                option.xAxis.boundaryGap = true
                // option.xAxis.boundaryGap = ['20%', '20%']
                option.xAxis.axisPointer.show = false
                if(this.lang == 'ko'){
                    // option.xAxis.axisLabel.formatter = (val) => {
                    //     return val.split(' ').join('\n')
                    // }
                }
                
                // option.xAxis.axisLabel.fontSize = (1.2 * this.GLOBAL.htmlFontSize).toFixed(0) + 'px'
                option.xAxis.axisLabel.fontSize = (0.6 * this.GLOBAL.htmlFontSize)
                // option.xAxis.axisLabel.width = (2 * this.GLOBAL.htmlFontSize)
                option.xAxis.axisLabel.interval = 0
                option.xAxis.axisLabel.width = 50
                // option.xAxis.axisLabel.interval = this.culXaisLabel(data.xData.length)
                // option.grid.left = 0
                option.tooltip.show = false
                option.axisPointer.label = {
                    show: false
                }
                option.series = []
                let seriesTemplate = this.GLOBAL.deepCopy(option.seriesTemplate)
                seriesTemplate.type = 'bar'
                option.series.push(seriesTemplate)
                seriesTemplate = this.GLOBAL.deepCopy(option.seriesTemplate)
                seriesTemplate.type = 'bar'
                option.series.push(seriesTemplate)
                let valForGet = val => {
                    let data = val.data
                    let rate = (Number(data.rate) * 100).toFixed(0)
                    // let rateTxt = rate <= 0 ? '' : rate + '%'
                    return `{a|${rate}%}\n${data.value}${this.$i18n.t('手')}`
                }
                option.series[0].data = data.yDataB
                option.series[0].barGap = 0
                option.series[0].label = {
                    formatter: valForGet,
                    show: true,
                    color: '#000',
                    fontSize: (0.6 * this.GLOBAL.htmlFontSize),
                    rich: {
                        a: {
                            lineHeight : (0.8 * this.GLOBAL.htmlFontSize),
                            fontSize: (0.6 * this.GLOBAL.htmlFontSize),
                        }
                    }
                }
                option.series[0].itemStyle = {
                    color: '#000'
                }
                option.axisPointer.show = false
                option.series[0].cursor = 'auto'
                option.series[1].cursor = 'auto'
                option.series[1].data = data.yDataW
                option.series[1].barGap = 0
                option.series[1].label = {
                    formatter: valForGet,
                    show: true,
                    color: '#fff',
                    fontSize: (0.6 * this.GLOBAL.htmlFontSize),
                    rich: {
                        a: {
                            lineHeight : (1 * this.GLOBAL.htmlFontSize),
                            fontSize: (0.6 * this.GLOBAL.htmlFontSize),
                        }
                    }
                }
                option.series[1].itemStyle = {
                    color: '#fff'
                }
                
                option.series[0].barWidth = barWidth
                option.series[1].barWidth = barWidth
                this.setOptions(option)
            },
            getMinMax(){
                let data = this.subType.data[this.subType.value]
                let color = this.subTypeColor.value
                let opt = {
                    min: data.min,
                    max: data.max,
                    color: color
                }
                if(Number(opt.max) == -1) opt.max = this.chatData.length - 1
                return opt
            },
            parseDataLevel(data, opt){
                data = data || this.chatData
                opt = opt || {}
                opt = this.getMinMax()
                let DataMax = opt.max || this.step - 1, DataMin = opt.min || 0
                let barWidth = this.GLOBAL.htmlFontSize * 2.2
                // if(this.subType.data[this.subType.value].max != -1) DataMax--
                // let s = langRequireHandle(this.GLOBAL.optionsScore)  
                // let seriesData = [], color, winrate, w = [], b = []
                let xData = [], yData = {}
                let yDataB = [], yDataW = []
                for(var i in this.GLOBAL.scoreList){
                    let tem = {}
                    tem = {
                        value: this.GLOBAL.scoreList[i].score,
                        color: this.GLOBAL.scoreList[i].color,
                        textStyle: {
                            backgroundColor: this.GLOBAL.scoreList[i].color,
                            color: '#fff',
                            padding: [5, 0, 3, 0],
                            width: barWidth,
                            rich: {
                                a: {
                                    display: 'inline-block'
                                }
                            }
                            // width: 10,
                            // width: '100%'
                            // verticalAlign : 'middle'
                        },
                        // axisLabel: {
                        //     width: '16.6%'
                        // }
                    }
                    xData.push(langRequireHandle(tem))
                    // yData.b[i] = 0
                    // yData.w[i] = 0
                    yData[i] = {b: 0, w: 0, arrayKey: this.GLOBAL.scoreList[i].arrayKey}
                    yDataB.push({})
                    yDataW.push({})
                }
                let c = 1, amount = 0, amountB = 0, amountW = 0
                for(var i in data){
                    // if(i < this.minNumCul) continue
                    if(i >= this.minNumCul){
                        if(data[i] && data[i].userScore && Number(i) >= DataMin && Number(i) <= DataMax){
                            let key = data[i].userScore.key
                            let colorKey = c == 1 ? 'b' : 'w'
                            if(c == 1) amountB++
                            else amountW++
                            // yData[colorKey][key]++
                            yData[key][colorKey]++
                            amount++
                        }
                    }
                    c = -c
                }
                let max = 0, rate
                for(var i in yData){
                    let index = Number(yData[i].arrayKey)
                    if(yData[i].b > max) max = yData[i].b
                    if(yData[i].w > max) max = yData[i].w
                    rate = 0
                    // if(yData[i].b > 0 && amount > 0) rate = (yData[i].b / amount).toFixed(2)
                    if(yData[i].b > 0 && amountB > 0) rate = (yData[i].b / amountB).toFixed(2)
                    yDataB[index] = {
                        value: yData[i].b,
                        label: {
                            position: 'top'
                        },
                        rate: rate
                    }
                    rate = 0
                    // if(yData[i].w > 0 && amount > 0) rate = (yData[i].w / amount).toFixed(2)
                    if(yData[i].w > 0 && amountW > 0) rate = (yData[i].w / amountW).toFixed(2)
                    yDataW[index] ={
                        value: yData[i].w,
                        label: {
                            position: 'top' 
                        },
                        rate: rate
                    }
                }
                return {xData: xData, yDataB: yDataB, yDataW: yDataW, max: max, amount: amount}
            },
            
            sortData(data, key, type){
                type = type || 0
                let qsort = fn => ([x,...xn]) => x == null ? []
                : [
                    ...qsort(fn)(xn.filter(a=>fn(a,x))),
                    x,
                    ...qsort(fn)(xn.filter(a=>!fn(a,x)))
                ]
                return qsort((a, b) => {
                    let vala = key == undefined ? a : a[key]
                    let valb = key == undefined ? b : b[key]
                    return type == 0 ? (Number(vala) < Number(valb)) : (Number(vala) > Number(valb))
                })(data)
            },

            
            pageSizeChange(){
                if(!this.echarts) return
                this.optionsReset()
                this.echarts.resize()
            },
            charMouseMove(params){
                let pointInPixel = [params.offsetX, params.offsetY]
                if(this.echarts.containPixel('grid', pointInPixel) && this.lineType.value != 2) this.chatClass = 'pointer'
                else this.chatClass = null
            },
            chatClick(params){
                if(this.changePosDisabled) return
                let pointInPixel = [params.offsetX, params.offsetY]
                let pointInGrid = this.echarts.convertFromPixel({ seriesIndex: 0 }, pointInPixel)
                let xIndex = pointInGrid[0]
                let op = this.echarts.getOption()
                let xData = op.series[0].data[xIndex]
                if(this.clickCallback){
                    this[this.clickCallback](xData)
                    return
                }
                let p
                if(xData) p = xData.index
                else p = xIndex
                this.$emit('takeFun', {
                    fun: 'changePos',
                    data: p
                })
            },
            badPointClickCallback(){
                if(this.changePosDisabled) return
                if(!this.tooltipPoint) return
                let p = this.tooltipPoint[0].data.index
                this.$emit('takeFun', {
                    fun: 'changePos',
                    data: p
                })
            },
            positionChange(){
                this.optionsReset()
            },
            typeChangeOutSide(val){
                this.echarts.resize()
                let data = this.lineType.data
                if(data[val]) this.typeChange(data[val])
            },
            needLoginCheck(opt){
                if(this.username) return true
                opt = opt || {}
                let message = this.GLOBAL.errorMsg.needLoginNotice.useProps
                if(opt.fun == 'startEngine') message = this.GLOBAL.errorMsg.needLoginNotice.startEngine
                if(this.GLOBAL.errorMsg.needLoginNotice[opt.fun]) message = this.GLOBAL.errorMsg.needLoginNotice[opt.fun]
                this.GLOBAL.needLogin(null, {message: message})
                return false
            },
            commentOn(){
                if(!this.needLoginCheck({fun: 'comment'})) return
                this.$emit('takeFun', {
                    fun: 'commentOn'
                })
            },
            commentOff(){
                this.$emit('takeFun', {
                    fun: 'commentOff'
                })
            },
            commentOnByOutside(){
                // this.typeChange()
                let list = this.lineTypeCul, val = null
                for(var i in list){
                    if(list[i].label == 'comment') val = list[i]
                }
                if(!val) return
                this.typeChange(val)
            },
            typeChange(v){
                // this.tooltipPoint = null
                // this.lineType.value = v.value
                // if(v.fun && this[v.fun]) return this[v.fun]()
                // this.commentOff()
                // this.chatClear()
                // if(v.subType){
                //     this.subTypeChange(this.subType.data[this.subType.value])
                // }else{
                //     this.optionsReset()
                // }
                // setTimeout(() => {
                //     this.echarts.resize()
                // }, 0)
                // if(v.clickCallback){
                //     this.clickCallback = v.clickCallback
                // }else{
                //     this.clickCallback = null
                // }
                if(this.changePosDisabled) return
                this.typeChangeAction(v)
                this.menuTypeChange()
            },
            typeChangeAction(v){
                this.tooltipPoint = null
                this.lineType.value = v.value
                if(v.fun && this[v.fun]) return this[v.fun]()
                this.commentOff()
                this.chatClear()
                if(v.subType){
                    this.subTypeChangeAction(this.subType.data[this.subType.value])
                }else{
                    this.optionsReset()
                }
                setTimeout(() => {
                    this.echarts.resize()
                }, 0)
                if(v.clickCallback){
                    this.clickCallback = v.clickCallback
                }else{
                    this.clickCallback = null
                }
            },
            getSubTypeOpt(){
                let type = this.subType.data[this.subType.value]
                let color = this.subTypeColor.value
                let opt = {
                    max: type.max,
                    min: type.min,
                    color: color
                }
            },
            subTypeChange(v){
                if(this.changePosDisabled) return
                this.subTypeChangeAction(v)
                this.menuTypeChange()
            },
            subTypeChangeAction(v){
                this.subType.value = v.value
                this.chatClear()
                let min = v.min, max = v.max
                if(max == -1 && this.chatData) max = this.chatData.length - 1
                this.optionsReset({max, min})
            },
            subTypeColorChange(v){
                if(this.changePosDisabled) return
                this.subTypeColorChangeAction(v)
                this.menuTypeChange()
            },
            subTypeColorChangeAction(v){
                this.subTypeColor.value = v.value
                this.chatClear()
                this.optionsReset()
            },
            chatClear(){
                if(this.echarts != null) this.echarts.clear()
            },
            clearpageinfo(){
                this.subType.value = 0
                this.chatClear()
            },
            getTooltipNotice(index){
                let data = [
                    '{b0}手 {c0} {c1}',
                    ''
                ]
                return data[index]
            },
            culDeltaMax(data){
                let unit = data % 10
                if(unit == 0) return data
                return data + (10 - unit)
            },
            culXaisLabel(length){
                let splitV = ((length - 1) / 10).toFixed(0)
                if(splitV >= 10){
                    let splitV1 = splitV % 10
                    let splitV2 = parseInt(splitV / 10) * 10
                    splitV1 = (splitV1 / 10).toFixed(0) * 10
                    splitV = splitV1 + splitV2
                }
                
                return val => {
                    if(Number(val) == 0) return '' + val
                    if(Number(val) == length - 1) return val
                    if(val % splitV != 0) return false
                    if(length - val < splitV) return false
                    return val
                }
            },
            startCreateLineChat(){
                this.chatData = null
                this.typeChange(this.lineType.data[0])
                this.chatClear()
            },
            winrateLineShowCon(val){
                if(this.lineType.value != 0) return
                val.show = !val.show
                this.winrateChatUpdate()
            },
            yAxisInit(){
                // xAxis: {
                //         // name: '手数',
                //         type: 'category',
                //         boundaryGap: false,
                //         data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                //         show: true,
                //         axisLine: {
                //             show: true,
                //             lineStyle: {
                //                 color: '#CCCCCC',
                //                 width: 2,
                //             }
                //         },
                this.option.xAxis.axisLine.lineStyle.color = this.xLineColor
                this.option.xAxis.axisLabel.color = this.xFontColor
                let yAxis = [
                    {
                        name: '',
                        type: 'value',
                        show: true,
                        min: 0,
                        max: 100,
                        interval: 50,
                        scale: true,
                        axisLine: {
                            show: true,
                            lineStyle: {
                                color: this.chatColor[0],
                                width: 2,
                            }
                        },
                        axisTick: {
                            show: false,
                        },
                        axisLabel: {
                            show: true,
                            color: this.chatColor[0],
                            formatter: val => {
                                if(val == 50) return 50
                                return ''
                            }
                        },
                        splitLine: {
                            show: true,
                            lineStyle: {
                                color: [this.GLOBAL.themeConfig[this.theme].panelBackground, this.splitLineColor, this.GLOBAL.themeConfig[this.theme].panelBackground],
                                width: 2
                            }
                        },
                        lineStyle: {
                            color: this.chatColor[0]
                        }
                    },
                    {
                        name: '',
                        type: 'value',
                        show: true,
                        min: 'dataMin',
                        max: 'dataMax',
                        interval: 50,
                        scale: true,
                        axisLine: {
                            show: true,
                            lineStyle: {
                                color: this.chatColor[1],
                                width: 2,
                            }
                        },
                        axisTick: {
                            show: false,
                        },
                        axisLabel: {
                            show: true,
                            color: this.chatColor[1],
                            formatter: val => {
                                if(val == 0) return 0
                                return ''
                            }
                        },
                        splitLine: {
                            show: true,
                            lineStyle: {
                                color: [this.GLOBAL.themeConfig[this.theme].panelBackground, this.splitLineColor, this.GLOBAL.themeConfig[this.theme].panelBackground],
                                width: 2
                            }
                        },
                        lineStyle: {
                            color: this.chatColor[1]
                        }
                    },
                ]
                this.yAxis = yAxis
            },
            getXdataNone(step){
                step = step || this.step
                let xData = []
                for(var i = 0; i < step; i++){
                    xData.push(`${i}`)
                }
                return xData
            },
            languageLangChange(){
            },
            menuTypeInit(data){
                data = data || {}
                this.subType.value = data.subType || 0
                this.subTypeColor.value = data.subTypeColor || 0
                if(this.lineType.data[data.lineType]) this.typeChangeAction(this.lineType.data[data.lineType])
                
            },
            menuTypeChange(){
                this.$emit('takeFun', {
                    fun: 'lineChatTypeChange',
                })
            }
        },
        created() {
            this.yAxisInit()
            this.pageInit()
            this.GLOBAL.onresizeFunction.lineChat = this.pageSizeChange
            let winrateItem = []
        },
        components: {
        },
        computed: {
            lineTypeSelected(){
                let list = this.lineTypeCul
                let val = this.lineType.value
                let rd = null
                for(let i in list){
                    if(list[i].value == val){
                        rd = list[i]
                        break
                    }
                }
                return rd
            },
            minNumCul(){
                return this.minNum || 0
            },
            changePosDisabled(){
                if(this.limitFun) return !this.isAdmin 
                return false
            },
            lineTypeCul(){
                let list = this.GLOBAL.deepCopy(this.lineType.data)
                if(!this.lineTypeDisplay || !this.GLOBAL.isArray(this.lineTypeDisplay)) return list
                let rd = []
                for(var i in list){
                    if(this.extendTypeName && list[i].extendType) list[i].name = this.extendTypeName
                    if(this.lineTypeDisplay[i]) rd.push(list[i])
                }
                return rd
            },
            createReportTime(){
                let data = this.GLOBAL.reportPlan.time
                if(!this.reportPlan || this.reportPlan.id == undefined || !data[this.reportPlan.name]) return null
                return data[this.reportPlan.name]
            },
            culDataLoadRange(){
                if(this.reportFinished == null) return 0
                let n = (this.reportFinished / this.step * 100).toFixed(0)
                return n
            },
            hideChat(){
                let data = this.list
                if(!data) return true
                return Object.keys(data).length <= 0
            },
            chatTypeData(){
                return {
                    lineType: this.lineType.value,
                    subType: this.subType.value,
                    subTypeColor: this.subTypeColor.value,
                }
            },
        },
        watch: {
            // $i18n: {
            //     handler(newVal){
            //     },
            //     deep: true,
            //     immediate: true
            // },
            chatTypeData: {
                handler(val){
                },
                deep: true
            },
            lang: {
                handler(newVal){
                    this.dataUpdate(this.list)
                },
                deep: true,
            },
            list: {
                handler(newVal){
                    this.dataUpdate(newVal)
                },
                deep: true,
                // immediate: true
            },
            position(){
                this.positionChange()
            },
            languageLang: {
                handler(val){
                    this.lang = 'zh'
                    try{
                        this.lang = val.i18n.locale
                    }catch(e){}
                },
                deep: true,
                immediate: true
            },
            theme: {
                handler(val){
                    this.chatColor = window.__CHATCOLORCONFIG[`__${val}ChatColor`] || __CHATCOLORCONFIG.__darkChatColor
                    this.splitLineColor = window.__CHATCOLORCONFIG[`__${val}SplitLineColor`] ||  __CHATCOLORCONFIG.__datkSplitLineColor
                    this.xLineColor = window.__CHATCOLORCONFIG[`__${val}XLineColor`] || __CHATCOLORCONFIG.__darkXLineColor
                    this.xFontColor = window.__CHATCOLORCONFIG[`__${val}XFontColor`] || __CHATCOLORCONFIG.__darkXFontColor
                //     xLineColor: __CHATCOLORCONFIG.__darkXLineColor,
                // xFontColor: __CHATCOLORCONFIG.__darkXFontColor,
                    let winrateItem = this.winrateItem
                    for(var i in this.chatColor){
                        if(winrateItem[i]) winrateItem[i].color = this.chatColor[i]
                    }
                    this.winrateItem = winrateItem
                    this.yAxisInit()
                    this.optionsReset()
                },
                immediate: true,
                deep: true
            },
            winrateItem: {
                handler(){
                    
                },
                immediate: true,
                deep: true
            },
            $route: {
                handler(){
                    this.pathNow = this.$route.path
                },
                deep: true,
                immediate: true
            }
        },
        mounted() {
        },
        beforeCreate() {}, //生命周期 - 创建之前
        beforeMount() {}, //生命周期 - 挂载之前
        beforeUpdate() {}, //生命周期 - 更新之前
        updated() {}, //生命周期 - 更新之后
        beforeDestroy() {
            this.GLOBAL.onresizeFunction.lineChat = null
        }, //生命周期 - 销毁之前
        destroyed() {}, //生命周期 - 销毁完成
        activated() {}, //如果页面有keep-alive缓存功能，这个函数会触发
    }
</script>
<style lang='less' >
    @selectedBcg: #416692;
    .line-chat{
        @comW: 26rem;
        @comH: 13rem;
        @typeH: 1.5rem;
        @typePadding: 0.1rem;
        @subTypeW: 3rem;
        @lineLabelH: 1rem;
        @lineLabelBoxPadding: 0.2rem;
        width: 100%;
        height: @comH;
        position: relative;
        overflow: hidden;
        .line-chat-body.pointer{
            canvas{
                cursor: pointer;
            }
        }
        .line-chat-body{
            width: 100%;
            height: calc(@comH - @typeH - @typePadding - @lineLabelH - (@lineLabelBoxPadding * 2));
            div:first-child{
                transition: all 0 ease 0 !important;
                width: 100% !important;
                canvas{
                    width: 100% !important;
                }
            }
        }
        .line-chat-fun{
            // display: flex;
            .data-loading{
                @data-loading-range-box-h: 1.3rem;
                padding-right: 0.5rem;
                white-space: nowrap;
                display: flex;
                align-items: flex-end;
                .data-loading-body{
                    display: flex;
                    // background: @selectedBcg;
                    padding: 0.1rem 0.5rem;
                    color: #fff;
                    .data-loading-range-box{
                        background: #353434;
                        height: @data-loading-range-box-h;
                        width: 11rem;
                        position: relative;
                        text-align: center;
                        line-height: @data-loading-range-box-h;
                        .data-loading-range-value{
                            padding: 0.1rem;
                            position: absolute;
                            top: 0px;
                            left: 0px;
                            width: 100%;
                            height: 100%;
                            z-index: 1;
                            .range-value-s{
                                background: #446493;
                                width: 30%;
                                height: 100%;
                            }
                        }
                        .data-loading-txt{
                            position: absolute;
                            width: 100%;
                            height: 100%;
                            text-align: center;
                            line-height: @data-loading-range-box-h;
                            z-index: 2;
                        }
                    }
                }
                .txt.lb{
                    margin-left: 0.3rem;
                }
                .txt{
                    font-size: 0.6rem
                }
                .loading-label{
                    display: flex;
                    align-items: center;
                    margin-left: 0.3rem;
                    .loading-label-item:first-child{
                        margin: 0px;
                    }
                    .loading-label-item.a{
                        animation: loadinga 1.5s infinite;
                    }
                    .loading-label-item.b{
                        animation: loadingb 1.5s infinite;
                    }
                    .loading-label-item.c{
                        animation: loadingc 1.5s infinite;
                    }
                    .loading-label-item.d{
                        animation: loadingd 1.5s infinite;
                    }
                    .loading-label-item.e{
                        animation: loadinge 1.5s infinite;
                    }
                    .loading-label-item{
                        width: 0.15rem;
                        height: 0.15rem;
                        background: #fff;
                        border-radius: 50%;
                        margin-left: 0.1rem;
                        opacity: 0;
                    }
                }
            }
        }
        .type-box{
            padding: 0.1rem;
            width: 100%;
            height: @typeH;
            display: flex;
            justify-content: flex-start;
            .type-item:last-child{
                margin: 0px;
            }
            .type-item.select{
                // background: @selectedBcg;
                // border: 1px solid #fff;
                color: #fff;
            }
            .type-item{
                cursor: pointer;
                box-sizing: border-box;
                width: 4rem;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: inherit;
                // background: #8898A1;
                margin-right: @typePadding;
                .txt{
                    font-size: 0.65rem;
                }
            }
        }
        .line-chat-box{
            display: flex;
            .sub-type-box{
                height: calc(@comH - @typeH - @typePadding - 1.4rem);
                width: @subTypeW;
                // padding-top: 1rem;
                .type-level-box:last-child{
                    margin-top: 1rem;
                }
                .type-level-box{
                    width: 2rem;
                    margin: 0px auto;
                    .type-level-item.select{
                        background: @selectedBcg;
                        border: 1px solid #fff;
                        color: #fff;
                    }
                    .type-level-item:last-child{
                        margin-bottom: 0px;
                    }
                    .type-level-item{
                        margin-bottom: 0.2rem;
                        cursor: pointer;
                        box-sizing: border-box;
                        width: 100%;
                        height: 1rem;
                        line-height: 1rem;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 0.6rem;
                    }
                }
            }
            
            .line-chat-body.level-type{
                width: calc(@comW - @subTypeW);
            }
            
        }
        .line-chat-f-opt{
            display: flex;
            width: 100%;
        }
        .line-chat-s-opt{
            padding: @lineLabelBoxPadding;
            .chat-label{
                display: flex;
                white-space: nowrap;
                height: @lineLabelH;
                .chat-label-item:first-child{
                    margin-right: 0.5rem;
                }
                .chat-label-item.line-hide{
                    opacity: 0.5;
                }
                .chat-label-item{
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    .label-item-icon{
                        width: 1.3rem;
                        height: 0.2rem;
                        // border: 0.2rem solid;
                        // border-radius: 50%;
                        margin-right: 0.2rem;
                    }
                }
            }
        }
        
        @-webkit-keyframes loading{
            0% {
                -ms-transform: rotateX(-33.5deg) rotateY(45deg);
                -webkit-transform: rotateX(-33.5deg) rotateY(45deg);
                transform: rotateX(-33.5deg) rotateY(45deg);
                }
            100%{
                -ms-transform: rotateX(-33.5deg) rotateY(405deg); 
                -webkit-transform: rotateX(-33.5deg) rotateY(405deg);
                transform: rotateX(-33.5deg) rotateY(405deg);
                }
        }		
        @keyframes loadinga{
            0% {
                opacity: 0;
            }
            20% {
                opacity: 1;
            }
            40% {
                opacity: 1;
            }
            60% {
                opacity: 1;
            }
            80% {
                opacity: 1;
            }
            100% {
                opacity: 1;
            }
        }
        @keyframes loadingb{
            0% {
                opacity: 0;
            }
            20% {
                opacity: 0;
            }
            40% {
                opacity: 1;
            }
            60% {
                opacity: 1;
            }
            80% {
                opacity: 1;
            }
            100% {
                opacity: 1;
            }
        }
        @keyframes loadingc{
            0% {
                opacity: 0;
            }
            20% {
                opacity: 0;
            }
            40% {
                opacity: 0;
            }
            60% {
                opacity: 1;
            }
            80% {
                opacity: 1;
            }
            100% {
                opacity: 1;
            }
        }
        @keyframes loadingd{
            0% {
                opacity: 0;
            }
            20% {
                opacity: 0;
            }
            40% {
                opacity: 0;
            }
            60% {
                opacity: 0;
            }
            80% {
                opacity: 1;
            }
            100% {
                opacity: 1;
            }
        }
        @keyframes loadinge{
            0% {
                opacity: 0;
            }
            20% {
                opacity: 0;
            }
            40% {
                opacity: 0;
            }
            60% {
                opacity: 0;
            }
            80% {
                opacity: 0;
            }
            100% {
                opacity: 1;
            }
        }
    }
</style>