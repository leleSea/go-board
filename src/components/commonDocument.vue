<!--  -->
<template>
    <div class='common-document'>
        <div class="ol-content">
            <div class="ol-item" :id="v.id" v-for="(v, i) in list" :key="i">
                <h2 class="step-title" v-if="!hideTitle">{{$t(v.title)}}</h2>
                <div class="step-content" v-for="(n, j) in v.content" :key="j">
                    <h3 class="step-content-subtitle" v-if="isSubtitle(n)">{{$t(n.title)}}</h3>
                    <p class="step-content-txt" v-if="isString(n)">{{$t(n)}}</p>
                    <div class="step-content-img" v-if="isImg(n)">
                        <div class="img-item" v-for="(s, k) in n" :key="k">
                            <!-- <img :src="'https://assets.19x19.com/img/' + s.name" > -->
                            <el-image 
                            class="load-img"
                            :src="`${GLOBAL.assetsUrl}/img/${s.name}`"
                            :preview-src-list="[`${GLOBAL.assetsUrl}/img/${s.name}`]">
                        </el-image>
                            <!-- {{s.name}} -->
                            <p class="img-title" v-if="s.title">{{$t(s.title)}}</p>
                        </div>
                    </div>
                    <div class="step-content-table" v-if="isTable(n)">
                        <!-- <el-table border :data="n.table" style="width: 100%">
                            <el-table-column v-for="(t, l) in n.tableTitle" :key="l" :prop="l" :label="$t(t)"></el-table-column>
                        </el-table> -->
                        <el-table border :data="n.table" style="width: 100%" :span-method="tableCellHandle">
                            <el-table-column v-for="(t, l) in n.tableTitle" :key="l" :prop="l" :label="$t(t)">
                                <template slot-scope="h">
                                    <span v-if="isString(h.row[l])">{{h.row[l]}}</span>
                                    <span v-else>{{h.row[l].txt}}</span>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <div class="step-content-txt" v-if="isLink(n)">
                        <span v-for="(ser, seri) in n.link" :key="seri">
                            <span v-if="isString(ser)" v-html="$t(ser)"></span>
                            <el-button v-else :type="ser.type" v-html="ser.txt" @click="linkGoTo(ser.link)"></el-button>
                        </span>
                    </div>
                    <div class="" v-if="isImortant(n)">
                        <p class="step-content-txt import" v-for="(ser, seri) in n.important" :key="seri">
                            <span v-if="isString(ser)" v-html="$t(ser)"></span>
                        </p>
                    </div>
                    <ul class="step-content-txt log" v-if="isLog(n)">
                        <!-- <li v-for="(x, z) in n.log" :key="z">
                            <router-link :to="x.link">{{x.version}}</router-link>
                        </li> -->
                        <el-table border :data="n.log" style="width: 100%" @row-click="logOpen" row-class-name="log-table-row">
                            <el-table-column v-for="(t, l) in n.logTitle" :key="l" :prop="l" :label="$t(t)">
                                <template slot-scope="a">
                                    <span class="txt">{{$t(a.row[l])}}</span>
                                </template>
                            </el-table-column>
                        </el-table>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: '',
        props: {
            content: Array,
            hideTitle: Boolean
        },
        data() {
            return {

            };
        },
        methods: {
            isString(obj, l){
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
            isLink(obj){
                return this.GLOBAL.isObject(obj) && obj.link
            },
            isImortant(obj){
                return this.GLOBAL.isObject(obj) && obj.important
            },
            tableCellHandle({row, column, rowIndex, columnIndex}){
                let prop = column.property
                let data = row[prop]
                if(data == "") return [0, 0]
                if(!this.GLOBAL.isObject(data)) return [1, 1]
                let rowspan = data.rowspan || 1, colspan = data.colspan || 1
                return [rowspan, colspan]
            },
        },
        created() {

        },
        components: {
        },
        computed: {
            list(){
                return this.content || []
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
    .common-document{
        .ol-content{
            .ol-item:last-child{
                margin: 0px;
            }
            .ol-item{
                margin-bottom: 1rem;
                .step-title{
                    font-size: 0.8rem;
                    margin-bottom: 0.5rem;
                }
                .step-content-txt{
                    line-height: 1.3rem;
                    color: #666;
                }
                .el-table, .el-table__expanded-cell{
                    background: none;
                }
                .el-table th, .el-table tr{
                    background: none;
                }
                .el-table--border td, .el-table--border th, .el-table__body-wrapper .el-table--border.is-scrolling-left~.el-table__fixed{
                    border-right: 1px solid #999;
                }
                .el-table td, .el-table th.is-leaf{
                    border-bottom: 1px solid #999;
                }
                .el-table--border, .el-table--group{
                    border: 1px solid #999;
                }
                .el-table--border::after, .el-table--group::after, .el-table::before{
                    background-color: #D5D5D5;
                }
                .step-content-subtitle{
                    line-height: 1.3rem;
                }
                .step-content-img{
                    .img-item{
                        .load-img{
                            // width: 10rem;
                            width: 100%;
                        }
                        .el-image-viewer__canvas{
                            img{
                                max-height: 70vh !important;
                                max-width: none !important;
                            }
                        }
                    }
                }
            }
        }
    }
    
</style>