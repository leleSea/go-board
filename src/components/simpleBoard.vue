<!--  -->
<template>
    <div class='simple-board' ref="simple_board_page" :style="boardStyle">
        <!-- :style="{width: `${canvasSize}px`, height: `${canvasSize}px`}" -->
        <div class="simple-board-body" id="simple_board" ref="simple_board"></div>
    </div>
</template>

<script>
import wgo from '../wgo.js'
// import SgfParse from '../SgfParse.js'


    export default {
        name: '',
        props: {
            boardSize: Number,
            width: Number,
            boardStone: Array,
            lastPoint: Number
        },
        data() {
            return {
                board: null,
                // SgfParse: null,
                canvasSize: 0,
            };
        },
        methods: {
            init(){
                this.canvasSize = this.$refs['simple_board_page'].offsetWidth
                let options = {
                    width: 800,
                    height: 800,
                    boardSize: this.boardSizeCul,
                    section: {top:-0.5, right:-0.5, bottom:-0.5, left:-0.5}
                }
                let ele = this.$refs['simple_board']
                this.board = new WGo.Board(ele, options)
                // this.SgfParse = new SgfParse(options)
                // this.changeCoor(4)
                this.loadBoardStone()
                
            },
            changeCoor(n){
                if(n==4){
                    this.board.setSection({top:0,right:0,bottom:0,left:0});
                }else{
                    this.board.setSection({top:-0.5,right:-0.5,bottom:-0.5,left:-0.5});
                }
                this.board.coordSystem = n
                this.board.redraw();
            },
            coor1to2(n) {
                if(n == -1){
                    return {
                        x: -1,
                        y: -1
                    }
                }
                return {
                    x: n % this.boardSizeCul,
                    y: parseInt(n / this.boardSizeCul)
                };
            },
            coor2to1(x, y) {
                if(x == -1 || y == -1){
                    return -1
                }
                return y * this.boardSizeCul + x;
            },
            loadBoardStone(stone){
                stone = stone || this.boardStone || []
                let c = 1
                for(var i in stone){
                    if(stone[i] == 0) continue
                    let coor = this.coor1to2(i)
                    this.board.addObject({
                        x: coor.x, y: coor.y, c: stone[i], type: 'REALISTIC'
                    })
                }
                if(this.lastPoint != undefined){
                    let coor = this.coor1to2(this.lastPoint)
                    this.board.addObject({
                        x: coor.x, y: coor.y, type: 'CR'
                    })
                }
            },
            pageSizeChange(){
                let ele = this.$refs['simple_board']
                if(!ele) return
                let width = ele.offsetWidth
                // if(width < 800){
                //     width = 800
                // }
                this.board.setWidth(width)
                this.board.setWidth(height)
            },
        },
        created() {
            // this.GLOBAL.onresizeFunction.simpleBoard = this.pageSizeChange
        },
        components: {
        },
        computed: {
            boardSizeCul(){
                return this.boardSize || 19
            },
            boardStyle(){
                if(!this.width) return null
                let style = {
                    width: `${this.width}px`,
                    height: `${this.width}px`,
                }
                return style
            },
        },
        watch: {
            width(val){
            },
        },
        mounted() {
            this.init()
        },
        beforeCreate() {}, //生命周期 - 创建之前
        beforeMount() {}, //生命周期 - 挂载之前
        beforeUpdate() {}, //生命周期 - 更新之前
        updated() {}, //生命周期 - 更新之后
        beforeDestroy() {
        }, //生命周期 - 销毁之前
        destroyed() {}, //生命周期 - 销毁完成
        activated() {}, //如果页面有keep-alive缓存功能，这个函数会触发
    }
</script>
<style lang='less' >
    .simple-board{
        .simple-board-body{
            background: url(https://assets.19x19.com/img/board_bcg.jpg) no-repeat;
            background-size: 100% 100%;
            float: left;
            width: 100%;
            height: 100%;
            .wgo-board{
                width: 100% !important;
                height: 100% !important;
                canvas{
                    width: 100% !important;
                    height: 100% !important;
                    left: 0px;
                    top: 0px;
                }
            }
        }
    }
</style>