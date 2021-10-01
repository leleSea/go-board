<!--  -->
<template>
   <div class='game-sgf-info'>
       <div class="game-info-basic page-panel-bcg">
            <div class="basic-item a">
                <div class="item-i a">
                    <div class="it a user-photo">
                        <div class="rotatef r"  v-show="(playNow == 1 && !gameOver && !noneColor)">
                            <div class="item A"></div>
                            <div class="item B"></div>
                            <div class="item C"></div>
                            <div class="item D"></div>
                            <div class="item E"></div>
                            <div class="item F"></div>
                        </div>
                        <div class="photo-box">
                            <photoCom ref="photoCom" :noneColor.sync="noneColor" :photo.sync="blackPhotoCul" :size="photoSize" :stoneSize="stoneSize" :stoneBorderWidth="stoneBorderSize" color="b" stoneBorderClass="page-panel-bcg-border"></photoCom>
                        </div>
                        <!-- <div class="user-result br" v-show="!gameOver">
                            <img class="img" :src="`${GLOBAL.assetsUrl}/img/${resign.colorKey != 'b' ? 'r7' + theme : 'r8' + theme}.png`" alt="">
                        </div> -->
                    </div>
                    <div class="it b user-name">
                        <span class="txt">{{$t(blackName)}}</span>
                    </div>
                    <div class="player-level">
                        <span class="txt">{{$t(blackLevelCul.txt)}}</span>
                        <img v-if="blackLevelCul.icon" class="ai-level-icon" :src="`${GLOBAL.assetsUrl}/img/${blackLevelCul.icon}.png`" alt="">
                    </div>
                </div>
                <div class="item-i b">
                    <ul class="i-body">
                        <li>{{ $t('黑贴') }}{{$t(komiCul.label)}}</li>
                        <li>{{ $t('第') }}{{position}}{{ $t('手') }}</li>
                        <li>
                            <span v-show="!gameTimeCul.unavailable">{{gameTimeCul.minute}}{{ $t('分钟') }} {{gameTimeCul.second}}{{ $t('秒') }}{{gameTimeCul.num}} {{ $t('次') }} </span>
                            <span v-show="gameTimeCul.unavailable">{{ $t('不计时') }}</span>
                        </li>
                        <li>
                            <span class="a remove-b">{{removeCul.w}}</span>
                            <span class="b remove-txt">{{ $t('提子') }}</span>
                            <span class="c remove-w">{{removeCul.b}}</span>
                        </li>
                    </ul>
                </div>
                <div class="item-i c">
                    <div class="it a user-photo">
                        <div class="rotatef l"  v-show="(playNow == -1 && !gameOver && !noneColor)">
                            <div class="item A"></div>
                            <div class="item B"></div>
                            <div class="item C"></div>
                            <div class="item D"></div>
                            <div class="item E"></div>
                            <div class="item F"></div>
                        </div>
                        <!-- <div class="user-result wr" v-show="resign.active">
                            <img class="img" :src="`${GLOBAL.assetsUrl}/img/${resign.colorKey != 'w' ? 'r7' + theme : 'r8' + theme}.png`" alt="">
                        </div> -->

                        <div class="photo-box">
                            <photoCom ref="photoCom" :noneColor.sync="noneColor" :photo.sync="whitePhotoCul" :size="photoSize" :stoneSize="stoneSize" :stoneBorderWidth="stoneBorderSize"  color="w" stoneBorderClass="page-panel-bcg-border"></photoCom>
                        </div>
                    </div>
                    <div class="it b user-name">
                        <span class="txt">{{$t(whiteName)}}</span>
                    </div>
                    <div class="player-level">
                        <span class="txt">{{$t(whiteLevelCul.txt)}}</span>
                        <img v-if="whiteLevelCul.icon" class="ai-level-icon" :src="`${GLOBAL.assetsUrl}/img/${whiteLevelCul.icon}.png`" alt="">
                    </div>
                </div>
            </div>
            <div class="basic-item b" v-show="!gameOver" v-if="false">
                <div class="basic-item-time" :class="{'hide': gameTimeCul.unavailable || gameOver}">
                    <div class="item-i a">
                        <div class="it ita">
                            <!-- <span v-show="!timeAvailableBlack">-</span> -->
                            <!-- <span>10分00秒</span> -->
                            <!-- <div class="it-i" v-show="startReadBlack && timeAvailableBlack">
                                <div class="m sec">
                                    <div class="is l">
                                        <div class="time-per ">
                                            <div class="time-per-body">
                                                <div class="time-per-body-warning"></div>
                                            </div>
                                        </div>
                                        <div class="time-txt">30</div>
                                    </div>
                                </div>
                            </div> -->
                            <span class="txt" v-if="blackTimeCul.unavailable">-</span>
                            <gameTimeCom ref="gameTimeBlack" 
                            v-if="!blackTimeCul.unavailable"
                            @update="blackUpdate"
                            :minute="blackTimeCul.minute" 
                            :second="blackTimeCul.second" 
                            :num="blackTimeCul.num"></gameTimeCom>
                        </div>
                        <div class="it itb">{{ $t('剩余时间') }}</div>
                        <div class="it ita">
                            <!-- <span v-show="!timeAvailableWhite">-</span> -->
                            <!-- <span>10分00秒</span> -->
                            <!-- <div class="it-i" v-show="startReadWhite && timeAvailableWhite">
                                <div class="m sec">
                                    <div class="is r" >
                                        <div class="time-txt">{{countTimeWhite.s}}</div>
                                        <div class="time-per" >
                                            <div class="time-per-body" :style="timeSet['w'].per">
                                                <div class="time-per-body-warning" v-show="timeSet['w'].perNum <= timeWarning && colorObj[now] == 'w'"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div> -->
                            <span class="txt" v-if="whiteTimeCul.unavailable">-</span>
                            <gameTimeCom ref="gameTimeWhite" 
                            v-if="!whiteTimeCul.unavailable"
                            @update="whiteUpdate"
                            :minute="whiteTimeCul.minute" 
                            :second="whiteTimeCul.second" 
                            :num="whiteTimeCul.num"></gameTimeCom>
                        </div>
                    </div>
                    <div class="item-i b">
                        <div class="it ita">
                            <div v-if="blackTimeCul.unavailable">-</div>
                            <div v-if="!blackTimeCul.unavailable">
                                <div class="it-i">{{blackTimeCul.second}}秒{{blackTimeCul.num}}次</div>
                                <!-- <div class="spe-info">{{passInfo['b']}}</div> -->
                            </div>
                        </div>
                        <div class="it itb">{{ $t('读秒') }}</div>
                        <div class="it ita">
                            <!-- <div v-show="gameTime.unavailable || gameInfo.userKey == 'b'">-</div> -->
                            <div v-if="whiteTimeCul.unavailable">-</div>
                            <div v-if="!whiteTimeCul.unavailable">
                                <div class="it-i">{{whiteTimeCul.second}}秒{{whiteTimeCul.num}}次</div>
                                <!-- <div class="spe-info" v-show="passInfo['w']">{{passInfo['w']}}</div> -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
   </div>
</template>

<script>
    import gameTimeCom from './gameTimeCom.vue'


    export default {
        name: 'gameSgfInfo',
        props: {
            username: String,
            coor: Number,
            userRole: String,
            theme: String,
            playNow: Number,
            gameOver: Boolean,
            photo: String,
            photoSize: String,
            stoneSize: String,
            stoneBorderSize: String,
            whitePhoto: String,
            blackPhoto: String,
            blackName: String,
            whiteName: String,
            komi: Number,
            position: Number,
            gameTime: Object,
            remove: Object,
            blackTime: Object,
            whiteTime: Object,
            startReadBlack: Boolean,
            startReadWhite: Boolean,
            blackLevel: Number,
            whiteLevel: Number,
            noneColor: Boolean
        },
        data() {
            return {
                blackTimeTem: null,
                whiteTimeTem: null,
            };
        },
        methods: {
            blackUpdate(time){
                this.blackTimeTem = time
            },
            whiteUpdate(time){
                this.whiteTimeTem = time
            },
        },
        created() {

        },
        components: {
            gameTimeCom
        },
        computed: {
            blackTimeCul(){
                let time = this.blackTimeTem || {}
                let def = {minute: 0, second: 0, num: 0}
                // if(!time || time.minute == undefined) return def
                return time
            },
            whiteTimeCul(){
                let time = this.whiteTimeTem || {}
                let def = {minute: 0, second: 0, num: 0}
                if(!time) return def
                return time
            },
            blackLevelCul(){
                let level = this.blackLevel
                if(!level) return {}
                let data = this.GLOBAL.getLevel(level)
                return {txt: data.label, icon: data.icon}
            },
            whiteLevelCul(){
                let level = this.whiteLevel
                if(!level) return {}
                let data = this.GLOBAL.getLevel(level)
                return {txt: data.label, icon: data.icon}
            },
            countTimeBlack(){
                let time = this.blackTime
                let t = {}, s
                if(time.readSec){
                    t = {m: '00', s: '00'}
                    s = time.amount
                }else{
                    t = this.timeFormat(time.amount).showT
                    s = time.second
                }
                return {
                    t: t, s: s
                }
            },
            countTimeWhite(){
                let time = this.timeSet['w']
                let t = {}, s
                if(time.readSec){
                    t = {m: '00', s: '00'}
                    s = time.amount
                }else{
                    t = this.timeFormat(time.amount).showT
                    s = time.second
                }
                return {
                    t: t, s: s
                }
            },
            timeAvailableBlack(){
                if(!this.blackTime) return false
                return true
            },
            timeAvailableWhite(){
                if(!this.whiteTime) return false
                return true
            },
            removeCul(){
                let remove = {
                    w: 0,
                    b: 0
                }
                return this.remove || remove
            },
            gameTimeCul(){
                let gameTime = {
                    minute: 0,
                    second: 0,
                    num: 0,
                }
                if(!this.gameTime) return gameTime
                return this.gameTime
            },
            komiCul(){
                let komi = this.komi || 7.5
                let komiObj = this.GLOBAL.getKomi(komi)
                return komiObj
            },
            defaultPhotoBlack(){
                let path = this.GLOBAL.userPhotoDefault.blackPath
                return `${this.GLOBAL.assetsUrl}/user_photo/${path}`
            },
            defaultPhotoWhite(){
                let path = this.GLOBAL.userPhotoDefault.whitePath
                return `${this.GLOBAL.assetsUrl}/user_photo/${path}`
            },
            defaultPhoto(){
                let path = this.GLOBAL.userPhotoDefault.path
                return `${this.GLOBAL.assetsUrl}/user_photo/${path}`
            },
            blackPhotoCul(){
                if(!this.blackPhoto) return this.defaultPhotoBlack
                return this.blackPhoto
            },
            whitePhotoCul(){
                if(!this.whitePhoto) return this.defaultPhotoWhite
                return this.whitePhoto
            },
        },
        watch: {
            blackTime: {
                handler(val){
                    this.blackTimeTem = this.GLOBAL.deepCopy(val)
                },
                immediate: true,
                deep: true
            },
            whiteTime: {
                handler(val){
                    this.whiteTimeTem = this.GLOBAL.deepCopy(val)
                },
                immediate: true,
                deep: true
            },
        },
        mounted() {
            // this.$refs['gameTimeBlack'].restart()
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
<style lang='less' >
    .game-sgf-info{
        .game-info-basic{
            // background: #6A707E;
            width: 100%;
            padding: 1.5rem 1.5rem 1rem;
            margin-bottom: 1.25rem;
            .basic-item.a{
                position: relative;
                // margin-bottom: 2rem;
                display: flex;
                .play-label{
                    position: absolute;
                    top: -0.5rem;
                    left: 0px;
                    width: 100%;
                    height: 0.1rem;
                    .play-label-body{
                        width: 7.5rem;
                        height: 100%;
                        background: #000;
                    }
                }
                .photo-body.xingzhen{
                    background: url('@{assetsUrl}p68.png') no-repeat;
                    background-size: 100%;
                }
                .photo-body.user{
                    background: url('@{assetsUrl}photo2.png') no-repeat;
                    background-size: 100%;
                }
                .a.user-photo{
                    .photo-box{
                        .photo-body{
                            // padding: 0.3rem;
                        }
                    }
                }
                .item-i.c{
                    .a.user-photo{
                        .stone-label{
                            left: -0.5rem;
                            right: auto;
                        }
                        
                    }
                }
                .item-i.a{
                    .a.user-photo{
                        .stone-label{
                            right: -0.5rem;
                            left: auto;
                        }
                        
                    }
                }
                .item-i.c{
                    text-align: right;
                    width: 5rem;
                }
                .item-i.a{
                    text-align: left;
                    width: 5rem;
                }
                .item-i.b{
                    text-align: left;
                    width: 13rem;
                    text-align: center;
                    position: relative;
                }
                .item-i{
                    // color: #fff;
                    // width: 33.33%;
                    .a.user-photo{
                        position: relative;
                        // padding: 0.3rem;
                        // background: @userPhotoBcg;
                        display: inline-block;
                        .stone-label{
                            width: 1.5rem;
                            height: 1.5rem;
                            position: absolute;
                            bottom: -0.5rem;
                        }
                        .photo-body{
                            width: 100%;
                            height: 100%;
                            .photo-img{
                                width: 100%;
                                height: auto;
                            }
                        }
                        
                        .user-result.br{
                            left: -1rem;
                            right: auto;
                        }
                        .user-result.wr{
                            right: -1rem;
                            left: auto;
                        }
                        .user-result{
                            position: absolute;
                            width: 2rem;
                            height: 2rem;
                            bottom: -0.7rem;
                            top: auto;
                            z-index: 2;
                            img{
                                width: 100%;
                                height: 100%;
                            }
                        }
                    }
                    .a{
                        // width: 7.5rem;
                        // height: 7.5rem;
                        width: 5rem;
                        height: 5rem;
                        margin-bottom: 0.75rem;
                    }
                    .b.user-name{
                        width: 3.5rem;
                        text-align: center;
                        display: inline-block;
                        // color: #fff;
                        font-size: 0.9rem;
                    }
                    .b.user-name{
                        width: 100%;
                        display: flex;
                        white-space: nowrap;
                        align-items: center;
                        justify-content: center;
                        .ai-level{
                            margin-left: 0.25rem;
                        }
                        .ai-name-box{
                            .ai-level-icon{
                                height: 0.6rem;
                                margin-left: 0.2rem;
                            }
                            
                        }
                        
                    }
                    
                }
                .item-i.b{
                    .it.b{
                        font-size: 0.7rem;
                        padding: 0.2rem 0.5rem;
                        display: inline-block;
                    }
                    .it.b.game-result.show{
                        visibility: visible;
                    }
                    .it.b.game-result.hide{
                        visibility: hidden;
                    }
                    .it.b.game-result{
                        height: 1.4rem;
                        text-align: center;
                        line-height: 1.4rem;
                        padding: 0px;
                        position: absolute;
                        top: auto;
                        bottom: -2rem;
                        font-size: 1rem;
                        .txt{
                            font-size: 1rem;
                        }
                    }
                    .it.b.win{
                        // background: #F0F9EB;
                        // color: #67C23A;
                    }
                    .it.b.lose{
                        // background: #FEF0F0;
                        // border-color: #fde2e2;
                        // color: #F56C6C;
                    }
                    .i-body{
                        padding: 0px 2.3rem;
                        // height: 7.5rem;
                        // margin-bottom: 0.75rem;
                        li{
                            
                            padding: 0px;
                            height: 20%;
                            line-height: 1.5rem;
                            // border-bottom: 1px solid #7C7F88;
                            border-bottom: 1px solid @optionsTableBorder;
                            font-size: 0.7rem;
                            .remove-txt{
                                font-size: 0.7rem;
                                margin: 0px 0.5rem;
                            }
                            // .info-txt{
                            //     max-width: 5.75rem;
                            //     text-align: center;
                            //     margin: 0px auto;
                            // }
                        }
                        li:last-child{
                            border: 0px;
                        }
                        
                    }
                }
            }
            
            .basic-item.b{
                position: relative;
                margin-top: 2rem;
                .basic-item-time{
                    padding: 0px 0.75rem;
                }
                .basic-item-time.hide{
                    opacity: 0;
                }
                // color: #fff;
                .item-i.a{
                    border-bottom: 1px solid #9A999C;
                }
                .item-i.result-icon{
                    position: absolute;
                    top: -2rem;
                    left: 0px;
                    width: 100%;
                    display: block;
                    .result-icon-item:first-child{
                        float: left;
                    }
                    .result-icon-item:last-child{
                        float: right;
                    }
                    .result-icon-item{
                        width: 5rem;
                        text-align: center;
                        .img{
                            display: inline-block;
                            width: 3rem;
                            height: 3rem;
                        }
                        // .img.lose{
                        //     background: url('@{assetsUrl}r8.png') no-repeat;
                        //     background-size: 100% 100%;
                        // }
                        // .img.win{
                        //     background: url('@{assetsUrl}r7.png') no-repeat;
                        //     background-size: 100% 100%;
                        // }
                    }
                }
                .item-i{
                    padding: 0.5rem 0px;
                    display: flex;
                    .ita{
                        width: 35%;
                        position: relative;
                        .spe-info{
                            position: absolute;
                            bottom: -1rem;
                            width: 100%;
                            text-align: center;
                        }
                    }
                    .itb{
                        width: 30%;
                    }
                }
            }
        }
        .player-level{
            display: flex;
            align-items: center;
            justify-content: center;
            .ai-level-icon{
                width: 0.7rem;
                margin-left: 0.1rem;
            }
        }
        .rotatef.l{
            left: -0.45rem;
            // left: calc(-1.5rem / 3 + 0.15rem);
        }
        .rotatef.r{
            right: -0.45rem;
            // right: calc(-1.5rem / 3 + 0.15rem);
        }
        .rotatef{
            z-index: 2;
            position:absolute;
            bottom: -0.4rem;
            // bottom: calc(-1.5rem / 3 + 0.15rem);
            -webkit-transform: rotateX(-33.5deg) rotateY(45deg);
            transform: rotateX(-33.5deg) rotateY(45deg);
            transform-style:preserve-3d;
            width:1.5rem;
            height:1.5rem;
            -webkit-animation: thinking 2s infinite;
            animation: thinking 2s infinite;
            .item{
                width:1.5rem;
                height:1.5rem;
                float:left;
                position:absolute;
                top:0px;
                left:0px;
                opacity: 0.3;
            }
            .item.A{
                background:#FF0000;
                transform:rotateX(90deg);
                top:-0.75rem;
                background: -webkit-radial-gradient(#fff, #2196F3);
                background: -o-radial-gradient(#fff, #2196F3);
                background: -moz-radial-gradient(#fff, #2196F3);
                background: radial-gradient(#fff, #2196F3);
            }
            .item.B{
                background:#FFFF00;
                transform:rotateX(90deg);
                top:0.75rem;
                background: radial-gradient(#fff, #2196F3);
            }
            .item.C{
                background:#008000;
                transform: translateZ(0.75rem);
                background: radial-gradient(#fff, #2196F3);
            }
            .item.D{
                background:#FF9800;
                transform: translateZ(-0.75rem);
                background: radial-gradient(#fff, #2196F3);
            }
            .item.E{
                background:#673AB7;
                transform:rotateY(90deg);
                left:0.75rem;
                background: radial-gradient(#fff, #2196F3);
            }
            .item.F{
                background:#2196F3;
                transform:rotateY(90deg);
                left:-0.75rem;
                background: radial-gradient(#fff, #2196F3);
            }
        }
    }
    
</style>