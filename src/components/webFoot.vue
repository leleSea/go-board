<template>
    <div class="web-foot">
        <!-- <div class="foot-label"></div> -->
        <div class="body">
            <div class="foot-txt">
                <p>{{ $t('©2018-2020 北京深客科技有限公司 版权所有 深客科技 京ICP备19032835号 增值电信业务经营许可证编号：京B-220192143') }}</p>
                <p></p>
                <p></p>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'webFoot',
        data(){
            return {
                // chart
            }
        },
        methods: {
        },
        created(){
        }
    }
</script>

<style lang="less">
    .web-foot{
        width: 100%;
        position: relative;
        // padding-top: 1.5rem;
        height: @webFootHeight;
        // .foot-label{
        //     width: 100%;
        //     height: 1.5rem;
        //     background-size: 100% 100%;
        //     position: absolute;
        //     top: 1px;
        //     left: 0px;
        // }
        .body{
            height: 100%;
            background: #4C5A68;
            display: flex;
            align-items: center;
            justify-content: center;
            .foot-txt{
                line-height: 1rem;
                text-align: center;
                color: #fff;
                p{
                    font-size: @footFontSize;
                }
            }
        }
    }
</style>