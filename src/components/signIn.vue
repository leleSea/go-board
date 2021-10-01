<!--  -->
<template>
    <div class='sign-in-com'>
        <span>{{ $t('每日签到') }}</span>
        <leConfirm ref="leConfirm"></leConfirm>
    </div>
</template>

<script>
    export default {
        name: '',
        props: {
            },
        data() {
            return {

            };
        },
        methods: {
            async signInEveryDay(){
                if(!this.$store.state.username) return
                this.LOADING.open()
                let res = await this.GLOBAL.userBonusGet()
                
                res = {
                    code: 0,
                    data: {
                        area_increment: 5,
                        errorMsg: undefined,
                        options_increment: 5,
                        variation_increment: 5
                    }
                }
                if(!res || res.code != 0 || !res.data || res.data == '' || !this.GLOBAL.isObject(res.data)){
                    this.$refs['leConfirm'].open({
                        messag: '今日已签到',
                        button: [
                            {name: '确定', label: 0}
                        ]
                    })
                    return
                }
                this.GLOBAL.bonusEverydayObj.bonus()
                this.LOADING.close()
            }
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
</style>