<!--  -->
<template>
    <div class='photo-com'>
        <div class="photo-body" :style="photoBodyStyle">
            <div class="photo-box" :class="[photoClassCul]">
                <img :src="photo" class="photo-img" v-if="!$slots.photoExtend">
                <slot name="photoExtend"></slot>
            </div>
            <div class="stone-extend">
                <slot name="stone-extend"></slot>
            </div>
            <div class="stone-box" :style="stoneBodyStyle">
                <div class="stone-photo-label stone-label-sgf" :class="colorClass" v-if="!noneColor"></div>
                <div class="none-color-box page-panel-bcg flex-center" v-if="noneColor">
                    <img :src="`${GLOBAL.assetsUrl}/img/f1.png`" class="none-color-img">
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'photoCom',
        props: {
            photo: String,
            size: String,
            color: String,
            stoneSize: String,
            stoneBorderBcg: String,
            stoneBorderClass: String,
            stoneBorderWidth: String,
            stoneBorderColor: String,
            borderSize: String,
            noneColor: Boolean,
            photoClass: String
        },
        data() {
            return {
                defaultSize: {
                    photo: '2.2rem',
                    stone: '0.7rem'
                }
            };
        },
        methods: {

        },
        created() {

        },
        components: {
        },
        computed: {
            photoClassCul(){
                return this.photoClass || 'photo-background'
            },
            photoSizeCul(){
                return this.size || this.defaultSize.photo
            },
            stoneSizeCul(){
                return this.stoneSize || this.defaultSize.stone
            },
            photoBodyStyle(){
                return {
                    width: this.photoSizeCul,
                    height: this.photoSizeCul,
                }
            },
            stoneBodyStyle(){
                let pos = this.colorCul == 'b' ? this.stonePostionBlack : this.stonePostionWhite
                let style = {
                    width: this.stoneSizeCul,
                    height: this.stoneSizeCul,
                    bottom: this.stonePostionBottom.bottom,
                    left: pos.left,
                    right: pos.right,
                }
                if(this.stoneBorderCul) style.border = this.stoneBorderCul
                else if(this.stoneBorderWidth) style['border-width'] = this.stoneBorderWidth
                return style
            },
            colorCul(){
                let color = 'b'
                if(this.color == 'b' || this.color == 'w') color = this.color
                return color
            },
            colorClass(){
                let color = this.colorCul
                if(this.stoneBorderClassCul && this.stoneBorderClassCul != '') color = `${color} ${this.stoneBorderClassCul}`
                return color
            },
            stoneBorderCul(){
                if(this.stoneBorderBcg && !this.stoneBorderClass) return {
                    border: `0.1rem solid ${this.stoneBorderBcg}`
                }
                return null
            },
            stoneBorderClassCul(){
                return this.stoneBorderClass || ''
            },
            stonePostionBottom(){
                let style = {
                    bottom: `calc(-${this.stoneSizeCul} / 3)`,
                }
                return style
            },
            stonePostionBlack(){
                let style = {
                    right: `calc(-${this.stoneSizeCul} / 3)`,
                    left: 'auto'
                }
                return style
            },
            stonePostionWhite(){
                let style = {
                    left: `calc(-${this.stoneSizeCul} / 3)`,
                    right: 'auto'
                }
                return style
            },
            stoneExtendStyle(){
                let pos = this.colorCul == 'b' ? this.stonePostionBlack : this.stonePostionWhite
                if(this.stoneBorderWidth) style['border-width'] = this.stoneBorderWidth
                let style = {
                    left: pos.left,
                    right: pos.right,
                    bottom: this.stonePostionBottom.bottom,
                    width: `calc(${this.stoneSizeCul} + )`,
                    height: this.stoneSizeCul,
                }
                return style
            }
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
    .photo-com{
        .photo-body{
            padding: 0px;
            position: relative;
            .photo-img{
                width: 100%;
                height: 100%;
                float: left;
            }
            .stone-box{
                width: 1.5rem;
                height: 1.5rem;
                position: absolute;
                bottom: -0.5rem;
                .stone-label-sgf.stone-photo-label{
                    position: static;
                    box-sizing: border-box;
                    width: 100%;
                    height: 100%;
                }
                .none-color-box{
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    overflow: hidden;
                    .none-color-img{
                        width: 90%;
                    }
                }
            }
            
            .photo-box{
                border-radius: @photoRadius;
                overflow: hidden;
                padding: 0.3rem;
                width: 100%;
                height: 100%;
            }
            .stone-label-none-color{

            }
        }
    }

</style>