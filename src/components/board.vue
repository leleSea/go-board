<template>
    <div class="main" ref="main">
        <div class="board-pre" :style="pre.css" v-show="pre.active"> 
            <!-- <span class="txt">{{pre.txt | winrate0}}</span> -->
            <!-- {{pre.txt | winrate}} -->
        </div>
        <div class="board" :id="boardIdCul" ref="boardCom" @contextmenu.prevent="boardMouseRight">
            <!-- <div class="video-box">
                <video src="../assets/video/v1.mp4" controls></video>
            </div> -->
        </div>
        <div class="stone-label hidden" id="stoneBox">
        </div>
        <!-- 上传棋谱 -->
        <leConfirm ref="uploadSgfBox">
            <template v-slot:message>
                <div class="upload-sgf-box">
                    <div class="upload-title">
                        <span class="txt">打开本地棋谱</span>
                        <div class="upload-small-title">
                            <span class="txt">{{`请上传后缀为：${GLOBAL.getLoadFileTypeTxt()}的文件`}}</span>
                        </div>
                    </div>
                    <div class="upload-sgf-body">
                        <input type="file" hidden ref="loadSgf" id="loadSgfBtn" @change="selectedFile">
                        <div class="upload-item content">
                            <el-tooltip placement="top-start" effect="light" :content="'请上传后缀为：.sgf 的文件'">
                                <el-input type="text" v-model="loadSgfData.name" disabled></el-input>
                            </el-tooltip>
                        </div>
                        <div class="upload-item btn">
                            <el-button class="menu-selected-bcg" onClick="loadSgfBtn.click()">
                                <span class="txt">选择</span>
                            </el-button>
                        </div>
                    </div>
                    
                </div>
            </template>
        </leConfirm>
        <!-- 下载棋谱-弹出框 -->
        <le-confirm ref="downloadSgfPanel">
            <template v-slot:message>
                <div class="download-sgf-box">
                    <div class="upload-title">
                        <span class="txt">保存到本地</span>
                    </div>
                    <table class="down-load-table"> 
                        <tr>
                            <td>
                                <span class="txt">文件名</span>
                            </td>
                            <td colspan="5">
                                <div class="file-name">
                                    <el-input v-model="sgfInfoTemplate.fileName.value"></el-input>
                                    <span class="txt">.sgf</span>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <span class="txt">棋谱</span>
                            </td>
                            <td colspan="5">
                                <el-input v-model="sgfInfoTemplate.gn.value"></el-input>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <span class="txt">黑方</span>
                            </td>
                            <td>
                                <el-input v-model="sgfInfoTemplate.pb.value"></el-input>
                            </td>
                            <td>
                                <span class="txt">黑方段位</span>
                            </td>
                            <td>
                                <el-input v-model="sgfInfoTemplate.br.value"></el-input>
                            </td>
                            <td>
                                <span class="txt">黑方代表队</span>
                            </td>
                            <td>
                                <el-input v-model="sgfInfoTemplate.bt.value"></el-input>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <span class="txt">白方</span>
                            </td>
                            <td>
                                <el-input v-model="sgfInfoTemplate.pw.value"></el-input>
                            </td>
                            <td>
                                <span class="txt">白方段位</span>
                            </td>
                            <td>
                                <el-input v-model="sgfInfoTemplate.wr.value"></el-input>
                            </td>
                            <td>
                                <span class="txt">白方代表队</span>
                            </td>
                            <td>
                                <el-input v-model="sgfInfoTemplate.wt.value"></el-input>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <span class="txt">贴目</span>
                            </td>
                            <td>
                                <el-input v-model="sgfInfoTemplate.km.value"></el-input>
                            </td>
                            <td>
                                <span class="txt">让子</span>
                            </td>
                            <td>
                                <el-input v-model="sgfInfoTemplate.ha.value"></el-input>
                            </td>
                            <td>
                                <span class="txt">结果</span>
                            </td>
                            <td>
                                <el-input v-model="sgfInfoTemplate.re.value"></el-input>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <span class="txt">赛事</span>
                            </td>
                            <td>
                                <el-input v-model="sgfInfoTemplate.ev.value"></el-input>
                            </td>
                            <td>
                                <span class="txt">地址</span>
                            </td>
                            <td>
                                <el-input v-model="sgfInfoTemplate.pc.value"></el-input>
                            </td>
                            <td class="visibility-hidden">
                            </td>
                            <td class="visibility-hidden">
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <span class="txt">日期</span>
                            </td>
                            <td>
                                <el-input v-model="sgfInfoTemplate.dt.value"></el-input>
                            </td>
                            <td>
                                <span class="txt">比赛用时</span>
                            </td>
                            <td>
                                <el-input v-model="sgfInfoTemplate.tm.value"></el-input>
                            </td>
                            <td>
                                <span class="txt">回合</span>
                            </td>
                            <td>
                                <el-input v-model="sgfInfoTemplate.ro.value"></el-input>
                            </td>
                        </tr>
                    </table>
                </div>
            </template>
        </le-confirm>
        <!-- <sgf ref="sgf" v-on:takeFun="takeFun"></sgf> -->
    </div>
    
</template>

<script>
import board from '../board.js'
import FileServer from '../FileSaver.js'
// import sgf from './sgf.vue'
import sgfUti from '@/utility/sgf'

const __URL = window.location.href
export default {
    name: 'board',
    props: {
        specStoneLabel: String,
        minNum: Number,
        size: {
            type: Number,
            default: 19
        },
        boardId: String,
        stoneToLocal: Boolean,
        coor: Number,
        areaSelected: Boolean,
        branchPlaySelected: Boolean,
        tryPlaySelected: Boolean,
        splitBranchSelected: Boolean,
        optionsSpecCheck: Boolean,
        propSelected: Boolean,
        mouseRightSpecCheck: String,
        enterState: String,
        keyboardLose: Boolean,
        modal: {
            type: String,
            default: 'normal'
        }
    },
    filter: {
        preFilter(val){
            val = val * 100
            val = val.toFixed(0)
            return val
        }
    },
    data(){
        return {
            _sgfUti: null,
            sgfInfoTemplate: {
                fileName: {
                    value: '',
                    label: '文件名'
                },
                st: {
                    value: '起始手数',
                    label: 0
                }
            },
            sgfInfo: {},
            downloadSgfData: {
                active: false
            },
            stoneImg: [
                {img: 'https://assets.19x19.com/img/stb1.png', ref: 'b1', c: 1},
                {img: 'https://assets.19x19.com/img/stb2.png', ref: 'b2', c: 1},
                {img: 'https://assets.19x19.com/img/stb3.png', ref: 'b3', c: 1},
                {img: 'https://assets.19x19.com/img/stb4.png', ref: 'b4', c: 1},
                {img: 'https://assets.19x19.com/img/stw1.png', ref: 'w1', c: -1},
                {img: 'https://assets.19x19.com/img/stw2.png', ref: 'w2', c: -1},
                {img: 'https://assets.19x19.com/img/stw3.png', ref: 'w3', c: -1},
                {img: 'https://assets.19x19.com/img/stw4.png', ref: 'w4', c: -1},
                {img: 'https://assets.19x19.com/img/stw5.png', ref: 'w5', c: -1},
                {img: 'https://assets.19x19.com/img/stw6.png', ref: 'w6', c: -1},
                {img: 'https://assets.19x19.com/img/stw7.png', ref: 'w7', c: -1},
                {img: 'https://assets.19x19.com/img/stw8.png', ref: 'w8', c: -1},
                {img: 'https://assets.19x19.com/img/stw9.png', ref: 'w9', c: -1},
                {img: 'https://assets.19x19.com/img/stw10.png', ref: 'w10', c: -1},
                {img: 'https://assets.19x19.com/img/stw11.png', ref: 'w11', c: -1},
            ],
            assetsUrl: (__URL.indexOf('localhost') > -1 ? this.GLOBAL.assetsUrlS : this.GLOBAL.assetsUrl),
            stoneImgList: {
                black: [
                    `${this.GLOBAL.assetsUrl}/img/stb1.png`,
                    `${this.GLOBAL.assetsUrl}/img/stb2.png`,
                    `${this.GLOBAL.assetsUrl}/img/stb3.png`,
                    `${this.GLOBAL.assetsUrl}/img/stb4.png`,
                    
                ],
                white: [
                    `${this.GLOBAL.assetsUrl}/img/stw1.png`,
                    `${this.GLOBAL.assetsUrl}/img/stw2.png`,
                    `${this.GLOBAL.assetsUrl}/img/stw3.png`,
                    `${this.GLOBAL.assetsUrl}/img/stw4.png`,
                    `${this.GLOBAL.assetsUrl}/img/stw5.png`,
                    `${this.GLOBAL.assetsUrl}/img/stw6.png`,
                    `${this.GLOBAL.assetsUrl}/img/stw7.png`,
                    `${this.GLOBAL.assetsUrl}/img/stw8.png`,
                    `${this.GLOBAL.assetsUrl}/img/stw9.png`,
                    `${this.GLOBAL.assetsUrl}/img/stw10.png`,
                    `${this.GLOBAL.assetsUrl}/img/stw11.png`,
                ]
            },
            computer: 0,
            pre: {
                css: {
                    left: null,
                    top: null,
                },
                txt:null,
                active: false,
                
            },
            preData: [],
            jumpToTem: {
                active: false
            },
            loadSgfData: {
                active: false,
                winrate: false,
                name: null,
                file: null,
                area: {
                    value: [0, 0],
                    min: 0,
                    max: 0
                },
                error: null
            },
            keyCodeFunList: {
                '13': {fun: 'playFirstPoint', params: 'enter'}, //enter,
                '27': {fun: 'optionsLockOff'}, //ESC,
                '32': {fun: 'playFirstPoint'}, //空格,
                // '33': {fun: 'jumpToBykeyboard', params: '-5'}, //pageUp,
                // '34': {fun: 'jumpToBykeyboard', params: '5'}, //pageDown,
                // '35': {fun: 'jumpToBykeyboard', params: 'l'}, //end,
                // '36': {fun: 'jumpToBykeyboard', params: 's'}, //home,
                '33': {fun: 'pageUpSet', params: '-5'}, //pageUp,
                '34': {fun: 'pageDownSet', params: '5'}, //pageDown,
                '35': {fun: 'endSet', params: 'l'}, //end,
                '36': {fun: 'homeSet', params: 's'}, //home,
                // '37': {fun: 'jumpToBykeyboard', params: '-1'}, //方向键左
                '37': {fun: 'leftSet', params: '-1'}, //方向键左
                '38': {fun: 'lockBranchJumpBykeyboard', params: '-1'}, //方向键上
                // '39': {fun: 'jumpToBykeyboard', params: '1'}, //方向键右,
                '39': {fun: 'rightSet', params: '1'}, //方向键右,
                '40': {fun: 'lockBranchJumpBykeyboard', params: '1'}, //方向键下,
                '48': '', //数字键0
                '49': {fun: 'lockBranchBykeyboard', params: 1}, //数字键1
                '50': {fun: 'lockBranchBykeyboard', params: 2}, //数字键2
                '51': {fun: 'lockBranchBykeyboard', params: 3}, //数字键3
                '52': {fun: 'lockBranchBykeyboard', params: 4}, //数字键4
                '53': {fun: 'lockBranchBykeyboard', params: 5}, //数字键5
                '54': {fun: 'lockBranchBykeyboard', params: 6}, //数字键6
                '55': {fun: 'lockBranchBykeyboard', params: 7}, //数字键7
                '56': {fun: 'lockBranchBykeyboard', params: 8}, //数字键8
                '57': {fun: 'lockBranchBykeyboard', params: 9}, //数字键9
                // ''
            },
            buttonStatusList: [
                {'off': 'areaOff', check: 'areaSelected'},
                {'off': 'branchOff', check: 'branchPlaySelected'},
                {'off': 'tryPlayOff', check: 'tryPlaySelected'},
                {'off': 'splitBranchCon', check: 'splitBranchSelected'},
                {'off': 'propOff', check: 'propSelected'},
            ],
            stVal: 0,
        }
    },
    methods: {
        // async getDom(domRef){
        //     let dom = await setTimeout(() => {
        //         return this.$refs[domRef]
        //     }, 500);
        //     return dom
        // },
        getDom(domRef, callback){
            setTimeout(() => {
                callback(this.$refs[domRef])
            }, 500)
        },
        playLastNumCheck(x, y){
            let step = this.board.step
            let p = this.board.position
            if(this.isInStone(x, y) && step[p].x == x && step[p].y == y){
                this.$emit('takeFun', {
                    fun: 'jumpTo',
                    data: -1
                })
            }
        },
        isInStone(x, y){
            let stone = this.board.stone
            return stone[this.board.coor2to1(x, y)] != 0
        },
        play(x, y){
            let status = this.playAction(x, y)
            if(!status) return
            this.playCallEngine(x, y)
            return status
        },
        boardStepCheck(){
            let {step} = this.board
            step = this.GLOBAL.deepCopy(step)
            step = step.splice(0, Number(this.board.position) + 1)
            return this.GLOBAL.sgfLengthCheckSync(step)
        },
        playAction(x, y){
            let color = this.board.now ==1? 'B': 'W'
            let sta = this.boardStepCheck()
            if(!sta) return false
            let status = this.board.playByclick(x, y)
            if(!status){
                this.playLastNumCheck(x, y)
                return status
            }
            let position = this.board.position
            this.posHasChanged()
            let coor = this.board.coorNtoS(x, y)
            return status
        },
        playCallEngine(x, y){
            let color = this.board.now ==1? 'B': 'W'
            let position = this.board.position
            let coor = this.board.coorNtoS(x, y)
            this.$emit('takeFun', {
                fun: 'play',
                data: {
                    color: color,
                    move: coor.x + coor.y,
                    position: position
                }
            })
        },
        markon(x,y,type){
            let position = this.board.position
            let coor = this.board.coorNtoS(x, y)
            this.board.markon(x,y,type)
            this.$emit('takeFun', {
                fun: 'markon',
                data: {
                    type: type,
                    move: coor.x + coor.y,
                    position: position
                }
            })
        },
        playBySync(x, y){
            let status = this.board.playBySync(x, y)
            this.posHasChanged()
        },
        genmoveHandle(move){
            if(move == -1 || move == '-1'){
                this.board.passByClick()
            }else{
                let coor = this.board.coor1to2(Number(move))
                if(!this.board.isInBoard(coor.x, coor.y)) return false
                this.board.playByclick(coor.x, coor.y)
            }
            this.posHasChanged()
            return true
        },
        stoneOver(x, y, c){
            this.boardEnterEvent = true
            this.board.stoneOver(x, y, c)
            // this.preCheck(x, y)
            // this.$emit('takeFun', {
            //     fun: 'boardPrecheck',
            //     data: {x: x, y: y}
            // })
            // this.$emit('takeFun', {
            //     fun: 'boardEnter',
            //     data: {x: x, y: y}
            // })
        },
        getCurrectCoor(x, y){
            let radius = this.board.board.stoneRadius
            let canvas = document.querySelector(`#${this.boardIdCul} canvas`)
            let p = canvas.offsetWidth / canvas.width
            return {
                x: this.board.getX(x) * p,
                y: this.board.getX(y) * p - radius,
            }
        },
        preActiveCheck(x, y){
            if(!this.board.isInBoard(x, y)) return
            if(this.board.area.active) return true
            if(this.board.prop.active) return true
            if(this.board.spotlight.active) return true
            this.pre.active = false
            return false
        },
        preCheck(x, y){
            if(!this.preActiveCheck()) return
            let txt = this.preData[this.board.coor2to1(x, y)]
            if(!txt){
                this.pre.active = false
                return
            }
            let coor = this.getCurrectCoor(x, y)
            this.pre = {
                css: {
                    top: (coor.y - 25) + 'px',
                    left: (coor.x - 25) + 'px'
                },
                txt: this.preData[this.board.coor2to1(x, y)],
                active: true
            }
        },
        changeLabel(label){
            this.board.changeLabel(label)
            this.GLOBAL.setItem({
                stoneLabel: this.board.stoneLabel
            })
        },
        boardSyncForJump(){
            let jumpToTem = this.GLOBAL.copy(this.jumpToTem)
            let stone = this.GLOBAL.copy(this.board.stone)
            let position = this.board.position
            stone = JSON.stringify(stone)
            if(stone == JSON.stringify(jumpToTem.stone) && position == jumpToTem.position) return
            if(position == 0){
                this.$emit('takeFun', {
                    fun: 'engineClearBoard',
                    data: ''
                })
                return
            }
            position > jumpToTem.position ? this.jumpToPlay() : this.jumpToBack()
            
        },
        back(num){
            this.board.back(num)
            this.posHasChanged()
        },
        backSync(num){
            this.board.backSync(num)
            this.posHasChanged()
        },
        jumpToBack(){
            let jumpToTem = this.GLOBAL.copy(this.jumpToTem)
            let step = this.GLOBAL.copy(this.board.step)
            let position = this.board.position
            let nstep = step.splice(Number(position) + 1, jumpToTem.position - position)
            // this.$emit('takeFun', {
            //     fun: 'jumpToBack',
            //     data: nstep.length
            // })
            this.$emit('takeFun', {
                fun: 'jumpToGoto',
                data: this.board.position
            })
        },
        jumpToPlay(){
            let jumpToTem = this.GLOBAL.copy(this.jumpToTem)
            let step = this.GLOBAL.copy(this.board.step)
            let position = this.board.position
            let nstep = step.splice(Number(jumpToTem.position) + 1, position - jumpToTem.position)
            let playData = [], move
            let p = Number(jumpToTem.position) + 1
            for(var i in nstep){
                if(nstep[i].x == -1 || nstep[i].y == -1) 
                    move = {
                        x: 'pass',
                        y: ''
                    }
                else
                    move = this.board.coorNtoS(nstep[i].x, nstep[i].y)
                playData.push({
                    color: nstep[i].c == 1 ? 'B' : 'W',
                    move: move.x + move.y,
                    position: p
                })
                p++
            }
            this.$emit('takeFun', {
                fun: 'jumpToPlay',
                data: playData
            })
        },
        jumpTo(p){
            this.jumpToTem = {
                stone: this.GLOBAL.copy(this.board.stone),
                position: this.board.position
            }
            this.board.jumpTo(p)
            this.posHasChanged()
            this.boardSyncForJump()
        },
        jumpToBykeyboard(p){
            this.$emit('takeFun', {
                fun: 'jumpTo',
                data: p
            })
        },
        async pass(){
            
            let res = await this.passConfirm()
            if(!res) return false
            let color = this.board.now == 1 ? 'B': 'W'
            return this.passAction()
            // this.$emit('takeFun', {
            //     fun: 'passPlay',
            //     data: {
            //         color: color,
            //         move: 'pass'
            //     }
            // })
        },
        passAction(){
            let sta = this.boardStepCheck()
            if(!sta) return false
            this.board.passByClick()
            this.posHasChanged()
            return true
        },
        async passConfirm(){
            let step = this.board.step
            let position = this.board.position
            let message = '确定要停一手吗？'
            let button = [
                {name: '确定', label: 0},
                {name: '取消', label: 1, type: 'cancel'},
            ]
            let lastStep = step[position]
            let f = (position > 0 && lastStep.x == -1 && lastStep.y == -1)
            if(f){
                message = '禁止连续“停一手”，是否回退？'
                button[0].name = '回退'
            }
            let res = await this.GLOBAL.leConfirm.default.open({
                message: message,
                button: button
            })
            res = res || {}
            if(res.label != 0) return false
            if(f){
                if(step.length - 1 != position) this.board.checkPosition()
                this.back(1)
                this.$emit('takeFun', {
                    fun: 'syncBoard'
                })
                return false
            }
            return true
            
        },
        jumpToByCoor(x, y){
            let step = this.board.step, pos = null, position = this.board.position
            // for(var i = step.length - 1; i >= 0; i--){
            //     if(step[i].x == x && step[i].y == y){
            //         pos = i
            //     }
            // }
            for(var i = position; i >= 0; i--){
                if(step[i].x == x && step[i].y == y){
                    pos = i
                    break
                }
            }
            if(pos == null || pos == this.board.position) return
            // this.jumpToBypos(pos)
            this.jumpTo(this.getCurentPosDel(pos))
        },
        getCurentPosDel(p){
            let position = p - this.board.position
            if(p == 0) position = 's'
            if(p == this.board.step.length - 1) position = 'l'
            return position
        },
        jumpToByposRange(p){
            // let position = p - this.board.position
            // if(p == 0) position = 's'
            // if(p == this.board.step.length - 1) position = 'l'
            this.jumpTo(this.getCurentPosDel(p))
            // this.board.jumpToByposRange({
            //     removeAll: !this.board.tryPlayData.active,
            //     position: p
            // })
            // this.posHasChanged()
            // this.boardSyncForJump()
            // this.jumpToTem.active = false
        },
        jumpToBypos(p){
            // this.jumpToTem = {
            //     stone: this.GLOBAL.copy(this.board.stone),
            //     position: this.board.position
            // }
            this.board.jumpToBypos({
                removeAll: !this.board.tryPlayData.active,
                position: p
            })
            this.posHasChanged()
            this.boardSyncForJump()
            this.jumpToTem.active = false
        },
        jumpToByposInput(p){
            if(!this.jumpToTem.active && this.board){
                this.jumpToTem = {
                    stone: this.GLOBAL.copy(this.board.stone),
                    position: this.board.position,
                    active: true
                }
            }
            if(this.board){
                this.board.jumpToBypos({
                    removeAll: !this.board.tryPlayData.active,
                    position: p
                })
            }
        },
        posHasChanged(){
            // let options = {
            //     position: this.board.position,
            //     step: this.board.step.length - 1,
            //     tryPlay: this.board.tryPlayData.active
            // }
            let options = this.board.posHasChanged()
            // this.playStoneCheck()
            this.$emit('update', options)
            
        },
        tryPlayCon(){
            this.board.tryPlayCon()
            this.posHasChanged()
        },
        tryPlayOpen(opt, params){
            this.board.tryPlayOpen(opt)
            this.posHasChanged()
            this.tryPlayOpenAfter(params)
        },
        tryPlayClose(){
            this.board.tryPlayClose()
            this.posHasChanged()
            this.$emit('takeFun', {
                fun: 'clearStatusForTryPlay'
            })
        },
        tryPlayOpenAfter(params){
            params = params || {}
            if(params.source == 'play') return
            let moves = []
            if(this.board.branch.active) moves = this.board.branch.data
            this.$emit('takeFun', {
                fun: 'clearStatusForTryPlay'
            })
            // this.$nextTick(() => {
            //     if(this.$store.state.engine_id){
            //         this.$emit('takeFun', {
            //             fun: 'playByTryPlay',
            //             data: moves
            //         })
            //     }else{
            //         this.board.branchPlaySet = true
            //         for(var i in moves){
            //             let coor = this.board.coor1to2(moves[i])
            //             this.$emit('takeFun', {
            //                 fun: 'playByTryPlay',
            //                 data: coor
            //             })
            //         }
            //         let voice = this.GLOBAL.getBranchVoice(moves)
            //         this.board.branchVoicePlay(voice.num)
            //     }
            // })
            this.$nextTick(() => {
                // this.$emit('takeFun', {
                //     fun: 'playByTryPlay',
                //     data: moves
                // })
                this.playBranch(moves)
            })
            
        },
        clearBoard(){
            if(!this.board) return 
            this.board.clearBoard()
            this.sgfInfoClear()
            this.posHasChanged()
        },
        changeCoor(n){
            this.board.changeCoor(n)
        },
        parseSgfFile(fileData, type){
            let sgfData = this.board.parseSgfFile(fileData, type)
            return sgfData
        },
        loadSgf(sgfData, callStep, opt){
            if(!this.GLOBAL.sgfLengthCheckSync(sgfData)) return
            let f = this.board.loadSgf(sgfData, callStep, opt)
            this.posHasChanged()
            return f
        },
        downloadSgf(options){
            return this.board.downloadSgf(options)
        },
        areaOn(opt, color){
            let data = this.board.areaOn(opt, color)
            this.preData = data
        },
        areaOff(){
            if(!this.board || !this.board.area.active) return
            this.preData = []
            return this.board.areaOff()
        },
        propOn(opt){
            let per = this.board.propOn(opt)
            // this.preData = per
        },
        propOff(){
            this.board.propOff()
        },
        propOnPlay(opt){
            this.board.propOnPlay(opt)
        },
        spotlightOn(opt){
            let per = this.board.spotlightOn(opt)
            // this.preData = per
        },
        spotlightOff(){
            let per = this.board.spotlightOff()
        },
        stoneImgHandle(index, callback){
            if(!this.stoneImg[index]){
                callback()
                return
            }
            index = index || 0
            let img = document.createElement('img')
            img.src = this.stoneImg[index].img
            document.getElementById('stoneBox').appendChild(img)
            img.onload = () => {
                if(this.stoneImg[index].c == 1){
                    this.board.board.blackStoneGraphic.push(img)
                }else{
                    this.board.board.whiteStoneGraphic.push(img)
                }
                index++
                this.stoneImgHandle(index, callback)
            }
        },
        removeOutline(){
            this.boardEnterEvent = false
            this.board.removeOutline()
            this.pre.active = false
        },
        getNeedPlayMove(moves){
             let step = this.GLOBAL.copy(this.board.step)
            step.shift()
            let data = [], coor
            for(var i in step){
                coor = null
                if(moves[i]){
                    coor = this.board.splitGtp(moves[i])
                }
                if(coor && coor.x == step[i].x && coor.y == step[i].y) continue
                data.push(moves[i])
            }
        },
        parseMoves(moves){
            let data = [], coor
            for(var i in moves){
                if(!moves[i]) continue
                coor = this.board.splitGtp(moves[i])
                data.push(this.board.coor2to1(coor.x, coor.y))
            }
            return data
        },
        boardIsSame(moves){
            let step = this.GLOBAL.copy(this.board.step)
            step.shift()
            let data = this.getNeedPlayMove(moves)
            return data
        },
        historySunc(moves){
            if(!moves.length) return
            let data = this.getNeedPlayMove(moves)
        },
        historyInit(moves){
            moves = this.parseMoves(moves)
            let movesSitu = this.board.getSituation()
            let movesStr = moves.join(',')
            if(movesStr == movesSitu){
                return
            }
            this.loadSgf(moves)
        },
        boardInit(moves){
            if(!moves || moves.length == 0){
                this.board.clearBoard()
                return true
            }
            return this.loadSgf(moves)
        },
        branchOn(moves){
            this.board.branchOn(moves)
            // this.board.branch.active = true
            this.$emit('takeFun', {
                fun: 'branchVarUpdate',
            })
        },
        branchOff(){
            if(!this.board || this.board.branch.active == false) return
            this.board.branchOff()
            this.$emit('takeFun', {
                fun: 'branchVarUpdate',
            })
        },
        refreshArea(){
            if(!this.board.area.active) return
            this.$emit('takeFun', {
                fun: 'areaOn',
                data: null
            })
        },
        propRefresh(opt){
            if(!this.board.prop.active) return
            if(!opt){
                this.$emit('takeFun', {
                    fun: 'propOn',
                    data: null
                })
                return
            }
            this.propOn(opt)
        },
        refreshBoardSe(){
            this.refreshArea()
        },
        playBranch(moves){
            
            this.$emit('takeFun', {
                fun: 'branchOff'
            })
            // this.$emit('takeFun', {
            //     fun: 'loadSgfCheck'
            // })
            let coor, data = [], move
            let position = this.board.position
            let tryPlayCheck = false
            position++
            this.board.branchPlaySet = true
            for(var i in moves){
                
                coor = this.board.coor1to2(moves[i])
                move = this.board.coorNtoS(coor.x, coor.y)
                data.push({
                    color: this.board.now == 1? 'B': 'W',
                    move: move.x + move.y,
                    position: position
                })
                if(!this.loadSgfPlayCoorCheck(coor.x, coor.y)){
                    this.$emit('takeFun', {
                        fun: 'jumpTo',
                        data: 1
                    })
                }else{
                    if(!tryPlayCheck){
                        this.$emit('takeFun', {
                            fun: 'loadSgfCheck'
                        })
                        tryPlayCheck = true
                    }
                    if(coor.x == -1 || coor.y == -1){
                        // this.board.passByClick()
                        this.board.passByClick()
                    }else{
                        // this.board.playByclick(coor.x, coor.y)
                        this.board.playByclick(coor.x, coor.y, {noneVoice: true})
                    }
                }
                position++
            }
            let voice = this.GLOBAL.getBranchVoice(data)

            this.board.branchVoicePlay(voice.num)
            this.$emit('takeFun', {
                fun: 'playBranchEngine',
                data: data
            })
            this.posHasChanged()
        },
        areaPlayCheck(){
            if(!this.board.area.active) return
            this.board.clearArea()
            this.preData = []
        },
        propPlayCheck(){
            if(!this.board.prop.active) return
            this.board.clearProp()
            this.preData = []
        },
        branchPlayCheck(){
            if(!this.branch.active) return
            this.board.clearBranch()
        },
        playStoneCheck(){
            this.areaPlayCheck()
            this.propPlayCheck()
        },
        handicapHandle(moves){
            if(!moves.length) return
            let rm = [], now = 1, coor
            let gtp = []
            let position = Number(this.board.position) + 1
            for(var i in moves){
                coor = this.board.coor1to2(moves[i])
                coor = this.board.coorNtoS(coor.x, coor.y)
                rm.push(moves[i])
                rm.push(-1)
                gtp.push({
                    color: 'B',
                    move: coor.x + coor.y,
                    position: position
                })
                position++
                gtp.push({
                    color: 'W',
                    move: 'pass',
                    position: position
                })
                position++
            }
            rm.splice(rm.length - 1, 1)
            gtp.splice(gtp.length - 1, 1)
            this.board.loadSgf(rm)
            return gtp
        },
        getBoardGtp(){
            return this.board.getBoardGtp()
        },
        getSetMovesData(p){
            return this.board.getSetMovesData(p)
        },
        getSetMovesDataLdp(p, orMoves){
            return this.board.getSetMovesDataLdp(p, orMoves)
        },
        getBoardGtpWithColor(p){
            return this.board.getBoardGtpWithColor(p)
        },
        getStep(){
            return this.GLOBAL.copy(this.board.step)
        },
        branchByMove(x, y, data){
            if(data && data.x == x && data.y == y) return data
            if(!this.board.prop.active) return false
            if(!this.board.isInBoard(x, y)) return false
            // if(data && data.x == x && data.y == y) return data
            let prop = this.board.prop.draw
            let flag = false, re = null
            for(var i in prop){
                if(prop[i].x == x && prop[i].y == y){
                    flag = true
                    re = this.GLOBAL.copy(prop[i])
                    break
                }
            }
            // return flag
            return re
        },
        branchByMovePlay(x, y, data){
            if(!this.board.prop.active) return false
            if(!this.board.isInBoard(x, y)) return false
            if(data && data.x == x && data.y == y) return data
            // let prop = this.board.prop.draw
            let branch = this.board.branch.data
            let flag = false, re = null
            for(var i in branch){
                if(branch[i].x == x && branch[i].y == y){
                    flag = true
                    re = this.GLOBAL.copy(prop[i])
                    break
                }
            }
            // return flag
            return re
        },
        //终局数子
        gameJudgeOn(data){
            return this.board.gameJudgeOn(data)
        },
        gameJudgeOnEngine(data){
            return this.board.gameJudgeOnEngine(data)
        },
        gameJudgeOff(){
            this.board.gameJudgeOff()
        },
        gameJudgeOnPlay(data){
            return this.board.gameJudgeOnPlay(data)
        },
        gameJudgeOffPlay(){
            this.board.gameJudgeOffPlay()
        },
        pageSizeChange(){
            let ele = document.querySelector(`#${this.boardIdCul} .wgo-board canvas`)
            if(!ele) return
            let width = ele.offsetWidth
            if(width < 800){
                width = 800
            }
            this.board.board.setWidth(width)
            this.board.board.setHeight(width)
        },
        getSituation(p){
            if(!this.board) return ''
            return this.board.getSituation(p)
        },
        getSituationForClass(p){
            return this.board.getSituationForClass(p)
        },
        getSituationGtp(p, c){
            return this.board.getSituationGtp(p, c)
        },
        timeRead(second, data, color){
            // if(second % 1000 != 0) return
            // second =  parseInt(second / 1000)
            if(second > this.GLOBAL.readSecondNum){
                this.timeReadReset()
                return
            }
            this.board.timeRead(second, data, color)
        },
        timeReadReset(){
            this.board.timeReadReset()
        },
        timeReadClear(coor){
            this.board.timeReadClear(coor)
        },
        readStart(){
            this.board.readStart()
        },
        timeoutRead(){
            this.board.timeoutRead()
        },
        readLast(num){
            this.board.readLast(num)
        },
        readGameStart(){
            this.board.readGameStart()
        },
        loadSgfOn(loadWaitCallback){
            this.loadWaitCallback = loadWaitCallback
            this.loadSgfData.active = true
            this.$emit('takeFun', {
                fun: 'timeStop'
            })
        },
        loadSgfOff(){
            if(document.querySelector('#loadSgfBtn')){
                document.querySelector('#loadSgfBtn').value = ''
            }
            this.loadSgfData.file = null
            this.loadSgfData.area.min = 0
            this.loadSgfData.area.max = 0
            this.loadSgfData.winrate = false
            this.loadSgfData.name = null
            this.loadSgfData.active = false
            // this.loadSgfData.sgfId = null
            // this.loadSgfData.info = null
        },
        loadSgfCancel(){
            this.loadSgfOff()
            this.$emit('takeFun', {
                fun: 'timeContinue'
            })
        },
        selectedFile(e){
            let file = e.target.files[0]
            let postfix = file.name.substring(file.name.lastIndexOf('.') + 1, file.name.length)
            postfix = postfix.toLowerCase()
            if(!this.GLOBAL.checkLoadSgfSuffix(file.name)){
                let type = this.GLOBAL.getLoadFileTypeTxt()
                this.errorNotice('请上传正确的文件，文件后缀为：' + type)
                return
            }
            if(!this[`parse_${postfix}`]) return
            this[`parse_${postfix}`](e)
            
        },
        async loadSgfConfirmCheck(){
            if(!this.loadWaitCallback) return true
            return this.loadWaitCallback(this.loadSgfData)
        },
        loadSgfConfirm(opt){
            if(!this.loadSgfData.file){
                this.loadSgfData.active = false
                let type = this.GLOBAL.getLoadFileTypeTxt()
                this.errorNotice('请上传正确的文件，文件后缀为：' + type)
                return
            }
            opt = opt || {}
            this.loadSgfConfirmCheck().then(r => {
                if(!r) return this.loadSgfOff()
                let stepOld = this.board.getStepString()
                this.board.tryPlayClose()
                let res = this.loadSgf(this.loadSgfData.sgfData)
                this.GLOBAL.saveSgfInfo(this.loadSgfData.sgfInfo)
                this.loadSgfOff()
                this.sgfInfoTemplate = this.GLOBAL.deepCopy(this.loadSgfData.sgfInfo)
                this.sgfLoadDataSet()
                let stepNew = this.board.getStepString()
                this.loadSgfData.stepNew = stepNew
                this.loadSgfData.stepOld = stepOld
                for(var i in opt){
                    this.loadSgfData[i] = opt[i]
                }
                this.$emit('takeFun', {
                    fun: 'loadSgfConfirm',
                    data: this.loadSgfData
                })
            })
        },
        getSgfInfo(info){
            info = info || {}
            let sgfInfo = this.GLOBAL.deepCopy(this.GLOBAL.sgfInfo)
            for(var i in sgfInfo){
                if(info[i] !== undefined){
                    sgfInfo[i].value = info[i]
                }
            }
            return sgfInfo
        },
        selectedFileHandle(sgfData){
            if(!sgfData || !sgfData.normal) return
            this.loadSgfData.area.min = 1
            this.loadSgfData.area.max = sgfData.normal.length
            this.loadSgfData.area.value = [1, sgfData.normal.length]
            // let sgfInfo = this.GLOBAL.deepCopy(this.sgfInfo)
            let sgfInfo = this.GLOBAL.deepCopy(this.GLOBAL.sgfInfo)
            let fileInfo = sgfData.info
            this.loadSgfData.info = this.GLOBAL.deepCopy(sgfData.info)
            for(var i in sgfInfo){
                if(fileInfo[i]){
                    sgfInfo[i].value = fileInfo[i]
                }
            }
            sgfInfo.fileName = {label: '文件名', value: ''}
            sgfInfo.fileName.value = this.fileNameFilter(this.loadSgfData.name)
            // this.sgfInfo = sgfInfo
            this.loadSgfData.sgfData = sgfData.normal
            this.loadSgfData.gtp = sgfData.gtp
            this.loadSgfData.sgfInfo = sgfInfo
            this.loadSgfData.sgfUsernameDefine = sgfData.sgfUsernameDefine
            this.loadSgfData.dataType = sgfData.dataType
            this.loadSgfData.sgfId = sgfData.sgfId || null
            this.engineDataHandle(sgfData)
        },
        engineDataHandle(data){
            let loadSgfData = this.loadSgfData || {}
            if(data.dataType != 'engineBoard') return
            loadSgfData.engineData = {
                area: data.area,
                branch: data.branch,
                data: data.data,
                folder: data.folder,
                createTime: data.createTime,
                // moves: data.moves,
                name: data.name,
                username: data.username,
                dataType: 'engineData',
            }
            this.loadSgfData = loadSgfData
        },
        loadSgfByInside(sgfData, opt){
            this.loadSgfData.file = (sgfData.info.gn || 'Golaxy') + '.sgf'
            this.loadSgfData.name = (sgfData.info.gn || 'Golaxy') + '.sgf'
            // this.loadSgfData.sgfId = sgfData.sgfId || null
            this.selectedFileHandle(sgfData)
            this.loadSgfConfirm(opt)
        },
        fileSuffixGet(filename){
            return filename.substring(filename.lastIndexOf('.') + 1, filename.length)
        },
        fileNameFilter(filename){
            return filename.substring(0, filename.lastIndexOf('.'))
        },
        sgfInfoInit(){
            let sgfInfo = this.GLOBAL.deepCopy(this.GLOBAL.sgfInfo)
            sgfInfo.km.label = sgfInfo.km.label
            sgfInfo.fileName = {label: '文件名', value: ''}
            // if(this.$store.state.sgfInfo){
            //     sgfInfo = this.$store.state.sgfInfo
            //     try{
            //         sgfInfo = JSON.parse(this.$store.state.sgfInfo)
            //     }catch(e){}
            //     this.loadSgf.status = true
            // }
            this.sgfInfo = sgfInfo
            this.sgfInfoTemplate = this.GLOBAL.deepCopy(sgfInfo)
        },
        sgfInfoClear(){
            let sgfInfo = this.GLOBAL.deepCopy(this.GLOBAL.sgfInfo)
            sgfInfo.fileName = {label: '文件名', value: ''}
            this.sgfInfo = sgfInfo
            this.sgfInfoTemplate = this.GLOBAL.deepCopy(sgfInfo)
            this.GLOBAL.clearSgfInfo()
        },
        errorNotice(txt){
            let type = 'error'
            this.GLOBAL.MessageOpen({
                type: type,
                message: txt,
                duration: 3000,
                showClose: true
            })
        },
        downloadSgfOn(){
            this.downloadSgfData.active = true
            this.$emit('takeFun', {
                fun: 'timeStop'
            })
        },
        downloadSgfOff(){
            this.downloadSgfData.active = false
            this.$emit('takeFun', {
                fun: 'timeContinue'
            })
        },
        downloadSgfCancel(){
            this.downloadSgfOff()
            
        },
        createSgfByBoard(opt){
            opt = opt || {}
            let sgfInfo = this.GLOBAL.deepCopy(this.sgfInfoTemplate)
            let options = {
                sgfInfo: sgfInfo,
                komi: sgfInfo.km.value
            }
            for(var i in opt){
                options[i] = opt[i]
            }
            let data = this.downloadSgf(options)
            return data
        },
        setSgfInfoVal(item){
            item = item || {}
            let sgfInfo = this.GLOBAL.deepCopy(this.sgfInfoTemplate)
            for(var i in item){
                if(sgfInfo[i] !== undefined) sgfInfo[i].value = item[i]
            }
            this.sgfInfoTemplate = sgfInfo
        },
        downloadSgfConfirm(){
            if(this.board.position <= 0){
                this.errorNotice('当前盘面为空')
                return
            }
            let sgfInfo = this.GLOBAL.deepCopy(this.sgfInfoTemplate)
            if(!sgfInfo.fileName.value || sgfInfo.fileName.value == ''){
                this.errorNotice('请输入文件名')
                return
            }
            let options = {
                sgfInfo: sgfInfo,
                komi: sgfInfo.km.value
            }
            let data = this.downloadSgf(options)
            let blob = new Blob([data], {type: "text/plain;charset=utf-8"});
            let fileName = sgfInfo.fileName.value + '.sgf'
            FileServer(blob,fileName);
            this.downloadSgfOff()
            this.$emit('takeFun', {
                fun: 'downloadSgfConfirm'
            })
        },
        CreateSgfData(opt){
            for(var i in this.sgfInfo){
                if(opt.sgfInfo[i] != undefined) this.sgfInfo[i].value = opt.sgfInfo[i]
            }
            opt.sgfInfo = this.sgfInfo
            return this.board.CreateSgfData(opt)
        },
        CreateSgfDataHead(opt){
            for(var i in this.sgfInfo){
                if(opt.sgfInfo[i] != undefined) this.sgfInfo[i].value = opt.sgfInfo[i]
            }
            opt.sgfInfo = this.sgfInfo
            return this.board.CreateSgfDataHead(opt)
        },
        takeFun(opt){
            let fun = opt.fun
            if(this[fun]) this[fun](opt.data)
        },
        mySgf(){
            this.$refs['sgf'].panelOn()
        },
        openSgf(data){
            this.$emit('takeFun', {
                fun: 'openSgf',
                data: data
            })
            this.loadSgfByInside(data)
        },
        async openSgfById(id, type){
            return this.$refs['sgf'].openSgfById(id, type)
        },
        async getSgfEngineBoardData(id){
            return this.$refs['sgf'].getSgfEngineBoardData(id)
        },
        actualStoneSet(opt){
            this.board.actualStoneSet(opt)
        },
        actualStoneOff(opt){
            this.board.actualStoneOff(opt)
        },
        uploadSgfInside(opt){
            return this.$refs['sgf'].uploadSgfInside(opt, 'uploadSgfInsideCallback')
        },
        uploadSgfInsideCallback(res){
            this.$emit('takeFun', {
                fun: 'uploadSgfInsideCallback',
                data: res
            })
        },
        saveSgfToLibrary(opt){
            return this.$refs['sgf'].uploadSgfOutside(opt, 'uploadSgfOutsideCallback')
        },
        uploadSgfOutsideCallback(res){
            this.$emit('takeFun', {
                fun: 'uploadSgfOutsideCallback',
                data: res
            })
        },
        saveSgfForReport(opt){
            this.$refs['sgf'].saveSgfForReport(opt, 'saveSgfForReportCallBack')
            this.uploadOverHandle = 'saveSgfForReportCallBack'
        },
        saveSgfForReportCallBack(res){
            this.$emit('takeFun', {
                fun: 'saveSgfForReportCallBack',
                data: res
            })
            this.$refs['sgf'].turnOff()
        },
        uploadSgfOver(res){
            if(this.uploadOverHandle && this[this.uploadOverHandle]) this[this.uploadOverHandle](res)
            else this.$emit('takeFun', {
                fun: 'uploadSgfOver',
                data: res
            })
        },
        uploadTurnOff(){
            this.uploadOverHandle = null
        },
        loadSgfPlayCoorCheck(x, y){
            if(this.board.position < this.board.step.length - 1){
                let position = this.board.position
                let step = this.board.step[Number(position) + 1]
                if(step.x == x && step.y == y){
                    // this.jumpTo(1)
                    return false
                }
            }
            return true
        },
        async stoneToLocalHandle(){
            if(!this.stoneToLocal) return
            let list = this.stoneImgList.black
            let resB = await this.stoneToLocalAction(list)
            this.stoneImgList.black = resB
            list = this.stoneImgList.white
            let resW = await this.stoneToLocalAction(list)
            this.stoneImgList.white = resW
            this.board.board.blackStoneGraphic = resB
            this.board.board.whiteStoneGraphic = resW
        },
        async stoneToLocalAction(list, index, listCom){
            listCom = listCom || []
            index = index || 0
            if(index >= list.length) return listCom
            let url = list[index]
            let res = await this.GLOBAL.getStaticData(url, {responseType: 'blob', isStaticFile: true})
            let data = null
            if(res){
                data = URL.createObjectURL(res)
                listCom.push(data)
            }
            index++
            return this.stoneToLocalAction(list, index, listCom)
        },
        stoneImgListInit(){
            let assetsUrl = this.assetsUrl
            this.stoneImgList = {
                black: [
                    `${assetsUrl}/img/stb1.png`,
                    `${assetsUrl}/img/stb2.png`,
                    `${assetsUrl}/img/stb3.png`,
                    `${assetsUrl}/img/stb4.png`,
                ],
                white: [
                    `${assetsUrl}/img/stw1.png`,
                    `${assetsUrl}/img/stw2.png`,
                    `${assetsUrl}/img/stw3.png`,
                    `${assetsUrl}/img/stw4.png`,
                    `${assetsUrl}/img/stw5.png`,
                    `${assetsUrl}/img/stw6.png`,
                    `${assetsUrl}/img/stw7.png`,
                    `${assetsUrl}/img/stw8.png`,
                    `${assetsUrl}/img/stw9.png`,
                    `${assetsUrl}/img/stw10.png`,
                    `${assetsUrl}/img/stw11.png`,
                ]
            }
        },
        jumpToWheel(e){
            let deltaY = e.deltaY
            let p = deltaY > 0 ? 1 : -1
            this.jumpTo(p)
        },
        pageKeyUp(e){
            if(this.keyboardLose) return
            let code = e.keyCode
            if(!this.keyCodeFunList[code] || !this.keyCodeFunList[code].fun || !this[this.keyCodeFunList[code].fun]) return
            this[this.keyCodeFunList[code].fun](this.keyCodeFunList[code].params)
            return false
        },
        pageKeydown(e){
            if(this.keyboardLose) return
            let code = e.keyCode
            if(code != 13 || !this.board.prop.active) return
            document.activeElement.blur()
        },
        lockBranchBykeyboard(index){
            index = index - 1
            index = index < 0 ? 0 : index
            this.$emit('takeFun', {
                fun: 'lockBranchBykeyboard',
                data: index
            })
        },
        lockBranchJumpBykeyboard(index){
            this.$emit('takeFun', {
                fun: 'lockBranchJumpBykeyboard',
                data: index
            })
        },
        optionsLockOff(){
            this.$emit('takeFun', {
                fun: 'optionsLockOff',
            })
            this.removeStatusByESC()
        },
        elementBlurCheck(){
            let ele = document.activeElement.tagName
            ele = ele.toLowerCase()
            let list = {
                'input': true,
                'textarea': true
            }
            if(list[ele]) return
            document.activeElement.blur()
        },
        playFirstPoint(key){
            if(key == 'enter' && this.enterState != undefined){
                this.$emit('takeFun', {
                    fun: this.enterState,
                    data: 'enter'
                })
                return
            }
            this.elementBlurCheck()
            // if(!this.board.prop.active) return
            // if(!this.board.prop.draw || !this.board.prop.draw.length) return
            // let coor = {
            //     x: this.board.prop.draw[0].x,
            //     y: this.board.prop.draw[0].y,
            // }
            // // document.activeElement.blur()
            // setTimeout(() => {
            //     this.$emit('takeFun', {
            //         fun: 'playByKeyboard',
            //         data: coor
            //     })
            // }, 100);

            this.playFirstPointAction()
        },
        playFirstPointAction(){
            if(!this.board.prop.active) return
            if(!this.board.prop.draw || !this.board.prop.draw.length) return
            let coor = {
                x: this.board.prop.draw[0].x,
                y: this.board.prop.draw[0].y,
            }
            console.log(coor)
            // document.activeElement.blur()
            setTimeout(() => {
                this.$emit('takeFun', {
                    fun: 'playByKeyboard',
                    data: coor
                })
            }, 100);
        },
        coorIndexToGTP(moves){
            if(!this.GLOBAL.isArray(moves)) moves = [moves]
            for(var i in moves){
                moves[i] = this.board.coor1to2(moves[i])
                moves[i] = this.board.coorNtoS(moves[i].x, moves[i].y)
                // moves[i] = {
                //     x: String.fromCharCode(moves[i].x + 97),
                //     y: String.fromCharCode(moves[i].y + 97)
                // }
                moves[i] = moves[i].x + moves[i].y
            }
            return moves
        },
        pageUpSet(){
            if(!this.board.branch.active) return this.jumpToBykeyboard('-5')
            this.$emit('takeFun', {
                fun: 'branchJump',
                data: -5
            })
        },
        pageDownSet(){
            if(!this.board.branch.active) return this.jumpToBykeyboard('5')
            this.$emit('takeFun', {
                fun: 'branchJump',
                data: 5
            })
        },
        endSet(){
            if(!this.board.branch.active) return this.jumpToBykeyboard('l')
            this.$emit('takeFun', {
                fun: 'branchJump',
                data: 'l'
            })
        },
        homeSet(){
            if(!this.board.branch.active) return this.jumpToBykeyboard('s')
            this.$emit('takeFun', {
                fun: 'branchJump',
                data: 's'
            })
        },
        leftSet(){
            if(!this.board.branch.active) return this.jumpToBykeyboard('-1')
            this.$emit('takeFun', {
                fun: 'branchJump',
                data: '-1'
            })
        },
        rightSet(){
            if(!this.board.branch.active) return this.jumpToBykeyboard('1')
            this.$emit('takeFun', {
                fun: 'branchJump',
                data: '1'
            })
        },
        splitBranchOn(data, moves){
            return this.board.splitBranchOn(data, moves)
        },
        splitBranchOff(){
            return this.board.splitBranchOff()
        },
        boardMouseRight(){
            // if(this.board.branch.active){
            //     if(this.optionsSpecCheck){
            //         this.branchMouseRightToOff()
            //     }else{
            //         this.branchMouseRightToLock()
            //     }
            //     return
            // }
            if(this.mouseRightSpecCheck && this.mouseRightSpecCheck != ''){
                this.$emit('takeFun', {
                    fun: this.mouseRightSpecCheck
                })
                return
            }
            let f = this.removeStatusByESC()
            if(f) return
            this.$emit('takeFun', {
                fun: 'jumpTo',
                data: '-1'
            })
        },
        removeStatusByESC(){
            let list = this.buttonStatusList
            let f = false
            for(var i in list){
                if(this[list[i].check]){
                    this.$emit('takeFun', {
                        fun: list[i].off
                    })
                    f = true
                    break
                } 
            }
            return f
        },
        setBoardByImage(moves){
            return this.board.setBoardByImage(moves)
        },
        getBoardStoneBySgfData(sgfData){
            this.loadSgf(sgfData)
            return this.board.stone
        },
        getLastPoint(sgfData){
            return this.board.coor2to1(sgfData[sgfData.length - 1].x, sgfData[sgfData.length - 1].y)
        },
        readGameStartCon(){
            this.readGameStart()
            return 1100
        },
        playByClickForLabel(x, y, label){
            let coor = this.board.playByClickForLabel(x, y, label)
            this.posHasChanged()
            return coor
        },
        classLabelClear(data){
            this.board.classLabelClear(data)
            this.posHasChanged()
        },
        stoneOverForLabel(x, y, label){
            this.board.stoneOverForLabel(x, y, label)
            this.posHasChanged()
        },
        classLabelRefresh(){
            if(!this.board) return
            this.board.classLabelRefresh()
            this.posHasChanged()
        },
        classLabelHide(){
            this.board.classLabelHide()
        },
        isPlayed(x, y){
            return this.board.isPlayed(x, y)
        },
        getStepData(coor){
            return this.board.getStepData(coor)
        },
        //更改棋谱-移动
        sgfMoveOn(){
            this.board.sgfMoveOn()
            this.posHasChanged()
        },
        sgfMoveOff(){
            this.board.sgfMoveOff()
            this.posHasChanged()
        },
        sgfMovePlay(x, y, opt){
            let res = this.board.sgfMovePlay(x, y, opt)
            this.posHasChanged()
            return res
        },
        sgfMoveClear(){
            this.board.sgfMoveClear()
        },

        //更改棋谱-删除
        sgfDeleteOn(){
            this.board.sgfDeleteOn()
            this.posHasChanged()
        },
        sgfDeleteOff(){
            this.board.sgfDeleteOff()
            this.posHasChanged()
        },
        sgfDeletePlay(x, y, opt){
            let res = this.board.sgfDeletePlay(x, y, opt)
            this.posHasChanged()
            return res
        },
        sgfInsertSetColor(type){
            this.board.sgfInsertSetColor(type)
            this.posHasChanged()
        },

        //更改棋谱-插入
        sgfInsertOn(type){
            this.board.sgfInsertOn(type)
            this.posHasChanged()
        },
        sgfInsertOff(){
            this.board.sgfInsertOff()
            this.posHasChanged()
        },
        sgfInsertPlay(x, y, opt){
            let res = this.board.sgfInsertPlay(x, y, opt)
            this.posHasChanged()
            return res
        },
        parseSgfWithBranch(data){
            return this.board.parseSgfWithBranch(data)
        },
        parseSgfToStep(data){
            return this.board.parseSgfToStep(data)
        },
        setAWandAB(type, data){
            return this.board.setAWandAB(type, data)
        },
        areaAnalyseOn(data1, data2, color1){
            this.board.areaAnalyseOn(data1, data2, color1)
        },
        areaAnalyseOff(){
            this.board.areaAnalyseOff()
        },
        getSyncBoard(){
            return this.board.getSyncBoard()
        },
        parse_sgf(e){
            if(!e || !e.target.files) return
            let file = e.target.files[0]
            var fReader=new FileReader();
            fReader.onload= async () =>{
                if(fReader.result){
                    let fileData = fReader.result
                    let suffix = this.fileSuffixGet(file.name)
                    suffix = suffix.toLowerCase()
                    let sgfData = this.parseSgfFile(fileData, suffix)
                    let {moves} = sgfData
                    let resCheck = await this.sgfLengthCheck(moves)
                    if(!resCheck) return false
                    this.loadSgfData.file = file
                    this.loadSgfData.name = file.name
                    this.selectedFileHandle(sgfData)
                }else{
                    this.errorNotice('棋谱为空！')
                    if(document.querySelector('#loadSgfBtn')){
                        document.querySelector('#loadSgfBtn').value = ''
                    }
                    return
                }
            }
            fReader.readAsText(file,'utf-8');
        },
        async sgfLengthCheck(moves){
            return this.GLOBAL.sgfLengthCheck(moves)
        },
        async parse_gib(e){
            if(!e || !e.target.files) return
            let file = e.target.files[0]
            this.loadSgfData.file = file
            this.loadSgfData.name = file.name
            let suffix = this.fileSuffixGet(this.loadSgfData.name)
            suffix = suffix.toLowerCase()
            let sgfData = await this.board.parseSgfFileGib(file, suffix)
            if(!sgfData) return
            let moves = sgfData.moves
            try{
                moves = moves.split(',')
            }catch(er){}
            if(!this.GLOBAL.isArray(moves)) return
            let data = {
                gtp: [],
                info: {},
                normal: [],
                setStone: []
            }
            let color = 1
            for(var i in moves){
                let coor = this.board.coor1to2(moves[i])
                let gtp = this.board.coorNtoS(coor.x, coor.y)
                gtp = gtp.x + gtp.y,
                gtp = {
                    move: gtp,
                    color: color == 1 ? 'B' : 'W',
                    position: Number(i) + 1
                }
                let normal = {
                    x: coor.x, y: coor.y, coor: moves[i], c: color
                }
                data.gtp.push(this.GLOBAL.deepCopy(gtp))
                data.normal.push(this.GLOBAL.deepCopy(normal))
                color = -color
            }
            let sgfInfo = this.GLOBAL.deepCopy(this.GLOBAL.sgfInfo)
            let info = {}
            for(var i in sgfInfo){
                info[i] = null
                if(sgfData[i] !== undefined) info[i] = sgfData[i]
            }
            data.info = info
            this.selectedFileHandle(data)
        },
        sgfChangeInsertRemove(x, y){
            return this.board.sgfChangeInsertRemove(x, y)
        },
        targetStoneSet(x, y, opt){
            return this.board.targetStoneSet(x, y, opt)
        },
        targetStoneSetAction(moves){
            return this.board.targetStoneSetAction(moves)
        },
        targetStoneOver(x, y){
            return this.board.targetStoneOver(x, y)
        },
        targetStoneClear(moves){
            return this.board.targetStoneClear(moves)
        },
        getColor(x, y){
            return this.board.getColor(x, y)
        },
        fightingZoneSetAction(moves){
            return this.board.fightingZoneSetAction(moves)
        },
        fightingZoneClear(moves){
            return this.board.fightingZoneClear(moves)
        },
        borderAfterSet(moves, oralMoves){
            return this.board.borderAfterSet(moves, oralMoves)
        },
        set_ldpLabel_display(val){
            return this.board.set_ldpLabel_display(val)
        },
        ldpRefresh(){
            return this.board.ldpRefresh()
        },
        ldpLabelOn(){
            return this.board.ldpLabelOn()
        },
        ldpLabelOff(){
            return this.board.ldpLabelOff()
        },
        borderZoneClear(){
            if(!this.board) return
            this.board.borderZoneClear()
        },
        koTCheck(){
            if(!this.board) return false
            return this.board.koTCheck()
        },
        sgfLoadDataSet(){
            this.loadSgfData.sgf = this.board.getStepString()
        },
        sgfLoadDataClear(){
            this.loadSgfData.sgf = null
        },
    },
    created(){
        this._sgfUti = sgfUti
        this.GLOBAL.onresizeFunction.board = this.pageSizeChange
        this.sgfInfoInit()
    },
    mounted() {
        
        this.$nextTick(() => {
            setTimeout(() => {
                let options = {
                    width: this.$refs['boardCom'].offsetWidth,
                    height:this.$refs['boardCom'].offsetWidth,
                    size: this.size,
                    section:{top:12,right:12,bottom:12,left:12},
                    modal: this.modal,
                    specStoneLabel: this.specStoneLabel
                }
                let boardEle = this.$refs['boardCom']
                // this.board = new board(document.querySelector(`#${this.boardIdCul}`), options)
                this.board = new board(boardEle, options)
                this.changeCoor(this.coor)
                // this.stoneToLocalHandle().then(() => {
                //     this.posHasChanged()
                //     this.$emit('takeFun', {
                //         fun: 'boardHasInit'
                //     })
                // })
                document.addEventListener("keyup", this.pageKeyUp);
                document.addEventListener("keydown", this.pageKeydown);
                this.posHasChanged()
                this.board.setMinNum(this.minNumCul)
                this.$emit('takeFun', {
                    fun: 'boardHasInit'
                })
            }, 0);
        })
    },
    computed: {
        sgfInfoSt(){
            let {stVal} = this
            stVal = Number(stVal)
            if(isNaN(stVal)) stVal = 0
            if(stVal < 0) stVal = 0
            return stVal
        },
        minNumCul(){
            return this.minNum || this.sgfInfoSt
        },
        boardIdCul(){
            if(!this.boardId) return 'board'
            return this.boardId
        }
    },
    watch: {
        sgfInfoTemplate: {
            handler(val){
                let {st} = val
                st = st || {}
                let stVal = st.value || 0
                this.stVal = stVal
                this.$emit('takeFun', {
                    fun: 'sgfInfoChange',
                    data: val
                })
            },
            deep: true,
            immediate: true
        },
        size: {
            handler(val){
                if(!this.board) return
                this.board.setSize(val)
                this.$nextTick(() => {
                    this.$emit('boardSizeChange')
                })
            },
            deep: true,
        },
        modal: {
            handler(val){
                if(!this.board) return
                this.board.setModal(val)
            },
            deep: true,
            immediate: true
        },
        minNumCul: {
            handler(){
                if(!this.board) return
                this.board.setMinNum(this.minNumCul)
            },
            deep: true,
            immediate: true
        },
        keyboardLose(){
        },
        enterState(){
        },
        loadSgfData: {
            handler(val){
                if(!this.$refs['uploadSgfBox']){
                    this.loadSgfData.active = false
                    return
                }
                if(val.active)
                    this.$refs['uploadSgfBox'].open({
                        button: [
                            {name: '打开', fun: this.loadSgfConfirm},
                            {name: '取消', fun: this.loadSgfCancel, type: 'cancel'},
                        ]
                    })
                else
                    this.$refs['uploadSgfBox'].close()
            },
            deep: true,
            immediate: true
        },
        downloadSgfData: {
            handler(val){
                if(!this.$refs['downloadSgfPanel']) return
                if(val.active){
                    this.$refs['downloadSgfPanel'].open({
                        button: [
                            {name: '保存', fun: this.downloadSgfConfirm},
                            {name: '取消', fun: this.downloadSgfCancel, type: 'cancel'},
                        ],
                        autoClose: false
                    })
                }else
                    this.$refs['downloadSgfPanel'].close()
            },
            deep: true,
            immediate: true
        },
        boardId(val){
        },
        coor: {
            handler(val){
                if(!this.board) return
                this.changeCoor(val)
            },
            immediate: true,
            deep: true
        },
    },
    components: {
        // sgf
    },
    beforeDestroy() {
        this.GLOBAL.onresizeFunction.board = null
        document.removeEventListener('keydown', this.pageKeydown)
        document.removeEventListener('keyup', this.pageKeyUp)
    },
}
</script>

<style lang="less" src="../assets/css/loadsgf.less"></style>
<style lang="less">
    .main{
        width: 100%;
        height: 100%;
        position: relative;
        .board{
            // background: url(../../assets/board_bcg.jpg) no-repeat;
            // background-size: 100% 100%;
            width: 100%;
            height: 100%;
            .wgo-board{
                width: 100% !important;
                height: 100% !important;
                canvas{
                    width: 100% !important;
                    height: 100% !important;
                    left: 0px;
                    top: 0px;
                }
            }
            .video-box{
                position: absolute;
                top: 0px;
                left: 0px;
                width: 100%;
                height: 100%;
                z-index: 999;
                video{
                    width: 100%;
                    height: 100%;
                }
            }
        }
        .board-pre{
            z-index: 1000;
            font-size: 0.6rem;
            background: #000;
            color: #fff;
            position: absolute;
            padding: 0.15rem 0.4rem;
            border-radius: 0.15rem; 
        }
        .upload-sgf-box{
            @uploadBtnWidth: 5rem;
            @uploadBtnMargin: 0.7rem;
            padding: 1rem 0px;
            .upload-title{
                margin-bottom: 1rem;
                .txt{
                    font-size: 0.9rem;
                }
                .upload-small-title{
                    .txt{
                        font-size: 0.5rem;
                    }
                }
            }
            .upload-sgf-body{
                display: flex;
                .upload-item.content{
                    width: calc(100% - @uploadBtnWidth - @uploadBtnMargin);
                    .el-input__inner{
                        border: 1px solid #606060;
                        background: none;
                        height: @sgfHandleInputH;
                    }
                }
                .upload-item.btn{
                    margin-left: @uploadBtnMargin;
                    .el-button{
                        padding: 0px;
                        width: @uploadBtnWidth;
                        height: @sgfHandleInputH;
                        .txt{
                            font-size: 0.7rem;
                        }
                    }
                } 
            }
        }
        .download-sgf-box{
            padding: 1rem 0px;
            .upload-title{
                margin-bottom: 0.5rem;
                .txt{
                    font-size: 0.9rem;
                }
            }
            .download-item{
                .item-td{
                    display: flex;
                    align-items: center;
                    .le-td{
                        white-space: nowrap;
                        margin-right: 0.5rem;
                    }
                    .le-td:last-child{
                        margin: 0px;
                    }
                    .le-td.input{
                        width: 100%;
                    } 
                }
            }
            .down-load-table{
                width: 30rem;
                white-space: nowrap;
                
                td{
                    padding: 0.3rem 0.2rem;
                    text-align: right;
                    .el-input__inner{
                        border: 1px solid #888;
                        background: none;
                        height: @sgfHandleInputH;
                    }
                    .file-name{
                        display: flex;
                        align-items: center;
                        .el-input{
                            margin-right: 0.5rem;
                            .el-input__inner{
                                border: 1px solid #B0B0B0;
                                background: #fff;
                            }
                        }
                    }
                }
            }
        }
        
    }
    
</style>


