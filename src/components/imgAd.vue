<!--  -->
<template>
   <div class='card-ad'>
       <img :src="src" alt="">
   </div>
</template>

<script>
   export default {
       name: '',
       props: {
           src: String
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
       computed: {},
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
    .card-ad{
        img{
            width: 100%;
        }
    }
</style>