<template>
    <div class='game-result' v-show="panelSwitch"  @mousemove="panelMousemove">

        <div class="game-result-new page-panel-bcg" :class="{'win': resultData.isWin, 'lose': !resultData.isWin}">
            <div class="gs-title">
                <div class="game-result-title" :class="{'win': resultData.isWin, 'lose': !resultData.isWin}">
                    <div class="title-bcg"></div>
                    <div class="title-img-box">
                        <img :src="`${GLOBAL.assetsUrl}/img/${resultData.isWin ? 'r10' : 'r12'}.png`" class="img-label">
                        <img :src="`${GLOBAL.assetsUrl}/img/${resultData.isWin ?  this.$i18n.t('r11') : this.$i18n.t('r13')}.png`" class="img-txt">
                    </div>
                </div>
            </div>
            <div class="gs-content">
                <div class="aa ai flex-center">
                    <span class="result-txt" v-if="!resultData.finalGame">{{$t(resultData.txt)}}</span>
                    <span class="result-txt" v-else>
                        {{resultData.winColor == 'b' ? $t('黑胜') : $t('白胜')}}
                        <!-- <span class="result-txt" v-if="resultData.winNum && resultData.winNum > 0 && resultData.komi != 6.5">
                            {{resultData.winNum | decimalsToFractional}}{{ $t('子')  }}
                        </span>
                        <span class="result-txt" v-if="resultData.winNum && resultData.winNum > 0 && resultData.komi == 6.5">
                            {{resultData.winNum}}{{ $t('目')  }}
                        </span> -->
                        <span class="result-txt" v-if="resultData.winNum && resultData.winNum > 0">
                            {{resultData.winNum | decimalsToFractional}}{{ $t('子')  }}
                        </span>
                    </span>
                </div>
                <p class="ac ai" v-show="resultData.resultType == 2">
                    <span class="result-txt">
                    </span>
                </p>
                <p v-if="resultData.message" class="ac ai result-txt" :class="{'win': resultData.isWin, 'lose': !resultData.isWin}" v-html="$t(resultData.message.content)">
                </p>
            </div>
            <div class="foot-btn">
                <div class="foot-btn-item" v-if="!engineDisabled">
                    <el-button class="btn-i" v-on:click.stop="gotoEngine">{{ $t('分析研究') }}</el-button>
                </div>
                <div class="foot-btn-item" v-if="!reportDisabled">
                    <el-button class="btn-i" v-on:click.stop="gotoReport">
                        {{ lang != 'ko' ? $t('生成报告index') :  $t('生成报告')}}
                    </el-button>
                </div>
                <div class="foot-btn-item">
                    <el-button class="btn-i" v-on:click.stop="playAgain">{{ $t('再来一盘') }}</el-button>
                </div>
            </div>
        </div>
        <div class="user-cert game-result-modal" v-show='certDisplayCul'  ref="golaxyCertBox">
            <div class="user-cert-box">
                <div class="user-cert-body">
                    <div class="cert-box-border-item a"></div>
                    <div class="cert-box-border-item b"></div>
                    <div class="cert-box-border-item c"></div>
                    <div class="cert-box-border-item d"></div>
                    <golaxy-cert ref="golaxyCert"  :hideBoard="true" :scale="0.812" :certInfo.sync="certInfo"></golaxy-cert>
                </div>
                <div class="user-cert-foot foot-btn">
                    <div class="foot-btn-item">
                        <el-button class="btn-i" v-on:click.stop="certClose">{{ $t('确定') }}</el-button>
                    </div>
                    <div class="foot-btn-item">
                        <el-button class="btn-i" v-on:click.stop="certShare">{{ $t('分享成就') }}</el-button>
                    </div>
                </div>
            </div>
        </div>
        <pageShare ref="pageShare" :modal="false"></pageShare>
    </div>
</template>

<script>
import golaxyCert from './golaxyCert.vue'
import pageShare from './pageShare.vue'
    export default {
        name: 'gameResult',
        props: {
            page: String,
            blackPhoto: String,
            whitePhoto: String,
            theme: String,
            gameJudgeSelected: Boolean,
            position: Number,
            step: Number,
        },
        data() {
            return {
                lang: 'zh',
                certAction: true,
                certInfo: {},
                panelSwitch: false,
                resultData: {},
                keyPosition: {
                    active: false,
                    top: 0,
                    left: 0
                },
                panelCss: {},
                photoSize: '3.5rem',
                stoneSize: '1rem',
                boardSize: 19
                // stoneSize: '1rem',
            };
        },
        methods: {
            handleClose() {
                this.panelSwitch = false
                this.keyPosition = {
                    active: false,
                    top: 0,
                    left: 0
                }
                this.panelCss = {}
                this.$emit('takeFun', {
                    fun: 'gameResultClose'
                })
            },
            open(){
                this.panelSwitch = true
            },
            setResult(opt){
                // this.resultData = this.GLOBAL.deepCopy(opt)
                this.propsInit(opt)
                this.resultDataHandle(opt)
                this.certInfo = this.certHandle(opt)
                this.open()
            },
            propsInit(opt){
                this.certAction = true
                if(opt.certClose) this.certAction = !opt.certClose
            },
            certHandle(opt){
                let data = {}
                if(!opt.message || !opt.message.cert) return data
                let level = this.GLOBAL.getLevel(this.$store.state.highestLevel)
                data = {
                    name: this.$store.state.nickname || this.$store.state.username,
                    // date: this.formateDate(),
                    // num: this.formateNum(),
                    level: this.$store.state.highestLevel,
                    gameId: opt.message.gameId
                    // level: 300,
                    // gameId: 750
                }


                
                // data.name = this.$store.state.nickname || this.$store.state.username
                // data.date = this.GLOBAL.getDateNow()
                // let num = this.GLOBAL.deepCopy(data.date)
                // if(num.year < 10) num.year = '0' + num.year
                // if(num.month < 10) num.month = '0' + num.month
                // if(num.day < 10) num.day = '0' + num.day
                // num = '' + `${num.year}${num.month}${num.day}`
                // data.date = `${data.date.year}年${data.date.month}月${data.date.day}日`
                
                
                // data.num = num
                // data.level = this.GLOBAL.getLevel(opt.message.level)
                // data.level = data.level.label
                return data
            },
            formateDate(date){
                date = date || this.$store.state.certificateDate
                return `${date.date.year}年${date.date.month}月${date.date.day}日`
            },
            formateNum(date){
                if(this.$store.state.certificate) return this.$store.state.certificate
                date = date || this.GLOBAL.deepCopy(this.$store.state.certificateDate)
                if(Number(date.date.year) < 10) date.date.year = '0' + date.date.year
                if(Number(date.date.month) < 10) date.date.month = '0' + date.date.month
                if(Number(date.date.day) < 10) date.date.day = '0' + date.date.day
                return `${date.date.year}${date.date.month}${date.date.day}`
            },
            readResult(opt){
                let key = opt.isWin ? 'win' : 'lose'
                let time = opt.time == undefined ? 1000 : opt.time
                if(!opt.noneVoice){
                    setTimeout(() => {
                        this.GLOBAL.playAction('result', key)
                    }, time);
                }
            },
            resultPassCheck(data, opt){
                opt = opt || {}
                if(opt.komi != 6.5) return data
                let moves = opt.moves
                try{
                    moves = moves.split(',')
                }catch(e){}
                if(!this.GLOBAL.isArray(moves)) return data
                let color = null, c = 1
                for(var i in moves){
                    if(moves[i] == '' || moves[i] == ' '){
                        continue
                    }
                    if(moves[i] == -1){
                        color = c
                        break
                    }
                    c = -c
                }
                if(color === null || color == 1) return data
                return data - 0.5
            },
            resultDataHandle(data){
                let result = data
                this.boardSize = data.boardSize || 19
                console.log(data)
                result.komiShow = (data.komi / 2).toFixed(2)
                this.readResult(result)
                this.sgfTemplate = data.sgf
                if(data.color == 0 || data.resultType != 2){
                    this.resultData = this.GLOBAL.deepCopy(data)
                    return
                }
                let txt = ''
                let re = this.countResult(result, data)
                re = this.resultPassCheck(re, data)
                let reCopy = Number(re)
                result.finalGame = true
                re = this.GLOBAL.decimalsToFractional(Math.abs(re))
                if(reCopy > 0) {
                    txt = `黑胜：${re}子`
                    result.winColor = 'b'
                }else{
                    txt = `白胜：${re}子`
                    result.winColor = 'w'
                }
                result.txt = txt
                this.resultData = this.GLOBAL.deepCopy(data)
            },
            countResult(data){
                let komi = data.komi
                return this.GLOBAL.countResult(data)
            },
            getPassColor(data){
                if(!this.GLOBAL.isArray(data)) data = data.split(',')
                let c = 1, passColor = null
                for(var i in data){
                    if(data == -1){
                        passColor = c
                        break
                    }
                    c = -c
                }
                let komi = 6.5
                if(c == 1) komi = 6.5
                if(c == -1) komi = 7.5
                return komi
            },
            playAgain(){
                this.$emit('takeFun', {
                    fun: 'playAgain'
                })
                this.handleClose()
            },
            async gotoEngine(){
                // this.$emit('takeFun', {
                //     fun: 'gotoEngine'
                // })
                // return
                // if(!this.$store.state.username) return this.gotoEngineAction()
                // if(this.$store.state.engine_id) return this.gotoEngineAction()
                // let res = await this.GLOBAL.startAnalyseOpen()
                // if(res && res.code == 0){
                //     this.gotoEngineAction()
                // }
                if(this.$store.state.username) await this.GLOBAL.startAnalyseOpen()
                this.gotoEngineAction()
            },
            gotoEngineAction(){
                this.setEngineData()
                this.GLOBAL.gotoEngine()
            },
            setEngineData(){
                let resultData = this.resultData || {}
                let sgfId = resultData.sgfId
                let saveData = {}
                if(sgfId === undefined){
                    if(resultData.moves !== undefined) saveData.sgf = resultData.moves
                    if(resultData.sgfInfo !== undefined) saveData.sgfInfo = resultData.sgfInfo
                }else{
                    saveData.sgfId = resultData.sgfId
                }
                if(this.position !== undefined) saveData.positionSetByQuery = this.position
                this.GLOBAL.setItem({
                    'engine': JSON.stringify(saveData)
                })
            },
            gotoReport(){
                // this[`gotoEngine${this.page}`]()
                this.$emit('takeFun', {
                    fun: 'gotoReport'
                })
            },
            gotoEnginelevel(){
                this.$emit('takeFun', {
                    fun: 'gotoEnginelevel'
                })
                // this.setItem({
                //     'board': this.GLOBAL.getLocalItem('levelBoard')
                // })
                // this.gotoEngineplay()
            },
            gotoEngineplay(){
                this.$router.push({
                    path: '/engineMenu', 
                    query: {
                        takeFun: 'engineStart',
                        sgfData: this.sgfTemplate
                    }
                })
            },
            gotoEngineplayEngine(){
                this.$router.push({
                    path: '/engine',
                })
            },
            panelMousedown(e){
                this.keyPosition = {
                    active: true,
                    top: e.layerY,
                    left: e.layerX
                }
                this.panelCss['cursor'] = 'move'
                this.$forceUpdate()
            },
            panelMouseup(e){
                this.keyPosition.active = false
                this.panelCss['cursor'] = 'auto'
                this.$forceUpdate()
            },
            panelMousemove(e){
                if(!this.keyPosition.active) return
                let left = e.x, top = e.y
                let rtop = top - this.keyPosition.top, rleft = left - this.keyPosition.left
                this.panelCss['top'] = `${rtop}px`
                this.panelCss['left'] = `${rleft}px`
                this.panelCss['right'] = 'auto'
                this.panelCss['bottom'] = 'auto'
                this.$forceUpdate()
            },
            certShare(){
                // let certInfo = this.GLOBAL.deepCopy(this.certInfo)
                // let certNum = certInfo.num
                // let certName = certInfo.name
                // let certLevel = certInfo.level
                // let certDate = certInfo.date
                // certNum = btoa(encodeURIComponent(certNum))
                // certName = btoa(encodeURIComponent(certName))
                // certLevel = btoa(encodeURIComponent(certLevel))
                // certDate = btoa(encodeURIComponent(certDate))
                // certInfo = `${certNum}/${certName}/${certLevel}/${certDate}`
                // let url =  `${GLOBAL_CONFIG.SHARE_URL}/certificate/${certInfo}`
                // this.$refs['pageShare'].turnOn(url)


                let level = btoa(encodeURIComponent(this.certInfo.level)) 
                let gameId = btoa(encodeURIComponent(this.certInfo.gameId))  
                let username = btoa(encodeURIComponent(this.$store.state.username))  
                let certInfo = `${level}/${gameId}/${username}`
                let url =  `${GLOBAL_CONFIG.SHARE_URL}/certificate/${certInfo}`
                this.$refs['pageShare'].turnOn(url)
            },
            certClose(){
                this.certAction = false
                this.$emit('takeFun', {
                    fun: 'gameCertClose'
                })
            },
            gameJudgeCon(){
                this.$emit('gameJudgeCon')
            },
        },
        created() {

        },
        components: {
            golaxyCert,
            pageShare,
        },
        computed: {
            engineDisabled(){
                return this.boardSize != 19
            },
            reportDisabled(){
                return this.boardSize != 19
            },
            judgeSwitchShow(){
                return this.resultData.resultType == 2
            },
            gameAreaJudgeShow(){
                let position = this.position || 0
                let step = this.step || 0
                let gameJudgeSelected = this.gameJudgeSelected
                return gameJudgeSelected
            },
            certDisplayCul(){
                let data = false
                if(this.resultData && this.resultData.message && this.resultData.message.cert && this.certAction) data = true
                return data
            },
            txtContentStyle(){
                let style = {}
                // style['min-width'] = `calc(100% - (${this.photoSize} + ${this.stoneSize} + 0.1rem) * 2)`
                style['min-width'] = `calc(100% - ${this.photoSize} * 2)`
                return style
            }
        },
        watch: {
            languageLang: {
                handler(val){
                    this.lang = 'zh'
                    try{
                        this.lang = val.i18n.locale
                    }catch(e){}
                },
                deep: true,
                immediate: true
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
<style lang='less' >
    .game-result-modal{
        background: rgba(0, 0, 0, 0.6);
    } 
    .game-result> .el-dialog__body{
        padding: 1rem;
        // padding-bottom: 1rem;
        background: #353434;
        color: #fff;
    }
    .game-result{
        @panelWidth: 31.25rem;
        @panelHeight: 14rem;
        @panelHeightCert: 31.5rem;
        @panelPadding: 0.5rem;
        @panelPaddingSide: 1rem;
        @panelFootHeight: 2rem;
        @closeIconH: 1.2rem;
        @closeIconH2: 4rem;
        // position: absolute;
        top: 0px;
        left: 0px;
        width: 100%;
        // height: 100%;
        z-index: 999;
        .aa.ai{
            .result-txt{
                font-size: 0.9rem;
            }
        } 
        .ab.ai{
            .result-txt{
                font-size: 0.8rem;
            }
        } 
        .el-dialog__header{
            padding: 0px;
        }
        // .el-dialog__body{
        //     padding: 1rem;
        //     // padding-bottom: 1rem;
        //     background: #353434;
        //     color: #fff;
        // }
        .el-dialog__headerbtn{
            top: 0.2rem;
            right: 0.2rem;
            .el-dialog__close{
                font-size: 1rem;
            }
        }
        .result-box-body.move{
            cursor: move;
        }
        .result-box-body.cert{
            height: @panelHeightCert;
            .game-result .foot-btn .foot-btn-item{
                width: 24.25%;
            }
        }
        .result-box-body{
            color: #fff;
            position: relative;
            width: @panelWidth;
            height: @panelHeight;
            // background: #353434;
            background: rgba(0,0,0,0.8);
            position: absolute;
            top: 0px;
            left: 0px;
            bottom: 0px;
            right: 0px;
            margin: auto;
            // padding: @panelPadding;
            .title-close-icon{
                position: absolute;
                top: 0.5rem;
                right: 0.5rem;
                z-index: 999;
                .close-icon-i{
                    cursor: pointer;
                    color: #606266;
                    font-size: 1.3rem;
                    font-weight: 600;
                }
            }
            .content-title{
                position: relative;
                .content-drag-box{
                    position: absolute;
                    top: 0px;
                    left: 0px;
                    width: 100%;
                    height: 100%;
                    z-index: 998;
                    
                }
            }
            
            .game-result-title.win{
                background-image: linear-gradient(to right, rgba(193,126,8, 0.8) , rgba(74, 48, 6, 0.7));
            }
            .game-result-title.lose{
                background-image: linear-gradient(to right, rgba(130,128,127, 0.8) , rgba(55,56,56, 0.7));
            }
            
            .close-icon{
                // position: absolute;
                // top: 0.2rem;
                // right: 0.2rem;
                height: @closeIconH;
                line-height: @closeIconH;
                padding-right: 0.2rem;
                display: flex;
                align-items: center;
                justify-content: flex-end;
                cursor: pointer;
                .close-icon-i{
                    color: #606266;
                    font-size: 1rem;
                    font-weight: 600;
                }
            }
            .result-dia-body{
                padding: 0px @panelPaddingSide 0px @panelPaddingSide;
            }
        }
        .result-sub-j{
            // margin-top: 0.5rem;
            .ai:last-child{
                margin: 0px;
            }
            .ai{
                text-align: center;
                margin-bottom: 0.5rem;
                .ai-i{
                    margin-right: 0.5rem;
                    
                }
                .ai-i.result-txt{
                    font-size: 0.7rem;
                    color: #999;
                }
                .ai-i:last-child{
                    margin: 0px;
                }
            }
        }
        .result-sub-t{
            img{
                width: 10rem;
            }
        }
        .content{
            min-height: calc(@panelHeight - @panelPadding * 2 - @panelFootHeight - @closeIconH2);
            display: flex;
            width: 100%;
            justify-content: center;
            align-items: center;
        }
        .foot-btn{
            // margin-top: 1.5rem;
            // padding: 0px @panelPaddingSide @panelPadding @panelPaddingSide;
            padding: @panelPadding;
            display: flex;
            .foot-btn-item:last-child{
                margin: 0px;
            }
            .foot-btn-item{
                // width: 33.33%;
                // padding: 0rem 0.5rem;
                // width: 32.33%;
                width: 100%;
                padding: 0px;
                margin-right: 2.5%;
            }
            .btn-i:active{
                background: #3962B9;
            }
            .btn-i:active{
                transform: scale(0.99);
                background: #5986BB;
            }
            .btn-i:disabled{
                opacity: 0.6;
            }
            .btn-i{
                margin-right: 1rem;
                padding: 0px;
                width: 100%;
                height: 1.85rem;
                line-height: 1.85rem;
                text-align: center;
                background: #5986BB;
                color: #fff;
                border: 0px;
            }
            .btn-i:last-child{
                margin: 0px;
            }
        }
        // .cert-box{
        //         width: 100%;
        //         padding: 1.5rem;
        //         position: relative;
        //         background: #7EA0C3;
        //         .cert-img{
        //             width: 100%;
        //         }
        //         @cert-box-border-size: 0.2rem;
        //         @cert-box-border-color: #A8C7E7;
        //         .cert-box-border-item{
        //             position: absolute;
        //             width: 4rem;
        //             height: 2.5rem;
        //         }
        //         .cert-box-border-item.a{
        //             top: 0.5rem;
        //             left: 0.5rem;
        //             border-top: @cert-box-border-size solid @cert-box-border-color;
        //             border-left: @cert-box-border-size solid @cert-box-border-color;
        //         }
        //         .cert-box-border-item.b{
        //             top: 0.5rem;
        //             right: 0.5rem;
        //             border-top: @cert-box-border-size solid @cert-box-border-color;
        //             border-right: @cert-box-border-size solid @cert-box-border-color;
        //         }
        //         .cert-box-border-item.c{
        //             bottom: 0.5rem;
        //             left: 0.5rem;
        //             border-bottom: @cert-box-border-size solid @cert-box-border-color;
        //             border-left: @cert-box-border-size solid @cert-box-border-color;
        //         }
        //         .cert-box-border-item.d{
        //             bottom: 0.5rem;
        //             right: 0.5rem;
        //             border-bottom: @cert-box-border-size solid @cert-box-border-color;
        //             border-right: @cert-box-border-size solid @cert-box-border-color;
        //         }
        //     }
        .user-cert{
            @cert-padding: 1.5rem;
            @cert-box-border-color: #A8C7E7;
            @cert-box-border-size: 0.3rem;
            padding: 0.5rem 1rem;
            .user-cert-body{
                padding: @cert-padding;
                position: relative;
                background: #7EA0C3;
            }
            // padding: 0.5rem @panelPaddingSide @panelPadding @panelPaddingSide;
            @cert-size: calc((@panelWidth - @cert-padding * 2 - 2rem) / 2);
            .golaxy-cert-new{
                .cert-board{
                    width: @cert-size;
                    height: @cert-size;
                }
                .cert-m-content{
                    margin-left: 1rem;
                    width: @cert-size;
                    height: @cert-size;
                    .cert-m-content-con{
                        height: 11.75rem;
                        .cert-m-content-body{
                            .m-item.np{
                                margin: 0.3rem 0px;
                                .txt{
                                    font-size: 0.7rem;
                                }
                            }
                            .m-item.title{
                                width: 5rem;
                            }
                            .m-item.wo{
                                .txt{
                                    font-size: 1.3rem;
                                }
                            }
                        }
                    }
                }
            }
            .cert-box-border-item{
                position: absolute;
                width: 4rem;
                height: 2.5rem;
            }
            .cert-box-border-item.a{
                top: 0.5rem;
                left: 0.5rem;
                border-top: @cert-box-border-size solid @cert-box-border-color;
                border-left: @cert-box-border-size solid @cert-box-border-color;
            }
            .cert-box-border-item.b{
                top: 0.5rem;
                right: 0.5rem;
                border-top: @cert-box-border-size solid @cert-box-border-color;
                border-right: @cert-box-border-size solid @cert-box-border-color;
            }
            .cert-box-border-item.c{
                bottom: 0.5rem;
                left: 0.5rem;
                border-bottom: @cert-box-border-size solid @cert-box-border-color;
                border-left: @cert-box-border-size solid @cert-box-border-color;
            }
            .cert-box-border-item.d{
                bottom: 0.5rem;
                right: 0.5rem;
                border-bottom: @cert-box-border-size solid @cert-box-border-color;
                border-right: @cert-box-border-size solid @cert-box-border-color;
            }
        }
        .photo-com{
            .photo-body{
                padding: 0.3rem;
            }
        } 





        // new
        .game-result-title{
            width: 100%;
            height: @closeIconH2;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            
            .title-close-icon{
                position: absolute;
                top: 0.5rem;
                right: 0.5rem;
                .close-icon-i{
                    cursor: pointer;
                    color: #606266;
                    font-size: 1.3rem;
                    font-weight: 600;
                }
            }
            
            // .title-bcg{
            //     position: absolute;
            //     left: 0px;
            //     top: 0px;
            //     width: 100%;
            //     height: 100%;
            //     background-image: linear-gradient(to right, rgba(198, 127, 5, 0.5) , rgba(74, 48, 6, 0.6));
            // }
            .title-img-box{
                // display: flex;
                
                img{
                    height: 2.5rem;
                }
                .img-label{
                    margin-right: 1rem;
                }
                .img-txt{
                }
            }
        }
        .game-result-new.win{
            .gs-title{
                background: #8E692A;
            }
        }
        .game-result-new.lose{
            .gs-title{
                background: #585858;
            }
        }
        .game-result-new{
            .foot-btn-item:last-child{
                margin: 0px;
            }
            .gs-title{
                .game-result-title{
                    height: 3rem;
                    .title-img-box{
                        img{
                            height: 1.7rem
                        }
                    }
                }
            }
            .gs-content{
                line-height: 1.8rem;
                padding: 1rem 0px 0.5rem;
            }
            .ac.ai.win{
                color: #FFBA00;
            } 
            .ac.ai.lose{
                color: #fff;
            } 
        }
        .ab.ai{
            @area-size: 0.8rem;
            display: flex;
            justify-content: center;
            .ai-i{
                display: flex;
                align-items: center;
                margin-right: 1rem;
                .public-icon{
                    margin-right: 0.5rem;
                    border-width: calc(@area-size / 2);
                }
            }
            .ai-i:last-child{
                margin: 0px;
            }
            .result-txt-label{
                width: @area-size;
                height: @area-size;
                margin-right: 0.5rem;
            }
            .result-txt-label.b{
                background: #000;
            }
            .result-txt-label.w{
                background: #fff;
            }
            .result-txt-label.p{
                background: red;
            }
        }
        .user-cert{
            position: fixed;
            top: 0px;
            left: 0px;
            width: 100%;
            height: 100%;
            z-index: 999;
            padding: 0px;
            display: flex;
            align-items: center;
            justify-content: center;
            .user-cert-box{
                background: rgba(0,0,0,0.7);
                padding: 1rem;
            }
            .user-cert-body{
                background: none;
            }
            .user-cert-foot{
                margin-top: 1rem;
                display: flex;
                padding: 0px 0.5rem;
                .foot-btn-item{
                    width: 50%;
                    margin-right: 7%;
                }
                .foot-btn-item:last-child{
                    margin: 0px;
                }
            }
        } 
        .result-judge-box{
            width: 1rem;
            height: 1rem;
            margin-left: 0.5rem;
            .judge-icon{
                width: 100%;
                float: left;
                cursor: pointer;
            }
        }
        .game-result-area{
            margin-top: 1rem;
            height: 3rem;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }
    
</style>