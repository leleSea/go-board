<!--  -->
<template>
    <div class='banner-carousel'>
        <img :src="items[0].img || items[0].banner" class="visibility-hidden visi-img" v-if="items.length">
        <el-carousel trigger="click" :interval="intervalCul" arrow="always">
            <el-carousel-item v-for="(v, i) in items" :key="i">
                <div class="banner-item">
                    <router-link :to="v.link">
                        <img :src="v.img || v.banner" v-if="v.link">
                    </router-link>
                </div>
                <div class="banner-item">
                    <img :src="v.img || v.banner" v-if="!v.link">
                </div>
            </el-carousel-item>
        </el-carousel>
    </div>
</template>

<script>
    export default {
        name: 'bannerCarousel',
        props: {
            list: Array
        },
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
        computed: {
            listCul(){
                let list = this.GLOBAL.deepCopy(this.list)
                let rd = []
                for(var i in list){
                    if(!list[i].banner || !list[i].validFlag) continue
                    rd.push(list[i])
                }
                return rd
            },
            items(){
                let list = this.GLOBAL.deepCopy(this.listCul)
                let rd = this.GLOBAL.deepCopy(list)
                if(list.length <= 2 && list.length != 1){
                    rd = []
                    for(var i = 0; i <= 3; i++){
                        let k = i % list.length
                        if(!list[k]) continue
                        rd.push(list[k])
                    }
                }
                for(var i in rd){
                    if(rd[i].banner_link) rd[i].link = rd[i].banner_link
                    if(this.GLOBAL.isString(rd[i])){
                        rd[i] = {
                            img: rd[i]
                        }
                    }
                }
                return rd
            },
            intervalCul(){
                return this.interval || this.GLOBAL.indexCarousel.interval
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
    .banner-carousel{
        position: relative;
        height: 100%;
        width: 100%;
        .banner-item{
            width: 100%;
            img{
                width: 100%;
                float: left;
            }
        }
        .el-carousel__indicators--horizontal{
            display: none;
        }
        .visi-img{
            width: 100%;
        }
        .el-carousel{
            position: absolute;
            top: 0px;
            left: 0px;
            width: 100%;
            height: 100%;
            overflow: hidden;
            .el-carousel__container{
                height: 100%;
                .el-carousel__arrow{
                    width: 2rem;
                    height: 2rem;
                    i{
                        font-size: 1rem;
                    }
                }
            }
            .el-carousel__item, .el-carousel__mask{
                height: auto;
            }
        }
    }
</style>