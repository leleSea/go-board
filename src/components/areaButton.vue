<!--  -->
<template>
    <div class='area-button'>
        <el-button class="le-button">
            <img class="tool-icon" :src="`${GLOBAL.assetsUrl}/img/area_icon_${theme}.png`" alt="">
            <span>{{ $t('领地') }}</span>
            <span v-show="tool.area != undefined" class="tool-box">({{tool.area}})</span>
        </el-button>
    </div>
</template>

<script>
    export default {
        name: '',
        props: {
            name: String,
            tool: Object
        },
        data() {
            return {

            };
        },
        methods: {

        },
        created() {

        },
        components: {
        },
        computed: {
            btnName(){
                return this.name || '领地'
            }
        },
        watch: {},
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

</style>