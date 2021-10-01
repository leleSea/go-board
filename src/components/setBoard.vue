<template>
    <div class="set-board">
        <!-- 新开一局/更改对局 -->
        <!-- :close-on-click-modal="gameShowClose"
        :close-on-press-escape="gameShowClose"
        :show-close="gameShowClose"
        :before-close="newGameOptionsOff" -->

        <!-- :title="gameType[type].name" -->
        <!-- :close-on-click-modal="closeOnClickModal" -->
        <el-dialog
        class="dialog-set-board"
        :show-close="false"
        :visible="status.active"
        :before-close="turnOff"
        
        width="29rem"
        >
            <div class="new-game-content">
                <div class="set-board-dialog-title">
                    <div class="engine-title title-txt" v-show="gameType[type].page == 'engine'">{{gameType[type].name}}</div>
                    <div class="play-title" v-show="gameType[type].page != 'engine'">
                        <div class="play-card a" :class="{'active': playType == 0}" @click="playTypeChange(0)">
                            自由对弈
                        </div>
                        <div class="play-card a" :class="{'active': playType == 2}" @click="playTypeChange(2)">
                            升降级对弈
                        </div>
                        <div class="play-card b" :class="{'active': playType == 1}" @click="playTypeChange(1)">
                            高水平对弈
                        </div>
                        <div class="play-card-bcg" :class="{'left': playType == 0, 'right': playType == 1, 'middle': playType == 2}"></div>
                    </div>
                </div>
                <div class="set-board-dialog-content">
                    <div class="item b c">
                        <div class="item-title">规则</div>
                    </div>
                    <div class="item a border-btm">
                        <div class="item-title"></div>
                        <div class="item-con">
                            <div class="item-con-i">
                                <!-- <el-select v-model="sizeOpt.value" placeholder="棋盘大小" :disabled="type == 4 || type == 5"> -->
                                <el-select v-model="sizeOpt.value" :placeholder=" $t('棋盘大小') " :disabled="true">
                                    <el-option
                                    :disabled="newGameOptions.type!=0"
                                    v-for="item in sizeOpt.data"
                                    :key="item.name"
                                    :label="item.name"
                                    :value="item.value">
                                        <span>{{item.label}}</span>
                                    </el-option>
                                </el-select>
                            </div>
                            <div class="item-con-i">
                                <!-- :disabled="type == 4 || type == 5" -->
                                <el-select v-model=" handicapOpt.value" :placeholder=" $t('让子') " disabled="disabled">
                                    <el-option
                                    v-for="item in handicapOpt.data"
                                    :disabled="newGameOptions.type!=0"
                                    :key="item.name"
                                    :label="item.name"
                                    :value="item.value">
                                    <span>{{item.label}}</span>
                                    </el-option>
                                </el-select>
                            </div>
                            <div class="item-con-i">
                                <el-select v-model="komiOpt.value" :placeholder=" $t('贴目') " disabled="disabled">
                                    <el-option
                                    v-for="item in komiOpt.data"
                                    :key="item.name"
                                    :label="item.name"
                                    :value="item.value">
                                    <!-- <span>{{item.label}}</span> -->
                                    </el-option>
                                </el-select>
                            </div>
                        </div>
                    </div>
                    <div v-show="gameType[type].content != 0">
                        <div class="item b c pdi-top">
                            <div class="item-title">棋手</div>
                        </div>
                        <div class="item b c">
                            <div class="item-title"></div>
                            <div class="item-con">
                                <div class="c-item" @click="colorChange(1)" :class="{'disabled': playType == 2}">
                                    <div class="c-radio" :class="{'active':colorSelect==1}">
                                        <div class="c-radio-sel"></div>
                                    </div>
                                    <div class="c-txt">执黑</div>
                                </div>
                                <div class="c-item" @click="colorChange(-1)" :class="{'disabled': playType == 2}">
                                    <div class="c-radio" :class="{'active':colorSelect==-1}">
                                        <div class="c-radio-sel"></div>
                                    </div>
                                    <div class="c-txt">执白</div>
                                </div>
                                <div class="c-item" @click="colorChange(0)" :class="{'disabled': playType == 2}">
                                    <div class="c-radio" :class="{'active':colorSelect==0}">
                                        <div class="c-radio-sel"></div>
                                    </div>
                                    <div class="c-txt">{{ $t('猜先') }}</div>
                                </div>
                            </div>
                        </div>
                        <div class="item b c time">
                            <div class="item-title"></div>
                            <div class="item-con">
                                <div class="c-item" @click="gameTimeDis(false)" :class="{'disabled': playType == 2}">
                                    <div class="c-radio" :class="{'active':!gameTime.unavailable}">
                                        <div class="c-radio-sel"></div>
                                    </div>
                                    <div class="c-txt">计时</div>
                                </div>
                                <div class="c-item" @click="gameTimeDis(true)" :class="{'disabled': playType == 2}">
                                    <div class="c-radio" :class="{'active':gameTime.unavailable}">
                                        <div class="c-radio-sel"></div>
                                    </div>
                                    <div class="c-txt">不计时</div>
                                </div>
                            </div>
                        </div>
                        <div class="item b border-btm">
                            <div class="item-title"></div>
                            <div class="item-con">
                                <div class="item-con-i">
                                    <el-select v-model="gameTime.minute.value" placeholder="基本用时" :disabled="gameTime.unavailable || playType == 2">
                                        <el-option
                                        v-for="item in gameTime.minute.data"
                                        :key="item.name"
                                        :label="item.name"
                                        :value="item.value">
                                            <span>{{item.label}}</span>
                                        </el-option>
                                    </el-select>
                                </div>
                                <div class="item-con-i">
                                    <el-select v-model=" gameTime.second.value" placeholder="读秒" :disabled="gameTime.unavailable || playType == 2">
                                        <el-option
                                        v-for="item in gameTime.second.data"
                                        :key="item.name"
                                        :label="item.name"
                                        :value="item.value">
                                        <span>{{item.label}}</span>
                                        </el-option>
                                    </el-select>
                                </div>
                                <div class="item-con-i">
                                    <el-select v-model="gameTime.num.value" placeholder="读秒次数" :disabled="gameTime.unavailable || playType == 2">
                                        <el-option
                                        v-for="item in gameTime.num.data"
                                        :key="item.name"
                                        :label="item.name"
                                        :value="item.value">
                                        <span>{{item.label}}</span>
                                        </el-option>
                                    </el-select>
                                </div>
                            </div>
                        </div>
                        <div class="item b c pdi-top">
                            <div class="item-title">电脑</div>
                        </div>
                        <div class="in-play" v-show="playType == 0 || playType == 2">
                            <div class="item b">
                                <div class="item-title"></div>
                                <div class="item-con">
                                    <div class="item-con-i in-play-select" :class="{'p31': computerLevel.value == 3100, 'p32': computerLevel.value == 3200, 'p33': computerLevel.value == 3300}">
                                        <el-select v-model="computerLevel.value" placeholder="电脑等级" @change="computerLevelChange" :disabled="(playType == 2 && $store.state.userLevel > 0) || (playType == 2 && type == 4 && page == 'level')">
                                            <el-option
                                            v-for="item in computerLevel.data"
                                            :key="item.value"
                                            :label="item.name"
                                            :value="item.value">
                                            <span>{{item.label}}</span>
                                            <!-- <span class="level-icon" v-if="item.icon"> -->
                                            <img class="in-play-ai-level-icon" v-if="item.icon" :src="`${GLOBAL.assetsUrl}/img/${item.icon}.png`" alt="">
                                            <!-- </span> -->
                                            </el-option>
                                        </el-select>
                                    </div>
                                    <div class="item-con-i in-play-info" v-show="playType == 0">
                                        <!-- {{levelNow['price'] ? }} -->
                                        <span class="txt">免费使用</span>
                                    </div>
                                    <div class="item-con-i in-play-info level-game" v-show="playType == 2">
                                        <span class="txt">
                                            <span v-if="$store.state.userLevel <= 0">请选择电脑等级以完成定级</span>
                                            <span v-if="$store.state.userLevel > 0">根据您当前等级自动匹配电脑等级</span>
                                            <help ref='help' theme="light"></help>
                                        </span>
                                        
                                    </div>
                                </div>
                            </div>
                            <div class="item b c play-speed">
                                <div class="item-title"></div>
                                <div class="item-con">
                                    <div class="play-speed-txt">落子速度</div>
                                    <div class="play-speed-slider">
                                        <div class="txt">快</div>
                                        <div class="speed-slider-box">
                                            <el-slider
                                            v-model="playSpeed"
                                            :show-tooltip="false"
                                            :step="1"
                                            :min="0"
                                            :max="maxSpeed"
                                            :marks="marks"
                                            show-stops>
                                            </el-slider>
                                        </div>
                                        <div class="txt">慢</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="engine-play" v-show="playType == 1">
                            <!-- v-if="page != 'playEngine'" -->
                            <div class="item b" v-if="planSetCheck()">
                                <div class="item-title"></div>
                                <div class="item-con">
                                    <div class="item-con-i">
                                        <el-select v-model="planList.value" placeholder="电脑等级" @change="configChange">
                                            <el-option-group
                                            v-for="item in planList.data"
                                            :key="item.id"
                                            :label="item.name">
                                                <el-option
                                                    v-for="i in item.planList"
                                                    :key="i.id"
                                                    :label="i.name"
                                                    :value="i.id">
                                                </el-option>
                                            </el-option-group>
                                        </el-select>
                                    </div>
                                    <div class="plan-info">
                                        <span v-if="!cardPlanNow || cardPlanNow.gpuPlanId != planNow.id">
                                            ￥
                                            <span class="or-price" :class="{'delete': cardPlanNow && cardPlanNow.discounts}">{{planNow.price}}</span>
                                            <span class="real-price" v-if="cardPlanNow && cardPlanNow.discounts">{{planNow.price * cardPlanNow.discounts | tofixed4}}</span>
                                            /分钟
                                        </span>
                                        <span v-if="cardPlanNow && cardPlanNow.gpuPlanId == planNow.id">{{`剩余时长：${cardPlanNow.remainTime}`}}分钟</span>
                                        <span class="plan-status" :class="planNow.available.css">{{planNow.available.txt}}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="item b">
                                <div class="item-title"></div>
                                <div class="item-con">
                                    <div class="item-con-i">
                                        <el-select v-model="gameTimeAI.minute.value" placeholder="基本用时">
                                            <el-option
                                            v-for="item in gameTimeAI.minute.data"
                                            :key="item.name"
                                            :label="item.name"
                                            :value="item.value">
                                                <span>{{item.label}}</span>
                                            </el-option>
                                        </el-select>
                                    </div>
                                    <div class="item-con-i">
                                        <el-select v-model=" gameTimeAI.second.value" placeholder="读秒">
                                            <el-option
                                            v-for="item in gameTimeAI.second.data"
                                            :key="item.name"
                                            :label="item.name"
                                            :value="item.value">
                                            <span>{{item.label}}</span>
                                            </el-option>
                                        </el-select>
                                    </div>
                                    <div class="item-con-i">
                                        <el-select v-model="gameTimeAI.num.value" placeholder="读秒次数">
                                            <el-option
                                            v-for="item in gameTimeAI.num.data"
                                            :key="item.name"
                                            :label="item.name"
                                            :value="item.value">
                                            <span>{{item.label}}</span>
                                            </el-option>
                                        </el-select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button class="f-btn a" @click="cancel">取 消</el-button>
                <el-button class="f-btn b" type="primary" @click="confirm">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'setBoard',
    props: {
        closeOnClickModal: Boolean,
        page: String,
    },
    data(){
        return {
            cardPlanNow: {},
            playTypeOpt: {
                data: [],
                value: 'casual_match'
            },
            marks: {
                1: '',
                2: '',
                3: '',
                4: '',
            },
            playSpeed: 5,
            maxSpeed: 5,
            planList: {
                value: 0,
                data: []
            },
            gameType: [
                {name: '新开分析', fun: 'newGameForEngine', content: 0, page: 'engine'},
                {name: '新开对弈', fun: 'newGameForPlay', content: 1, page: 'play'},
                {name: '切换至分析', fun: 'transForEngine', content: 0, page: 'play'},
                {name: '切换至对弈', fun: 'transForPlay', content: 1, page: 'engine'},
                {name: '更改对局模式', fun: 'modifyGameForPlay', content: 1, page: 'play'},
                {name: '更改对局模式', fun: 'modifyGameForEngine', content: 0, page: 'engine'},
                {name: '新开一局', fun: 'newGameForMenu', content: 0, page: 'engine'},
                {name: '智能对弈', fun: 'modifyGameForPlay', content: 1, page: 'engineMenu'},
            ],
            type: 0,
            playType: 0,
            status: {
                active: false
            },
            newGameOptions: {
                active: false,
                type: 0
            },
            sizeOpt: {
                data: [],
                value: 19
            },
            handicapOpt: {
                data: [],
                value: 0
            },
            komiOpt: {
                data: [],
                value: 7.5
            },
            colorSelect: 1,
            color: 1,
            gameTime: {
                minute:{
                    data: [],
                    value: 10
                },
                second: {
                    data: [],
                    value: 30
                },
                num: {
                    data: [],
                    value: 3
                },
                unavailable: false
            },
            gameTimeAI: {
                minute:{
                    data: [],
                    value: 10
                },
                second: {
                    data: [],
                    value: 30
                },
                num: {
                    data: [],
                    value: 3
                },
            },
            computerLevel: {
                data: [],
                value: 2100
            },
            planNow: {
                available: ''
            },
            levelNow: {
            }
        }
    },
    methods: {
        configChange(val){
            this.planNow = this.findPlan(val)
        },
        computerLevelChange(val){
            this.levelNow = this.findLeval(val)
        },
        findLeval(val){
            let list = this.computerLevel.data
            let index, f = false
            for(var i in list){
                if(list[i].value == val){
                    index = i
                    f = true
                }
            }
            if(!f) return null
            return list[index]
        },
        findPlan(id){
            let list = this.planList.data
            let indexP, index, f = false
            for(var i in list){
                for(var j in list[i].planList){
                    if(list[i].planList[j].id == id){
                        indexP = i
                        index = j
                        f = true
                        break
                    }
                }
                if(f) break
            }
            if(!f) return null
            return list[indexP].planList[index]
        },
        cancel(){
            this.turnOff()
            this.$emit('takeFun', {
                fun: 'setBoardOff'
            })
        },
        getUserColorLevel(){
            if(this.$store.state.userLevel <= 0) return this.getUserColor()
            let goalDifference = this.$store.state.goalDifference
            this.colorSelect = goalDifference == 0 ? 1 : -1
            return this.colorSelect
        },
        getUserColor(type){
            if(type) return this.getUserColorLevel()
            if(this.colorSelect != 0) return this.colorSelect
            return this.randomColor()
            // let n = Math.round(Math.random())
            // n = n == 0 ? -1 : 1;
            // this.color = n
            // return n
        },
        randomColor(){
            let n = Math.round(Math.random())
            n = n == 0 ? -1 : 1;
            this.color = n
            return n
        },
        async confirmBefore(){
            // if(this.page != 'engineMenu')
            if(this.playType == 2){
                this.GLOBAL.clearBoardForLevel()
                // let levelGameType = this.GLOBAL.getLocalItem('levelGameType')
                // let levelGameLevel = this.GLOBAL.getLocalItem('levelGameLevel')
                // let levelGameTypeReal = this.$store.state.userLevel > 0 ? 'upgrade' : 'set'
                // if(levelGameType != levelGameTypeReal || levelGameLevel != this.computerLevel.value) this.GLOBAL.removeItem({levelBoard: ''})
                // this.GLOBAL.setItem({
                //     levelGameType: this.$store.state.userLevel > 0 ? 'upgrade' : 'set',
                //     levelGameLevel: this.computerLevel.value
                // })
            }
            this.color = this.getUserColor()
            // if(this.page == 'engine' || this.page == 'playEngine' || this.page == 'engineMenu') return true
            if(!this.planSetCheck()) return true
            if(this.playType != 1) return true
            if(!this.planNow.available.active){
                this.GLOBAL.MessageOpen({
                    message: this.planNow.available.txt
                })
                return false
            }
            this.LOADING.open()
            let res = await this.GLOBAL.planSet(this.planNow.id)
            this.LOADING.close()
            if(!res || res.code != 0){
                return false
            } 
            return true
        },
        async confirm(){
            let res = await this.confirmBefore()
            if(!res) return
            this.turnOff()
            this.$emit('takeFun', {
                fun: this.gameType[this.type].fun,
                data: null
            })
            this.setUserAtt()
        },
        setUserAtt(){
            this.GLOBAL.setUserAtt({
                komi: this.komiOpt.value,
                boardSize: this.sizeOpt.value,
                handicap: this.handicapOpt.value,
                minute: this.gameTime.minute.value,
                second: this.gameTime.second.value,
                num: this.gameTime.num.value,
                unavailable: this.gameTime.unavailable,
                minuteAI: this.gameTimeAI.minute.value,
                secondAI: this.gameTimeAI.second.value,
                numAI: this.gameTimeAI.num.value,
                computerLevel: this.computerLevel.value,
                colorSelect: this.colorSelect,
                planValue: this.planList.value,
                playType: this.playType,
                playSpeed: this.playSpeed
            })
        },
        turnOn(){
            this.turnOnBefore()
            .then(() => {
                this.status.active = true
            })
            
        },
        async turnOnBefore(){
            if(!this.gameType[this.type].page == 'engineMenu') return
            this.LOADING.open()
            // let res = await this.planInit()
            // .then(res => {
            //     return this.GLOBAL.userLevelInit()
            // })
            
            let res = await this.GLOBAL.userLevelInit()
            .then(res => {
                return this.cardPlanNowInit()
                .then(res => {
                    this.playTypeChange()
                    return this.planInit()
                })
            })
            return res
        },
        async cardPlanNowInit(){
            let res = await this.GLOBAL.cardPlanRemain()
            if(res && res.code == 0 && res.data){
                this.cardPlanNow = res.data
            }
            return res
        },
        async planInit(){
            this.LOADING.open()
            let res = await this.GLOBAL.enginePlan()
            if(res && res.code == 0){
                let planData = this.parsePlanList(res.data)
                // this.planList.data = this.parsePlanList(res.data)
                this.planList.data = planData.data
                if(!planData.flag){
                    this.planList.value = this.planList.data[0].planList[0].id
                    this.planNow = this.planList.data[0].planList[0]
                }
                if(this.$store.state.planValue != undefined){
                    this.planList.value = Number(this.$store.state.planValue)
                    this.planNow = this.findPlan(this.planList.value)
                }
            }
            this.LOADING.close()
            return
        },
        parsePlanList(list){
            let data = [], type, j = 0, i = 0, flag = false
            while(j <= list.length - 1){
                type = list[j].planType
                i = j
                data.push({
                    name: this.GLOBAL.planType[type].name,
                    planList: [],
                })
                data[data.length - 1].index = data.length - 1
                for(i = j; i < list.length; i++){
                    if(list[i].planType == type){
                        if(list[i].available){
                            list[i].available = {
                                active: true,
                                txt: '当前可用',
                                css: 'available',
                                txtCss: 'available'
                            }
                        }else{
                            let reason = this.GLOBAL.planUnavailableReason(list[i].unavailableReason) || {type: 2, txt: '当前不可用'}
                            list[i].available = {
                                active: false,
                                txt: reason.txt,
                                // css: reason.type != 1 ? 'unavailable' : 'available',
                                css: 'unavailable',
                                type: reason.type,
                                txtCss: 'unavailable'
                            }
                        }
                        data[data.length - 1].planList.push(list[i])
                        data[data.length - 1].planList[data[data.length - 1].planList.length - 1].index = data[data.length - 1].planList.length - 1
                        if(this.cardPlanNow && this.cardPlanNow.gpuPlanId == list[i].id && list[i].available){
                            this.planList.value = list[i].id
                            this.planNow = list[i]
                            flag = true
                        }
                    }else{
                        break
                    }
                }
                j = i
            }
            return {
                data: data,
                flag: flag
            }
        },
        turnOff(){
            this.status.active = false
            // this.$emit('takeFun', {
            //     fun: 'setBoardOff'
            // })
        },
        gameTimeDis(val){
            if(this.playType == 2) return
            // this.gameTime.unavailable = !this.gameTime.unavailable
            this.gameTime.unavailable = val
        },
        openModal(type){
            type = Number(type)
            this.type = type
            // this[this.gameType[type].fun]()
            this.turnOn()
        },
        colorChange(c){
            if(this.playType == 2) return
            this.colorSelect = c
        },
        pageInfoUpdate(localData){
            if(!localData || !this.GLOBAL.isObject(localData)) return false
            this.computerLevel.value = Number(localData.AILevel) || this.computerLevel.value
            this.playSpeed = localData.AIspeed == undefined ? this.playSpeed : Number(localData.AIspeed)
            this.sizeOpt.value = Number(localData.boardSize) || this.sizeOpt.value
            this.colorSelect = localData.color == undefined ? this.colorSelect : Number(localData.color)
            this.gameTime.unavailable = localData.countTime == undefined ? this.gameTime.unavailable : (localData.countTime == 0 ? true : false)
            this.handicapOpt.value = localData.handicap == undefined ? this.handicapOpt.value : Number(localData.handicap)
            this.komiOpt.value = localData.komi == undefined ? this.komiOpt.value : Number(localData.komi)
            if(localData.userGameTime){
                this.gameTime.minute.value = Number(localData.userGameTime.minute)
                this.gameTime.second.value = Number(localData.userGameTime.second)
                this.gameTime.num.value = Number(localData.userGameTime.num)
            }
            if(localData.AIGameTime){
                this.gameTimeAI.minute.value = Number(localData.AIGameTime.minute)
                this.gameTimeAI.second.value = Number(localData.AIGameTime.second)
                this.gameTimeAI.num.value = Number(localData.AIGameTime.num)
            }
            return true
        },
        panelInit(localData){
            if(this.pageInfoUpdate(localData)) return
            let unavailable = this.gameTime.unavailable
            if(this.$store.state.unavailable){
                try{
                    unavailable = eval(this.$store.state.unavailable)
                }catch(e){}
            }
            this.colorSelect = this.$store.state.colorSelect != undefined ? this.$store.state.colorSelect : this.colorSelect
            this.sizeOpt.value = this.$store.state.boardSize != undefined ? Number(this.$store.state.boardSize) : this.sizeOpt.value
            this.handicapOpt.value = this.$store.state.handicap != undefined ? Number(this.$store.state.handicap) : this.handicapOpt.value
            this.komiOpt.value = this.$store.state.komi != undefined ? Number(this.$store.state.komi) : this.komiOpt.value
            this.gameTime.minute.value = this.$store.state.minute != undefined ? Number(this.$store.state.minute) : this.gameTime.minute.value
            this.gameTime.second.value = this.$store.state.second != undefined ? Number(this.$store.state.second) : this.gameTime.second.value
            this.gameTime.num.value = this.$store.state.num != undefined ? Number(this.$store.state.num) : this.gameTime.num.value
            this.gameTimeAI.minute.value = this.$store.state.minuteAI != undefined ? Number(this.$store.state.minuteAI) : this.gameTimeAI.minute.value
            this.gameTimeAI.second.value = this.$store.state.secondAI != undefined ? Number(this.$store.state.secondAI) : this.gameTimeAI.second.value
            this.gameTimeAI.num.value = this.$store.state.numAI != undefined ? Number(this.$store.state.numAI) : this.gameTimeAI.num.value
            this.gameTime.unavailable = unavailable
            this.computerLevel.value = this.$store.state.computerLevel != undefined ? Number(this.$store.state.computerLevel) : this.computerLevel.value
            this.planList.value = this.$store.state.planValue != undefined ? Number(this.$store.state.planValue) : this.planList.value
            this.playType = this.$store.state.playType != undefined ? Number(this.$store.state.playType) : this.playType
            this.playSpeed = this.$store.state.playSpeed != undefined ? Number(this.$store.state.playSpeed) : this.playSpeed
        },
        pageInit(){
            this.sizeOpt.data = this.GLOBAL.size 
            this.handicapOpt.data = this.GLOBAL.handicap 
            this.komiOpt.data = this.GLOBAL.komi 
            this.gameTime.minute.data = this.GLOBAL.gameMinute 
            this.gameTime.second.data = this.GLOBAL.gameSecond 
            this.gameTime.num.data = this.GLOBAL.gameNum 
            this.gameTimeAI.minute.data = this.GLOBAL.gameMinute 
            this.gameTimeAI.second.data = this.GLOBAL.gameSecond 
            this.gameTimeAI.num.data = this.GLOBAL.gameNum 
            this.computerLevel.data = this.GLOBAL.computerLevel 
            this.playTypeOpt.data = this.GLOBAL.gameType
        },
        playTypeChange(type){
            type = type == undefined ? this.playType : type
            this.playType = type
            type == 2 ? this.levelGameChange() : this.normalGameChange()
        },
        getLevelAPI(){
            let data = this.computerLevel.data, val = this.computerLevel.value
            let api
            for(var i in data){
                if(data[i].value == val){
                    api = data[i].api
                    break
                }
            }
            return api
        },
        getLevelData(){
            let data = this.computerLevel.data, val = this.computerLevel.value
            let post
            for(var i in data){
                if(data[i].value == val){
                    post = this.GLOBAL.deepCopy(data[i])
                    break
                }
            }
            return post
        },
        pageCreate(){
            this.GLOBAL.userLevelInit()
        },
        levelMessageInit(){
            let type = this.$store.state.userLevel <= 0 ? 'upgrade': 'set'
            // setTimeout(() => {
            //     this.$refs['help'].changeMsg(this.GLOBAL.language.playPage[`${type}Notice`])
            // }, 1000);
        },
        levelGameChange(){
            // let par = this.GLOBAL.levelGameParSet
            // for(var i in par){
            //     if(!this.gameTime[i]) continue
            //     if(this.gameTime[i].value == undefined) this.gameTime[i] = par[i]
            //     else this.gameTime[i].value = par[i]
            // }
            // if(this.$store.state.userLevel <= 0) this.colorSelect = 0
            // else{
            //     this.colorSelect = this.$store.state.goalDifference != 0 ? -1 : 1
            // }
            this.getUserColorLevel()
            this.levelGameComputerInit()
            this.levelGameTimeInit()
            this.levelMessageInit()
        },
        levelGameTimeInit(level){
            level = level || this.computerLevel.value
            let par = this.GLOBAL.getLevelGameTime(level)
            for(var i in par){
                if(!this.gameTime[i]) continue
                if(this.gameTime[i].value == undefined) this.gameTime[i] = par[i]
                else this.gameTime[i].value = par[i]
            }
        },
        levelGameComputerInit(){
            let data = this.GLOBAL.deepCopy(this.computerLevel.data), maxLevel = this.$store.state.challengeLevel, realData = []
            for(var i in data){
                if(this.$store.state.userLevel <= 0){
                    if(Number(data[i].value) < Number(maxLevel)) realData.push(data[i])
                    continue
                }
                if(data[i].value == this.$store.state.userLevel){
                    realData.push(data[i])
                    break
                }
            }
            if(realData.length <= 0){
                if(this.$store.state.userLevel <= 0) realData.push(data[data.length - 1])
                else realData.push(data[0])
            }
            this.computerLevel.data = realData
            this.computerLevel.value = this.computerLevel.data[0].value
        },
        normalGameChange(){
            let unavailable = this.gameTime.unavailable
            if(this.$store.state.unavailable){
                try{
                    unavailable = eval(this.$store.state.unavailable)
                }catch(e){}
            }
            this.computerLevel.data = this.GLOBAL.computerLevel
            this.computerLevel.value = this.$store.state.computerLevel != undefined ? Number(this.$store.state.computerLevel) : this.computerLevel.value
            this.colorSelect = this.$store.state.colorSelect != undefined ? this.$store.state.colorSelect : this.colorSelect
            this.gameTime.minute.value = this.$store.state.minute != undefined ? Number(this.$store.state.minute) : this.gameTime.minute.value
            this.gameTime.second.value = this.$store.state.second != undefined ? Number(this.$store.state.second) : this.gameTime.second.value
            this.gameTime.num.value = this.$store.state.num != undefined ? Number(this.$store.state.num) : this.gameTime.num.value
            this.gameTimeAI.minute.value = this.$store.state.minuteAI != undefined ? Number(this.$store.state.minuteAI) : this.gameTimeAI.minute.value
            this.gameTimeAI.second.value = this.$store.state.secondAI != undefined ? Number(this.$store.state.secondAI) : this.gameTimeAI.second.value
            this.gameTimeAI.num.value = this.$store.state.numAI != undefined ? Number(this.$store.state.numAI) : this.gameTimeAI.num.value
            this.gameTime.unavailable = unavailable
        },
        gameModelCheck(){
            // let page = [
            //     '/engine/play/normal',
            //     '/engine/playEngine',
            //     `/engine/play/level/${this.$store.state.userLevel > 0 ? 'upgrade' : 'set'}`
            // ]
            let page = [
                '/engine/play/normal/game',
                '/engine/playEngine/game',
                `/engine/play/level/${this.$store.state.userLevel > 0 ? 'upgrade' : 'set'}/game`
            ]
            let playType = this.playType
            // this.$router.push({
            //     path: page[playType], 
            // })
            this.GLOBAL.jumpToPage(page[playType])
        },
        planSetCheck(){
            if(this.$store.state.engine_id) return false
            if(this.playType != 1) return false
            return true
        }
    },
    components: {
    },
    created(){
        // this.pageCreate()
        // this.sizeOpt.data = this.GLOBAL.size 
        // this.handicapOpt.data = this.GLOBAL.handicap 
        // this.komiOpt.data = this.GLOBAL.komi 
        // this.gameTime.minute.data = this.GLOBAL.gameMinute 
        // this.gameTime.second.data = this.GLOBAL.gameSecond 
        // this.gameTime.num.data = this.GLOBAL.gameNum 
    }
}
</script>  

<style lang="less">
    .set-board{
        .dialog-set-board{
            .el-dialog__header{
                padding: 0px 1rem;
                display: flex;
                // height: 2.8rem;
                height: 0px;
                align-items: center;
                // border-bottom: 1px solid #ccc;
                border: 0px;
                .el-dialog__title{
                    font-size: 0.8rem;
                }
            }
            .el-dialog{
                width: 29rem;
            }
            .el-dialog__body{
                // padding: 0px 1rem 1.5rem;
                padding: 0px;
            }
            .el-dialog__footer{
                .dialog-footer{
                    width: 100%;
                    height: 100%;
                    display: flex;
                    justify-content: flex-end;
                    align-items: center;
                    padding: 0px 1rem;
                }
                padding: 0px;
                height: 3.2rem;
                line-height: 3.2rem;
                border-top: 1px solid #ccc;
                padding: 0px 1rem;
                // .f-btn.a{
                //     width: 3rem;
                // }
                // .f-btn.b{
                //     width: 6rem;
                // }
                .f-btn{
                    padding: 0px;
                    // height: 1.75rem;
                }
                .f-btn.a{
                    // width: 3rem;
                    width: 6rem;
                    height: 1.84rem;
                    border-radius: 0px;
                }
                .f-btn.b{
                    width: 6rem;
                }
                .f-btn{
                    padding: 0px;
                    height: 1.75rem;
                }
            }
            .new-game-content{
                .set-board-dialog-title{
                    height: 2.8rem;
                    line-height: 2.8rem;
                    text-align: left;
                    .title-txt{
                        font-size: 0.8rem;
                    }
                    .engine-title{
                        padding: 0px 1rem;
                        border-bottom: 1px solid #ccc;
                    }
                    .play-title{
                        position: relative;
                        height: 100%;
                        display: flex;
                        .play-card.a{
                            left: 0px;
                            right: auto;
                        }
                        .play-card.b{
                            right: 0px;
                            left: auto;
                        }
                        .play-card.active{
                            color: #fff;
                        }
                        @cardWidth: 33.333%;
                        .play-card{
                            overflow: hidden;
                            cursor: pointer;
                            // width: 50%;
                            width: @cardWidth;
                            height: 100%;
                            float: left;
                            text-align: center;
                            // position: absolute;
                            top: 0px;
                            z-index: 2;
                        }
                        
                        .play-card-bcg.left{
                            left: 0px;
                            right: auto;
                        }
                        .play-card-bcg.right{
                            left: calc(@cardWidth + @cardWidth);
                            // left: @cardWidth;
                            right: 0px;
                        }
                        .play-card-bcg.middle{
                            left: @cardWidth;
                            right: auto;
                        }
                        .play-card-bcg{
                            transition: all .2s;
                            position: absolute;
                            top: 0px;
                            left: 0px;
                            width: @cardWidth;
                            height: 100%;
                            background: #409EFF;
                            z-index: 1;
                        }
                    }
                }
                .set-board-dialog-content{
                    padding: 1.5rem 1rem;
                }
                .item.c{
                    .item-con{
                        padding: 0px 0.5rem;
                        .c-item.disabled{
                            opacity: 0.6;
                            cursor: not-allowed;
                        }
                        .c-item{
                            cursor: pointer;
                            margin-right: 1.5rem;
                            display: flex;
                            align-items: center;
                            .c-radio.active{
                                background: #20BDBA;
                                .c-radio-sel{
                                    background: url('@{assetsUrl}p67.png') no-repeat;
                                    background-size: 100% 100%
                                }
                            }
                            .c-radio{
                                margin-right: 0.5rem;
                                width: 0.75rem;
                                height: 0.75rem;
                                border: 1px solid #ddd;
                                .c-radio-sel{
                                    width: 100%;
                                    height: 100%;
                                }
                            }
                        }
                        
                    }
                }
                .item.time{
                    margin-top: 0.5rem;
                }
                .item.play-speed{
                    .item-con{
                        padding: 0.5rem 0.2rem;
                        align-items: center;
                    }
                    
                }
                .item.border-btm{
                    border-bottom: 1px solid #ddd;
                    padding-bottom: 0.5rem
                }
                .item.pdi-top{
                    padding-top: 0.5rem
                }
                .item{
                    
                    .play-speed-slider{
                        height: 1.6rem;
                        width: 80%;
                        display: flex;
                        align-items: center;
                        .speed-slider-box{
                            width: 80%;
                            margin: 0px 0.5rem;
                        }
                        .txt{
                            width: 1rem;
                            color: #999;
                        }
                    }
                    
                    .play-speed-txt{
                        width: 3.5rem;
                        text-align: left;
                    }
                    font-size: 0.6rem;
                    align-items: center;
                    display: flex;
                    .item-title{
                        width: 3rem;
                        font-weight: 600;
                    }
                    
                    .item-con{
                        width: 25rem;
                        .el-input{
                            font-size: 0.6rem;
                        }
                        display: flex;
                        .in-play-select.item-con-i{
                            width: auto;
                        }
                        .item-con-i{
                            width: 33%;
                            padding: 0.5rem 0.2rem;
                        }
                        .item-con-i.level-game{
                            width: 66%;
                            .txt{
                                position: relative;
                                color: #999;
                            }
                        }
                        .plan-info{
                            display: flex;
                            align-items: center;
                            margin-left: 0.5rem;
                            .plan-status{
                                margin-left: 0.5rem;
                            }
                            .plan-status.available{
                                color: #03A60E;
                            }
                            .plan-status.unavailable{
                                color: red;
                            }
                            .or-price.delete{
                                text-decoration: line-through;
                            }
                            .real-price{
                                margin-left: 0.3rem;
                                color: #c51818
                            }
                        }
                        .el-input__icon{
                            line-height: 1.6rem;
                        }
                        .el-input__inner{
                            height: 1.6rem !important;
                            line-height: 1.6rem;
                            font-size: 0.6rem;
                        }
                        .in-play-select.p31{
                            .el-input:after{
                                background: url('@{assetsUrl}p31.png') no-repeat;
                                background-size: auto 100%;
                            }   
                        }
                        .in-play-select.p32{
                            .el-input:after{
                                background: url('@{assetsUrl}p32.png') no-repeat;
                                background-size: auto 100%;
                            }
                        }
                        .in-play-select.p33{
                            .el-input:after{
                                background: url('@{assetsUrl}p33.png') no-repeat;
                                background-size: auto 100%;
                            }
                        }
                        .in-play-info{
                            display: flex;
                            align-items: center;
                            margin-left: 0.5rem;
                            .level-game.txt{
                                color: #999;
                                position: relative;
                            }
                            .txt{
                                font-size: 0.6rem;
                                color: #FC0300;
                            }
                        }
                        .in-play-select{
                            position: relative;
                            @level-icon-width: 1.9rem;
                            @level-icon-height: 0.6rem;
                            @level-input-icon-width: 1.13rem;
                            .el-input{
                                padding-right: calc(@level-icon-width + @level-input-icon-width);
                                // padding-right: @level-input-icon-width;
                                display: flex;
                                border: 1px solid #DCDFE6;
                                width: 8rem;
                                height: 1.6rem;
                                overflow: hidden;
                                .el-input__suffix{
                                    width: @level-input-icon-width;
                                    right: 0px;
                                }
                            }
                            .el-input__inner{
                                height: auto;
                                padding-right: 1.13rem;
                                padding-right: 0px;
                                border: 0px;
                            }
                            .el-input:after{
                                content: '';
                                width: @level-icon-width;
                                height: @level-icon-height;
                                color: #fff;
                                position: absolute;
                                right: 1.13rem;
                                top: 0px;
                                bottom: 0px;
                                margin: auto;
                            }
                        }
                        
                    }
                }
            }
        }
    }
</style>