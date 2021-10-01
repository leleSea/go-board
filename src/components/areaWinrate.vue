<!--  -->
<template>
    <div class='area-winrate'>
        <div class="game-info-winrate">
            <div class="game-info-winrate-body page-panel-bcg" v-show="active">
                <div class="item-area-txt">
                    <div class="stone-label" :class="stoneColor"></div>
                    <div class="txt">{{deltaCount}}</div>
                </div>
                <div class="item-winrate">
                    <div class="info-range">
                        <div class="range-body">
                            <div class="range-item b" :style="{'width': `${blackStyle}%`}">
                                <span v-show="blackWinrateCul >= 0.15" class="txt" v-if="!hideNumber">
                                    {{(blackWinrateCul * 100) | tofixed1}}%
                                </span>
                            </div>
                            <div class="range-item w" :style="{'width': `${whiteStyle}%`}">
                                <span v-show="whiteWinrateCul >= 0.15" class="txt" v-if="!hideNumber">{{whiteWinrateCul * 100 | tofixed1}}%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'areaWinrate',
        props: {
            active: Boolean,
            blackDelta: Number,
            blackWinrate: Number,
            hideNumber: Boolean
        },
        data() {
            return {

            };
        },
        methods: {

        },
        created() {

        },
        components: {
        },
        computed: {
            blackDeltaCul(){
                return this.blackDelta || 0
            },
            blackWinrateCul(){
                let val = Number(this.blackWinrate)
                if(isNaN(val)) return 0.5
                let data = val
                return data
            },
            whiteWinrateCul(){
                let data = this.blackWinrateCul
                data = 1 - data
                return data
            },
            blackStyle(){
                let per = this.blackWinrateCul
                return (per * 100).toFixed(1)
            },
            whiteStyle(){
                let per = this.whiteWinrateCul
                return (per * 100).toFixed(1)
            },
            whitePer(){},
            stoneColor(){
                let blackDelta = this.blackDeltaCul
                let css = ''
                if(blackDelta == 0) return css
                return blackDelta > 0 ? 'BLACK' : 'WHITE'
            },
            deltaCount(){
                let blackDelta = this.blackDeltaCul
                let txt = ''
                blackDelta = blackDelta.toFixed(1)
                if(blackDelta < 0) txt = `${this.$i18n.t('白领先')}${Math.abs(blackDelta)}${this.$i18n.t('目')}`
                else if(blackDelta > 0) txt = `${this.$i18n.t('黑领先')}${Math.abs(blackDelta)}${this.$i18n.t('目')}`
                return txt
            },
        },
        watch: {
            blackWinrate: {
                handler(val){
                },
                deep: true,
                immediate: true
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
    .area-winrate{
        width: 100%;
        .game-info-winrate{
            position: relative;
            // color: #fff;
            .game-info-judge{
                .item-area-txt{
                    width: 100%;
                    height: 1rem;
                }
                .range-item{
                    width: 100%;
                    text-align: center;
                    span{
                        margin-left: 0.5rem;
                    }
                    span:first-child{
                        margin: 0px;
                    }
                }
            }
            .game-info-winrate-body.close{
                .item-area-txt{
                    opacity: 0;
                    color: #7C828E;
                }
                position: relative;
                .close-icon{
                    position: absolute;
                    top: 0px;
                    bottom: 0px;
                    left: 0px;
                    right: 0px;
                    margin: auto;
                    background: url('@{assetsUrl}v8.png') no-repeat;
                    background-size: 100% 100%;
                    width: 4rem;
                    height: 4rem;
                    opacity: 0.5;
                }
                .item-winrate{
                    
                    .info-range{
                        .range-body{
                            opacity: 0;
                            .range-item.b{
                                background: #5E6470;
                                width: 50%;
                            }
                            .range-item.w{
                                background: #7A808C;
                                width: 50%;
                            }
                        }
                    }
                }
            }
            .game-info-winrate-body{
                // background: #6A707E;
                width: 100%;
                padding: 1rem 1.5rem 1rem;
            }
            
            .winrate-switch{
                z-index: 2;
                position: absolute;
                left: 1.5rem;
                top: 0.75rem;
                .el-switch.is-checked .el-switch__core::after{
                    margin-left: -1rem !important;
                }
                .el-switch__core:after{
                    width: 1rem;
                    height: 1rem;
                    top: 0px;
                    margin-top: -1px;
                    // left: auto;
                    // right: 0px;
                }
                .el-switch__core{
                    width: 2rem !important;
                    height: 1rem;
                    border-radius: 0.5rem;
                }
            }
            .item-area-txt.close{
                opacity: 0;
            }
            .item-area-txt{
                display: flex;
                justify-content: center;
                align-items: center;
                .stone-label{
                    margin-right: 0.5rem;
                    width: 1rem;
                    height: 1rem;
                }
            }
            .item-winrate{
                position: relative;
                margin-top: 1rem;
                .info-range{
                    .range-body{
                        display: flex;
                        border-radius: 0.15rem;
                        overflow: hidden;
                        .range-item.b{
                            color: #fff;
                            background: #000;
                            width: 40%;
                        }
                        .range-item.w{
                            color: #000;
                            background: #fff;
                            width: 60%;
                        }
                        .range-item{
                            transition: all .5s;
                            height: 1rem;
                            text-align: center;
                        }
                    }
                }
            }
        }
    }
</style>