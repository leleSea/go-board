<!--  -->
<template>
   <div class='sgf-item'>
        <ul class="sgf-right-item" v-for="(v, i) in sgfList" :key="v.id" @dblclick="openSgf(v)">
                <li class="item-i report-label" v-if="v.analyzeIcon != null"> 
                    <!-- v-if="v.analyzeStatus == 2" -->
                    <img class="report-icon" :src="`${GLOBAL.assetsUrl}/img/${v.analyzeIcon}`" alt="">
                </li>
                <li class="item-i a">
                    <div class="i-t">
                        {{v.createTime.date.year}}-
                        {{v.createTime.date.month}}-
                        {{v.createTime.date.day}}
                    </div>
                    <div class="i-t hidepoint">{{v.gamename}}</div>
                </li>
                <li class="item-i b cb">
                    <div class="i-p photo-box">
                        <!-- <img class="user-photo" :src="`${GLOBAL.assetsUrl}/img/${getPhoto(v, v.pb)}`" alt=""> -->
                        <img class="user-photo" :src="getPhoto(v, v.pb)" alt="">
                        <div class="stone-label"></div>
                    </div>
                    <div class="i-p">
                        <div class="bx i-name hidepoint">{{v.pb}}</div>
                        <div class="bx i-level">{{v.blackLevel.label}}</div>
                    </div>
                </li>
                <li class="item-i c">
                    <div class="i-r hidepoint">
                        <span class="i-r-num">{{v.moveNum}}手</span>
                        <span>{{v.gameResult.txt}}</span>
                    </div>
                    <div class="i-r">
                        <span class="i-r-num">
                            <span v-if="v.handicap > 0">让{{v.handicap}}子</span>
                            <!-- <span v-if="v.handicap <= 0"></span> -->
                        </span>
                        <span>黑贴{{v.komi.label}}</span>
                    </div>
                </li>
                <li class="item-i d cw">
                    <div class="i-p">
                        <div class="bx i-name hidepoint">{{v.pw}}</div>
                        <div class="bx i-level">{{v.whiteLevel.label}}</div>
                    </div>
                    <div class="i-p photo-box">
                        <!-- <img class="user-photo" :src="`${GLOBAL.assetsUrl}/img/${getPhoto(v, v.pw)}`" alt=""> -->
                        <img class="user-photo" :src="getPhoto(v, v.pw)" alt="">
                        <div class="stone-label"></div>
                    </div>
                </li>
                <li class="item-i e" v-loading="v.loading" element-loading-spinner="page-loading-icon-css">
                    <img class="handle-icon" :src="`${GLOBAL.assetsUrl}/img/w27.png`" title="打开" @click="openSgf(v)">
                    <img class="handle-icon" :src="`${GLOBAL.assetsUrl}/img/w23.png`" title="下载" @click="downloadFile(v)">
                    <img class="handle-icon" :src="`${GLOBAL.assetsUrl}/img/w24.png`" title="删除" @click="deleteSgf(v)" v-if="!disabledHandle(v)">
                    <div class="handle-icon sp" v-if="!disabledHandle(v)">
                        <img class="handle-icon-img" :src="`${GLOBAL.assetsUrl}/img/${v.favourite ? 'w26' : 'w25'}.png`" title="收藏" @click="favouriteCon(v)">
                    </div>
                    
                    <!-- <span class="el-icon-star-off handle-icon icon-txt" :class="{'active': v.favourite}"></span> -->
                </li>   
            </ul>
   </div>
</template>

<script>
   export default {
       name: 'sgfItem',
       data() {
           return {

           };
       },
       methods: {

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
<style lang='less' >

</style>