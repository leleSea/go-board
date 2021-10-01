<!--  -->
<template>
    <div class='save-engine-board-panel'>
        <le-confirm ref="leConfirm" @open="panelOpen" @close="panelClose" class="sit-list-data-box">
            <template v-slot:message>

                <div class="save-engine-data-box-new">
                    <div class="save-body">
                        <div class="save-item list"
                        v-loading="folderListLoading"
                        element-loading-background="rgba(0, 0, 0, 0.0)"
                        element-loading-spinner="page-loading-icon-css light"
                        >
                            <div class="folder-tree-body mini-scrollbar" ref="folderTreeBox" @mouseleave="hoverNode = null">
                                <el-tree :data="folderListData" :props="defaultProps" @node-click="menuTreeHandle" node-key="key" ref="folderTree"
                                @node-expand="nodeExpand"
                                @node-collapse="nodeCollapse"
                                @current-change="folderNodeChange"
                                :default-expand-all="true">
                                    <span class="menu-tree-node hidepoint"  slot-scope="{ node, data }" 
                                    @mouseenter="hoverNode = data"
                                    :class="{'root': data.root == true, 'selected': selectedNodeCul.data == data.data}">
                                        <img :src="`${GLOBAL.assetsUrl}/img/${data.root ? 'i7_3' : 'sa2'}.png`" class="folder-icon" 
                                        :class="{'root-icon': data.root, 'rotate90': data.root && rootNode.status}"
                                        >
                                        <span v-if="data.type != 'create'" :class="`node-${data.nodeNum} txt node-name`">
                                            {{$t(node.label)}}
                                        </span>
                                        <el-input v-if="data.type == 'create'" v-model="createFolder.name" class="create-folder-input"></el-input>
                                        <span class="el-icon-close delete-folder-icon" @click.stop="deleteFolder(data)" v-show="hoverNodeCul.data == data.data" v-if="!data.root && !data.default"></span>
                                    </span>
                                </el-tree>
                            </div>
                            
                            <div class="create-folder-btn" @click="createFolderCon">
                                <span class="txt el-icon-plus plus"></span>
                                <span class="txt">{{$t('新建盘面夹')}}</span>
                            </div>
                        </div>
                        <div class="save-item content">
                            <div class="content-sgf-list mini-scrollbar"
                            v-loading="sgfList.loading"
                            element-loading-background="rgba(0, 0, 0, 0.0)"
                            element-loading-spinner="page-loading-icon-css light"
                            >
                                <ul class="sgf-list-body">
                                    <li class="sgf-item" v-for="(v, i) in sgfListCul" :key="i">
                                        <div class="item-it name">
                                            <img :src="`${GLOBAL.assetsUrl}/img/sa3.png`" class="sgf-icon">
                                            <span class="txt n hide-point-txt">{{v.gamename}}</span>
                                            <span class="txt p">[{{v.moveNum}}{{$t('手')}}]</span>
                                        </div>
                                        <div class="item-it time">
                                            <span class="txt">{{`${v.createTime.date.year}/${v.createTime.date.month}/${v.createTime.date.day}`}}</span>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div class="content-sgf-save">
                                <div class="save-ele tit">
                                    <span class="txt">{{$t('盘面名称')}}</span>
                                </div>
                                <div class="save-ele input">
                                    <el-input v-model="dataName"></el-input>
                                </div>
                            </div>
                        </div>
                    </div>
                    <createSituationFolder ref="createSituationFolder" :folderList.sync="folderList" @createFolderComplete="createFolderComplete"></createSituationFolder>
                    <le-confirm ref="deleteConfirm"></le-confirm>
                </div>
            </template>
        </le-confirm>
        
    </div>
</template>

<script>
    import createSituationFolder from './createSituationFolder.vue'

    export default {
        name: 'saveEngineBoardPanel',
        props: {
            SgfParse: Object
        },
        data() {
            return {
                hoverNode: null,
                sgfList: {
                    data: [],
                    loading: false,
                    node: null
                },
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                dataName: '我的新盘面',
                dataNameCopy: '我的新盘面',
                folderList: [],
                folderListLoading: false,
                folderSelect: null,
                createFolder: {
                    name: null,
                    oldName: null,
                    active: false,
                    loading: false
                },
                moves: null,
                defaultName: '新建文件夹',
                selectedNode: null,
                rootNode: {
                    status: true
                }
            };
        },
        methods: {
            menuTreeHandle(node){
            },
            folderNodeChange(node){
                this.selectedNode = node
            },
            open(moves){
                if(moves == undefined) return
                this.pageInit()
                this.moves = moves
                this.$nextTick(() => {
                    this.$refs['leConfirm'].open({
                        button: [
                            {name: '确定', fun: this.saveConfirm},
                            {name: '取消', type: 'cancel', fun: this.turnOff}
                        ],
                        autoClose: false
                    })
                })
            },
            turnOff(){
                this.$refs['leConfirm'].close()

            },
            initData(){
                this.moves = null
                this.createFolder = {
                    name: null,
                    oldName: null,
                    active: false,
                    loading: false
                }
                this.dataName = '我的新盘面'
                this.folderSelect = null
                this.folderList = []
                this.selectedNode = null
            },
            async pageInit(){
                this.initData()
                await this.folderInit()
            },
            async folderInit(type){
                let res = await this.folderInitAction()
                if(res && res.code == 0){
                    this.$nextTick(() => {
                        if(this.folderListCulNew && this.folderListCulNew.length){
                            let keys
                            try{
                                keys = this.folderListCulNew[0].key
                            }catch(e){}
                            if(keys == undefined) return
                            this.$refs['folderTree'].setCurrentKey(keys)
                        }
                        this.folderNodeChange(this.$refs['folderTree'].getCurrentNode())
                    })
                }
            },
            async folderInitAction(type){
                 this.folderListLoading = true
                 type = type || ''
                 if(type.indexOf('delete') > -1){
                     this.folderList = []
                    this.sgfList.data = []
                 }
                let res = await this.GLOBAL.getSaceBoardFolder()
                if(res && res.code == 0){
                    this.folderList = res.data
                    this.folderSelect = 0
                }
                this.folderListLoading = false
                return res
            },
            createFolderCon(){
                let name = this.getCreateDefaultName()
                this.createFolder.name = name
                this.createFolder.active = true
                this.$refs['createSituationFolder'].open()
            },
            createFolderOff(){
                this.createFolder.active = false
                this.$refs['createFolder'].close()
            },
            getCreateDefaultName(){
                let list = this.folderListCul
                let name = this.defaultName
                let rd = {}
                for(var i in list){
                    rd[list[i].name] = true
                }
                if(rd[name] != undefined){
                    for(var i = 1; i >= 1; i++){
                        if(rd[`${name}${i}`] == undefined){
                            name = `${name}${i}`
                            break
                        }
                    }
                }
                return name
            },
            folderSelectCon(val){
                if(!val) return
                this.folderSelect = val.value
            },
            createNameInput(e){
                this.createFolder.name = e.target.innerText
            },
            dataCheck(){
                let f = true
                if(!this.dataName){
                    this.GLOBAL.MessageOpen({
                        message: this.$i18n.t('请输入盘面名称')
                    })
                    f = false
                }
                return f
            },
            folderFocus(){
                let ele = document.querySelector('.create-folder-input .el-input__inner')
                if(!ele) return
                ele.focus()
            },
            folderTextSelect(){
                let ele = document.querySelector('.create-folder-input .el-input__inner')
                if(!ele) return
                ele.select()
            },
            async saveConfirm(){
                if(!this.dataCheck()) return
                let folder = null
                try{
                    folder = this.$refs['folderTree'].getCurrentNode().data
                }catch(e){}
                let moves = this.moves
                let name = this.dataName
                if(!folder) return
                this.LOADING.open()
                let res = await this.GLOBAL.saveSaceBoardData(moves, folder, name)
                if(res && res.code == 0){
                    this.GLOBAL.MessageOpen({
                        message: `${this.$i18n.t('保存成功')}！`,
                        type: 'success'
                    })
                    this.turnOff()
                }
                this.LOADING.close()
            },
            panelOpen(){
                this.$emit('open')
            },
            panelClose(){
                this.$emit('close')
            },
            async createFolderConfirm(){
                if(this.folderNameDisabled.disabled) return
                this.createFolder.loading = true
                let name = this.createFolder.name
                let res = await this.GLOBAL.createStiustionFolder(name)
                if(res && res.code == 0){
                    let r = await this.folderInitAction()
                    if(r && r.code == 0) this.createFolderSuccess()
                    this.createFolderOff()
                }
                this.createFolder.loading = false
            },
            async createFolderComplete(res, name){
                if(res && res.code == 0){
                    let r = await this.folderInitAction()
                    if(r && r.code == 0) this.createFolderSuccess()
                }
            },
            async SgfDataListLoad(){
                let node = this.selectedNode
                if(!node || !node.data) return
                this.sgfList.data = []
                this.sgfList.node = null
                this.sgfList.loading = true
                let folder = node.data
                let res = await this.GLOBAL.getEngineSgfByFolder(folder)
                if(res && res.code == 0){
                    this.sgfList.data = res.data
                }
                this.sgfList.loading = false
                this.sgfList.node = node
            },
            parseSgfFile(fileData, type){
                let sgfData = this.SgfParse.parseSgfFile(fileData, type)
                return sgfData
            },
            createFolderSuccess(){
                this.$nextTick(() => {
                    let data = this.folderListCulNew[this.folderListCulNew.length - 1]
                    let key = data.key
                    this.$refs['folderTree'].setCurrentKey(key)
                    this.$nextTick(() => {
                        this.$refs['folderTreeBox'].scrollTop = this.$refs['folderTreeBox'].offsetHeight
                        this.folderNodeChange(this.$refs['folderTree'].getCurrentNode())
                    })
                })
            },
            nodeExpand(node){
                this.rootNode.status = true
            },
            nodeCollapse(node){
                this.rootNode.status = false
            },
            async deleteCheck(node){
                if(!node || !node.data) return false
                let res = await this.$refs['deleteConfirm'].open({
                    message: `${this.GLOBAL.errorMsg.main['delete situation folder confirm']}`,
                    button: [
                        {name: '确定', label: 0},
                        {name: '取消', label: 1, type: 'cancel'}
                    ]
                })
                if(!res) return false
                let label = res.label
                return label == 0 ? true : false
            },
            async deleteFolder(node){
                let f = await this.deleteCheck(node)
                if(!f) return
                let folder = node.data
                this.folderListLoading = true
                let res = await this.GLOBAL.deleteSitFolder(folder)
                if(res && res.code == 0){
                    this.folderInit('delete')
                }
                this.folderListLoading = false
            },
            takeFun(opt){
                let fun = opt.fun
                if(this[fun]) this[fun](opt.data)
            },
        },
        created() {

        },
        components: {
            createSituationFolder
        },
        computed: {
            hoverNodeCul(){
                return this.hoverNode || {}
            },
            selectedNodeCul(){
                return this.sgfList.node || {}
            },
            sgfListCul(){
                let list = this.GLOBAL.deepCopy(this.sgfList.data) || []
                for(var i in list){
                    let sgfData = this.parseSgfFile(list[i].moves)
                    if(!sgfData || !sgfData.normal) continue
                    list[i].createTime = this.GLOBAL.changenum(list[i].createTime)
                    list[i].gamename = list[i].name
                    list[i].gameResult = ''
                    list[i].pb = sgfData.info.pb
                    list[i].pw = sgfData.info.pw
                    list[i].blackLevel = this.GLOBAL.getLevelNew(sgfData.info.br)
                    list[i].whiteLevel = this.GLOBAL.getLevelNew(sgfData.info.wr)
                    list[i].moveNum = sgfData.normal.length
                    list[i].gameType = sgfData.info.up
                    list[i].index = i
                }
                return list
            },
            folderNameDisabled(){
                if(this.createNameISUnavai) return {disabled: true, txt: this.$i18n.t('存在同名文件夹，请重新输入')} 
                let name = this.createFolder.name
                if(!name) return {disabled: true, txt: ''}
                return {disabled: false, txt: ''}
            },
            createFolderDisabled(){
                return this.createFolder.active
            },
            folderListData(){
                let data = [{name: '我的盘面', root: true, key: 0}]
                let list = this.folderListCulNew || []
                data[0].children = list
                return data
            },
            folderListCulNew(){
                let list = this.GLOBAL.deepCopy(this.folderList) || []
                let rd = []
                let kde = '0'
                for(var i in list){
                    let name = list[i]
                    let type = list[i].type || 'normal'
                    let defaultFolder = this.GLOBAL.engineSgfNameGet(name)
                    rd.push({
                        name: name,
                        type: type,
                        data: list[i],
                        value: i,
                        key: `${kde}${i}`,
                        default: defaultFolder
                    })
                }
                return rd
            },
            folderListCul(){
                let list = this.folderList || []
                let createFolder = this.createFolder || []
                let rd = []
                for(var i in list){
                    let name = list[i]
                    let type = list[i].type || 'normal'
                    // name = this.GLOBAL.engineSgfNameGet(name)
                    // if(list[i] == 'default'){
                    //     name = this.$i18n.t('默认文件夹')
                    // }
                    rd.push({
                        name: name,
                        type: type,
                        data: list[i],
                        value: i
                    })
                }
                if(createFolder && createFolder.active){
                    rd.push({
                        name: createFolder.name,
                        type: 'create',
                        data: createFolder.name,
                        value: list.length
                    })
                }
                return rd
            },
            createNameISUnavai(){
                if(!this.createFolder.active) return false
                let name = this.createFolder.name
                let list = this.folderList
                let f = false
                for(var i in list){
                    if(list[i] == name){
                        f = true
                        break
                    }
                }
                return f
            },
        },
        watch: {
            selectedNode: {
                handler(val){
                    this.SgfDataListLoad()
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
        beforeDestroy() {}, //生命周期 - 销毁之前
        destroyed() {}, //生命周期 - 销毁完成
        activated() {}, //如果页面有keep-alive缓存功能，这个函数会触发
    }
</script>
<style lang='less' >
    .save-engine-board-panel{
        @subTitleWidth: 3.5rem;
        .save-engine-data-box{
            padding: 1rem 0px;
            .save-name-box{
                display: flex;
                align-items: center;
                .save-s-t{
                    white-space: nowrap;
                    text-align: left;
                    width: @subTitleWidth;
                }
                .save-s-i{
                    width: calc(100% - @subTitleWidth);
                    .el-input__inner{
                        width: 100%;
                        height: 1.7rem;
                    }
                }
            }
            .save-position-box{
                text-align: left;
                padding-top: 1rem;
                .save-po-t{
                    display: flex;
                    align-items: center;
                    .save-t-item.fun{
                        // margin-left: 0.5rem;
                        .el-button{
                            height: 1.5rem;
                            width: 5rem;
                            .icon-txt{
                                margin-left: 0.2rem;
                            }
                        }
                    }
                    .save-t-item.title{
                        width: @subTitleWidth;
                    }
                }
                .save-po-c{
                    display: flex;
                    padding-top: 1rem;
                    max-height: 9rem;
                    .folder-box{
                        overflow-y: auto;
                        .folder-item.selected{
                            background: #fff;
                        }
                        .folder-item{
                            padding: 0.5rem;
                            float: left;
                            width: 5rem;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            cursor: pointer;
                            .item-body{
                                .item-img{
                                    display: flex;
                                    justify-content: center;
                                    img{
                                        width: 2rem;
                                        float: left;
                                    }
                                }
                                .item-txt{
                                    margin-top: 0.2rem;
                                    text-align: center;
                                    .txt.create{
                                        padding: 0px 0.2rem;
                                    }
                                }
                            }
                            .el-input__inner{
                                padding: 0px 0.2rem;
                                height: 1rem;
                                background: none;
                                font-size: 0.6rem;
                                border: 0px;
                                text-align: center;
                            }
                            .create-folder-input{
                                .el-input__inner:focus{
                                    border: 1px solid #333;
                                    text-align: left;
                                }
                            }
                        }
                        .folder-create{

                        }
                    }
                }
            }
        }
        .sit-list-data-box{
            > .le-confirm-body{
                max-width: 42rem;
                width: 35rem;
            }
        }
        // .le-confirm-body{
        //     max-width: 42rem;
        // }
        


        .le-confirm-content-s{
            padding: 0px;
        }
        .save-engine-data-box-new{
            padding: 0.5rem 0px;
            height: 25vh;
            .el-tree{
                background: none;
                color: #333;
                .el-tree-node__children{
                    // padding-left: 0.5rem;
                }
            }
            .save-body{
                height: 100%;
                display: flex;
                .save-item.list{
                    position: relative;
                    padding: 0.5rem 0px;
                    width: 25%;
                    border-right: 0.07rem solid #fff;
                    .folder-tree-body{
                        max-height: 100%;
                    }
                    .create-folder-btn{
                        height: 1.6rem;
                        display: flex;
                        align-items: center;
                        cursor: pointer;
                    }
                    .el-tree-node__children.is-current{
                        background: #fff;
                    }
                    .el-tree-node__content>.el-tree-node__expand-icon{
                        display: none;
                    }
                    // .el-tree-node{
                    //     > .el-tree-node__content{
                    //         padding: 0px;
                    //     }
                    // }
                    .el-tree-node__content{
                        height: 1.6rem;
                        // padding: 0px 0.5rem 0px !important;
                        padding: 0px !important;
                        .el-tree-node__expand-icon{
                            // display: none;
                        }
                        .el-tree-node__expand-icon.expanded{
                            color: #333;
                            font-size: 0.8rem;
                            padding: 0px 0.2rem;
                        }
                        .el-tree-node__expand-icon.is-leaf{
                            display: none;
                        }
                        .el-input__inner{
                            padding: 0px 0.2rem;
                            height: 1.2rem;
                            background: none;
                            border: 0px;
                        }
                        .el-input__inner:focus{
                            border: 1px solid #333;
                            text-align: left;
                        }
                    }
                    .menu-tree-node.selected{
                        background: #fff;
                    }
                    .menu-tree-node.root{
                        padding-left: 0.5rem;
                    }
                    .menu-tree-node{
                        width: 100%;
                        height: 100%;
                        display: flex;
                        align-items: center;
                        padding: 0px 0.5rem;
                        padding-left: 1rem;
                        position: relative;
                        .folder-icon{
                            width: 0.8rem;
                            margin-right: 0.3rem;
                        }
                        .folder-icon.root-icon{
                            width: 0.35rem;
                            transition: all .2s;
                        }
                        .node-name{
                            position: relative;
                        }
                        .delete-folder-icon{
                            position: absolute;
                            right: 0.5rem;
                            top: 0px;
                            bottom: 0px;
                            margin: auto;
                            height: 0.5rem;
                            font-size: 0.6rem;
                            cursor: pointer;
                        }
                    }
                    .create-folder-btn{
                        .txt.plus{
                            font-size: 0.7rem;
                            padding: 0px 0.2rem 0px 0.8rem;
                        }
                    }
                }
                .save-item.content{
                    width: 75%;
                    position: relative;
                    padding: 0.5rem 0.5rem 2.5rem;
                    .content-sgf-save{
                        padding: 0px 0.5rem 0.5rem;
                        position: absolute;
                        bottom: 0px;
                        left: 0px;
                        width: 100%;
                        display: flex;
                        align-items: center;
                        .save-ele.tit{
                            white-space: nowrap;
                            margin-right: 0.5rem;
                        }
                        .save-ele.input{
                            width: 100%;
                            .el-input__inner{
                                height: 1.5rem;
                                padding: 0px 0.2rem;
                            }
                        } 
                    }
                    .content-sgf-list{
                        height: 100%;
                        .sgf-list-body{
                            .sgf-item{
                                display: flex;
                                .item-it.name{
                                    display: flex;
                                    align-items: center;
                                    width: calc(100% - 4rem);
                                    .sgf-icon{
                                        width: 0.7rem;
                                        margin-right: 0.2rem;
                                    }
                                    .txt.p{
                                        white-space: nowrap;
                                        margin-left: 0.2rem;
                                    }
                                } 
                                .item-it.time{
                                    width: 4rem;
                                    text-align: right;
                                    white-space: nowrap;
                                } 
                            }
                        }
                    }
                }
            }
        }
        .save-engine-data-create-folder{
            // background: none;
            position: absolute;
            .le-confirm-title{
                display: none;
            }
            .le-confirm-body{
                min-width: 0;
                .create-panel{
                    padding: 2rem 1rem 1rem;
                    position: relative;
                    .create-error{
                        position: absolute;
                        top: 0.5rem;
                        left: 0px;
                        width: 100%;
                        text-align: center;
                        color: @errorColor;
                        .txt{
                            font-size: 0.6rem;
                        }
                    }
                    .create-panel-body{
                        display: flex;
                        align-items: center;
                        .create-tit{
                            white-space: nowrap;
                        }
                        .create-input{
                            .el-input__inner{
                                height: 1.5rem;
                            }
                        }
                    }
                }
            }
            .create-panel-foot{
                margin-top: 1rem;
                display: flex;
                justify-content: flex-end;
                .el-button{
                    height: 1.2rem;
                    width: 3rem;
                }
            }
        }
    }
</style>