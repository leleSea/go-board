<template>
    <div class="options" :tableH.sync="tableH" :class="[modal]">
        <div class="re-det-par hidden">
            <!-- <div class="par-item">
                <div class="txt">块尺寸</div>
                <el-input v-model="knBlockSize"></el-input>
                <span class="txt">rem</span>
            </div>
            <div class="par-item">
                <div class="txt">块总数</div>
                <el-input v-model="unknownNum"></el-input>
            </div> -->
            
            <div class="params-box" v-show="paramsSwitch">
                <div class="par-item" v-for="(v, i) in ldpAnimationData" :key="i">
                    <div class="txt">{{i}}</div>
                    <el-input v-model="ldpAnimationData[i]"></el-input>
                </div>
            </div>
            <div class="params-switch">
                <el-button class="le-button params-switch-btn" 
                type="primary"
                @click="paramsSwitchChange">参数{{paramsSwitch ? '隐藏' : '打开'}}</el-button>
            </div>
        </div>
        <div class="opt item">
            <div class="engine-basic-info info-title-bcg">
                <div class="engine-basic-info-body">
                    <div class="info-item a">
                        <!-- <div class="a-it stop-box" v-if="engineStatusBool">
                            <el-button class="le-button" @click="stopEngine">
                                <img :src="`${GLOBAL.assetsUrl}/img/fun11_${theme}.png`" alt="">
                            </el-button>
                        </div> -->
                        <span class="s1 txt">{{ $t('计算量Ana') }}</span>
                        <span class="su-num txt" v-if="engineStatusBool">
                            <engineSimulation ref="engineSimulation" :planId.sync="planId" :num.sync="numCul" :engineStatus.sync="engineStatusBool" :planData.sync="planData"></engineSimulation>
                        </span>
                        <!-- style="margin-left: 1rem;" -->
                        <span class="su-num txt" v-if="!engineStatusBool">{{optRoot.Number | tofixed0 | sicNumber}}</span>
                    </div>
                    <div class="info-item c" v-if="komi != 7.5">
                        <!-- <el-switch
                        v-model="analyseTypeCopy"
                        @change="analyseTypeChange"
                        active-color="#13ce66"
                        inactive-color="#989899">
                        </el-switch>
                        <span class="txt">{{$t('按让子胜率分析')}}</span> -->
                    </div>
                    <div class="info-item b">
                        <div class="komi-box txt theme-border-options">{{$t(komiTxt)}}</div>
                        <div class="plan-box txt theme-border-options cursor-pointer" @click="planChange" v-if="engineStatusBool">{{$t(planTxt)}}</div>
                    </div>
                </div>
            </div>
            <div class="opt-content">
                <div class="table-head">
                    <div class="table-item table-head-item">
                        <!-- <span class="s1">{{ $t('计算量Ana') }}</span>
                        <span class="su-num">{{optRoot.Number | tofixed0 | sicNumber}}</span> -->
                        <span class="txt" v-text="'选点'"></span>
                    </div>
                    <div class="table-item table-head-item"><span class="txt" v-text="$t('推荐度')"></span></div>
                    <div class="table-item table-head-item">
                        <div class="item-body" v-if="analyseModal">
                            <span v-if="optionsStyle.value == 0">
                                <span class="txt" v-if="language != 'en'">{{$t((now == 1 ? '黑' : '白')) + $t('领先(目)')}}</span>
                                <span class="txt" v-else>{{$t('领先(目)')}}({{$t(now == 1 ? 'B' : 'W')}})</span>
                            </span>
                            <span class="txt" v-if="optionsStyle.value != 0">{{$t('领先(目)')}}</span>
                        </div>
                        <div class="item-body" v-if="ldpModal">
                            <span class="txt">{{$t('结果')}}</span>
                        </div>
                    </div>
                    <div class="table-item table-head-item">
                        <div class="item-body" v-if="analyseModal">
                            <span v-if="optionsStyle.value == 0">
                                <span class="txt" v-if="language != 'en'">{{$t((now == 1 ? '黑' : '白')) + $t('胜率(%)')}}</span>
                                <span class="txt" v-else>{{$t('胜率(%)')}}({{$t(now == 1 ? 'B' : 'W')}})</span>
                            </span>
                            <span class="txt" v-if="optionsStyle.value != 0">{{$t('胜率(%)')}}</span>
                        </div>
                        <div class="item-body" v-if="ldpModal">
                            <span class="txt">{{$t('详情')}}</span>
                        </div>
                    </div>
                </div>
                <div class="table-content" 
                :class="{'extend': extendListStatus}"
                v-loading="optionsLoading && engineStatus.id" 
                element-loading-background="rgba(0, 0, 0, 0.0)" 
                element-loading-spinner="page-loading-icon-css"
                >
                <!-- :style="tableContentHeight" -->
                <!-- {height: tableH + 'rem'} -->
                    <div class="table-content-body" @mouseleave="optionsLeave">
                        <div class="table-content-item" 
                        v-for="(v, i) in optionsCul" :key="i" 
                        @mouseenter="optionsEnter(v)" 
                        @click="optionsClick(v)" 
                        :class="{'active': hoverOptionsIndex == v.index, 'selected': optionsRowNowCul.Move == v.Move}" 
                        @mouseleave="optionsLeave"
                        @dblclick="playOptions(v)">
                            <div class="table-item">
                                <div class="table-item-body" v-if="!v.ldpEnd">
                                    <div class="rise-box" v-if="riseCoor && riseCoor == v.Move">
                                        <img :src="`${GLOBAL.assetsUrl}/img/rise_red.png`" alt="">
                                    </div>
                                    <div class="table-item-body move">
                                        <!-- <div class="stone-label" :class="v.Color"></div> -->
                                        <div class="stone-label-ldp" :class="{'white': v.Color == 'WHITE', 'black': v.Color == 'BLACK'}"></div>
                                        <div class="txt">{{v.Move | coordFilter}}</div>
                                    </div>
                                </div>
                            </div>
                            <div class="table-item">
                                <div v-if="!v.ldpEnd">
                                    <div class="table-item-body prop">
                                        <div class="txt" v-if="optionsStyle.value != 0 && v.Move != 'KO_R'">
                                            {{(optionsCul[0].Move == 'KO_R' ? v.Proportion / 2 : v.Proportion) | winrate2}}%
                                        </div>
                                        <div class="txt" v-if="v.Move == 'KO_R'">{{$t('50%')}}</div>
                                    </div>
                                    <div class="table-item-body prop" v-if="optionsStyle.value == 0">
                                        <div class="table-item-prop-range theme-border-options">
                                            <div class="prop-range-body" :style="v.propStyle" ></div>
                                        </div>
                                        <div class="txt">{{v.Proportion | winrate2}}%</div>
                                    </div>
                                </div>
                                
                            </div>
                            <div class="table-item">
                                <div class="table-item-body delta">
                                    <div class="item-body" v-if="analyseModal">
                                        <span class="txt" v-if="optionsStyle.value == 0">{{v.BP_Delta | tofixed1}}</span>
                                        <div class="delta-box options-delta-box" v-if="optionsStyle.value != 0" :class="optionsStyle.data[optionsStyle.value].name">
                                            <span class="txt val" :style="optionsStyle.value == 1 ? GLOBAL.deltaWidth(v.BP_Delta) : ''" :class="GLOBAL.deltaClass(v.BP_Delta, now)">
                                                {{v.BP_Delta | abs | tofixed1}}
                                            </span>
                                        </div>
                                    </div>
                                    <div class="item-body" v-if="ldpModal">
                                        <div class="delta-box options-delta-box ldp" v-if="optionsStyle.value != 0" :class="optionsStyle.data[optionsStyle.value].name">
                                            <ldpResultDetail 
                                            :ldpResult.sync="v.rootResultCom.result" 
                                            :blackWinrate.sync="v.rootResultCom.blackWinrate"
                                            :refreshSpeed.sync="refreshSpeed"
                                            :knBlockSize.sync="knBlockSize"
                                            :unknownNum.sync="unknownNum"
                                            :ldpResult_org.sync="v.ldp_result"
                                            :updateParams.sync="updateParams"
                                            ></ldpResultDetail>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="table-item">
                                <div class="item-body" v-if="analyseModal">
                                    <div class="table-item-body winrate" v-if="optionsStyle.value == 0">
                                        {{v.BP_Value | winrate}}
                                    </div>
                                    <div class="table-item-body winrate-options" v-if="optionsStyle.value != 0">
                                        <div class="box" v-if="optionsStyle.value == 1">
                                            <div class="new-win-it">
                                                <span class="txt">{{now == 1 ? v.BP_Value : (1 - v.BP_Value) | winrate}}</span>
                                            </div>
                                            <div class="new-win-it r">
                                                <div class="r-b" :style="{width: `${(now == 1 ? v.BP_Value : (1 - v.BP_Value)) * 100}%`}"></div>
                                                <div class="r-w" :style="{width: `${(now == -1 ? v.BP_Value : (1 - v.BP_Value)) * 100}%`}"></div>
                                            </div>
                                            <div class="new-win-it">
                                                <span class="txt">{{now == -1 ? v.BP_Value : (1 - v.BP_Value) | winrate}}</span>
                                            </div>
                                        </div>
                                        <div class="box fix" :class="optionsStyle.data[optionsStyle.value].name" v-if="optionsStyle.value == 2 || optionsStyle.value == 3">
                                            <div class="new-win-it r">
                                                <div class="r-b" :class="{'opt-weaken': now == -1}">
                                                    <span class="txt b">{{now == 1 ? v.BP_Value : (1 - v.BP_Value) | winrate}}</span>
                                                </div>
                                                <div class="r-w" :class="{'opt-weaken': now == 1}">
                                                    <span class="txt w">{{now == -1 ? v.BP_Value : (1 - v.BP_Value) | winrate}}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="item-body" v-if="ldpModal">
                                    <ldpResultDetail 
                                    :ldpEnd.sync="v.ldpEnd"
                                    :ldpDetail.sync="v.rootResultCom.detail" 
                                    :blackWinrate.sync="v.rootResultCom.blackWinrate"
                                    :refreshSpeed.sync="refreshSpeed"
                                    :knBlockSize.sync="knBlockSize"
                                    :unknownNum.sync="unknownNum"
                                    :ldpResult_org.sync="v.ldp_result"
                                    :updateParams.sync="updateParams"
                                    ></ldpResultDetail>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- <div class="options-style-select">
                        <el-radio v-model="optionsStyle.value" :label="v.value" v-for="(v, i) in optionsStyle.data" :key="i">
                            <span class="txt">样式{{v.name}}</span>
                        </el-radio>
                    </div> -->
                </div>
                <!-- <el-table 
                :data="options" 
                ref="comOptions"
                class="opt-content-table"
                :row-class-name="rowClassFun"
                :height='tableH' 
                v-loading="optionsLoading"
                element-loading-background="rgba(0, 0, 0, 0.0)"
                :header-cell-style="tableStyle.header"
                :row-style="tableStyle.row"
                highlight-current-row
                @cell-mouse-enter="optionsEnter"
                @row-click="optionsClick"
                :cell-style="tableStyle.cell"
                >
                
                    <el-table-column prop="Move" label="选点" :width="moveCellWidthFun() + 'px'">
                        <template slot-scope="v" class="move-area">
                            <div class="move-cell">
                                <span class="stone-label" :class="v.row.Color"></span>
                                <span v-text="v.row.Move"></span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="Proportion" label="推荐度">
                        <template slot-scope="v">
                            <span>{{v.row.Proportion | winrate2}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="BP_Delta" :label="(now == 1 ? '黑' : '白') + '领先(目)'"></el-table-column>
                    <el-table-column prop="BP_Value" :label="(now == 1 ? '黑' : '白') + '胜率'">
                        <template slot-scope="v">
                            <span>{{v.row.BP_Value | winrate}}</span>
                        </template>
                    </el-table-column>
                    <div slot='empty'>

                    </div>
                </el-table> -->
            </div>
        </div>
        <!-- <div class="branch item hidden">
            <div class="branch-body">
                <div class="title">形势分析</div>
                <div class="branch-content" v-show="branch.length > 0">
                    <el-table 
                    :data="branch" 
                    ref="comBranch"
                    class="branch-content-table"
                    :height='tableH' 
                    :header-cell-style="tableStyle.headerB"
                    :row-style="tableStyle.rowB"
                    highlight-current-row
                    @row-dblclick="playBranch"
                    @row-click="branchClick"
                    :cell-style="cellCallback"
                    >
                        <el-table-column prop="num" label="手数">
                            <template slot-scope="v">
                                <span>{{v.row.index + 1}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="Move" label="选点">
                            <template slot-scope="v" class="move-area">
                                <div class="move-cell">
                                    <span class="stone-label" :class="v.row.Color"></span>
                                    <span v-text="v.row.Move"></span>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="Proportion" label="占比">
                            <template slot-scope="v">
                                <span>{{v.row.Proportion | winrate}}</span>
                            </template>
                        </el-table-column>
                        
                        <el-table-column prop="BP_Value" width="100%" :label="(now == 1 ? '黑方' : '白方') + '胜率'">
                            <template slot-scope="v">
                                <span>{{v.row.BP_Value | winrate}}</span>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
        </div> -->
    </div>
</template>

<script>
import engineSimulation from './engineSimulation.vue'
import ldpResultDetail from '../views/lifeAndDeath/ldpResultDetail.vue'

export default {
    name: 'options',
    props: {
        theme: {
            default: 'dark',
            type: String
        },
        tableH: String,
        engineDataConfigApp: Object,
        position: Number,
        language: String,
        extendListStatus: Boolean,
        komi: Number,
        plan: String,
        planId: Number,
        engineStatusBool: Boolean,
        analyseType: {
            default: 1,
            type: Number
        },
        riseCoor: String,
        planData: Object,
        modal: {
            default: 'analyse',
            type: String
        },
    },
    data(){
        return {
            ldpAnimationData: {
                agile: 0.1,
                resistance_1: 0.2,
                resistance_2: 2.0,
                padding: 0.2,
                swing_agile: 0.01,
                swing_min: 0.1,
                swing_max: 0.4,
            },
            paramsSwitch: true,
            agile: 0.1,
            padding: 0.2,
            swing1: 0.01,
            swing2: 0.2,
            swing3: 0.1,
            resistance: 0.01,
            knBlockSize: '0.2', 
            refreshSpeed: '10',
            unknownNum: '70',
            optionsRowNowEnter: null,
            optionsStyle: {
                data: [
                    {name: 'A', value: 0},
                    {name: 'B/C', value: 1},
                    {name: 'D', value: 2},
                    {name: 'E', value: 3},
                ],
                value: 3
            },
            nextPosition: null,
            engineStatus: {
                id: null
            },
            moveCellWdith: '60',
            optSimuVal:[],
            lastOpt: [],
            // optStep: this.GLOBAL.optSpeInterval / this.GLOBAL.optIntervalTime,
            optSperate: {
                interval: null,
                step: this.GLOBAL.optSpeInterval / this.GLOBAL.optIntervalTime,
                num: 0
            },
            now: 1,
            options: [],
            branch: [],
            tableStyle: {
                header: {
                    'background': '#21252b',
                    'color': '#556070',
                    "height": '1.65rem',
                    'font-size': '0.7rem',
                    'padding': '0px',
                    'border': '0px',
                },
                headerB: {
                    'background': '#373e48',
                    'color': '#556070',
                    "height": '1.65rem',
                    'font-size': '0.6rem',
                    'padding': '0px',
                    'border': '0px'
                },
                row: {
                    'height': '1.8rem',
                    'background': '#373e48',
                    'cursor': 'pointer'
                },
                rowB: {
                    'height': '1.8rem',
                    'background': '#21252b',
                    'cursor': 'pointer'
                },
                cell: {
                    
                    'border': '0px',
                    // 'color': '#fff',
                    'font-size': '0.6rem',
                    'padding': '0px',
                }
            },
            optRoot: {},
            rootCopy: {},
            lastOptRoot: null,
            optRootDelta: 0,
            branchRoot: {},
            branchRowNow: null,
            optionsRowNow: null,
            optionsLoading: true,
            optionsLock: false,
            hoverOptionsIndex: null,
            optionsLeaveTimeout: null,
            branchIndex: null,
            nextOptions: null
        }
    },
    methods: {
        rowClassFun(opt){
            let row = opt.row
            if(this.hoverOptionsIndex == null) return
            if(this.hoverOptionsIndex == row.index){
                return 'row-hover-define'
            }
            return
        },
        setKomi(){

        },
        cellCallback(row){
            if(row.columnIndex != 0) return this.tableStyle.cell
            return {
                'border': '0px',
                'color': '#fff',
                'font-size': '0.6rem',
                'padding': '0px',
                'width': '3rem',
            }
        },
        clearOptions(move, p){
            let num = 0, specProportion = undefined
            if(move){
                let optRoot = this.lastOptRoot || this.optRoot
                for(var i in this.options){
                    if(this.options[i].Move == move){
                        num = optRoot.Number * this.options[i].Proportion
                        specProportion = this.options[i].Proportion
                        break
                    }
                }
            }
            // let nextOptions = this.playByclick(move)
            let nextOptions = this.nextOptionsGet(move, p)
            if(nextOptions && nextOptions[0] && nextOptions[0].pathCode == 'root') nextOptions[0].specProportion = specProportion
            this.optionsIntervalOff()
            this.options = []
            this.nextOptions = null
            this.branch = []
            this.optRoot = {Number: num, specProportion: specProportion}
            this.rootCopy = {Number: num, specProportion: Number(specProportion)}
            this.optionsLoading = true
            this.lastOptRoot = num == 0 ? null : {Number: num}
            this.hoverOptionsIndex = null
            this.optRootDelta = 0
            this.branchIndex = null
            this.optionsRowNow = null
            this.optSperate = {
                interval: null,
                step: this.GLOBAL.optSpeInterval / this.GLOBAL.optIntervalTime,
                num: 0
            }
            this.lastOpt = []
            this.optSimuVal = []
            this.optionsLock = false
            this.$forceUpdate()
            return nextOptions
        },
        playOptions(row){
            let data = [row.Move]
            this.branchOff()
            this.optionsSelect()
            this.$emit('takeFun', {
                fun: 'playBranch',
                data: data
            })
        },
        playBranch(row){
            let index = row.index
            let branch = this.branch
            let data = []
            for(var i in branch){
                data.push(branch[i].Move)
                if(Number(branch[i].index) >= Number(index)) break
            }
            this.branchOff()
            this.optionsSelect()
            this.$emit('takeFun', {
                fun: 'playBranch',
                data: data
            })
        },
        isBranchCoor(move){
            let branch = this.branch, row = false
            for(var i = branch.length - 1; i >= 0; i--){
                if(branch[i].Move == move){
                    row = true
                    break
                }
            }
            return row
        },
        branchPlayByDb(move){
            let branch = this.branch, row = null, index = this.branchRowNow.index
            for(var i = index; i >= 0; i--){
                if(branch[i].Move == move){
                    row = branch[i]
                    break
                }
            }
            if(row) this.playBranch(row)
        },
        branchOff(){
            this.optionsSelect()
            this.optionsRowNow = null
            this.branchRowNow = null
            this.optionsRowNowEnter = null
            this.branch = []
            this.optionsLock = false
        },
        getbranchNow(){
            let moves = '', color
            for(var i in this.branch){
                moves += this.branch[i].Move + ','
                if(this.branch[i].Move == this.branchRowNow.Move && this.branch[i].PathCode == this.branchRowNow.PathCode){
                    moves = moves.substring(0, moves.length - 1)
                    color = this.branch[i].Color
                    break
                }
            }
            return {
                moves: this.branchRowNow.PathCode,
                // color: this.branchRowNow.Color,
                color: color,
                coors: moves
            }
        },
        optionsEnter(row){
            if(this.optionsLock) return
            this.optionsSelect(row)
            if(this.optionsRowNow && row.Move == this.optionsRowNow.Move){
                return
            }
            this.$emit('takeFun', {
                fun: 'boardEnterOpt',
                data: row.Move
            })
        },
        optionsEnterByMove(move){
            let list = this.optionsCul
            let row = null
            for(var i in list){
                if(list[i].Move == move){
                    row = list[i]
                }
            }
            return row
        },
        boardEnter(){
            this.$emit('takeFun', {
                fun: 'update',
                data: {
                    optionsMouseEnter: true
                }
            })
        },
        optionsLeave(){
            // clearTimeout(this.optionsLeaveTimeout)
            // this.optionsLeaveTimeout = setTimeout(() => {
                if(this.optionsLock) return
                this.optionsClear()
                this.$emit('takeFun', {
                    fun: 'update',
                    data: {
                        optionsMouseEnter: false
                    }
                })
                this.$emit('takeFun', {
                    fun: 'optionsLeave',
                    data: {
                        optionsMouseEnter: false
                    }
                })
            // }, this.GLOBAL.branchTimeout)
        },
        optionsClear(){
            this.$emit('takeFun', {
                fun: 'branchOff',
            })
            // this.branchOff()
            this.optionsSelect()
            this.optionsLock = false
        },
        optionsEnterSelect(move){
            let row = move
            move = this.GLOBAL.lifeDeathMoveParse(move)
            let optList = this.options
            if(this.GLOBAL.isString(move)){
                for(var i in optList){
                    let moveParse = this.GLOBAL.lifeDeathMoveParse(optList[i].Move)
                    if(moveParse == move){
                        row = optList[i]
                        break
                    }
                }
            }
            if(this.optionsRowNowEnter && !this.optionsLock){
                if(this.optionsRowNowEnter.index != row.index){
                    this.$emit('takeFun', {
                        fun: 'branchOff'
                    })
                    return
                }
            }
            this.optionsSelect(row)
            this.optionsRowNow = row
            this.optionsRowNowEnter = this.GLOBAL.deepCopy(row)
            
        },
        branchMouseRightToLock(){
            this.optionsLock = true
        },
        optionsClick(row){
            if(this.optionsRowNow && row.Move == this.optionsRowNow.Move && this.optionsLock){
                let optionsLock = this.optionsLock
                // if(optionsLock){
                    this.optionsClear()
                // }
                // setTimeout(() => {
                    this.optionsLock = false
                // }, 500) 
                return
            }
            this.optionsSelect(row)
            this.optionsRowNow = row
            this.optionsByClick(row.Move)
            this.optionsLock = true
        },

        optionsChange(row, rowOld){
            // if(!row) return
            
            // let move = row.Move
            // this.optionsRowNow = row
            //  if(rowOld && move == rowOld.Move){
            //      this.$emit('takeFun', {
            //         fun: 'branchOff',
            //         data: move
            //     })
            //     this.optionsSelect(null)
            //     return
            //  }
            // this.optionsByClick(row.Move)
        },
        branchChange(row, rowOld){
            if(!row){
                this.branchByClick(null)
                return
            } 
             this.branchRowNow = row
            let move = row.Move
            if(rowOld && move == rowOld.Move){
                return
            }
            this.branchByClick(row)
        },
        simulationAdd(num){
            if(!this.optRoot || this.optRoot.length <= 0) return
            this.optRoot.Number += num
        },
        optionsSpeAction(step){
            this.optStep = step
        },
        
        optSimuSet(){
            if(!this.GLOBAL.optionsTimeoutShow) return
            if(this.lastOptRoot == null){
                this.optRootDelta = 0
            }else{
                this.optRootDelta = this.optRoot.Number - this.lastOptRoot.Number
            }
            this.lastOptRoot = this.GLOBAL.copy(this.optRoot)
            this.optRoot.Number = this.optRoot.Number - this.optRootDelta
        },
        optionsRootGet(){
            // this.optRoot.Number = (Number(this.optRoot.Number ) + this.optRootDelta * this.optSperate.step).toFixed(0)
            this.optRoot.Number = Number(this.optRoot.Number) + this.optRootDelta * this.optSperate.step
        },
        itemNumberGet(){
            let options = this.options
            for(var i in options){
                // options[i].Number = (Number(options[i].Number) + this.optSperate.step * this.optSimuVal[i]).toFixed(0)
                options[i].Number = Number(options[i].Number) + this.optSperate.step * this.optSimuVal[i]
            }
            this.options = options
        },
        optRootHandle(root){
            this.rootCopy = this.GLOBAL.deepCopy(root)
            root.BP_Value = root.BP_Value * 100
            root.blackBP_Value = root.Color == 'WHITE' ? root.BP_Value.toFixed(1) : (100 - root.BP_Value).toFixed(1)
            root.whiteBP_Value = root.Color == 'WHITE' ? (100 - root.BP_Value).toFixed(1) : root.BP_Value.toFixed(1)
            return root
        },
        optionsNowCheck(options){
            if(!this.optionsRowNow) return
            options = options || this.options
            for(var i in options){
                let moveParse = this.GLOBAL.lifeDeathMoveParse()
                if(this.optionsRowNow.Move == options[i].Move) return
            }
            this.optionsRowNow = null
        },
        optionsHandle(opt, now){
            this.optionsIntervalOff()
            this.now = now
            this.optRoot = this.optRootHandle(opt.shift()) 
            this.optSimuSet()
            // if(!this.optionsLock) this.options = this.filterOpt(opt)
            this.options = this.filterOpt(opt)
            this.nextOptionsSet(this.GLOBAL.deepCopy(this.options))
            this.optionsLoading = false
            this.optionsIntervalOn()
            if(this.hoverOptions && this.optionsRowNow) this.setCurrentRow(this.optionsRowNow.Move)
            this.optionsNowCheck()
            this.$forceUpdate()
        },
        nextOptionsSet(options){
            if(!options) return
            let nextOptions = {}
            let f = false
            for(var i in options){
                if(options[i].nextOptions){
                    let root = {
                        pathCode: 'root',
                        BP_Delta: options[i].BP_Delta,
                        BP_Value: options[i].BP_Value,
                        Color: options[i].Color,
                        Move: options[i].Move,
                        Number: options[i].Number,
                        Proportion: options[i].Proportion,
                    }
                    options[i].nextOptions.unshift(root)
                    for(var j in options[i].nextOptions){
                        options[i].nextOptions[j].BP_Value = 1 - options[i].nextOptions[j].BP_Value
                        options[i].nextOptions[j].BP_Delta = -options[i].nextOptions[j].BP_Delta
                    }
                    nextOptions[options[i].Move] = options[i].nextOptions
                    f = true
                }
            }
            if(f){
                this.nextOptions = nextOptions
                this.nextPosition = this.position
            }
        },
        nextOptionsGet(move, p){
            if(!this.nextOptions) return null
            let pNext = this.nextPosition
            if((Number(pNext) + 1) != p) return null
            if(this.GLOBAL.isObject(move)) move = this.GLOBAL.coorNtoS(move.x, move.y)
            // move = move.x + move.y
            let data = this.nextOptions[move] || null
            return data



            
        },
        optionsIntervalOn(){
            if(!this.GLOBAL.optionsTimeoutShow) return
            this.optSperate.interval = setInterval(() => {
                this.optSperate.num++
                this.optSperate.step = (this.GLOBAL.optSpeInterval / this.GLOBAL.optIntervalTime)
                this.optionsRootGet()
                if(!this.optionsLock) this.itemNumberGet()
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
        optionsByClick(move){
            this.$emit('takeFun', {
                fun: 'optionsByClick',
                data: move
            })
        },
        branchByClick(row){
            // if(!row){
            //     this.$emit('takeFun', {
            //         fun: 'branchByClick',
            //         data: []
            //     })
            //     return
            // }
            // this.branchSelect(row)
            let index = row.index
            let branch = this.branch
            let data = [], orData = []
            for(var i in branch){
                orData.push(branch[i])
                data.push(branch[i].Move)
                if(Number(branch[i].index) >= Number(index)) break
            }
            // this.setTableScrollTop(row.index)
            // setTimeout(() => {
            //     this.$refs['comBranch'].bodyWrapper.scrollTop = this.$refs['comBranch'].bodyWrapper.scrollHeight
            // }, 20);
            this.$emit('takeFun', {
                fun: 'branchByClick',
                data: data
            })
            this.$emit('takeFun', {
                fun: 'branchByClickOrginal',
                data: orData
            })
        },
        setTableScrollTop(index){
            
            
            setTimeout(() => {
                let height = this.$refs['comBranch'].bodyWrapper.scrollHeight
                let itemH = height / this.branch.length
               this.$refs['comBranch'].bodyWrapper.scrollTop = itemH * (Number(index)) 
            }, 20);
        },
        branchJumpByDb(move){
            let branch = this.branch, row = null, index = this.branchRowNow.index
            for(var i = index; i >= 0; i--){
                if(branch[i].Move == move){
                    row = branch[i]
                    break
                }
            }
            if(row) this.branchClick(row)
        },
        branchClick(row){
            let move = row.Move
            // if(this.branchRowNow && move == this.branchRowNow.Move){
            //     return
            // }
            this.branchRowNow = row
            this.branchByClick(row)
            this.$emit('takeFun', {
                fun: 'playStoneCheck',
                data: null
            })
            this.$emit('takeFun', {
                fun: 'refreshBoardSe',
                data: null
            })
        },
        setCurrentRow(move){
            let opt = this.options
            for(var i in opt){
                if(move == opt[i].Move){
                    this.optionsSelect(opt[i])
                    break
                }
            }
        },
        optionsSelect(row){
            // this.$refs.comOptions.setCurrentRow(row);
            this.hoverOptions = row ? true : false
            this.hoverOptionsIndex = row ? row.index : null
            // if(row){
            //     this.$refs.comOptions.setCurrentRow(row);
            // }else{
            //     this.$refs.comOptions.setCurrentRow();
            // }
        },
        branchSelect(row){
            // if(row){
            //     this.$refs.comBranch.setCurrentRow(row);
            // }else{
            //     this.$refs.comBranch.setCurrentRow();
            // }
            
        },
        branchMoveCheck(opt, options){
            options = options || this.options
            let f = false
            for(var i in options){
                if(options[i].Move == opt.Move){
                    f = true
                    break
                }
            }
            return f
        },
        branchHandle(opt, row){
            if(!this.branchMoveCheck(opt[0])){
                this.$emit('takeFun', {
                    fun: 'branchIsRemove',
                })
                return
            }
            this.branch = this.filterBranch(opt)
            row = row || this.branch[this.branch.length - 1]
            this.branchClick(row)
        },
        setOptVal(val, index){
            if(!this.GLOBAL.optionsTimeoutShow) return 0
            let lastOpt = this.lastOpt
            let data = null
            if(this.lastOpt.length <= 0) return 0
            if(!this.lastOpt[index]) return 0
            if(val.Move == lastOpt[index].Move){
                data = val.Number - lastOpt[index].Number
            }else{
                for(var i in lastOpt){
                    if(lastOpt[i].Move == val.Move){
                        data = val.Number - lastOpt[i].Number
                        break
                    }
                }
            }
            if(data == null){
                data = val.Number
            }
            return data
        },
        maxItemCheck(){
            let tableH = Number(this.tableH), itemH = 1.8
            return parseInt(tableH / itemH)
        },
        filterOpt(opt){
            let maxItem = this.maxItemCheck()
            // let min = this.GLOBAL.simuRateMin
            let min = this.engineDataConfigAppCul.probSelect || this.GLOBAL.simuRateMin
            let options = [], index = 0, optSimuVal = [], lastOpt = [], tem
            let lock = this.optionsLock, lockData = this.optionsRowNow
            let f = lock ? false : true
            for(var i in opt){
                if(Number(opt[i].Proportion) < min && i != 0) continue
                if(this.GLOBAL.optionsMaxNum <= index) break
                tem = this.setOptVal(opt[i], i)
                optSimuVal.push(tem)
                opt[i].index = index
                lastOpt.push(this.GLOBAL.copy(opt[i]))
                opt[i].Number = opt[i].Number - tem
                opt[i].propStyle = {
                    width: (opt[i].Proportion * 100).toFixed(0) + '%'
                }
                options.push(this.GLOBAL.copy(opt[i]))
                index++
                if(lock && lockData.Move == opt[i].Move){
                    f = true
                }
                if(options.length >= maxItem) break
            }
            if(lock && !f){
                this.$emit('takeFun', {
                    fun: 'branchOff'
                })
            }
            this.lastOpt = lastOpt
            this.optSimuVal = optSimuVal
            return options
        },
        filterBranch(opt){
            // let min = this.GLOBAL.simuRateMinBr
            let min = this.engineDataConfigAppCul.branchSelect || this.GLOBAL.simuRateMinBr
            let options = [], index = 0
            let color = this.now == 1 ? 'BLACK' : 'WHITE'
            for(var i in opt){
                if(Number(opt[i].Proportion) < min) break
                if(opt[i].Color != color) opt[i].WinRate = 1 - opt[i].WinRate
                opt[i].index = index
                options.push(this.GLOBAL.copy(opt[i]))
                index++
            }
            return options
        },
        branchScroll(e){
            if(!this.branch || this.branch.length <= 0) return
            let deltaY = e.deltaY
            let index = deltaY > 0 ? Number(this.branchRowNow.index) + 1 : Number(this.branchRowNow.index) - 1
            deltaY > 0 ? this.branchScrollDown() : this.branchScrollUp()
            this.$emit('takeFun', {
                fun: 'playActionForMove',
                data: {
                    index: index,
                    data: this.branch
                }
            })
        },
        branchScrollUp(){
            let index = this.branchRowNow.index
            index--
            if(index < 0) index = 0
            this.branchIndex = index
            this.branchClick(this.branch[index])
        },
        branchScrollDown(){
            let index = this.branchRowNow.index
            index++
            if(index > this.branch.length - 1) index = this.branch.length - 1
            this.branchIndex = index == this.branch.length - 1 ? null : index
            this.branchClick(this.branch[index])
        },
        branchScrollByKeyboard(p){
            let index = this.branchRowNow.index
            if(p == 'l') index = this.branch.length - 1
            else if(p == 's') index = 0
            else{
                index = index + Number(p)
                if(index < 0) index = 0
                if(index >= this.branch.length) index = this.branch.length - 1
            }
            this.branchClick(this.branch[index])
        },
        pageInit(){
            // this.$refs.comBranch.bodyWrapper.addEventListener('mousewheel', this.branchScroll)
            // this.$refs.comOptions.bodyWrapper.addEventListener('mouseleave', this.optionsLeave)
            // this.$refs.comOptions.bodyWrapper.addEventListener('mouseenter', this.boardEnter, true)
            
        },
        moveCellWidthFun(){
            return this.GLOBAL.htmlFontSize * 4
        },
        setEngineId(){
            this.engineStatus = {
                id: this.$store.state.engine_id,
            }
        },
        lockBranchBykeyboard(index){
            if(!this.options[index]) return
            this.optionsClick(this.options[index])
        },
        lockBranchJumpBykeyboard(index){
            if(!this.optionsLock) return
            index = Number(index)
            if(isNaN(index)) return
            index = Number(this.optionsRowNow.index) + index
            if(index < 0 || index >= this.options.length) return
            this.optionsClick(this.options[index])
        },
        optionsLockOff(){
            this.optionsClear()
            this.optionsLock = false
        },
        playByclick(move){
            let opt = this.GLOBAL.deepCopy(this.options)
            let rd
            if(this.GLOBAL.isString(move)) move = this.GLOBAL.splitGtp(move)
            let x = move.x, y = move.y
            for(var i in opt){
                let coor = this.GLOBAL.splitGtp(opt[i].Move)
                if(coor.x == x && coor.y == y){
                    rd = opt[i]
                    break
                }
            }
            if(!rd || !rd.nextOptions || !rd.nextOptions.length) return
            let root = {
                pathCode: 'root',
                BP_Delta: rd.BP_Delta,
                BP_Value: rd.BP_Value,
                Color: rd.Color,
                Move: rd.Move,
                Number: rd.Number,
                Proportion: rd.Proportion,
            }
            rd = rd.nextOptions
            rd.unshift(root)
            return rd
        },
        getRowByMove(move){
            let opt = this.options
            let f = null
            for(var i in opt){
                if(opt[i].Move == move){
                    f = this.GLOBAL.deepCopy(opt[i])
                    break
                }
            }
            return f
        },
        analyseTypeChange(val){
            this.$emit('analyseTypeChange', val)
        },
        paramsSwitchChange(){
            this.paramsSwitch = !this.paramsSwitch
        },
        stopEngine(){
            this.$emit('takeFun', {
                fun: 'engineControl'
            })
        },
        planChange(){
            this.$emit('takeFun', {
                fun: 'planChange'
            })
        }
    },
    created(){
        this.moveCellWdith = this.GLOBAL.htmlFontSize * 4
        this.GLOBAL.paseClearPageMsg()
        setTimeout(() => {
            this.pageInit()
        }, 500);
    },
    computed: {
        updateParams(){
            return this.ldpAnimationData
            // return {
            //     agile: this.agile,
            //     padding: this.padding,
            //     swing1: this.swing1,
            //     swing2: this.swing2,
            //     swing3: this.swing3,
            //     resistance: this.resistance
            // }
        },
        ldpModal(){
            return this.modal == 'ldp'
        },
        analyseModal(){
            return this.modal == 'analyse'
        },
        optionsRowNowCul(){
            if(!this.optionsLock) return {}
            let data = this.optionsRowNow || {}
            if(!this.GLOBAL.isObject(data)) return {}
            return data
        },
        numCul(){
            let root = this.rootCopy || {}
            let rd = {
                num: root.Number || 0,
                specProportion: root.specProportion
            }
            // return root.Number || 0
            return rd
        },
        komiTxt(){
            let data = this.GLOBAL.getKomi(this.komi)
            if(!data) return null
            return data.name
        },
        planTxt(){
            return this.plan || null
        },
        optionsCul(){
            let list = this.options
            for(var i in list){
                if(list[i] && !isNaN(Number(list[i].BP_Value))){
                    list[i].BP_Value = Number(list[i].BP_Value)
                    list[i].BP_Value = list[i].BP_Value.toFixed(3)
                }
            }
            return list || []
        },
        tableContentHeight(){
            // let h = 23, de = 3.7
            // if(this.extendListStatus) return {height: `${h - de}rem`}
            // return null
        },
        engineDataConfigAppCul(){
            return this.engineDataConfigApp || {}
        }
    },
    watch: {
        riseCoor:{
            handler(val){
            },
            immediate: true,
            deep: true
        },
        optRoot: {
            handler(val){
            },
            immediate: true,
            deep: true
        },
        analyseType: {
            handler(val){
                this.analyseTypeCopy = val == 1 ? true : false
            },
            immediate: true,
            deep: true
        },
        extendListStatus: {
            handler(val){
            },
            immediate: true,
            deep: true
        },
        position(val){
        },
        optionsLock(){
        },
        engineDataConfigApp: {
            handler(val){
            },
            immediate: true,
            deep: true
        }
        // optRoot: {
        //     handler(val){
        //     },
        //     deep: true,
        //     immediate: true
        // }
    },
    components: {
        engineSimulation,
        ldpResultDetail
    },
}
</script>

<style lang="less">
    .options{
        position: relative;
        .re-det-par{
            
            z-index: 2;
            position: absolute;
            bottom: 0px;
            .par-item{
                display: flex;
                align-items: center;
                white-space: nowrap;
                .el-input__inner{
                    height: 1.5rem;
                    width: 2rem;
                    padding: 0px 0.2rem;
                }
                .el-input{
                    width: auto;
                }
            }
            .params-box{
                display: flex;
                // justify-content: space-between;
                flex-wrap: wrap;
                .par-item{
                    margin-right: 0.5rem;
                    margin-top: 0.5rem;
                }
                .par-item:last-child{
                    margin-right: 0px;
                }
            }
            .params-switch-btn{
                padding: 0px 0.5rem;
                margin-top: 0.5rem;
            }
        }
        .el-table, .el-table__expanded-cell{
            background: none;
        }
        display: flex;
        // height: 10.9rem;
        height: 100%;
        .el-table--enable-row-hover .el-table__body tr:hover>td{
            // background: #2e343d;
            background: #B7B7B7;
            color: #373E48;
        }
        .el-table__body tr.row-hover-define>td{
            background: #B7B7B7;
            color: #373E48;
        }
        .el-table__body tr.current-row>td{
            // background: #2e343d;
            // color: #fff;
            background: #B7B7B7;
            color: #373E48;
        }
        .item{
            height: 100%;
            // background: #6A707E;
            // border-radius: 0.4rem;
            overflow: hidden;
        }
        .item.opt{
            // width: 18rem;
            width: 100%;
            // margin-right: 0.5rem;
            .title{
                background: #6A707E;
                display: flex;
                align-items: center;
                position: relative;
                // font-size: 1rem;
                // color: #299899;
                color: #fff;
                height: 2rem;
                // padding: 0px 2.25rem;
                // padding: 0px 1rem;
                padding: 0px 0.5rem;
                line-height: 2rem;
                text-align: left;
                .title-item.a{
                    // max-width: 6.8rem;
                    width: 6.8rem;
                    height: 100%;
                    font-size: 0.7rem;
                    float: left;
                    span.su-num{
                        // font-size: 1rem;
                        font-size: 0.85rem;
                    }
                }
                .title-item.b{
                    width: 3.1rem;
                    height: 100%;
                    span{
                        // font-size: 0.8rem;
                    }
                    float: right;
                }
                .winrate-range{
                    // width: 12.5rem;
                    width: 15.1rem;
                    // position: absolute;
                    left: 0px;
                    right: 0px;
                    margin: auto;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    padding: 0.5rem 0px;
                    justify-content: center;
                    .range-body{
                        width: 12.5rem;
                        // width: 100%;
                        // border: 1px solid #ddd;
                        height: 100%;
                        display: flex;
                        .range-item{
                            .txt{
                                // font-size: 0.65rem;
                                font-size: 0.7rem;
                            }
                            transition: all .5s;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                        }
                        .range-b{
                            text-align: left;
                            color: #fff;
                            background: #000;
                            // justify-content: flex-start;
                        }
                        .range-w{
                            // justify-content: flex-end;
                            text-align: right;
                            color: #000;
                            background: #fff;
                        }
                    }
                    .range-txt.range-txt-b{
                        margin-right: 0.2rem
                    }
                    .range-txt.range-txt-w{
                        margin-left: 0.2rem
                    }
                    .range-txt{
                        font-size: 0.65rem;
                    }
                }
            }
            .opt-content{
                // background: #6A707E;
                width: 100%;
                .text{
                    // font-size: 0.8rem;
                }
                .txt{
                    // font-size: 0.8rem;
                }
                .table-item:first-child{
                    text-align: left;
                    // width: 14%
                    // width: 20%;
                    // width: 9rem;
                    width: 6.5rem;
                    align-items: center;
                    justify-content: flex-start;
                    padding-left: 1.2rem;
                }
                .table-item:nth-child(2){
                    // width: 21%
                    // width: 8.5rem;
                    width: 4rem;
                    text-align: center;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    .table-item-body.prop{
                        display: flex;
                        align-items: center;
                        .table-item-prop-range{
                            width: 4.75rem;
                            margin-right: 0.3rem;
                            // border: 1px solid;
                        }
                        .txt{
                            width: 1.45rem;
                            text-align: right;
                        }
                    }
                }
                .table-head-item:nth-child(3){
                    .txt{
                        // padding-left: 1rem;
                    }
                }
                .table-item:nth-child(3){
                    // width: 33.5%;
                    // width: 27%;
                    width: 7.5rem;
                    .table-item-body{
                        // width: 2.1rem;
                    }
                }
                .table-head-item:nth-child(4){
                    // justify-content: flex-end;
                    justify-content: center;
                    .txt{
                        // padding-left: 1rem;
                    }
                }
                .table-item:nth-child(4){
                    // width: 31.5%;
                    // width: 27%;
                    width: 8rem;
                    .table-item-body{
                        // width: 1.8rem;
                        // width: 3rem;
                    }
                }
                .table-item{
                    white-space: nowrap;
                    text-align: right;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 0px 0.5rem;
                    position: relative;
                    .rise-box{
                        position: absolute;
                        left: 0.2rem;
                        top: 0px;
                        height: 100%;
                        display: flex;
                        align-items: center;
                        img{
                            width: 0.7rem;
                        }
                    }
                    .table-item-body.move{
                        .stone-label-ldp{
                            width: 0.75rem;
                            height: 0.75rem;
                            margin-right: 0.15rem;
                        }
                        .stone-label{

                        }
                        .txt{
                            min-width: 1.3rem;
                        }
                        display: flex;
                        align-items: center;
                    }
                    // .table-item-body.winrate.new{
                    //     white-space: nowrap;
                    //     width: 100%;
                    //     display: flex;
                    //     align-items: center;
                    //     .new-win-it.r{
                    //         height: 0.6rem;
                    //         width: 100%;
                    //         display: flex;
                    //         margin: 0px 0.2rem;
                    //         .r-b{
                    //             width: 50%;
                    //             height: 100%;
                    //             background: #000;
                    //         }
                    //         .r-w{
                    //             width: 50%;
                    //             height: 100%;
                    //             background: #fff;
                    //         }
                    //     }
                    // }
                    // text-align: center;
                    // width:25%;
                    .item-body{
                        width: 100%;
                        text-align: center;
                    }
                }
                .table-content{
                    overflow-y: auto;
                }
                .table-content::-webkit-scrollbar{
                    width: 4px;
                }
                .table-content::-webkit-scrollbar-thumb{
                    border-radius: 10px;
                    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
                    background: rgba(0,0,0,0.2);
                }
                .table-content::-webkit-scrollbar-track{
                    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
                    border-radius: 0;
                    background: rgba(0,0,0,0.1);
                }
                .table-content.extend{
                    height: 19.3rem;
                }
                .table-content{
                    position: relative;
                    // height: 22.25rem;
                    // height: 21.3rem;
                    // height: 21.98rem;
                    height: 22.4rem;
                    // padding: 0px 0.5rem;
                    // color: #fff;
                    .table-content-item:last-child{
                        border: 0px;
                    }
                    .table-content-item{
                        
                        display: flex;
                        border-bottom: 1px solid @optionsTableBorder;
                        // #81838B 
                        // height: 2rem;
                        height: 1.8rem;
                        align-items: center;
                        cursor: pointer;
                        .txt{
                            // color: #fff;
                            // font-size: 0.7rem;
                            // margin-left: 0.25rem;
                        }
                        .table-item-prop-range{
                            padding-right: 0.25rem;
                            text-align: right;
                            width: 100%;
                            height: 0.3rem;
                            // background: #575A61;
                            // border-radius: 0.375rem;
                            position: relative;
                            
                            .prop-range-body{
                                // border-radius: 0.375rem;
                                position: absolute;
                                top: 0px;
                                left: 0px;
                                height: 100%;
                                background: #fff;
                                width: 70%
                            }
                        }
                    }
                    .table-content-item.active{
                        // background: #82A6E0;
                        // background: #71a845;
                        background: rgba(77,190,70,0.6);
                        // background: #4dbe46;
                        // color: #000;
                        .table-item-prop-range{
                            .txt{
                                // color: #000;
                            }
                        }
                    }
                    .table-content-item.active.selected{
                        background: #4dbe46;
                    }
                    // .table-content-item.active:hover{
                    //     background: #4dbe46;
                    //     background: rgba(77,190,70,0.6);
                    // }
                    .table-content-item:hover{
                        // background: #82A6E0;
                        // background: #4dbe46;
                        background: rgba(77,190,70,0.6);
                        // color: #000;
                        .table-item-prop-range{
                            .txt{
                                // color: #000;
                            }
                        }
                    }
                }
                .table-head{
                    // padding: 0px 0.5rem;
                    display: flex;
                    // color: #fff;
                    width: 100%;
                    height: 2rem;
                    align-items: center;
                    // background: #575A61;
                    border-bottom: 1px solid @optionsTableBorder;
                    .table-head-item{
                        white-space: nowrap;
                        // padding: 0 ;
                        .s1{
                            margin-right: 0.2rem;
                        }
                    }
                }
                
            }
            .opt-content-table{
                .cell{
                    .move-cell{
                        display: flex;
                        align-items: center;
                    }
                }
            }
            .engine-basic-info{
                padding: 0.2rem 1rem;
                .engine-basic-info-body{
                    white-space: nowrap;
                    display: flex;
                    .txt{
                        font-size: 0.65rem;
                    }
                    .info-item.a{
                        text-align: left;
                        width: 100%;
                        display: flex;
                        align-items: center;
                        .stop-box{
                            margin-right: 0.5rem;
                            .el-button{
                                background: none;
                                height: auto;
                                img{
                                    width: 1.2rem;
                                }
                            }
                        }
                        .s1{
                            margin-right: 0.2rem;
                        }
                    }
                    .info-item.b{
                        display: flex;
                        .komi-box{
                            margin-right: 0.5rem;
                        }
                        > .txt{
                            width: 5rem;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            border-radius: 0.15rem;
                        }
                    }
                    .info-item.c{
                        margin-right: 1rem;
                        display: flex;
                        align-items: center;
                        .txt{
                            margin-left: 0.3rem;
                        }
                    } 
                }
            }
        }
        .el-table td.gutter, .el-table th.gutter{
            background: #21252b;
        }
        .item.branch{
            .el-table td.gutter, .el-table th.gutter{
                background: #21252b;
                display: none;
            }
            .el-table__body, .el-table__footer, .el-table__header{
                table-layout: auto;
            }
            width: 14rem;
            .branch-body{
                background: #21252b;
                .title{
                    height: 2rem;
                    color: #fff;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.7rem;
                }
                .branch-content-table{
                    .el-table th>.cell{
                        padding: 0px;
                    }
                    .el-table th:nth-child(4){
                        width: 30%;
                    }
                    .el-table__body-wrapper{
                        overflow: hidden;
                    }
                }
                table{
                    width: 100% !important;
                }
            }
            
        }
        .stone-label.BLACK{
            background: url('@{assetsUrl}stb1.png') no-repeat;
            background-size: 100% 100%;
        }
        .stone-label.WHITE{
            background: url('@{assetsUrl}stw1.png') no-repeat;
            background-size: 100% 100%;
        }
        .stone-label{
            float: left;
            width: 0.75rem;
            height: 0.75rem;
            margin-right: 0.15rem;
        }
        .el-table::before{
            height: 0px;
        }
        .table-content{
            overflow-y: auto;
        }
        .table-content::-webkit-scrollbar{
            width: 4px;
        }
        .table-content::-webkit-scrollbar-thumb{
            border-radius: 10px;
            -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
            background: rgba(0,0,0,0.2);
        }
        .table-content::-webkit-scrollbar-track{
            -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
            border-radius: 0;
            background: rgba(0,0,0,0.1);
        }
        .el-table td:first-child, .el-table th:first-child{
            text-align: left;
        }
        .el-table td, .el-table th{
            text-align: right;
            color: #fff;
        }
        .el-table--border td:first-child .cell, .el-table--border th:first-child .cell, .el-table .cell, .el-table th div{
            padding: 0px 0.5rem;
        }
        .el-table--enable-row-transition .el-table__body td{
            transition: none;
            font-size: 0.8rem;
            span{
                font-size: 0.8rem;
            }
            div{
                font-size: 0.8rem;
            }
        }
        
    }
    .options.ldp{
        .item.opt{
            .opt-content{
                white-space: nowrap;
                .table-item:nth-child(1){
                    width: 4rem;
                }
                .table-item:nth-child(2){
                    width: 3rem;
                }
                .table-item:nth-child(3){
                    width: 4rem;
                }
                .table-item:nth-child(4){
                    width: 15rem;
                }
            }
        }
    }
</style>


