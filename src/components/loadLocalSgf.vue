<!--  -->
<template>
    <div class='load-local-sgf'>
        <leConfirm ref="uploadSgfBox">
            <template v-slot:message>
                <div class="upload-sgf-box">
                    <div class="upload-title">
                        <span class="txt">{{$t('打开本地棋谱')}}</span>
                        <div class="upload-small-title">
                            <span class="txt">{{$t(`请上传后缀为：${GLOBAL.getLoadFileTypeTxt()}的文件`)}}</span>
                        </div>
                    </div>
                    
                    <div class="upload-sgf-body">
                        <input type="file" hidden ref="loadSgf" id="loadSgfBtnComponents" @change="selectedFile">
                        <div class="upload-item content">
                            <el-tooltip placement="top-start" effect="light" :content="$t('请上传后缀为：.sgf 的文件')">
                                <el-input type="text" v-model="loadSgfData.name" disabled></el-input>
                            </el-tooltip>
                        </div>
                        <div class="upload-item btn">
                            <el-button class="menu-selected-bcg" onClick="loadSgfBtnComponents.click()">
                                <span class="txt">{{ $t('选择') }}</span>
                            </el-button>
                        </div>
                    </div>
                    
                </div>
            </template>
        </leConfirm>
    </div>
</template>

<script>
import SgfParse from '../SgfParse.js'

    export default {
        name: 'loadLocalSgf',
        props: {},
        data() {
            return {
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
                SgfParse: new SgfParse(),
                pathNow: null,
                hasBoard: false
            };
        },
        methods: {
            selectedFile(e){
                // let file = e.target.files[0]
                // let postfix = file.name.substring(file.name.lastIndexOf('.') + 1, file.name.length)
                // if(!this.GLOBAL.checkLoadSgfSuffix(file.name)){
                //     let type = this.GLOBAL.getLoadFileTypeTxt()
                //     this.errorNotice(this.$i18n.t('请上传正确的文件，文件后缀为：') + type)
                //     return
                // }
                
                // var fReader=new FileReader();
                // fReader.onload=() =>{
                //     if(fReader.result){
                //         this.loadSgfData.file = file
                //         this.loadSgfData.name = file.name
                //         let fileData = fReader.result
                //         let suffix = this.GLOBAL.fileSuffixGet(this.loadSgfData.name)
                //         suffix = suffix.toLowerCase()
                //         let sgfData = this.parseSgfFile(fileData, suffix)
                //         this.selectedFileHandle(sgfData)
                //     }else{
                //         this.errorNotice('棋谱为空！')
                //         if(document.querySelector('#loadSgfBtnComponents')){
                //             document.querySelector('#loadSgfBtnComponents').value = ''
                //         }
                //         return
                //     }
                // }
                // fReader.readAsText(file,'utf-8');


                let file = e.target.files[0]
                let postfix = file.name.substring(file.name.lastIndexOf('.') + 1, file.name.length)
                if(!this.GLOBAL.checkLoadSgfSuffix(file.name)){
                    let type = this.GLOBAL.getLoadFileTypeTxt()
                    this.errorNotice(this.$i18n.t('请上传正确的文件，文件后缀为：') + type)
                    return
                }
                if(!this[`parse_${postfix}`]) return
                this[`parse_${postfix}`](e)
            },
            selectedFileHandle(sgfData){
                if(!sgfData || !sgfData.normal) return
                this.loadSgfData.area.min = 1
                this.loadSgfData.area.max = sgfData.normal.length
                this.loadSgfData.area.value = [1, sgfData.normal.length]
                let sgfInfo = this.GLOBAL.deepCopy(this.GLOBAL.sgfInfo)
                let fileInfo = sgfData.info
                this.loadSgfData.info = this.GLOBAL.deepCopy(sgfData.info)
                for(var i in sgfInfo){
                    if(fileInfo[i]){
                        sgfInfo[i].value = fileInfo[i]
                    }
                }
                sgfInfo.fileName = {label: '文件名', value: ''}
                sgfInfo.fileName.value = this.GLOBAL.fileNameFilter(this.loadSgfData.name)
                this.loadSgfData.sgfData = sgfData.normal
                this.loadSgfData.gtp = sgfData.gtp
                this.loadSgfData.sgfInfo = sgfInfo
                this.loadSgfData.moves = sgfData.moves
                this.loadSgfData.sgfUsernameDefine = sgfData.sgfUsernameDefine
                this.loadSgfData.sgfId = sgfData.sgfId || null
            },
            parseSgfFile(fileData, type){
                return this.SgfParse.parseSgfFile(fileData, type)
            },
            open(){
                this.$refs['uploadSgfBox'].open({
                    button: [
                        {name: '打开', fun: this.loadSgfConfirm},
                        {name: '取消', fun: this.loadSgfCancel, type: 'cancel'},
                    ]
                })
            },
            loadSgfConfirm(){
                if(this.gotoEnginePlayNew){
                    this.$emit('loadSgfConfirm', this.loadSgfData)
                    return
                }
                let data = this.loadSgfData.moves || ''
                try{
                    data = data.join(',')
                }catch(e){
                    data = ''
                }
                let localData = this.GLOBAL.getLocalDataByType('engine')
                delete localData['sgfInfo']
                delete localData['sgfId']
                delete localData['positionSetByQuery']
                localData.sgf = data
                this.GLOBAL.setItem({
                    'engine': JSON.stringify(localData)
                })
                this.GLOBAL.gotoEngine()
            },
            loadSgfCancel(){
                this.$refs['uploadSgfBox'].close()
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
            parse_sgf(e){
                if(!e || !e.target.files) return
                let file = e.target.files[0]
                var fReader=new FileReader();
                fReader.onload=() =>{
                    if(fReader.result){
                        this.loadSgfData.file = file
                        this.loadSgfData.name = file.name
                        let fileData = fReader.result
                        let suffix = this.GLOBAL.fileSuffixGet(this.loadSgfData.name)
                        suffix = suffix.toLowerCase()
                        let sgfData = this.parseSgfFile(fileData, suffix)
                        this.selectedFileHandle(sgfData)
                    }else{
                        this.errorNotice('棋谱为空！')
                        if(document.querySelector('#loadSgfBtnComponents')){
                            document.querySelector('#loadSgfBtnComponents').value = ''
                        }
                        return
                    }
                }
                fReader.readAsText(file,'utf-8');
                // fReader.readAsText(file,'gb2312');
            },
            async parse_gib(e){
                if(!e || !e.target.files) return
                this.LOADING.open()
                let file = e.target.files[0]
                this.loadSgfData.file = file
                this.loadSgfData.name = file.name
                let suffix = this.GLOBAL.fileSuffixGet(this.loadSgfData.name)
                suffix = suffix.toLowerCase()
                let sgfData = await this.SgfParse.parseSgfFileGib(file, suffix)
                this.LOADING.close()
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
                    setStone: [],
                    moves: []
                }
                let color = 1
                for(var i in moves){
                    let coor = this.GLOBAL.coor1to2(moves[i])
                    let gtp = this.GLOBAL.coorNtoS(coor.x, coor.y)
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
                data.moves = moves
                this.selectedFileHandle(data)
            },
        },
        created() {

        },
        components: {
        },
        computed: {
            getLoadFileTypeTxt(){
                return this.GLOBAL.getLoadFileTypeTxt()
            },
            gotoEnginePlayNew(){
                let path = this.pathNow
                let list = {
                    '/engine/analyse': true,
                    '/engine/report': true,
                    '/engine/play': true,
                    'engine/lifeAndDeath': true
                }
                let f = false
                for(var i in list){
                    if(path.indexOf(i) > -1){
                        f = true
                        break
                    }
                }
                return f
            },
            gotoEnginePlay(){
                let path = this.pathNow
                if(!this.hasBoard) return true
                let list = {
                    '/engine/live': true,
                    '/engine/subject': true
                }
                let f = false
                for(var i in list){
                    if(path.indexOf(list[i]) > -1){
                        f = true
                        break
                    }
                }
                return f
            },
        },
        watch: {
            $route: {
                handler(){
                    this.pathNow = this.$route.path
                    this.hasBoard = false
                    this.$nextTick(() => {
                        let ele = document.querySelector('.board .wgo-board')
                        if(!ele) this.hasBoard = false
                        else this.hasBoard = true
                    })
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
</style>