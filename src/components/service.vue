<template>
    <div class="service">
      <el-dialog
        :title="$t('微信扫一扫添加客服微信')"
        :visible="dialogVisible"
        :before-close="handleClose"
        width="25.5rem"
        >
        <div class="wechat-username">{{ $t('微信号') }}：<span>golaxy_xingzhen2</span></div>
        <div class="service-wechat-img">
        </div>
      </el-dialog>
    </div>
</template>

<script>
export default {
	name: 'pageOl',
	data () {
		return {
			dialogVisible: false
		}
	},
	methods:{
		handleClose(done) {
		this.dialogVisible = false
		},
		open(){
		this.dialogVisible = true
		}
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
.service{
    .el-dialog__wrapper{
      z-index: @serviceZIndex;
    }
    .service-wechat-img{
        background: url('@{assetsUrl}serviceKF.png') no-repeat;
        background-size: 100% 100%;
        width: 15rem;
        height: 15rem;
        margin: 0px auto;
    }
    .wechat-username{
        text-align: center;
        span{
            font-size: 0.9rem;
        }
    }
}
</style>
