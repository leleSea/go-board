<!--  -->
<template>
 <!--  -->
 <div class="bonus-everyday-box" v-show="status">
    <div class="bonus-everyday" :style="css">
        <div class="bonus-box-item item-title">
            <div class="bonux-icon"></div>
            <h1 class="title-txt">每日登录奖励</h1>
        </div>
        <div class="bonus-content">
            <div class="bonus-box-item item-content">
                <div class="item-i" v-for="(v, i) in bonusConfig" :key="i" v-if="bonusData[i]">
                    <div class="i-body">
                        <h2 class="con-i-t">{{v.name}}</h2>
                        <p class="con-i-c">
                            <!-- <img :src="`${GLOBAL.assetsUrl}/img/bu1.png`" class="con-i-c-icon"> -->
                            <img :src="`${GLOBAL.assetsUrl}/img/${v.icon}.png`" class="con-i-c-icon">
                            
                            <span class="con-i-c-label">X</span>
                            <span>{{bonusData[i]}}</span>
                        </p>
                        <img :src="`${GLOBAL.assetsUrl}/img/r4.png`" class="i-body-icon" alt="">
                    </div>
                </div>
            </div>
            <div class="bonus-box-item item-btn">
                <el-button @click="animationStop">领　取</el-button>
            </div>
        </div>
        
    </div>
</div>
</template>

<script>
    export default {
        name: '',
        data() {
            return {
                bonusData: {},
                bonusConfig: {},
                status: false,
                css: {},
                t: 300
            };
        },
        methods: {
            open(){
                this.status = true
            },
            close(){
                this.status = false
            },
            bonus(data){
                this.bonusData = data
                setTimeout(() => {
                    this.animationStart()
                }, 500);
                // this.$emit('update')
            },
            pageScale(num){
                this.css['transform'] = `scale(${num})` 
                this.$forceUpdate()
            },
            animationStart(){
                this.open()
                setTimeout(() => {
                    this.pageScale(1)
                }, this.t);
            },
            animationStop(){
                this.pageScale(0)
                setTimeout(() => {
                    this.close()
                }, this.t);
                this.$emit('update')
            },
        },
        created() {
            this.bonusData = {
                code: 0,
                area_increment: 5,
                errorMsg: undefined,
                options_increment: 5,
                variation_increment: 5,
                back_move_increment: 5
            }
            this.bonusConfig = this.GLOBAL.bonusConfig
            // setTimeout(() => {
            //     this.animationStart()
            // }, 2000);
        },
        components: {
        },
        computed: {},
        watch: {},
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
    .bonus-everyday.hide{
        
    }
    .bonus-everyday-box{
        position: fixed;
        top: 0px;
        left: 0px;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: cener;
        justify-content: cnter;
        z-index: 99999;
        .bonus-everyday{
            transition: all .5s;
            @mainBcgColor: #447BB9;
            transform: scale(0);
            transform-origin: center center;
            @pageWidth: 40rem;
            @pageHeight: 16rem;
            @titleHeight: 4rem;
            @boxRadius: 0.3rem;
            @titleIconSize: 1.8rem;
            @btnHeight: 2.5rem;
            @pagePadding: 2rem;
            width: @pageWidth;
            // height: @pageHeight;
            margin: auto;
            // background: #CDCDCD;
            z-index: 999;
            color: #fff;
            border-radius: @boxRadius;
            overflow: hidden;
            // padding: @pagePadding;
            .bonus-box-item:first-child{
                margin: 0px;
            }
            .bonus-box-item{
                // margin-top: 1rem;

            }
            .item-title{
                display: flex;
                align-items: center;
                justify-content: center;
                background: @mainBcgColor;
                height: @titleHeight;
                .bonux-icon{
                    background: url('@{assetsUrl}r9.png') no-repeat;
                    background-size: 100% 100%;
                    width: @titleIconSize;
                    height: @titleIconSize;
                    margin-right: 1rem;
                }
                .title-txt{
                    font-size: 1.5rem;
                    color: #fff;
                }
            }
            .bonus-content{
                background: #fff;
            }
            .item-content{
                // min-height: calc(@pageHeight - @titleHeight - @btnHeight - @pagePadding * 2); 
                padding: 0px 2.5rem;
                height: 10rem;
                display: flex;
                align-items: center;
                justify-content: center;
                .item-i{
                    float: left;
                    width: 33%;
                    padding: 0px 1rem;
                    .i-body{
                        background: @mainBcgColor;
                        border-radius: 0.2rem;
                        position: relative;
                        .con-i-t{
                            font-size: 1rem;
                            padding: 0.7rem 0rem;
                            border-bottom: 1px solid #fff;
                        }
                        .con-i-c{
                            padding: 0.3rem 0rem;
                            font-size: 0.8rem;
                            border-top: 1px solid #fff;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            @item-margin-right: 0.3rem;
                            background: #DADADA;
                            color: #000;
                            .con-i-c-icon{
                                width: 1rem;
                                margin-right: @item-margin-right;
                            }
                            .con-i-c-label{
                                margin-right: @item-margin-right;
                            }
                        }
                        .i-body-icon{
                            width: 1.5rem;
                            position: absolute;
                            bottom: -0.7rem;
                            right: -0.7rem;
                        }
                    }
                }
            }
            .item-btn{
                padding-bottom: 1.5rem;
                .el-button{
                    width: 11rem;
                    height: 2.5rem;
                    padding: 0px;
                    line-height: 2rem;
                    text-align: center;
                    color: #fff;
                    background: #65B74C;
                    border: 0px;
                    font-weight: 600;
                    span{
                        font-size: 1rem;
                    }
                }
            }
        }
    }
    
</style>