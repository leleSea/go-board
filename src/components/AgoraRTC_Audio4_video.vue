<!--  -->
<template>
    <div class='Agora-rtc-audio'>
        <!-- <div class="video-box" id="agoraVedioBox"></div>
        <div id="agoraAudioBox"></div> -->
        
    </div>
</template>

<script>
    import AgoraRTC from "agora-rtc-sdk-ng"
    import funhand from '@/utility/funhand'

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
            },
            videoContainerId: String,
            classroomRole: Number
        },
        data() {
            return {
                _funhand: null,
                loading: false,
                client: null,
                localAudioTrack: null,
                localVideoTrack: null,
                remoteUsers: {},
                localStream: null,
                publishStatus: false,
                checkDeviceTime: 5,
                fun: {
                    'audioinput': true,
                    'videoinput': true,
                },
                audioList: {},
                videoList: {}
            };
        },
        methods: {
            async deviceCheck(){
                AgoraRTC.onMicrophoneChanged = (info) => {
                    console.log("microphone changed!", info.state, info.device);
                    this.audioPublishInit()
                };
                AgoraRTC.onCameraChanged = (info) => {
                    console.log('camera changed')
                    this.videoPublishInit()
                };
                let res = {
                    code: 0,
                    data: {
                        audio: false,
                        video: false
                    },
                    msg: ''
                }
                let devices = await this.getDevices()
                // if(Object.keys(devices).indexOf("audioinput") == -1){
                //     res.code = 1
                //     res.msg = this.GLOBAL.errorMsg.main['mic device is not fount']                  
                // }else if(Object.keys(devices).indexOf("videoinput") == -1){
                //     res.code = 1
                //     res.msg = this.GLOBAL.errorMsg.main['video device is not fount']                   
                // }else{
                //     let {audioinput, videoinput} = devices
                //     let audioId = audioinput.deviceId;
                //     let videoId = videoinput.deviceId;
                //     let audioTrack = await this.audioTrackInit()
                //     let videoTrack = await this.videoTrackInit()
                //     let status = await this.audioCheckAction(audioTrack, videoTrack)
                //     if(!status){
                //         res.code = 0
                //         res.msg = this.GLOBAL.errorMsg.main['have mic no volume']
                //     }
                // }
                let audioTrack = await this.audioTrackInit()
                let videoTrack = await this.videoTrackInit()
                if(audioTrack){
                    let status = await this.audioCheckAction(audioTrack, videoTrack)
                    if(status) res.data.audio = true
                }
                if(videoTrack) res.data.video = true
                return res.data
            },
            async audio_check(){
                let status = 2
                let audioTrack = await this.audioTrackInit()
                if(audioTrack){
                    let res = await this.audioCheckAction(audioTrack)
                    if(res) status = 1
                }
                return status
            },
            async video_check(){
                let videoTrack = await this.videoTrackInit()
                return videoTrack ? 1 : 2
            },
            async getDevices(){
                let devices = await AgoraRTC.getDevices(function(devices) {
                    var devCount = devices.length;
                    var id = devices[0].deviceId;
                    }, function(errStr){
                });
                devices = devices || []
                let {fun} = this
                let funDe = {}
                for(var i in devices){
                    let {kind} = devices[i]
                    if(!fun[kind] || funDe[kind]) continue
                    funDe[kind] = devices[i]
                }
                return funDe
            },
            audioCheckAction(audioTrack){
                let promise = new Promise(success => {
                    let t = this.checkDeviceTime * 1000
                    let num = t, status = false
                    let interval = setInterval(() => {
                        num = num - 1000
                        const level = audioTrack.getVolumeLevel();
                        if(level > 0){
                            status = true
                        }
                        if(t <= 0 || status){
                            clearInterval(interval)
                            success(true)
                            return
                        }
                    }, 1000);
                    this.GLOBAL.timeoutGet(t).then(() => {
                        if(!status) success(false)
                    })
                })
                return promise
            },
            async pageInit(){
                this.localAudioTrack = await this.audioTrackInit()
                this.localVideoTrack = await this.videoTrackInit()
                this.client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" })
                // await this.client.leave();
                this.eventInit()
                // 订阅自己的视频
                // if(this.localVideoTrack){
                //     this.localVideoTrack.play(this.getVideoContainerId({uid: this.uid}))  
                // } 
                await this.join()
                // 发布
                await this.publishCon();
                return true
            },
            async pageInitS(){
                this.client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" })
                // await this.client.leave();
                this.eventInit()
                await this.join()
                await this.publishCon();
                return true
            },
            async audioPublishInit(){
                this.localAudioTrack = await this.audioTrackInit()
                if(!this.localAudioTrack) return
                await this.client.publish(this.localAudioTrack);
            },
            async videoPublishInit(){
                this.localVideoTrack = await this.videoTrackInit()
                if(!this.localVideoTrack) return
                this.$set(this.videoList, this.uid, true)
                await this.nextTick()
                await this.client.publish(this.localVideoTrack);
                this.localVideoTrack.play(this.getVideoContainerId({uid: this.uid}))  
            },
            async audioTrackInit(){
                let localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack().catch(e => {
                    return null
                })
                return localAudioTrack
            },
            async videoTrackInit(){
                let localVideoTrack = await AgoraRTC.createCameraVideoTrack().catch(e => {
                    return null
                })
                return localVideoTrack
            },
            async join(){
                let res = await this.client.join(this.appId, this.channel, this.token, this.uid);
                return res
            },
            async renewToken(token){
                token = token || this.token
                let res = await this.client.renewToken(token)
            },
            getVideoContainerId(user){
                // let {videoContainerId} = this
                // if(videoContainerId) return videoContainerId
                // const playerContainer = document.createElement("div");
                // // 给这个 DIV 节点指定一个 ID，这里指定的是远端用户的 UID。
                // playerContainer.id = user.uid.toString();
                // playerContainer.style.width = "640px";
                // playerContainer.style.height = "480px";
                // document.body.append(playerContainer);
                // return playerContainer.id
                return `${user.uid}_user_video`

            },
            eventInit(){
                this.client.on("user-published", async (user, mediaType) => {
                    // 开始订阅远端用户。
                    console.log('开始订阅远端用户。')
                    await this.client.subscribe(user, mediaType);
                    // 表示本次订阅的是音频。
                    console.log(user)
                    console.log(mediaType)
                    if (mediaType === "audio") {
                        // 订阅完成后，从 `user` 中获取远端音频轨道对象。
                        let setData = {}
                        setData[user.uid] = true
                        this._funhand.paramsSet.call(this, this.audioList, setData)
                        const remoteAudioTrack = user.audioTrack;
                        // 播放音频因为不会有画面，不需要提供 DOM 元素的信息。
                        remoteAudioTrack.play();
                    }

                    // 表示本次订阅的是视频。
                    if (mediaType === "video") {
                        console.log('set video')
                        // 订阅完成后，从 `user` 中获取远端视频轨道对象。
                        let id = this.getVideoContainerId(user)
                        let setData = {}
                        setData[user.uid] = {
                            videoTrack: user.videoTrack,
                            play: false,
                            id: id
                        }
                        this._funhand.paramsSet.call(this, this.videoList, setData)
                        await this.nextTick()
                        const remoteVideoTrack = user.videoTrack;
                        // // 动态插入一个 DIV 节点作为播放远端视频轨道的容器。
                        // const playerContainer = document.createElement("div");
                        // // 给这个 DIV 节点指定一个 ID，这里指定的是远端用户的 UID。
                        // playerContainer.id = user.uid.toString();
                        // playerContainer.style.width = "640px";
                        // playerContainer.style.height = "480px";
                        // document.body.append(playerContainer);

                        // // 订阅完成，播放远端音视频。
                        // // 传入 DIV 节点，让 SDK 在这个节点下创建相应的播放器播放远端视频。
                        // remoteVideoTrack.play(playerContainer);

                        // // 也可以只传入该 DIV 节点的 ID。
                        console.log(id)
                        console.log(document.getElementById(id))
                        let ele = document.getElementById(id)
                        if(ele){
                            remoteVideoTrack.play(id);
                            let setData = {}
                            setData[user.uid] = {
                                videoTrack: user.videoTrack,
                                play: true
                            }
                            this._funhand.paramsSet.call(this, this.videoList, setData)
                        }
                    }
                    
                });

                //远端用户或主播加入频道回调
                this.client.on('user-joined', user => {
                    console.log('用户加入频道')
                    console.log(user)
                    console.log(this.client)

                })

                //远端用户离线回调
                this.client.on('user-left', user => {
                    console.log('用户离开频道')
                    console.log(user)
                    let setData = {}
                    setData[user.uid] = false
                    this._funhand.paramsSet.call(this, this.videoList, setData)
                    this._funhand.paramsSet.call(this, this.audioList, setData)
                })

                //报告频道内正在说话的远端用户及其音量的回调
                this.client.on('volume-indicator', data => {
                    console.log(data)
                })

                //token过期回调
                this.client.on('token-privilege-did-expire', e => {
                    console.log('token 失效')
                    this.$emit('tokenInvalid')
                })

                //token 即将过期(30s)
                this.client.on("token-privilege-will-expire", async () =>{
                    console.log('token 即将 失效')
                    this.$emit('tokenWillInvalid')
                    // await client.renewToken(token);
                });
                //异常回调
                this.client.on('exception', this.handlError)
            },
            handlError(e){
                console.log('agroa error')
                console.log(e)
            },
            async publishCon(){
                if(!this.status) return
                this.publish()
            },
            async unpublish(){
                // if(!this.client || !this.publishStatus) return
                if(!this.client) return
                await this.client.unpublish(this.localAudioTrack);
                this.publishStatus = false
            },
            async publish(){
                if(!this.client) return
                // let data = []
                // if(this.localAudioTrack) data.push(this.localAudioTrack)
                // if(this.localVideoTrack) data.push(this.localVideoTrack)
                // await this.client.publish(data);
                // this.publishStatus = true
                // return true
                await this.audioPublishInit()
                await this.videoPublishInit()
                this.publishStatus = true
                return true
            },
            async leave(){
                if(!this.client || !this.client.leave || !this.localAudioTrack || !this.localAudioTrack.close) return
                // 销毁本地音频轨道。
                if(this.localAudioTrack) this.localAudioTrack.close();
                if(this.localVideoTrack) this.localVideoTrack.close();

                // 离开频道。
                await this.client.leave();
                console.log("离开频道")
                // this._funhand.paramsSet.call(this, this.videoList, )
                this.audioList = {}
                this.videoList = {}

            },
            async leaveS(){
                // 离开频道。
                console.log("离开频道")
                await this.client.leave();
                console.log("离开频道啦")
            },
            async bannedVoiceSet(status){
                status = status || this.status
                status ? this.publish() : this.unpublish()
            },
            async nextTick(){
                return new Promise(res => {
                    this.$nextTick(() => {
                        res(true)
                    })
                })
            },
        },
        created() {
            this._funhand = new funhand()
        },
        components: {
        },
        computed: {
            mediaListChange(){
                return {
                    audioList: this.audioList,
                    videoList: this.videoList,
                }
            },
        },
        watch: {
            mediaListChange: {
                handler(){
                    this.$emit('userChange', {
                        audioList: this.audioList,
                        videoList: this.videoList,
                    })
                },
                deep: true,
                immediate: true
            },
            status: {
                handler(val){
                    this.bannedVoiceSet(val)
                },
                deep: true,
                immediate: true
            },
        },
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
        // width: 20rem;
        // height: 20rem;
        z-index: -1;
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