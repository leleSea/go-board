<template>
    <div class="pay-status-select">
        <el-dialog
        :title="type"
        :visible="dialogVisible"
        :before-close="handleClose"
        :close-on-click-modal="autoClose"
        :close-on-press-escape="autoClose"
        :show-close="autoClose"
        width="25.5rem"
        >
            <div class="status-dialog">
                <el-button class="status-btn a1" type="primary" @click="completePay">{{ $t('已完成支付') }}</el-button>
                <el-button class="status-btn a2" @click="cancelPay">{{ $t('取消支付') }}</el-button>
            </div>
            <span slot="footer" class="dialog-footer">
               {{ $t('到账时间可能会有延迟,如有任何问题，请咨询') }}<el-button class="notice-btn" @click="service" type="text">{{ $t('客服') }}</el-button>
            </span>
        </el-dialog>
        <leConfirm ref="leConfirm"></leConfirm>
    </div>
</template>

<script>
export default {
  name: 'payStatusSelect',
  data () {
        return {
            dialogVisible: false,
            type: '支付宝支付',
            autoClose: false
        }
    },
    methods:{
        service(){
            this.$emit('takeFun', {
                fun: 'service'
            })
        },
        handleClose(){
            this.dialogVisible = false
        },
        turnOn(type){
            // this.type = type
            // this.dialogVisible = true
            this.$refs['leConfirm'].open({
                title: `${this.$i18n.t('支付宝支付')}`,
                message: `${this.$i18n.t('到账时间可能会有延迟,如有任何问题，请咨询')}<el-button class="notice-btn-pay-status-service-open" type="text">${this.$i18n.t('客服')}</el-button>`,
                button: [
                    {name: '已完成支付', label: 0, type: 'confirm'},
                    {name: '取消支付', label: 1, type: 'cancel'},
                ]
            }).then(val => {
                let label = val.label
                label == 0 ? this.completePay() : this.cancelPay()
            })
            setTimeout(() => {
                document.querySelector('.notice-btn-pay-status-service-open').addEventListener('click', () => {
                    this.service()
                })
            }, 1000);
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
    },
  created(){

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
.pay-status-select{
    .status-btn.a1{
        margin-right: 2rem;
    }
    .status-btn{
        padding: 0px;
        width: 5rem;
        height: 1.55rem;
    }
    .el-dialog__footer{
        text-align: center;
        .dialog-footer{
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
    .notice-btn-pay-status-service-open{
        cursor: pointer;
        font-size: 0.8rem;
        color: #409EFF;
    }
}

</style>
