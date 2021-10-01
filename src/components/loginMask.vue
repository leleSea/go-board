<!--  -->
<template>
    <div class='login-mask'>
        <el-dialog
        :visible.sync="active"
        :show-close="false"
        width="55.25rem"
        :before-close="close">
            <loginCom ref="loginCom" :to.sync="to" :from.sync="from" @close="close">
                 <template v-slot:extend>
                    <span @click="close" class="panel-close el-icon-close"></span>
                </template>
            </loginCom>
        </el-dialog>
    </div>
</template>

<script>
    import loginCom from './loginCom.vue'
    export default {
        name: 'loginMask',
        props: {
        },
        data() {
            return {
                to: null,
                from: null,
                active: false
            };
        },
        methods: {
            close(){
                this.active = false
            },
            open(query){
                let promise = new Promise((res) => {
                    this.to = null
                    this.from = null
                    query = query || {}
                    this.to = query.to
                    this.from = query.from
                    this.active = true
                    this.$nextTick(() => {
                        this.$refs['loginCom'].setCallback(() => {
                            res(true)
                        })
                    })
                })
                return promise
            },
        },
        created() {
        },
        components: {
            loginCom
        },
        computed: {},
        watch: {
            active(){
            }
        },
        mounted() {

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
    .login-mask{
        .panel-close{
            font-size: 1rem;
            color: #333;
            right: 0.5rem;
            top: 0.5rem;
            position: absolute;
            z-index: 2;
            font-weight: bold;
            cursor: pointer;
        }
        .el-dialog{
            box-shadow: none;
            background: none;
        }
        .el-dialog__header{
            padding: 0px;
        }
        .el-dialog__body{
            padding: 0px;
        }
    }
</style>