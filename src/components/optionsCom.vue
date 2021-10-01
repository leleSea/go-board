<!--  -->
<template>
    <div class='options-com page-panel-bcg' :class="{'m': !reviewBoard, 'b': reviewBoard}">
        <div class="optiins-table">
            <ul class="table-head">
                <li class="head-item t1">
                    <!-- <span class="txt">{{ $t('推荐选点') }}</span> -->
                    <span class="txt" v-if="showMoves || !isLastPosition">{{ $t('推荐选点') }}</span>
                    <span class="txt head-item-txt" v-show="!optionsIsNull" v-if="!showMoves && isLastPosition">
                        <span class="txt s1">{{ `${$t('计算量Ana')}` }}</span>
                        <simulations ref="simulations" 
                        :number.sync="optionsNumber" 
                        :position.sync="position" 
                        :isLastPosition.sync="isLastPosition"
                        :needLastPos="true"
                        :optIntervalTimeDefined.sync="optIntervalTimeDefined"></simulations>
                    </span>
                </li>
                <li class="head-item t2">
                    <span class="txt">{{ $t('推荐度') }}</span>
                </li>
                <li class="head-item t3">
                    <span v-if="optionsStyle.value == 0">
                        <span class="txt" v-if="locale != 'en'">{{$t(culColor)}}{{ $t('领先(目)') }}</span>
                        <span class="txt" v-else>{{$t('领先(目)')}}({{$t(culColor == '黑' ? 'B' : 'W')}})</span>
                    </span>
                    <span class="txt" v-if="optionsStyle.value != 0">{{ $t('领先(目)') }}</span>
                </li>
                <li class="head-item t4">
                    <span class="txt" v-if="optionsStyle.value == 0">
                        <span class="txt" v-if="locale != 'en'">{{$t(culColor)}}{{ $t('胜率(%)') }}</span>
                        <span class="txt" v-else>{{$t('胜率(%)')}}({{$t(culColor == '黑' ? 'B' : 'W')}})</span>
                    </span>
                    <span class="txt" v-if="optionsStyle.value != 0">{{ $t('胜率(%)') }}</span>
                </li>
            </ul>
            <div class="table-content"
            v-loading="requestDataing" 
            element-loading-background="rgba(0, 0, 0, 0.0)"
            element-loading-spinner="page-loading-icon-css dark"
            >
                <!-- @mouseenter="branchHover(v)" 
                @mouseleave="branchBlur(v)"  -->
                <!-- <ul class="table-content-tr" v-for="(v, i) in options.options" :key="i" @click="branchConClick(v)" -->
                <ul class="table-content-tr" v-for="(v, i) in optionsList" :key="i" @click="branchConClick(v)"
                v-show="!loadingMsgCul.active"
                v-if="!v.hide"
                @mouseenter="branchHoverClick(v)" 
                @mouseleave="branchBlurClick(v)" 
                :style="select && select.coord == v.coord && options.actualCoord == v.coord? `background: ${userScoreCul.color}` : ''"
                :class="{'select': select && select.coord == v.coord}">
                    <li class="table-content-td t1">
                        <!-- <span class="comment-icon el-icon-chat-line-square"></span> -->
                        <!-- <img class="stone" :src="`${GLOBAL.assetsUrl}/img/st${options.color == 1 ? 'b' : 'w'}1.png`"> -->
                        <div class="stone stone-label-ldp" :class="{'white': options.color == -1, 'black': options.color == 1}"></div>
                        <span class="coor">{{v.coord | coordFilter}}</span>
                        <span class="own-score" v-if="v.actual && userScoreCul.score" :style="`background: ${userScoreCul.color};`">
                            <span class="score-i"></span>
                            <span class="score-i sc">{{$t(userScoreCul.score)}}</span>
                        </span>
                    </li>
                    <li class="table-content-td t2">
                        <div class="prop">
                            <div class="table-item-prop-range theme-border-options" v-if="optionsStyle.value == 0">
                                <div class="prop-range-body" :style="propStyle(v)" ></div>
                            </div>
                            <div class="txt">{{v.proportion | winrate2}}%</div>
                        </div>
                    </li>
                    <li class="table-content-td t3">
                        <!-- {{v.delta | tofixed1}} -->
                        <span class="txt" v-if="optionsStyle.value == 0">{{v.delta | tofixed1}}</span>
                        <div class="delta-box options-delta-box" v-if="optionsStyle.value != 0" :class="optionsStyle.data[optionsStyle.value].name">
                            <span class="txt val" :style="optionsStyle.value == 1 ? GLOBAL.deltaWidth(v.delta) : ''" :class="GLOBAL.deltaClass(v.delta, options.color)">
                                {{v.delta | abs | tofixed1}}
                            </span>
                        </div>
                    </li>
                    <li class="table-content-td t4">
                        <!-- {{v.winrate | winrate}} -->
                        <span class="txt" v-if="optionsStyle.value == 0">{{v.winrate | winrate}}</span>
                        <div class="winrate-options" v-if="optionsStyle.value != 0">
                            <div class="box" v-if="optionsStyle.value == 1">
                                <div class="new-win-it">
                                    <span class="txt">{{options.color == 1 ? v.winrate : (1 - v.winrate) | winrate}}</span>
                                </div>
                                <div class="new-win-it r">
                                    <div class="r-b" :style="{width: `${(options.color == 1 ? v.winrate : (1 - v.winrate)) * 100}%`}"></div>
                                    <div class="r-w" :style="{width: `${(options.color == -1 ? v.winrate : (1 - v.winrate)) * 100}%`}"></div>
                                </div>
                                <div class="new-win-it">
                                    <span class="txt">{{options.color == -1 ? v.winrate : (1 - v.winrate) | winrate}}</span>
                                </div>
                            </div>
                            <div class="box fix" :class="optionsStyle.data[optionsStyle.value].name" v-if="optionsStyle.value == 2 || optionsStyle.value == 3">
                                <div class="new-win-it r">
                                    <div class="r-b" :class="{'opt-weaken': options.color == -1}">
                                        <span class="txt b">{{options.color == 1 ? v.winrate : (1 - v.winrate) | winrate}}</span>
                                    </div>
                                    <div class="r-w" :class="{'opt-weaken': options.color == 1}">
                                        <span class="txt w">{{options.color == -1 ? v.winrate : (1 - v.winrate) | winrate}}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
                <ul class="table-content-tr own" v-if="!options.actual && options.actualCoord" 
                :class="{'select': select && select.actualCoord == options.actualCoord}"
                @click="branchCon(options)" :style="select && select.actualCoord ? `background: ${userScoreCul.color}` : ''"
                @mouseenter="branchHover(options)" @mouseleave="branchBlur(options)">
                    <li class="table-content-td t1">
                        <!-- <span class="comment-icon el-icon-chat-line-square"></span> -->
                        <!-- <img class="stone" :src="`${GLOBAL.assetsUrl}/img/st${options.color == 1 ? 'b' : 'w'}1.png`"> -->
                        <div class="stone stone-label-ldp" :class="{'white': options.color == -1, 'black': options.color == 1}"></div>
                        <span class="coor">{{options.actualCoord | coordFilter}}</span>
                        <span class="own-score" :style="`background: ${userScoreCul.color};`" v-if="userScoreCul.score">
                            <span class="score-i"></span>
                            <span class="score-i sc">{{userScoreCul.score}}</span>
                        </span>
                    </li>
                    <li class="table-content-td t2">
                        <!-- <div class="prop">
                            <div class="table-item-prop-range theme-border-options">
                                <div class="prop-range-body" style="width: 0px;" ></div>
                            </div>
                            <div class="txt">0%</div>
                        </div> -->

                        <div class="prop">
                            <div class="table-item-prop-range theme-border-options"  v-if="optionsStyle.value == 0">
                                <div class="prop-range-body" style="width: 0px;" ></div>
                            </div>
                            <div class="txt">0%</div>
                        </div>
                    </li>
                    <li class="table-content-td t3">
                        <span class="txt" v-if="optionsStyle.value == 0">{{options.actualScore | tofixed1}}</span>
                        <div class="delta-box options-delta-box" v-if="optionsStyle.value != 0" :class="optionsStyle.data[optionsStyle.value].name">
                            <span class="txt val" :style="optionsStyle.value == 1 ? GLOBAL.deltaWidth(options.actualScore) : ''" :class="GLOBAL.deltaClass(options.actualScore, options.color)">
                                {{options.actualScore | abs | tofixed1}}
                            </span>
                        </div>
                    </li>
                    <li class="table-content-td t4">
                        <span class="txt" v-if="optionsStyle.value == 0">{{options.actualValue | winrate}}</span>
                        <div class="winrate-options" v-if="optionsStyle.value != 0">
                            <div class="box" v-if="optionsStyle.value == 1">
                                <div class="new-win-it">
                                    <span class="txt">{{options.color == 1 ? options.actualValue : (1 - options.actualValue) | winrate}}</span>
                                </div>
                                <div class="new-win-it r">
                                    <div class="r-b" :style="{width: `${(options.color == 1 ? options.actualValue : (1 - options.actualValue)) * 100}%`}"></div>
                                    <div class="r-w" :style="{width: `${(options.color == -1 ? options.actualValue : (1 - options.actualValue)) * 100}%`}"></div>
                                </div>
                                <div class="new-win-it">
                                    <span class="txt">{{options.color == -1 ? options.actualValue : (1 - options.actualValue) | winrate}}</span>
                                </div>
                            </div>
                            <div class="box fix" :class="optionsStyle.data[optionsStyle.value].name" v-if="optionsStyle.value == 2 || optionsStyle.value == 3">
                                <div class="new-win-it r">
                                    <div class="r-b" >
                                        <span class="txt">{{options.color == 1 ? options.actualValue : (1 - options.actualValue) | winrate}}</span>
                                    </div>
                                    <div class="r-w" >
                                        <span class="txt">{{options.color == -1 ? options.actualValue : (1 - options.actualValue) | winrate}}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
                <div class="loading-message-box" v-show="loadingMsgCul.active">
                    <span class="txt options-error-color">{{$t(loadingMsgCul.message)}}</span>
                </div>
            </div>
        </div>
        <!-- <div class="options-comment">
            <h2 class="comment-title">评论：</h2>
            <p class="comment-content">XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX</p>
        </div> -->
        <!-- <div class="options-style-select">
            <el-radio v-model="optionsStyle.value" :label="v.value" v-for="(v, i) in optionsStyle.data" :key="i">
                <span class="txt">样式{{v.name}}</span>
            </el-radio>
        </div> -->
    </div>
</template>

<script>
    import simulations from './simulations.vue'



    export default {
        name: 'optionsCom',
        props: {
            optIntervalTimeDefined: Number,
            options: Object,
            area: Object,
            reviewBoard: Boolean,
            cantLock: Boolean,
            splitBranchStatus: Boolean,
            isActualMove: Boolean,
            pageStatus: Boolean,
            loadingMsg: Object,
            requestDataing: Boolean,
            model: String,
            position: Number,
            step: Number,
            isAdmin: Boolean,
            limitFun: Boolean,
            winrateDataLast: Number
        },
        data() {
            return {
                optionsOld: null,
                optionsStyle: {
                    data: [
                        {name: 'A', value: 0},
                        {name: 'B/C', value: 1},
                        {name: 'D', value: 2},
                        {name: 'E', value: 3},
                    ],
                    value: 3
                },
                locale: 'zh',
                optRoot: {},
                select: null,
                optionsLock: false,
                branchIndex: 0,
                optioneTemplate: null,
                itemStyle: {},
                optSperate: {
                    interval: null,
                    step: this.GLOBAL.optSpeInterval / this.GLOBAL.optIntervalTime,
                    num: 0
                },
                optRootDelta: 0,
            };
        },
        methods: {
            propStyle(val){
                return {
                    width: `${(val.proportion * 100).toFixed(2)}%`
                }
            },
            branchConClick(val){
                
                if(this.isAdminCul){
                    if(!this.optionsLock || this.optionsLock.coord != val.coord){
                        this.$emit('takeFun', {
                            fun: 'optionsClick',
                        })
                    }
                    
                    this.branchCon(val)
                }
                
            },
            branchCon(val){
                if(this.optionsLock && this.optionsLock.coord == val.coord){
                    return this.branchClearLock()
                }
                if(this.pageStatus) return
                this.branchClock(val)
                return this.branchOn(val)
            },
            branchClock(val){
                // if(this.cantLock) return
                this.optionsLock = val
            },
            branchClearLock(){
                this.branchClearLockAction()
                this.branchOff()
            },
            branchClearLockAction(){
                this.optionsLock = null
            },
            branchHoverClick(val){
                if(this.isAdminCul) return this.branchHover(val)
            },
            branchHover(val){
                if(this.optionsLock) return
                if(this.select && this.select.coord == val.coord) return
                return this.branchOn(val)
            },
            branchBlurClick(val){
                if(this.isAdminCul) return this.branchBlur(val)
            },
            branchBlur(){
                if(this.optionsLock) return
                this.branchOff()
            },
            itemStyleCheck(val){
                if(this.options.actualCoord != val.coord && this.options.actualCoord != val.actualCoord) return val.itemStyle = {background: null}
                if(!this.options.userScore) return val.itemStyle = {}
                val.itemStyle = {background: this.options.userScore.color}
            },
            branchOn(val, index, opt){
                this.select = this.GLOBAL.deepCopy(val)
                this.itemStyleCheck(this.select)
                let moves = val.variation
                moves = moves.split(',')
                if(!val.root) moves.unshift(val.coord)
                index = index != undefined ? index : moves.length - 1
                this.branchIndex = index
                let rm = []
                // rm.push(val.coord)
                for(var i in moves){
                    if(i > index) break
                    rm.push(moves[i])
                }
                if(moves) moves = `${val.coord},${moves}`
                else moves = val.coord
                let sendData = rm
                if(opt){
                    sendData = {opt: opt, rm: rm}
                }
                this.$emit('takeFun', {
                    fun: 'branchOn',
                    // data: rm
                    data: sendData
                })
            },
            branchOff(){
                this.itemStyle = {background: null}
                // this.optionsLock = false
                this.select = null
                this.$emit('takeFun', {
                    fun: 'branchOff',
                })
            },
            itemSelectOn(val){
                this.select = val
            },
            itemSelectOff(){
                this.select = null
            },
            clear(){
                this.select = null
                this.branchClearLock()
            },
            isBranchCoor(coord){
                if(this.select && (this.select.coord == coord || this.select.actualCoord == coord)) return true
                let list = []
                try{
                    list = this.select.variation
                    list = list.split(',')
                } catch(e){}
                if(!list || !list.length) return false
                let f = false
                for(var i in list){
                    if(list[i] == coord){
                        f = true
                        break
                    }
                }
                return f
            },
            optionsEnterSelect(move){
                if(this.area.active) return
                let val = null
                for(var i in this.options.options){
                    if(this.options.options[i].coord == move){
                        val = this.GLOBAL.deepCopy(this.options.options[i])
                        break
                    }
                }
                if(!val && this.options.actualCoord == move) val = this.options
                this.branchOn(val)
            },
            optionsEnterSelectCheck(move){
                let opt = this.options || {}
                opt = opt.options || null
                if(!opt || !opt.length) return false
                let val = null
                for(var i in opt){
                    if(opt[i].coord == move){
                        val = this.GLOBAL.deepCopy(opt[i])
                        break
                    }
                }
                if(!val && this.options.actualCoord == move) val = this.options
                if(!val) return
                this.itemSelectOn(val)
                return true
            },
            branchMouseRightToLock(){
                if(this.cantLock) return
                this.optionsLock = this.GLOBAL.deepCopy(this.select)
            },
            branchScroll(e, opt){
                if(!this.select) return
                let deltaY = e.deltaY
                let index = deltaY > 0 ? Number(this.branchIndex) + 1 : Number(this.branchIndex) - 1
                deltaY > 0 ? this.branchScrollDown(opt) : this.branchScrollUp(opt)
                let variation = this.GLOBAL.deepCopy(this.select.variation)
                variation = variation.split(',')
                variation.unshift(this.select.coord)
                this.$emit('takeFun', {
                    fun: 'playActionForMove',
                    data: {
                        index: index,
                        data: variation
                    }
                })
            },
            branchJumpByDb(move){
                let list = []
                try{
                    list = this.select.variation
                    list = list.split(',')
                }catch(e){}
                if(!list || !list.length) return
                let index = null
                for(var i in list){
                    if(list[i] == move){
                        index = i
                        break
                    }
                }
                if(index === null) return
                this.branchOn(this.select, Number(index) + 1)
                // let branch = this.branch, row = null, index = this.branchRowNow.index
                // for(var i = index; i >= 0; i--){
                //     if(branch[i].Move == move){
                //         row = branch[i]
                //         break
                //     }
                // }
                // if(row) this.branchClick(row)
            },
            branchScrollUp(opt){
                this.branchIndex--
                if(this.branchIndex < 0) this.branchIndex = 0
                if(opt && opt.defineFun){
                    this.$emit('takeFun', {
                        fun: 'branchRefresh',
                        data: this.branchIndex
                    })
                }else this.branchOn(this.select, this.branchIndex)
            },
            branchScrollDown(opt){
                this.branchIndex++
                let data = this.select.variation
                data = data.split(',')
                data.unshift(this.select.coord)
                if(this.branchIndex > data.length - 1) this.branchIndex = data.length - 1
                if(opt && opt.defineFun){
                    this.$emit('takeFun', {
                        fun: opt.defineFun,
                        data: this.branchIndex
                    })
                }else this.branchOn(this.select, this.branchIndex)
                
            },
            branchScrollByKeyboard(p){
                let index = this.branchIndex
                
                let data = this.select.variation
                data = data.split(',')
                data.unshift(this.select.coord)
                if(p == 'l') index = data.length - 1
                else if(p == 's') index = 0
                else{
                    index = index + Number(p)
                    if(index < 0) index = 0
                    if(index >= data.length) index = data.length - 1
                }
                this.branchIndex = index
                this.branchOn(this.select, this.branchIndex)
            },
            parseOptions(){
                let data = this.GLOBAL.deepCopy(this.options)
                let rd = this.GLOBAL.deepCopy(this.options), num = 0
                rd.options = []
                if(this.options && this.options.options && this.options.options.length){
                    for(var i in data.options){
                        data.options[i].index = i
                        if(data.options[i].proportion < this.GLOBAL.reportFilter.options.prop) continue
                        if(data.options[i].coord == data.actualCoord){
                            data.options[i].actual = true
                            rd.actual = true
                            rd.actualOptionsIndex = i

                            // break
                        }
                        num++
                        rd.options.push(data.options[i])
                        if(num >= this.GLOBAL.reportFilter.options.num) break
                    }
                    this.optioneTemplate = rd
                }else{
                    this.optioneTemplate = null
                }
                this.parseScore()
                return rd
            },
            parseScore(){
                let options = this.optioneTemplate, score = null
                if(!options) return
                let s = this.GLOBAL.optionsScore
                if(options.actual){
                    if(options.actualOptionsIndex == 0) score =  s.sp1
                    else{
                        let index = options.actualOptionsIndex
                        for(var i in s.inProp){
                            if(options.options[index].proportion > s.inProp[i].value){
                                score = s.inProp[i]
                                break
                            }
                        }
                    }
                }
                if(!score || !options.actual){
                    if(options.value > options.options[0].winrate) score = s.sp2
                    else{
                        for(var j in s.outProp){
                            if(options.options[0].winrate - options.value < s.outProp[j].value){
                                score = s.outProp[j]
                                break
                            }
                        }
                    }
                }
                this.userScore = score
            },
            CulItemStyle(val){
                if(!this.select || (this.options.actualCoord != this.select.coord && this.options.actualCoord != this.select.actualCoord)) return {background: null}
                return {background: this.options.userScore.color}
            },
            lockBranchBykeyboard(index){
                if(!this.options.options[index]) return
                this.branchCon(this.options.options[index])
            },
            lockBranchJumpBykeyboard(index){
                if(!this.optionsLock) return
                index = Number(index)
                if(isNaN(index)) return
                index = Number(this.optionsLock.index) + index
                if(index < 0 || index >= this.options.options.length) return
                this.branchCon(this.options.options[index])
            },
            optionsLockOff(){
                this.branchClearLock()
            },
            update(){
                let opt = {
                    optionsLock: this.optionsLock
                }
                this.$emit('update', opt)
            },
            optionsIntervalOn(){
                if(!this.GLOBAL.optionsTimeoutShow) return
                this.optSperate.interval = setInterval(() => {
                    this.optSperate.num++
                    this.optSperate.step = (this.GLOBAL.optSpeInterval / this.GLOBAL.optIntervalTime)
                    this.optionsRootGet()
                    // if(!this.optionsLock) this.itemNumberGet()
                    if(this.optSperate.step * this.optSperate.num == 1){
                        this.optionsIntervalOff()
                        return
                    }
                }, this.GLOBAL.optSpeInterval)
            },
            optionsIntervalOff(){
                this.optSperate.num = 0
                if(this.optSperate.interval === null) return
                clearInterval(this.optSperate.interval)
            },
            optionsRootGet(){
                let options = this.options || {}
                options
                this.optRoot.Number = Number(this.optRoot.Number) + this.optRootDelta * this.optSperate.step
            },
            itemNumberGet(){
                let options = []
                try{
                    options = this.options.options
                }catch(e){}
                for(var i in options){
                    // options[i].Number = (Number(options[i].Number) + this.optSperate.step * this.optSimuVal[i]).toFixed(0)
                    options[i].number = Number(options[i].number) + this.optSperate.step * this.optSimuVal[i]
                }
                this.options = options
            },
            branchPlayByDb(move){
                if(!this.optionsLock) return
                let moves = this.optionsLock.variation
                moves = `${this.optionsLock.coord},${moves}`
                console.log(moves)
                this.$emit('takeFun', {
                    fun: 'playBranch',
                    data: moves
                })
            },
        },
        created() {

        },
        components: {
            simulations
        },
        computed: {
            userScoreCul(){
                let opt = this.options || {}
                let userScore = opt.userScore || {}
                return userScore
            },
            optionsList(){
                let opt = this.options || {}
                let list = opt.options || []
                for(var i in list){
                    if(list[i] && !isNaN(Number(list[i].winrate))){
                        list[i].winrate = Number(list[i].winrate)
                        list[i].winrate = list[i].winrate.toFixed(3)
                    }
                }
                return list
            },
            isAdminCul(){
                if(!this.limitFun) return true
                return this.isAdmin
            },
            optionsIsNull(){
                return !this.optionsCul || !Object.keys(this.optionsCul).length || !this.optionsCul.root
            },
            optionsCul(){
                return this.options || {}
            },
            optionsNumber(){
                let root = this.optionsCul.root || {}
                let options = this.optionsCul, optionsOld = this.optionsOld || {}, numberOld = 0
                if(optionsOld){
                // if(options.optionsLast){
                    let rootNew = options.root || {}
                    let coor = rootNew.coord, optionsListOld = optionsOld.options || []
                    for(var i in optionsListOld){
                        if(optionsListOld[i].coord == coor){
                            numberOld = optionsListOld[i].number
                            break
                        }
                    }
                }
                return root.number || numberOld
            },
            showMoves(){
                return this.model != 'live'
            },
            isLastPosition(){
                // return this.step == this.position
                return this.winrateDataLast == this.position
            },
            isLastDataPosition(){

            },
            loadingMsgCul(){
                let opt = this.loadingMsg
                if(!this.GLOBAL.isObject(opt)) return {}
                return opt
            },
            culColor(){
                if(!this.options || !this.options.color) return '黑'
                return this.options.color == 1 ? '黑' : '白'
            },
            culOptions(){
                let data = this.GLOBAL.deepCopy(this.options)
                let rd = this.GLOBAL.deepCopy(this.options), num = 0
                rd.options = []
                if(this.options && this.options.options && this.options.options.length){
                    for(var i in data.options){
                        data.options[i].index = i
                        if(data.options[i].proportion < this.GLOBAL.reportFilter.options.prop) continue
                        if(data.options[i].coord == data.actualCoord){
                            data.options[i].actual = true
                            rd.actual = true
                            rd.actualOptionsIndex = i
                        }
                        num++
                        rd.options.push(data.options[i])
                        if(num >= this.GLOBAL.reportFilter.options.num) break
                    }
                }
                return rd
                // return this.parseOptions()
            },
            culUserScore(){
                let options = this.optioneTemplate, score = null
                let s = this.GLOBAL.optionsScore
                if(options.actual){
                    if(options.actualOptionsIndex == 0) score =  s.sp1
                    else{
                        let index = options.actualOptionsIndex
                        for(var i in s.inProp){
                            if(options.options[index].proportion > s.inProp[i].value){
                                score = s.inProp[i].score
                                break
                            }
                        }
                    }
                }
                if(!score || !options.actual){
                    if(options.value > options.options[0].winrate) score = s.sp2
                    else{
                        for(var j in s.outProp){
                            if(options.options[0].winrate - options.value < s.outProp[j].value){
                                score = s.outProp[j].score
                                break
                            }
                        }
                    }
                }
                return score
            }
        },
        watch: {
            optionsStyle: {
                handler(val){
                },
                deep: true,
                immediate: true
            },
            optionsLock: {
                handler(){
                    this.update()
                },
                deep: true,
                immediate: true
            },
            options: {
                handler(newVal, oldVal){
                    if(oldVal && Object.keys(oldVal).length){
                        let root = oldVal.root || {}
                        let rootNew = newVal.root || {}
                        if(root.coord != rootNew.coord) this.optionsOld = oldVal
                    }
                    
                    let o = this.GLOBAL.deepCopy(newVal)
                    let l = this.GLOBAL.deepCopy(oldVal)
                    if(JSON.stringify(o) != JSON.stringify(l)){
                        this.clear()
                        // try{
                        //     this.optRoot = {
                        //         Number: newVal.root.number
                        //     }
                        // }catch(e){
                        //     this.optRoot = {Number: 0}
                        // }
                        // this.optionsIntervalOff()
                        // this.optionsIntervalOn()
                    }

                    // this.parseOptions(newVal)
                },
                deep: true,
                immediate: true
            },
            languageLang: {
                handler(){
                    this.locale = this.$i18n.locale
                },
                immediate: true,
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
<style lang='less' src="../assets/css/options.less"></style>
<style lang='less'>
    .options-com{
        .head-item-txt{
            display: flex;
        }
    }
</style>