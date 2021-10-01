<!--  -->
<template>
    <div class='country-code-com'>
        <!-- <el-select class="item-i-body country-code-select" filterable  v-model="countryCode.value"
        @change="countryCodeChange"
        :popper-append-to-body="false"
        :popper-class="`register-country-code`">
            <el-option
            v-for="item in countryCode.data"
            :key="item.name"
            :label="item.codeDe"
            :value="item.code">
                <span>{{item.name + ' ' + item.codeDe}}</span>
            </el-option>
        </el-select> -->


        <el-select class="item-i-body country-code-select" filterable  v-model="countryCode.value"
        @change="countryCodeChange"
        :popper-append-to-body="false"
        :popper-class="`register-country-code`">
            <el-option-group
            v-for="group in countryCode.data"
            :key="group.key"
            :label="group.label">
            <el-option
            v-for="item in group.options"
            :key="item.index"
            :label="item.codeDe"
            :value="item.index">
                <span>{{$t(item.name) + ' ' + item.codeDe}}</span>
            </el-option>
            </el-option-group>
        </el-select>
    </div>
</template>

<script>
    export default {
        name: 'countryCode',
        props: {
            value: String
        },
        data() {
            return {
                countryCode: {
                    data: [],
                    value: null,
                    listOrgal: []
                },
            };
        },
        methods: {
            async pageInit(){
                this.LOADING.open()
                let path = this.GLOBAL.assetsUrl + '/txt/countryCode.json'
                // let path = `${process.env.BASE_URL}txt/countryCode.json`
                let res = await this.GLOBAL.getStaticData(path)
                this.LOADING.close()
                if(!res){
                    this.loadDataStatus = false
                    return
                }
                this.loadDataStatus = true
                let filterData = []
                let filterCity = {
                    'zhongguo': true,
                    'zhongguotaiwandiqu': true,
                    'zhongguoxianggangtebiexingzhengqu': true,
                    'zhongguoaomentebiexingzhengqu': true,
                    'meiguo': true,
                    'hanguo': true,
                    'riben': true,
                    'yingguo': true,
                    'aodaliya': true,
                    'xinjiapo': true,
                }
                let listOrgal = []
                for(var j in filterCity){
                    // res[i].index = i
                    for(var i in res){
                        res[i].codeDe = `+${res[i].code}`
                        if(j === res[i].p){
                            filterData.push(this.GLOBAL.deepCopy(res[i]))
                        }
                    }
                }
                for(i in filterData){
                    listOrgal.push(this.GLOBAL.deepCopy(filterData[i]))
                    listOrgal[listOrgal.length - 1].index = listOrgal.length - 1
                    filterData[i].index = listOrgal.length - 1
                }
                for(i in res){
                    listOrgal.push(this.GLOBAL.deepCopy(res[i]))
                    listOrgal[listOrgal.length - 1].index = listOrgal.length - 1
                    res[i].index = listOrgal.length - 1
                }
                let rd = [
                    {
                        label: '',
                        key: 0,
                        options: filterData
                    },
                    {
                        label: '',
                        key: 1,
                        options: res
                    },
                ]
                this.countryCode.data = rd
                this.countryCode.listOrgal = listOrgal
                if(!this.value) this.countryCode.value = filterData[0].index
                this.$emit('init')
                // this.countryCode.data = res
                // if(!this.value) this.countryCode.value = res[0].code
            },
            countryCodeChange(val){
                // this.$emit('change', `00${val}`)
            },
            countryCodeReset(val){
                // 
                let list = this.countryCode.listOrgal
                let f = null
                for(var i in list){
                    if(list[i].code == val || `00${list[i].code}` == val){
                        f = i
                        break
                    }
                }
                this.countryCode.value = f
            }
        },
        created() {
            this.pageInit()
        },
        components: {
        },
        computed: {},
        watch: {
            value: {
                handler(val){
                    val = '' + val
                    val = val.substring(val.indexOf('+') + 1, val.length)
                    val = val.substring(val.lastIndexOf('0') + 1, val.length)
                    let list = this.countryCode.listOrgal
                    for(var i in list){
                        if(list[i].code == val){
                            this.countryCode.value = list[i].index
                            break
                        }
                    }
                    // this.countryCode.value = val
                },
                immediate: true,
                deep: true
            },
            countryCode: {
                handler(val){
                    let data = this.countryCode.value
                    if(!data && data != 0) return
                    let list = this.countryCode.listOrgal
                    data = list[data].code
                    this.$emit('change', `00${data}`)
                },
                immediate: true,
                deep: true
            }
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
<style lang='less' >

</style>