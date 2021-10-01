<!--  -->
<template>
   <div class='username-input'>
       <el-select class="item-i-body country-code-select" v-model="countryCode.value"
        @change="countryCodeChange"
        :popper-append-to-body="false"
        :popper-class="`register-country-code`">
            <el-option
            v-for="item in countryCode.data"
            :key="item.name"
            :label="item.code"
            :value="item.code">
                <span>{{item.name + ' ' + item.codeDe}}</span>
            </el-option>
        </el-select>
        <el-input class="form-input" v-model.number="info.username" 
        clearable :placeholder="GLOBAL.language.public.inputUsername" auto-complete="off"></el-input>
   </div>
</template>

<script>
    export default {
        name: 'usernameInput',
        data() {
            return {
                countryCode: {
                        data: [],
                        value: null
                    },
            };
        },
        methods: {
            async pageInit(){
                    this.LOADING.open()
                    // let path = this.GLOBAL.assetsUrl + '/txt/pageFAQ.json'
                    let path = `${process.env.BASE_URL}txt/countryCode.json`
                    let res = await this.GLOBAL.getStaticData(path)
                    this.LOADING.close()
                    if(!res){
                        this.loadDataStatus = false
                        return
                    }
                    this.loadDataStatus = true
                    for(var i in res){
                        // res[i].label = `${res[i].name} +${res[i].code}`
                        res[i].codeDe = `+${res[i].code}`
                    }
                    this.countryCode.data = res
                    this.countryCode.value = 86
                },
                countryCodeChange(){}
        },
        created() {
            this.pageInit
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