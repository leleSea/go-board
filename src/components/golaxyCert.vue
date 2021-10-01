<!--  -->
<template>
    <!-- <div class='golaxy-cert'>
        <div class="level-cert">
            <div class="level-cert-body-bcg">
                <div class="level-cert-body">
                    <img class="cert-icon-bcg" :src="`${GLOBAL.assetsUrl}/img/lci.png`" ref="cert-icon-bcg">
                    <div class="cert-num">
                        <span>证书编号：{{certInfo.num}}</span>
                    </div>
                    <h1 class="cert-title">
                        <img class="cert-title-icon" :src="`${GLOBAL.assetsUrl}/img/lct.png`" alt="" ref="cert-title-icon">
                    </h1>
                    <div class="cert-content">
                        <h1 class="cert-content-name">
                            <span class="txt">{{certInfo.name}}：</span>
                        </h1>
                        <p class="cert-content-p">
                            <span class="txt">恭喜你获得</span>
                            <span class="txt p-level">{{certInfo.level}}</span>
                            <span class="txt">称号！</span>
                        </p>
                    </div>
                    <div class="cert-foot">
                        <span class="cert-foot-txt">
                            <img class="cert-seal-icon" :src="`${GLOBAL.assetsUrl}/img/golaxy_seal.png`" alt="" ref="cert-seal-icon">
                            <span class="txt">日期：{{certInfo.date}}</span>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div> -->
    <div class="golaxy-cert-new" :style="boxStyle">
        <div class="golaxy-cert-new-body" :style="bodyStyle">
            <div class="cert-board init" ref="certBoard" v-if="!hideBoard">
                <div class="cert-board-init">
                    <img class="cert-board-bcg" :src="`${GLOBAL.assetsUrl}/img/board_bcg.jpg`" alt="">
                    <board :boardId="'goaxyCertBoard'" :size="boardSize" :background='background' ref="board" v-on:update="update" v-on:takeFun="takeFun" 
                    :coor.sync="coor" :stoneToLocal="false"></board>
                </div>
            </div>
            <div class="cert-m-content">
                <img :src="`${GLOBAL.assetsUrl}/img/lcb2.png`" class="cert-m-bcg">
                <div class="cert-m-content-con">
                    <ul class="cert-m-content-body">
                        <li class="m-item title">
                            <img class="widthest" :src="`${GLOBAL.assetsUrl}/img/${this.$i18n.t('lcb3')}.png`" alt="">
                        </li>
                        <li class="m-item np">
                            <div class="np-pa">
                                <span class="txt">{{ $t('恭喜你击败') }}</span>
                                <span class="txt txt-level">
                                    {{ $t('星阵') }} {{$t(certTitleCul.saveName) || $t(certTitleCul.label)}}
                                </span>
                            </div>
                            <div class="np-pb">
                                <span class="txt">{{ $t('获得成就') }}</span>
                            </div>
                        </li>
                        <li class="m-item wo">
                            <span class="txt">{{$t(certTitleCul.certicate)}}</span>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="board-template">

            </div>
        </div>
        
    </div>
</template>

<script>
    import board from './board.vue'
    import html2canvas from 'html2canvas'

    export default {
        name: 'golaxyCert',
        props: {
            certInfo: Object,
            coor: Number,
            scale: Number,
            hideBoard: Boolean
        },
        data() {
            return {
                boardUrl: null,
                background: '../assets/BJ.jpg',
                boardSize: 19,
                boardBcg: null,
                imgList: {
                    board_bcg: `${this.GLOBAL.assetsUrl}/img/board_bcg.png`,
                    
                }
            };
        },
        methods: {
            takeFun(opt){
                let fun = opt.fun
                if(this[fun]) this[fun](opt.data)
            },
            update(options){
                for(var i in options){
                    this[i] = options[i]
                }
            },
            boardHasInit(){
                let size = 800
                this.$refs['board'].board.board.setWidth(size)
                this.$refs['board'].board.board.setHeight(size)
                if(this.certInfo.gameId) this.pageInit()
            },
            async pageInit(){
                let id = this.certInfo.gameId
                if(!id) return
                let res = await this.getMovesById(id)
                if(res) this.$refs['board'].loadSgf(res.normal)
                this.$emit('ready')
                // this.getImage(`${this.GLOBAL.assetsUrl}/img/board_bcg.jpg`).then(imgUrl => {
                //     this.boardBcg = imgUrl
                //     setTimeout(() => {
                //         // this.createCertImage(this.$refs['certBoard']).then(boardUrl => {
                //             this.boardUrl = true
                //         // })
                //     }, 100)
                //     this.$emit('ready')
                // })
            },
            async getMovesById(id){
                if(!this.$refs['board']) return
                let res = await this.$refs['board'].openSgfById(id)
                return res
            },
            async getImage(url, imgId) {
                let res =  await this.GLOBAL.getStaticData(url, {
                    responseType: 'blob'
                })
                if(!res) return false
                return URL.createObjectURL(res)
            },
            createCertImage(ele){
                return html2canvas(ele, {
                    backgroundColor: null,
                    useCORS: true,
                }).then(canvas => {
                    let dataURL = canvas.toDataURL("image/png");
                    // this.imgUrl = dataURL
                    // this.previewList = [dataURL]
                    return dataURL
                }); 
            },
        },
        created() {
        },
        components: {
            board
        },
        computed: {
            bodyStyle(){
                let scale = this.scale || 1
                // return {
                //     'transform': `scale(${scale})`,
                //     'transform-origin': 'left top'
                // }
            },
            boxStyle(){
                let scale = this.scale || 1
                let width = 36 * scale
                let height = 17 * scale
                // return {
                //     width: width + 'rem',
                //     height: height + 'rem'
                // }
            },
            certTitleCul(){
                let certInfo = this.certInfo
                let data = {}
                if(!certInfo || !certInfo.level) return data
                let level = this.GLOBAL.getLevel(certInfo.level)
                if(!level.certicate) return data
                data = level
                return data
            }
        },
        watch: {
            certInfo:{
                handler(){
                    this.pageInit()
                },
                immdiate: true,
                deep: true
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
<style lang='less'>
    @cert-item-size: 17rem;
    .golaxy-cert-new{
        display: flex;
        .golaxy-cert-new-body{
            display: flex;
        }
        .cert-board{
            width: @cert-item-size;
            height: @cert-item-size;
            position: relative;
            box-shadow: 0.3rem 0.3rem 0.3rem 0rem #2B3037;
            .cert-board-init.init-over{
                width: 100%;
                height: 100%;
            }
            .cert-board-init{
                // position: absolute;
                // z-index: -1;
                position: relative;
                // width: 39rem;
                // height: 39rem;
                width: 100%;
                height: 100%;
            }
            .cert-board-bcg{
                width: 100%;
                height: 100%;
                position: absolute;
                top: 0px;
                left: 0px;
            }
        }
        .cert-m-content{
            width: @cert-item-size;
            height: @cert-item-size;
            position: relative;
            // background: url('@{assetsUrl}lcb2.png') no-repeat;
            background-size: 100% 100%;
            margin-left: 2rem;
            position: relative;
            .cert-m-bcg{
                position: absolute;
                top: 0px;
                left: 0px;
                width: 100%;
                height: 100%;
                z-index: 1;
            }
            .cert-m-content-con{
                width: 100%;
                height: 14.7rem;
                display: flex;
                align-items: center;
                justify-content: center;
                position: absolute;
                top: 0px;
                left: 0px;
                z-index: 2;
                .cert-m-content-body{
                    .m-item.title{
                        width: 6rem;
                        margin: 0px auto;
                    }
                    .m-item.np{
                        margin: 0.5rem 0px;
                        .txt{
                            font-size: 0.8rem;
                            color: #333;
                        }
                        .txt.txt-level{
                            color: #333;
                            font-weight: 600;
                        }
                    }
                    .m-item.wo{
                        .txt{
                            color: #DA3836;
                            font-size: 1.8rem;
                            font-weight: bold;
                        }
                    }
                }
            }
        }
    }




















    .level-cert{
        @cert-icon-bcg-left: 3.5rem;
        @level-cert-body-p-t: 1.2rem;
        @level-cert-body-p-r: 1.1rem;
        @level-cert-body-p-b: 1.1rem;
        @level-cert-body-p-l: 1.27rem;
        @cert-content-p-l: calc(@cert-icon-bcg-left - @level-cert-body-p-l);
        color: #50432C;
        width: 100%;
        height: 16.3rem;
        // padding: 0.5rem @panelPaddingSide @panelPadding @panelPaddingSide;
        .level-cert-body-bcg{
            background: #F1ECE3;
            width: 100%;
            height: 100%;
            .level-cert-body{
                padding: @level-cert-body-p-t @level-cert-body-p-r @level-cert-body-p-b @level-cert-body-p-l;
                background: url('@{assetsUrl}lcb.png') no-repeat;
                // background: url('../assets/lcb.png');
                background-position: 0px 0px;
                background-size: 100% auto;
                width: 100%;
                height: 100%;
                position: relative;
                .cert-icon-bcg{
                    width: 3rem;
                    position: absolute;
                    top: 2.5rem;
                    left: @cert-icon-bcg-left;
                    right: auto;
                    bottom: auto;
                }
                .cert-num{
                    text-align: right;
                    padding: 0.5rem 1.7rem 0.3rem;
                }
                .cert-title{
                    padding-top: 0.3rem;
                    .cert-title-icon{
                        width: 10rem;
                    }
                }
                .cert-content{
                    margin-top: 0.8rem;
                    text-align: left;
                    padding: 0px @cert-content-p-l;
                    .cert-content-name{
                        .txt{
                            font-size: 1.5rem;
                        }
                    }
                    .cert-content-p{
                        margin-top: 0.5rem;
                        .txt{
                            font-size: 1.2rem;
                        }
                        .txt.p-level{
                            font-weight: 600;
                            margin: 0px 0.5rem;
                            font-size: 1.4rem;
                        } 
                    }
                }
                .cert-foot{
                    position: absolute;
                    bottom: @level-cert-body-p-b;
                    left: 0px;
                    width: 100%;
                    text-align: right;
                    padding: 0px calc(@level-cert-body-p-r + 2rem) 0px @level-cert-body-p-l;
                    .txt{
                        // font-size: 1rem;
                        font-size: 0.8rem;
                    }
                    .cert-foot-txt{
                        padding-bottom: 1.5rem;
                        position: relative;
                        display: inline-block;
                        .cert-seal-icon{
                            position: absolute;
                            width: 6.5rem;
                            left: 0px;
                            right: 0px;
                            margin: auto;
                            bottom: 0.5rem;
                        }
                    }
                    
                }
            }
        }
    }
</style>