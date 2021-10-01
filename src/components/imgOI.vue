<!--  -->
<template>
    <div class='connector-OI'>
        <el-dialog
            :visible.sync="panelActive"
            width="27rem"
            :top="'auto'"
            :destroy-on-close="true">
            <!-- <div class="connector-dialog-close">
                <span @click="close" class="el-dialog__close-define el-icon el-icon-close"></span>
            </div> -->
            <div class="dialog-content-define">
                <img class="connector-OI-content" :src="`${GLOBAL.assetsUrl}/img/${imgCul}`" alt="">
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: 'imgOI',
        props: {
            img: String
        },
        data() {
            return {
                panelActive: false
            };
        },
        methods: {
            panelCon(){
                this.panelActive ? this.close() : this.open()
            },
            close(){
                this.panelActive = false
            },
            open(){
                this.panelActive = true
            }
        },
        created() {
        },
        components: {
        },
        computed: {
            imgCul(){
                if(!this.img) return 'connector-oi.png'
                return this.img
            }
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
<style lang='less'>
    .connector-OI{
        .el-dialog{
            margin: auto;
            
            height: 80vh;
            position: absolute;
            left: 0px;
            right: 0px;
            top: 0px;
            bottom: 0px;
        }
        .dialog-content-define{
            overflow-y: auto;
            width: 100%;
            height: 100%;
        }
        .connector-dialog-close{
            position: absolute;
            top: 0px;
            left: 0px;
            width: 100%;
        }
        .el-dialog__headerbtn .el-dialog__close{
            font-size: 1.5rem;
        }
        .dialog-content-define::-webkit-scrollbar{
            width: 0.1rem;
        }
        .dialog-content-define::-webkit-scrollbar-thumb{
            border-radius: 10px;
            -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
            background: rgba(0,0,0,0.2);
        }
        .dialog-content-define::-webkit-scrollbar-track{
            -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
            border-radius: 0;
            background: rgba(0,0,0,0.1);
        }
        .el-dialog__body{
            padding: 0px;
            width: 100%;
            height: 100%;
        }
        .el-dialog__header{
            padding: 0px;
        }
        .connector-OI-content{
            width: 100%;
        }
    }
</style>