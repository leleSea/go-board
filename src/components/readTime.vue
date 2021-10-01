<!--  -->
<template>
   <div class='read-time'>
       <div class="basic-item-time">
            <div class="item-i a">
                <div class="it ita">
                    <span>119分17秒</span>
                </div>
                <div class="it itb">剩余时间</div>
                <div class="it ita">
                    <span>119分17秒</span>
                </div>
            </div>
            <div class="item-i b">
                <div class="it ita">
                    <div>
                        <div class="it-i">30秒3次</div>
                        <div class="it-i">
                            <div class="m sec">
                                <div class="is l">
                                    <div class="time-per ">
                                        <div class="time-per-body" :style="timeSet['b'].per">
                                            <div class="time-per-body-warning" v-show="timeSet['b'].perNum <= timeWarning && colorObj[now] == 'b'"></div>
                                        </div>
                                    </div>
                                    <div class="time-txt">{{countTimeBlack.s}}</div>
                                </div>
                            </div>
                        </div>
                        <div class="spe-info" v-show="passInfo['b']">{{passInfo['b']}}</div>
                    </div>
                </div>
                <div class="it itb">读秒</div>
                <div class="it ita">
                    <div v-show="gameTime.unavailable || gameInfo.userKey == 'b'">-</div>
                    <div v-show="!gameTime.unavailable && gameInfo.userKey == 'w'">
                        <div class="it-i">{{gameInfo.time.second}}秒{{timeSet['w'].num}}次</div>
                        <div class="it-i">
                            <div class="m sec">
                            <div class="is r">
                                <div class="time-txt">{{countTimeWhite.s}}</div>
                                <div class="time-per" >
                                    <div class="time-per-body" :style="timeSet['w'].per">
                                        <div class="time-per-body-warning" v-show="timeSet['w'].perNum <= timeWarning && colorObj[now] == 'w'"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        </div>
                        <div class="spe-info" v-show="passInfo['w']">{{passInfo['w']}}</div>
                    </div>
                    
                </div>
            </div>
        </div>
   </div>
</template>

<script>
   export default {
       name: 'readTime',
       props: {
           time: Number,
           second: Number,
           num: Number
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
    .read-time{
        .basic-item.b{
            position: relative;
            .basic-item-time{
                padding: 0px 0.75rem;
            }
            .basic-item-time.hide{
                opacity: 0;
            }
            // color: #fff;
            .item-i.a{
                border-bottom: 1px solid #9A999C;
            }
            .item-i.result-icon{
                position: absolute;
                top: -2rem;
                left: 0px;
                width: 100%;
                display: block;
                .result-icon-item:first-child{
                    float: left;
                }
                .result-icon-item:last-child{
                    float: right;
                }
                .result-icon-item{
                    width: 5rem;
                    text-align: center;
                    .img{
                        display: inline-block;
                        width: 3rem;
                        height: 3rem;
                    }
                    // .img.lose{
                    //     background: url('@{assetsUrl}r8.png') no-repeat;
                    //     background-size: 100% 100%;
                    // }
                    // .img.win{
                    //     background: url('@{assetsUrl}r7.png') no-repeat;
                    //     background-size: 100% 100%;
                    // }
                }
            }
            .item-i{
                padding: 0.5rem 0px;
                display: flex;
                .ita{
                    width: 35%;
                    position: relative;
                    .spe-info{
                        position: absolute;
                        bottom: -1rem;
                        width: 100%;
                        text-align: center;
                    }
                }
                .itb{
                    width: 30%;
                }
            }
        }
    }
    
</style>