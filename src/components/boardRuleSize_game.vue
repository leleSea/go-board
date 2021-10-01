<!--  -->
<template>
    <div class='board-rule-komi size'>
        <el-select class="item-i-body input-select-area-bcg" :class="{'is-disabled': disabled}" v-model="sizeVal"
        @change="sizeChange"
        :disabled.sync="disabled"
        :popper-append-to-body="false"
        :popper-class="`play-ready-game-set-s handicap ${theme} input-select-area-bcg`">
            <div class="board-rule-size-prefix" slot="prefix">
                {{$t(sizeSelected.name)}}
            </div>
            <el-option
            v-for="item in sizeList"
            :key="item.value"
            :label="$t(item.name)"
            :value="$t(item.value)">
                <span>{{$t(item.name)}}</span>
            </el-option>
        </el-select>
    </div>
</template>

<script>
    import gameClass from '../API/game'


    export default {
        name: 'boardRuleKomi',
        props: {
            theme: String,
            disabled: {
                type: Boolean,
                default: true
            },
            value: Number
        },
        data() {
            return {
                _game: null,
                gameListOr: {},
                sizeOpt: {
                    value: 19,
                    data: [
                    ]
                },
                sizeVal: 19,
            };
        },
        methods: {
            sizeChange(e){
                this.sizeVal = Number(e)
                this.$emit('change', e)
            },
            setBoardSize(size){
                this.sizeVal = Number(size)
            },
            async pageInit(){
                let list = await this._game.getGameList()
                console.log(list)
                if(!list) return
                this.gameListOr = list
            },
        },
        created() {
            this._game = new gameClass()
            this.pageInit()
            // this.sizeOpt.data = this.GLOBAL.size
        },
        components: {
        },
        computed: {
            sizeList(){
                let data = this.gameListOr || {}
                if(!Object.keys(data).length) return
                let rd = []
                for(var i in data){
                    let size = Number(i)
                    rd.push({
                        value:  size,
                        label: `${size}x${size}`,
                        name: `${size}路棋盘`
                    })
                }
                console.log(rd)
                return rd
            },
            sizeSelected(){
                let list = this.sizeList
                let val = this.sizeVal
                let rd = {}
                for(var i in list){
                    if(list[i].value == val){
                        rd = list[i]
                        break
                    }
                }
                return rd
            },
        },
        watch: {
            value: {
                handler(val){
                    console.log(val)
                    this.sizeVal = Number(val)
                },
                deep: true,
                immediate: true
            },
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
    .board-rule-komi.size{
        .el-input__inner{
            display: none;
        }
        .el-input__prefix{
            width: 100%;
            left: -1px;
        }
        .board-rule-size-prefix{
            width: 100%;
            text-align: center;
        }
        .el-input__prefix, .el-input__suffix{
            color: inherit;
        }
    } 
    
</style>