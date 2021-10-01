<!--  -->
<template>
    <div class='Agora-rtc-audio'>
        <div class="video-box" id="agoraVedioBox"></div>
        <div id="agoraAudioBox"></div>
    </div>
</template>

<script>
    import AgoraRTC from 'agora-rtc-sdk'

    export default {
        name: 'AgoraRTC_Audio',
        props: {
            uid: {
                default: null,
                type: Number
            },
            status: {
                default: true,
                type: Boolean
            },
            channel: String,
            token: String,
            appId: {
                type: String,
                default: 'f4e2f949feaf400583aa1872ffeed2eb',
            }
        },
        data() {
            return {
                loading: false,
                client: null,
                localAudioTrack: null,
                remoteUsers: {},
                localStream: null
            };
        },
        methods: {
            handleError(e){
                console.log(`error`)
                console.log(e)
            },
            addVideoStream(elementId){
                this.$nextTick(() => {
                    let remoteContainer = document.getElementById('agoraVedioBox')
                    console.log(remoteContainer)
                    // 给每个流创建一个 div
                    let streamDiv = document.createElement("div");
                    // 将 elementId 分配到 div
                    streamDiv.id = `user_video_${elementId}`;
                    // 处理镜像问题
                    streamDiv.style.transform = "rotateY(180deg)";
                    // 将 div 添加到容器
                    remoteContainer.appendChild(streamDiv);
                })
            },
            removeVideoStream(elementId) {
                let id = `user_video_${elementId}`
                let remoteDiv = document.getElementById(id);
                if (remoteDiv) remoteDiv.parentNode.removeChild(remoteDiv);
            },
            pageInit(){
                this.client = AgoraRTC.createClient({
                    mode: "rtc",
                    codec: "vp8",
                })
                AgoraRTC.getDevices (devices => {
                    var devCount = devices.length;
                    var id = devices[0].deviceId;
                    console.log(devices)
                }, errStr =>{
                    console.error("Failed to getDevice", errStr);
                });
                console.log(AgoraRTC.checkSystemRequirements())
                this.client.init(this.appId, () => {
                    console.log("init success")
                    this.join()
                });
            },
            join(){
                this.client.join(this.token, this.channel, this.uid, (uid)=>{
                    // 创建本地媒体流
                    this.localStream = AgoraRTC.createStream({
                        audio: true,
                        video: false,
                        streamID: this.uid
                    }); 
                    // 初始化本地流
                    this.localStream.init(()=>{
                        // 播放本地流
                        this.localStream.play("agoraAudioBox");
                        // 发布本地流
                        this.client.publish(this.localStream, this.handleError);
                    }, this.handleError);
                }, this.handleError);
                // 有远端用户发布流时进行订阅
                this.client.on("stream-added", evt =>{
                    console.log('订阅远端用户流')
                    this.client.subscribe(evt.stream, this.handleError);
                });
                // 订阅成功后播放远端用户的流
                this.client.on("stream-subscribed", evt =>{
                    console.log('播放远端用户流')
                    let stream = evt.stream;
                    if(stream.audio){
                        stream.play()
                    }
                    // let streamId = stream.getId();
                    // console.log(streamId)
                    // console.log(evt)
                    // this.addVideoStream(streamId);
                    // stream.play(streamId);
                });
                // 远端用户取消发布流时，关闭及移除对应的流。
                this.client.on("stream-removed", evt =>{
                    let stream = evt.stream;
                    let streamId = String(stream.getId());
                    stream.close();
                    this.removeVideoStream(streamId);
                });
                // 远端用户离开频道时，关闭及移除对应的流。
                this.client.on("peer-leave", evt =>{
                    let stream = evt.stream;
                    let streamId = String(stream.getId());
                    stream.close();
                    this.removeVideoStream(streamId);
                })
            },
            async leave(){
                if(!this.client) return
                await this.client.leave()
            },
        },
        created() {

        },
        components: {
        },
        computed: {
        },
        watch: {},
        mounted() {
        },
        beforeCreate() {}, //生命周期 - 创建之前
        beforeMount() {}, //生命周期 - 挂载之前
        beforeUpdate() {}, //生命周期 - 更新之前
        updated() {}, //生命周期 - 更新之后
        beforeDestroy() {
            this.leave()
        }, //生命周期 - 销毁之前
        destroyed() {}, //生命周期 - 销毁完成
        activated() {}, //如果页面有keep-alive缓存功能，这个函数会触发
    }
</script>
<style lang='less' >
    .Agora-rtc-audio{
        position: absolute;
        top: 0px;
        left: 0px;
        width: 20rem;
        height: 20rem;
        z-index: 999999;
        .video-box{
            width: 100%;
            height: 100%;
        }
        #agoraAudioBox{
            width: 100%;
            height: 100%;
            video{
                top: 0px;
                left: 0px;
            }
        }
    }
</style>