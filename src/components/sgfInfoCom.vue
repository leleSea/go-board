<!--  -->
<template>
<!-- page-panel-bcg -->
    <div class='sgf-info-com' :class="bcgClassCul">
        <div class="sgf-info-com-body">
            <!-- page-bcg  -->
            <div class="report-item-box sgf-extend">
                <div class="report-item-title" :class="titleClassCul" v-if="!noneGn">
                    <div class="live-label-area">
                        <slot name="liveLabel"></slot>
                    </div>
                    <div class="item-title-gn hide-point-txt" :class="{'edit': sgfInfoStatus.edit}">
                        <span class="txt" v-show="!sgfInfoStatus.edit">{{$t(gamenameCul)}}</span>
                        <span class="txt edit-txt" v-show="sgfInfoStatus.edit">
                            <input type="text" class="edit-input br input-select-area-bcg" v-model="sgfInfoCopy.gn.value" :placeholder="$t('对局名称')">
                        </span>
                    </div>
                    <div class="item-title-dt" :class="{'edit': sgfInfoStatus.edit}">
                        <span class="txt" v-show="!sgfInfoStatus.edit">{{$t(sgfDateCul)}}</span>
                        <span class="txt edit-txt" v-show="sgfInfoStatus.edit">
                            <el-date-picker
                            class="edit-date-select-def input-select-area-bcg"
                            :clearable="false"
                            @change="dtChange"
                            v-model="sgfInfoCopy.dt.value"
                            type="date"
                            :placeholder="$t('对局日期')">
                            </el-date-picker>
                        </span>
                    </div>
                    <slot name="pageClose"></slot>
                </div>
                <div class="report-item-box-body">
                    <div class="report-item-content">
                        <div class="item-content-i p pb">
                            <div class="p-photo">
                                <div class="p-photo-box photo-background">
                                    <sgfInfoComPhoto 
                                    ref="photoBlack" 
                                    :result.sync="resultOrgData"
                                    :gameMeta.sync="gameMeta" 
                                    :sgfUsernameDefine.sync="sgfUsernameDefineCul" 
                                    :optionsRoot.sync="optionsRootCul"
                                    :theme.sync="theme"
                                    color="black"></sgfInfoComPhoto>
                                    <!-- <img :src="GLOBAL.getPhotoForSgfMeta(gameMeta, gameMeta.pb, 'b', sgfUsernameDefineCul)" class="p-img"> -->
                                </div>
                                <div class="stone-label-sgf b" :class="stoneClassCul" v-if="!noneColor"></div>
                                <div class="stone-label-sgf none-color bc" v-if="noneColor" :class="stoneClassCul">
                                    <img :src="`${GLOBAL.assetsUrl}/img/f1.png`" class="none-color-img">
                                </div>
                                <div class="result-icon black">
                                    <!-- <slot name="black-result"></slot> -->
                                    <img :src="`${GLOBAL.assetsUrl}/img/${resultCul.win == 'b' ? 'r7' + theme : 'r8' + theme}.png`" alt="" v-if="resultCul && !resultCul.hide">
                                </div>
                            </div>
                            <div class="p-user-info">
                                <div class="user-name pbn" :class="{'flex-align-center none-level': !remove && !sgfInfoStatus.edit}">
                                    <span class="txt" v-show="!sgfInfoStatus.edit">
                                        <span class="a hide-point-txt txt name-text-box hide-point-txt">{{$t(culPb)}} {{$t(culBr)}}</span>
                                        <!-- <span class="b txt level-text-box hide-point-txt" v-show="culBr"></span> -->
                                    </span>
                                    <span class="txt edit-txt" v-show="sgfInfoStatus.edit">
                                        <input type="text" class="edit-input pb input-select-area-bcg" v-model="sgfInfoCopy.pb.value" :placeholder="$t(culPb)">
                                    </span>
                                </div>
                                <div class="user-level br" v-show="remove || sgfInfoStatus.edit">
                                    <!-- <span class="txt remove-txt" v-show="remove">{{ locale == 'en'?culRemoveB+$t('被提'): $t('提')+culRemoveB+$t('子')}}</span> -->
                                    <span class="txt remove-txt" v-show="remove">
                                        {{locale == 'en' ? `${$t('提')}:` : $t('提')}}
                                        {{culRemoveB}}
                                        {{locale != 'en' ? $t('子') : ''}}
                                    </span>
                                    
                                    <!-- <span class="txt edit-txt" v-show="sgfInfoStatus.edit">
                                        <el-select v-model="computerLevelSelect.valueB" placeholder="段位" class="edit-select input-select-area-bcg"
                                        :popper-append-to-body="false"
                                        :popper-class="'edit-select-pop komi input-select-area-bcg'">
                                            <el-option
                                            v-for="item in computerLevelSelect.data"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                            <span>{{item.label}}</span>
                                            </el-option>
                                        </el-select>
                                    </span> -->
                                </div>
                                <div class="user-country" v-if="countryShow">
                                    <slot name="country-black"></slot>
                                </div>
                            </div>
                        </div>
                        <div class="item-content-i r  flex-center" :class="{'delta-txt': deltaCountCul}">
                            <div class="r-i result flex-center">
                                <slot name="gameResult" v-if="defineGameResult"></slot>
                                <span class="txt result" v-show="!sgfInfoStatus.edit" v-if="!defineGameResult">
                                    <span class="txt" v-if="culResultNew == ''">{{$t(culResultNew)}}</span>
                                    <span v-else>
                                        <span class="txt">
                                            {{$t(culResultNew.label)}}
                                            <span class="txt" v-if="culResultNew.num && culResultNew.num > 0">
                                                {{culResultNew.num | decimalsToFractional}}{{ $t('子') }}
                                            </span>
                                        </span>
                                    </span>
                                </span>
                                <span class="txt result-edit edit-txt" v-show="sgfInfoStatus.edit">
                                    <el-select v-model="resultSelect.value" :placeholder="$t('结果')" class="edit-select input-select-area-bcg"
                                    :popper-append-to-body="false"
                                    :popper-class="'edit-select-pop result input-select-area-bcg'">
                                        <el-option
                                        v-for="item in resultSelect.data"
                                        :key="item.value"
                                        :label="$t(item.label)"
                                        :value="item.value">
                                        <span>{{$t(item.label)}}</span>
                                        </el-option>
                                    </el-select>
                                    <div class="result-win-num-box" v-show="GLOBAL.resultTxt[resultSelect.value] && GLOBAL.resultTxt[resultSelect.value].num">
                                        <input type="number" class="edit-input input-select-area-bcg" v-model="resultSelect.num">
                                        <span class="txt s-num">{{ $t('子') }}</span>
                                    </div>
                                </span>
                            </div>
                            <div class="r-i komi flex-center">
                                <!-- <span class="txt">{{culRemoveB}}</span>
                                <span class="txt remove-title">提子</span>
                                <span class="txt">{{culRemoveW}}</span> -->
                            </div>
                        </div>
                        <div class="item-content-i p pw">
                            <div class="p-user-info">
                                <div class="user-name pwn" :class="{'flex-align-center none-level': !remove && !sgfInfoStatus.edit}">
                                    <span class="txt" v-show="!sgfInfoStatus.edit">
                                        <span class="a hide-point-txt txt name-text-box hide-point-txt">{{$t(culPw)}} {{$t(culWr)}}</span>
                                        <!-- <span class="b txt level-text-box hide-point-txt" v-show="culWr">{{$t(culWr)}}</span> -->
                                    </span>
                                    <span class="txt edit-txt" v-show="sgfInfoStatus.edit">
                                        <input type="text" class="edit-input br input-select-area-bcg" v-model="sgfInfoCopy.pw.value" :placeholder="$t(culPw)">
                                    </span>
                                </div>
                                <div class="user-level wr" v-show="remove || sgfInfoStatus.edit">
                                    <!-- <span class="txt remove-txt" v-show="remove">{{ locale == 'en'?culRemoveW+$t('被提'): $t('提')+culRemoveW+$t('子')}}</span> -->
                                    <span class="txt remove-txt" v-show="remove">
                                        {{locale == 'en' ? `${$t('提')}:` : $t('提')}}
                                        {{culRemoveW}}
                                        {{locale != 'en' ? $t('子') : ''}}
                                    </span>

                                    <!-- <span class="txt edit-txt" v-show="sgfInfoStatus.edit">
                                        <el-select v-model="computerLevelSelect.valueW" placeholder="段位" class="edit-select input-select-area-bcg"
                                        :popper-append-to-body="false"
                                        :popper-class="'edit-select-pop komi input-select-area-bcg'">
                                            <el-option
                                            v-for="item in computerLevelSelect.data"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                            <span>{{item.label}}</span>
                                            </el-option>
                                        </el-select>
                                    </span> -->
                                </div>
                                <div class="user-country" v-if="countryShow">
                                    <slot name="country-white"></slot>
                                </div>
                            </div>
                            <div class="p-photo">
                                <div class="stone-label-sgf none-color wc" v-if="noneColor" :class="stoneClassCul">
                                    <img :src="`${GLOBAL.assetsUrl}/img/f1.png`" class="none-color-img">
                                </div>
                                <div class="stone-label-sgf w" :class="stoneClassCul" v-if="!noneColor"></div>
                                <div class="p-photo-box photo-background">
                                    <!-- <img :src="GLOBAL.getPhotoForSgfMeta(gameMeta, gameMeta.pw, 'w', sgfUsernameDefineCul)" class="p-img"> -->
                                    <sgfInfoComPhoto 
                                    ref="photoWhite" 
                                    :gameMeta.sync="gameMeta" 
                                    :sgfUsernameDefine.sync="sgfUsernameDefineCul" 
                                    :optionsRoot.sync="optionsRootCul"
                                    color="white"></sgfInfoComPhoto>
                                </div>
                                <div class="result-icon white">
                                    <!-- <slot name="white-result"></slot> -->
                                    <img :src="`${GLOBAL.assetsUrl}/img/${resultCul.win == 'w' ? 'r7' + theme : 'r8' + theme}.png`" alt="" v-if="resultCul && !resultCul.hide">
                                </div>
                            </div>
                        </div>
                        <!-- v-if="winrateShowCul" -->
                        <div class="info-winrate" v-if="!winrateHide">
                            <div class="winrate-arrow" v-show="winrateDeclineCul.active" :class="winrateDeclineCul.css" :style="winrateDeclineSizeCul">
                                <div class="winrate-arrow-box" :style="winrateDeclineRotateCul">
                                    <div class="winrate-arrow-head">
                                        <div class="arrow-head-icon"></div>
                                    </div>
                                    <div class="winrate-arrow-body"></div>
                                </div>
                                <!-- <div class="arrow-low-txt" :style="arrowLowTxtStyle">
                                    <span class="txt">{{winrateDeclineValueCul}}</span>
                                </div> -->
                            </div>
                            <div class="arrow-low-txt-new" v-show="winrateDeclineCul.active" :style="arrowLowTxtStyle" :class="winrateDeclineCul.css">
                                <span class="txt">{{winrateDeclineValueCul}}</span>
                            </div>
                            <div class="winrate-delta-box" v-if="deltaCountCul">
                                <span class="txt">{{deltaCountCul.txt}}</span>
                            </div>
                            <div class="winrate-item b" :style="culWinrate.b.style">
                                <span v-if="winrateShowCul" v-show="culWinrate.b.data > 15" class="txt">{{culWinrate.b.data}}%</span>
                            </div>
                            <div class="winrate-item w" :style="culWinrate.w.style">
                                <span v-if="winrateShowCul" v-show="culWinrate.w.data > 15" class="txt">{{culWinrate.w.data}}%</span>
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
            
        </div>
        <div class="sgf-info-muted" v-if="edit" v-show="!reviewBoard">
            <el-button class="theme-sgf-info-edit-btn-bcg" v-show="!sgfInfoStatus.edit" @click="openSgfInfoEdit">
                <span class="el-icon-edit muted-icon"></span>
                <span class="muted-txt">{{ $t('编辑') }}</span>
            </el-button>
            <div class="edit-save-btn" v-show="sgfInfoStatus.edit">
                <el-button class="theme-sgf-info-edit-btn-bcg" @click="saveSgfInfoEdit">
                    <span class="el-icon-document-checked muted-icon"></span>
                    <span class="muted-txt">{{ $t('保存') }}</span>
                </el-button>
                <el-button class="theme-sgf-info-edit-btn-bcg" @click="cancelSgfInfoEdit">
                    <span class="el-icon-document-delete muted-icon"></span>
                    <span class="muted-txt">{{ $t('取消') }}</span>
                </el-button>
            </div>
        </div>
        
    </div>
</template>

<script>
    import sgfInfoComPhoto from './sgfInfoComPhoto.vue'


    export default {
        name: 'sgfInfoCom',
        props: {
            theme: String,
            sgfInfo: Object,
            options: Object,
            remove: Object,
            edit: Boolean,
            reviewBoard: Boolean,
            winrateDecline: Object,
            bcgClass: String,
            gameMeta: Object,
            titleClass: String,
            defineGameResult: Boolean,
            noneColor: Boolean,
            winrateHide: Boolean,
            sgfUsernameDefine: String,
            countryShow: Boolean,
            noneGn: Boolean,
            optionsRoot: Object
        },
        data() {
            return {
                arrowLowTxtStyleData: null,
                oldOptions: null,
                pbName: null,
                pwName: null,
                computerLevelReal: this.GLOBAL.computerLevel,
                sgfInfoStatus: {
                    edit: false
                },
                sgfInfoCopy: {},
                komiSelect: {
                    data: [],
                    value: null
                },
                resultSelect: {
                    value: null,
                    data: [],
                    num: 0
                },
                computerLevelSelect: {
                    valueB: 0,
                    valueW: 0,
                    data: []
                },
                locale:this.$i18n.locale
            };
        },
        methods: {
            async pageInit(){
                let res = await this.enginePlanInit()
                this.computerLevelReal = this.GLOBAL.deepCopy(this.GLOBAL.computerLevel)
                this.komiSelect.data = this.GLOBAL.deepCopy(this.GLOBAL.komi)
                this.komiSelect.value = 7.5
                this.resultSelect.data = this.GLOBAL.deepCopy(this.GLOBAL.resultSelect)
                this.resultSelect.value = 'N+R'
                this.computerLevelInit()
            },
            async enginePlanInit(){
                if(this.GLOBAL.computerLevelHasInsert) return
                let res = await this.GLOBAL.enginePlan()
                if(res && res.code == 0) this.enginePlanList = res.data
                return res
            },
            pageSelectInit(){

            },
            openSgfInfoEdit(){
                this.sgfInfoCopy = this.GLOBAL.deepCopy(this.sgfInfo)
                this.openEditKmCheck()
                this.openEditReCheck()
                this.sgfInfoEditOn()
                this.sgfLevelInit()
            },
            openEditKmCheck(){
                let km = this.sgfInfoCopy.km.value
                let data = this.komiSelect.data
                if(isNaN(Number(km)) || km == null || km == undefined) return
                for(var i in data){
                    if(data[i].value == km){
                        this.komiSelect.value = km
                        // this.sgfInfoCopy.km.label = data[i].label
                        break
                    }
                }
            },
            openEditReCheck(){
                let re = this.sgfInfoCopy.re.value
                let data = this.resultSelect.data
                if(re == null || re == undefined) return
                let result = this.GLOBAL.parseResultSelect(re)
                this.resultSelect.value = result.value
                this.resultSelect.num = result.num || 0
                // for(var i in data){
                //     if(data[i].value == re || data[i].label == re){
                //         this.resultSelect.value = data[i].value
                //         break
                //     }
                // }
            },
            saveSgfInfoEdit(){
                let sgfInfo = this.sgfInfoCopy
                sgfInfo.km.value = this.komiSelect.value
                sgfInfo.re.value = this.resultSelect.value
                sgfInfo.br.value = this.computerLevelSelect.valueB
                sgfInfo.wr.value = this.computerLevelSelect.valueW
                if(this.GLOBAL.resultTxt[this.resultSelect.value] && this.GLOBAL.resultTxt[this.resultSelect.value].num){
                    if(!this.resultSelect.num){
                        this.GLOBAL.MessageOpen({
                            message: '请填写完整的对局结果'
                        })
                        return
                    }
                    sgfInfo.re.value = sgfInfo.re.value + this.resultSelect.num
                }
                this.$emit('takeFun', {
                    fun: 'saveSgfInfoEdit',
                    data: this.GLOBAL.deepCopy(sgfInfo)
                })
                this.sgfInfoEditOff()
            },
            cancelSgfInfoEdit(){
                this.sgfInfoEditOff()
            },
            sgfInfoEditOn(){
                this.sgfInfoStatus.edit = true
            },
            sgfInfoEditOff(){
                this.sgfInfoStatus.edit = false
            },
            computerLevelInit(){
                let level = this.GLOBAL.deepCopy(this.GLOBAL.computerLevel)
                let data = []
                for(var i in level){
                    if(!level[i].sgf) continue
                    data.push(level[i])
                }
                this.computerLevelSelect.data = data
                this.sgfInfoChange()
            },
            sgfInfoChange(newVal){
                this.sgfLevelInit()
            },
            sgfLevelInit(){
                if(this.computerLevelSelect.data.length <= 0) return
                let lb = this.sgfInfoCopy.br ? this.sgfInfoCopy.br.value : null
                let lw = this.sgfInfoCopy.wr ? this.sgfInfoCopy.wr.value : null
                let lbl = this.levelChangeHandle(lb)
                let lwl = this.levelChangeHandle(lw)
                this.computerLevelSelect.valueB = lbl.value
                this.computerLevelSelect.valueW = lwl.value
            },
            levelChangeHandle(level){
                // let computerLevel = this.computerLevelSelect.data
                let computerLevel = this.computerLevelReal
                let rLevel = computerLevel[computerLevel.length - 1]
                if(level == '' || level == undefined) return rLevel
                let key = isNaN(Number(level)) ? 'label' : 'value'
                for(var i in computerLevel){
                    if(computerLevel[i][key] == level){
                        rLevel = computerLevel[i]
                        break
                    }
                }
                return rLevel
            },
            dtChange(val){
                let data = this.GLOBAL.getTimeNow(val)
                this.sgfInfoCopy.dt.value = data
            },
            getplayerName(c){


                let levelData = this.GLOBAL.getLevel(3000)
                return levelData.AIname 
            },
        },
        
        created() {
            this.pageInit()
        },
        components: {
            sgfInfoComPhoto
        },
        computed: {
            resultCul(){
                let result = this.resultOrgData
                if(!result) return null
                result = this.GLOBAL.deepCopy(this.GLOBAL.parseResultSelect(result))
                let win = this.GLOBAL.resultWinLabel(this.sgfInfo.re.value)
                if(!win) result.hide = true
                else result.hide = false
                result.win = win
                return result
            },
            resultOrgData(){
                if(!this.sgfInfo || !this.sgfInfo.re || !this.sgfInfo.re.value) return null
                return this.sgfInfo.re.value
            },
            arrowLowTxtStyle(){
                let data = this.winrateDeclineSizeCul
                if(!data.value) return null
                let winrateEle = document.querySelector('.sgf-info-com .report-item-box.sgf-extend .report-item-content .info-winrate')
                let winrateWidth
                if(winrateEle) winrateWidth = winrateEle.offsetWidth
                let eleWidth = 2.02 * this.GLOBAL.htmlFontSize
                let txtWidth = (1.91 + 0.4) * this.GLOBAL.htmlFontSize
                let padSpaceB = document.querySelector('.sgf-info-com .report-item-box.sgf-extend .report-item-content .item-content-i.p.pb .user-level .txt')
                let padSpaceW = document.querySelector('.sgf-info-com .report-item-box.sgf-extend .report-item-content .item-content-i.p.pw .user-level .txt')
                let txtWidthB = txtWidth, txtWidthW = txtWidth
                if(padSpaceB){
                    txtWidthB = padSpaceB.offsetWidth + 5
                }
                if(padSpaceW){
                    txtWidthW = padSpaceW.offsetWidth + 5
                }
                let style = {}
                style.value = {}
                if(data.value.left !== null){
                    // style.left = `${data.value.left + data.value.width / 2 + 2.02 / 2}`
                    style.left = `calc(${data.value.left}% + ${data.value.width / 2}% - 2.02rem / 2)`
                    style.right = `auto`
                    style.value.right = null
                    style.value.left = true
                }else{
                    style.right = `calc(${data.value.right}% + ${data.value.width / 2}% - 2.02rem / 2)`
                    style.left = `auto`
                    style.value.left = null
                    style.value.right = true
                }
                if(winrateEle){
                    let left, width
                    if(data.value.left !== null){
                        width = (100 - (data.value.left + data.value.width / 2))
                        width = width / 100 * winrateWidth - eleWidth
                        left = data.value.left + data.value.width / 2
                        left = left - (eleWidth / 2 / winrateWidth * 100) 
                        left = left / 100 * winrateWidth
                        // left = left + eleWidth
                        // left = left / 100 * winrateWidth - eleWidth / 2
                    }else{
                        width = (100 - data.value.right)
                        width = width / 100 * winrateWidth - eleWidth
                        left = data.value.right + data.value.width / 2
                        left = left - (eleWidth / 2 / winrateWidth * 100) 
                        left = left / 100 * winrateWidth
                        // left = left / 100 * winrateWidth - eleWidth / 2
                        left = winrateWidth - left
                        // left = winrateWidth - left - eleWidth
                    }
                    if(data.value.right  !== null){
                        if(left < winrateWidth * 0.5){
                            left = left - eleWidth
                        }
                    }else{
                        if(left > winrateWidth * 0.5){
                            left = left + eleWidth
                        }
                    }
                    if(left < txtWidth){
                        style.left = `${txtWidthB}px`
                        style.right = `auto`
                    }else if((winrateWidth - left) < txtWidth){
                        style.right = `${txtWidthW}px`
                        style.left = `auto`
                    }

                }
                return style
            },
            optionsRootCul(){
                let options = this.options || {}
                if(!options.winrate) return null
                return {
                    blackWinrate: options.winrate.b,
                    whiteWinrate: options.winrate.w,
                }
            },
            sgfUsernameDefineCul(){
                if(this.sgfUsernameDefine) return this.sgfUsernameDefine
                let sgfInfo = this.sgfInfo || {}
                return sgfInfo.sgfUsernameDefine
            },
            winrateShowCul(){
                return this.options && this.options.winrate && !this.options.hide
            },
            sgfDateCul(){
                if(this.sgfInfo.dt && this.sgfInfo.dt.value){
                    // let date = this.GLOBAL.getTimeNow(new Date(this.sgfInfo.dt.value))
                    // let date = new Date(this.sgfInfo.dt.value)
                    let date = this.GLOBAL.getDateWithoutTime(this.sgfInfo.dt.value)
                    if(date) return `${date.year}-${date.month}-${date.day}`
                    return this.sgfInfo.dt.value
                } 
                return ''
            },
            gamenameCul(){
                if(this.sgfInfo.gn || this.sgfInfo.gn.value) return this.sgfInfo.gn.value
                return ''
            },
            isAIgame(){
                // let AItype = {
                //     '0': true,
                //     '00': true,
                //     '01': true,
                //     '02': true,
                //     '03': true,
                // }
                let gameMeta = this.gameMeta || {}
                if(!gameMeta.gameType === undefined) return false
                // if(!AItype[gameMeta.gameType]) return false
                // return true
                return this.GLOBAL.isAIgameForSgf(gameMeta.gameType)
            },
            bcgClassCul(){
                let css = this.bcgClass ? this.bcgClass : 'page-panel-bcg'
                // css = css + (this.winrateShowCul ? ' winrate' : '')
                css = css + (!this.winrateHide ? ' winrate' : '')
                if(this.countryShow) css += ' country' 
                return css
            },
            titleClassCul(){
                return this.titleClass ? this.titleClass : 'info-title-bcg'
            },
            stoneClassCul(){
                return this.bcgClass ? `${this.bcgClass}-border` : 'page-panel-bcg-border'
            },
            
            deltaCountCul(){
                if(!this.options || 
                !this.options.winrate || 
                !this.options.winrate.deltaCount || 
                !this.GLOBAL.isObject(this.options.winrate.deltaCount)) return false
                return this.options.winrate.deltaCount

            },
            winrateDeclineCul(){
                if(!this.winrateDecline) return {}
                return this.winrateDecline
            },
            winrateDeclineRotateCul(){
                let data = this.winrateDecline || {}
                if(data.color == 'black') return {transform: ''}
                else return {transform: 'rotateY(180deg)'}
            },
            winrateDeclineSizeCul(){
                let data = this.winrateDecline || {}
                let rd = (data.value * 100).toFixed(1)
                let style = {
                    width: `${rd}%`,
                }
                style.value = {
                    width: rd
                }
                if(data.color == 'black'){
                    style['left'] = 'auto'
                    style['right'] = `${100 - data.oldVal * 100}%`
                    style.value.left = null
                    style.value.right = 100 - data.oldVal * 100
                }else{
                    // style['transform'] = 'rotateY(180deg)'
                    style['left'] = `${100 - (Number(data.oldVal)) * 100}%`
                    style['right'] = 'auto'
                    style.value.right = null
                    style.value.left = 100 - (Number(data.oldVal)) * 100
                }
                return style
            },
            winrateDeclineValueCul(){
                let data = this.winrateDecline || {}
                let rd = (data.value * 100).toFixed(1)
                return `${rd}%`
            },
            culGn(){
                if(!this.sgfInfo.gn.value) return '棋谱名'
                return this.sgfInfo.gn.value
            },
            culKomi(){
                let data = null
                if(this.sgfInfo.ha.value && this.sgfInfo.ha.value > 0){
                    if(!isNaN(Number(this.sgfInfo.ha.value))) data = `${this.sgfInfo.ha.value / 2}子`
                }
                if(!data){
                    let komi = this.GLOBAL.komi
                    for(var i in komi){
                        if(komi[i].value == this.sgfInfo.km.value){
                            data = komi[i].label
                            break
                        }
                    }
                    if(!data) data = this.sgfInfo.km.value
                }
                return data
            },
            culResult(){
                let result = this.sgfInfo.re.value
                if(!result) return ''
                result = this.GLOBAL.parseResultSelect(result)
                let txt = result.label
                if(result.num) txt = txt + result.num + '子'
                return txt
            },
            culResultNew(){
                if(this.culResult == '') return this.culResult
                let result = this.sgfInfo.re.value
                result = this.GLOBAL.parseResultSelect(result)
                return result
            },
            culPb(){
                // if(!this.sgfInfo.pb.value){
                //      return '黑方'
                // }
                // if(!this.isAIgame){
                //     return this.sgfInfo.pb.value
                // }
                // if(this.gameMeta.pb != '星阵'){
                //     return this.sgfInfo.pb.value
                // }
                // let levelData = this.GLOBAL.getLevel(this.gameMeta.blackLevel)
                // return levelData.AIname || levelData.saveName || levelData.label

                let meta = this.gameMeta || {}
                if(meta && Object.keys(meta).length)
                    return this.GLOBAL.getAIname(this.gameMeta, this.gameMeta.pb, 'b')
                if(!this.sgfInfo.pb.value) return '黑方'
                return this.sgfInfo.pb.value
            },
            culPw(){
                // return this.GLOBAL.getAIname(this.gameMeta, this.gameMeta.pw, 'w')
                // if(!this.sgfInfo.pw.value) return '白方'
                // if(!this.isAIgame) return this.sgfInfo.pw.value
                // if(this.sgfInfo.pw.value != '星阵') return this.sgfInfo.pw.value
                // let levelData = this.GLOBAL.getLevel(this.gameMeta.whiteLevel)
                // return levelData.AIname || levelData.saveName || levelData.label


                let meta = this.gameMeta || {}
                if(meta && Object.keys(meta).length)
                    return this.GLOBAL.getAIname(this.gameMeta, this.gameMeta.pw, 'w')
                if(!this.sgfInfo.pw.value) return '白方'
                return this.sgfInfo.pw.value
            },
            culBr(){
                // let data = this.computerLevelSelect.data
                // let value = this.computerLevelSelect.valueB
                // let level = '无等级'
                // for(var i in data){
                //     if(data[i].value == value){
                //         level = data[i].label
                //         break
                //     }
                // }
                let level = this.sgfInfo.br.value
                let br = this.levelChangeHandle(level)
                // if(br.value == 0) return '段位'
                if(!br.label || br.label == '' || br.label == ' ') return null
                return br.label
            },
            culWr(){
                let level = this.sgfInfo.wr.value
                let wr = this.levelChangeHandle(level)
                // if(wr.value == 0) return '段位'
                if(!wr.label || wr.label == '' || wr.label == ' ') return null
                return wr.label
            },
            culRemoveB(){
                if(!this.remove || !this.remove.w) return 0
                return this.remove.w
                // if(!this.sgfInfo.remove || this.sgfInfo.remove.w) return 0
                // return this.sgfInfo.remove.w
            },
            culRemoveW(){
                if(!this.remove || !this.remove.b) return 0
                return this.remove.b
                // if(!this.sgfInfo.remove || this.sgfInfo.remove.b) return 0
                // return this.sgfInfo.remove.b
            },
            culWinrate(){
                if(!this.options || !this.options.winrate){
                    // return {
                    //     b: {
                    //         style: {width: '50%'},
                    //         data: 50
                    //     },
                    //     w: {
                    //         style: {width: '50%'},
                    //         data: 50
                    //     },
                    // }
                    return this.culWinrateOld
                }
                let b = (this.options.winrate.b * 100).toFixed(1)
                let w = (100 - b).toFixed(1)
                let data = {
                    b: {
                        style: {width: `${b}%`},
                        data: b
                    },
                    w: {
                        style: {width: `${w}%`},
                        data: w
                    }
                }
                return data
            },
            culWinrateOld(){
                if(!this.oldOptions || !this.oldOptions.winrate){
                    return {
                        b: {
                            style: {width: '50%'},
                            data: 50
                        },
                        w: {
                            style: {width: '50%'},
                            data: 50
                        },
                    }
                }
                let b = (this.oldOptions.winrate.b * 100).toFixed(1)
                let w = (100 - b).toFixed(1)
                let data = {
                    b: {
                        style: {width: `${b}%`},
                        data: b
                    },
                    w: {
                        style: {width: `${w}%`},
                        data: w
                    }
                }
                return data
            },
            winrateW(){
                if(!this.options || !this.options.winrate) return {width: '50%'}
                let data = {width: `${(this.options.winrate.w * 100).toFixed(1)}%`}
                return data
            },
            editPb(){
            }
        },
        watch: {
            options: {
                handler(newVal, oldVal){
                    if(!oldVal) return
                    this.oldOptions = oldVal
                },
                deep: true,
                immediate: true
            },
            sgfInfo: {
                handler(newVal){
                    this.sgfInfoCopy = newVal
                    this.sgfInfoChange()
                },
                immediate: true,
                deep: true
            },
            reviewBoard: {
                handler(val){
                },
                immediate: true
            },
            sgfInfoStatus: {
                handler(newVal){
                },
                immediate: true,
                deep: true
            },
            languageLang: {
                handler(){
                    this.locale = this.$i18n.locale
                },
                immediate: true,
                deep: true
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
    .sgf-info-com.winrate{
        .report-item-content{
            .p-user-info, .item-content-i.r{
                padding-bottom: 1rem !important;
                align-items: flex-start;
            }
            // .item-content-i.r{
            //     padding-bottom: 1rem !important;
            // }
        }
    }
    .sgf-info-com.country{
        .user-name.none-level{
            height: 50% !important;
        }
    }
    .sgf-info-com{
        @sgf-info-muted-height: calc(@sgf-info-muted-padding * 2 + @sgf-info-muted-button-height);
        @sgf-info-muted-button-height: 1.5rem;
        @sgf-info-muted-padding: 0.5rem;
        @stoneTxtMargin: 0.7rem;
        @stoneiconWz: 1.5rem;
        @stoneTxtMarginBtm: 0.7rem;
        @item1_1-5: 5.5rem;
        @item1_2-4: 4rem;
        @item1_3: 4.9rem;
        @boxW: 20%;
        @panelPadding: 0.7rem;
        @userPhotoSize: 3.2rem;


        .sgf-info-com-body{
            width: 100%;
            // height: 7rem;
            height: 6.12rem;
            // padding: 0.7rem;
            display: flex;
            position: relative;
            // align-items: center;
        }
        .sgf-info-body{
            width: 100%;
            .sgf-info-item.edit-in{
                display: flex;
                width: 100%;
                .stone-icon{
                    width: @stoneiconWz;
                    margin-right: @stoneTxtMargin;
                }
                .spec-body{
                    width: calc((@item1_1-5 + @item1_2-4) - @stoneiconWz - @stoneTxtMargin);
                }
            }
            .sgf-info-item.basic{
                display: flex;
                width: 100%;
                .basic-item.stone-info.b{
                    justify-content: flex-start;
                    .stone-icon{
                        margin-right: @stoneTxtMargin;
                    }
                }
                .basic-item.stone-info.w{
                    justify-content: flex-end;
                    .stone-icon{
                        margin-left: @stoneTxtMargin;
                    }
                }
                .basic-item.stone-info{
                    display: flex;
                    .pb-name{
                        font-size: 0.9rem;
                    }
                    .basic-item-i{
                        width: 3.3rem;
                    }
                }
                .basic-item:nth-child(1), .basic-item:nth-child(5){
                    width: @item1_1-5
                }
                .basic-item:nth-child(2), .basic-item:nth-child(4){
                    width: @item1_2-4
                }
                .basic-item:nth-child(3){
                    width: @item1_3
                }
                .basic-item{
                    width: @boxW;
                    .stone-icon{
                        width: @stoneiconWz;
                    }
                    .basic-item-i{
                        .pb-name.b{
                            text-align: left;
                        }
                        .pb-name.w{
                            text-align: right;
                        }
                        .pb-name{
                            // max-width: calc(@item1_1-5 - @stoneiconWz - @stoneTxtMargin);
                            margin-bottom: @stoneTxtMarginBtm;
                            white-space: nowrap;
                        }
                        .pb-level.w{
                            .el-input__inner{
                                text-align: right;
                            }
                        }
                        .pb-name.w{
                            .edit-input{
                                text-align: right;
                            }
                        }
                        .pb-level.b{
                            .el-input__inner{
                                text-align: left;
                            }
                        }
                        .pb-level{
                            white-space: nowrap;
                            margin-bottom: 0.7rem;
                            .game-result-box-edit.active{
                                @result-box-select-margin-right: 0.3rem;
                                position: relative;
                                display: flex;
                                width: calc(@item1_3 * 2);
                                margin-left: calc((-@item1_3 - @result-box-select-margin-right) / 2);
                                .edit-select{
                                    // width: @item1_3;
                                    margin-right: @result-box-select-margin-right
                                }
                                .edit-input{
                                    width: 3.9rem;
                                }
                            }
                            .game-result-box-edit{
                               
                            }
                        }
                    }
                }
            }
            .sgf-info-item.winrate{
                margin-top: 1rem;
                
                
            }
        }
        .info-winrate{
            margin-top: 0.5rem;
            width: 100%;
            display: flex;
            height: 0.8rem;
            position: relative;
            .winrate-item.b{
                background: #000;
                .txt{
                    color: #fff;
                }
            }
            .winrate-item.w{
                background: #fff;
                .txt{
                    color: #000;
                }
            }
            .winrate-item{
                transition: width .5s;
                display: flex;
                align-items: center;
                justify-content: center;
                height: 100%;
            }
        }
        .edit-input{
            width: 100%;
            height: 100%;
            background: #515358;
            color: inherit;
            outline: none;
            border: 0px;
            float: left;
        }
        .edit-input::placeholder{
            color: #ddd;
        }
        .edit-select{
            .el-input__suffix{
                display: none;
            }
            .el-input--suffix{
                .el-input__inner{
                    padding: 0px;
                    height: 100%;
                    background: inherit;
                    color: inherit;
                    outline: none;
                    border: 0px;
                    text-align: center;
                }
            }
            .edit-select-pop{
                background: inherit;
                border: 0px;
                .popper__arrow{
                    display: none;
                }
                .el-select-dropdown__item{
                    color: inherit;
                }
                .el-select-dropdown__item.hover, .el-select-dropdown__item:hover{
                    background: inherit;
                }
                .el-select-dropdown__item.selected{
                    color: #3193F7;
                }
            }
        }
        .game-name{
            margin-bottom: 0.7rem; 
            overflow: hidden;
        }
        .edit-date-select-def.el-date-editor.el-input, .edit-date-select-def.el-date-editor.el-input__inner{
            width: 100%;
            height: 100%;
        }
        .edit-date-select-def{
            width: 100%;
            height: 100%;
            .el-input__inner{
                width: 100%;
                padding: 0px;
                height: 100%;
                background: inherit;
                color: inherit;
                outline: none;
                border: 0px;
                text-align: left;

            }
            .el-input__prefix{
                display: none;
            }
        }
        .sgf-info-muted{
            padding: @sgf-info-muted-padding;
            text-align: right;
            // background: #606266;
            .el-button{
                padding: 0px;
                width: 4.5rem;
                height: @sgf-info-muted-button-height;
                // background: #474747;
                color: inherit;
                border: 0px;
                .muted-icon{
                    font-size: 1rem;
                }
                .muted-txt{
                    margin-left: 0.3rem;
                }
            }
        }
        @arrow-head-size: .4rem;
        @arrow-head-size-width: 0.554rem;
        @arrow-icon-color-003: #A4B436;
        @arrow-icon-color-005: #F4C031;
        @arrow-icon-color-015: #FF8309;
        @arrow-icon-color-030: #FF2424;
        .winrate-arrow.win003, .arrow-low-txt-new.win003{
            color: @arrow-icon-color-003;
            .winrate-arrow-head{
                .arrow-head-icon{
                    background: url('@{assetsUrl}arrow_0.03.png') no-repeat;
                    background-size: auto 100%;
                }
            }
            .winrate-arrow-body{
                background: @arrow-icon-color-003;
            }
        }
        .winrate-arrow.win005, .arrow-low-txt-new.win005{
            color: @arrow-icon-color-005;
            .winrate-arrow-head{
                .arrow-head-icon{
                    background: url('@{assetsUrl}arrow_0.05.png') no-repeat;
                    background-size: auto 100%;
                }
            }
            .winrate-arrow-body{
                background: @arrow-icon-color-005;
            }
        }
        .winrate-arrow.win015, .arrow-low-txt-new.win015{
            color: @arrow-icon-color-015;
            .winrate-arrow-head{
                .arrow-head-icon{
                    background: url('@{assetsUrl}arrow_0.15.png') no-repeat;
                    background-size: auto 100%;
                }
            }
            .winrate-arrow-body{
                background: @arrow-icon-color-015;
            }
        }
        .winrate-arrow.win030, .arrow-low-txt-new.win030{
            color: @arrow-icon-color-030;
            .winrate-arrow-head{
                .arrow-head-icon{
                    background: url('@{assetsUrl}arrow_0.30.png') no-repeat;
                    background-size: auto 100%;
                }
            }
            .winrate-arrow-body{
                background: @arrow-icon-color-030;
            }
        }
        .winrate-delta-box{
            position: absolute;
            top: -1.1rem;
            width: 100%;
            text-align: center;
            left: 0px;
        }
        .winrate-arrow{
            text-align: center;
            height: @arrow-head-size;
            width: 3%;
            position: absolute;
            top: calc(-@arrow-head-size);
            left: 0px;
            .winrate-arrow-box{
                position: absolute;
                top: 0px;
                left: 0px;
                width: 100%;
                height: 100%;
            }
            .arrow-low-txt{
                // width: 1.034rem;
                width: 100%;
                text-align: center;
                position: absolute;
                top: calc(-@arrow-head-size - 0.4rem);
                // width: 2.02rem;
                .txt{
                    // display: inline-block;
                    // width: 100%;
                }
            }
            .winrate-arrow-head{
                position: absolute;
                left: 0px;
                top: 0px;
                overflow: hidden;
                .arrow-head-icon{
                    height: @arrow-head-size;
                    width: @arrow-head-size-width;
                    float: left;
                }
            }
            .winrate-arrow-body{
                height: 50%;
                width: calc(100% - @arrow-head-size-width + 0.1rem);
                position: absolute;
                right: 0px;
                bottom: 0px;
            }
        }
        .arrow-low-txt-new{
            position: absolute;
            top: calc(-@arrow-head-size - 0.4rem * 2);
        }
        .report-item-box.sgf-extend{
            width: 100%;
            // box-shadow: 0rem 0.1rem 0.2rem 0rem #131313;
            // padding: 0.3rem 0.5rem;
            // margin-bottom: 0.5rem;
            // cursor: pointer;
            .report-item-box-body{
                // padding: 0.3rem 0.7rem 0.7rem;
                padding: 0.8rem;
            }
            .edit-input, .el-input__inner{
                padding: 0px 0.2rem;
            }
            .edit-txt{
                display: flex;
            }
            .el-input--suffix{
                .el-input__inner{
                    text-align: left;
                }
            }
            .report-item-title{
                height: 1.31rem;
                display: flex;
                // margin-bottom: 0.2rem;
                padding: 0.2rem @panelPadding;
                position: relative;
                .item-title-dt{
                    white-space: nowrap;
                    text-align: right;
                }
                .item-title-gn{
                    width: 100%;
                    // padding-left: 0.5rem;
                    text-align: left;
                    
                }
                .item-title-dt.edit{
                    width: 30%;
                    .el-input__inner{
                        text-align: right;
                    }
                }
                .item-title-gn.edit{
                    width: 70%;
                    padding-right: 0.8rem;
                }
                .txt{
                    // font-size: 0.65rem;
                    font-size: 0.6rem;
                }
                .item-title-type{
                    .report-icon{
                        width: 0.9rem;
                        float: left;
                    }
                }
            }
            .report-item-content{
                display: flex;
                position: relative;
                .item-content-i.p{
                    // height: 2.95rem;
                    height: @userPhotoSize;
                    width: 30%;
                    display: flex;
                    .p-photo-box{
                        width: @userPhotoSize;
                        height: @userPhotoSize;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        overflow: hidden;
                        border-radius: @photoRadius;
                    }
                    .p-photo{
                        height: 100%;
                        position: relative;
                        img{
                            // height: 100%;
                            width: 100%;
                            float: left;
                            border-radius: @photoRadius;
                        }
                        .none-color{
                            img{
                                width: 100%;
                                height: 100%;
                            }
                        }
                    }
                    .p-user-info{
                        width: calc(100% - 2.2rem - 0.5rem);
                        .user-name, .user-level{
                            height: 50%;
                            display: flex;
                            justify-content: center;
                        }
                        .user-name{
                            @levelMaxWidth: 1.82rem;
                            @levelMinWidth: 1.82rem;
                            align-items: center;
                            > .txt{
                                width: 100%;
                                display: flex;
                                .txt{
                                    font-size: 0.6rem;
                                }
                                .a{
// max-width: calc(100% - 1.55rem - 0.2rem);
                                    // max-width: 100%;
                                }
                                .b{
                                    // max-width: @levelMaxWidth;
                                    margin-left: 0.2rem;
                                    white-space: nowrap;
                                }
                                .name-text-box{
                                    width: auto;
                                }
                                .level-text-box{
                                    width: auto;

                                }
                            }
                        }
                        .user-name.none-level{
                            height: 100%;
                        }
                        .user-level{
                            align-items: center;
                            white-space: nowrap;
                        }
                        .user-country{
                            height: 50%;
                            // padding-top: 0.35rem;
                            display: flex;
                            // .country-txt{
                            //     color: #B1CDF4;
                            // }
                            .country-icon{
                                height: 100%;
                                width: auto;
                                display: inline-block;
                                
                            }
                        }
                    }
                }
                .item-content-i.p.pb{
                    justify-content: flex-start;
                    .p-photo{
                        margin-right: 0.5rem;
                    }
                    .user-name, .user-level{
                        justify-content: flex-start;
                        .txt{
                            justify-content: flex-start;
                            .a{
                                text-align: left;
                            }
                        }
                    }
                    .user-country{
                        text-align: left;
                        justify-content: flex-start;
                        .country-icon{
                            float: right;
                        }
                    }
                }
                .item-content-i.p.pw{
                    justify-content: flex-end;
                    .p-photo{
                        margin-left: 0.5rem;
                    }
                    .user-name, .user-level{
                        justify-content: flex-end;
                        .txt{
                            justify-content: flex-end;
                            .a{
                                text-align: right;
                            }
                        }
                    }
                    input, select{
                        text-align: right;
                    }
                    .user-country{
                        text-align: right;
                        justify-content: flex-end;
                        .country-icon{
                            float: right;
                        }
                    }
                }
                .item-content-i.r.delta-txt{
                    align-items: flex-start;
                }
                .item-content-i.r{
                    width: 40%;
                    padding: 0px 0.8rem;
                    select, input{
                        text-align: center;
                    }
                    .r-i.result{
                        // height: 50%;
                        .txt.pos{
                            margin-right: 0.2rem;
                        } 
                        .txt.result-edit{
                            display: flex;
                            .result-win-num-box{
                                display: flex;
                                margin-left: 0.2rem;
                                .s-num{
                                    margin-left: 0.2rem;
                                }
                            }
                        }
                    }
                    .r-i.komi{
                        height: 50%;
                        .txt{
                            display: inline-block;
                            .edit-select{
                                width: 100%;
                            }
                        }
                        .remove-title{
                            margin: 0px 0.5rem;
                        }
                    }  
                }
                .txt{
                    font-size: 0.7rem;
                }
                .remove-txt{
                    font-size: 0.6rem;
                }
                .info-winrate{
                    position: absolute;
                    bottom: 0px;
                    left: 0px;
                    // padding: 0px 3.45rem;
                    width: calc(100% - 3.45rem * 2 - 0.4rem);
                    right: 0px;
                    margin: auto;
                }
            }
        }
        .result-icon{
            position: absolute;
            bottom: -0.2rem;
            width: 1.2rem;
            img{
                width: 100%;
                height: 100%;
            }
        }
        .result-icon.black{
            left: -0.3rem;
        }
        .result-icon.white{
            right: -0.3rem;
        }
        .live-label-area{
            // position: absolute;
            top: 0px;
            left: 0px;
            white-space: nowrap;
            margin-right: 0.5rem;
            .live-lebel-box{
                @h: 1rem;
                padding: 0px 0.6rem;
                height: @h;
                display: flex;
                align-items: center;
                border-radius: @h;
            }
            .live-lebel-box.ing{
                background: #359E21;
                color: #fff;
            }
            .live-lebel-box.for{
                background: #DB9A1C;
            }
            .live-lebel-box.his{
                background: #767676;
            }
        }
    }
</style>