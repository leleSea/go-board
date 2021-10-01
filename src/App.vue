<template>
  <div id="app">
        <audio id="globalAudioPlay" ref="globalAudioPlay" muted></audio>
        <audio id="globalAudioReadSecond" ref="globalAudioReadSecond"></audio>
        <audio id="globalAudioReadStatus" ref="globalAudioReadStatus"></audio>
        <router-view ref="mainView" />
      
  </div>
</template>

<script>
export default {
    name: 'app',
    data(){
        return {
        }
    },
    methods: {
    },
    created(){
    },
    mounted() {
    },
    components: {
    },
    computed: {
    },
    watch: {
    }
}
</script>


<style lang="less">
.menu-active-icon{
    width: 0.8rem;
    height: 0.8rem;
    position: absolute;
    top: 0px;
    bottom: 0px;
    margin: auto;
    left: 0.2rem;
}
    .web-url-notice{
        position: fixed;
        top: 0px;
        left: 0px;
        background: rgba(94, 139, 196, .6);
        color: #fff;
        font-size: 13px;
        width: 100%;
        text-align: center;
        padding: 0.5rem 0px;
        z-index: 999;
        a{
        color: #fff;
        font-size: 0.6rem;
        }
        span{
        font-size: 0.6rem;
        }
    }
    html, body, #app{
        // min-height: 100%;
        height: 100%;
        
    }
    .danger-txt{
        color: #f83838;
    }
    html{
        font-size: 20px;
    }
    // body, #app{
    //   min-height: 100%;
    // }
    
    #app {
        // font-family: 'Avenir', Helvetica, Arial, sans-serif;
        // -webkit-font-smoothing: antialiased;
        // -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
    }
    #nav {
        padding: 30px;
        a {
        font-weight: bold;
        color: #2c3e50;
        &.router-link-exact-active {
            color: #42b983;
        }
        }
    }
    .use-record{
        font-size: 0.6rem;
        white-space: nowrap;
        .item{
            margin-bottom: 0.3rem;
        }
        .item:last-child{
            margin: 0px;
        }
        .item.cost{
        // color: #f83838;
        }
        .delete{
        color: #9E9E9E;
        text-decoration: line-through;
        margin-right: 0.2rem;
        }
    }
    .page-content-engine{
        min-height: @engineBodyMinHeight;
    }
    .page-content-web{
        min-height: @webBodyMinHeight;
    }
    .engine-use-content-common{
        min-height: @engineUseContentHeight;
    }
    .new-notice{
        position: absolute;
        width: 0.4rem;
        height: 0.4rem;
        background: #FC0300;
        border-radius: 50%;
    }
    .user-role-icon{
        height: 0.7rem;
        margin-right: 0.2rem;
        border-radius: 0.1rem;
    }
    .vip1{
        background: url('@{assetsUrl}h1.png') no-repeat;
        background-size: 100% auto;
    }
    .vip2{

    }
    .vip3{

    }
    .user{

    }
    .new_user{

    }
    .test{

    }
    .txt.warning{
        color: @define-warning;
    }
    .txt.danger{
        color: @define-danger;
    }
    .txt.success{
        color: @define-success;
    }
    .txt.normal{
        color: @define-normal;
    }
    .report-creating-notice-box.el-message-box{
        width: 30rem;
        .el-message-box__header{
        padding: 0px;
        .el-message-box__headerbtn{
            top: 0px;
            right: 0.3rem;
        }
        }
        .report-creating-notice{
        color: #000;
        line-height: normal;
        padding: 1rem 1.5rem 0.5rem;
        line-height: 1.3rem;
        text-align: left;
        }
        .el-message-box__content{
        padding-bottom: 0px;
        }
        .el-message-box__btns{
        text-align: center;
        .el-button{
            background: #596989;
            color: #fff;
            border: 0px;
            width: 8.55rem;
            height: 1.6rem;
        }
        .el-button:active{
            transform: scale(0.99);
        }
        }
    }
    .balance-not-enough{
        padding: 1rem 0px 0px;
        .le-confirm-foot{
        margin-top: 1rem;
        padding: 0px;
        }
        .txt{
        display: flex;
        align-items: center;
        justify-content: center;
        }
        .notice-icon{
        width: 0.8rem;
        margin-left: 0.2rem;
        margin-right: 0.1rem;

        }
    }
    .tool-box{
        font-size: 0.5rem;
    }
    .tool-icon{
        width: 0.9rem;
        margin-right: 0.3rem;
    }
    .tool-icon-label{
        width: 0.9rem;
        margin-left: 0.3rem;
    }
    a[href^='https://www.cnzz.com']{
        display: none;
    }
    .currency{
        transform: scale(.9);
        font-size: .7em;
        display: inline-block;
    }
</style>
