<!--  -->
<template>
    <div class='chat-message-window'>
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
                    <el-input 
                    v-model="commentMessage" 
                    @keyup.enter.native="sendMessage" 
                    @focus="commentInputFocus" 
                    @blur="commentInputBlur" 
                    @input="commentInput"
                    ref="sendMessage"></el-input>
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
    export default {
        name: '',
        props: {
            pageLoading: Boolean,
            list: Array
        },
        data() {
            return {
                commentMessage: null,
                commentFocus: false,
                comment: {
                    intervalStatus: false,
                    active: false,
                    interval: null,
                    time: 2000,
                    loading: false,
                    data: []
                },
            };
        },
        methods: {
            async sendMessage(type){
                this.$emit('sendMessage', this.commentMessage)
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
            commentOn(){
                this.comment.active = true
                this.commentScrollToBottom('comment switch on')
            },
            commentOff(){
                this.comment.active = false
            },
            commentInput(){
                this.$emit('input', this.commentMessage)
            },
            commentScrollToBottom(type){
                if(!this.$refs['commentContent']) return
                this.$nextTick(() => {
                    this.$refs['commentContent'].scrollTop = this.$refs['commentContentBody'].offsetHeight
                })
            },
            clear(){
                this.commentMessage = null
            },
        },
        created() {

        },
        components: {
        },
        computed: {
            commentMessageList(){
                return this.GLOBAL.deepCopy(this.list)
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
<style lang='less' src="../assets/css/comment.less">

</style>