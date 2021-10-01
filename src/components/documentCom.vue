<!--  -->
<template>
   <!-- <div class='product-intro  theme-engine-ready-panel-bcg engine-word-page'>
       <div class='document-page-content-web page-box'> -->
           <div class="ol-body">
               <service ref="service"></service>
               <h1 class="page-title" v-if="mainTitleCul" v-html="$t(pageTitle)"></h1>
               <div class="ol-content">
                   <div class="ol-item" :id="v.id" v-for="(v, i) in list" :key="i">
                       <h2 class="step-title" v-html="$t(v.title)"></h2>
                       <div class="step-content" v-for="(n, j) in v.content" :key="j">
                           <h3 class="step-content-subtitle" v-if="isSubtitle(n)" v-html="$t(n.title)"></h3>
                           <p class="step-content-txt" v-if="isString(n)">{{$t(n)}}</p>
                           <div class="step-content-img" v-if="isImg(n)">
                               <div class="img-item" v-for="(s, k) in n" :key="k" :class="s.imgCss">
                                   <p class="img-title top" v-if="s.topTitle" v-html="$t(s.topTitle)"></p>
                                   <!-- <img :src="`${GLOBAL.assetsUrl}/img/${$t(imgNameHandle(s.name))}`"> -->
                                   <img :src="`${GLOBAL.assetsUrl}/img/${$t(s.name)}`">
                                   <!-- {{s.name}} -->
                                   <p class="img-title bottom" v-if="s.title" v-html="$t(s.title)" :class="s.titleCss"></p>
                               </div>
                           </div>
                           <div class="step-content-table" v-if="isTable(n)">
                               <div class="table-set-box" v-if="n.applyFun && applyFunList[n.applyFun]" v-html="applyByFun(n)">
                                   
                               </div>
                               <div class="table-set-box">
                                   <el-table border :data="n.table" style="width: 100%" :span-method="tableCellHandle" :class="n.tableCss">
                                        <el-table-column v-for="(t, l) in n.tableTitle" :key="l" :prop="l" :label="$t(t)" :width="columnWidth(l, n.tableCss)" :min-width="columnMinWidth(l, n.tableCss)">
                                            <template slot-scope="h">
                                                <!-- <span class="document-table-template" v-html="v.row[l]"></span> -->
                                                <span class="document-table-template" v-if="isString(h.row[l])" v-html="$t(h.row[l])"></span>
                                                <span class="document-table-template" v-else v-html="$t(h.row[l].txt)"></span>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                               </div>
                                

                                <!-- <el-table border :data="n.table" style="width: 100%" :span-method="tableCellHandle">
                                    <el-table-column v-for="(t, l) in n.tableTitle" :key="l" :prop="l" :label="t">
                                        <template slot-scope="h">
                                            <span v-if="isString(h.row[l])">{{h.row[l]}}</span>
                                            <span v-else>{{h.row[l].txt}}</span>
                                        </template>
                                    </el-table-column>
                                </el-table> -->

                            </div>
                            <div class="service-box step-content-txt" v-if="isService(n)">
                                <span v-for="(ser, seri) in n.service" :key="seri">
                                    <span v-if="isString(ser)" v-html="ser"></span>
                                    <el-button v-else :type="ser.type" v-html="ser.txt" @click="service"></el-button>
                                </span>
                            </div>
                            <ul class="step-content-txt log" v-if="isLog(n)">
                                <!-- <li v-for="(x, z) in n.log" :key="z">
                                    <router-link :to="x.link">{{x.version}}</router-link>
                                </li> -->
                                <el-table border :data="n.log" style="width: 100%" @row-click="logOpen" row-class-name="log-table-row">
                                    <el-table-column v-for="(t, l) in n.logTitle" :key="l" :prop="l" :label="t">
                                        <template slot-scope="a">
                                            <!-- <span class="txt link" v-if="l == 'version'" @click="jumpToPageNew(a.row['link'])">{{a.row[l]}}</span>
                                            <span class="txt" v-else>{{a.row[l]}}</span> -->
                                            <span class="txt">{{a.row[l]}}</span>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </ul>
                       </div>
                   </div>
               </div>
               <div class="page-sidebar-word">
                    <ul>
                        <li class="back-top" @click="backToTop" v-show="backTopIcon">
                            <div class="back-icon"></div>
                        </li>
                    </ul>
                </div>
           </div>
       <!-- </div>
   </div> -->
</template>

<script>
import {langRequireHandle} from '../mixin/languageMixin'
    export default {
        name: 'productIntro',
        props: {
            filePath: String,
            hideTitle: Boolean
        },
        data() {
            return {
                // filePath: this.$route.params.filePath,
                pageTitle: '',
                active: null,
                elementPos: [],
                list: [],
                backTopIcon: false,
                lang: 'zh',
                applyFunList: {
                    'card_list_apply': 'card_list_apply'
                }
            };
        },
        methods: {
            isString(obj){
                return this.GLOBAL.isString(obj)
            },
            isSubtitle(obj){
                return this.GLOBAL.isObject(obj) && obj.title
            },
            isObject(obj){
                return this.GLOBAL.isObject(obj)
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
            isService(obj){
                return this.GLOBAL.isObject(obj) && obj.service
            },
            listHandle(list){
                if(!list) return
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
                let screenHeight = document.body.offsetHeight / 2
                if(screenHeight <=  window.scrollY) this.backTopIcon = true
                else this.backTopIcon = false
            },
            pageInit(){
                window.addEventListener("scroll", this.onscroll);
                // this.list = [];
                // this.pageTitle = null
                this.LOADING.open()
                let path = `${this.GLOBAL.assetsUrl}/txt/${this.filePath}.json`
                // let path = `${process.env.BASE_URL}txt/${this.filePath}.json`
                this.GLOBAL.getStaticData(path)
                .then(res => {
                    if(!this.GLOBAL.isObject(res)){
                        this.list = [];
                        this.pageTitle = null
                    }else{
                        this.list = langRequireHandle(res.content) ;
                        this.pageTitle = res.title
                        this.$emit('takeFun', {
                            fun: 'pageTitleSet',
                            data: this.pageTitle
                        })
                        // setTimeout(() => {
                        //     this.listHandle(this.list)
                        // }, 500)
                        this.$nextTick(() => {
                            this.listHandle(this.list)
                        })
                    }
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
            service(){
                this.$refs['service'].open()
            },
            tableCellHandle({row, column, rowIndex, columnIndex}){
                let prop = column.property
                let data = row[prop]
                if(data == "") return [0, 0]
                if(!this.GLOBAL.isObject(data)) return [1, 1]
                let rowspan = data.rowspan || 1, colspan = data.colspan || 1
                return [rowspan, colspan]
            },
            columnWidth(val, css){
                // if(css != 'card-intro-table') return
                // let list = [
                //     {val: 't2', width: '40%'},
                //     {val: 't1', width: '110%'},
                // ]
                // let data = null
                // for(var i in list){
                //     if(val == list[i].val){
                //         data = list[i].width
                //         break
                //     }
                // }
                // console.log(val)
                // console.log(data)
                // return data
            },
            columnMinWidth(val, css){
                // if(css != 'card-intro-table') return
                // let list = [
                //     // {val: 't2', width: '40%'},
                //     {val: 't3', width: '90%'},
                // ]
                // let data = null
                // for(var i in list){
                //     if(val == list[i].val){
                //         data = list[i].width
                //         break
                //     }
                // }
                // console.log(val)
                // console.log(data)
                // return data
            },
            imgNameHandle(name){
                if(this.lang != 'ko') return name
                let tname = name.substring(0, name.lastIndexOf('.'))
                let ex = name.substring(name.lastIndexOf('.') + 1, name.length)
                tname = `${tname}_${this.lang}.${ex}`
                return tname
            },
            imgNameHandleError(name){
                let e = window.event
                if(!e) return
                // e.target.src = `${this.GLOBAL.assetsUrl}/img/${name}`


                let  img = e.srcElement
                img.src = `${this.GLOBAL.assetsUrl}/img/${name}`
                img.onerror = null
            },
            applyByFun(val){
                val = val || {}
                let fun = this.applyFunList[val.applyFun]
                if(!fun || !this[fun]) return
                this[fun](val)
            },
            card_list_apply(val){

            },
        },
        created() {
            // this.pageInit()
        },
        components: {
        },
        computed: {
            mainTitleCul(){
                return !this.hideTitle
            }
        },
        watch: {
            filePath: {
                handler(){
                    this.pageInit()
                },
                deep: true,
                immediate: true
            },
            languageLang: {
                handler(val){
                    this.lang = 'zh'
                    try{
                        this.lang = val.i18n.locale
                    }catch(e){}
                },
                deep: true,
                immediate: true
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
    // .product-intro{
        @stepMargin: 10rem;
        .ol-body{
            padding: 1rem 0px;
            width: @pageTitleWidth;
            max-width: 90%;
            margin: 0px auto;
            position: relative;
            .page-title{
                font-size: 1.2rem;
            }
            .ol-content{
                 text-align: left;
                 .ol-item{
                     margin-bottom: 1rem;
                     .step-title{
                        // font-size: @firstTitleSize;
                        font-size: 20px;
                        margin-bottom: @firstTitleMargin;
                    }
                    .step-content{
                        // margin: 1.5rem 0px;
                        margin: .5rem 0px;
                    }
                    .step-content-txt{
                        // line-height: @contentLineHeight;
                        line-height: 1.7rem;
                        text-indent: 1.5rem;
                        // font-size: 1rem;
                        font-size: 16px;
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
                        // font-size: @secondTitleSize;
                        font-size: 20px;
                        margin-bottom: @secondTitleMargin;
                    }
                    .step-content-img{
                        display: flex;
                        justify-content: center;
                        .img-item:last-child{
                            margin: 0px;
                        }
                        .props-compare.img-item{
                            width: 100%;
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
                            .img-title.top{
                                margin-bottom: 0.5rem;
                            }
                            .img-title.bottom{
                                margin-top: 0.5rem;
                            }
                            .img-title.img-title-txt-compare{
                                text-align: left;
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
                                // font-size: 0.8rem;
                                font-size: 16px;
                                white-space: nowrap;
                            }
                        }
                    }
                 }
            }
            .page-sidebar-word{
                position: fixed;
                right: 8rem;
                height: 20rem;
                top: 0px;
                bottom: 0px;
                margin: auto;
                display: flex;
                align-items: flex-end;
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
                    // margin: 0.5rem auto;
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
            .el-table{
                overflow: visible;
            }
            .el-table--border{
                background: none;
            }
            .document-table-template{
                line-height: 1.5rem;
                // font-size: 0.8rem;
                font-size: 16px;
            }
            .el-date-table, .el-table th{
                background: none;
            }
            .el-table th, .el-table tr{
                background: none;

            }
            .el-table td, .el-table th.is-leaf{
                border-bottom: 1px solid #999;
            }
            .el-table::before{
                display: none;
            }
            .el-table--border::after, .el-table--group::after{
                display: none;
            }
            .el-table--border, .el-table--group{
                border: 1px solid #999;
                border-right: 0px;
                border-bottom: 0px;
            }
            .el-table--border td, .el-table--border th, .el-table__body-wrapper .el-table--border.is-scrolling-left~.el-table__fixed{
                border-right: 1px solid #999;
            }
            .el-table__body-wrapper{
                overflow: visible;
            }
            .el-table thead{
                color: #666;
            }
            .el-table tbody tr:hover>td { 
                background-color: none;
            }
            .card-intro-table.el-table--border th:first-child{
                // border-right: 0px;
            }
            .el-table--enable-row-hover .el-table__body tr:hover> td{
                background: none;
            }
            .el-table__body{
                width: 100% !important;
            }
            .el-table__header{
                width: 100% !important;
            }
            .el-table__footer-wrapper, .el-table__header-wrapper{
                overflow: visible;
            }
            // .el-table.card-intro-table{
            //     td:nth-child(2), th:nth-child(2){
            //         width: 20%;
            //     }
            // }
        }
        
    // }
</style>