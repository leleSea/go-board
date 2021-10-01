<!--  -->
<template>
    <div class='img-cropper' :style="styleCul">
        <!-- <vueCropper
            ref="cropper"
            :img="imgUrlCul"
            :outputSize="option.size"
            :outputType="option.outputType"
            :info="true"
            :full="option.full"
            :canMove="option.canMove"
            :canMoveBox="option.canMoveBox"
            :fixedBox="option.fixedBox"
            :original="option.original"
            :autoCrop="option.autoCrop"
            :autoCropWidth="option.autoCropWidth"
            :autoCropHeight="option.autoCropHeight"
            :centerBox="option.centerBox"
            :high="option.high"
            :infoTrue="option.infoTrue"
            :enlarge="option.enlarge"
            :fixed="option.fixed"
            :fixedNumber="option.fixedNumber"
            @imgLoad="cropperImgLoad"
        ></vueCropper> -->
        <img :src="this.imgUrlCul" alt="" :style="styleCul">
        <cropperCan ref="cropperCan" 
        :coors.sync="coors" 
        :imgWidth.sync="imgWidth" 
        :imgHeight.sync="imgHeight"
        :offsetTop.sync="offsetTop"
        :offsetLeft.sync="offsetLeft"
        @coorsCopyUpdate="coorsCopyUpdate"
        ></cropperCan>
    </div>
</template>

<script>
    import { VueCropper }  from 'vue-cropper' 
    import cropperCan from './cropperCan.vue'

    export default {
        name: 'imgCropper',
        props: {
            cropWidth: Number,
            cropHeight: Number,
            imgUrl: String,
            coors: Array,
            imgWidth: Number,
            imgHeight: Number,
            offsetTop: Number,
            offsetLeft: Number,
            imgType: Number
        },
        data() {
            return {
                option: {
                    // img: require('@/assets/template.jpg'), // 裁剪图片的地址
                    info: true, // 裁剪框的大小信息
                    outputSize: 0.8, // 裁剪生成图片的质量
                    outputType: 'jpeg', // 裁剪生成图片的格式
                    canScale: true, // 图片是否允许滚轮缩放
                    autoCrop: true, // 是否默认生成截图框
                    // autoCropWidth: 300, // 默认生成截图框宽度
                    // autoCropHeight: 200, // 默认生成截图框高度
                    fixedBox: false, // 固定截图框大小 不允许改变
                    fixed: false, // 是否开启截图框宽高固定比例
                    fixedNumber: [7, 5], // 截图框的宽高比例
                    full: true, // 是否输出原图比例的截图
                    canMoveBox: false, // 截图框能否拖动
                    original: false, // 上传图片按照原始比例渲染
                    centerBox: true, // 截图框是否被限制在图片里面
                    infoTrue: true, // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
                    canMove: false,
                },
            };
        },
        methods: {
            cropperImgLoad(type){
                if(type == 'success') this.$refs['cropper'].goAutoCrop(100, 100)
            },
            coorsCopyUpdate(data){
                this.$emit('coorsCopyUpdate', data)
            },
            refresh(){
                this.$refs['cropperCan'].refresh()
            },
        },
        created() {

        },
        components: {
            VueCropper,
            cropperCan
        },
        computed: {
            styleCul(){
                let type = this.imgType || 1
                let css = {}
                let t1 = type == 1 ? 'width' : 'height'
                let t2 = type == 1 ? 'height' : 'width'
                css[t1] = '100%'
                css[t2] = 'auto'
                console.log(css)
                return css
            },
            imgUrlCul(){
                // return this.imgUrl || require('@/assets/template.jpg')
                return this.imgUrl || null
            },
            // cropWidthCul
        },
        watch: {},
        mounted() {
            console.log(this.$refs['cropperCan'])
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
    .img-cropper{
        position: relative;
        width: 100%;
        display: inline-block;
        // height: 100%;
        overflow: hidden;
        img{
            width: 100%;
            float: left;
        }
        .vue-cropper{
            background: none !important;
        }
        .cropper-modal{
            background: none !important;

        }
    }
</style>