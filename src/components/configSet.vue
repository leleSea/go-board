<template>
    <div class="config-set">
        <el-dialog
        class="config-set-dia"
        title="选择配置"
        :visible="configSetActive"
        width="50%"
        :before-close="configOff">
            <!-- <div class="discount-box" v-if="cardRemainNow && cardRemainNow.discounts">
                <el-tag color="#c51818">所有配置享受{{cardRemainNow.discounts | discount}}折优惠</el-tag>
            </div> -->
            <el-row :gutter="15" class="config-set-box" v-for="(s, k) in lists" :key="k">
                <div class="plan-type">{{s.name}}</div>
                <el-col v-for="(v, i) in s.planList" :key="v.id" :span="6" class="config-set-box-item" 
                :class="v.status==0?'enable':(v.id==active?'active':'')" >
                    <el-tooltip class="item" effect="dark" placement="top" popper-class="index-pro-tooltip" :disabled="v.available.active || v.available.type != 1">
                        <div class="a2-item-tooltip" slot="content">{{v.planRole.txt}}</div>
                        <div class="config-set-box-item-body" @click="configSet(v.index, s.index)" :class="v.available.css" @mouseenter="configEnter(v.index, s.index)">
                            <div class="config-it a">
                                <h4 class="title" v-text="v.name"></h4>
                                <p class="intro" v-text="v.description"></p>
                            </div>
                            <div class="config-it b">
                                <span v-if="!cardRemainNow || cardRemainNow.gpuPlanId != v.id">
                                    ￥
                                    <span class="or-price" :class="{'delete': cardRemainNow && cardRemainNow.discounts}">
                                        <span> </span>
                                        <span>{{v.price}}</span>
                                        <span> </span>
                                    </span>
                                    <span class="real-price" v-if="cardRemainNow && cardRemainNow.discounts">{{v.price * cardRemainNow.discounts | tofixed4}}</span>
                                    /分钟
                                </span>
                                <span v-if="cardRemainNow && cardRemainNow.gpuPlanId == v.id">
                                    剩余时长：{{cardRemainNow.remainTime}}分钟
                                </span>
                            </div>
                            <div class="config-it c" :class="v.available.txtCss">{{v.available.txt}}</div>
                            <!-- <div class="plan-role">
                                <div class="plan-role-txt">{{v.planRole.txt}}</div>
                            </div> -->
                        </div>
                    </el-tooltip>
                </el-col>
            </el-row>
            <div class="jar-box">
                
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="text" @click="getMoreJar" v-show="activePlan && !activePlan.available.active && activePlan.available.type == 1">获取更高权限</el-button>
                <el-button @click="configOff()">取 消</el-button>
                <el-button type="primary" @click="confirmSet()">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog
        title=""
        class="jar-intro-box"
        :visible="jarIntro.active"
        width="50%"
        :before-close="JarIntroOff">
            <div class="jar-intro">
                <h2 class="jar-intro-txt">根据您近12个月的累计充值金额，确定会员等级，可解锁更多配置。</h2>
                <div class="step-content-table">
                    <el-table border :data="jarIntro.data.table" style="width: 100%">
                        <el-table-column v-for="(t, l) in jarIntro.data.tableTitle" :key="l" :prop="l" :label="t"></el-table-column>
                    </el-table>
                </div>
                <div class="jar-intro-btn">
                    <el-button type="text">获取更高权限</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import http from '../http.js'

export default {
    name: 'configSet',
    data(){
        return {
            cardRemainNow: {},
            activePlan: null,
            jarIntro: {
                active: false,
                data: {
                    table: []
                }
            },
            lockConfigId: 3,
            lists: [
                // {name: '专业版', intro: '使用1GPU算力', price: '15/小时', status: 1, id: 0},
                // {name: '专业版', intro: '使用1GPU算力', price: '15/小时', status: 1, id: 1},
                // {name: '专业版', intro: '使用1GPU算力', price: '15/小时', status: 1, id: 2},
            ],
            active: null,
            http: new http('/userApi'),
            configSetActive: false
        }
    },
    // props: {
    //     configSetActive: Boolean
    // },
    methods: {
        configOff(){
            this.configSetActive = false
        },
        configSetOn(data){
            this.userCardRemainInit()
            .then(res => {
                this.initList(data)
                this.configSetActive = true
            })
            
        },
        async userCardRemainInit(){
            this.LOADING.open()
            let res = await this.GLOBAL.cardPlanRemain()
            if(res && res.code == 0){
                this.cardRemainNow = res.data
            }
            this.LOADING.close()
        },
        planDisabled(){
            this.GLOBAL.MessageOpen({
                message: this.GLOBAL.__ERRORMSGDEFINE.errorMsg.gpu_plans.disabled
            })
        },
        JarIntroOn(){
            let path = this.GLOBAL.assetsUrl + '/txt/productIntro.json'
            this.GLOBAL.getStaticData(path)
            .then(res => {
                let data = this.getJarTable(res)
                this.jarIntro.data = data
                this.jarIntro.active = true
            })
        },
        JarIntroOff(){
            this.jarIntro.active = false
        },
        getJarTable(data){
            return data.content[data.content.length - 1].content[data.content[data.content.length - 1].content.length - 1]
        },
        confirmSet(){
            if(!this.activePlan.available.active){
                this.planDisabled(this.activePlan)
                return
            }
            let options = {
                url: '/engines',
                timeout: 20000,
                data: {
                    plan_id: this.active
                }
            }
            
            this.request('engine', options)
            .then(res => {
                // if(!res || res.code != 0){
                //     this.GLOBAL.resendCode('engine', options, 2)
                //     .then(res => {
                //     })
                // }else{
                    
                // }
                this.$emit('confirmSet', {
                    res: res,
                    enginePlan: this.lists[this.indexP].planList[this.index]
                })
            })
        },
        configEnter(index, indexP){
            let plan = this.lists[indexP].planList[index]
            if(plan.available.active || plan.available.type != 1 ) return
        },
        configSet(index, indexP){
            let plan = this.lists[indexP].planList[index]
            if(!plan.available.active && plan.available.type != 1){
                this.unavailableHandle(plan)
                return
            }
            let id = plan.id
            this.active = id;
            this.activePlan = plan
            this.index = index
            this.indexP = indexP
        },
        unavailableHandle(plan){
            if(plan.available.active) return
            if(plan.available.type == 1){
                this.JarIntroOn()
            }
        },
        submit(){
            let options = {
                url: '/engines',
                msgKey: 'setEngines',
                data: {
                    plan_id: this.active
                }
            }
            this.request('engine', options)
            .then(res => {
            })
        },


        async request(type, options){
            // if(!this.GLOBAL.checkEnterEngineTime()) return
            let loading = this.$loading({
                background: 'rgba(0, 0, 0, 0.7)'
            });
            let res = await this.http.request(type, options)
            // this.errHandle(res, options)
            loading.close()
            return res
        },
        errHandle(res, options){
            if(options.noMsg) return
            let code = Number(res.code)
            let txt = res.errorMsg;
            let type = code != 0 ? 'error' : 'success';
            this.$message({
                type: type,
                message: txt,
                duration: 3000,
                showClose: true
            })
        },
        
        pageInit(){
            this.request('engine', {
                url: '/gpu/plans',
                method: 'GET',
                noMsg: true
            }).then(res => {
                try{
                    res.data = JSON.parse(res.data)
                }catch(e){}
                // this.lists = res.data
                this.initList(res.data)
            })
        },
        initList(list){
            let data = [], type, j = 0, i = 0, listCopy = this.GLOBAL.copy(list), k = 0
            let config = false
            let planRole = this.GLOBAL.deepCopy(this.GLOBAL.planRole)
            while(j <= list.length - 1){
                type = list[j].planType
                i = j
                data.push({
                    name: this.GLOBAL.planType[type].name,
                    planList: [],
                })
                data[data.length - 1].index = data.length - 1
                for(i = j; i < list.length; i++){
                    if(list[i].planType == type){
                        // list[i].index = i
                        if(list[i].available){
                            // if(this.active == null){
                            //     this.active = list[i].id
                            //     this.index = i
                            // }
                            list[i].available = {
                                active: true,
                                txt: '当前可用',
                                css: 'available',
                                txtCss: 'available'
                            }
                        }else{
                            let reason = this.GLOBAL.planUnavailableReason(list[i].unavailableReason) || {type: 2, txt: '当前不可用'}
                            list[i].available = {
                                active: false,
                                txt: reason.txt,
                                css: reason.type != 1 ? 'unavailable' : 'available',
                                // css: 'unavailable',
                                type: reason.type,
                                txtCss: 'unavailable'
                            }
                        }
                        list[i].planRole = planRole[list[i].id] || {}
                        data[data.length - 1].planList.push(list[i])
                        data[data.length - 1].planList[data[data.length - 1].planList.length - 1].index = data[data.length - 1].planList.length - 1
                        // if(this.active == null && list[i].available){
                        //     this.active = list[i].id
                        //     this.index = data[data.length - 1].planList[data[data.length - 1].planList.length - 1].index
                        //     this.indexP = data[data.length - 1].index
                        // }
                        // if(list[i].id == this.lockConfigId && list[i].available){
                        //     config = true
                        // }
                        if(this.cardRemainNow && this.cardRemainNow.gpuPlanId && this.cardRemainNow.gpuPlanId == list[i].id && this.cardRemainNow.remainTime > 0 && list[i].available){
                            this.active = list[i].id
                            this.index = data[data.length - 1].planList[data[data.length - 1].planList.length - 1].index
                            this.indexP = data[data.length - 1].index
                            this.activePlan = list[i]
                        }
                        if(!this.cardRemainNow || !this.cardRemainNow.gpuPlanId){
                            if(list[i].available.active && list[i].id <= this.lockConfigId){
                                this.active = list[i].id
                                this.index = data[data.length - 1].planList[data[data.length - 1].planList.length - 1].index
                                this.indexP = data[data.length - 1].index
                                this.activePlan = list[i]
                            }
                        }
                        
                    }else{
                        break
                    }
                }
                j = i
            }
            // if(config) this.active = this.lockConfigId
            this.lists = data

            // for(var i in list){
            //     list[i].index = i
            //     if(list[i].available){
            //         if(this.active == null){
            //             this.active = list[i].id
            //             this.index = i
            //         }
            //         list[i].available = {
            //             active: true,
            //             txt: '当前可用',
            //             css: 'available'
            //         }
            //     }else{
            //         list[i].available = {
            //             active: false,
            //             txt: '当前不可用',
            //             css: 'unavailable'
            //         }
            //     }
            // }
            // this.lists = list
        },
        getMoreJar(){
            this.GLOBAL.jumpToPageNew('recharge')
        },
    },
    created(){
        // this.pageInit()
    }
}
</script>

<style lang="less">
    .config-set{
        .el-dialog__header{
            padding: 0.5rem 0px;
        }
        .el-dialog__body{
            padding: 0px 1rem;
        }
        .el-dialog{
            border-radius: 0px;
        }
        .config-set-box:first-child{
            .plan-type{
                padding-top: 0px;
            }
        }
        .config-set-box{
            margin: 0px !important;
            overflow: hidden;
            .config-set-box-item{
                margin-bottom: 0.5rem;
                padding: 0px 0.35rem !important;
                .config-set-box-item-body.unavailable{
                    opacity: 0.6;
                    cursor: not-allowed;
                    border: 1px solid #ddd;
                    color: #333;
                    .config-it{
                        border-bottom: 1px solid #ddd;
                    }
                }
                .config-set-box-item-body{
                    position: relative;
                    cursor: pointer;
                    border: 1px solid #0041B6;
                    color: #0041B6;
                    text-align: center;
                    // border-radius: 0.25rem;
                    .config-it.b{
                        .or-price.delete{
                            text-decoration: line-through;
                        }
                        .real-price{
                            color: #c51818;
                            margin-left: 0.3rem;
                        }
                    }
                    .config-it{
                        .intro{
                            font-size: 0.6rem;
                            color: #999;
                        }
                        border-bottom: 1px solid #0041B6;
                        padding: 0.5rem 0px;
                    }
                    .config-it:last-child{
                        border:0;
                    }
                    .b{
                        // color: #f83838;
                    }
                    .c{
                        font-size: 0.7rem;
                    }
                    .c.available{
                        // color: #3BD044;
                        // color: #21DB5F;
                        color: #03A60E;
                    }
                    .c.unavailable{
                        // color: #ddd;
                        color: red;
                    }
                }
                .plan-role{
                    position: absolute;
                    min-height: 1.5rem;
                    width: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    top: -2rem;
                    left: 0px;
                    
                    .plan-role-txt{
                        padding: 0.2rem 0.5rem;
                        height: 100%;
                        display: flex;
                        align-items: center;
                        color: #fff;
                        background: rgba(69, 104, 149, 0.8);
                    }
                }
            }
            .plan-type{
                padding: 0.5px 0.35rem 0.5rem;
                font-size: 1rem;
                font-weight: 600;
                text-align: left;
            }
            .config-set-box-item.enable{
                color: #ddd;
                .b{
                    color: #ddd;
                }
            }
            .config-set-box-item.active{
                .config-set-box-item-body{
                    .it{
                        border-bottom: 1px solid #ddd;
                    }
                    .it:last-child{
                        border:0;
                    }
                    // background: #336CD3;
                    background: #0041B6;
                    color: #fff;
                }
                .c.available{
                    // color: #1AFA64;
                    color: #37FF10;
                }
            }
        }
        .dialog-footer{
            button{
                width: 6rem;
                height: 1.84rem;
                border-radius: 0px;
                padding: 0px;
            }
        }
        .jar-intro-box{
            .el-dialog{
                padding: 1rem;
                .jar-intro-txt{
                    text-align: left;
                    font-size: 1rem;
                    margin-bottom: 1rem;
                }
                .jar-intro-btn{
                    text-align: right;
                    margin-top: 1rem;
                    .el-button{
                        padding: 0px;
                    }
                }
            }
            
        }
        .discount-box{
            // color: #c51818;
            width: 100%;
            text-align: center;
            .el-tag{
                color: #fff;
                font-size: 0.7rem;
                border: 0px;
            }
        }
    }
</style>


