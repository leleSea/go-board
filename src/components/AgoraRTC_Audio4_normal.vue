<!--  -->
<template>
    <div class='Agora-rtc-audio'>
        <!-- <div class="video-box" id="agoraVedioBox"></div>
        <div id="agoraAudioBox"></div> -->
        
    </div>
</template>

<script>
    import AgoraRTC from "agora-rtc-sdk-ng"

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
                localStream: null,
                publishStatus: false,
                checkDeviceTime: 5
            };
        },
        methods: {
            async deviceCheck(){
                // let res = await AgoraRTC.getDevices()
                // console.log(res)
                // return res
                console.log('deviceCheck')
                AgoraRTC.onMicrophoneChanged = (info) => {
                    console.log("microphone changed!", info.state, info.device);
                };
                let res = {
                    code: 0,
                    msg: ''
                }
                this.loading = true
                let devices = await AgoraRTC.getDevices()
                console.log(this.GLOBAL.errorMsg)
                const audioDevices = devices.filter(device =>{
                    return device.kind === "audioinput";
                });
                if(!audioDevices || !audioDevices.length){
                    res.code = 1
                    res.msg = this.GLOBAL.errorMsg.main['mic device is not fount']
                }else{
                    let selectedMicrophoneId = audioDevices[0].deviceId;
                    let audioTrack = await AgoraRTC.createMicrophoneAudioTrack({ microphoneId: selectedMicrophoneId })
                    let status = await this.deviceCheckAction(audioTrack)
                    if(!status){
                        res.code = 0
                        res.msg = this.GLOBAL.errorMsg.main['have mic no volume']
                    }
                }
                return res
            },
            deviceCheckAction(audioTrack){
                let promise = new Promise(success => {
                    let t = this.checkDeviceTime * 1000
                    let num = t, status = false
                    let interval = setInterval(() => {
                        num = num - 1000
                        const level = audioTrack.getVolumeLevel();
                        if(level > 0){
                            status = true
                        }
                        console.log("local stream audio level", level);
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
                this.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
                // AgoraRTC.onMicrophoneChanged = async (changedDevice) => {
                //     // 插入设备时，切换到新插入的设备。
                //     if (changedDevice.state === "ACTIVE") {
                //         microphoneTrack.setDevice(changedDevice.device.deviceId);
                //     // 拔出设备为当前设备时，切换到一个已有的设备。
                //     } else if (changedDevice.device.label === microphoneTrack.getTrackLabel()) {
                //         const oldMicrophones = await AgoraRTC.getMicrophones();
                //         oldMicrophones[0] && microphoneTrack.setDevice(oldMicrophones[0].deviceId);
                //     }
                // }
                this.client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" })
                this.eventInit()
                await this.join()
                // 通过麦克风采集的音频创建本地音频轨道对象。
                // this.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
                // 将这些音频轨道对象发布到频道中。
                await this.publishCon();
                return true
            },
            async join(){
                let res = await this.client.join(this.appId, this.channel, this.token, this.uid);
                console.log('join status')
                console.log(res)
                return res
            },
            async renewToken(token){
                token = token || this.token
                let res = await this.client.renewToken(token)
            },
            eventInit(){
                this.client.on("user-published", async (user, mediaType) => {
                    console.log('user-published')
                    // 开始订阅远端用户。
                    await this.client.subscribe(user, mediaType);
                    console.log("subscribe success");

                    // 表示本次订阅的是音频。
                    if (mediaType === "audio") {
                        // 订阅完成后，从 `user` 中获取远端音频轨道对象。
                        const remoteAudioTrack = user.audioTrack;
                        // 播放音频因为不会有画面，不需要提供 DOM 元素的信息。
                        remoteAudioTrack.play();
                    }
                });

                //远端用户或主播加入频道回调
                this.client.on('user-joined', user => {
                    console.log('用户加入频道')
                    console.log(user)
                })

                //远端用户离线回调
                this.client.on('user-left', user => {
                    console.log('用户离开频道')
                    console.log(user)
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
                console.log(this.status)
                if(!this.status) return
                this.publish()
            },
            async unpublish(){
                // if(!this.client || !this.publishStatus) return
                if(!this.client) return
                console.log('unpublish')
                await this.client.unpublish(this.localAudioTrack);
                this.publishStatus = false
            },
            async publish(){
                // if(!this.client || this.publishStatus) return
                if(!this.client) return
                console.log('publish')
                await this.client.publish([this.localAudioTrack]);
                console.log("publish success!");
                this.publishStatus = true
                return true
            },
            async leave(){
                if(!this.client || !this.client.leave || !this.localAudioTrack || !this.localAudioTrack.close) return
                // 销毁本地音频轨道。
                this.localAudioTrack.close();

                // 离开频道。
                await this.client.leave();
            },
            async bannedVoiceSet(status){
                status = status || this.status
                status ? this.publish() : this.unpublish()
            },
        },
        created() {

        },
        components: {
        },
        computed: {
        },
        watch: {
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