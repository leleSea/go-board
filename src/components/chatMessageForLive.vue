<!--  -->
<template>
    <div class='chat-message-window' @mouseenter="mouseenter" @mouseleave="mouseleave">
        <div class="comment-box">
            <div class="comment-content mini-scrollbar" ref="commentContent">
                <div class="comment-content-body" ref="commentContentBody">
                    <div class="comment-content-body-box">
                        <div class="content-item" v-for="(v, i) in commentMessageList" :key="i">
                            <div class="user-area">
                                <div class="txt-name">{{v.name}}：</div>
                                <div class="txt-word">{{v.message}}</div>
                                <div class="txt-time" v-if="v.timeShow">{{v.timeShow}}</div>
                            </div>
                        </div>
                    </div>
                    
                </div>
            </div>
            <div class="comment-foot">
                <div class="foot-item tit">
                    <span class="txt">{{$t('发表评论')}}</span>
                </div>
                <div class="foot-item inp">
                    <el-input v-model="commentMessage" @keyup.enter.native="sendMessage" @focus="commentInputFocus" @blur="commentInputBlur" ref="sendMessage"></el-input>
                </div>
                <div class="foot-item sen">
                    <el-button class="le-button" @click="sendMessage" :disabled="sendMsgDisabled" :loading="pageLoading">
                        <span class="txt">{{$t('发送')}}</span>
                    </el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import socketLink from '../socketLink.js'




    export default {
        name: 'chatMessageWindow',
        props: {
            username: String,
            liveId: String,
            nickname: String
        },
        data() {
            return {
                pageLoading: true,
                pageDestroy: false,
                comment: {
                    intervalStatus: false,
                    active: false,
                    interval: null,
                    time: 2000,
                    loading: false,
                    data: []
                },
                commentMessage: null,
            };
        },
        methods: {
            // async sendMessage(type){
            //     if(!this.needLoginCheck({fun: 'comment'})) return
            //     if(this.sendMsgDisabled) return
            //     let messageTxt = this.commentMessage
            //     this.commentInterClear()
            //     this.commentMessage = null
            //     this.commentScrollToBottom('send message')
            //     if(type == 'enter') this.$refs['sendMessage'].focus()
            //     let res = await this.sendMessageAction(messageTxt)
            //     this.commentMessageGet()
            //     this.commentIntervalOn()
            // },
            async sendMessage(type){
                if(!this.needLoginCheck({fun: 'comment'})) return
                if(this.sendMsgDisabled) return
                let messageTxt = this.commentMessage
                // this.commentInterClear()
                this.commentMessage = null
                this.commentScrollToBottom('send message')
                if(type == 'enter') this.$refs['sendMessage'].focus()
                let res = await this.sendMessageAction(messageTxt)
            },
            async commentMessageGet(){
                if(!this.username) return false
                if(this.comment.loading) return
                this.comment.loading = true
                let res = await this.GLOBAL.commentMsgGet(this.liveId, this.lastMessageId)
                if(res && res.code == 0 && res.data && res.data.length){
                    this.commentMessageHandle(res.data)
                }
                this.comment.loading = false
            },
            commentMessageHandle(data){
                this.comment.data = this.comment.data.concat(data)
                this.commentScrollToBottom('commentMessageGet')
            },
            async sendMessageAction(message){
                let res = await this.send(message)
                return res
            },
            needLoginCheck(opt){
                if(this.username) return true
                opt = opt || {}
                let message = this.GLOBAL.errorMsg.needLoginNotice.useProps
                if(opt.fun == 'startEngine') message = this.GLOBAL.errorMsg.needLoginNotice.startEngine
                if(this.GLOBAL.errorMsg.needLoginNotice[opt.fun]) message = this.GLOBAL.errorMsg.needLoginNotice[opt.fun]
                this.GLOBAL.needLogin(null, {message: message})
                return false
            },
            commentOn(){
                this.comment.active = true
                this.commentScrollToBottom('comment switch on')
            },
            commentOff(){
                this.comment.active = false
            },
            commentInterClear(){
                this.comment.intervalStatus = false
                clearInterval(this.comment.interval)
                this.socketLink.closeConnect()
            },
            commentIntervalOn(){
                this.commentInterClear()
                this.comment.intervalStatus = true
                this.comment.interval = setInterval(() => {
                    if(!this.comment.active) return
                    if(!this.comment.intervalStatus) return
                    this.commentMessageGet()
                }, this.comment.time);
            },
            commentScrollToBottom(type){
                if(!this.$refs['commentContent']) return
                this.$nextTick(() => {
                    this.$refs['commentContent'].scrollTop = this.$refs['commentContentBody'].offsetHeight
                })
            },
            commentInputFocus(){
                this.commentFocus = true
                this.$emit('takeFun', {
                    fun: 'commentInputFocus'
                })
            },
            commentInputBlur(){
                setTimeout(() => {
                    this.commentFocus = false
                    this.$emit('takeFun', {
                        fun: 'commentInputBlur'
                    })
                }, 500);
            },
            async pageInit(){
                this.pageLoading = true
                if(!this.username) return
                let url = `${this.GLOBAL.socketUrl}/websocket/chatroom/${this.liveId}/${this.$store.state.access_token}`
                this.socketLink = new socketLink(url, {
                    onopen: this.onopen,
                    onclose: this.onclose,
                    onmessage: this.onmessage,
                })
                this.socketLink.connect()
                // await this.commentMessageGet()
                // this.commentIntervalOn()
            },
            socketClose(){
                if(!this.socketLink) return
                try{
                    this.socketLink.closeConnect()
                }catch(e){}
            },
            onopen(){
                this.pageLoading = false
                console.log('socket open')
            },
            onclose(){
                if(this.pageDestroy) return
                setTimeout(() => {
                    this.pageInit()
                }, 5000);
                console.log('socket close')
            },
            onmessage(res){
                console.log(this.GLOBAL.deepCopy(res))
                if(res && res.code == 0){
                    console.log(this.GLOBAL.deepCopy(res.data))
                    this.commentMessageHandle(res.data)
                }
            },
            send(message){
                if(!this.socketLink) return
                this.socketLink.send('addMessage', {
                    chatroomId: this.liveId,
                    // liveId: this.liveId,
                    message: message,
                    nickname: this.nickname
                })
            },
            mouseenter(){
                this.GLOBAL.setStoreItem({
                    chatMessageBoxEnter: true
                })
            },
            mouseleave(){
                this.GLOBAL.setStoreItem({
                    chatMessageBoxEnter: false
                })
            }
        },
        created() {

        },
        components: {
        },
        computed: {
            lastMessageId(){
                let list = this.comment.data
                let last = list[list.length - 1] || {}
                return last.messageId || last.id
            },
            commentMessageList(){
                let list = this.GLOBAL.deepCopy(this.comment.data)
                let rd = [], timeNow = new Date(), listKey = {} 
                for(var i in list){
                    let id = list[i].messageId || list[i].id
                    if(listKey[id]) continue
                    if(list[i].messageTime || list[i].time){
                        let dataTime = list[i].time || list[i].messageTime
                        let date = this.GLOBAL.serverTimeFormat(dataTime.date) 
                        let t = this.GLOBAL.serverTimeFormat(dataTime.time) 
                        for(var j in t){
                            t[j] = Number(t[j])
                            t[j] = parseInt(t[j])
                        }
                        t = this.GLOBAL.serverTimeFormat(t) 
                        list[i].time = {
                            year: date.year,
                            month: date.month,
                            day: date.day,
                            hour: t.hour,
                            minute: t.minute,
                            second: t.second,
                        }
                        if(list[i].time.year != timeNow.getFullYear() ||
                        list[i].time.month != (timeNow.getMonth() + 1) ||
                        list[i].time.day != timeNow.getDate()){
                            list[i].timeShow = `${list[i].time.month}-${list[i].time.day}`
                        }else{
                            list[i].timeShow = `${list[i].time.hour}:${list[i].time.minute}`
                        }
                    }
                    let tem = {
                        name: list[i].nickname || list[i].name,
                        message: list[i].message,
                        time: list[i].time || list[i].messageTime,
                        messageId: list[i].messageId,
                        timeShow: list[i].timeShow || null,
                        id: id
                    }
                    if(!tem.name) tem.name = '[游客]'
                    rd.push(tem)
                    listKey[tem.id] = true
                }
                return rd
            },
            sendMsgDisabled(){
                return !this.commentMessage || this.commentMessage == '' || this.commentMessage == ' ' || this.pageLoading
            },
        },
        watch: {
            commentMessageList: {
                handler(){
                    this.commentScrollToBottom('watch commentMessageList')
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
        beforeDestroy() {
            this.pageDestroy = true
            this.socketClose()
            this.mouseleave()
        }, //生命周期 - 销毁之前
        destroyed() {}, //生命周期 - 销毁完成
        activated() {}, //如果页面有keep-alive缓存功能，这个函数会触发
    }
</script>
<style lang='less' >
    .comment-box{
        @inputHeight: 1.4rem;
        color: #B0B0B2;
        position: absolute;
        top: calc(1.5rem);
        left: 0px;
        width: 100%;
        height: calc(100% - 1.5rem);
        padding-bottom: calc(@inputHeight + 0.4rem);
        display:flex;
        align-items: flex-end;
        .comment-foot{
            position: absolute;
            bottom: 0px;
            left: 0px;
            width: 100%;
            padding: 0.2rem 0.5rem;
            white-space: nowrap;
            display: flex;
            align-items: center;
            .foot-item.inp{
                width: 100%;
                margin: 0px 0.3rem;
                .el-input__inner{
                    height: @inputHeight;
                    padding: 0px 0.2rem;
                }
            } 
            .foot-item.sen{
                .el-button{
                    height: @inputHeight;
                    width: 3.5rem;
                }
                
            }
        }
        .comment-content{
            width: 100%;
            padding: 0rem 1rem;
            margin: 0.5rem 0px;
            height: calc(100% - 1rem);
            
            .comment-content-body{
                display: flex;
                align-items: flex-start;
                min-height: 100%;
                .comment-content-body-box{
                    width: 100%;
                }
            }
            .content-item:last-child{
                margin: 0px;
            }
            .content-item{
                text-align: left;
                display: flex;
                margin-bottom: 0.3rem;
                .user-area{
                    display: flex;
                    width: 100%;
                    .txt-name{
                        white-space: nowrap;
                        color: #fff;
                        float: left;
                    }
                    .txt-word{
                        width: 100%;
                        color: #ddd;
                        white-space: normal;
                        word-break: break-all;
                    }
                    .txt-time{
                        white-space: nowrap;
                        margin-left: 0.3rem;
                    }
                }
                .user-word{
                    color: #ddd;
                }
            }
        }
    }
</style>