<template>
    <div class="chart">
        <!-- <h1>Echarts</h1> -->
        <div class="chart-body" id="chartBody"></div>
    </div>
</template>

<script>
import echarts from 'echarts'
import { setTimeout } from 'timers';
    export default {
        name: 'chart',
        data(){
            return {
                // chart
            }
        },
        methods: {
            initData(){
                let rdata = {
                    num: []
                }
                rdata.num = [
                    {value: 1, textStyle: {color: 'red'}},
                    {value: 2, textStyle: {color: 'red'}},
                    {value: 3, textStyle: {color: 'red'}},
                    {value: 4, textStyle: {color: 'red'}},
                    {value: 5, textStyle: {color: 'red'}},
                    {value: 6, textStyle: {color: 'red'}}
                ]
                return rdata
            },
            init(callback){
                setTimeout(() =>{
                    this.chart = echarts.init(document.querySelector('.chart .chart-body'))
                    let rdata = this.initData()
                    this.chart.setOption({
                        grid: {  
                            left: '1%',  
                            right: '2%',  
                            bottom: '5%', 
                            containLabel: true  
                        },
                        tooltip: {
                            trigger: 'axis',
                            // formatter:function(v){
                            //     return getNoticeHtml(v)
                            // }
                        },
                        toolbox: {
                            show: true,
                            feature: {
                                dataZoom: {
                                    yAxisIndex: 'none'
                                },
                            }
                        },
                        xAxis: {
                            data: rdata.num,
                            min:'dataMin',
                            max:'dataMax',
                            // axisLabel:{
                            //     interval:labelHandle
                            // },
                            axisTick:{
                                // interval:tickHandle,
                                alignWithLabel:true
                            },
                            nameTextStyle:{
                                padding:[27,0,0,0]
                            }
                        },
                        yAxis: [
                            {
                                // show:ry[0],
                                name: '胜率(%)',
                                min:0,
                                max:100,
                                interval:25,
                                position:'left',
                                nameTextStyle:{
                                    color:'#1fd6d0'
                                },
                                axisLine:{
                                    lineStyle:{
                                        color:'#1fd6d0'
                                    }
                                },
                                splitLine:{
                                    lineStyle:{
                                        color:'#3C4248'
                                    },
                                    show:true
                                },
                            },
                            {
                                // show:ry[1],
                                name: '领先（目）',
                                // min:-aminSpa,
                                // max:aminSpa,
                                position:'right',
                                nameTextStyle:{
                                    color:'#D98542'
                                },
                                axisLine:{
                                    lineStyle:{
                                        color:'#D98542'
                                    }
                                },
                                splitLine:{
                                    lineStyle:{
                                        color:'#3C4248'
                                    },
                                    // show:ry[0]?false:true
                                },
                            }
                        ],
                        // series:chartData
                    });
                    callback()
                }, 500)
            }
        },
        created(){
            this.init(() => {
                this.$emit('takeFun', {
                    fun: 'chatInit'
                })
            })
        }
    }
</script>

<style lang="less" scoped>
    .chart{
        height: 100%;
        .chart-body{
            width: 100%;
            // height: 11.85rem;
            height: 100%;
        }
    }
</style>