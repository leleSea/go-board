<!--  -->
<template>
    <div class='sgf-info-photo' :class="resultCss">
        <!-- <img :src="GLOBAL.getPhotoForSgfMeta(gameMetaCul, player, this.colorCul, sgfUsernameDefineCul)" class="p-img"> -->
        <img :src="photoPath" class="p-img" v-if="photoPath">
        <!-- <div class="photo-color-box">
            <div class="stone-label-sgf b" :class="stoneClassCul" v-if="!noneColor"></div>
            <div class="stone-label-sgf none-color bc" v-if="noneColor" :class="stoneClassCul">
                <img :src="`${GLOBAL.assetsUrl}/img/f1.png`" class="none-color-img">
            </div>
        </div> -->
        <!-- <div class="photo-result-label-box" v-if="resultCul">
            <img :src="`${GLOBAL.assetsUrl}/img/${resultCul.win == 'b' ? 'r7' + theme : 'r8' + theme}.png`" alt="" v-if="resultCul">
        </div> -->
    </div>
</template>

<script>
    export default {
        name: 'sgfInfoPhoto',
        props: {
            color: String,
            gameMeta: Object,
            sgfUsernameDefine: String,
            optionsRoot: Object,
            result: String,
            theme: String
        },
        data() {
            return {
                photoPath: null,
                basKey:'dyn',
                imgList: [
                    {max: 0.06, photo: '6'},
                    {max: 0.16, photo: '16'},
                    {max: 0.28, photo: '28'},
                    {max: 0.42, photo: '42'},
                    {max: 0.58, photo: '58'},
                    {max: 0.72, photo: '72'},
                    {max: 0.84, photo: '84'},
                    {max: 0.94, photo: '94'},
                    {max: 1, photo: '100'},
                ]
            };
        },
        methods: {
            photoImgHandle(newVal, oldVal){
                let photoPath = this.defaultPath()
                let color = this.color
                let defaultPath = this.GLOBAL.userPhotoDefault[`${color}Path`]
                if(!this.optionsRootCul || !Object.keys(this.optionsRootCul).length || photoPath.indexOf(defaultPath) <= -1){
                    this.photoSet(photoPath)
                    return
                }
                this.photoSet(this.setDynPhoto())
            },
            setDynPhoto(){
                let data = this.optionsRootCul
                let winrate = data[`${this.color}Winrate`]
                let list = this.imgList, photo = null
                for(var i in list){
                    if(winrate <= list[i].max){
                        photo = list[i].photo
                        break
                    }
                }
                if(!photo) return
                return `${this.GLOBAL.assetsUrl}/user_photo/${this.basKey}_${this.color}_${photo}.png`
            },
            photoSet(val){
                if(!this.optionsRoot){
                    this.photoPath = this.defaultPath()
                    return
                }
                if(!val){
                    if(!this.photoPath) this.photoPath = this.defaultPath()
                    return
                }
                this.photoPath = val
            },
            defaultPath(){
                return this.GLOBAL.getPhotoForSgfMeta(this.gameMetaCul, this.player, this.colorCul, this.sgfUsernameDefineCul)
            },
        },
        created() {

        },
        components: {
        },
        computed: {
            resultCul(){
                let result = this.result
                if(!result) return null
                result = this.GLOBAL.deepCopy(this.GLOBAL.parseResultSelect(result))
                let win = this.GLOBAL.resultWinLabel(this.result)
                if(!win) result.hide = true
                else result.hide = false
                result.win = win
                return result
            },
            resultCss(){
                this.color == 1 ? 'b' : 'w'
            },
            optionsRootCul(){
                return this.optionsRoot || {}
            },
            sgfUsernameDefineCul(){
                return this.sgfUsernameDefine || null
            },
            gameMetaCul(){
                return this.gameMeta || {}
            },
            colorCul(){
                return this.color == 'black' ? 'b' : 'w'
            },
            player(){
                let data = this.gameMetaCul
                return this.color == 'black' ? data.pb : data.pw
            },
        },
        watch: {
            optionsRoot: {
                handler(newVal, oldVal){
                    this.photoImgHandle(newVal, oldVal)
                },
                deep: true,
                immediate: true
            },
            gameMeta: {
                handler(newVal, oldVal){
                    this.photoImgHandle()
                },
                deep: true,
                immediate: true
            },
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
    .sgf-info-photo{
        // position: relative;
        .photo-result-label-box{
            position: absolute;
            bottom: -0.2rem;
            width: 1.2rem;
        }
    }
    .sgf-info-photo.b{
        .photo-result-label-box{
            left: -0.3rem;
        }
    }
    .sgf-info-photo.b{
        .photo-result-label-box{
            right: -0.3rem;
        }
    }
</style>