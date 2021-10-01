<template>
    <div class="wechatpay-window pay-window">
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
            <div class="wechat-pay-window-body">
                <!-- <h1 class="le-confirm-title">
                    <span class="txt visibility-hidden">打开微信扫一扫</span>
                    <span class="close-icon el-icon-close" @click="handleClose"></span>
                </h1> -->
                <div class="le-confirm-content">
                    <div class="pay-type-head">
                        <div class="head-icon">
                            <img :src="`${GLOBAL.assetsUrl}/img/pay_icon_wx.png`" alt="">
                        </div>
                        <div class="head-txt">
                            <span class="txt">{{ $t('微信扫码支付') }}</span>
                        </div>
                    </div>
                    <div class="QRcode" id="Qrcode" 
                    v-loading="loading" 
                    element-loading-background="rgba(0, 0, 0, 0.0)"
                    element-loading-spinner="page-loading-icon-css light"></div>
                    <div class="pay-notice">
                        {{ $t('微信扫码到账时间可能会有延迟,如有任何问题，请咨询支付') }}<el-button class="notice-btn" @click="service" type="text">{{ $t('客服') }}</el-button>
                    </div>
                </div>
                <div class="le-confirm-foot">
                    <el-button class="le-confirm-btn confirm store-button-bcg" @click="completePay">{{ $t('已完成支付') }}</el-button>
                    <el-button class="le-confirm-btn cancel cancel-login-register-button-bcg" @click="cancelPay">{{ $t('取消支付') }}</el-button>
                </div>
            </div>
        <!-- <div class="status-dialog">
            <h1 class="window-title">打开微信扫一扫</h1>
            <div class="QRcode" id="Qrcode" v-loading="loading" element-loading-background="rgba(0, 0, 0, 0.0)"></div>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button class="status-btn a1" type="primary" @click="completePay">已完成支付</el-button>
            <el-button class="status-btn a2" @click="cancelPay">取消支付</el-button>
            <div class="pay-notice">
                 到账时间可能会有延迟,如有任何问题，请咨询<el-button class="notice-btn" @click="service" type="text">客服</el-button>
            </div>
        </span> -->
      </el-dialog>
    </div>
</template>

<script>
import QRCode from 'qrcodejs2'
export default {
    name: 'payStatusSelect',
    data () {
        return {
            qrcodeUrl: 'weixin://wxpay/bizpayurl?pr=Rmp3mNk',
            dialogVisible: false,
            type: null,
            autoClose: false,
            loading: true
            // qrcode: new QRCode()
        }
    },
    methods:{
        service(){
            // this.$emit('takeFun', {
            //     fun: 'service'
            // })
            this.GLOBAL.service.open()
        },
        handleClose(){
            this.loading = true
            this.dialogVisible = false
        },
        turnOn(data){
            console.log(data)
            this.dialogVisible = true
            // this.clearHtml()
            setTimeout(() => {
                this.qrcodeHandle(data)
                this.loading = false
            }, 1000)
        },
        clearHtml(){
            // document.querySelector("#Qrcode").innerHTML = ''

        },
        cancelPay(){
            this.handleClose()
            this.$emit('takeFun', {
                fun: 'cancelPay'
            })
            this.$emit('cancel')
        },
        completePay(){
            this.handleClose()
            this.$emit('takeFun', {
                fun: 'completePay'
            })
            this.$emit('complete')
        },
        qrcodeHandle(data){
            data = data || this.qrcodeUrl
            this.qrcode = new QRCode('Qrcode', {
                width: 500,
                height: 500,
                text: data,
            })
        },
    },
  created(){

  }
}
</script>
<style lang='less' src="../views/recharge/payWindow.less"></style>

<!-- Add "scoped" attribute to limit CSS to this component only -->
// <style lang="less">
//     .wechatpay-window{
//         .el-dialog__header{
//             padding: 0px;
//         }
//         .el-dialog__body{
//             padding: 2rem 0px;
//         }
//         .status-btn.a1{
//             margin-right: 2rem;
//         }
//         .status-btn{
//             padding: 0px;
//             width: 5rem;
//             height: 1.55rem;
//         }
//         .window-title{
//             font-size: 1rem;
//             margin-bottom: 1rem;
//         }
//         .QRcode{
//             width: 9rem;
//             height: 9rem;
//             margin: 0px auto;
//             img{
//                 width: 100%;
//                 height: 100%;
//             }
//         }
//         .pay-notice{
//             padding: 1rem 0px;
//         }
//         .el-dialog__footer{
//             text-align: center;
//             .pay-notice{
//                 font-size: 0.6rem;
//                 color: #999;
//                 .el-button{
//                     padding: 0px;
//                     span{
//                         font-size: 0.6rem;
//                     }
                    
//                 }
//             }
//         }
//         .le-confirm-content{
//             padding: 0px;
//             // padding: 2rem 0px 0rem;
//             .pay-type-head{
//                 display: flex;
//                 justify-content: center;
//                 align-items: center;
//                 width: 100%;
//                 padding-bottom: 1rem;
//                 .head-icon{
//                     margin-right: 0.7rem;
//                     img{
//                         width: 2.5rem;
//                     }
//                 }
//                 .txt{
//                     font-size: 1.2rem;
//                 }
//             }
//         }
//         .le-confirm-foot{
//             // padding: 0.5rem 0px;
//             // padding-bottom: 0.8rem;
//             padding: 0px;
//             display: flex;
//             align-items: center;
//             justify-content: center;
//             .el-button:last-child{
//                 margin: 0px;
//             }
//             .el-button.cancel{
//                 // background: #C0C0C0;
//                 // color: #6C6C6C;
//             }
//             .el-button.confirm{
//                 // background: #416692;
//                 // color: #fff;
//             }
//             .el-button{
//                 margin: 0px;
//                 display: flex;
//                 justify-content: center;
//                 align-items: center;
//                 padding: 0px;
//                 // background: #416692;
//                 // color: #333;
//                 width: 6rem;
//                 height: 1.6rem;
//                 margin-right: 1rem;
//             }
//         }
//     }

// </style>
