<!--  -->
<template>
    <div class='ready-page'>
        <el-button class="create-report-btn" @click="funHandle">
            <span class="txt">{{text}}</span>
        </el-button>
    </div>
</template>

<script>
    export default {
        name: '',
        props: {
            text: String,
            fun: String
        },
        data() {
            return {

            };
        },
        methods: {
            funHandle(){
                this.$emit('takeFun', {
                    fun: this.fun,
                })
            }
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
<style lang='less' scoped>
    .ready-page{
        .create-report-btn:active{
            transform: scale(0.99);
        }
        .create-report-btn{
            background: #31A420;
            box-shadow: 0.25rem 0.15rem 0.25rem 0.05rem #100611;
            width: 14rem;
            height: 4rem;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 0px;
            .txt{
                font-size: 1.9rem;
                color: #fff;
                text-shadow: 0.2rem 0.2rem 0.2rem #002D00;
            }
        }
    }
</style>