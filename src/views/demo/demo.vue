<!--  -->
<template>
    <div class='demo-page'>
        
        <div class="main-board engine-body-use board-element">
            <board ref="board" 
            @update="update"
            @takeFun="takeFun"></board>
            <div class="board-control">
                <boardMove ref="boardMove" 
                theme="light"
                :position.sync="position" 
                :step.sync="step" 
                @takeFun="takeFun" 
                ></boardMove>
            </div>
            <div class="board-fun">
                <el-button @click="clearBoard">
                    <span class="txt">清空</span>
                </el-button>
                <el-button @click="loadSgfOn">
                    <span class="txt">上传SGF</span>
                </el-button>
                <el-button @click="loadSituation">
                    <span class="txt">上传手顺</span>
                </el-button>
                <el-button @click="download">
                    <span class="txt">下载棋谱</span>
                </el-button>
            </div>
        </div>
        <leConfirm ref="leConfirm">
            <div class="load-situation" slot="message">
                <el-input type="textarea" v-model="situation"></el-input>
            </div>
        </leConfirm>
    </div>
</template>

<script>
    import board from '../../components/board.vue'
    import boardMove from '@/components/boardMove.vue'
    import funhand from '@/utility/funhand'

    export default {
        name: '',
        props: {},
        data() {
            return {
                _funhand: null,
                position: 0,
                step: 0,
                situation: null
            };
        },
        methods: {
            takeFun(opt){
                let fun = opt.fun
                if(this[fun]) this[fun](opt.data)
            },
            update(options){
                for(var i in options){
                    this[i] = options[i]
                }
            },
            boardHasInit(){
                this.$refs['board'].board.board.addEventListener('mouseleave', this.removeOutline)
                this.$refs['board'].board.board.addEventListener("mousemove",this.stoneOver);
                this.$refs['board'].board.board.addEventListener("click",this.playByclick);
            },
            removeOutline(){
                this.$refs['board'].removeOutline()
            },
            stoneOver(x, y){
                this.$refs['board'].stoneOver(x, y)
            },
            playByclick(x, y){
                this.$refs['board'].play(x, y)
            },
            clearBoard(){
                this.$refs['board'].clearBoard()
            },
            jumpTo(p){
                this.$refs['board'].jumpTo(p)
            },
            changePos(e){
                if(isNaN(e)) e = this.$refs['board'].board.position
                this.$refs['board'].jumpToByposRange(e)
            },
            loadSgfOn(){
            this.$refs['board'].loadSgfOn()
        },
            async loadSituation(){
                let res = await this.$refs['leConfirm'].open({
                    button: [
                        {name: '确认', label: 0},
                        {name: '取消', label: 1, type: 'cancel'},
                    ]
                })
                res = res || {}
                if(res.label != 0) return
                console.log(this.situation)
                let data = this.situation || ''
                data = data.split(',')
                this.$refs['board'].loadSgf(data)
            },
            download(){
                this.$refs['board'].downloadSgfOn()
            },

        },
        created() {
            this._funhand = new funhand()
        },
        components: {
            board,
            boardMove
        },
        computed: {
            situationCul(){
                if(!this.$refs['board']) return ''
                let {position} = this
                let data = this.$refs['board'].getSituation(position)
                console.log(data)
                return data
            },
        },
        watch: {
            step: {
                handler(val){
                    console.log(val)
                },
                deep: true,
                immediate: true
            },
            position: {
                handler(val){
                    if(!this.$refs['board']) return
                    let {position} = this
                    let data = this.$refs['board'].getSituation(position)
                    this.situation = data
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
    .demo-page{
        height: 100%;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        .board-element{
            width: 50vh;
            height: 50vh;
        }
        .board-control{
            margin-top: 1rem;
        }
        .board-fun{
            margin-top: 1rem;
            display: flex;
            align-items: center;
            justify-content: center;
            .el-button{
                padding: 0px;
                width: 5rem;
                height: 2rem;
                display: flex;
                align-items: center;
                justify-content: center;
            }
        }
        .load-situation{
            margin: 1rem 0px;
            .el-textarea__inner{
                height: 10rem;
            }
        }
    }
</style>