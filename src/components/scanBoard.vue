<!--  -->
<template>
    <div class='scan-board' v-show="show">
        <div class="photo-img-pre">
            <div class="photo-img-pre-body" ref="preBodyBox" v-if="imgPreStep">
                <div class="img-cropper-box" ref="imgCropperBox" :style="styleCul">
                    <imgCropper ref="imgCropper" 
                    :imgUrl.sync="imgUrl" 
                    :coors.sync="coors" 
                    :imgWidth.sync="imgWidth" 
                    :imgHeight.sync="imgHeight"
                    :offsetTop.sync="offsetTop"
                    :offsetLeft.sync="offsetLeft"
                    :imgType.sync="imgType"
                    @coorsCopyUpdate="coorsCopyUpdate"
                    ></imgCropper>
                </div>
                <div class="scan-notice">
                    <span class="txt">如果识别区域有误差，请手动修正</span>
                </div>
                <div class="photo-img-pre-foot">
                    <div class="pre-foot-item">
                        <el-button class="le-button main-button-bcg" @click="confirm">确定</el-button>
                    </div>
                    <div class="pre-foot-item">
                        <el-button class="le-button cancel-login-register-button-bcg cancel-re" @click="refresh">重置</el-button>
                    </div>
                    <div class="pre-foot-item">
                        <el-button class="le-button cancel-login-register-button-bcg cancel-re" @click="photoStart">
                            <span class="txt">重新拍照</span>
                        </el-button>
                    </div>
                    <div class="pre-foot-item">
                        <el-button class="le-button cancel-login-register-button-bcg cancel-re" @click="close">取消</el-button>
                    </div>
                </div>
            </div>
            <div class="board-pre" v-if="boardPreStep">
                <div class="board-pre-box">
                    <boardUseScan 
                    :boardId="'scanBoardElement'"
                    :size="boardSize" 
                    :background='background' 
                    ref="boardForScan" 
                    v-on:update="update" 
                    v-on:takeFun="takeFun" 
                    :coor.sync="coor"></boardUseScan>
                </div>
                 <!-- v-if="resultCul && resultCul.message" -->
                <div class="game-judge-msg" :class="{'visibility-hidden': !(resultCul && resultCul.message)}">
                    <span class="txt">{{resultCul.message}}</span>
                </div>
                <div class="photo-img-pre-foot">
                    <div class="pre-foot-item">
                        <el-button class="le-button cancel-login-register-button-bcg cancel-re" @click="photoStart">
                            <span class="txt">重新拍照</span>
                        </el-button>
                    </div>
                    <div class="pre-foot-item">
                        <el-button class="le-button main-button-bcg" @click="gameJudgeCon" :loading="gameJudge.loading" :class="{'active': gameJudge.active}">
                            <span class="txt">终局数子</span>
                        </el-button>
                    </div>
                    <div class="pre-foot-item">
                        <el-button class="le-button main-button-bcg" @click="gotoEngine">
                            <span class="txt">研究</span>
                        </el-button>
                    </div>
                    <div class="pre-foot-item">
                        <el-button class="le-button cancel-login-register-button-bcg cancel-re" @click="close">
                            <span class="txt">关闭</span>
                        </el-button>
                    </div>
                    
                    
                    
                </div>
            </div>
        </div>
        <div class="photo-template visibility-hidden" v-if="imgUrl">
            <img :src="imgUrl" ref="imgTem">
        </div>
        
        <input hidden type="file" accept="image/*" capture="camera" id="scanBoardElementPhoto" @change="scanBoardAction">
        <input hidden type="file" accept="image/*" id="scanBoardElementPicture" @change="scanBoardAction">
    </div>
</template>

<script>
    import boardUseScan from './board.vue'
    import imgCropper from './imgCropper.vue'
    // import simpleBoard from './simpleBoard.vue'

    export default {
        name: 'scanBoard',
        props: {
            coor: Number
        },
        data() {
            return {
                komi: 7.5,
                boardStyle: {},
                boardSize: 19,
                background: '../assets/BJ.jpg',
                position: 0,
                step:0,
                minJump: 0,
                show: false,
                imgUrl: null,
                status: 0,
                coors: [],
                realWidth: null,
                realHeight: null,
                imgWidth: null,
                imgHeight: null,
                offsetTop: 0,
                offsetLeft: 0,
                coorsCopy: [],
                imgId: null,
                imgRate: 0,
                boardStatus: false,
                boardStepDraw: null,
                scanBoardStep: null,
                result: null,
                gameJudge: {
                    active: false,
                    loading: false,
                    data: null
                },
                imgType: 1 // 1 -- 宽大于高，2 -- 高大于宽
            };
        },
        methods: {
            scan(){
                document.getElementById('scanBoardElement').click()
            },
            async scanBoardAction(e){
                let file = e.target.files[0]
                e.target.value = null
                this.LOADING.open()
                let res = await this.GLOBAL.scanBoardCheck(file)
                // for(var i in res){
                //     window.alert(i)
                //     window.alert(res[i])
                // }
                if(res && res.code == 0){
                    this.boardImgHandle(file, res.data)
                }
                // this.boardImgHandle(file, res.data)
                this.LOADING.close()
            },
            boardImgHandle(file, data){
                let fr = new FileReader()
                fr.onload = () => {
                    let rd = fr.result
                    if(!rd) return
                    this.imgUrl = rd
                    this.$nextTick(() => {
                        this.realSizeSet(data)
                    })
                }
                fr.readAsDataURL(file)
            },
            realSizeSet(data){
                this.$nextTick(() => {
                    this.open()
                    this.cropperSizeSet(data)
                })
            },
            update(options){
                for(var i in options){
                    this[i] = options[i]
                }
            },
            takeFun(opt){
                let fun = opt.fun
                if(this[fun]) this[fun](opt.data)
            },
            photoOpen(id){
                id = id || 'scanBoardElementPicture'
                document.getElementById(id).click()
            },
            photoStart(){
                this.pageInit()
                this.photoOpen()
            },
            pageInit(){
                this.status = 0
                this.imgUrl = null
                this.boardStatus = false
                this.coors = []
                this.imgWidth = null
                this.imgHeight = null
                this.imgType = 1
            },
            open(){
                this.show = true
            },
            close(){
                this.show = false
            },
            cropperSizeSet(data){
                data = data || {}
                this.imgId = data.boardid
                try{
                    data.detectionresult = data.detectionresult.split(',')
                }catch(e){}
                this.$nextTick(() => {
                    
                    let realWidth = this.$refs['imgTem'].offsetWidth
                    let realHeight = this.$refs['imgTem'].offsetHeight
                    this.imgType = realWidth >= realHeight ? 1 : 2
                    this.$nextTick(() => {
                        let width = this.$refs['imgCropperBox'].offsetWidth
                        let height = this.$refs['imgCropperBox'].offsetHeight
                        this.imgWidth = width
                        this.imgHeight = height
                        this.imgRate = (width / realWidth).toFixed(4)
                        for(var i in data.detectionresult){
                            data.detectionresult[i] = Number((data.detectionresult[i] * this.imgRate).toFixed(4))
                        }
                        console.log(data.detectionresult)
                        this.coors = data.detectionresult
                    })
                    
                })
            },
            async confirm(){
                if(!this.imgId || !this.coorsCopy || this.coorsCopy.length <= 0) return false
                this.LOADING.open()
                let coors = this.GLOBAL.deepCopy(this.coorsCopy)
                
                for(var i in coors){
                    coors[i] = (coors[i] / this.imgRate).toFixed(0)
                }
                let res = await this.GLOBAL.scanBoardCheckIdentify(this.imgId, coors)
                this.LOADING.close()
                if(res && res.code == 0){
                    
                    try{
                        res.data.identificationResult = res.data.identificationResult.split(',')
                    }catch(e){}
                    if(!res.data.identificationResult || !this.GLOBAL.isArray(res.data.identificationResult)) return
                    this.scanBoardHandle(res.data.identificationResult)
                }
                console.log(res)
            },
            scanBoardHandle(data){
                let size = 19
                let board = Array(size*size)
                let step = [], c = 1, drawStep = []
                for(var i in data){
                    let tem1 = Number(i) % size
                    let tem2 = parseInt(i / size)
                    // let k = ((size - 1) - tem1) * size + tem2
                    let k = i
                    let val = 0
                    data[i] = Number(data[i])
                    if(data[i] != 2){
                        if(data[i] == 1) val = 1
                        if(data[i] == 0) val = -1
                    }
                    if(val == 0) continue
                    board[k] = val
                    let coor = this.GLOBAL.coor1to2(k, size)
                    if(c != val){
                        step.push(-1)
                        c = -c
                    }
                    step.push(k)
                    drawStep.push({
                        coor: k,
                        x: coor.x,
                        y: coor.y,
                        c: c,
                        type: 'REALISTIC'
                    })
                    c = -c
                }
                this.status = 1
                this.scanBoardStep = step
                this.addStoneInBoardCon(drawStep)
            },
            addStoneInBoardCon(step){
                this.$nextTick(() => {
                    if(!this.boardStatus){
                        this.boardStepDraw = step
                        return
                    }
                    this.addStoneInBoard(step)
                })
            },
            addStoneInBoard(step){
                let opt = []
                // this.$refs['boardForScan'].board.addStone(step)
                if(!this.scanBoardStep || !this.scanBoardStep.length || !this.$refs['boardForScan']) return
                this.$refs['boardForScan'].loadSgf(this.scanBoardStep)
                this.$refs['boardForScan'].board.removeStoneLabelAction()
            },
            boardHasInit(){
                this.boardStatus = true
                if(this.boardStepDraw === null) return
                this.addStoneInBoard(this.GLOBAL.deepCopy(this.boardStepDraw))
                this.boardStepDraw = null
            },
            coorsCopyUpdate(data){
                if(!data) return
                this.coorsCopy = data
            },
            refresh(){
                this.$refs['imgCropper'].refresh()
            },
            async gameJudgeCon(){
                return this.gameJudge.active ? this.gameJudgeOff() : this.gameJudgeOn()
            },
            async gameJudgeOn(){
                let step = this.scanBoardStep
                if(!step || !step.length) return
                this.gameJudge.active = true
                this.gameJudge.loading = true
                let res = await this.GLOBAL.engineJudgeForPlay(step.join(','))
                console.log(res)
                if(res && res.code == 0){
                    if(this.GLOBAL.isObject(res.data) && res.data.owner) res.data = res.data.owner
                    let data = res.data
                    if(!this.GLOBAL.isObject(data)) data = this.GLOBAL.parseJudge(data)
                    this.gameJudgeHandledcnn(data)
                }
                 this.gameJudge.loading = false
            },
            gameJudgeOff(){
                this.gameJudge.active = false
                this.gameJudge.loading = false
                this.result = null
                this.$refs['boardForScan'].gameJudgeOffPlay()
            },
            gameJudgeHandledcnn(data){
                let result = this.$refs['boardForScan']['gameJudgeOn'](data)
                this.result = result
                this.$nextTick(() => {
                    console.log(this.resultCul)
                })
            },
            gotoEngineCheck(){
                let path = this.$route.path
                // if(!this.$store.state.username || path.indexOf('/engine/analyse') > -1) return false
                if(!this.$store.state.username || this.$store.state.engine_id) return false
                return true
            },
            async gotoEngine(){
                console.log(this.scanBoardStep)
                if(!this.gotoEngineCheck()) return this.gotoAnalyseAction()
                let res = await this.GLOBAL.startAnalyseOpen()
                if(res && res.code == 0) this.gotoAnalyseAction()
            },
            gotoAnalyseAction(){
                let board = this.scanBoardStep
                let localData = this.GLOBAL.getLocalItem('engine')
                try{
                    localData = JSON.parse(localData)
                }catch(e){}
                if(!localData) localData = {}
                localData.sgf = board
                delete localData.sgfInfo
                delete localData.sgfId
                localData.loadSgfStatus = 1
                this.GLOBAL.setItem({
                    'engine': JSON.stringify(localData)
                })
                let path = this.$route.path
                if(path.indexOf('/engine/analyse') > -1){
                    this.$emit('takeFun', {
                        fun: 'pageReload'
                    })
                }else{
                    this.GLOBAL.gotoEngine()
                }   
                this.close()
            },
        },
        created() {
            // this.boardWidth = window.scree
        },
        components: {
            boardUseScan,
            imgCropper,
            // simpleBoard
        },
        computed: {
            styleCul(){
                let type = this.imgType || 1
                let css = {}
                let t1 = type == 1 ? 'width' : 'height'
                let t2 = type == 1 ? 'height' : 'width'
                css[t1] = '30rem'
                css[t2] = 'auto'
                return css
            },
            resultCul(){
                let result = this.result
                if(!result) return {}
                if(!result.final){
                    return {
                        message: this.GLOBAL.errorMsg['main'].judge,
                    }
                }
                result.komi = this.komi
                let reStone = this.GLOBAL.countResult(result)
                let color = reStone < 0 ? 1 : reStone == 0 ? 0 : -1, type = 2
                let message

                let winColor = color == 1 ? '白胜' : '黑胜'
                let winNum = this.GLOBAL.decimalsToFractional(Math.abs(reStone))
                if(reStone == 0) message = '无胜负'
                else{
                    message = `${winColor}${winNum}子`
                }
                console.log(message)
                return {
                    message: message
                }
                // this.resignSet({
                //     color: color,
                //     type: type,
                //     winNum: Math.abs(reStone),
                //     w: result.w,
                //     b: result.b,
                //     e: result.e
                // })

            },
            imgPreStep(){
                return this.imgUrl && this.status == 0
            },
            boardPreStep(){
                return this.status == 1
            },
            boardPreStep(){
                return this.status == 1
            },
            imgUrlCul(){
                return this.imgUrl || null
            },
            refreshDisabled(){
                let coors = this.coors
                let coorsCopy = this.coorsCopy
                return coors.join(',') == coorsCopy.join(',')
            },
        },
        watch: {},
        mounted() {
            if(!this.$refs['preBodyBox']) return
            this.offsetTop = this.$refs['preBodyBox'].offsetTop
            this.offsetLeft = this.$refs['preBodyBox'].offsetLeft
            // this.$refs['leConfirm'].open()
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
    .scan-board{
        // position: ;
        .van-popup{
            height: 100%;
            z-index: 9999 !important;
        }
        .img-box{
            width: 100vw;
            height: 100vw;
            padding: 1rem;
            img{
                width: 100%;
            }
        }
        .photo-img-pre{
            position: fixed;
            background: rgba(0, 0, 0, 0.6);
            top: 0px;
            left: 0px;
            // width: 100vw;
            // height: 100vh;
            width: 100%;
            height: 100%;
            z-index: 9999;
            display: flex;
            justify-content: center;
            align-items: center;
            .board-pre{
                // width: 90vw;
                // height: 90vw;
                width: 30rem;
                height: 30rem;
                margin: 0px auto;
                .board-pre-box{
                    width: 100%;
                    height: 100%;
                    background: url('@{assetsUrl}board_bcg.jpg') no-repeat;;
                }
            }
            .photo-img-pre-body{
                // height: 90vw;
                margin: 0px auto;
                width: 90vw;
                .img-cropper-box{
                    width: 90vw;
                    display: inline-block;
                }
                .scan-notice{
                    margin: 0.5rem 0px;
                }
            }
        }
        .photo-img-pre-foot{
            margin-top: 1rem;
            display: flex;
            width: 30rem;
            margin: 0px auto;
            justify-content: center;
            .pre-foot-item{
                width: 25%;
                padding: 0px 0.5rem;
                .el-button{
                    width: 100%;
                    height: 1.7rem;
                    margin: 0px auto;
                }
            }
            // .el-button{
            //     width: 25%;
            //     margin: 0px auto;
            // }
            .el-button.active{
                background: #fff;
                color: #333;
            }
        }
        .scan-type-box{
            position: fixed;
            background: rgba(0, 0, 0, 0.6);
            top: 0px;
            left: 0px;
            width: 100vw;
            height: 100vh;
            z-index: 999;
            display: flex;
            justify-content: center;
            align-items: center;
            .scan-type-body{
                width: 100%;
                .type-item:last-child{
                    margin: 0px auto;
                }
                .type-item{
                    width: 60%;
                    height: 2.5rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0px auto;
                    border-radius: 2.5rem;
                    margin-bottom: 2rem;
                    .body{
                        .txt{
                            margin-left: 0.5rem;
                        }
                    }
                }
                
            }
            .scan-type-foot{

            }
        }
        .photo-template{
            position: fixed;
            top: 0px;
            left: 0px;
            z-index: -1;
        }
        .game-judge-msg{
            display: flex;
            align-items: center;
            justify-content: center;
            margin-top: 0.3rem;
            height: 1.5rem;
        }
    }
</style>