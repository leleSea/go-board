<!--  -->
<template>
    <div class='card-component'>
        <!-- 普通卡类型 -->
        <div class="card-component-normal" v-if="cardType == 'normal'">
            <div class="card-com-body" :class="cardInfo.name" :style="cardStyle">
                <div v-if="cardInfo.status && cardInfo.status.active != 'NONE'" class="card-status-box" :class="{'active': cardInfo.status.active}">
                    <span class="txt">{{cardInfo.status.txt}}</span>
                </div>
                <div class="card-logo">
                    <img :src="`${GLOBAL.assetsUrl}/img/logo_card.png`" alt="">
                </div>
                <h1 class="card-title">
                    <img class="card-icon" :src="`${GLOBAL.assetsUrl}/img/${cardInfo.name}.png`" alt="">
                    <span class="txt">{{ $t('星光') }}{{$t(GLOBAL.language.cardPage[cardInfo.name])}}{{ $t('卡') }}</span>
                </h1>
                <div class="card-function">
                    <ul class="card-function-box">
                        <li class="function-item">
                            <i class="el-icon-check function-item-icon"></i>
                            <span class="txt">{{ $t('3X至120X所有配置享') }}{{$t(cardInfo.discounts | discount)}}{{ $t('折优惠') }}</span>
                        </li>
                        <li class="function-item gift">
                            <i class="el-icon-check function-item-icon"></i>
                            <span class="txt">{{ $t('每月赠送时长') }}：</span>
                            <ul class="function-item-i">
                                <li class="function-item-i-s" v-for="(s, j) in cardInfo.gift" :key="j">
                                    <p class="txt"><span class="txt" v-if="j != 0">{{ $t('或') }}</span>{{s.enginePlan}}{{ $t('配置')}} {{s.enginePlanTime}}{{ $t('分钟') }}</p>
                                </li>
                            </ul>
                        </li>
                        <li class="function-item">
                            <span class="min-txt txt-italic">{{GLOBAL.language.cardPage.c7}}</span>
                        </li>
                        <li class="function-item">
                            <span class="min-txt txt-italic">{{GLOBAL.language.cardPage.c8}}</span>
                        </li>
                    </ul>
                </div>
                <div class="card-foot">
                    <span class="txt">{{ $t('有效期') }}：</span>
                    <span class="txt">{{`${effTime.startTime.date.year}-${effTime.startTime.date.month}-${effTime.startTime.date.day}`}}</span>
                    <span class="txt mar">{{ $t('至') }}</span>
                    <!-- <span class="txt">{{`${effTime.endTime.date.year}-${effTime.endTime.date.month}-${effTime.endTime.date.day}`}}</span> -->
                    <span class="txt">{{`${endDay.year}-${endDay.month}-${endDay.day}`}}</span>
                </div>
            </div>
        </div>
        <!-- 7折卡 -->
        <div class="card-component-ath" v-if="cardType == 'ath'">
            <div class="card-com-body" :class="cardInfo.name" :style="cardStyle">
                <div v-if="cardInfo.status && cardInfo.status.active != 'NONE'" class="card-status-box" :class="{'active': cardInfo.status.active}">
                    <span class="txt">{{cardInfo.status.txt}}</span>
                </div>
                <div class="card-logo">
                    <img :src="`${GLOBAL.assetsUrl}/img/logo_card.png`" alt="">
                </div>
                <!-- <h1 class="card-title">
                    <img class="card-icon" :src="`${GLOBAL.assetsUrl}/img/${cardInfo.name}.png`" alt="">
                    <span class="txt">星光{{GLOBAL.language.cardPage[cardInfo.name]}}卡</span>
                </h1> -->
                <div class="card-function">
                    <!-- <ul class="card-function-box">
                        <li class="function-item">
                            <i class="el-icon-check function-item-icon"></i>
                            <span class="txt">3X至120X所有配置享{{cardInfo.discounts | discount}}折优惠</span>
                        </li>
                        <li class="function-item gift">
                            <i class="el-icon-check function-item-icon"></i>
                            <span class="txt">每月赠送时长：</span>
                            <ul class="function-item-i">
                                <li class="function-item-i-s" v-for="(s, j) in cardInfo.gift" :key="j">
                                    <p class="txt"><span class="txt" v-if="j != 0">或</span>{{s.enginePlan}}配置{{s.enginePlanTime}}分钟</p>
                                </li>
                            </ul>
                        </li>
                        <li class="function-item">
                            <span class="min-txt txt-italic">{{GLOBAL.language.cardPage.c7}}</span>
                        </li>
                        <li class="function-item">
                            <span class="min-txt txt-italic">{{GLOBAL.language.cardPage.c8}}</span>
                        </li>
                    </ul> -->
                    <div class="card-function-label-box">
                        <span class="txt">{{cardInfo.info}}</span>
                    </div>
                    <div class="card-function-label-word">
                        <div class="card-function-label-word-body">
                            <span class="txt">{{cardInfo.discounts | discount}}{{ $t('折') }}</span>
                        </div>
                    </div>
                </div>
                <div class="card-foot">
                    <span class="txt">{{ $t('有效期') }}：</span>
                    <span class="txt">{{`${effTime.startTime.date.year}-${effTime.startTime.date.month}-${effTime.startTime.date.day}`}}</span>
                    <span class="txt mar">{{ $t('至') }}</span>
                    <!-- <span class="txt">{{`${effTime.endTime.date.year}-${effTime.endTime.date.month}-${effTime.endTime.date.day}`}}</span> -->
                    <span class="txt">{{`${endDay.year}-${endDay.month}-${endDay.day}`}}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            cardInfo: Object,
            cardStyle: Object,
            effTime: Object
        },
        name: 'card-component',
        data() {
            return {
                cardType: null,
                cardViewStyle: {},
                bodyCss: {},
                lastDay: {
                    '1': 31,
                    '2': 30,
                    '3': 31,
                    '4': 3,
                    '5': 31,
                    '6': 3,
                    '7': 31,
                    '8': 31,
                    '9': 3,
                    '10': 31,
                    '11': 3,
                    '12': 31,
                }
            };
        },
        methods: {
            getLastDay(year, month){
                let date= new Date(year, month, 0)
                let day = date.getDate()
                day = day < 10 ? '0'+day : day
                return day
            },
            cardViewInit(){
                let cardPlan = this.cardInfo.cardPlan
                let cardViewStyle = this.GLOBAL.cardViewStyle
                let cardType = null
                for(var i in cardViewStyle){
                    if(cardPlan <= Number(cardViewStyle[i].cardPlan)){
                        cardType = cardViewStyle[i].name
                        break
                    }
                }
                if(cardType == null) cardType = 'normal'
                this.cardType = cardType
            },
        },
        created() {
            this.bodyCss = {
                width: this.width,
                height: this.height
            }
            this.cardViewInit()
        },
        components: {
        },
        computed: {
            endDay(){
                
                let effTime = this.effTime, data
                let year = Number(effTime.endTime.date.year), month = Number(effTime.endTime.date.month), day = Number(effTime.endTime.date.day)
                if(day > 1){
                    data = {day: day - 1, month: month, year: year} 
                }else{
                    year = month - 1 < 1 ? year - 1 : year
                    month = month - 1 < 1 ? 12 : month - 1
                    let d = this.getLastDay(year, month)
                    data = {
                        year: year,
                        month: month,
                        day: d
                    }
                }
                if(data.year < 10) data.year = '0' + data.year
                if(data.month < 10) data.month = '0' + data.month
                if(data.day < 10) data.day = '0' + data.day
                return data
            },
        },
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
    .card-component{
        .card-com-body.silver{
            background: url('@{assetsUrl}silver-bcg.png') no-repeat;
            background-size: 100% 100%;
            color: #333;
        }
        .card-com-body.gold{
            background: url('@{assetsUrl}gold-bcg.png') no-repeat;
            background-size: 100% 100%;
            color: #333;
        }
        .card-com-body.platinum{
            background: url('@{assetsUrl}platinum-bcg.png') no-repeat;
            background-size: 100% 100%;
            color: #333;
        }
        .card-com-body.diamond{
            background: url('@{assetsUrl}diamond-bcg.png') no-repeat;
            background-size: 100% 100%;
            color: #333;
        }
        .card-com-body.black_gold{
            background: url('@{assetsUrl}black_gold-bcg.png') no-repeat;
            background-size: 100% 100%;
            color: #fff;
        }
        .card-com-body{
            overflow: hidden;
            border-radius: 0.3rem;
            position: relative;
            box-shadow: 0.1rem 0.1rem 0.2rem 0.05rem #868787;
            padding: 0.5rem 1rem;
            .card-logo{
                position: absolute;
                top: 0.3rem;
                left: 0.3rem;
                img{
                    width: 3rem;
                }
            }
            .card-title{
                padding-top: 0.5rem;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-bottom: 0.5rem;
                .card-icon{
                    width: 1rem;
                    margin-right: 0.3rem;
                }
                .txt{
                    color: inherit;
                }
            }
            .card-function{
                .card-function-box{
                    .function-item.gift{
                        display: flex;
                        align-items: center;
                        .txt{
                            white-space: nowrap;
                        }
                    }
                    .function-item{
                        text-align: left;
                        .function-item-icon{
                            margin-right: 0.2rem;
                        }
                        .txt{
                            font-size: 0.6rem;
                        }
                        .min-txt{
                            font-size: 0.5rem;
                        }
                        .function-item-i{
                            margin-left: -0.5rem;
                            .function-item-i-s:first-child{
                                text-indent: 0.6rem;
                            }
                        }
                    }
                }
                
            }
            .card-foot{
                position: absolute;
                bottom: 0.5rem;
                right: 0.5rem;
                .mar{
                    margin: 0px 0.3rem
                }
                .txt{
                    font-size: 0.5rem;
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
        }
        .card-component-ath{
            @card-function-label-box-w: 14rem;
            @card-function-label-box-h: 5rem;
            @card-function-label-fontSize: 1.5rem;
            .card-com-body{
                padding-left: 0px;
                background: #000;
                color: #fff;
                display: flex;
                align-items: center;
                .card-function{
                    width: 100%;
                    display: flex;
                    .card-function-label-box{
                        width: @card-function-label-box-w;
                        height: @card-function-label-box-h;
                        background: #545557;
                        line-height: @card-function-label-box-h;
                        text-align: left;
                        padding-left: 1.2rem;
                        .txt{
                            font-size: @card-function-label-fontSize;
                        }
                    }
                    .card-function-label-word{
                        width: @card-function-label-box-h;
                        height: @card-function-label-box-h;
                        margin-left: calc(0rem - @card-function-label-box-h / 2);
                        border-radius: 50%;
                        background: #545557;
                        padding: 0.3rem;
                        .card-function-label-word-body{
                            border: 0.35rem solid #ED7665;
                            width: 100%;
                            height: 100%;
                            border-radius: 50%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            .txt{
                                font-size: @card-function-label-fontSize;
                            }
                        }
                    }
                }
            }
            .card-logo{
                img{
                    width: 4.5rem;
                }
            }
        }
    }
</style>