<template>
    <div class="page-header">
        <div class="page-head">
            <router-link to="/index"><div class="logo"></div></router-link>
        </div>
    </div>
</template>

<style lang="less">
    .page-header{
        // height: 7rem;
        .page-head{
            background: #fff;
            height: 7rem;
            padding-left: 8.5rem;
            display: flex;
            align-items: center;
            // position: absolute;
            top: 0px;
            left: 0px;
            width: 100%;
            .logo{
                width: 10.8rem;
                height: 3.6rem;
                background: url('@{assetsUrl}v7.png') no-repeat;
                background-size: 100% 100%;
            }
        }
        
    }
</style>