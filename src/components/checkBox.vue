<!--  -->
<template>
    <div class='check-box-default'>
        <div class="check-box-body" @click="changeLabel">
            <div class="check-box-label">
                <span class="el-icon-check" v-show="checked"></span>
            </div>
            <div class="check-box-txt">
                <span class="txt">{{$t(txt)}}</span>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: '',
        props: {
            txt: String,
            checked: Boolean,
            fun: String
        },
        data() {
            return {
            };
        },
        methods: {
            changeLabel(){
                this.$emit('takeFun', {
                    fun: this.fun,
                    data: this.checked
                })
                this.$emit('change', this.checked)
            }
        },
        created() {
        },
        components: {
        },
        computed: {
            
        },
        watch: {
        },
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
    .check-box-default{
        @labelSize: 1rem;
        .check-box-body{
            cursor: pointer;
            display: flex;
            align-items: center;
            .check-box-label{
                width: @labelSize;
                height: @labelSize;
                border: 1px solid #fff;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-right: 0.5rem;
            }
            .check-box-txt{
                display: flex;
                align-items: center;
                height: 100%;
            }
        }
    }
</style>