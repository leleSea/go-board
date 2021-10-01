<!--  -->
<template>
   <div class='free-icon' :style="p">
        <span class="free-icon-txt" v-if="iconTxtType == 'ch'">免费</span>
        <span class="free-icon-txt" v-if="iconTxtType == 'en'">Free</span>
   </div>
</template>

<script>
   export default {
       name: '',
       props: {
        iconTxtType: String,
        position: Object,
        rotate: Number
    },
       data() {
           return {
               p
           };
       },
       methods: {

       },
       created() {
           this.p = {
               top: this.position.top + 'rem',
               left: this.position.left + 'rem',
               transform: `rotate(${this.rotate}deg)`
           }
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
    .free-icon{
        line-height: normal;
        position: absolute;
        background: #FC0300;
        font-size: 0.5rem;
        color: #fff;
        width: 3rem;
        height: 2rem;
        display: flex;
        align-items: flex-end;
        justify-content: center;
        .free-icon-txt{
            font-size: 0.6rem;
        }
    }
</style>