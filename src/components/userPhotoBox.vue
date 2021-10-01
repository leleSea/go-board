<!--  -->
<template>
    <div class='user-photo-box'>
        <el-dialog
            title=""
            :visible.sync="active"
            width="40%"
            :before-close="close">
                <div class="user-photo-body">
                    <div class="photo-body-head">
                        <span class="txt">{{ $t('选择头像') }}</span>
                    </div>
                    <div class="photo-body-content">
                        <div class="photo-select-box">
                            <div class="photo-select-box-body">
                                <div class="photo-select-box-txt">
                                    <span class="txt">{{ $t('当前选择：') }}</span>
                                </div>
                                <img :src="`${GLOBAL.assetsUrl}/user_photo/${selectPhoto.value}`" class="photo-img">
                            </div>
                            
                        </div>
                        <div class="photo-list">
                            <el-row>
                                <el-col class="el-col" :xs="8" :sm="8" :md="6" :lg="6" :xl="6" v-for="(v, i) in sysPhotoList" :key="i">
                                    <div class="photo-box" @click="selectPhotoActive(v)" :class="{'active': selectPhoto.value == v.name}">
                                        <img :src="`${GLOBAL.assetsUrl}/user_photo/${v.name}`" class="photo-img">
                                        <img :src="`${GLOBAL.assetsUrl}/img/r4.png`" class="select-icon" v-if="selectPhoto.value == v.name">
                                    </div>
                                </el-col>
                            </el-row>
                        </div>
                    </div>
                    <div class="photo-body-footer">
                        <div class="foot-btn-item">
                            <el-button class="le-button confirm login-register-button-bcg" @click="modifyPhoto">
                                <span class="txt">{{ $t('确认') }}</span>
                            </el-button>
                        </div>
                        <div class="foot-btn-item">
                            <el-button class="le-button cancel-login-register-button-bcg cancel" @click="close">
                                <span class="txt">{{ $t('取消') }}</span>
                            </el-button>
                        </div>
                    </div>
                </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: 'userPhotoBox',
        props: {
            photo: String
        },
        data() {
            return {
                active: false,
                sysPhotoList: this.GLOBAL.user_config.photoList,
                selectPhoto: {
                    value: this.GLOBAL.userPhotoDefault.path
                }
            };
        },
        methods: {
            close(){
                this.active = false
            },
            open(){
                this.selectPhoto.value = this.photoCul
                this.active = true
            },
            selectPhotoActive(val){
                this.selectPhoto.value = val.name
            },
            async modifyPhoto(){
                let val = this.selectPhoto.value
                if(!val || val == this.photo) return this.close()
                this.LOADING.open()
                let res = await this.GLOBAL.modifyPhoto(val)
                if(res && res.code == 0){
                    this.close()
                    this.GLOBAL.MessageOpen({
                        message: '修改成功！',
                        type: 'success'
                    })
                }
                this.LOADING.close()
            },
        },
        created() {
        },
        components: {
        },
        computed: {
            photoCul(){
                return this.photo || this.GLOBAL.userPhotoDefault.path
            }
        },
        watch: {
            photo: {
                handler(val){
                    this.selectPhoto.value = this.photoCul
                },
                immediate: true,
                deep: true
            }
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
    .user-photo-box{
        @boxH: 80vh;
        .photo-img{
            max-width: 5rem;
            border-radius: @photoRadius;
        }
        .el-dialog__wrapper{
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .el-dialog{
            overflow: hidden;
            height: @boxH;
            margin: 0px !important;
            .el-dialog__header{
                padding: 0px;
                // width: 100%;
                // height: 3rem;
                // display: flex;
                // align-items: center;
                // justify-content: center;
            }
            .el-dialog__body{
                padding: 0px;                
                .photo-box{
                    position: relative;
                    padding: 0.5rem 0.3rem;
                    cursor: pointer;
                    .select-icon{
                        position: absolute;
                        bottom: 0.5rem;
                        right: 1rem;
                        width: 1rem;
                    }
                }
                .user-photo-body{
                    height: 100%;
                }
                .photo-body-head{
                    width: 100%;
                    height: 3rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .photo-body-content{
                    padding: 1rem;
                    height: calc(@boxH - 8rem);
                    .photo-list{
                        // height: calc(@boxH - 8rem - 6rem - 2rem);
                        height: calc(100% - 6rem);
                        overflow: auto;
                    }
                }
                .photo-body-footer{
                    width: 100%;
                    height: 5rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    .foot-btn-item{
                        margin-right: 1rem;
                        .le-button{
                            width: 7rem;
                            height: 1.8rem;
                        }
                        .foot-btn-item:last-child{
                            margin: 0px;
                        }
                    }
                }
            }
            .photo-list::-webkit-scrollbar{
                width: 4px;
            }
            .photo-list::-webkit-scrollbar-thumb{
                border-radius: 10px;
                -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
                background: rgba(0,0,0,0.2);
            }
            .photo-list::-webkit-scrollbar-track{
                -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
                border-radius: 0;
                background: rgba(0,0,0,0.1);
            }
        }
        .photo-select-box{
            padding: 0px  0px 1rem;
            .photo-select-box-body{
                display: flex;
                align-items: center;
                justify-content: center;
                .photo-select-box-txt{
                    position: relative;
                    height: 1rem;
                    margin-right: 0.2rem;
                    .txt{
                        position: absolute;
                        right: 0px;
                        bottom: 0px;
                        white-space: nowrap;
                    }
                }
            }
            .photo-img{
                background: @userPhotoBcg;
                padding: 0.3rem;
            }
        }
    }
</style>