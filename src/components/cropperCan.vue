<!--  -->
<template>
<!--   -->
<!-- @touchend="cropMouseUp"  -->
    <div class='cropper-can' ref="cropperCan" 
    :class="canvasBoxClass"
    @mousedown="cropMouseDown" 
    @mouseup="cropMouseUp" 
    @mousemove="cropMouseMove"
    @mouseleave="cropMouseLeave"
    ></div>
     <!-- @touchstart="cropMouseDown"
    @touchend="cropMouseUp"
    @touchmove="cropMouseMove" -->
</template>

<script>
    export default {
        name: 'cropperCan',
        props: {
            coorPoint: Array,
            coors: Array,
            imgHeight: Number,
            imgWidth: Number,
            offsetLeft: Number,
            offsetTop: Number,
        },
        data() {
            return {
                width: null,
                height: null,
                movePointSize: 7,
                touchStatus: {
                    active: false,
                    startX: null,
                    startY: null
                },
                touchMoveCoor: {
                    x: null,
                    y: null
                },
                points: [],
                canvasElement: null,
                coorsCopy: []
            };
        },
        methods: {
            pageInit(){
                let canvas = document.createElement('canvas')
                let box = this.$refs['cropperCan']
                this.context = canvas.getContext('2d')
                if(!box) return

                let w = box.offsetWidth, h = box.offsetHeight
                canvas.width = w, canvas.height = h
                this.canvasElement = canvas
                this.$refs['cropperCan'].innerHTML = ''
                this.$refs['cropperCan'].appendChild(canvas)
                this.areaChange()
            },
            areaInit(){

            },
            areaChange(coors){
                if(!this.context) return
                coors = coors || this.coorsCopy
                this.coorsPointSet(coors)
                this.drawPoint()
            },
            drawPoint(coors){
                this.clearCanvas()

                coors = coors || this.points
                if(!coors || !coors.length) return
                this.context.beginPath()
                this.context.fillStyle='rgba(55, 131, 206, 0.2)'
                this.context.moveTo(coors[0].x, coors[0].y)
                let k = 0
                for(var i in coors){
                    k = k % coors.length
                    this.context.lineTo(coors[k].x, coors[k].y)
                    k++
                }
                this.context.fill()
                this.context.beginPath()
                this.context.fillStyle='rgba(55, 131, 206, 0.7)'
                for(var i in coors){
                    this.context.moveTo(coors[i].x, coors[i].y)
                    this.context.arc(coors[i].x, coors[i].y, this.movePointSizeCul, 0, 2 * Math.PI, true)
                }
                this.context.fill()
            },
            coorsPointSet(coors){
                coors = coors || this.coorsCopy
                let delta = this.movePointSizeCul
                let points = []
                for(var i = 0; i < coors.length; i = Number(i) + 2){
                    let tem = {
                        minX: coors[i] - delta,
                        maxX: coors[i] + delta,
                        minY: coors[i + 1] - delta,
                        maxY: coors[i + 1] + delta,
                        x: coors[i],
                        y: coors[i + 1]
                    }
                    points.push(tem)
                }
                this.points = points
            },
            clearCanvas(){
                let ele = this.canvasElement
                if(!ele) return
                this.context.clearRect(0, 0, ele.offsetWidth, ele.offsetWidth)
            },
            cropMouseDown(e){
                let touchCoors = this.getTouchXY(e)
                this.touchStatus = {
                    active: true,
                    startX: touchCoors.x,
                    startY: touchCoors.y,
                }
            },
            cropMouseUp(){
                this.touchStatus = {
                    active: false,
                    startX: null,
                    startY: null,
                }
                this.coorsPointSet()
            },
            cropMouseLeave(){
                this.touchMoveCoor.x = null
                this.touchMoveCoor.y = null
            },
            cropMouseMove(e){
                let co = this.getTouchXY(e)
                let x = co.x, y = co.y
                this.touchMoveCoor.x = x
                this.touchMoveCoor.y = y
                if(this.isCoors === null) return
                let index = this.isCoors
                let i = index * 2, k = index * 2 + 1
                this.coorsCopy[i] = x
                this.coorsCopy[k] = y
                this.$emit('coorsCopyUpdate', this.coorsCopy)
                // let coor = this.pointsCul[index]
                // let points = this.GLOBAL.deepCopy(this.pointsCul)
                // if(!coor) return
                // points[index].x = x
                // points[index].y = y
                this.drawPoint(this.pointsCulca())
                this.$forceUpdate()
            },
            getTouchXY(e){
                if(e.offsetX != undefined) return {x: e.offsetX, y: e.offsetY}
                return {
                    x: e.touches[0].clientX - this.offsetLeftCul,
                    y: e.touches[0].clientY - this.offsetTopCul
                }
            },
            pointsCulca(){
                let coors = this.coorsCopy
                let delta = this.movePointSizeCul
                let points = []
                for(var i = 0; i < coors.length; i = Number(i) + 2){
                    let tem = {
                        minX: coors[i] - delta,
                        maxX: coors[i] + delta,
                        minY: coors[i + 1] - delta,
                        maxY: coors[i + 1] + delta,
                        x: coors[i],
                        y: coors[i + 1]
                    }
                    points.push(tem)
                }
                return points
            },
            refresh(){
                this.coorsCopy = this.GLOBAL.deepCopy(this.coors)
                this.coorsPointSet()
                this.drawPoint()
            },
        },
        created() {

        },
        components: {
        },
        computed: {
            canvasBoxClass(){
                if(this.isCoorsForMove) return 'is-coors'
                return null
            },
            offsetLeftCul(){
                return this.offsetLeft || 19
            },
            offsetTopCul(){
                return this.offsetTop || 165
            },
            pointsCul(){
                let coors = this.coorsCopy
                let delta = this.movePointSizeCul
                let points = []
                for(var i = 0; i < coors.length; i = Number(i) + 2){
                    let tem = {
                        minX: coors[i] - delta,
                        maxX: coors[i] + delta,
                        minY: coors[i + 1] - delta,
                        maxY: coors[i + 1] + delta,
                        x: coors[i],
                        y: coors[i + 1]
                    }
                    points.push(tem)
                }
                return points
            },
            coorsCul(){
                return this.coorsCopy && this.coorsCopy.length ? this.coorsCopy : []
            },
            isCoorsForMove(){
                
                let touchMoveCoor = this.touchMoveCoor
                let x = touchMoveCoor.x, y = touchMoveCoor.x
                let points = this.points || [], f = null
                for(var i in points){
                    if(x >= points[i].minX && x <= points[i].maxX && y >= points[i].minY && y <= points[i].maxY){
                        f = i
                        break
                    }
                }
                return f
            },
            isCoors(){
                let touchStatus = this.touchStatus
                if(!touchStatus.active) return null
                let x = touchStatus.startX, y = touchStatus.startY
                let points = this.points || [], f = null
                for(var i in points){
                    if(x >= points[i].minX && x <= points[i].maxX && y >= points[i].minY && y <= points[i].maxY){
                        f = i
                        break
                    }
                }
                return f
            },
            imgSize(){
                let width = this.imgWidth || 0
                let height = this.imgHeight || 0
                
                return {width: width, height: height}
            },
            movePointSizeCul(){
                return this.movePointSize || 7
            },
        },
        watch: {
            imgSize: {
                handler(val){
                    if(val && val.width && val.height) this.pageInit()
                    this.movePointSize = val.width * 0.02
                },
                immediate: true,
                deep: true
            },
            coors: {
                handler(val){
                    this.coorsCopy = this.GLOBAL.deepCopy(val)
                    if(!val || !val.length) this.coorsCopy = []
                    this.areaChange(val)
                },
                immediate: true,
                deep: true
            },
            coorsCopy: {
                handler(val){
                    this.$emit('coorsCopyUpdate', val)
                },
                immediate: true,
                deep: true
            }
        },
        mounted() {
            // this.pageInit()
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
    .cropper-can{
        position: absolute;
        top: 0px;
        left: 0px;
        width: 100%;
        height: 100%;
        z-index: 999;
        canvas{
            width: 100%;
            height: 100%;
        }
    }
    .cropper-can.is-coors{
        canvas{
            cursor: pointer;
        }
    }
</style>