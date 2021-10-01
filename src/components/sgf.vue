<!--  -->
<template>
    <div class='sgf-hub-float'>
        <el-dialog
        title=""
        :visible="panelSwitch"
        :show-close="false"
        width="70vw"
        :close-on-click-modal="false"
        :before-close="turnOff">
            <div class="sgf-float-head">
                <lePageTitle ref="lePageTitle" :message="pageTitle" :icon="`${GLOBAL.assetsUrl}/img/enm15_dark.png`">
                    <div class="return-box" slot="webclass">
                        <!-- <img :src="`${GLOBAL.assetsUrl}/img/co2.png`"> -->
                        <span class="el-icon-circle-close hub-close-icon" @click="turnOff"></span>
                    </div>
                </lePageTitle>
            </div>
            <div class="sgf-float-content" v-if="panelSwitch">
                <sgfListCom ref="sgfListCom" :username.sync="username" model="float" @openSgfFloat="openSgfFloat"></sgfListCom>
            </div>
        </el-dialog>
        <le-confirm ref="leConfirm"></le-confirm>
        <saveEngineBoardPanel ref="saveEngineBoardPanel" @open="saveEngineBoardPanelOn" @close="saveEngineBoardPanelOff" :SgfParse.sync="SgfParse"></saveEngineBoardPanel>
        <createSituationFolder ref="createSituationFolder" :folderList.sync="folderList" @createFolderComplete="createFolderComplete"></createSituationFolder>
    </div>
</template>

<script>
    import sgfListCom from '@/views/sgfHub/sgfListCom.vue'
    import SgfParse from '../SgfParse.js'
    import saveEngineBoardPanel from './saveEngineBoardPanel.vue'
    import createSituationFolder from './createSituationFolder.vue'

    export default {
        name: 'sgfCom',
        props: {
        },
        data() {
            return {
                username: null,
                pageTitle: '棋谱库',
                _appData: null,
                sgfUsernameDefine: null,
                theme: 'light',
                folderList: [],
                sitSelectNode: null,
                openNodeType: null,
                pathNow: null,
                total: 0,
                enginePlanList: null,
                uploadOutside: false,
                komiOpt: {
                    value: null,
                    data: []
                },
                activeNow: [],
                sgfInfo: {},
                sgfLoading: false,
                sgfList: [],
                submenuOpenNow: null,
                page: 1,
                size: 8,
                totle: 0,
                amountPage: 0,
                panelSwitch: false,
                uploadSwitch: false,
                menuItemS: 1.2,
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
                    error: null,
                    sgfInfo: {
                      
                    }
                },
                listNew: [],
                defaultProps: {
                    children: 'children',
                    label: 'title'
                },
                list: [
                    {
                        sort: 2,
                        title: '我的棋谱', 
                        openStatus: false,
                        login: true,
                        submenu: [
                            {
                                title: 'AI对弈', command: 'AISgf'
                            },
                            {
                                title: '我的上传', command: 'myUpload'
                            },
                            {
                                title: '我的收藏', command: 'myFavourite', refresh: true
                            },
                            {
                                title: '分析报告', command: 'report',
                            },
                        ]
                    },
                    {
                        title: '公共棋谱', 
                        openStatus: false,
                        submenu: [
                            {title: '大赛棋谱', command: 'publicMatchSgf'},
                            // {title: 'AI比赛', command: 'publicAISgf'},
                            // {title: '星阵自对弈', command: 'publicPSSgf'}
                        ]
                    },
                ],
                listCopy: [],
                listOpenNow: null,
                openType: {
                    'AISgf': {
                        fun: 'AISgfInit', API: 'getSgfList'
                    },
                    'myFavourite': {
                        fun: 'myFavouriteInit', API: 'getSgfFavourite'
                    },
                    'myUpload': {
                        fun: 'myUploadInit', API: 'getSgfList'
                    },
                    'report': {
                        fun: 'reportInit', API: 'reportList'
                    },
                    'publicMatchSgf': {
                        fun: 'publicMatchSgfInit', API: 'publicMatchSgfList'
                    },
                    'publicAISgf': {
                        fun: 'publicAISgfInit', API: 'publicAISgfList'
                    },
                    'publicPSSgf': {
                        fun: 'publicPSSgfInit', API: 'publicPSSgfList'
                    },
                    'studentSgfOpen': {
                        fun: 'studentSgfOpenInit', API: 'getSgfList'
                    },
                    'engineSgfOpen': {
                        fun: 'engineSgfOpenInit', API: 'getEngineSgfByFolder', handle: 'engineSgfHandle'
                    },
                    'sitCreateFolder': {
                        fun: 'createSitFolderOn'
                    },
                    'userFavSgf': {
                        fun: 'userFavSgfList', API: 'userFavSgfList'
                    },
                    'userFavSitu': {
                        fun: 'userFavSituInit', API: 'userFavSituInit'
                    },
                    'lifeDeathSgf': {
                        fun: 'lifeDeathSgfInit', API: 'lifeDeathSgfList', handle: 'lifeDeathHand'
                    }
                    // 'uploadFav': {
                    // },
                    // 'reportFav': {
                    // },
                    // 'matchFav': {
                    // },
                    // {title: '大赛棋谱', command: 'publicMatchSgf'},
                    //         {title: 'AI比赛', command: 'publicAISgf'},
                    //         {title: '星阵自对弈', command: 'publicPSSgf'}
                },
                gameType: 0,
                resultOpt: {
                    data: [],
                    value: null,
                    num: null
                },
                selectMenuKey: null,
                selectMenuLocalKey: 'sgfSelectMenuKey'
            };
        },
        methods: {
            turnOn(){
                this.panelSwitch = true
            },
            turnOff(){
                this.panelSwitch = false
                this.uploadTurnOff()
            },
            turnPanelOff(){
                this.turnOff()
                this.$emit('takeFun', {
                    fun: 'timeContinue'
                })
            },
            async pageInit(){
                this.listInit()
                this.sgfInfoInit()
                this.resultInit()
                let res = await this.enginePlanInit()
            },
            listInit(){
                this.listNew = this.listInitNew()
                let list = this.list
                for(var i in list){
                    list[i].index = (Number(i) + 1) + ''
                    list[i].indexP = i
                    if(!list[i].submenu || list[i].submenu.length <= 0) continue
                    for(var j in list[i].submenu){
                        list[i].submenu[j].index = (Number(i) + 1) + '-' + (Number(j) + 1)
                        list[i].submenu[j].indexP = i
                        list[i].submenu[j].indexC = j
                        if(!list[i].submenu[j].submenu || list[i].submenu[j].submenu.length <= 0) continue
                        for(var k in list[i].submenu[j].submenu){
                            list[i].submenu[j].submenu[k].index = (Number(i) + 1) + '-' + (Number(j) + 1) + '-' + (Number(k) + 1)
                            list[i].submenu[j].submenu[k].indexP = i
                            list[i].submenu[j].submenu[k].indexC = j
                            list[i].submenu[j].submenu[k].indexD = k
                        }
                    }
                }
                this.list = list
            },
            listInitNew(list, indexKey, nodeNum, login){
                list = list || this.listNew
                nodeNum = nodeNum || 0
                for(var i in list){
                    if(!list[i].login) list[i].login = login
                    list[i].key = indexKey !== undefined ? `${indexKey}-${i}` : i
                    list[i].cssKey = `node-${list[i].key}`
                    list[i].nodeNum = nodeNum
                    if(!list[i].submenu || !list[i].submenu.length) continue
                    list[i].children = this.listInitNew(list[i].submenu, list[i].key, Number(nodeNum) + 1, list[i].login)
                }
                return list
            },
            pageSizeChange(){},
            pageChange(val){
                this.page = page
            },
            menuOpen(v){
                this.listOpenNow = v
            },
            menuClose(){
                this.listOpenNow = null
            },
            openSubmenu(index, indexP){
                if(this.list[indexP] && this.list[indexP].openStatus){
                    this.list[indexP].openStatus = false
                    return
                }
                // if(this.listOpenNow == index){
                //     this.listOpenNow = null
                //     this.GLOBAL.removeStoreItem({
                //         sgfLibraryIndexP: '',
                //         sgfLibraryIndexC: ''
                //     })
                //     this.activeNow = []
                //     return
                // }
                this.openSubmenuAction(index, indexP)
            },
            openSubmenuAction(index, indexP){
                this.listOpenNow = index
                if(this.list[indexP]) this.list[indexP].openStatus = true
                this.GLOBAL.setItem({
                    // sgfLibraryIndexP: indexP,
                })
                this.activeNow[0] = indexP
            },
            submenuSet(index, indexC, indexP){
                this.submenuOpenNow = index
                this.GLOBAL.setItem({
                    sgfLibraryIndexP: indexP,
                    sgfLibraryIndexC: indexC || index
                })
                this.activeNow[1] = indexC
            },
            commandHandle(val){
                if(val.login && !this.openPanelCheck()) return
                if(val.disabled) return
                if(val.submenu){
                    this.openSubmenu(val.index, val.indexP)
                    return
                }
                let command = val.command
                // this.openSubmenuAction(val.index, val.indexC)
                if(val.type != 'createFolder') this.submenuSet(val.index, val.indexC, val.indexP)
                this.openPanel(command)
            },
            getListAPI(){
                let node = this.getCurrentNodeByLocal()
                return this.openType[node.command].API || ''
            },
            async getRecordList(opt, params, type){
                type = type || 'normal'
                this.openNodeType = type
                opt = opt || {}
                let page = opt.page === undefined ? this.page - 1 : opt.page 
                let size = opt.size || this.size
                let username = opt.username || this.sgfUsernameDefine || this.$store.state.username
                let game_type = opt.game_type || this.gameType
                let API = opt.API || this.getListAPI() || 'getSgfList'
                this.sgfList = []
                this.sgfLoading = true
                let res
                if(params){
                    res = await this.GLOBAL[API](params)
                }else{
                    res = await this.GLOBAL[API](page, size, username, game_type)
                }
                this.sgfLoading = false
                if(res && res.code == 0){
                    res = this.checkResponseData(res)
                    let handleFun = 'parseSgfList'
                    let node = this.getCurrentNodeByLocal()
                    if(this.openType[node.command].handle && this[this.openType[node.command].handle]) handleFun = this.openType[node.command].handle
                    // this.parseSgfList(res.data.gameMetaList)
                    this[handleFun](res.data.gameMetaList)
                    this.pageCul(res.data.total)
                }
            },
            checkResponseData(res){
                if(this.GLOBAL.isArray(res.data)){
                    res.data = {
                        gameMetaList: res.data
                    }
                }
                let list = res.data.gameMetaList != undefined ? res.data.gameMetaList : res.data.content
                res.data.gameMetaList = list
                return res
            },
            pageCul(total){
                this.total = total
                this.amountPage = Math.ceil(this.total / this.size)
            },
            AISgfInit(){
                this.gameType = 0
                this.page = 1
                this.sgfList = []
                this.sgfUsernameDefine = null
                this.getRecordList()
            },
            myFavouriteInit(){
                // this.gameType = 1
                this.page = 1
                this.sgfList = []
                this.sgfUsernameDefine = null
                this.getRecordList({
                    API: 'getSgfFavourite'
                })
            },
            myUploadInit(){
                this.gameType = 1
                this.page = 1
                this.sgfList = []
                this.sgfUsernameDefine = null
                this.getRecordList()
            },
            reportInit(){
                this.gameType = 1
                this.page = 1
                this.sgfList = []
                this.sgfUsernameDefine = null
                this.getRecordList({API: 'reportList'})
            },
            publicMatchSgfInit(){
                this.gameType = 2
                this.page = 1
                this.sgfList = []
                this.sgfUsernameDefine = null
                this.getRecordList()
            },
            publicAISgfInit(){
                this.gameType = 3
                this.page = 1
                this.sgfList = []
                this.getRecordList()
            },
            publicPSSgfInit(){
                this.gameType = 4
                this.page = 1
                this.sgfList = []
                this.sgfUsernameDefine = null
                this.getRecordList()
            },
            studentSgfOpenInit(){
                this.page = 1
                this.sgfList = []
                let node = this.$refs['menuNodeTree'].getCurrentNode()
                this.gameType = node.gameType || 0
                if(!node.username) return
                this.sgfUsernameDefine = node.username
                this.getRecordList()
            },
            engineSgfOpenInit(){
                this.gameType = 0
                this.page = 1
                this.sgfList = []
                let node = this.$refs['menuNodeTree'].getCurrentNode()
                let folder = null
                try{
                    folder = node.value
                }catch(e){}
                if(!folder) return
                this.sgfUsernameDefine = null
                this.getRecordList(null, folder, 'engineSgf')
            },
            userFavSgfList(){
                this.page = 1
                this.sgfList = []
                this.sgfUsernameDefine = null
                let node = this.$refs['menuNodeTree'].getCurrentNode() || {}
                let opt = {
                    page: this.page - 1,
                    size: this.size,
                    type: node.type
                }
                this.getRecordList(null, opt)
            },
            userFavSituInit(){
                this.page = 1
                this.sgfList = []
                this.sgfUsernameDefine = null
                this.getRecordList()
            },
            lifeDeathSgfInit(){
                this.gameType = 0
                this.page = 1
                this.sgfList = []
                this.sgfUsernameDefine = null
                this.getRecordList(null, null, 'lifeDeath')
            },
            uploadFavInit(){},
            reportFavInit(){},
            matchFavInit(){},
            openPanel(type){
                // type = type || 'AISgf'
                if(this[this.openType[type].fun]) this[this.openType[type].fun]()
            },
            parseSgfList(data){
                this.sgfList = []
                if(!data || !data.length) return
                for(var i in data){
                    data[i].createTime = this.GLOBAL.changenum(data[i].playTime)
                    data[i].gameResultServer = data[i].gameResult
                    data[i].gameResult = this.GLOBAL.parseResult(data[i].gameResult)
                    data[i].index = i
                    data[i].time = `${data[i].createTime.date.year}-${data[i].createTime.date.month}-${data[i].createTime.date.day}`
                    data[i].komi = Number(data[i].komi === undefined ? 7.5 : data[i].komi)
                    if(isNaN(data[i].komi)) data[i].komi = 7.5
                    if(data[i].komi === 7.5) data[i].gameResultType = 'normal'
                    else data[i].gameResultType = 'spec'
                    data[i].komi = this.komiParse(data[i].komi)
                    data[i].blackLevel = this.parseLevel(data[i].blackLevel)
                    data[i].whiteLevel = this.parseLevel(data[i].whiteLevel)
                    // data[i].analyzeIcon = this.getReportIcon(data[i])
                    data[i].analyzeIcon = this.GLOBAL.getReportIconSub(data[i])

                    //头像胜负icon
                    data[i].win = this.GLOBAL.resultWinLabel(data[i].gameResultServer)


                    // data[i].pb = this.AIplayNameHandle( data[i].pb)
                    // data[i].pw = this.AIplayNameHandle( data[i].pw)
                }
                this.sgfList = data
            },
            engineSgfHandle(data){
                this.sgfList = []
                if(!data || !data.length) return
                let rd = []
                for(var i in data){
                    data[i].createTime = this.GLOBAL.changenum(data[i].createTime)
                    data[i].gamename = data[i].name
                    let moves = data[i].moves
                    let sgfData = this.parseSgfFile(moves, 'sgf')
                    data[i].gameResult = ''
                    data[i].pb = sgfData.info.pb
                    data[i].pw = sgfData.info.pw
                    data[i].blackLevel = this.GLOBAL.getLevelNew(sgfData.info.br)
                    data[i].whiteLevel = this.GLOBAL.getLevelNew(sgfData.info.wr)
                    data[i].moveNum = sgfData.normal.length
                    data[i].gameType = sgfData.info.up
                    data[i].index = i
                }
                this.sgfList = data
            },
            getReportIcon(val){
                if(val.analyzeStatus == 0) return null
                let data = this.GLOBAL.getReportIcon(val.analyzePo)
                // let data = this.GLOBAL.getReportIconSub(val)
                return data[`icon${val.analyzeStatus}`]
            },
            parseLevel(level){
                return this.GLOBAL.getLevel(level)
            },
            komiParse(komi){
                let data = this.komiOpt.data, rd = null
                for(var i in data){
                    if(data[i].value == komi){
                        rd = data[i]
                        break
                    }
                }
                if(rd == null) rd = {value: 7.5, label: '3又3/4子', name: '贴目：3又3/4子'}
                return rd
            },
            AIplayNameHandle(name){
                if(name.indexOf('星阵') != -1 && name.indexOf('_') != -1){
                    let level = name.substring(name.lastIndexOf('_') + 1, name.length)
                    if(isNaN(Number(level))) return name
                    name = name.substring(0, name.lastIndexOf('_'))
                    return name
                }
                return name
            },
            pageChangeAction(p){
                if(this.page == p) return
                this.page = p
                this.getRecordList()
            },
            pageChangeHandle(p, disabled){
                if(disabled) return
                let amountPage = this.amountPage
                p = p == 'l' ? amountPage : this.page + p
                if(p <= 0) p = 1
                if(p > amountPage) p = amountPage
                this.pageChangeAction(p)
            },
            async favouriteCon(val, type){
                type = type || 'normal'
                if(!val || !val.id) return
                let res
                if(!val.favourite) res = await this.favouriteSet(val, type)
                else res = await this.favouriteDelete(val, type)
                this.favouriteAfter()
            },
            favouriteSet(val, type){
                let id = val.id, index = val.index
                this.sgfList[index].loading = true
                this.$forceUpdate()
                return this.GLOBAL.favouriteSet(id)
                // return this.GLOBAL.favouriteSetNew(id, type)
                .then(res => {
                    this.sgfList[index].loading = false
                    if(res && res.code == 0){
                        this.sgfList[index].favourite = true
                    }
                    this.$forceUpdate()
                    return res
                })
            },
            favouriteDelete(val, type){
                let id = val.id, index = val.index
                this.sgfList[index].loading = true
                this.$forceUpdate()
                return this.GLOBAL.favouriteDelete(id)
                // return this.GLOBAL.favouriteDeleteNew(id, type)
                .then(res => {
                    if(res && res.code == 0){
                        this.sgfList[index].favourite = false
                    }
                    this.sgfList[index].loading = false
                    this.$forceUpdate()
                    return res
                })
            },
            favouriteAfter(){
                let indexP = this.activeNow[0]
                let indexC = this.activeNow[1]
                if(indexP == undefined || indexC == undefined) return
                let val = this.list[indexP].submenu[indexC]
                let type = val.command
                if(val.refresh) this[this.openType[type].fun]()
            },
            downloadFile(val){
                if(!val.id) return
                let filename = val.gameType == 0 ? `${val.gamename}_${val.pb}VS${val.pw}_${val.time}.sgf` : `${val.gamename}.sgf`
                let index = val.index
                this.sgfList[index].loading = true
                this.$forceUpdate()
                this.getSgfContent(val.id)
                .then(res => {
                    if(res && res.code == 0){
                        this.GLOBAL.downloadFile(res.data.sgf, filename)
                    }
                    this.sgfList[index].loading = false
                    this.$forceUpdate()
                })
            },
            sgfInfoInit(){
                let sgfInfo = this.GLOBAL.deepCopy(this.GLOBAL.sgfInfo)
                sgfInfo.fileName = {label: '文件名', value: ''}
                sgfInfo.km.value = null
                this.sgfInfo = sgfInfo
                this.loadSgfData.sgfInfo = sgfInfo
                this.komiOptInit()
            },
            komiOptInit(){
                let komiOpt = this.GLOBAL.deepCopy(this.GLOBAL.komi)
                this.komiOpt = {
                    data: komiOpt,
                    value: 7.5
                }
            },
            resultInit(){
                this.resultOpt.data = this.GLOBAL.deepCopy(this.GLOBAL.resultSelect)
            },
            selectedFile(e){
                let file = e.target.files[0]
                let postfix = file.name.substring(file.name.lastIndexOf('.') + 1, file.name.length)
                if(!this.GLOBAL.checkLoadSgfSuffix(file.name)){
                    let type = this.GLOBAL.getLoadFileTypeTxt()
                    this.GLOBAL.errorNotice('请上传正确的文件，文件后缀为：' + type)
                    return
                }
                this.loadSgfData.file = file
                this.loadSgfData.name = file.name
                var fReader=new FileReader();
                fReader.onload=() =>{
                    if(fReader.result){
                        let fileData = fReader.result
                        let sgfData = this.parseSgfFile(fileData, this.GLOBAL.fileSuffixGet(this.loadSgfData.name))
                        this.selectedFileHandle(sgfData)
                    }
                }
                fReader.readAsText(file,'utf-8');
            },
            sgfInfoCheck(sgfInfo){
                let info = [
                    {key: 'sz', fun: 'uploadNumberCheck'},
                    {key: 'km', fun: 'uploadNumberCheck'},
                    {key: 'ha', fun: 'uploadNumberCheck'},
                    // {key: 're', fun: 'uploadResultCheck'},
                ]
                for(var i in info){
                    if(sgfInfo[info[i].key]) sgfInfo[info[i].key] = this[info[i].fun](sgfInfo[info[i].key])
                }
                return sgfInfo
            },
            uploadNumberCheck(data){
                if(!isNaN(Number(data))) return data
                return null
            },
            uploadResultCheck(data){
                // return this.parseResult(data)
            },
            selectedFileHandle(sgfData){
                if(!sgfData || !sgfData.normal) return
                this.loadSgfData.area.min = 1
                this.loadSgfData.area.max = sgfData.normal.length
                this.loadSgfData.area.value = [1, sgfData.normal.length]
                let sgfInfo = this.GLOBAL.deepCopy(this.sgfInfo)
                let fileInfo = sgfData.info
                fileInfo = this.sgfInfoCheck(fileInfo)
                for(var i in sgfInfo){
                    if(fileInfo[i]){
                        sgfInfo[i].value = fileInfo[i]
                    }
                }
                sgfInfo.fileName.value = this.$i18n.t(this.GLOBAL.fileNameFilter(this.loadSgfData.name))
                // this.sgfInfo = sgfInfo
                this.loadSgfData.sgfData = sgfData.normal
                this.loadSgfData.gtp = sgfData.gtp
                sgfInfo.km.value = Number(sgfInfo.km.value)
                this.loadSgfData.sgfInfo = sgfInfo
                let re = this.parseResult(this.loadSgfData.sgfInfo.re.value)
                this.resultOpt.value = re.result, this.resultOpt.num = re.num
                this.$forceUpdate()
            },
            parseSgfFile(fileData, type){
                let sgfData = this.SgfParse.parseSgfFile(fileData, type)
                return sgfData
            },
            uploadTurnOn(opt){
                if(!this.openPanelCheck(this.GLOBAL.__ERRORMSGDEFINE.errorMsg.needLoginNotice.openSgfUpload)) return 
                if(opt) this.uploadSgfInfoSet(opt)
                this.uploadSwitch = true
            },
            uploadSgfInfoSet(opt){
                if(!opt.sgf) return
                this.loadSgfData.name = opt.gamename + '.sgf'
                this.loadSgfData.file = opt.gamename
                let sgfData = this.parseSgfFile(opt.sgf, 'sgf')
                this.selectedFileHandle(sgfData)
            },
            uploadTurnOff(){
                if(document.querySelector('#loadSgfBtnSgf')){
                    document.querySelector('#loadSgfBtnSgf').value = ''
                }
                this.uploadSwitch = false
                this.loadSgfData.file = null
                this.loadSgfData.area.min = 0
                this.loadSgfData.area.max = 0
                this.loadSgfData.winrate = false
                this.loadSgfData.name = null
                this.loadSgfData.active = false
                this.resultOpt.value = null
                this.resultOpt.num = null
                this.sgfInfoInit()
                this.uploadCallBack = null
                this.uploadOutside = false
                this.$forceUpdate()
                this.$emit('takeFun', {
                    fun: 'uploadTurnOff',
                })
            },
            levelCheck(level){
                if(level == '' || level == undefined) return level
                let computerLevel = this.GLOBAL.computerLevel
                let key = isNaN(Number(level)) ? 'label' : 'value'
                let rLevel = 0
                for(var i in computerLevel){
                    if(computerLevel[i][key] == level){
                        rLevel = computerLevel[i].value
                        break
                    }
                }
                return rLevel
            },
            getSaveSgfData(){
                let size = this.loadSgfData.sgfInfo.sz.value || 19
                let komi = this.loadSgfData.sgfInfo.km.value || 7.5
                let result = this.resultOpt.value || 'N+R'
                if(this.GLOBAL.resultTxt[result] && this.GLOBAL.resultTxt[result].num){
                    result = result + this.resultOpt.num
                }
                let handicap = this.loadSgfData.sgfInfo.ha.value || 0
                if(isNaN(Number(komi))) komi = 7.5
                if(isNaN(Number(handicap))) handicap = 0
                if(isNaN(Number(size))) size = 19
                let sgf = this.SgfParse.CreateSgfDataByStep({
                    step: this.loadSgfData.sgfData,
                    size: size,
                    sgfInfo: this.loadSgfData.sgfInfo,
                    komi: komi
                })
                return {
                    gamename: this.loadSgfData.sgfInfo.fileName.value, 
                    pb: this.loadSgfData.sgfInfo.pb.value,
                    pw: this.loadSgfData.sgfInfo.pw.value,
                    black_level: this.levelCheck(this.loadSgfData.sgfInfo.br.value),
                    white_level: this.levelCheck(this.loadSgfData.sgfInfo.wr.value),
                    move_num: this.loadSgfData.sgfData.length,
                    handicap: this.loadSgfData.sgfInfo.ha.value || 0,
                    komi: komi,
                    board_size: size,
                    game_result: result,
                    game_type: 1,
                    sgf: sgf,
                    play_time: this.loadSgfData.sgfInfo.dt.value
                }
            },
            checkLevelForSave(level){
                return this.GLOBAL.getLevelByLabel(level)
            },
            async uploadConfirm(){
                let data = this.getSaveSgfData()
                let sgfInfo = this.GLOBAL.deepCopy(this.loadSgfData.sgfInfo)
                this.LOADING.open()
                let res = await this.saveSgfAction(data)
                .then(res => {
                    this.LOADING.close()
                    let indexP = 0, indexC = 1, ip = 1, ic = '1-2'
                    this.openSubmenuAction(ip, indexP)
                    let command = this.list[indexP].submenu[indexC].command
                    this.submenuSet(ic, indexC, indexP)
                    this.openPanel(command)
                    res.sgfInfo = sgfInfo
                    this.$emit('takeFun', {
                        fun: 'uploadSgfOver',
                        data: res
                    })
                    return res
                })
                this.uploadTurnOff()
                return res
            },
            saveSgfAction(opt){
                return this.GLOBAL.saveSgfOpen(opt)
                .then(res => {
                    if(res && res.code == 0){
                        this.GLOBAL.MessageOpen({
                            type: 'success',
                            message: this.GLOBAL.__ERRORMSGDEFINE.errorMsg['uploadSgf']['0']
                        })
                    }
                    return res
                })
            },
            resultChange(){
                
            },
            parseResult(result){
                if(!result) return {result: 'N+R', num: null}
                let f = false, data = this.resultOpt.data
                for(var i in data){
                    if(data[i].value != result) continue
                    f = true
                    break
                }
                if(f) return {result: result, num: null}
                let re = result.substring(0, 2), num = result.substring(2, result.length)
                if(!this.GLOBAL.resultTxt[re]) return {result: 'N+R', num: 0}
                return {result: re, num: num}
            },
            disabledHandle(val){
                let data = this.GLOBAL.sgfDisabledHandle
                return data[val.gameType]
            },
            disabledFavorite(val){

            },
            deleteSgf(val){
                if(!val || val.id == undefined) return
                let index = val.index
                this.sgfList[index].loading = true
                this.$forceUpdate()
                this.$refs['leConfirm'].open({
                    message: '确定要删除棋谱吗？',
                    button: [
                        {name: '确定', label: 0},
                        {name: '取消', label: 1, type: 'cancel'},
                    ]
                }).then(res => {
                    let label = res.label
                    if(label == 1){
                        if(this.sgfList[index] && this.sgfList[index].loading) this.sgfList[index].loading = false
                        this.$forceUpdate()
                        return
                    }
                    this.GLOBAL.deleteSgfAction(val.id).then(res => {
                        if(res && res.code == 0){
                            this.getRecordList()
                        }
                        this.$forceUpdate()
                    })
                })
            },
            getDefaultIndex(){
                let indexP = this.$store.state.sgfLibraryIndexP || 0
                let indexC = this.$store.state.sgfLibraryIndexC || 0
                if(this.$store.state.username) return {
                    indexP: indexP,
                    indexC: indexC
                }
                return {
                    indexP: 1,
                    indexC: 0
                }
            },
            async panelOn(opt){
                this.username = this.$store.state.username
                this.turnOn()
            },
            uploadSgfOutside(opt, callback){
                // this.panelOn().then(() => {
                    this.uploadTurnOn(opt)
                    this.uploadCallBack = callback
                    this.uploadOutside = true
                // })
            },
            uploadSgfInside(opt, callback){
                this.uploadSgfInfoSet(opt)
                this.uploadCallBack = callback
                return this.uploadConfirm()
            },
            async getSgfContent(id){
                let res = await this.GLOBAL.getSgfData(id)
                .then(res => {
                    if(!res || res.code != 0) this.getRecordList()
                    return res
                })
                return res
            },
            setLabel(val){
                if(val.gameType != 0) return
                let data = `${val.gamename} sgf_id=${val.id}`
                this.GLOBAL.setLabel({
                    'AISGF': data
                })
            },
            async openSgfById(id, type){
                if(type == undefined) type = 'normal'
                if(type != 'normal') return this.openSgfEngineBoardById(id)
                let res = await this.getSgfContent(id)
                let sgfData
                if(res && res.code == 0){
                    sgfData = this.parseSgfFile(res.data.sgf, 'sgf')
                    sgfData.sgfId = id
                    sgfData.reviewData = res.data.reviewData || null
                    let username = res.data.username || this.$store.state.username
                    sgfData.sgfUsernameDefine = username
                }
                return sgfData
            },
            async openSgfCheckForSubject(val){
                let path = this.$route.path
                if(path.indexOf('/engine/report') > -1) return true
                let needAsk = [
                    '/engine/play',
                    '/engine/game',
                    '/engine/playEngine',
                    '/engine/class',
                    '/engine/analyse'
                ]
                let f = false
                for(var i in needAsk){
                    if(path.indexOf(needAsk[i]) > -1){
                        f = true
                        break
                    }
                }
                if(f){
                    let res = await this.$refs['leConfirm'].open({
                        message: '特训报告只能在报告模式下打开，去报告？',
                        button: [
                            {name: '确认', label: 0},
                            {name: '取消', label: 1, type: 'cancel'},
                        ]
                    })
                    if(res.label == 1) return false
                }
                
                let data = {
                    sgfId: val.id
                }
                this.GLOBAL.setItem({
                    report: JSON.stringify(data)
                })
                this.turnOff()
                this.GLOBAL.gotoReport()
                return false
            },
            async openSgfCheck(val){
                if(val.gameType == this.GLOBAL.subjectTypeCode) return this.openSgfCheckForSubject(val)
                if(val.analyzeStatus != 2) return true
                if(!this.emitOpenSgf) return true
                let path = this.$route.path
                let noneAsk = [
                    '/engine/report',
                    '/engine/play/normal',
                    '/engine/play/level',
                    '/engine/game/normal',
                    '/engine/game/level',
                    '/engine/playEngine',
                    '/engine/class',
                ]
                // if(path.indexOf('/engine/report') > -1) return true
                let f = false
                for(var i in noneAsk){
                    if(path.indexOf(noneAsk[i]) > -1){
                        f = true
                        break
                    }
                }
                if(f) return f
                let res = await this.$refs['leConfirm'].open({
                    message: '是否在报告模式下打开？',
                    button: [
                        {name: '是', label: 0},
                        {name: '否', label: 1, type: 'cancel'},
                    ]
                })
                if(res.label == 1) return true
                let data = {
                    sgfId: val.id
                }
                this.GLOBAL.setItem({
                    report: JSON.stringify(data)
                })
                this.turnOff()
                // this.GLOBAL.jumpToPage('/engine/report')
                this.GLOBAL.gotoReport()
                return false
            },
            async openSgf(val){
                let state = await this.checkBoardSize(val)
                if(!state) return

                let res = await this.openSgfCheck(val)
                if(!res) return
                if(!val.id) return
                let username = this.sgfUsernameDefine || this.$store.state.username
                this.LOADING.open()
                let filename = val.gameType == 0 ? `${val.gamename}_${val.pb}VS${val.pw}_${val.time}.sgf` : `${val.gamename}.sgf`, index = val.index
                this.sgfList[index].loading = true
                this.$forceUpdate()
                this.getSgfContent(val.id)
                .then(res => {
                    if(res && res.code == 0){
                        let sgfData = this.parseSgfFile(res.data.sgf, 'sgf')
                        sgfData.sgfId = val.id
                        sgfData.reviewData = res.data.reviewData || null
                        sgfData.info.gn = val.gamename
                        sgfData.info.re = val.gameResultServer
                        sgfData.meta = val
                        sgfData.sgfUsernameDefine = username
                        this.setLabel(val)
                        this.openSgfEmit(sgfData, val)
                        this.turnOff()
                    }
                    if(this.sgfList[index] && this.GLOBAL.isObject(this.sgfList[index])) this.sgfList[index].loading = false
                    this.$forceUpdate()
                    this.LOADING.close()
                })
            },
            openSgfEmit(sgfData, val){
                // sgfData = sgfData || {}
                // let enginePage = false
                // if(this.pathNow.indexOf('/engine/analyse') > -1) enginePage = true
                // if((this.emitOpenSgf && sgfData.dataType != 'engineBoard') || (sgfData.dataType == 'engineBoard' && enginePage)){
                //     this.$emit('takeFun', {
                //         fun: 'openSgf',
                //         data: sgfData
                //     })
                //     return
                // }
                sgfData = sgfData || {}
                if(this.emitOpenSgf){
                    if(this.pathNow.indexOf('/engine/analyse') <= -1 && this.pathNow.indexOf('/engine/class/room') <= -1 && sgfData.dataType == 'engineBoard'){
                        sgfData.sgfId = undefined
                    }
                    this.$emit('takeFun', {
                        fun: 'openSgf',
                        data: sgfData
                    })
                    return
                }
                let key = 'engine'
                val = val || {}
                if((val.analyzeStatus == 1 || val.analyzeStatus == 2) && sgfData.dataType != 'engineBoard') key = 'report'
                let reData = {}
                reData[key] = true
                this.GLOBAL.removeItem(reData)
                let setItem = {}
                let dataType = sgfData.dataType || "normal"
                setItem[key] = JSON.stringify({
                    sgfId: val.id,
                    dataType: dataType
                })
                this.GLOBAL.setItem(setItem)
                let juFun = key == 'engine' ? 'gotoEngine' : 'gotoReport'
                if(this.GLOBAL[juFun]) this.GLOBAL[juFun]()
            },
            testFun(){
                this.SgfParse.branchDataParse()
            },
            getPhoto(data, p, c){
                if(this.GLOBAL.isGameSgf(data, p)){
                    let key = c == 'b' ? 'blackLevel' : 'whiteLevel'
                    let path = `${this.GLOBAL.assetsUrl}/img/`
                    if(data[key] && data[key].AIicon) return path + data[key].AIicon
                }
                if(this.GLOBAL.isAIgameForSgf(data.gameType) && !this.GLOBAL.isGameSgf(data, p)
                &&(!this.sgfUsernameDefine || this.sgfUsernameDefine == this.$store.state.username)){
                    let path = `${this.GLOBAL.assetsUrl}/user_photo/`
                    let photo = this.$store.state.photo || this.GLOBAL.userPhotoDefault.path
                    return path + photo
                }
                return this.GLOBAL.getPhoto(data, p, c)
            },
            getAIname(data, p, c){
                if(this.GLOBAL.isGameSgf(data, p)){
                    let key = c == 'b' ? 'blackLevel' : 'whiteLevel'
                    if(data[key] && data[key].AIname) return data[key].AIname
                }
                return p
            },
            saveSgfForReport(opt, callback){
                this.panelOn().then(() => {
                    this.uploadTurnOn(opt)
                    this.uploadCallBack = callback
                })
                
            },
            komiChange(){

            },
            dtChange(val){
                let data = this.GLOBAL.getTimeNow(val)
                this.loadSgfData.sgfInfo.dt.value = data
            },
            async enginePlanInit(){
                if(this.GLOBAL.computerLevelHasInsert) return
                let res = await this.GLOBAL.enginePlan()
                if(res && res.code == 0) this.enginePlanList = res.data
                return res
            },
            async photoInit(){
                // // let path = `${process.env.BASE_URL}txt/photoList.json`
                // let path = this.GLOBAL.assetsUrl + '/txt/photoList.json'
                // let res = await this.GLOBAL.getStaticData(path)
                let res =  await this.GLOBAL.photoInit()
                if(res) this.photoList = res
            },
            menuShowCul(val){
                if(val.login && !this.$store.state.username) return false
                return true
            },
            openPanelCheck(message){
                if(this.$store.state.username) return true
                message = message || this.GLOBAL.errorMsg.needLoginNotice.openSgfLabrary
                this.GLOBAL.needLogin(null, {
                    message: message
                })
            },
            async stuSgfAndEngineSgfInit(){
                await this.getStusSgf()
                await this.getEngineSgf(this.listNew)
                await this.getLifeDeathSgf(this.listNew)
                return true
            },
            async getStusSgf(list){
                this.LOADING.open()
                let res = await this.GLOBAL.getStusSgf()
                list = list || this.GLOBAL.deepCopy(this.listCopy)
                if(res && res.code == 0 && res.data && res.data.length){
                    let data = res.data
                    if(!this.GLOBAL.isArray(data)) data = [data]
                    
                    let rd = {}
                    for(var i in data){
                        let key = `${data[i].className}`
                        if(!rd[key]) rd[key] = []
                        rd[key].push({
                            title: data[i].studentNickname || data[i].student,
                            username: data[i].student,
                            command: 'studentSgfOpen',
                            className: data[i].className,
                            organization: data[i].organization,
                            school: data[i].school,
                            nickname: data[i].studentNickname
                        }) 
                    }
                    let stuMenu = []
                    for(var i in rd){
                        for(var j in rd[i]){
                            rd[i][j].submenu = [
                                {
                                    title: '对弈',
                                    username: rd[i][j].username,
                                    command: 'studentSgfOpen',
                                    className: rd[i][j].className,
                                    organization: rd[i][j].organization,
                                    school: rd[i][j].school,
                                    nickname: rd[i][j].nickname,
                                    gameType: 0
                                },
                                {
                                    title: '上传',
                                    username: rd[i][j].username,
                                    command: 'studentSgfOpen',
                                    className: rd[i][j].className,
                                    organization: rd[i][j].organization,
                                    school: rd[i][j].school,
                                    nickname: rd[i][j].nickname,
                                    gameType: 1
                                },
                                {
                                    title: '特训',
                                    username: rd[i][j].username,
                                    command: 'studentSgfOpen',
                                    className: rd[i][j].className,
                                    organization: rd[i][j].organization,
                                    school: rd[i][j].school,
                                    nickname: rd[i][j].nickname,
                                    gameType: 5
                                },
                            ]
                        }
                        stuMenu.push({
                            title: i,
                            submenu: rd[i]
                        })
                    }
                    list.push(
                        {
                            title: '学生棋谱', 
                            openStatus: false,
                            submenu: stuMenu,
                            login: true
                        }
                    )
                }
                this.listNew = list
                this.listNew = this.GLOBAL.sortData(list, (v1, v2) => {
                    let sort1 = v1.sort || 0, sort2 = v2.sort || 0
                    return sort1 > sort2
                })
                this.pageInit()
                this.LOADING.close()
                return res
            },
            async getEngineSgf(list){
                this.LOADING.open()
                let res = await this.GLOBAL.getSaceBoardFolder()
                list = list || this.GLOBAL.deepCopy(this.listCopy)
                if(res && res.code == 0){
                    let data = res.data
                    this.folderList = this.GLOBAL.deepCopy(data)
                    if(!this.GLOBAL.isArray(data)) data = [data]
                    let menu = {
                        title: '我的盘面', 
                        openStatus: false,
                        login: true,
                        submenu: [],
                        sort: 1
                    }
                    for(var i in data){
                        // let name = this.GLOBAL.engineSgfNameGet(data[i])
                        let signLabel = null
                        if(i == data.length - 1) signLabel = 'lastSitu'
                        name = data[i]
                        let defaultFolder = this.GLOBAL.engineSgfNameGet(name)
                        menu.submenu.push({
                            title: name,
                            command: 'engineSgfOpen',
                            value: data[i],
                            type: 'situation',
                            signLabel: signLabel,
                            board: true,
                            default: defaultFolder
                        })
                    }
                    menu.submenu.push({
                        title: '新建',
                        command: 'sitCreateFolder',
                        type: 'createFolder',
                        class: 'create-box'
                    })
                    // list[1] = menu
                    list.push(menu)
                }
                this.listNew = list
                this.listNew = this.GLOBAL.sortData(list, (v1, v2) => {
                    let sort1 = v1.sort || 0, sort2 = v2.sort || 0
                    return sort1 > sort2
                })
                this.pageInit()
                this.LOADING.close()
                return res
            },
            getLifeDeathSgf(list){
                let menu = {
                    title: '死活题', 
                    login: true,
                    command: 'lifeDeathSgf',
                    sort: 1,
                    value: 'lifeDeath'
                }
                list.push(menu)
                this.listNew = list
                this.listNew = this.GLOBAL.sortData(list, (v1, v2) => {
                    let sort1 = v1.sort || 0, sort2 = v2.sort || 0
                    return sort1 > sort2
                })
                this.pageInit()
            },
            menuTreeHandle(val){
                if(val.login && !this.openPanelCheck()) return
                this.commandHandle(val)
                if(val.key && !val.children && val.type != 'createFolder'){
                    this.selectMenuKey = val.key
                    let saveData = {}
                    saveData[this.selectMenuLocalKey] = val.key
                    this.GLOBAL.setItem(saveData)
                }
            },
            localKeyInit(){
                let localKey = this.GLOBAL.getLocalItem(this.selectMenuLocalKey)
                localKey = localKey == undefined ? 0 : localKey
                this.selectMenuKey = localKey
            },
            getCurrentNodeByLocal(){
                let node = this.getLoginNode()
                if(this.$refs['menuNodeTree'] && this.$refs['menuNodeTree'].getCurrentNode()){
                    node = this.$refs['menuNodeTree'].getCurrentNode()
                } 
                if(node.children && node.children.length) node = this.getLoginNode()
                if(node.login && !this.$store.state.username) node = this.getNoneLoginNode()
                return node
            },
            sgfLevelCul(val){
                if(!val.label || val.label == '' || val.label == ' ') return null
                return val.label
            },
            loadSgfSelect(){
                document.getElementById('loadSgfBtnSgf').click()
            },
            saveEngineDataOpen(moves){
                this.$refs['saveEngineBoardPanel'].open(moves)
            },
            getNoneLoginNode(){
                let {listNew} = this
                if(!listNew.length) return {}
                let list = listNew
                let data = {}
                for(var i in list){
                    if(!list[i].login){
                        data = list[i]
                    }
                }
                let {children} = data
                if(!children || !children.length) return {}
                return children[0]
                // return this.listNew[1].children[0]
            },
            getLoginNode(){
                let {listNew} = this
                if(!listNew.length) return {}
                return this.listNew[0].children[0]
            },
            async openSgfEngineDataCheck(val){
                if(this.$store.state.engine_id && this.isEnginePage && this.GLOBAL.engineIsAvailableCheck()){
                    let res = await this.$refs['leConfirm'].open({
                        message: this.$i18n.t('打开盘面将结束当前研究'),
                        button: [
                            {name: '结束', label: 0},
                            {name: '取消', label: 1, type: 'cancel'},
                        ]
                    })
                    if(res && res.label == 0){
                        this.$emit('takeFun', {
                            fun: 'endEngienBySgf',
                            data: {
                                callback: this.openSgfEngineBoard,
                                params: val
                            }
                        })
                    } 
                    return false
                }
                return true
            },
            async engineBoardOpenCheck(val){
                if(!this.emitOpenSgf) return true
                let path = this.$route.path
                let noneAsk = [
                    '/engine/analyse',
                    '/engine/play/normal',
                    '/engine/play/level',
                    '/engine/game/normal',
                    '/engine/game/level',
                    '/engine/playEngine',
                    '/engine/class',
                ]
                // if(path.indexOf('/engine/report') > -1) return true
                let f = false
                for(var i in noneAsk){
                    if(path.indexOf(noneAsk[i]) > -1){
                        f = true
                        break
                    }
                }
                if(f) return f
                let res = await this.$refs['leConfirm'].open({
                    message: `是否在研究模式下打开，以显示该盘面数据？`,
                    button: [
                        {name: '是', label: 0},
                        {name: '否', label: 1, type: 'cancel'},
                    ]
                })
                if(res.label == 1) return true
                let data = {
                    sgfId: val.id,
                    dataType: 'engineBoard'
                }
                this.GLOBAL.setItem({
                    engine: JSON.stringify(data)
                })
                this.turnOff()
                // this.GLOBAL.jumpToPage('/engine/report')
                this.GLOBAL.gotoEngine()
                return false
            },
            async openSgfEngineBoard(val){
                let check = await this.engineBoardOpenCheck(val)
                if(!check) return
                let res = await this.openSgfEngineDataCheck(val)
                if(!res) return
                if(!val.id) return
                // let username = this.sgfUsernameDefine || this.$store.state.username
                this.LOADING.open()
                let sgfData = await this.getSgfEngineBoardData(val.id)
                if(sgfData){
                    sgfData.meta = val
                    this.openSgfEmit(sgfData, val)
                    this.turnOff()
                }
                let index = val.index
                if(this.sgfList[index] && this.GLOBAL.isObject(this.sgfList[index])) this.sgfList[index].loading = false
                this.LOADING.close()
            },
            async openSgfEngineBoardById(id){
                let sgfData = await this.getSgfEngineBoardData(id)
                return sgfData
            },
            async getSgfEngineBoardData(id){
                let res = await this.GLOBAL.openSgfEngineBoard(id)
                let sgfData
                if(res && res.code == 0){
                    let data = res.data
                    // data = JSON.parse(data)
                    let dataCopy = this.GLOBAL.deepCopy(data)
                    for(var i in dataCopy){
                        try{
                            dataCopy[i] = JSON.parse(dataCopy[i])
                        }catch(e){}
                    }
                    sgfData = this.parseSgfFile(res.data.moves, 'sgf')
                    sgfData.sgfId = id
                    let username = res.data.username || this.$store.state.username
                    sgfData.sgfUsernameDefine = username
                    sgfData.dataType = 'engineBoard'
                    for(var i in data){
                        if(sgfData[i] != undefined) continue
                        sgfData[i] = data[i]
                    }
                }
                return sgfData
            },
            async deleteSgfEngineBoard(val){
                if(!val || val.id == undefined) return
                let index = val.index
                this.sgfList[index].loading = true
                this.$forceUpdate()
                this.$refs['leConfirm'].open({
                    message: '确定要删除棋谱吗？',
                    button: [
                        {name: '确定', label: 0},
                        {name: '取消', label: 1, type: 'cancel'},
                    ]
                }).then(res => {
                    let label = res.label
                    if(label == 1){
                        if(this.sgfList[index] && this.sgfList[index].loading) this.sgfList[index].loading = false
                        this.$forceUpdate()
                        return
                    }
                    this.GLOBAL.deleteSgfEngineBoard(val.id).then(res => {
                        if(res && res.code == 0){
                            this.engineSgfOpenInit()
                        }
                        this.$forceUpdate()
                    })
                })
            },
            saveEngineBoardPanelOn(){
                this.$emit('takeFun', {
                    fun: 'saveEngineBoardPanelOn',
                    data: true
                })
            },
            saveEngineBoardPanelOff(){
                this.$emit('takeFun', {
                    fun: 'saveEngineBoardPanelOff',
                    data: false
                })
            },
            async deleteCheck(node){
                if(!node || !node.value) return false
                let res = await this.$refs['leConfirm'].open({
                    message: `${this.GLOBAL.errorMsg.main['delete situation folder confirm']}`,
                    button: [
                        {name: '确定', label: 0},
                        {name: '取消', label: 1, type:'cancel'}
                    ]
                })
                if(!res) return false
                let label = res.label
                return label == 0 ? true : false
            },
            async deleteFolder(node){
                let f = await this.deleteCheck(node)
                if(!f) return
                let folder = node.value
                let res = await this.GLOBAL.deleteSitFolder(folder)
                if(res && res.code == 0){
                    this.panelOn()
                }
            },
            createSitFolderOn(){
                this.$refs['createSituationFolder'].open()
            },
            createFolderComplete(res, name){
                if(res && res.code == 0){
                    this.panelOn()
                }
            },
            nodeChange(e){
            },
            lifeDeathHand(data){
                this.sgfList = []
                if(!data || !data.length) return
                let rd = []
                for(var i in data){
                    data[i].createTime = this.GLOBAL.changenum(data[i].createTime)
                    data[i].gamename = data[i].title
                    let moves = data[i].sgf
                    let sgfData = this.parseSgfFile(moves, 'sgf')
                    // data[i].gameResult = ''
                    // data[i].pb = sgfData.info.pb
                    // data[i].pw = sgfData.info.pw
                    // data[i].blackLevel = this.GLOBAL.getLevelNew(sgfData.info.br)
                    // data[i].whiteLevel = this.GLOBAL.getLevelNew(sgfData.info.wr)
                    // data[i].moveNum = sgfData.normal.length
                    // data[i].gameType = sgfData.info.up
                    // data[i].index = i
                }
                this.sgfList = data
            },
            openLdpSgfCheck(val){
                let path = [
                    '/engine/lifeAndDeath'
                ]
                let pathNow = this.pathNow
                let f = false
                for(var i in path){
                    if(pathNow.indexOf(path[i]) > -1){
                        f = true
                        break
                    }
                }
                return f
            },
            // async openLdpSgfCheckAsk(){
            //     let res = await this.$refs['leConfirm'].open({
            //         message: '是否在死活题模式下打开？',
            //         button: [
            //             {name: '是', label: 0},
            //             {name: '否', label: 1, type: 'cancel'},
            //         ]
            //     })
            //     res = res || {}
            //     if(res.label != 0) return {code: 1}
            //     return {code: 2}

            // },
            async openLdpSgf(val){
                let status = this.openLdpSgfCheck(val)
                this.turnOff()
                if(!status){
                    this._appData.setItem({
                        ldpId: val.id
                    }, 'lifeAndDeath')
                    this.GLOBAL.gotoLdp()
                    return
                }
                this.$emit('takeFun', {
                    fun: 'openLdpSgf',
                    data: val
                })
            },
            async deleteLdpSgf(val){
                let status = await this.deleteCheck()
                if(!status) return
                this.LOADING.open()
                let res = await this.GLOBAL.deleteLdpSgf(val.id)
                if(res && res.code == 0){
                    this.getRecordList(null, null, 'lifeDeath')
                }
                this.LOADING.close()
            },
            async deleteCheck(){
                let res = await this.$refs['leConfirm'].open({
                    message: `${this.GLOBAL.errorMsg.main['delete sgf confirm']}`,
                    button: [
                        {name: '确定', label: 0},
                        {name: '取消', label: 1, type:'cancel'}
                    ]
                })
                if(!res) return false
                let label = res.label
                return label == 0 ? true : false
            },

            async checkBoardSize(val){
                let check = this.needCheckSize
                val = val || {}
                let {boardSize} = val
                let p = check[boardSize]
                if(!p) return true
                let path = this.$route.path
                if(path.indexOf(p) <= -1){
                    let res = await this.boardSizeConfirm()
                    if(!res) return false
                    this.gotoGameSet(val)
                }else{
                    this._eventBus.$emit('openSgfById', val.id)
                }
                this.turnOff()
            },
            gotoGameSet(val){
                val = val || {}
                if(!val.id) return
                this.GLOBAL.gotoPage({
                    page: 'play',
                    path: 'configFull',
                    opt: {
                        params: {
                            sgfId: val.id
                        }
                    }
                })
            },
            async boardSizeConfirm(){
                let res = await this.$refs['leConfirm'].open({
                    message: '该棋谱无法在当前页面打开，是否跳转到对弈？',
                    button: [
                        {name: '是', label: 0},
                        {name: '否', label: 1, type: 'cancel'},
                    ]
                })
                res = res || {}
                return res.label == 0
            },
            openSgfFloat(opt){
                console.log(opt)
                let {val, type} = opt
                if(!val || !type) return
                let fun = this.getOpenSgfFun(type)
                if(!fun || !this[fun]) return
                console.log(fun)
                this[fun](val)
            },
            getOpenSgfFun(type){
                let list = {
                    'ldp': 'openLdpSgf',
                    'situation': 'openSgfEngineBoard',
                    'normal': 'openSgf'
                }
                let fun = list[type]
                if(!fun) fun = list['normal']
                return fun
            }
        },
        created() {
            this._appData = new this.appData({key: 'sgf_component'})
            this.listCopy = this.GLOBAL.deepCopy(this.list)
            this.listNew = this.GLOBAL.deepCopy(this.listCopy)
            this.photoInit()
            this.pageInit()
            this.SgfParse = new SgfParse({
                size: 19
            })
        },
        components: {
            saveEngineBoardPanel,
            createSituationFolder,
            sgfListCom
        },
        computed: {
            needCheckSize(){
                let {pathNow} = this
                let p = this.GLOBAL.pageList.play.main
                let list = {
                    
                    '13': this.GLOBAL.pageList.play.main,
                    '9': this.GLOBAL.pageList.play.main
                }
                if(pathNow.indexOf(p) > -1) list['19'] = this.GLOBAL.pageList.play.main
                return list
            },
            selectMenuKeyCul(){
                let key = this.selectMenuKey
                let list = this.listNew
                if(!key) return '0-0'
                key = key.split('-')
                let p = Number(key[0]), c = Number(key[1])
                let data = null
                if(!isNaN(p) && isNaN(c)){
                    try{
                        data = list[p]
                    }catch(e){}
                    if(!data) return '0-0'
                    return this.selectMenuKey
                }
                if(isNaN(p) || isNaN(c)) return '0-0'
                try{
                    data = list[p].submenu[c]
                }catch(e){}
                if(!data || data.type == 'createFolder') return '0-0'
                return this.selectMenuKey
            },
            // folderList(){
            //     let list = this.listCopy
            //     list = list[1] || {}
            //     list = list.submenu || []
            //     let rd = []
            //     for(var i in list){
            //         rd.push(list[i].value)
            //     }
            //     return rd
            // },
            isEnginePage(){
                let path = this.pathNow
                return path.indexOf('/engine/analyse') > -1
            },
            normalDisplay(){
                return this.openNodeType == 'normal'
            },
            engineDisplay(){
                return this.openNodeType == 'engineSgf'
            },
            ldpDisplay(){
                return this.openNodeType == 'lifeDeath'
            },
            emitOpenSgf(){
                let list = [
                    '/engine/play',
                    '/engine/game',
                    '/engine/analyse',
                    '/engine/report',
                    '/engine/class/room'
                ]
                let path = this.pathNow, f = false
                for(var i in list){
                    if(path.indexOf(list[i]) > -1){
                        f = true
                        break
                    }
                }
                return f
            },
            isLastPage(){
                let pageNum = this.amountPage
                if(this.page >= pageNum) return true
                return false
            },
            defaultExpandNode(){
                let key = this.selectMenuKeyCul
                return [key]
            }
        },
        watch: {
            panelSwitch: {
                handler(val){
                    let fun = val ? 'saveEngineBoardPanelOn' : 'saveEngineBoardPanelOff'
                    this.$emit('takeFun', {
                        fun: fun
                    })
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
            },
        },
        mounted() {
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
    .sgf-hub-float{
        .el-dialog__wrapper{
            display: flex;
            align-items: center;
            justify-content: center;
            .el-dialog{
                margin: 0px !important;
                height: 90vh;
            }
        }
        .el-dialog__body{
            padding: 0px;
            height: 100%;
        }
        .el-dialog__header{
            padding: 0px;
        }
        .hub-close-icon{
            font-size: 1.5rem;
            color: #fff;
            cursor: pointer;
        }
        .sgf-float-content{
            height: calc(100% - 3.5rem);
            .sgf-hub-list{
                height: 100%;
                .sgf-list-body{
                    height: 100%;
                }
            }
        }
    }
</style>