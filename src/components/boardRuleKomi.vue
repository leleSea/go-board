<!--  -->
<template>
    <div class='board-rule-komi'>
        <el-select class="item-i-body input-select-area-bcg el-select-with-prefix" v-model="komiOpt.value"
        :class="{'is-disabled': disabled}"
        :disabled="disabled"
        @change="komiChange"
        :popper-append-to-body="false"
        :popper-class="`play-ready-game-set-s handicap ${theme} input-select-area-bcg`">
            <template v-slot:prefix>
                <div class="select-box" slot="prefix">
                    <span>{{$t(selectedValue.name)}}</span>
                </div>
            </template>
            <el-option
            v-for="item in komiOpt.data"
            :key="item.name"
            :value="item.value">
                <span>{{$t(item.name)}}</span>
            </el-option>
        </el-select>
        <div class="komi-spec-box">
            <help :img.sync="helpImg" theme="light" :message.sync="komiHelpMsg" placement="left" popperClass="engine-level-help-tooltip"></help>
        </div>
    </div>
</template>

<script>
    import help from '../views/play/levelHelp.vue'

    export default {
        name: 'boardRuleKomi',
        props: {
            theme: String,
            disabled: Boolean
        },
        data() {
            return {
                komiHelpMsgData: null,
                komiHelpMsg: '',
                komiOpt: {
                    value: 7.5,
                    data: []
                }
            };
        },
        methods: {
            komiChange(e){
                e = e || this.komiOpt.value
                if(!isNaN(Number(e))) this.komiOpt.value = e
                this.$emit('change', e)
                this.localSet()
            },
            setKomi(komi){
                if(isNaN(Number(komi))) return
                this.komiOpt.value = Number(komi)
                this.komiChange(komi)
            },
            setKomiTemplate(komi){
                if(isNaN(Number(komi))) return
                this.komiOpt.value = komi
            },
            localSet(){
                let komi = this.komiOpt.value
                // this.GLOBAL.setItem({
                //     komiData: komi
                // })
                this.GLOBAL.setStoreItem({
                    komiData: komi
                })
            },
            localInit(){
                // let komi = this.GLOBAL.getLocalItem('komiData') || 7.5
                let komi = this.$store.state.komiData || 7.5
                if(isNaN(Number(komi))) return
                this.komiOpt.value = Number(komi)
            },
            async komiHelpMsgInit(){
                let path = this.GLOBAL.assetsUrl + `/txt/spec.json`
                // let path = `${process.env.BASE_URL}txt/spec.json`
                let res = await this.GLOBAL.getStaticData(path)
                if(!res) return
                this.komiHelpMsgData = res.engine_komi.content
                this.komiHelpMsgHandle()
            },
            komiHelpMsgHandle(data){
                data = data || this.komiHelpMsgData
                let html = ` <div class="komi-help-message">
                                <div class="msg-body">`
                for(var i in data){
                    let tem = `<div class="msg-item">
                                    <h1 class="title">${this.$i18n.t(data[i].title)}</h1>`
                    let content = data[i].content
                    for(var j in content){
                        tem += `<p class="content">
                                    ${this.$i18n.t(content[j])}
                                </p>`
                    }
                    tem += '</div>'
                    html += tem
                }
                html += `</div>
                    </div>`
                this.komiHelpMsg = html
            },
        },
        created() {
            this.komiHelpMsgInit()
            this.komiOpt.data = this.GLOBAL.deepCopy(this.GLOBAL.komi)
            this.localInit()
        },
        components: {
            help
        },
        computed: {
            selectedValue(){
                let list = this.komiOpt.data
                let val = this.komiOpt.value
                let data = {}
                for(var i in list){
                    if(list[i].value == val){
                        data = list[i]
                        break
                    }
                }
                return data
            },
            helpImg(){
                return `${this.GLOBAL.assetsUrl}/img/l1_${this.theme}.png`
            },
        },
        watch: {},
        mounted() {
            this.komiChange()
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
    .board-rule-komi{
        display: flex;
        align-items: center;
        .komi-spec-box{
            margin-left: 0.5rem;
            .help{
                position: static;
                width: 1rem;
            }   
        }
    }
</style>