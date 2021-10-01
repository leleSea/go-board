<!--  -->
<template>
    <div class='board-move' :class="[theme]">
        <div class="move-slider">
            <el-slider 
            v-model="positionTem"
            :max.sync="stepTem"
            :min.sync="minNumCul"
            :disabled="sliderDisabled"
            @change="changePos"
            height="0.5rem"
            ></el-slider>
        </div>
        <div class="move-btn">
            <ul class="move-btn-body">
                <li class="move-item" :class="{'disabled': disabledGet('s'), 'normal': position > 0}" @click="jumpTo('s')">
                    <img :src="`${GLOBAL.assetsUrl}/img/c3${theme}.png`">
                </li>
                <li class="move-item" :class="{'disabled': disabledGet('-5'), 'normal': position > 0}" @click="jumpTo('-5')">
                    <img :src="`${GLOBAL.assetsUrl}/img/c2${theme}.png`">
                </li>
                <li class="move-item" :class="{'disabled':disabledGet('-1'), 'normal': position > 0}" @click="jumpTo('-1')">
                    <img :src="`${GLOBAL.assetsUrl}/img/c1${theme}.png`">
                </li>
                <li class="move-item" :class="{'disabled': disabledGet('1'), 'normal': position < step}" @click="jumpTo('1')">
                    <img class="rotate180" :src="`${GLOBAL.assetsUrl}/img/c1${theme}.png`">
                </li>
                <li class="move-item" :class="{'disabled': disabledGet('5'), 'normal': position < step}" @click="jumpTo('5')">
                    <img class="rotate180" :src="`${GLOBAL.assetsUrl}/img/c2${theme}.png`">
                </li>
                <li class="move-item" :class="{'disabled': disabledGet('l'), 'normal': position < step}" @click="jumpTo('l')">
                    <img class="rotate180" :src="`${GLOBAL.assetsUrl}/img/c3${theme}.png`">
                </li>
            </ul>
            <div class="move-btn-p">
                <span class="txt" v-if="!$slots.postionTemplate">第{{positionTem}}/{{stepTem}}手</span>
                <slot name="postionTemplate"></slot>
            </div>
        </div>
        
    </div>
</template>

<script>
    export default {
        name: '',
        props: {
            theme: String,
            position: Number,
            step: Number,
            minJump: Number,
            disabledDefine: Object,
            sliderDisabled: Boolean,
            jumpToFun: String,
            changePosFun: String,
            minNum: Number,
            sgfInfo: {
                type: Object,
                default(){
                    return {}
                }
            },
        },
        data() {
            return {
                positionTem: 0,
                stepTem: 0,
                minJumpTem: 0,
                stVal: 0
            };
        },
        methods: {
            changePos(val){
                if(isNaN(val)){
                    this.positionTem = this.position
                    return
                }
                let fun = 'changePos'
                if(this.changePosFun) fun = this.changePosFun
                this.$emit('takeFun', {
                    fun: fun,
                    data: val
                })
            },
            jumpTo(p){
                let fun = 'jumpTo'
                if(this.jumpToFun) fun = this.jumpToFun
                this.$emit('takeFun', {
                    fun: fun,
                    data: p
                })
            },
            disabledGet(p){
                if(!this.disabledDefine || this.disabledDefine[p] == undefined) return this.commonDisabled(p)
                return this.disabledDefine[p]
            },
            commonDisabled(p){
                switch(p){
                    case 's':
                        return this.position <= 0
                    case '-5':
                        return this.position <= 0
                    case '-1':
                        return this.position <= 0
                    case '1':
                        return this.position >= this.step
                    case '5':
                        return this.position >= this.step
                    case 'l':
                        return this.position >= this.step
                }
            },
        },
        created() {
            this.positionTem = this.position
            this.stepTem = this.step
            this.minJumpTem = this.minJump
        },
        components: {
        },
        computed: {
            sgfInfoSt(){
                // let sgfInfo = this
                // let {st, ha} = sgfInfo
                // st = st || {}
                let stVal = this.stVal || 0
                stVal = Number(stVal)
                if(isNaN(stVal)) stVal = 0
                if(stVal < 0) stVal = 0
                return stVal
            },
            disabledDefineCul(){
                if(!this.GLOBAL.isObject(this.disabledDefine)) return {}
                return this.disabledDefine || {}
            },
            minNumCul(){
                let num = Number(this.minNum) || this.sgfInfoSt
                return num
            }
        },
        watch: {
            sgfInfo: {
                handler(val){
                    val = val || {}
                    let st = val.st || {}
                    st = st.value || 0
                    this.stVal = st
                },
                deep: true,
                immediate: true
            },
            minNum(){
            },
            position(){
                this.positionTem = this.position
            },
            step(){
                this.stepTem = this.step
            },
            minJump(){
                this.minJumpTem = this.minJump
            },
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
    .board-move{
        @moveBtnBodyW: 80%;
        .move-btn{
            display: flex;
            .move-btn-body{
                width: @moveBtnBodyW;
                display: flex;
                .move-item.normal:active{
                    transform: scale(0.95);
                }
                .move-item.disabled{
                    opacity: 0.6;
                    cursor: not-allowed;
                }
                .move-item{
                    cursor: pointer;
                    width: 16.66%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    img{
                        width: 1.2rem;
                        height: 1rem;
                    }
                }
            }
            .move-btn-p{
                width: calc(100% - @moveBtnBodyW);
                text-align: right;
                white-space: nowrap;
            }
        }
        .move-slider{
            padding: 0px 0.3rem;
            .el-slider__runway{
                height: 0.2rem;
                margin: 0.6rem 0px;
            }
            .el-slider__bar{
                height: 0.2rem;
            }
            .el-slider__button{
                width: 100%;
                height: 100%;
                float: left;
                border: 0px;
            }
            .el-slider__button-wrapper{
                width: 0.6rem;
                height: 0.6rem;
                top: 0px;
                bottom: 0px;
                margin: auto;
            }
        }
    }
</style>