<!--  -->
<template>
    <div class='create-situation-folder'>
        <le-confirm ref="createFolder" class="save-engine-data-create-folder">
            <template v-slot:message>
                <div class="create-panel">
                    <div class="create-error" v-if="folderNameDisabled.txt">
                        <span class="txt">{{folderNameDisabled.txt}}</span>
                    </div>
                    <div class="create-panel-body">
                        <div class="create-tit">
                            <span class="txt">{{$t('文件夹名')}}：</span>
                        </div>
                        <div class="create-input">
                            <el-input ref="createFolderInput" v-model="createFolder.name" @keyup.enter.native="createFolderConfirm"></el-input>
                        </div>
                    </div>
                    <div class="create-panel-foot">
                        <el-button class="le-button store-button-bcg" @click="createFolderConfirm" :disabled="folderNameDisabled.disabled" :loading="createFolder.loading">
                            <span class="txt">确定</span>
                        </el-button>
                        <el-button class="le-button cancel-login-register-button-bcg cancel" @click="createFolderOff">
                            <span class="txt">取消</span>
                        </el-button>
                    </div>
                </div>
            </template>
        </le-confirm>
    </div>
</template>

<script>
    export default {
        name: '',
        props: {
            folderList: Array
        },
        data() {
            return {
                createFolder: {
                    name: null,
                    oldName: null,
                    active: false,
                    loading: false
                },
                defaultName: '新建文件夹',
            };
        },
        methods: {
            async createFolderConfirm(){
                if(this.folderNameDisabled.disabled) return
                this.createFolder.loading = true
                let name = this.createFolder.name
                let res = await this.GLOBAL.createStiustionFolder(name)
                if(res && res.code == 0){
                    this.createFolderOff()
                }
                this.$emit('createFolderComplete', res, name)
                this.createFolder.loading = false
            },
            createFolderOff(){
                this.$refs['createFolder'].close()
            },
            open(){
                let name = this.getCreateDefaultName()
                this.createFolder.name = name
                this.createFolder.active = true
                this.$refs['createFolder'].open()
                this.$nextTick(() => {
                    this.focus()
                    this.selectAll()
                })
            },
            focus(){
                let ele = this.$refs['createFolderInput']
                if(!ele) return
                this.$refs['createFolderInput'].focus()
            },
            selectAll(){
                let ele = this.$refs['createFolderInput']
                if(!ele) return
                this.$refs['createFolderInput'].select()
            },
            getCreateDefaultName(){
                let list = this.folderList
                let name = this.defaultName
                let rd = {}
                for(var i in list){
                    rd[list[i]] = true
                }
                if(rd[name] != undefined){
                    for(var i = 1; i >= 1; i++){
                        if(rd[`${name}${i}`] == undefined){
                            name = `${name}${i}`
                            break
                        }
                    }
                }
                return name
            },
        },
        created() {

        },
        components: {
        },
        computed: {
            folderNameDisabled(){
                if(this.createNameISUnavai) return {disabled: true, txt: this.$i18n.t('存在同名文件夹，请重新输入')} 
                let name = this.createFolder.name
                if(!name) return {disabled: true, txt: ''}
                return {disabled: false, txt: ''}
            },
            createNameISUnavai(){
                let name = this.createFolder.name
                let list = this.folderList || []
                let f = false
                for(var i in list){
                    if(list[i] == name){
                        f = true
                        break
                    }
                }
                return f
            },
        },
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
<style lang='less' >
    .create-situation-folder{
        .save-engine-data-create-folder{
            position: absolute;
            .le-confirm-title{
                display: none;
            }
            .le-confirm-body{
                min-width: 0;
                .create-panel{
                    padding: 2rem 1rem 1rem;
                    position: relative;
                    .create-error{
                        position: absolute;
                        top: 0.5rem;
                        left: 0px;
                        width: 100%;
                        text-align: center;
                        color: @errorColor;
                        .txt{
                            font-size: 0.6rem;
                        }
                    }
                    .create-panel-body{
                        display: flex;
                        align-items: center;
                        .create-tit{
                            white-space: nowrap;
                        }
                        .create-input{
                            .el-input__inner{
                                height: 1.5rem;
                            }
                        }
                    }
                }
            }
            .create-panel-foot{
                margin-top: 1rem;
                display: flex;
                justify-content: flex-end;
                .el-button{
                    height: 1.2rem;
                    width: 3rem;
                }
            }
        }
    }
    
</style>