<!--  -->
<template>
    <div class='address-select' :class="typeCul">
        <div class="address-select-content">
            <div class="select-item">
                <el-select class="it-select" v-model="provinceValue"
                @change="provinceChange"
                :popper-append-to-body="false" 
                :clearable="true"
                :popper-class="`lives-select-options`" :placeholder="$t('请选择')">
                    <el-option
                    v-for="item in provinceData"
                    :key="item.value"
                    :label="$t(item.name)"
                    :value="$t(item.value)">
                        <span class="txt">{{$t(item.name)}}</span>
                    </el-option>
                </el-select>
                <span class="txt item-title" v-if="itemTitle">省</span>
            </div>
            <div class="select-item">
                <el-select class="it-select" v-model="cityValue"
                @change="cityChange"
                :popper-append-to-body="false" 
                :popper-class="`lives-select-options`" :placeholder="$t('请选择')">
                    <el-option
                    v-for="item in cityData"
                    :key="item.value"
                    :label="$t(item.name)"
                    :value="$t(item.value)">
                        <span class="txt">{{$t(item.name)}}</span>
                    </el-option>
                </el-select>
                <span class="txt item-title" v-if="itemTitle">市</span>
            </div>
            <div class="select-item">
                <el-select class="it-select" v-model="areaValue"
                @change="areaChange"
                :popper-append-to-body="false" 
                :popper-class="`lives-select-options`" :placeholder="$t('请选择')">
                    <el-option
                    v-for="item in areaData"
                    :key="item.value"
                    :label="$t(item.name)"
                    :value="$t(item.value)">
                        <span class="txt">{{$t(item.name)}}</span>
                    </el-option>
                </el-select>
                <span class="txt item-title" v-if="itemTitle">区</span>
            </div>
        </div>
        <div class="select-item detail">
            <el-input v-model="detailAdd" :placeholder="$t('请输入详细地址')" @input="detailChange"></el-input>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'addressSelect',
        props: {
            necessary: Boolean,
            type: String,
            itemTitle: Boolean
        },
        data() {
            return {
                loading: false,
                selectData: null,
                provinceCode: 0,
                provinceValue: null,
                cityValue: null,
                areaValue: null,
                detailAdd: null,
            };
        },
        methods: {
            pageInit(){
                this.dataInit()
            },
            async dataInit(){
                this.loading = true
                let path = this.GLOBAL.assetsUrl + '/txt/province.json'
                // let path = `${process.env.BASE_URL}txt/province.json`
                let res = await this.GLOBAL.getStaticData(path)
                if(res) this.selectData = res
                this.loading = false
            },
            provinceChange(){
                this.cityValue = null
                this.areaValue = null
                this.dateUpdate()
            },
            cityChange(){
                this.areaValue = null
                this.dateUpdate()
            },
            areaChange(){
                this.dateUpdate()
            },
            detailChange(){
                this.dateUpdate()
            },
            dateUpdate(){
                this.$emit('update', {
                    provinceName: this.provinceName,
                    cityName: this.cityName,
                    areaName: this.areaName,
                    detail: this.detailAdd
                })
            },
            dataCheck(){
                let res = {code: 0}, singleCheck = false
                if(this.necessary){
                    
                    singleCheck = true
                }else{
                    if(!this.provinceValue && !this.cityValue && !this.areaValue && !this.detailAdd) res = {code: 0}
                    else singleCheck = true
                }
                if(singleCheck){
                    if(!this.provinceValue) res = {code: 1, error: 'province'}
                    else if(!this.cityValue) res = {code: 1, error: 'city'}
                    else if(!this.areaValue) res = {code: 1, error: 'area'}
                    else if(!this.detailAdd) res = {code: 1, error: 'detail'}
                }
                return res
            },
            clear(){
                this.provinceValue = null
                this.cityValue = null
                this.areaValue = null
                this.detailAdd = null
            },
        },
        created() {

        },
        components: {
        },
        computed: {
            typeCul(){
                return this.type || 'normal'
            },
            addressTxt(){
                let detailAdd = this.detailAdd || ''
                let data = []
                if(this.provinceName) data.push(this.provinceName)
                if(this.cityName) data.push(this.cityName)
                if(this.areaName) data.push(this.areaName)
                if(this.detailAdd) data.push(this.detailAdd)
                // return `${this.provinceName} ${this.cityName} ${this.areaName} ${detailAdd}`
                return data.join(' ')
            },
            provinceName(){
                if(this.selectData === null || this.provinceValue === null) return ''
                return  this.selectData[this.provinceCode][this.provinceValue]
            },
            cityName(){
                if(this.selectData === null || this.cityValue === null) return ''
                return  this.selectData[`${this.provinceCode},${this.provinceValue}`][this.cityValue]
            },
            areaName(){
                if(this.selectData === null || this.areaValue === null) return ''
                return  this.selectData[`${this.provinceCode},${this.provinceValue},${this.cityValue}`][this.areaValue]
            },
            provinceData(){
                let data = this.selectData
                if(!this.selectData || !this.selectData[this.provinceCode]) return []
                let province = this.GLOBAL.deepCopy(this.selectData[this.provinceCode])
                let rd = []
                for(var i in province){
                    rd.push({
                        value: i,
                        name: province[i]
                    })
                }
                // rd.unshift({
                //     value: -1,
                //     name: '请选择'
                // })
                return rd
            },
            cityData(){
                let code = `${this.provinceCode},${this.provinceValue}`
                if(this.provinceValue === null || !this.selectData[code]) return []
                let data = this.GLOBAL.deepCopy(this.selectData[code])
                let rd = []
                for(var i in data){
                    rd.push({
                        value: i,
                        name: data[i]
                    })
                }
                return rd
            },
            areaData(){
                let code = `${this.provinceCode},${this.provinceValue},${this.cityValue}`
                if(this.cityValue === null || !this.selectData[code]) return []
                let data = this.selectData[code]
                let rd = []
                for(var i in data){
                    rd.push({
                        value: i,
                        name: data[i]
                    })
                }
                return rd
            },
        },
        watch: {},
        mounted() {
            this.pageInit()
        },
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
    .address-select{
        display: flex;
        .address-select-content{
            display: flex;
        }
        .select-item{
            display: flex;
            align-items: center;
            margin-right: 0.5rem;
            .el-input__inner{
                // width: auto;
                padding-left: 0.2rem;
            }
            .item-title{
                margin-left: 0.3rem;
            }
        }
        .select-item.detail{
            width: 100%;
        }
        .select-item:last-child{
            margin: 0px;
        }
    }
    .address-select.normal{
        .select-item.detail{
            margin-left: 0.5rem;
        }
    }
    .address-select.store{
        .address-select-content{
            margin-bottom: 0.6rem;
        }
    }
</style>