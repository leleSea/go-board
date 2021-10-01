<!--  -->
<template>
    <div class='engine-data-config' :class="lang">
        <le-confirm ref="leConfirm">
            <template v-slot:message>
                <div class="engine-data-config-box">
                    <div class="create-lives-body">
                        <div class="lives-info-game-box">
                            <div class="it it-tit">
                                <span class="txt">{{ $t('防发呆提示时间') }}</span>
                            </div>
                            <div class="it it-input it-content">
                                <el-select class="it-select" v-model="engineAutoClose.value"
                                :popper-append-to-body="false" 
                                :popper-class="`lives-select-options`" :placeholder="$t('请选择')">
                                    <el-option
                                    v-for="item in engineAutoClose.data"
                                    :key="item.value"
                                    :label="$t(item.name)"
                                    :value="$t(item.value)">
                                        <span>{{ $t(item.name) }}</span>
                                    </el-option>
                                </el-select>
                            </div>
                        </div>
                        <ul class="live-info-list">
                            <li class="info-item">
                                <div class="it it-tit">
                                <span class="txt">{{ $t('推荐点个数') }}</span>
                                </div>
                                <div class="it it-input it-content">
                                    <el-select class="it-select" v-model="probSelect.value"
                                    :popper-append-to-body="false" 
                                    :popper-class="`lives-select-options`" :placeholder="$t('请选择')">
                                        <el-option
                                        v-for="item in probSelect.data"
                                        :key="item.value"
                                        :label="$t(item.name)"
                                        :value="$t(item.value)">
                                            <span>{{ $t(item.name) }}</span>
                                        </el-option>
                                    </el-select>
                                </div>
                            </li>
                            <li class="info-item">
                                <div class="it it-tit">
                                    <span class="txt">{{ $t('变化图长度') }}</span>
                                </div>
                                <div class="it it-input it-content">
                                    <el-select class="it-select" v-model="branchSelect.value"
                                    :popper-append-to-body="false" 
                                    :popper-class="`lives-select-options`" :placeholder="$t('请选择')">
                                        <el-option
                                        v-for="item in branchSelect.data"
                                        :key="item.value"
                                        :label="$t(item.name)"
                                        :value="$t(item.value)">
                                            <span>{{ $t(item.name) }}</span>
                                        </el-option>
                                    </el-select>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </template>
        </le-confirm>
    </div>
</template>

<script>
    export default {
        name: 'engineDataConfig',
        props: {},
        data() {
            return {
                localKey: 'engineDataConfig',
                engineAutoClose: {
                    data: [],
                    value: null
                },
                branchSelect: {
                    data: [],
                    value: null
                },
                probSelect: {
                    data: [],
                    value: null,
                    response: null
                },
                lang: 'zh'
            };
        },
        methods: {
            open(){
                this.response = null
                let promise = new Promise((success) => {
                    this.dataInit()
                    this.localDataInit()
                    this.response = success
                    this.$refs['leConfirm'].open({
                        autoClose: true,
                        button: [
                            {name: '确定', fun: this.saveData},
                            {name: '取消', fun: this.cancel, type: 'cancel'},
                        ]
                    })
                })
                return promise
            },
            saveData(){
                let data = {}
                let saveData = {
                    engineAutoClose: this.engineAutoClose.value,
                    branchSelect: this.branchSelect.value,
                    probSelect: this.probSelect.value,
                }
                data[this.localKey] = JSON.stringify(saveData)
                this.GLOBAL.setItem(data)
                this.responseData(saveData)
            },
            cancel(){
                this.responseData(false)
            },
            dataInit(){
                this.engineAutoClose.data = this.GLOBAL.deepCopy(this.GLOBAL.engineAutoCloseConfig.select)
                this.branchSelect.data = this.GLOBAL.deepCopy(this.GLOBAL.branchSelectConfig.select)
                this.probSelect.data = this.GLOBAL.deepCopy(this.GLOBAL.probSelectConfig.select)
                this.engineAutoClose.value = this.GLOBAL.deepCopy(this.GLOBAL.engineAutoCloseConfig.value)
                this.branchSelect.value = this.GLOBAL.deepCopy(this.GLOBAL.branchSelectConfig.value)
                this.probSelect.value = this.GLOBAL.deepCopy(this.GLOBAL.probSelectConfig.value)
                return {
                    engineAutoClose: this.engineAutoClose.value,
                    branchSelect: this.branchSelect.value,
                    probSelect: this.probSelect.value,
                }
            },
            localDataInit(){
                let data = this.GLOBAL.getLocalItem(this.localKey) || {}
                try{
                    data = JSON.parse(data)
                }catch(e){}
                this.engineAutoClose.value = data.engineAutoClose || this.GLOBAL.engineAutoCloseConfig.value
                this.branchSelect.value = data.branchSelect || this.GLOBAL.branchSelectConfig.value
                this.probSelect.value = data.probSelect || this.GLOBAL.probSelectConfig.value
                return {
                    engineAutoClose: this.engineAutoClose.value,
                    branchSelect: this.branchSelect.value,
                    probSelect: this.probSelect.value,
                }
            },
            responseData(data){
                if(this.response !== null) this.response(data)
            },
        },
        created() {

        },
        components: {
        },
        computed: {},
        watch: {
            languageLang: {
                handler(val){
                    this.lang = 'zh'
                    try{
                        this.lang = val.i18n.locale
                    }catch(e){}
                },
                deep: true,
                immediate: true
            },
        },
        mounted() {
            // this.open()
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
<style lang='less' >
    .engine-data-config{
        .le-confirm-body{
            width: 35rem;
        }
        .engine-data-config-box{
            .create-lives-body{
                .el-select{
                    width: 100%;
                }
                @itTitW: 6rem;
                @itTitP: 0.3rem;
                padding: 1rem 0px;
                width: 60%;
                margin: 0px auto;
                .error-border{
                    .el-input__inner{
                        // outline: @errorColor solid 1px;
                        border: 1px solid @errorColor;
                    }
                }
                .it.it-tit{
                    width: @itTitW;
                    white-space: nowrap;
                    text-align: right;
                    padding-right: @itTitP;
                } 
                .error-box{
                    position: absolute;
                    bottom: -1rem;
                    left: 0px;
                    color: @errorColor;
                    .txt{
                        font-size: 0.6rem;
                    }
                }
                .it.it-content{
                    position: relative;
                    width: calc(100% - @itTitW);
                    text-align: left;
                    .game-time-select{
                        .el-input__prefix{
                            display: none;
                        }
                    }
                }
                .info-item, .lives-info-game-box{
                    display: flex;
                    align-items: center;
                }
                .el-input__inner{
                    height: 1.3rem;
                    background: none;
                    border: 1px solid #B0B0B0;
                    padding: 0px 0.2rem;
                    font-size: 0.6rem;
                }
                .lives-info-game-box{
                    margin-bottom: 1.5rem;
                    .el-select{
                        width: 100%;
                    }
                }
                .lives-select-options{
                    margin-top: 0.2rem;
                    border-radius: 0px;
                    .popper__arrow{
                        display: none;
                    }
                    .el-select-dropdown__list{
                        background: #eee;
                    }
                }
                .live-info-list{
                    .info-item{
                        margin-bottom: 1.2rem;
                    }
                    .info-item:last-child{
                        margin: 0px;
                    }
                    .info-item.photo{
                        .photo-i.b{
                            justify-content: flex-start;
                            .p-info-i{
                                justify-content: flex-start;
                            }
                        }
                        .photo-i.w{
                            transform: translateX(@itTitP);
                            justify-content: flex-end;
                            .p-info-i{
                                justify-content: flex-end;
                            }
                        }
                        .photo-i{
                            width: 50%;
                            display: flex;
                            .p-img{
                                width: @itTitW;
                                height: @itTitW;
                                padding: @itTitP;
                                .none-photo{
                                    width: 100%;
                                    height: 100%;
                                    border: 1px solid #A6A6A6;
                                    .none-photo-body{
                                        width: 100%;
                                        height: 100%;
                                        border: 1px solid #E9E9E9;
                                        color: #BABABA;
                                        display: flex;
                                        align-items: center;
                                        justify-content: center;
                                    }
                                    .txt{
                                        font-size: 0.6rem;
                                    }
                                }
                                .has-photo{
                                    width: 100%;
                                    height: 100%;
                                    .photo-img{
                                        width: 100%;
                                        height: 100%;
                                    }
                                }
                            }
                            .p-info{
                                width: calc(100% - @itTitW);
                                padding: @itTitP 0px;
                                .p-info-i{
                                    display: flex;
                                    white-space: nowrap;
                                    height: 50%;
                                    .p-info-i-body{
                                        display: flex;
                                        align-items: center;
                                    }
                                    .p-info-t{
                                        margin-right: 0.3rem;
                                    }
                                    .p-info-c{
                                       .el-input__inner{
                                           width: 4rem;
                                       }
                                    }
                                }
                                .p-info-i:first-child{
                                    align-items: flex-start;
                                }
                                .p-info-i:last-child{
                                    align-items: flex-end;
                                }
                            }
                        }
                    }
                    .info-item.plan{
                        .plan-i{
                            display: flex;
                            align-items: center;
                            width: 50%;
                            .plan-i-t{
                                text-align: right;
                                width: @itTitW;
                                padding: @itTitP;
                                white-space: nowrap;
                            }
                            .plan-i-t.s, .plan-i-c.s{
                                width: auto;
                            }
                            .plan-i-c{
                                width: calc(100% - @itTitW);
                                .el-input__inner{
                                    width: 5rem;
                                }
                            }
                        }
                        .plan-i.a{
                            .plan-i-c{
                                text-align: left;
                            }
                        }
                        .plan-i.b{
                            justify-content: flex-end;
                            .plan-i-c{
                                text-align: right;
                            }
                        }
                    }
                }
            }
        }
    }
    .engine-data-config.en{
        .engine-data-config-box{
            .create-lives-body{
                width: 80%;
            }
            .create-lives-body{
                .it.it-tit{
                    width: 13rem;
                }
                .it.it-content{
                    width: calc(100% - 13rem);
                }
            }
        }
    }
    .engine-data-config.ko{
        .engine-data-config-box{
            .create-lives-body{
                .it.it-tit{
                    width: 8rem;
                }
                .it.it-content{
                    width: calc(100% - 8rem);
                }
            }
        }
    }
</style>