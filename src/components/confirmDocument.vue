<!--  -->
<template>
   <div class='agreement'>
       <div class='page-content-web'>
           <div class="ol-body">
               <h1 class="page-title">{{$t(pageTitle)}}</h1>
               <div class="ol-content">
                   <div class="ol-item" :id="v.id" v-for="(v, i) in list" :key="i">
                       <h2 class="step-title">{{$t(v.title)}}</h2>
                       <div class="step-content" v-for="(n, j) in v.content" :key="j">
                           <h3 class="step-content-subtitle" v-if="isSubtitle(n)" v-html="$t(n.title)"></h3>
                           <p class="step-content-txt" v-if="isString(n)" v-html="$t(n)"></p>
                           <div class="step-content-img" v-if="isImg(n)">
                               <div class="img-item" v-for="(s, k) in n" :key="k">
                                   <img :src="`${GLOBAL.assetsUrl}/img/${s.name}`" >
                                   <!-- {{s.name}} -->
                                   <p class="img-title" v-if="s.title" v-html="$t(s.title)"></p>
                               </div>
                           </div>
                           <div class="step-content-table" v-if="isTable(n)">
                                <el-table border :data="n.table" style="width: 100%">
                                    <el-table-column v-for="(t, l) in n.tableTitle" :key="l" :prop="l" :label="$t(t)"></el-table-column>
                                </el-table>
                            </div>
                            <ul class="step-content-table" v-if="isSubContent(n)">
                                <li class="step-content-txt" v-for="(ic, ii) in n.subContent" :key="ii" v-html="$t(ic)"></li>
                            </ul>
                            <ul class="step-content-txt log" v-if="isLog(n)">
                                <!-- <li v-for="(x, z) in n.log" :key="z">
                                    <router-link :to="x.link">{{x.version}}</router-link>
                                </li> -->
                                <el-table border :data="n.log" style="width: 100%" @row-click="logOpen" row-class-name="log-table-row">
                                    <el-table-column v-for="(t, l) in n.logTitle" :key="l" :prop="l" :label="$t(t)">
                                        <template slot-scope="a">
                                            <!-- <span class="txt link" v-if="l == 'version'" @click="jumpToPageNew(a.row['link'])">{{a.row[l]}}</span>
                                            <span class="txt" v-else>{{a.row[l]}}</span> -->
                                            <span class="txt">{{$t(a.row[l])}}</span>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </ul>
                       </div>
                   </div>
               </div>
           </div>
       </div>
       <!-- <div class="page-sidebar">
            <ul>
                <li v-for="(v, i) in elementPos" :key="i" :class="{'active': active == v.id}" @click="scrollToHash(v.path)">{{v.name}}</li>
                <li class="back-top" @click="backToTop">
                    <div class="back-icon"></div>
                </li>
            </ul>
        </div> -->
   </div>
</template>

<script>
    export default {
        name: 'agreement',
        props: {
            filePath: String
        },
        data() {
            return {
                pageTitle: '',
                active: null,
                elementPos: [],
                list: []
            };
        },
        methods: {
            isString(obj){
                return this.GLOBAL.isString(obj)
            },
            isSubtitle(obj){
                return this.GLOBAL.isObject(obj) && obj.title
            },
            isImg(obj){
                return this.GLOBAL.isArray(obj)
            },
            isTable(obj){
                return this.GLOBAL.isObject(obj) && obj.table
            },
            isLog(obj){
                return this.GLOBAL.isObject(obj) && obj.log
            },
            isSubContent(obj){
                return this.GLOBAL.isObject(obj) && obj.subContent
            },
            listHandle(list){
                let elementPos = []
                for(var i in list){
                    let ele = document.getElementById(list[i].id)
                    if(!ele) continue
                    elementPos.push({
                        offsetTop: ele.offsetTop,
                        id: list[i].id,
                        name: list[i].title,
                        path: '/productIntro#' + list[i].id,
                    })
                }
                this.elementPos = elementPos
                this.active = elementPos[0].id
                
            },
            backToTop(){
                document.body.scrollTop = 0
                document.documentElement.scrollTop = 0;
                this.active = this.elementPos[0].id
            },
            scrollToHash(hash){
                this.GLOBAL.jumpToPage(hash)
            },
            onscroll(e){
                let y = window.scrollY
                let fontSize = this.GLOBAL.htmlFontSize
                let webHeadHeight = this.GLOBAL.webHeadHeight
                this.elementPos.forEach((item, index) => {
                    if (y > item.offsetTop - 50) {
                        this.active = item.id
                    }
                })
            },
            pageInit(){
                // window.addEventListener("scroll", this.onscroll);

                if(!this.filePath) return
                this.LOADING.open()
                let path = this.filePath
                this.GLOBAL.getStaticData(path)
                .then(res => {
                    this.list = res.content;
                    this.pageTitle = res.title
                    setTimeout(() => {
                        this.listHandle(this.list)
                    }, 500)
                    this.LOADING.close()
                })
            },
            jumpToPageNew(path){
                this.GLOBAL.jumpToPageNew(path)
            },
            logOpen(row){
                if(!row || !row.link) return
                this.jumpToPageNew(row.link)
                
            },
        },
        created() {
            this.pageInit()
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
<style lang='less' >
    .agreement{
        @stepMargin: 10rem;
        .ol-body{
            padding: 1rem 0px;
            width: 50rem;
            margin: 0px auto;
            .page-title{
                font-size: 1.5rem;
            }
            .ol-content{
                 text-align: left;
                 .ol-item{
                     margin-bottom: 1rem;
                     .step-title{
                        font-size: @firstTitleSize;
                        margin-bottom: @firstTitleMargin;
                    }
                    .step-content-txt{
                        line-height: @contentLineHeight;
                        text-indent: 1.5rem;
                    }
                    .step-content-txt.log{
                        .link{
                            cursor: pointer;
                        }
                        .link:hover{
                            color: #5E8BC4;
                        }
                        .log-table-row{
                            cursor: pointer;
                        }
                    }
                    .step-content-subtitle{
                        font-size: @secondTitleSize;
                        margin-bottom: @secondTitleMargin;
                    }
                    .step-content-img{
                        display: flex;
                        justify-content: center;
                        .img-item:last-child{
                            margin: 0px;
                        }
                        .img-item{
                            width: 80%;
                            margin-right: 1rem;
                            img{
                                width: 100%;
                            }
                            .img-title{
                                font-size: 0.6rem;
                                text-align: center;
                                color: #666;
                            }
                        }
                    }
                    .step-content-table{
                        padding: 0.5rem;
                        .el-table{
                            th.gutter {
                                display: table-cell !important;
                            }
                            th{
                                // border-top: 1px solid #EBEEF5;
                            }
                            .cell{
                                font-size: 0.6rem;
                            }
                        }
                    }
                 }
            }
        }
        .page-sidebar{
            position: fixed;
            left: 2rem;
            height: 10rem;
            top: 0px;
            bottom: 0px;
            margin: auto;
            li.active{
                color: #5E8BC4;
            }
            li{
                cursor: pointer;
                height: 2rem;
                display: flex;
                align-items: center;
                border-bottom: 1px solid #ddd;
                color: #666;
                font-size: 0.8rem;
                font-weight: bold;
            }
            li:last-child{
                border: 0px;
            }
            li.back-top{
                margin: 0.5rem auto;
                width: 2rem;
                height: 2rem;
                border-radius: 50%;
                padding: 0.3rem;
                background: #5E8BC4;
                box-sizing: border-box;
                .back-icon{
                    width: 100%;
                    height: 100%;
                    background: url('@{assetsUrl}w11.png') no-repeat;
                    background-size: 100% 100%;
                }
            }
        }
    }
</style>