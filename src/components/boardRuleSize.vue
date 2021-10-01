<!--  -->
<template>
    <div class='board-rule-komi'>
        <el-select class="item-i-body input-select-area-bcg" :class="{'is-disabled': disabled}" v-model="sizeOpt.value"
        @change="sizeChange"
        :disabled.sync="disabled"
        :popper-append-to-body="false"
        :popper-class="`play-ready-game-set-s handicap ${theme} input-select-area-bcg`">
            <el-option
            v-for="item in sizeOpt.data"
            :key="item.name"
            :label="$t(item.name)"
            :value="$t(item.value)">
                <span>{{$t(item.name)}}</span>
            </el-option>
        </el-select>
    </div>
</template>

<script>
    export default {
        name: 'boardRuleKomi',
        props: {
            theme: String,
            disabled: {
                type: Boolean,
                default: true
            }
        },
        data() {
            return {
                sizeOpt: {
                    value: 19,
                    data: [
                        // { value: 19, label: '19x19', name: '棋盘大小：19x19' }
                    ]
                }
            };
        },
        methods: {
            sizeChange(e){
                this.$emit('change', e)
            },
            setBoardSize(size){
                this.sizeOpt.value = size
            }
        },
        created() {
            this.sizeOpt.data = this.GLOBAL.size
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