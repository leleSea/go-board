<!--  -->
<template>
    <div  class='options-com page-panel-bcg options-com-split-opt' :class="{'m': !reviewBoard, 'b': reviewBoard}">
        <div class="optiins-table">
            <ul class="table-head">
                <li class="head-item t1">
                  <span class="txt" v-if="!simulatShow">{{ $t('推荐选点') }}</span>
                  <span class="txt" v-if="simulatShow">
                      <span class="txt">{{ `${$t('计算量Ana')}：` }}</span>
                      <span class="txt">{{simulatShow | tofixed0 | sicNumber}}</span>
                  </span>
                </li>
                <li class="head-item t2">
                    <span class="txt">{{ $t('推荐度') }}</span>
                </li>
                <li class="head-item t3">
                    <span class="txt" v-if="optionsStyle.value == 0">{{$t(culColor)}}{{ $t('领先(目)') }}</span>
                    <span class="txt" v-if="optionsStyle.value != 0">{{ $t('领先(目)') }}</span>
                </li>
                <li class="head-item t4">
                    <span class="txt" v-if="optionsStyle.value == 0">{{$t(culColor)}}{{ $t('胜率(%)') }}</span>
                    <span class="txt" v-if="optionsStyle.value != 0">{{ $t('胜率(%)') }}</span>
                </li>
            </ul>
            <div class="table-content">
                <ul class="table-content-tr" 
                @mouseenter="branchHover(v)" @mouseleave="branchBlur(v)"
                @click="branchCon(v)"
                :class="{'select': select && select.coord == v.coord}"
                :style="select && select.coord == v.coord && options.actualCoord == v.coord? `background: ${options.userScore.color}` : ''"
                v-for="(v, i) in options.options" :key="i">
                    <li class="table-content-td t1">
                        <!-- <img class="stone" :src="`${GLOBAL.assetsUrl}/img/st${options.color == 1 ? 'b' : 'w'}1.png`"> -->
                        <div class="stone stone-label-ldp" :class="{'white': options.color == -1, 'black': options.color == 1}"></div>
                        <span class="coor">{{v.coord | coordFilter}}</span>
                        <!-- <span class="own-score" v-if="v.actual" :style="`background: ${options.userScore.color};`">
                            <span class="score-i"></span>
                            <span class="score-i sc">{{options.userScore.score}}</span>
                        </span> -->
                    </li>
                    <li class="table-content-td t2">
                        <div class="prop">
                            <div class="table-item-prop-range theme-border-options" v-if="optionsStyle.value == 0">
                                <div class="prop-range-body" :style="propStyle(v)" ></div>
                            </div>
                            <div class="txt">{{v.proportion | winrate2}}%</div>
                        </div>
                    </li>
                    <li class="table-content-td t3">
                        <!-- {{v.delta | tofixed1}} -->
                        <span class="txt" v-if="optionsStyle.value == 0">{{v.delta | tofixed1}}</span>
                        <div class="delta-box options-delta-box" v-if="optionsStyle.value != 0" :class="optionsStyle.data[optionsStyle.value].name">
                            <span class="txt val" :style="optionsStyle.value == 1 ? GLOBAL.deltaWidth(v.delta) : ''" :class="GLOBAL.deltaClass(v.delta, options.color)">
                                {{v.delta | abs | tofixed1}}
                            </span>
                        </div>
                    </li>
                    <li class="table-content-td t4">
                        <!-- {{v.winrate | winrate}} -->
                        <span class="txt" v-if="optionsStyle.value == 0">{{v.winrate | winrate}}</span>
                        <div class="winrate-options" v-if="optionsStyle.value != 0">
                            <div class="box" v-if="optionsStyle.value == 1">
                                <div class="new-win-it">
                                    <span class="txt">{{options.color == 1 ? v.winrate : (1 - v.winrate) | winrate}}</span>
                                </div>
                                <div class="new-win-it r">
                                    <div class="r-b" :style="{width: `${(options.color == 1 ? v.winrate : (1 - v.winrate)) * 100}%`}"></div>
                                    <div class="r-w" :style="{width: `${(options.color == -1 ? v.winrate : (1 - v.winrate)) * 100}%`}"></div>
                                </div>
                                <div class="new-win-it">
                                    <span class="txt">{{options.color == -1 ? v.winrate : (1 - v.winrate) | winrate}}</span>
                                </div>
                            </div>
                            <div class="box fix" :class="optionsStyle.data[optionsStyle.value].name" v-if="optionsStyle.value == 2 || optionsStyle.value == 3">
                                <div class="new-win-it r">
                                    <div class="r-b" :class="{'opt-weaken': options.color == -1}">
                                        <span class="txt b">{{options.color == 1 ? v.winrate : (1 - v.winrate) | winrate}}</span>
                                    </div>
                                    <div class="r-w" :class="{'opt-weaken': options.color == 1}">
                                        <span class="txt w">{{options.color == -1 ? v.winrate : (1 - v.winrate) | winrate}}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- <div class="winrate-options" v-if="optionsStyle.value != 0">
                            <div class="new-win-it">
                                <span class="txt">{{options.color == 1 ? v.winrate : (1 - v.winrate) | winrate}}</span>
                            </div>
                            <div class="new-win-it r">
                                <div class="r-b" :style="{width: `${(options.color == 1 ? v.winrate : (1 - v.winrate)) * 100}%`}"></div>
                                <div class="r-w" :style="{width: `${(options.color == -1 ? v.winrate : (1 - v.winrate)) * 100}%`}"></div>
                            </div>
                            <div class="new-win-it">
                                <span class="txt">{{options.color == -1 ? v.winrate : (1 - v.winrate) | winrate}}</span>
                            </div>
                        </div> -->
                    </li>
                </ul>
                <!-- <ul class="table-content-tr own" v-if="!options.actual && options.actualCoord" 
                :class="{'select': select && select.actualCoord == options.actualCoord}"
                @click="branchCon(options)" :style="select && select.actualCoord ? `background: ${options.userScore.color}` : ''"
                @mouseenter="branchHover(options)" @mouseleave="branchBlur(options)">
                    <li class="table-content-td t1">
                        <img class="stone" :src="`${GLOBAL.assetsUrl}/img/st${options.color == 1 ? 'b' : 'w'}1.png`">
                        <span class="coor">{{options.actualCoord | coordFilter}}</span>
                        <span class="own-score" :style="`background: ${options.userScore.color};`">
                            <span class="score-i"></span>
                            <span class="score-i sc">{{options.userScore.score}}</span>
                        </span>
                    </li>
                    <li class="table-content-td t2">
                        <div class="prop">
                            <div class="table-item-prop-range theme-border-options">
                                <div class="prop-range-body" style="width: 0px;" ></div>
                            </div>
                            <div class="txt">0%</div>
                        </div>
                    </li>
                    <li class="table-content-td t3">{{options.actualScore | tofixed1}}</li>
                    <li class="table-content-td t4">{{options.actualValue | winrate}}</li>
                </ul> -->
            </div>
        </div>
        <!-- <div class="options-style-select">
            <el-radio v-model="optionsStyle.value" :label="v.value" v-for="(v, i) in optionsStyle.data" :key="i">
                <span class="txt">样式{{v.name}}</span>
            </el-radio>
        </div> -->
    </div>
</template>

<script>
    export default {
        name: '',
        props: {
            reviewBoard: Boolean,
            options: Object,
            pageStatus: Boolean,
            branchFun: String,
            filterDisabled: Boolean
        },
        data() {
            return {
                optionsStyle: {
                    data: [
                        {name: 'A', value: 0},
                        {name: 'B/C', value: 1},
                        {name: 'D', value: 2},
                        {name: 'E', value: 3},
                    ],
                    value: 3
                },
                select: null,
                optionsLock: false,
                branchIndex: 0,
                optioneTemplate: null,
                itemStyle: {}
            };
        },
        methods: {
            propStyle(val){
                return {
                    width: `${(val.proportion * 100).toFixed(2)}%`
                }
            },
            branchCon(val){
                if(this.optionsLock && this.optionsLock.coord == val.coord){
                    return this.branchClearLock()
                }
                if(!this.pageStatus) return
                this.branchClock(val)
                return this.branchOn(val)
            },
            branchHover(val){
                if(this.optionsLock) return
                if(this.select && this.select.coord == val.coord) return
                return this.branchOn(val)
            },
            branchBlur(){
                if(this.optionsLock) return
                this.branchOff()
            },
            branchOn(val, index){
                this.select = this.GLOBAL.deepCopy(val)
                // this.itemStyleCheck(this.select)
                let moves = val.variation
                moves = moves.split(',')
                moves.unshift(val.coord)
                // if(!val.root) moves.unshift(val.coord)
                index = index != undefined ? index : moves.length - 1
                this.branchIndex = index
                let rm = []
                // rm.push(val.coord)
                for(var i in moves){
                    if(i > index) break
                    rm.push(moves[i])
                }
                if(moves) moves = `${val.coord},${moves}`
                else moves = val.coord
                this.$emit('takeFun', {
                    fun: this.branchFunCul,
                    data: rm
                })
            },
            branchOff(){
                this.itemStyle = {background: null}
                this.select = null
                this.$emit('takeFun', {
                    fun: 'branchOff',
                })
                this.$emit('update', {
                    splitBranchOptionsBranch: false
                })
            },
            branchClearLock(){
                this.optionsLock = null
                this.branchOff()
            },
            branchClock(val){
                if(this.cantLock) return
                this.optionsLock = val
            },
            branchScroll(e){
                if(!this.select) return
                let deltaY = e.deltaY
                deltaY > 0 ? this.branchScrollDown() : this.branchScrollUp()
            },
            branchScrollUp(){
                this.branchIndex--
                if(this.branchIndex < 0) this.branchIndex = 0
                this.branchOn(this.select, this.branchIndex)
            },
            branchScrollDown(){
                this.branchIndex++
                let data = this.select.variation
                data = data.split(',')
                data.unshift(this.select.coord)
                if(this.branchIndex > data.length - 1) this.branchIndex = data.length - 1
                this.branchOn(this.select, this.branchIndex)
            },
            optionsLockOff(){
                this.branchClearLock()
            },
            clear(){
                this.select = null
                this.branchClearLock()
            },
            lockBranchBykeyboard(index){
                if(!this.options || !this.options.options || !this.options.options[index]) return
                this.branchCon(this.options.options[index])
            },
        },
        created() {

        },
        components: {
        },
        computed: {
            simulatShow(){
                let options = this.options || {}
                if(!options || !options.root || !Object.keys(options.root).length) return null
                return options.root.number
            },
            branchFunCul(){
                return this.branchFun || 'branchOn'
            },
            culColor(){
                if(!this.options || !this.options.color) return '黑'
                return this.options.color == 1 ? '黑' : '白'
            },
        },
        watch: {
            select:{
                handler(val){
                    this.$emit('update', {
                        'optionsSplitBranchSelect': val
                    })
                },
                immediate: true,
                deep: true
            },
            options: {
                handler(newVal, oldVal){
                    let o = this.GLOBAL.deepCopy(newVal)
                    let l = this.GLOBAL.deepCopy(oldVal)
                    if(JSON.stringify(o) != JSON.stringify(l)) this.clear()
                    // this.parseOptions(newVal)
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
<style lang='less' src="../assets/css/options.less"></style>
<style lang='less'>
    .options-com-split-opt.m{
        height: auto;
    }
</style>
