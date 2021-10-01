<!--  -->
<template>
    <div class='stone-label-component'>
        <div class="stone-box" :style="stoneSizeStyle">
            <div class="stone-content" :class="stoneClass"></div>
        </div>
    </div>
</template>

<script>
    export default {
        name: '',
        props: {
            type: String,
            color: String,
            size: Number
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
            sizeCul(){
                let size = this.size || 1.5
                return `${size}rem`
            },
            stoneSizeStyle(){
                return {
                    width: this.sizeCul,
                    height: this.sizeCul,
                }
            },
            stoneClass(){
                let colorCss = this.colorCul
                let typeCss = this.typeCul
                return `${colorCss} ${typeCss}`
            },
            typeCul(){
                return this.type || 'css'
            },
            colorCul(){
                return this.color || 'black'
            },
            type1(){
                return this.typeCul == 'css'
            },
            type2(){
                return this.typeCul == 'img'
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
    .stone-label-component{
        .stone-box{
            width: 1.5rem;
            height: 1.5rem;
            border-radius: 50%;
            overflow: hidden;
            .stone-content.css.black{
                background: #000;
            }
            .stone-content.css.white{
                background: #fff;
            }
            .stone-content.img.black{
                background: url('@{assetsUrl}stb1.png') no-repeat;
                background-size: 100% 100%;
            }
            .stone-content.img.white{
                background: url('@{assetsUrl}stw1.png') no-repeat;
                background-size: 100% 100%;
            }
            .stone-content{
                width: 100%;
                height: 100%;
            }
        }
    }
</style>