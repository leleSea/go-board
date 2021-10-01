<!--  -->
<template>
    <div class='page-share'>
        <el-dialog
        :title="type"
        :visible="dialogVisible"
        :before-close="handleClose"
        :close-on-click-modal="autoClose"
        :close-on-press-escape="autoClose"
        :show-close="autoClose"
        :destroy-on-close="true"
        width="30rem"
        >
            <div class="wechat-pay-window-body le-confirm-body">
                <h1 class="le-confirm-title">
                    <span class="txt">{{ $t('打开微信扫一扫') }}</span>
                    <span @click="handleClose" class="close-icon el-icon-close"></span>
                </h1>
                <div class="le-confirm-content">
                    <div class="QRcode" id="Qrcode" 
                    v-loading="loading" 
                    element-loading-background="rgba(0, 0, 0, 0.0)"
                    element-loading-spinner="page-loading-icon-css"></div>
                    <!-- <div class="pay-notice">
                        到账时间可能会有延迟,如有任何问题，请咨询<el-button class="notice-btn" @click="service" type="text">客服</el-button>
                    </div> -->
                </div>
                <!-- <div class="le-confirm-foot">
                    <el-button class="le-confirm-btn">已完成支付</el-button>
                    <el-button class="le-confirm-btn cancel">取消支付</el-button>
                </div> -->
            </div>
      </el-dialog>
    </div>
</template>

<script>
    import QRCode from 'qrcodejs2'
    export default {
        name: 'pageShare',
        props: {
            modal: Boolean
        },
        data() {
            return {
                type: null,
                dialogVisible: false,
                autoClose: false,
                qrcodeUrl: null,
                loading: true,
            };
        },
        methods: {
            qrcodeHandle(data){
                data = data || this.qrcodeUrl
                this.qrcode = new QRCode('Qrcode', {
                    width: 500,
                    height: 500,
                    text: data,
                })
            },
            handleClose(){
                this.loading = true
                this.dialogVisible = false
            },
            turnOn(data){
                this.dialogVisible = true
                setTimeout(() => {
                    this.qrcodeHandle(data)
                    this.loading = false
                }, 1000)
            },
        },
        created() {
        },
        components: {
        },
        computed: {},
        watch: {},
        mounted() {
            // let url = 'https://www.19x19.com/report_mobile/750'
            // let url = 'http://172.26.163.1:8081/report_mobile/750'
            // this.turnOn(url)
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
    .page-share{
        .el-dialog__header{
            padding: 0px;
        }
        .el-dialog__body{
            padding: 0px;
        }
        .status-btn.a1{
            margin-right: 2rem;
        }
        .status-btn{
            padding: 0px;
            width: 5rem;
            height: 1.55rem;
        }
        .window-title{
            font-size: 1rem;
            margin-bottom: 1rem;
        }
        .QRcode{
            width: 12rem;
            height: 12rem;
            margin: 0px auto;
            img{
                width: 100%;
                height: 100%;
            }
        }
        .el-dialog__footer{
            text-align: center;
            .pay-notice{
                font-size: 0.6rem;
                color: #999;
                .el-button{
                    padding: 0px;
                    span{
                        font-size: 0.6rem;
                    }
                    
                }
            }
        }
        .le-confirm-content{
            // padding: 
        }
    }
</style>