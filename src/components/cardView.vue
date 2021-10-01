<!--  -->
<template>
   <div class='card-com'>
       <div class="card-com-body" :class="cardPlanNow.card.name">
           <div class="card-com-content">
                <div class="card-status-box" :class="{'active': cardPlanNow.status.active}" v-if="cardPlanNow.status.active != 'NONE'">
                    <span class="txt">{{cardPlanNow.status.txt}}</span>
                </div>
                <div class="item-title">
                    <div class="title-card">
                        <img class="icon" :src="`${GLOBAL.assetsUrl}/img/${cardPlanNow.card.name}.png`" alt="">
                        <span class="title-txt title-txt-set">{{GLOBAL.language.cardPage[cardPlanNow.card.name]}}</span>
                    </div>
                </div>
                <ul class="item-content">
                    <li class="item-content-i">
                        <span class="txt">{{cardPlanNow.gpuPlan.name}}剩余时长：</span>
                        <span class="txt">{{cardPlanNow.remainTime}}</span>
                        <span class="txt">/</span>
                        <span class="txt">{{cardPlanNow.card.giftGpuTime}}</span>
                    </li>
                    <li class="item-content-i">
                        <span class="txt">{{GLOBAL.language.storeBillType.s1}}{{cardPlanNow.discounts | discount}}折优惠</span>
                    </li>
                </ul>
                <ul class="item-foot">
                    <li>
                        <span class="txt">生效日期：</span>
                        <span class="txt">
                            {{cardPlanNow.startTime.date.year}}-
                            {{cardPlanNow.startTime.date.month}}-
                            {{cardPlanNow.startTime.date.day}}
                        </span>
                    </li>
                    <li>
                        <span class="txt">有效期至：</span>
                        <span class="txt">
                            {{cardPlanNow.endTime.date.year}}-
                            {{cardPlanNow.endTime.date.month}}-
                            {{cardPlanNow.endTime.date.day}}
                        </span>
                    </li>
                </ul>
           </div>
       </div>
   </div>
</template>

<script>
   export default {
       name: 'cardView',
       props: {
            cardPlanNow: Object
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
.card-com{
    width: 21rem;
    height: 12rem;
    .card-com-body.silver{
        background: url('@{assetsUrl}silver-bcg.png') no-repeat;
        background-size: 100% 100%;
        color: #000;
    }
    .card-com-body.gold{
        background: url('@{assetsUrl}gold-bcg.png') no-repeat;
        background-size: 100% 100%;
        color: #000;
    }
    .card-com-body.platinum{
        background: url('@{assetsUrl}platinum-bcg.png') no-repeat;
        background-size: 100% 100%;
        color: #000;
    }
    .card-com-body.diamond{
        background: url('@{assetsUrl}diamond-bcg.png') no-repeat;
        background-size: 100% 100%;
        color: #000;
    }
    .card-com-body.black_gold{
        background: url('@{assetsUrl}black_gold-bcg.png') no-repeat;
        background-size: 100% 100%;
        color: #fff;
    }
    .card-com-body{
        position: relative;
        width: 100%;
        height: 100%;
        border-radius: 0.3rem;
        box-shadow: 0.1rem 0.1rem 0.2rem 0.1rem #233144;
        overflow: hidden;
        .card-com-bcg{
            position: absolute;
            top: 0px;
            left: 0px;
            width: 100%;
            height: 100%;
            img{
                width: 100%;
                height: 100%;
            }
        }
        .card-status-box.active{
            background: #43CC00;
        }
        .card-status-box{
            top: 0.5rem;
            right: -1.8rem;
            width: 6.5rem;
            text-align: center;
            line-height: 1.8rem;
            height: 1.8rem;
            position: absolute;
            background: #8D8D8D;
            transform: rotate(45deg);
            .txt{
                font-size: 1rem;
                color: #fff;
            }
        }
        .item-title{
            padding: 1rem 0px;
            position: relative;
            .title-card{
                display: flex;
                align-items: center;
                justify-content: center;
                .icon{
                    margin-right: 0.5rem;
                    width: 1.75rem;
                }
                .title-txt{
                    color: inherit;
                    font-size: 1.5rem;
                }
            }
            .order-time{
                position: absolute;
                left: 0.5rem;
                top: 0.5rem;
                color: #999
            }
            .order-status{
                position: absolute;
                right: 0.5rem;
                top: 0.5rem;
                color: #909399;
            }
            .order-status.active{
                color: #67C23A;
            }
        }
        .item-content{
            padding: 0.5rem 1.5rem;
            .item-content-i{
                text-align: left;
                margin-bottom: 0.5rem;
                .txt{
                    font-size: 1rem;
                    color: inherit;
                }
            }
            .item-content-i:last-child{
                margin: 0px;
            }
        }
        .item-foot{
            position: absolute;
            bottom: 0rem;
            left: 0px;
            width: 100%;
            padding: 0.5rem;
            text-align: right;
            color: inherit;
            box-sizing: border-box;
            .txt{
                font-size: 0.9rem;
            }
        }
    }
}
    
</style>