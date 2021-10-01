<!--  -->
<template>
    <div class='video-player-com'>
        <div class="video-body" :class="{'assHide': videoStatus == 0}">
            <videoPlayer ref="videoPlayer"
            :playsinline="true"
            :options="playerOptionsCul"
            @pause="onPlayerPause($event)"
            @play="onPlayerPlay($event)"
            @loadeddata="onloaded($event)"
            @ended="onPlayerEnded($event)"
            @playing="onPlayerPlaying($event)"
            >
                <div class="ass-box" v-show="Number(videoStatus) == 1">
                    <div class="ass-body" ref="assBox" ></div>
                </div>
            </videoPlayer>
        </div>
    </div>
</template>

<script>
    import 'video.js/dist/video-js.css'
    import * as videojs from 'video.js'
    import  { videoPlayer } from 'vue-video-player' 
    import ass from 'assjs'

    export default {
        name: 'videoPlayerCom',
        props: {
            path: String,
            noneAss: Boolean,
            poster:  String | Boolean
            // assData: String
        },
        data() {
            return {
                assData: null,
                videoStatus: 0,
                assObj: null,
                // playerOptions: {
                //     playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
                //     autoplay: false, //如果true,浏览器准备好时开始回放。
                //     muted: false, // 默认情况下将会消除任何音频。
                //     loop: false, // 导致视频一结束就重新开始。
                //     preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
                //     language: 'zh-CN',
                //     aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
                //     fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
                //     sources: [{
                //         type: "video/mp4",
                //         src: null
                //     }],
                //     // poster: `${this.GLOBAL.assetsUrl}/img/video_bcg.jpg`,
                //     width: document.documentElement.clientWidth,
                //     notSupportedMessage: '此视频暂无法播放，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
                //     controlBar: {
                //         // timeDivider: true,
                //         // durationDisplay: true,
                //         // remainingTimeDisplay: false,
                //         fullscreenToggle: true  //全屏按钮
                //     }
                // }
            };
        },
        methods: {
            pageInit(){
                // if(!this.assData) return
                // this.assObj = new ass(text, video, {
                //     // Subtitles will display in the container.
                //     // The container will be created automatically if it's not provided.
                //     container: document.getElementById('my-container'),

                //     // see resampling API below
                //     resampling: 'video_width',
                // });

            },
            assDataInit(data){
                data = data || this.assData
                this.assObjDestroy()
                if(!data || this.noneAss || !this.$refs['videoPlayer']) return
                console.log('assDataInit')
                let video = this.$refs['videoPlayer'].$refs['video']
                this.assObj = new ass(data, video, {
                    // Subtitles will display in the container.
                    // The container will be created automatically if it's not provided.
                    container: this.$refs['assBox'],

                    // see resampling API below
                    resampling: 'video_width',
                });
            },
            assObjDestroy(){
                // if(this.assObj) this.assObj.destroy()
                // this.assObj = null
            },
            onPlayerPause(e){
                // this.videoStatus = 0
                this.$emit('pause', e)
            },
            onPlayerPlay(e){
                // this.videoStatus = 1
                this.$emit('play', e)
            },
            onloaded(e){
                this.assLoad()
                this.$emit('loadeddata', e)
            },
            onPlayerPlaying(e){
                console.log('onPlayerPlaying')
                this.videoStatus = 1
                this.$emit('playing', e)
            },
            onPlayerEnded(e){
                console.log('onPlayerEnded')
                this.videoStatus = 0
                this.$emit('ended', e)
            },
            // @pause="onPlayerPause($event)"
            // @play="onPlayerPlay($event)"
            // @loadeddata="onloaded($event)"
            // @ended="onPlayerEnded($event)"
            // @playing="onPlayerPlaying($event)"
            async assLoad(){
                if(this.noneAss) return
                let section = this.$route.params.section
                let chapter = this.$route.params.chapter
                this.assData = null
                let filename = this.path
                filename = filename.substring(0, filename.lastIndexOf('.'))
                filename = filename + '.ass'
                filename = filename.substring(filename.lastIndexOf('/') + 1, filename.length)
                filename = `${this.GLOBAL.assetsUrl}/course_ass/${filename}`
                let path = filename
                // let path = `${process.env.BASE_URL}txt/course/ass/${filename.substring(filename.lastIndexOf('/') + 1, filename.length)}`
                this.assObjDestroy()
                let res = await this.GLOBAL.getStaticData(path)
                if(res){
                    this.assData = res
                }
                this.assDataInit()
                return res
            },
            createMyButton () {
                let Button = videojs.getComponent('Button')
                let myButton = videojs.extend(Button, {
                    constructor: function (player, options) {
                        Button.apply(this, arguments)
                        this.addClass('fullscreen-enter')
                    },
                    handleClick: () => {
                        // 绑定点击事件
                    },
                    buildCSSClass: function () {
                        return 'vjs-icon-custombutton vjs-control vjs-button ass-transfer'
                    }
                })
                //注册
                videojs.registerComponent('myButton', myButton)
                
                this.$nextTick(() => {
                    // 添加到controlBar中
                    this.$refs.videoPlayer.player.getChild('controlBar').addChild('myButton')
                })
            },
            resize(){
                console.log('resize')
                // if(this.assObj && this.assObj.resize) this.assObj.resize()
            },
            play(){
                console.log('play')
                console.log(this.$refs['videoPlayer'])
                if(!this.$refs['videoPlayer'] || !this.$refs['videoPlayer'].player) return 
                this.$refs['videoPlayer'].player.play()
            },
            pause(){
                console.log('pause')
                if(!this.$refs['videoPlayer'] || !this.$refs['videoPlayer'].player.pause) return 
                this.$refs['videoPlayer'].player.pause()
            },
            reload(){
                console.log('reload')
                console.log(this.path)
                this.$refs['videoPlayer'].player.load(this.path)
            },
        },
        created() {
            this.GLOBAL.onresizeFunction['videoPlayer'] = this.resize
        },
        components: {
            videoPlayer
        },
        computed: {
            playerOptionsCul(){
                let opt = {
                    playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
                    autoplay: false, //如果true,浏览器准备好时开始回放。
                    muted: false, // 默认情况下将会消除任何音频。
                    loop: false, // 导致视频一结束就重新开始。
                    preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
                    language: 'zh-CN',
                    aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
                    fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
                    sources: [{
                        type: "video/mp4",
                        src: null
                    }],
                    poster: this.posterCul,
                    width: document.documentElement.clientWidth,
                    notSupportedMessage: '此视频暂无法播放，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
                    controlBar: {
                        // timeDivider: true,
                        // durationDisplay: true,
                        // remainingTimeDisplay: false,
                        fullscreenToggle: true  //全屏按钮
                    }
                }
                opt.sources[0].src = this.path
                return opt
            },
            posterCul(){
                return this.poster === undefined ? `${this.GLOBAL.assetsUrl}/img/video_bcg.jpg` : this.poster
            },
            assDataCul(){
                if(!this.path) return null
                if(this.noneAss) return null
                return this.assData
            },
        },
        watch: {
            path: {
                handler(val){
                    // this.$nextTick(() => {
                    //     this.playerOptions.sources[0].src = val
                    // })
                },
                deep: true,
                immediate: true
            },
            assDataCul: {
                handler(val){
                    // this.$nextTick(() => {
                    //     this.assDataInit()
                    // })
                },
                deep: true,
                immediate: true
            },
            videoStatus: {
                handler(val){
                    // if(!this.assObj) return
                    // if(val == 0) this.assObj.hide()
                    // else this.assObj.show()
                },
                deep: true,
                immediate: true
            },
        },
        mounted() {
            this.pageInit()
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
    .video-player-com{
        width: 100%;
        height: 100%;
        position: relative;
        .video-body{
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0px;
            left: 0px;
        }
        .video-body.assHide{
            .ASS-container{
                .ASS-stage{
                    display: none !important;
                }
            }
        }
        .video-player{
            width: 100%;
            height: 100%;
                
            .video-js{
                width: 100%;
                height: 100%;
                padding: 0px;
                .vjs-big-play-button{
                    bottom: 0px;
                    left: 0px;
                    right: 0px;
                    top: 0px;
                    margin: auto;
                    width: 5rem;
                    height: 2.5rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    span{
                        font-size: 2rem;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        float: left;
                        margin-top: 1px;
                    }
                    .vjs-icon-placeholder:before{
                        width: auto;
                        height: auto;
                        position: static;
                    }
                }
                .vjs-control-bar{
                    height: 2.1rem;
                }
            }
            .vjs-controls-disabled .vjs-big-play-button, .vjs-has-started .vjs-big-play-button, .vjs-using-native-controls .vjs-big-play-button, .vjs-error .vjs-big-play-button{
                display: none;
            }
        }
        .ASS-container{
            width: 100% !important;
            height: 100% !important;
            svg{
                width: 100% !important;
                height: 100% !important;
            }
            .ASS-stage{
                top: auto !important;
                bottom: 0.4rem !important;
                left: 0px !important;
                right: auto !important;
                max-width: none !important;
                width: 100% !important;
                // background: rgba(0, 0, 0, 0.5);
                height: 2.1rem !important;
                display: flex;
                align-items: center;
                .ASS-dialogue{
                    position: static !important;
                    width: 100% !important;
                    max-width: none !important;
                    
                    span{
                        font-size: 1rem !important;
                        // text-shadow: none !important;
                        // color: #fff !important;
                        font-weight: bold;
                    }
                }
            }
        }
        .ass-box{
            // position: absolute;
            bottom: 0px;
            left: 0px;
            // width: 100% !important;
            // height: 3rem !important;
            // padding: 1rem 0px;
            
        }
    }
</style>