<!--  -->
<template>
   <div class='sgf-com'>
       <el-dialog
        title=""
        :visible="panelSwitch"
        :show-close="false"
        width="38rem"
        :close-on-click-modal="false"
        :before-close="turnOff">
            <div class="sgf-content">
                <div class="sgf-close-icon" @click="turnPanelOff">
                    <span class="sgf-close-icon-i el-icon-close"></span>
                </div>
                <div class="sgf-page-title">
                    <span class="txt">{{ $t('棋谱库') }}</span>
                </div>
                <div class="sgf-content-body">
                    <div class="sgf-content-item left">
                        <div class="sgf-left-title visibility-hidden">
                            <span class="txt">{{ $t('棋谱库') }}</span>
                        </div>
                        <div class="sgf-left-menu scoll-bar-define" @mouseleave="sitSelectNode = null">
                            <el-tree 
                            :data="listNew" 
                            :props="defaultProps" 
                            @node-click="menuTreeHandle" 
                            @change="nodeChange"
                            node-key="key" 
                            ref="menuNodeTree"
                            :default-expanded-keys.sync="defaultExpandNode">
                                <span class="menu-tree-node hidepoint"  slot-scope="{ node, data }" 
                                :class="{'selected': data.key == selectMenuKeyCul && data.type != 'createFolder', 'create': data.type == 'createFolder', 'last-folder': data.signLabel, 'board-view': data.board}"
                                @mouseenter="sitSelectNode = data"
                                >
                                    <span class="el-icon-plus plus txt" v-if="data.type == 'createFolder'"></span>
                                    <img v-if="data.type != 'createFolder' && !data.children" :src="`${GLOBAL.assetsUrl}/img/sa1.png`" class="folder-icon">
                                    <span :class="`node-${data.nodeNum} txt`">{{ $t(node.label) }}</span>
                                    <span 
                                    @click.stop="deleteFolder(data)"
                                    class="el-icon-close delete-folder-icon" 
                                    v-if="data.type == 'situation' && !data.default" 
                                    v-show="sitSelectNode && sitSelectNode.value == data.value"
                                   ></span> 
                                    <!-- <div class="create-folder-box" v-if="data.signLabel" @click="createSitFolderOn">
                                        <span class="el-icon-plus plus txt"></span>
                                        <span class="txt">新建</span>
                                    </div> -->
                                </span>
                            </el-tree>
                        </div>
                    </div>
                    <div class="sgf-content-item right">
                        <div class="sgf-content-item-right-body">
                            <div class="sgf-right-title">
                                <el-button type="default" class="right-btn" @click="uploadTurnOn">
                                    <span class="right-btn-icon el-icon-plus"></span>
                                    <span class="txt">{{ $t('上传棋谱') }}</span>
                                </el-button>
                            </div>
                            <div class="sgf-right-content">
                                <div class="sgf-right-content-body mini-scrollbar" 
                                v-loading="sgfLoading"
                                element-loading-background="rgba(0, 0, 0, 0.0)"
                                element-loading-spinner="page-loading-icon-css light">
                                    <div class="list-box" v-for="(v, i) in sgfList" :key="v.id" v-if="normalDisplay" @dblclick="openSgf(v)">
                                        <div class="sgf-list-body">
                                            <div class="sgf-list-content">
                                                <div class="list-title">
                                                    <div class="title-re-icon" v-if="v.analyzeIcon != null">
                                                        <img class="report-icon" :src="`${GLOBAL.assetsUrl}/img/${v.analyzeIcon}`" alt="">
                                                    </div>
                                                    <div class="title-gn hidepoint">
                                                        <span class="txt hide-point-txt">{{$t(v.gamename)}}</span>
                                                        <span class="i-r-num">[{{v.moveNum}}{{ $t('手') }}]</span>
                                                        <span class="txt">[{{v.boardSize}}{{$t('路')}}]</span>
                                                    </div>
                                                    <div class="title-dt">
                                                        {{v.createTime.date.year}}-
                                                        {{v.createTime.date.month}}-
                                                        {{v.createTime.date.day}}
                                                    </div>
                                                </div>
                                                <ul class="sgf-right-item" :class="{'last': i == sgfList.length - 1}">
                                                    <li class="item-i b cb">
                                                        <div class="i-p photo-box">
                                                            <div class="photo-box-img">
                                                                <img class="user-photo" :src="GLOBAL.getPhotoForSgfMeta(v, v.pb, 'b', sgfUsernameDefine)" alt="">
                                                            </div>
                                                            <div class="stone-label sgf-box-item-border"></div>
                                                            <div class="result-icon black" v-if="v.win">
                                                                <img :src="`${GLOBAL.assetsUrl}/img/${v.win == 'b' ? 'r7' + theme : 'r8' + theme}.png`" alt="">
                                                            </div>
                                                        </div>
                                                        <div class="i-p" :class="{'flex-align-center': !sgfLevelCul(v.blackLevel)}">
                                                            <div class="bx i-name hidepoint">
                                                                <span class="txt hide-point-txt">{{$t(GLOBAL.getAIname(v, v.pb, 'b'))}}</span>
                                                                <span class="txt level" v-if="sgfLevelCul(v.blackLevel)">{{$t(sgfLevelCul(v.blackLevel))}}</span>
                                                            </div>
                                                        </div>
                                                    </li>
                                                    <li class="item-i c">
                                                        <div class="i-r">
                                                            <span>
                                                                <span v-if="!v.gameResult.num">{{$t(v.gameResult.txt)}}</span>
                                                                <span v-else>
                                                                    {{v.gameResult.win == 'b' ? $t('黑胜') : $t('白胜')}}
                                                                    <span v-if="v.gameResult.winNum && v.gameResult.winNum > 0">
                                                                        <!-- {{v.gameResult.winNum | decimalsToFractional}}{{ $t('子') }} -->
                                                                        <span class="txt" v-if="v.gameResultType == 'normal'">{{v.gameResult.winNum | decimalsToFractional}}{{ $t('子') }}</span>
                                                                        <span class="txt" v-else>{{v.gameResult.winNum}}{{$t('目')}}</span>
                                                                    </span>
                                                                </span>
                                                                
                                                            </span>
                                                        </div>
                                                    </li>
                                                    <li class="item-i d cw">
                                                        <div class="i-p" :class="{'flex-align-center': !sgfLevelCul(v.whiteLevel)}">
                                                            <div class="bx i-name hidepoint">
                                                                <span class="txt hide-point-txt">{{$t(GLOBAL.getAIname(v, v.pw, 'w'))}}</span>
                                                                <span class="txt level" v-if="sgfLevelCul(v.whiteLevel)">
                                                                    {{$t(sgfLevelCul(v.whiteLevel))}}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div class="i-p photo-box">
                                                            <div class="photo-box-img">
                                                                <img class="user-photo" :src="GLOBAL.getPhotoForSgfMeta(v, v.pw, 'w', sgfUsernameDefine)" alt="">
                                                            </div>
                                                            <div class="stone-label sgf-box-item-border"></div>
                                                            <div class="result-icon white" v-if="v.win">
                                                                <img :src="`${GLOBAL.assetsUrl}/img/${v.win == 'w' ? 'r7' + theme : 'r8' + theme}.png`" alt="">
                                                            </div>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                            
                                            <div class="item-sgf-fun"
                                            v-loading="v.loading" 
                                            element-loading-spinner="page-loading-icon-css">
                                                <img class="handle-icon a" :src="`${GLOBAL.assetsUrl}/img/w27.png`" title="打开" @click="openSgf(v)">
                                                <img class="handle-icon b" :src="`${GLOBAL.assetsUrl}/img/w23.png`" title="下载" @click="downloadFile(v)">
                                                <img class="handle-icon c" :src="`${GLOBAL.assetsUrl}/img/w24.png`" title="删除" @click="deleteSgf(v)" v-if="!disabledHandle(v)">
                                                <!-- <img class="handle-icon d" :src="`${GLOBAL.assetsUrl}/img/${v.favourite ? 'w26' : 'w25'}.png`" :title="$t('收藏')" @click="favouriteCon(v)" v-if="!disabledHandle(v)"> -->
                                                <img class="handle-icon d" :src="`${GLOBAL.assetsUrl}/img/${v.favourite ? 'w26' : 'w25'}.png`" :title="$t(v.favourite ? '取消收藏' : '收藏')" @click="favouriteCon(v)">
                                            </div>
                                        </div>
                                        
                                    </div>
                                    <div class="list-box" v-for="(v, i) in sgfList" :key="v.id" v-if="engineDisplay" @dblclick="openSgfEngineBoard(v)">
                                        <div class="sgf-list-body">
                                            <div class="sgf-list-content">
                                                <div class="list-title">
                                                    <div class="title-re-icon" v-if="v.analyzeIcon != null">
                                                        <img class="report-icon" :src="`${GLOBAL.assetsUrl}/img/${v.analyzeIcon}`" alt="">
                                                    </div>
                                                    <div class="title-gn hidepoint">
                                                        <span class="txt hide-point-txt">{{$t(v.gamename)}}</span>
                                                        <span class="i-r-num">[{{v.moveNum}}{{ $t('手') }}]</span>
                                                    </div>
                                                    <div class="title-dt">
                                                        {{v.createTime.date.year}}-
                                                        {{v.createTime.date.month}}-
                                                        {{v.createTime.date.day}}
                                                    </div>
                                                </div>
                                                <ul class="sgf-right-item" :class="{'last': i == sgfList.length - 1}">
                                                    <li class="item-i b cb">
                                                        <div class="i-p photo-box">
                                                            <div class="photo-box-img">
                                                                <img class="user-photo" :src="GLOBAL.getPhotoForSgfMeta(v, v.pb, 'b', sgfUsernameDefine)" alt="">
                                                            </div>
                                                            <div class="stone-label sgf-box-item-border"></div>
                                                        </div>
                                                        <div class="i-p" :class="{'flex-align-center': !sgfLevelCul(v.blackLevel)}">
                                                            <div class="bx i-name hidepoint">
                                                                <span class="txt hide-point-txt">{{$t(GLOBAL.getAIname(v, v.pb, 'b'))}}</span>
                                                                <span class="txt level" v-if="sgfLevelCul(v.blackLevel)">{{$t(sgfLevelCul(v.blackLevel))}}</span>
                                                            </div>
                                                        </div>
                                                    </li>
                                                    <li class="item-i c">
                                                    </li>
                                                    <li class="item-i d cw">
                                                        <div class="i-p" :class="{'flex-align-center': !sgfLevelCul(v.whiteLevel)}">
                                                            <div class="bx i-name hidepoint">
                                                                <span class="txt hide-point-txt">{{$t(GLOBAL.getAIname(v, v.pw, 'w'))}}</span>
                                                                <span class="txt level" v-if="sgfLevelCul(v.whiteLevel)">
                                                                    {{$t(sgfLevelCul(v.whiteLevel))}}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div class="i-p photo-box">
                                                            <div class="photo-box-img">
                                                                <img class="user-photo" :src="GLOBAL.getPhotoForSgfMeta(v, v.pw, 'w', sgfUsernameDefine)" alt="">
                                                            </div>
                                                            <div class="stone-label sgf-box-item-border"></div>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                            <div class="item-sgf-fun"
                                            v-loading="v.loading" 
                                            element-loading-spinner="page-loading-icon-css">
                                                <img class="handle-icon a" :src="`${GLOBAL.assetsUrl}/img/w27.png`" title="打开" @click="openSgfEngineBoard(v)">
                                                <img class="handle-icon c" :src="`${GLOBAL.assetsUrl}/img/w24.png`" title="删除" @click="deleteSgfEngineBoard(v)">
                                                <!-- <img class="handle-icon d" :src="`${GLOBAL.assetsUrl}/img/${v.favourite ? 'w26' : 'w25'}.png`" :title="$t(v.favourite ? '取消收藏' : '收藏')" @click="favouriteCon(v, 'engineData')"> -->
                                            </div>
                                        </div>
                                    </div>
                                    <div class="list-box-set" v-if="ldpDisplay">
                                        <div class="list-box ldp" v-for="v in sgfList" :key="v.id" @dblclick="openLdpSgf(v)">
                                            <div class="sgf-list-body">
                                                <div class="sgf-list-content">
                                                    <div class="list-title">
                                                        <div class="title-re-icon" v-if="v.analyzeIcon != null">
                                                            <img class="report-icon" :src="`${GLOBAL.assetsUrl}/img/${v.analyzeIcon}`" alt="">
                                                        </div>
                                                        <div class="title-gn hidepoint">
                                                            <span class="txt hide-point-txt">{{$t(v.gamename)}}</span>
                                                        </div>
                                                        <div class="title-dt">
                                                            {{v.createTime.date.year}}-
                                                            {{v.createTime.date.month}}-
                                                            {{v.createTime.date.day}}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="item-sgf-fun"
                                                v-loading="v.loading" 
                                                element-loading-spinner="page-loading-icon-css">
                                                    <img class="handle-icon a" :src="`${GLOBAL.assetsUrl}/img/w27.png`" title="打开" @click="openLdpSgf(v)">
                                                    <img class="handle-icon c" :src="`${GLOBAL.assetsUrl}/img/w24.png`" title="删除" @click="deleteLdpSgf(v)">
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="none-data" v-show="!sgfList.length && !sgfLoading">
                                        {{ $t('暂无棋谱') }}
                                    </div>
                                </div>
                                <div class="page-pagination-box" :class="{'visibility-hidden': engineDisplay}">
                                    <div class="page-pre">
                                        <el-button type="text" @click="pageChangeHandle(-1, page <= 1)" :disabled="page <= 1">
                                            <span class="txt">{{ $t('上一页') }}</span>
                                        </el-button>
                                    </div>
                                    <el-pagination
                                    @size-change="pageChangeAction"
                                    @current-change="pageChangeAction"
                                    :page-size="size"
                                    :current-page="page"
                                    background
                                    class="store-pagination"
                                    layout="pager"
                                    :total="total">
                                    <!-- :total="$t(total)" -->
                                    </el-pagination>
                                    <div class="page-next">
                                        <el-button type="text" @click="pageChangeHandle(1, isLastPage)" :disabled="isLastPage">
                                            <span class="txt">{{ $t('下一页') }}</span>
                                        </el-button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                </div>
                
                
            </div>
        </el-dialog>
        <le-confirm ref="saveSgfPanel" v-if="uploadSwitch">
            <template v-slot:message>
                <div class="save-sgf-box">
                    <div class="save-title">
                        <span class="txt">{{$t('保存到棋谱库')}}</span>
                    </div>
                    <table class="save-sgf-table">
                        <tr>
                            <td class="td-txt">{{$t('棋谱')}}</td>
                            <td class="td-content">
                                <div class="save-file-area">
                                    <el-input type="text" v-model="loadSgfData.sgfInfo.fileName.value" :disabled="!loadSgfData.file"></el-input>
                                    <input type="file" hidden ref="loadSgf" id="loadSgfBtnSgf" @change="selectedFile">
                                    <img class="item-icon" :src="`${GLOBAL.assetsUrl}/img/w28.png`" @click="loadSgfSelect" v-if="!uploadOutside">
                                </div>
                            </td>
                            <td class="td-txt">
                                <span class="txt">{{$t('日期')}}</span>
                            </td>
                            <td class="td-content">
                                <el-date-picker
                                v-model="loadSgfData.sgfInfo.dt.value"
                                :disabled="!loadSgfData.file"
                                @change="dtChange"
                                align="right"
                                type="date"
                                :placeholder="$t('选择日期')">
                                </el-date-picker>
                            </td>
                        </tr>
                        <tr>
                            <td class="td-txt"><span class="txt">{{$t('黑方')}}</span></td>
                            <td class="td-content">
                                <el-input type="text" :disabled="!loadSgfData.file" v-model="loadSgfData.sgfInfo.pb.value"></el-input>
                            </td>
                            <td class="td-txt"><span class="txt">{{$t('黑方段位')}}</span></td>
                            <td class="td-content">
                                <el-input type="text" :disabled="!loadSgfData.file" v-model="loadSgfData.sgfInfo.br.value"></el-input>
                            </td>
                        </tr>
                        <tr>
                            <td class="td-txt"><span class="txt">{{$t('白方')}}</span></td>
                            <td class="td-content">
                                <el-input type="text" :disabled="!loadSgfData.file" v-model="loadSgfData.sgfInfo.pw.value"></el-input>
                            </td>
                            <td class="td-txt"><span class="txt">{{$t('白方段位')}}</span></td>
                            <td class="td-content">
                                <el-input type="text" :disabled="!loadSgfData.file" v-model="loadSgfData.sgfInfo.wr.value"></el-input>
                            </td>
                        </tr>
                        <tr>
                            <td class="td-txt"><span class="txt">{{$t('贴目')}}</span></td>
                            <td class="td-content">
                                <el-select :popper-append-to-body="false" :disabled="!loadSgfData.file" v-model="loadSgfData.sgfInfo.km.value" :placeholder="$t('贴目')" @change="komiChange">
                                    <el-option
                                    v-for="item in komiOpt.data"
                                    :key="item.value"
                                    :label="$t(item.name)"
                                    :value="item.value">
                                    <span>{{$t(item.label)}}</span>
                                    </el-option>
                                </el-select>
                            </td>
                            <td class="td-txt"><span class="txt">{{$t('结果')}}</span></td>
                            <td class="td-content">
                                <div class="game-result">
                                    <el-select :popper-append-to-body="false" :disabled="!loadSgfData.file" v-model="resultOpt.value" :placeholder="$t('对局结果')" @change="resultChange">
                                        <el-option
                                        v-for="item in resultOpt.data"
                                        :key="item.value"
                                        :label="$t(item.name)"
                                        :value="item.value">
                                        <span>{{$t(item.label)}}</span>
                                        </el-option>
                                    </el-select>
                                    <div class="re-num-box" v-show="GLOBAL.resultTxt[resultOpt.value] && GLOBAL.resultTxt[resultOpt.value].num">
                                        <el-input :disabled="!loadSgfData.file" class="re-num" type="text" v-model="resultOpt.num" placeholder=""></el-input>
                                        <span>{{ $t('子') }}</span>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </table>
                </div>
            </template>
        </le-confirm>
        <le-confirm ref="leConfirm"></le-confirm>
        <saveEngineBoardPanel ref="saveEngineBoardPanel" @open="saveEngineBoardPanelOn" @close="saveEngineBoardPanelOff" :SgfParse.sync="SgfParse"></saveEngineBoardPanel>
        <createSituationFolder ref="createSituationFolder" :folderList.sync="folderList" @createFolderComplete="createFolderComplete"></createSituationFolder>
   </div>
</template>

<script>
    import SgfParse from '../SgfParse.js'
    import saveEngineBoardPanel from './saveEngineBoardPanel.vue'
    import createSituationFolder from './createSituationFolder.vue'

    export default {
        name: 'sgfCom',
        data() {
            return {
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
                    // ai_level: this.$refs['setBoard'].computerLevel.value,
                    // color: this.gameInfo.userKey == 'b' ? 'black' : 'white',
                    // game_type: this.$refs['setBoard'].playTypeOpt.value,
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
                // await this.getEngineSgf()
                // await this.getStusSgf()
                // 
                await this.stuSgfAndEngineSgfInit()
                let indexOpt = this.getDefaultIndex()
                // let indexP = this.$store.state.sgfLibraryIndexP || 0
                // let indexC = this.$store.state.sgfLibraryIndexC || 0
                let indexP = indexOpt.indexP
                let indexC = indexOpt.indexC
                if(!this.list[indexP]) indexP = 0
                if(!this.list[indexP].submenu[indexC] || this.list[indexP].submenu[indexC].type == 'createFolder') indexC = 0
                // let ip = this.list[indexP].index, ic = this.list[indexP].submenu[indexC].index
                this.turnOn()
                // this.openSubmenuAction(ip, indexP)
                // let command = this.list[indexP].submenu[indexC].command
                // this.submenuSet(ic, indexC, indexP)
                // this.openPanel(command)
                



                
                this.$nextTick(() => {
                    this.localKeyInit()
                    this.$refs['menuNodeTree'].setCurrentKey(this.selectMenuKeyCul)
                    let node = this.getCurrentNodeByLocal()
                    this.selectMenuKey = node.key
                    this.openPanel(node.command)
                    this.$emit('takeFun', {
                        fun: 'timeStop'
                    })
                })
                // this.GLOBAL.setStoreItem({
                //     sgfLibraryIndexP: indexP,
                //     sgfLibraryIndexC: indexC
                // })
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
                    report: JSON.stringify(data)
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
            createSituationFolder
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
            uploadSwitch: {
                handler(val){
                    this.$nextTick(() => {
                        if(!this.$refs['saveSgfPanel']) return
                        if(val)
                            this.$refs['saveSgfPanel'].open({
                                button: [
                                    {name: '保存', fun: this.uploadConfirm},
                                    {name: '取消', fun: this.uploadTurnOff, type: 'cancel'},
                                ]
                            })
                        else    
                            this.$refs['saveSgfPanel'].close()
                    })
                },
                deep: true,
                immediate: true
            },
            selectMenuKey: {
                handler(val){
                    if(!val) return
                    this.$refs['menuNodeTree'].setCurrentKey(this.selectMenuKeyCul)
                },
                immediate: true,
                deep: true
            },
            // panelSwitch: {
            //     handler(val){
            //         if(val){
            //             this.localKeyInit()
            //         }
            //     },
            //     immediate: true,
            //     deep: true
            // },
        },
        mounted() {
            // this.$refs['saveEngineBoardPanel'].open('')
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
    .sgf-com{
        @boxWidth: 45rem;
        @leftWidth: 7.5rem;
        @submenuHeight: 1.2rem;
        @pageHeight: 33.5rem;
        @pagePaddingB: 1.5rem;
        @pagePaddingT: 1.5rem;
        @pageTitleH: 3rem;
        @pageTitleMarginBtm: 0.5rem;
        @PaginationMarginT: 1rem;
        @PaginationH: 1rem;
        @pageContentMenuHeight: calc(@pageHeight - @pagePaddingT * 2 - @pageTitleH - @pageTitleMarginBtm - @PaginationH - @PaginationMarginT);
        @listH: calc(3.06rem * 8.5);
        .el-dialog__wrapper{
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .el-dialog{
            // margin-top: calc((100vh - @boxWidth)) !important;
            // margin-top: 10vh !important;
            // margin-bottom: 0px;
            margin: 0px !important;
        }
        .el-dialog__header{
            padding: 0px;
        }
        .el-dialog__body{
            padding: 0px;
        }
        .sgf-content{
            padding: @pagePaddingT @pagePaddingB @pagePaddingT;
            position: relative;
            min-height: @pageHeight;
            // height: 37.55rem;
            .sgf-page-title{
                text-align: center;
                .txt{
                    font-size: 1rem;
                }
            }
            .sgf-content-body{
                display: flex;
            }
            .sgf-close-icon{
                position: absolute;
                top: 0.5rem;
                right: 0.5rem;
                cursor: pointer;
                .sgf-close-icon-i{
                    font-size: 1rem;
                }
            }
            .sgf-content-item{
            }
            .sgf-content-item.left{
                // padding-right: 1rem;
                width: @leftWidth;
                text-align: right;
                .sgf-left-title{
                    .txt{
                        font-size: 1rem;
                    }
                }
                .sgf-left-menu.scoll-bar-define::-webkit-scrollbar{
                    width: 2px;
                }
                .sgf-left-menu{
                    // height: @pageContentMenuHeight;
                    // height: calc(2.3rem * 10);
                    height: @listH;
                    overflow-y: auto;
                    .el-menu{
                        border: 0px;
                    }
                    .sgf-left-menu-body{
                        .el-submenu__icon-arrow{
                            display: none;
                        }
                        .el-submenu__title, .el-menu-item{
                            padding: 0.5rem 0px !important;
                            height: auto;
                            line-height: normal;
                        }
                        .submenu-item {
                            .el-submenu__title, .el-menu-item{
                                padding: 0.2rem 0px !important;
                            }
                        }
                        
                    }
                    .el-tree-node__content{
                        height: 1.3rem;
                        padding-left: 0px !important;
                        position: relative;
                    }
                    .el-tree-node__expand-icon{
                        font-size: 0.7rem;
                        padding: 0.25rem;
                    }
                    .el-tree-node__label{
                        font-size: 0.7rem;
                    }
                    .menu-tree-node.selected{
                        .txt{
                            font-weight: bold;
                        }
                    }
                    .menu-tree-node.create{
                        .txt{
                            font-size: 0.5rem;
                        }
                        .plus{
                            font-weight: bold;
                            margin-right: 0.2rem;
                        }
                    }
                    .menu-tree-node.board-view{
                        padding-right: 1rem;
                    }
                    .menu-tree-node{
                        // span.node-0{
                        //     font-size: 0.8rem;
                        // }
                        // span.node-1{
                        //     font-size: 0.7rem;
                        // }
                        // span.node-2{
                        //     font-size: 0.6rem;
                        // }
                        width: 6rem;
                        text-align: left;
                        span[class^='node-0']{
                            font-size: 0.7rem;
                        }
                        span[class^='node-1']{
                            font-size: 0.6rem;
                        }
                        span[class^='node-2']{
                            font-size: 0.6rem;
                        }
                    }
                    .el-tree-node{
                    }
                    // .el-tree{
                    //     > .el-tree-node:nth-child(2){
                    //         position: relative;
                    //         padding-bottom: 1.3rem;
                    //         .last-folder{
                    //             .create-folder-box{
                    //                 padding-left: 1.3rem;
                    //                 position: absolute;
                    //                 bottom: 0px;
                    //                 left: 0px;
                    //                 display: flex;
                    //                 align-items: center;
                    //                 height: 1.3rem;
                    //                 width: 100%;
                    //                 .plus{
                    //                     margin-right: 0.2rem;
                    //                 }
                    //             }
                    //         }
                    //     }
                    // }
                    
                }
                .menu-status-icon{
                    transition: all .2s;
                }
                .menu-body-f{
                    .menu-item-f.disabled{
                        .menu-item-f-tem{
                            color: #ddd;
                            cursor: not-allowed;
                        }
                        .menu-item-f-tem:hover, .menu-item-s-tem:hover{
                            color: #ddd;
                        }
                    }
                    .menu-item-f.active{
                        .menu-item-f-tem{
                            font-weight: bold;
                        }
                    }
                    .menu-item-f{
                        margin-bottom: 0.5rem;
                        .menu-item-f-tem:hover, .menu-item-s-tem:hover{
                            color: #5E8BC4;
                        }
                        
                        .menu-item-f-tem{
                            cursor: pointer;
                            padding: 0px 0px 0.3rem 0px;
                            .f-txt{
                                font-size: 0.8rem;
                            }
                        }

                        .menu-item-s-tem{
                            padding: 0.1rem 0px;
                        }
                        .menu-item-s.disabled{
                            .menu-item-s-tem{
                                color: #ddd;
                                cursor: not-allowed;
                            }
                            .menu-item-s-tem:hover{
                                color: #ddd;
                            }
                        }
                        .menu-item-s{
                            height: @submenuHeight;
                            line-height: @submenuHeight;
                        }
                        .menu-item-s.active{
                            .menu-item-s-tem{
                                font-weight: bold;
                            }
                        }
                        .menu-body-s{
                            cursor: pointer;
                            height: 0px;
                            transition: all .2s;
                            overflow: hidden;
                        }
                    }
                }
            }
            .sgf-right-title, .sgf-left-title{
                height: @pageTitleH;
                margin-bottom: 0.5rem;
            }
            .sgf-content-item.right{
                // width: calc(@boxWidth - @leftWidth - @pagePaddingB);
                width: calc(100% - @leftWidth);
                padding-left: 1rem;
                .sgf-content-item-right-body{
                    width: calc(100% - 1.5rem);
                }
                .sgf-right-title{
                    display: flex;
                    justify-content: flex-end;
                    align-items: flex-end;
                    .right-btn{
                        padding: 0px;
                        width: 6rem;
                        height: 1.8rem;
                        background: #E6912C;
                        text-align: center;
                        // line-height: 2.15rem;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        // color: #333;
                        color: #fff;
                        .txt{
                            font-size: 0.7rem;
                        }
                        .right-btn-icon{
                            font-size: 0.7rem;
                            font-weight: bold;
                        }
                    }
                }
                .sgf-right-content{
                    
                    .sgf-right-content-body{
                        // min-height: @pageContentMenuHeight;
                        // height: calc(2.8rem * 10);
                        height: @listH;
                        .list-box.ldp{
                            .sgf-list-body{
                                .sgf-list-content{
                                    .list-title{
                                        margin: 0px;
                                    }
                                }
                            }
                        }
                        .list-box{
                            cursor: pointer;
                            @funWidth: 4.8rem;
                            padding: 0.3rem;
                            background: #F2F2F2;
                            border: 1px solid #E0E0E0;
                            box-shadow: 0rem 0.1rem 0.2rem 0rem #AFAFAF;
                            margin-bottom: 0.2rem;
                            .sgf-list-body{
                                display: flex;
                                align-items: center;
                                .item-sgf-fun{
                                    width: @funWidth;
                                    text-align: right;
                                    white-space: nowrap;
                                }
                                .sgf-list-content{
                                    width: calc(100% - @funWidth);
                                    padding: 0px 0.3rem;
                                    .list-title{
                                        margin-bottom: 0.3rem;
                                        white-space: nowrap;
                                        display: flex;
                                        text-align: left;
                                        .title-dt{
                                            width: 4rem
                                        }
                                        .title-gn{
                                            margin-right: 0.5rem;
                                            width: calc(100% - 4rem);
                                            display: flex;
                                            .i-r-num{
                                                margin-left: 0.2rem;
                                            }
                                        }
                                        .title-re-icon{
                                            margin-right: 0.5rem;
                                            img{
                                                width: 0.8rem;
                                            }
                                        }
                                    }
                                    .sgf-right-item{
                                        
                                    }
                                    
                                }
                                .sgf-right-item{
                                    // width: calc(100% - @funWidth);
                                    .item-i.b{
                                        
                                    }
                                    .item-i.b, .item-i.d{
                                        width: 37.5%;
                                        .stone-label{
                                            width: 0.6rem;
                                            height: 0.6rem;
                                            bottom: -0.2rem;
                                        }
                                        .i-p.photo-box{
                                            width: 1.1rem;
                                            height: 1.1rem;
                                            .result-icon{
                                                position: absolute;
                                                bottom: -0.2rem;
                                                width: 0.5rem;
                                                img{
                                                    width: 100%;
                                                }
                                            }
                                            .result-icon.black{
                                                left: -0.2rem;
                                            }
                                            .result-icon.white{
                                                right: -0.2rem;
                                            }
                                        }
                                        .i-p{
                                            display: flex;
                                            align-items: center;
                                        }
                                        .bx.i-name{
                                            display: flex;
                                            align-items: center;
                                            height: 100%;
                                            .level{
                                                margin-left: 0.2rem;
                                            }
                                        } 
                                    }  
                                    .item-i.b{
                                        padding-left: 0px;
                                        .stone-label{
                                            right: -0.2rem;
                                        }
                                    }
                                    .item-i.d{
                                        padding-right: 0px;
                                        .bx.i-name{
                                            justify-content: flex-end;
                                        }
                                        .stone-label{
                                            left: -0.2rem;
                                        }
                                    }
                                    .item-i.c{
                                        width: 25%;
                                        padding: 0px;
                                        overflow: visible;
                                        display: flex;
                                        align-items: center;
                                        justify-content: center;
                                    }
                                }
                            }
                        }
                        .sgf-right-item.last{
                            margin: 0px;
                        }
                        .sgf-right-item{
                            @normalSize: 0.6rem;
                            @titleSize: 0.7rem;
                            // padding: 0.3rem;
                            padding: 0px;
                            display: flex;
                            // overflow: hidden;
                            
                            font-size: 0.6rem;
                            position: relative;
                            // height: 2.6rem;
                            box-sizing: border-box;
                            .item-i.report-label{
                                position: absolute;
                                top: 0.2rem;
                                left: 0.2rem;
                                width: 0.8rem;
                                height: 0.8rem;
                                // bottom: 0px;
                                margin: auto;
                                padding: 0px;
                                .report-icon{
                                    width: 100%;
                                }
                            }
                            // .item-i.a{
                            //     width: 26%;
                            // }
                            // .item-i.b, .item-i.d{
                            //     width: 17%;
                            // }
                            .item-i.c{}
                            .item-i.e{}
                            .item-i{
                                padding: 0px 0.3rem;
                                box-sizing: border-box;
                                float: left;
                                width: 25%;
                                overflow: hidden;
                                white-space: nowrap;
                                .photo-box{
                                    position: relative;
                                    width: 1.5rem;
                                    height: 1.5rem;
                                    // padding: 0.3rem;
                                    .photo-box-img{
                                        background: #c3c3c3;
                                        width: 100%;
                                        height: 100%;
                                        border-radius: @photoRadius;
                                        overflow: hidden;
                                    }
                                }
                                .user-photo{
                                    width: 100%;
                                    height: 100%;
                                }
                                .handle-icon.icon-txt{
                                    font-size: 1rem;
                                }
                                .handle-icon.icon-txt.active{
                                    background: #FFE400;
                                }
                                .handle-icon.sp{
                                    .handle-icon-img{
                                        width: 100%;
                                        height: 100%;
                                    }
                                }
                                .handle-icon{
                                    width: 1rem;
                                    height: 1rem;
                                    margin-right: 0.5rem;
                                    cursor: pointer;
                                }
                            }
                            .item-i.a{
                                .i-t{
                                    height: 50%;
                                    // display: flex;
                                    text-align: center;
                                    align-items: center;
                                    justify-content: center;
                                    font-size: @normalSize;
                                    width: 100%;
                                }
                            }
                            .item-i.b{
                                justify-content: flex-start;
                            }
                            .item-i.d{
                                justify-content: flex-end;
                            }
                            .item-i.b, .item-i.d{
                                display: flex;
                                width: 27.5%;
                                overflow: visible;
                                // justify-content: center;
                                .i-p{
                                    .bx{
                                        height: 50%;
                                        width: 4rem;
                                    }
                                    .i-name{
                                        align-items: flex-start;
                                    }
                                    .i-level{
                                        align-items: flex-end;
                                    }
                                }
                            }
                            .item-i.cb{
                                .i-p{
                                    .bx{
                                        text-align: left;
                                    }
                                }
                                
                                .stone-label{
                                    background: #000;
                                    right: -0.3rem;
                                }
                                .photo-box{
                                    margin-right: 0.5rem;
                                }
                            }
                            .item-i.cw{
                                .i-p{
                                    .bx{
                                        text-align: right;
                                    }
                                }
                                .stone-label{
                                    background: #fff;
                                    // border: 1px solid #000;
                                    left: -0.3rem;
                                }
                                .photo-box{
                                    margin-left: 0.5rem;
                                }
                            }
                            .item-i.e{
                                display: flex;
                                align-items: center;
                                justify-content: flex-end;
                            }
                            .item-i.c{
                                width: 20%;
                                .i-r:last-child{
                                    font-size: @normalSize;
                                }
                                .i-r-num{
                                    margin-right: 0.2rem;
                                }
                            }
                            .stone-label{
                                position: absolute;
                                width: 0.8rem;
                                height: 0.8rem;
                                border-radius: 50%;
                                bottom: -0.3rem;
                            }
                            .stone-label.b{
                                background: #000;
                                right: -0.3rem;
                            }
                            .stone-label.w{
                                background: #fff;
                                border: 1px solid #000;
                                left: -0.3rem;
                            }
                        }
                    }
                }
                .sgf-right-content-page{
                    display: flex;
                    justify-content: flex-end;
                    margin-top: @PaginationMarginT;
                    height: @PaginationH;
                    .page-item-a{
                        margin-right: 1rem;
                    }
                    .item{
                        margin-right: 1.5rem;
                        cursor: pointer;
                    }
                    .item.disabled{
                        cursor: not-allowed;
                        color: #ddd;
                    }
                    .item.disabled:hover{
                        color: #ddd;
                    }
                    .item:hover{
                        color: #5E8BC4;
                    }
                }
                .none-data{
                    text-align: center;
                    font-size: 1rem;
                    color: #ddd;
                }
            }
            .sgf-content-title{
                text-align: left;
                .txt{
                    font-size: 1rem;
                }
            }
        }
        .upload-sgf-body{
            padding: 2rem;
            .upload-sgf-content{
                .upload-info-box{
                    .item:last-child{
                        margin: 0px;
                    }
                    .item.dt{
                    }
                    .item{
                        margin-bottom: 1rem;
                        display: flex;
                        align-items: center;
                        .item-title{
                            font-size: 0.8rem;
                            width: 5rem;
                            text-align: left;
                        }
                        .item-input{
                            text-align: left;
                            width: 15rem;
                            .el-input__inner{
                                width: 100%;
                                height: 1.5rem;
                            }
                            
                        }
                        .item-icon{
                            margin-left: 1rem;
                            width: 1rem;
                            height: 1rem;
                            transition: all .2s;
                            cursor: pointer;
                        }
                        .item-icon:active{
                            transform: scale(.9)
                        }
                    }
                    .item.sp{
                        .item-input{
                            width: 10rem;
                            margin-right: 1rem;
                        }
                    }
                    .item.re{
                        .item-input{
                            display: flex;
                            align-items: center;
                            justify-content: flex-start;
                            width: 15rem;
                            .el-select{
                                width: 8rem;
                                
                            }
                            .re-num-box{
                                margin-left: 1rem;
                                width: 6rem;
                                display: flex;
                                align-items: center;
                                justify-content: flex-start;
                                .re-num{
                                    margin-right: 0.5rem;
                                }
                            }
                        }
                    }
                }
            }
            .upload-sgf-footer{
                display: flex;
                justify-content: flex-end;
                margin-top: 1rem;
                .sgf-footer-item.confirm{
                    background: #3FACF1;
                    color: #fff;
                    
                }
                .sgf-footer-item.cancel{
                    background: #C7C7C7;
                    margin-right: 1rem;
                }
                .sgf-footer-item{
                    padding: 0px;
                    width: 5.75rem;
                    height: 1.77rem;
                }
            }
        }
        .el-input__icon{
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .save-sgf-box{
            padding: 1rem 0px 1.3rem;
            .save-title{
                margin-bottom: 0.7rem;
                .txt{
                    font-size: 0.9rem;
                }
            }
            .save-sgf-table{
                width: 34rem;
                white-space: nowrap;
                td.td-txt{
                    text-align: right;
                }
                td.td-content{
                    width: 12rem;
                }
                td{
                    text-align: left;
                    padding: 0.3rem 0.2rem;
                    .el-date-editor.el-input, .el-date-editor.el-input__inner{
                        width: 100%;
                    }
                }
                .el-input__inner{
                    border: 1px solid #BABABA;
                    height: @sgfHandleInputH;
                }
                .el-select{
                    width: 100%;
                }
                .save-file-area{
                    display: flex;
                    align-items: center;
                    .item-icon{
                        cursor: pointer;
                        width: 1.2rem;
                        height: auto;
                        margin-left: 0.5rem;
                    }
                }
                .game-result{
                    display: flex;
                    .re-num-box{
                        margin-left: 0.5rem;
                        align-items: center;
                        display: flex;
                        .re-num{
                            height: 100%;
                            margin-right: 0.2rem;
                            .el-input__inner{
                                height: 100%;
                            }
                        }
                    }
                }
            }
        }
        div, span{
            font-size: 0.6rem;
        }
        .handle-icon{
            width: 0.7rem;
            height: 0.7rem;
            margin-right: 0.5rem;
            cursor: pointer;
        }
        .handle-icon.d{
            margin: 0px;
        }
        .page-pagination-box{
            margin-top: 1rem;
            display: flex;
            align-items: center;
            justify-content: center;
            // .el-pagination button, .el-pagination span:not([class*=suffix]){
            //     font-size: 0.7rem;
            //     min-width: 1.775rem;
            //     height:  1.4rem;
            //     line-height: 1.4rem;
            // }
            // .el-pagination__total{
            //     margin-right: 0.5rem;
            // }
            // .el-pagination.is-background .btn-next, .el-pagination.is-background .btn-prev, .el-pagination.is-background .el-pager li{
            //     margin: 0px 0.25rem;
            //     min-width: 1.5rem;
            // }
            // .el-pager{
            //     // display: flex;
            // }
            // .el-pagination.is-background .el-pager li:not(.disabled).active{
            //     background: none;
            // }
            // .el-pager li{
            //     padding: 0px 0.2rem;
            //     font-size: 0.6rem;
            //     min-width: 1.775rem;
            //     height:  1.4rem;
            //     line-height: 1.4rem;
            //     // display: flex;
            //     // align-items: center;
            //     // justify-content: center;
            // }
            .el-pagination.is-background .el-pager li:not(.disabled).active{
                background: none;
                color: #333;
            }
            .el-pager li, .el-pager li.btn-quicknext:hover, .el-pager li.btn-quickprev:hover{
                color: #333;
            }
            .page-pre, .page-next{
                cursor: pointer;
                .el-button{
                    padding: 0px;
                    color: #333;
                }
            }
            .el-pagination{
                color: inherit;
                .el-pager li.active{
                    border: 0px;
                    background: none;
                }
                .el-pager{
                    display: flex;
                    li.active{
                        border: 0px;
                    }
                    li:hover{
                        color: #333;
                        border-color: #333;
                    }
                    li{
                        padding: 0px;
                        font-size: 0.5rem;
                        min-width: 0px;
                        height: 0.8rem;
                        min-width: 0.8rem;
                        line-height: normal;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        background: none;
                        color: inherit;
                        border: 1px solid;
                        margin: 0px 0.3rem;
                    }
                }
            }
        }
        .delete-folder-icon{
            // margin-left: 1rem;
            position: absolute;
            right: 0.5rem;
            top: 0px;
            bottom: 0px;
            display: flex;
            align-items: center;
            height: 100%;
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
        .folder-icon{
            width: 0.8rem;
            margin-right: 0.2rem;
        }
        .last-folder{
            padding: ;
        }
    }
</style>