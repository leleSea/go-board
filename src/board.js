import wgo from './wgo.js'
import global from './global.js'
import SgfParse from './SgfParse.js'

var delta = [
    [0, 1],
    [0, -1],
    [-1, 0],
    [1, 0]
]
export default class board{
    constructor(ele, options){
        options.section = {top:-0.5,right:-0.5,bottom:-0.5,left:-0.5}
        this.board = new WGo.Board(ele, options)
        this.initData(options)
        this.SgfParse = new SgfParse(options)
        this.ldpLabelDisplay = options.ldpLabelDisplay || true
        // this.board.addEventListener('mouseleave', this.removeOutline.bind(this))
        
    }
    set_ldpLabel_display(val){
        this.ldpLabelDisplay = val
    }
    copy(obj){
        let type =  null
        if(global.isArray(obj)){
            type = []
        }else if(global.isObject(obj)){
            type = {}
        }else{
            return obj
        }
        return Object.assign(type, obj)
    }
    isInBoard(x, y){
        if (x < 0 || x >= this.boardSize || y < 0 || y >= this.boardSize) {
            return false;
        }
        return true;
    }
    hasStone(x, y){
        let stone = this.stone
        return stone[this.coor2to1(x, y)]
    }
    coor1to2(n) {
        if(n == -1){
            return {
                x: -1,
                y: -1
            }
        }
        return {
            x: n % this.boardSize,
            y: parseInt(n / this.boardSize)
        };
    }
    coor2to1(x, y) {
        if(x == -1 || y == -1){
            return -1
        }
        return y * this.boardSize + x;
    }
    StoN(s){
        return s.charCodeAt() - 97
    }
    NtoS(n){
        return String.fromCharCode(n + 97)
    }
    coorNtoS(x, y, coorSys){
        coorSys = coorSys || 1
        var coor={};
        if(x && !y) coor=this.coor1to2(x);
        if(x == -1 || y == -1) return {x: 'pass', y: ''}
        else if(x != 0 && !x) return false
        else coor.x = x, coor.y = y;
        switch(coorSys){
            case 1:
                if(coor.x>7) coor.x+=1;
                return {
                    x:String.fromCharCode(coor.x+65),
                    y:this.boardSize-coor.y
                }
            case 2:
                return {
                    x:coor.x+1,
                    y:coor.y+1
                }
            case 3:
                return {
                    x:String.fromCharCode(coor.x+65),
                    y:coor.y+1
                }
        }
    }
    coorStoN(x, y, coorSys){
        coorSys = coorSys || 1
        switch(coorSys){
            case 1:
                let xr = x.charCodeAt() - 65;
                if(xr > 7) xr--;
                return {
                    x: xr,
                    y: this.boardSize-y
                }
            case 2:
                return {
                    x: x - 1,
                    y: y - 1
                }
            case 3:
                return {
                    x: x.charCodeAt() - 65,
                    y: y - 1
                }
        }
    }
    splitGtp(s){
        if(s == 'pass' || s == 'Pass' || s == 'PASS'){
            return {x: -1, y: -1}
        }
        if(s == 'KO_T' || s == 'KO_R' || s == 'KO_D'){
            return {x: -1, y: -1}
        }
         let coor = s.toUpperCase()
         let x = coor[0], y = ''
         for(var i = 1; i < s.length; i++){
             y += String(s[i])
         }
         return this.coorStoN(x, y, 1);
     }
    setStoneInBoardSync(options){
        options = options || {}
        let x = options.x,
            y = options.y,
            remove = options.remove,
            txt = options.txt || null,
            stone = options.stone || this.cache[this.cache.length - 1],
            now = options.now || -this.step[this.step.length - 1].c
        let removeData = global.deepCopy(this.step[this.step.length - 1].remove)
        removeData.b = Number(removeData.b) + Number(remove.b)
        removeData.w = Number(removeData.w) + Number(remove.w)
        this.playDataCheck(this.coor2to1(x, y))
        this.step.push({
            x: x, y: y, c: now, label: this.getLabel(), coor: this.coor2to1(x, y), tryPlay: this.tryPlayData.active, remove: global.copy(removeData)
        })
        this.cache.push(global.copy(stone))
        this.step[this.step.length - 1].position = this.step.length - 1
    }
    setStoneInBoard(options){
        options = options || {}
        let x = options.x,
            y = options.y,
            remove = options.remove,
            txt = options.txt || null
        if(this.isInBoard(x, y)){
            this.stone[this.coor2to1(x, y)] = this.now
            // this.board.addObject({x: x, y: y, c: this.now, type: 'REALISTIC'})
        }
        this.remove.b = Number(this.remove.b) + Number(remove.b)
        this.remove.w = Number(this.remove.w) + Number(remove.w)
        this.playDataCheck(this.coor2to1(x, y))
        this.step.push({
            x: x, y: y, c: this.now, label: this.getLabel(), coor: this.coor2to1(x, y), tryPlay: this.tryPlayData.active, remove: global.copy(this.remove)
        })
        this.cache.push(global.copy(this.stone))
        this.position = this.step.length - 1
        this.now = -this.now;
        this.step[this.step.length - 1].position = this.getStoneNum()
    }
    stoneLabelPlayCheck(options){
        if(this.modal == 'ldp') return this.stoneLabelPlayCheckLdp(options)
        options = options || {}
        let x = options.x || this.step[this.position - 1].x,
            y = options.y || this.step[this.position - 1].y,
            color = options.color || this.step[this.position - 1].c,
            txt = options.txt || this.getStoneNum() - 1,
            label = options.label || this.step[this.position - 1].label,
            tryPlay = options.tryPlay || this.step[this.position - 1].tryPlay
        
        if(this.tryPlayData.active && tryPlay){
            if(!this.stone[this.coor2to1(x, y)]) return
            this.board.addObject({x: x, y: y, c: color, type: 'CT', txt: txt})
        }
        if(this.stoneLabel != 1 || label != 1) return
        if(!this.stone[this.coor2to1(x, y)]) return
        this.board.addObject({x: x, y: y, c: color, type: 'CT', txt: txt})
    }
    setStoneLabel(options, or){
        if(this.modal == 'ldp') return this.setStoneLabelLdp(options, 'setStoneLabel')
        options = options || {}
        let x = options.x != undefined ? options.x : this.step[this.position].x,
            y = options.y != undefined ? options.y : this.step[this.position].y,
            type = options.type == undefined ? this.stoneLabel == 0? 'CR' : 'CT' : options.type,
            txt = options.txt == undefined ? this.getStoneNum() : options.txt,
            active = options.active == undefined ? true : options.active ,
            tryPlay = options.tryPlay == undefined ? this.step[this.position].tryPlay : options.tryPlay,
            position = options.position == undefined ? this.step[this.position].position : options.position
        this.board.removeObject({x: x, y: y, type: 'CR'})
        this.board.removeObject({x: x, y: y, type: 'CT'})
        if(this.modal == 'ldp') return
        if(tryPlay && !this.branch.active){
            this.board.addObject({x: x, y: y, type: 'CT', active: active, txt: position})
        }else{
                // if(!this.stone[this.coor2to1(x, y)]) return
            if(this.specStoneLabel == 'ldp' && !this.tryPlayData.active){
                return
            }
            this.board.addObject({x: x, y: y, type: type, active: active, txt: txt})
        }
    }
    setStoneLabelLdp(options, or){
        options = options || {}
        // let position = options.position === undefined ? this.step[this.position].position : options.position
        let position = options.position === undefined ? this.position : options.position
        if((options.x === undefined || options.y === undefined) && !this.step[position - 1]) return
        let x = options.x !== undefined ? options.x : this.step[position].x,
            y = options.y !== undefined ? options.y : this.step[position].y,
            type = options.type === undefined ? this.stoneLabel == 0? 'CR' : 'CT' : options.type,
            txt = options.txt === undefined ? this.getStoneNum() : options.txt,
            active = options.active === undefined ? true : options.active ,
            tryPlay = options.tryPlay === undefined ? (this.step[this.position] ? this.step[this.position].tryPlay : null) : options.tryPlay
        this.board.removeObject({x: x, y: y, type: 'CR'})
        this.board.removeObject({x: x, y: y, type: 'CT'})
        if(tryPlay){
            this.board.addObject({x: x, y: y, type: 'CT', active: active, txt: txt})
        }
    }
    removeStoneLabelLdp(options){
        options = options || {}
        let position = options.position === undefined ? this.position : options.position
        if((options.x === undefined || options.y === undefined) && !this.step[position - 1]) return
        let type = options.type || this.stoneLabel == 0? 'CR' : 'CT',
            x = options.x === undefined ? this.step[position - 1].x : options.x,
            y = options.y === undefined ? this.step[position - 1].y : options.y,
            stone = options.stone || this.cache[this.position] || [],
            opt
        if(this.tryPlayData.active){
            if(this.step[this.minJump].x == x && this.step[this.minJump].y == y) return
        }
        if(this.tryPlayData.active) type = 'CT'
        if(position >= 2){
            if(x == 1 && y == 16){
            }
            opt = {
                x: x,
                y: y,
                type: type
            }
            this.board.removeObject(opt)
        }
        let coor = this.coor2to1(x, y)
        if(stone[coor]){
            this.stoneLabelPlayCheckLdp(options)
        }
        // this.stoneLabelPlayCheckLdp(options)
    }
    stoneLabelPlayCheckLdp(options){
        options = options || {}
        let position = options.position === undefined ? this.position : options.position
        let x = options.x === undefined ? this.step[position - 1].x : options.x,
            y = options.y === undefined ? this.step[position - 1].y : options.y,
            color = options.color || this.step[position - 1].c,
            txt = options.txt || this.getStoneNum() - 1,
            label = options.label || this.step[position - 1].label,
            tryPlay = options.tryPlay || this.step[position - 1].tryPlay

        if(this.tryPlayData.active && tryPlay){
            if(x == 1 && y == 16){
            }
            this.board.addObject({x: x, y: y, c: color, type: 'CT', txt: txt})
        }
        // if(this.stoneLabel != 1 || label != 1) return
        // this.board.addObject({x: x, y: y, c: color, type: 'CT', txt: txt})
    }
    removeStoneLabel(options){
        if(this.modal == 'ldp') return this.removeStoneLabelLdp(options)
        // x, y, type
        options = options || {}
        let type = options.type || this.stoneLabel == 0? 'CR' : 'CT',
            x = options.x || this.step[this.position - 1].x,
            y = options.y || this.step[this.position - 1].y,
            opt
        if(this.tryPlayData.active){
            if(this.step[this.minJump].x == x && this.step[this.minJump].y == y) return
        }
        if(this.tryPlayData.active) type = 'CT'
        if(this.position >= 2){
            opt = {
                x: x,
                y: y,
                type: type
            }
            this.board.removeObject(opt)
        }
    }
    changeLabel(label){
        label = label == undefined ? (this.stoneLabel + 1) % 3 : label
        if(label == this.stoneLabel) return
        let step = global.copy(this.step)
        // let sp = step.pop()
        let sp = step[this.position]
        this.removeStoneLabel({
            x: sp.x,
            y: sp.y
        })
        this.stoneLabel = label
        this.refreshStoneLabel()
        this.setStoneLabel({
            x: sp.x,
            y: sp.y,
            tryPlay: sp.tryPlay,
            position: sp.position
        })
        
    }
    refreshStoneLabel(){
        let type = this.stoneLabel == 0? 'CR' : 'CT'
        let step = global.copy(this.step)
        // this.step[this.step.length - 1].label = this.stoneLabel
        // let spL = step.pop()
        let c = 1
        for(var i in step){
            if(i > this.position){
                break
            }
            c = -c
            this.board.removeObject({
                x: step[i].x,
                y: step[i].y,
                type: 'CT',
            })
            this.step[i].label = this.stoneLabel
            if(this.stoneLabel != 1) continue
            if(!this.stone[this.coor2to1(step[i].x, step[i].y)] || 
            step[i].x == -1 || step[i].y == -1) continue
            // if(i > this.position){
            //     break
            // }
            if(i < this.minNum) continue
            if(!this.tryPlayData.active){
                this.board.addObject({
                    x: step[i].x,
                    y: step[i].y,
                    c: c,
                    type: type,
                    txt: i
                })
            }else{
                if(step[i].tryPlay && !this.branch.active){
                    this.board.addObject({
                        x: step[i].x,
                        y: step[i].y,
                        c: c,
                        type: 'CT',
                        txt: step[i].position || i
                    })
                }
            }
        }
        this.sgfMoveSelectRefresh()
    }
    checkCoorForOver(x, y){
        if(!this.isInBoard(x, y)) return false
        if(this.stone[this.coor2to1(x, y)] != 0) return false
        return true
    }
    checkCoorForPlay(x, y){
        if(!this.isInBoard(x, y)){
            return false
        }
        if(this.stone[this.coor2to1(x, y)] != 0){
            return false
        }
        // if(this.isDeath(x, y, this.now)) return false
        return true
    }
    checkPosition(){
        if(this.position == this.step.length - 1) return
        let p = this.position, s = this.step.length
        this.step.splice(Number(p) + 1, s - p)
        this.cache.splice(Number(p) + 1, s - p)
    }
    //落子
    playByclick(x, y, params){
        params = params || {}
        let opt = this.play(x, y)
        if(!opt.isOk) return false
        this.timeReadReset()
        if(opt.remove && (opt.remove.b > 0 || opt.remove.w > 0)){
            this.removeVoicePlay(Number(opt.remove.b) + Number(opt.remove.w))
        }
        if(!params.noneVoice) this.stoneVoicePlay()
        opt.c = this.now
        this.setStoneInBoard(opt)
        // this.board.addObject({x: x, y: y, c: opt.c, type: 'REALISTIC'})
        this.addStone({x: x, y: y, c: opt.c, type: 'REALISTIC'})
        this.removeStoneLabel()
        this.stoneLabelPlayCheck()
        this.setStoneLabel(null, 'play')
        return true
    }
    koTCheck(){
        let position = this.position
        let step = this.step
        if(position <= 1) return false
        let lastStep = step[position] || {}
        let nextStep = step[position - 1] || {}
        let key = lastStep.c == 1 ? 'w' : 'b'
        let lastRemove = lastStep.remove || {}
        lastRemove = lastRemove[key] || 0
        let nextRemove = nextStep.remove || {}
        nextRemove = nextRemove[key] || 0
        if(lastRemove - nextRemove != 1) return false
        let stone = this.stone
        let x = lastStep.x, y = lastStep.y, c = lastStep.c
        let q = 0, sameColor = 0
        for (var i in delta) {
            let nx = x + delta[i][0]
            let ny = y + delta[i][1]
            if (!this.isInBoard(nx, ny)) {
                continue
            }
            if(!stone[this.coor2to1(nx, ny)]){
                q++
                continue
            }
            if(stone[this.coor2to1(nx, ny)] == c) sameColor++
        }
        if(q != 1 || sameColor > 0) return false
        return true
    }
    playBySync(x, y){
        if(x == -1 && y == -1) return this.passBySync(x, y)
        if(this.position == this.step.length - 1 && !this.area.active && !this.branch.active){
            return this.playByclick(x, y)
        }
        if(!this.isInBoard(x, y) && x != -1 && y != -1){
            return
        }
        let stone = global.deepCopy(this.cache[this.cache.length - 1])
        if(stone[this.coor2to1(x, y)] != 0){
            return
        }
        let now = -this.step[this.step.length - 1].c
        let ban = this.isBan({
            x: x,
            y: y,
            c: now,
            stone: stone
        })
        if(!ban.isOk) return
        stone[this.coor2to1(x, y)] = now
        let txt = this.checkPlayTxt()
        let removeData = {
            b:0,
            w:0
        }, color
        for(var i in ban.remove){
            color = ban.remove[i].c == 1 ? 'b' : 'w'
            removeData[color]++
            stone[this.coor2to1(ban.remove[i].x, ban.remove[i].y)] = 0
        }
        let opt = {
            x: x,
            y: y,
            remove: removeData,
            txt: txt,
            stone: stone
        }
        this.setStoneInBoardSync(opt)
        return ban
    }
    //落子声音
    stoneVoicePlay(){
        global.playAction('stone')
    }
    removeVoicePlay(num){
        let timeout = 300
        if(this.branchPlaySet) timeout = 1000
        this.branchPlaySet = false
        global.playAction('remove', num, {timeout: timeout})
    }
    readVoicePlay(second){
        global.playAction('read', second)
    }
    timeoutRead(){
        global.playAction('timeout')
    }
    readLast(num){
        global.playAction('last', num)
    }
    readStart(){
        global.playAction('start')
    }
    readGameStart(){
        global.playAction('gameStart')
    }
    branchVoicePlay(num){
        this.branchPlaySet = true
        global.playAction('branch', num)
        setTimeout(() => {
            this.branchPlaySet = false
        }, 1000);
    }
    playActionForMove(){
        global.playAction('branchMove')
    }
    areaOpenVoicePlay(){
        global.playAction('tool', 'area')
    }
    branchOpenVoice(){
        global.playAction('tool', 'branch')
    }
    propOpenVoice(){
        global.playAction('tool', 'prop')
    }
    back(num){
        let p = this.position
        if(p == 0) return
        for(var i = 1; i <= num; i++){
            if(this.step.length <= 1) break
            let coor = this.step.pop()
            this.cache.pop()
        }
        
        this.stone = global.deepCopy(this.cache[this.cache.length - 1])
        this.position = this.step.length - 1
        this.now = -this.step[this.step.length - 1].c
        this.setStoneLabel()
        this.refreshBoard({
            position: this.position
        })
        this.remove = global.deepCopy(this.step[this.position].remove)
    }
    backForChange(num){
        let p = this.position
        if(p == 0) return
        this.step.splice((1 + p), this.step - (1 + p))
        this.cache.splice((1 + p), this.step - (1 + p))
        for(var i = 1; i <= num; i++){
            if(this.step.length <= 1) break
            let coor = this.step.pop()
            this.cache.pop()
        }
        
        this.stone = global.deepCopy(this.cache[this.cache.length - 1])
        this.position = this.step.length - 1
        this.now = -this.step[this.step.length - 1].c
        this.setStoneLabel()
        this.refreshBoard({
            position: this.position
        })
        this.remove = global.deepCopy(this.step[this.position].remove)
    }
    backSync(num){
        if(this.position == this.step.length - 1 && !this.area.active && !this.branch.active) return this.back(num)
        let p = this.step.length - 1
        if(p == 0) return
        let mNum = 0
        if(p - num < this.position){
            mNum = this.position - (p - num)
            num = num - mNum
        }
        for(var i = 1; i <= num; i++){
            if(this.step.length <= 1) break
            let coor = this.step.pop()
            this.cache.pop()
        }
        if(mNum > 0) this.back(mNum)
        this.remove = global.deepCopy(this.step[this.position].remove)
    }
    getLabel(){
        return this.tryPlayData.active? 1: this.stoneLabel
    }
    getStoneNum(){
        let num = this.position
        if(this.tryPlayData.active) {
            num = this.position - this.tryPlayData.data.position
        }
        // return this.tryPlayData.active? this.tryPlayData.data.playData.length : this.position
        return num
    }
    play(x, y){
        if(!this.checkCoorForPlay(x, y)) return {isOk: false}
        // x, y, this.now
        let data = this.isBan({
            x: x,
            y: y,
            c: this.now
        })
        if(!data.isOk) return data
        this.checkPosition()
        let remove = this.removeStone(data.remove)
        let txt = this.checkPlayTxt()
        return {
            x: x,
            y: y,
            remove: remove,
            txt: txt,
            isOk: data.isOk
        }
    }
    markon(x,y,type){
        let tem
        tem = {x: x, y: y, type: type}
        // this.area.draw.push(tem)
        this.board.addObject(tem)
    }
    playDataCheck(coor){
        // let coor = this.coor2to1(x, y)
        if(this.tryPlayData.active){
            this.tryPlayData.data.playData.push(coor)
        }
    }
    checkPlayTxt(){
        return this.tryPlayData.active ? this.position : null
    }
    passBySync(){
        if(this.position == this.step.length - 1 && !this.area.active && !this.branch.active) return this.passByClick()
        let remove = this.removeStone([])
        let opt = {
            x: -1,
            y: -1,
            remove: remove,
            isOk: true
        }
        this.setStoneInBoardSync(opt)
    }
    passByClick(){
        this.timeReadReset()
        let opt = this.pass()
        this.setStoneInBoard(opt)
        this.removeStoneLabel()
        this.stoneLabelPlayCheck()
        this.setStoneLabel()
        // this.playDataCheck(-1)
    }
    pass(){
        this.checkPosition()
        let remove = this.removeStone([])
        return {
            x: -1,
            y: -1,
            remove: remove,
            isOk: true
        }
    }
    removeStone(remove){
        let data = {
            b:0,
            w:0
        }, color
        if(!remove.length) return data
        for(var i in remove){
            this.stone[this.coor2to1(remove[i].x, remove[i].y)] = 0
            this.board.removeObjectsAt(remove[i].x, remove[i].y)
            color = remove[i].c == 1 ? 'b' : 'w'
            data[color]++
        }
        this.board.removeObject(remove)
        if(this.ldpLabelDisplay){
            this.ldpRefresh()
        }
        return data
    }
    getColor(x, y, stone) {
        return this.stone[this.coor2to1(x, y)]
    }
    isDeath(x, y, color, stone) {
        stone = stone ? global.copy(stone) : global.copy(this.stone)
        stone[this.coor2to1(x, y)] = color
        var Q = new Array();
        var S = new Array(this.boardSize * this.boardSize);
        let tmp = this.coor2to1(x, y)
        Q.push(tmp);
        S[tmp] = true;
        while (Q.length > 0) {
            var coor = this.coor1to2(Q.shift());
            for (var i in delta) {
                var nx = coor.x + delta[i][0];
                var ny = coor.y + delta[i][1];
                if (!this.isInBoard(nx, ny)) {
                    continue;
                }
                if (!stone[this.coor2to1(nx, ny)]) {
                    return false;
                }
                if (stone[this.coor2to1(nx, ny)] == color) {
                    tmp = this.coor2to1(nx, ny);
                    if (S[tmp] == undefined) {
                        S[tmp] = true;
                        Q.push(tmp);
                    }
                }
            }
        }
        return true;
    }
    isBan(options) {
        options = options || {}
        let x = options.x,
            y = options.y,
            c = options.c
        var code = 0
        let stone = global.copy(options.stone) || global.copy(this.stone)
        var tx, ty, flag = true, reTem, remove = [], tem1, tem2
        stone[this.coor2to1(x, y)] = c
        let reData = {
            isOk: true
        }
        for (var i in delta) {
            tx = x + delta[i][0];
            ty = y + delta[i][1];
            if (!this.isInBoard(tx, ty) || !stone[this.coor2to1(tx, ty)]) continue
            if (stone[this.coor2to1(tx, ty)] != c && this.isDeath(tx, ty, stone[this.coor2to1(tx, ty)], stone)) {
                remove = remove.concat(this.removeDeath(tx, ty, stone))
            }
        }
        if(this.isDeath(x, y, stone[this.coor2to1(x, y)], stone) && remove.length <= 0){
            reData.isOk = false
            reData.remove = remove
            return reData
        }
        if(this.position > 2 && remove.length){
            let s = global.copy(stone)
            for(var i in remove){
                s[this.coor2to1(remove[i].x, remove[i].y)] = 0
            }
            // tem1 = JSON.stringify(stone)
            tem1 = JSON.stringify(s)
            // tem2 = JSON.stringify(this.cache[this.cache.length - 2])
            tem2 = JSON.stringify(this.cache[this.position - 1])
            if (tem1 == tem2) {
                // this.stone = stoneCopy
                reData.isOk = false
            }
        }
        reData.remove = remove
        return reData
    }
    removeDeath(x, y, stone) {
        var color = stone[this.coor2to1(x, y)]
        if (!color) {
            return [];
        }
        var count = [];
        var cou = 0;
        var Q = new Array();
        count.push({ x: x, y: y, c: stone[this.coor2to1(x, y)] });
        stone[this.coor2to1(x, y)] = 0;
        Q.push(this.coor2to1(x, y));
        while (Q.length > 0) {
            cou++
            var coor = this.coor1to2(Q.shift());
            for (var i in delta) {
            var nx = coor.x + delta[i][0];
            var ny = coor.y + delta[i][1];
            if (!this.isInBoard(nx, ny)) {
                continue;
            }
            if (stone[this.coor2to1(nx, ny)] == color) {
                count.push({ x: nx, y: ny, c: stone[this.coor2to1(nx, ny)] });
                stone[this.coor2to1(nx, ny)] = 0;
                Q.push(this.coor2to1(nx, ny));
            }
            }
        }
        return count
    }
      //清空棋盘
    clearBoard(){
        this.reSetData()
        this.board.removeAllObjects()
    }
    setAWandAB(type, data){
        let color = type == 'AB' ? 1 : -1
        if(!global.isArray(data)) data = [data]
        let playData = []
        for(var i in data){
            let tem = data[i], x, y
            if(global.isObject(tem)){
                x = tem.x, y = tem.y
            }else if(!isNaN(Number(tem))){
                let coor = this.coor1to2(tem)
                x = coor.x, y = coor.y
            }else if(global.isString(tem) && tem[0] !== undefined && tem[1] !== undefined){
                x = this.StoN(tem[0])
                y = this.StoN(tem[1])
            }
            if(x === undefined || y === undefined) continue
            this.stone[this.coor2to1(x, y)] = color
            this.addStone({x: x, y: y, c: color})
            playData.push({
                x: x, y: y, c: color
            })
        }
        this.cache[this.cache.length - 1] = global.deepCopy(this.stone)
        return playData
    }
    addStone(options){
        options.type = 'REALISTIC'
        this.board.addObject(options)
        
    }
    addLabel(options){
        this.board.addObject(options)
    }
    getJumpPos(p){
        // let tryP = this.tryPlayData.active? this.tryPlayData.data.position : 0
        let tryP = this.minJump
        if(!this.tryPlayData.active){
            tryP = this.minNum
        }
        if(!isNaN(Number(p))){
            p = Number(this.position) + Number(p)
            if(p < tryP) p = tryP
            if(p > this.step.length - 1) p = this.step.length - 1
            return p
        }
        if(p == 's') return tryP
        if(p == 'l') return this.step.length - 1
    }
    jumpTo(p){
        p = this.getJumpPos(p)
        let options = {
            position: p,
        }
        this.jumpToBypos(options)
    }
    jumpToByposRange(opt){
        let p = opt.position
        let tryP = this.minJump
        if(p < tryP) p = tryP
        if(p > this.step.length - 1) p = this.step.length - 1
        opt.position = p
        this.jumpToBypos(opt)
    }
    jumpToBypos(options){
        let pOld = this.position
        let p = options.position
        if(p == this.position) return
        if(p > this.position) this.stoneVoicePlay()
        // this.board.removeAllObjects()
        this.refreshBoard(options)
        let stone = global.copy(this.getCache()[p])
        this.position = p
        this.stone = stone
        this.now = -this.step[p].c
        this.remove = global.copy(this.step[this.position].remove)
        let pNew = this.position
        if(pNew > pOld && this.position > 0){
            let removeOld = global.deepCopy(this.step[this.position - 1].remove)
            let removeNew = global.deepCopy(this.step[this.position].remove)
            if(removeOld && removeNew && (removeNew.b > removeOld.b || removeNew.w > removeOld.w)){
                let numb = removeNew.b - removeOld.b
                let numw = removeNew.w - removeOld.w
                if(numb > 0) this.removeVoicePlay(numb)
                else this.removeVoicePlay(numw) 
            }
        }
        if(pNew < pOld) global.playAction('tool', 'undo')
    }
    getStep(){
        let step = global.copy(this.step)
        return step
    }
    getCache(){
        let cache = global.copy(this.cache)
        return cache
    }
    //刷新盘面
    refreshBoard(options){
        let p = options.position
        // options.removeAll ? this.board.removeAllObjects() : ''
        this.board.removeAllObjects()
        let step = global.copy(options.step) || global.copy(this.step)
        let cache = global.copy(options.cache) || global.copy(this.cache)
        let stone = global.deepCopy(cache[p])
        let now = -1
        let x, y, num
        p = Number(p)
        // for(var i = 0; i <= p; i++){
        for(var i in step){
            if(Number(i) > Number(p)) break
            x = step[i].x, y = step[i].y
            if(!this.isInBoard(step[i].x, step[i].y)){
                continue
            }
            this.board.removeObjectsAt(x, y)
            // this.classLabelClear([{x: x, y: y}])
            if(!stone[this.coor2to1(step[i].x, step[i].y)] || stone[this.coor2to1(step[i].x, step[i].y)] != step[i].c){
                continue
            }
            
            now = step[i].c
            this.addStone({
                x: x,
                y: y,
                c: now
            })
            if(((step[i] && step[i].tryPlay && !this.branch.active) || this.stoneLabel == 1) && i >= this.minNum){
                num = step[i].position || i
                this.addLabel({
                    x: x,
                    y: y,
                    c: now,
                    type: 'CT',
                    txt: num
                })
            }
            if(step[i] && step[i].tryPlay && this.modal == 'ldp'){
                num = step[i].position || i
                this.addLabel({
                    x: x,
                    y: y,
                    c: now,
                    type: 'CT',
                    txt: num
                })
            }
            if(step[i].classLabel){
                this.playByClickForLabel(step[i].classLabel.x, step[i].classLabel.y, step[i].classLabel.label)
            }
            // if(step[i] && step[i].label && step[i].label == 1){
            //     num = step[i].position || i
            //     this.addLabel({
            //         x: x,
            //         y: y,
            //         c: now,
            //         type: 'CT',
            //         txt: num
            //     })
            // }
        }
        this.sgfMoveSelectRefresh()
        
        if(this.ldpLabelDisplay){
            this.ldpRefresh(null, {
                stone: stone
            })
        }else{
            this.borderAfterSet(this.borderZone.data, null, {stone: stone}, 'refreshBoard')
        }

        if(this.modal == 'ldp'){

            // if(step[p - 1] && step[p - 1].tryPlay){
            //     this.removeStoneLabelLdp({position: p, txt: step[p - 1].position})
            // }
            this.setStoneLabelLdp({
                // x: step[p].x, 
                // y: step[p].y, 
                txt: step[p].position ,
                tryPlay: step[p].tryPlay,
                position: p,
                active: this.branch.active ? false : true,
            }, 'refresh board')
            
        }else{
            this.setStoneLabel({
                x: step[p].x, 
                y: step[p].y, 
                txt: step[p].position ,
                tryPlay: step[p].tryPlay,
                position: step[p].position
            }, 'refresh board')
        }
        
    }
    removeOutline(){
        if(this.moveTem && this.moveTem.x != undefined && this.moveTem.y != undefined){
            this.board.removeObject({x: this.moveTem.x, y: this.moveTem.y, type: 'outline'})
            this.board.removeObject({x: this.moveTem.x, y: this.moveTem.y, type: 'CLA'})
        }
    }
    stoneOver(x, y, c){
        this.removeOutline(x, y)
        if(!this.checkCoorForOver(x, y)) return
        this.moveTem = {
            x: x, y: y
        }
        c = c || this.now
        this.board.addObject({
            x: x,
            y: y,
            c: c,
            type: 'outline'
        })
    }
    targetStoneOver(x, y){
        this.removeOutline(x, y)
        if(!this.isInBoard(x, y)) return false
        this.moveTem = {
            x: x, y: y
        }
        this.board.addObject({
            x: x,
            y: y,
            type: 'TAC'
        })
    }

    //试下
    tryPlayCon(){
        this.tryPlayData.active ? this.tryPlayClose() : this.tryPlayOpen()
    }
    tryPlayOpen(opt){
        opt = opt || {}
        this.tryPlayData.active = true
        let now = this.now
        this.minJump = this.position
        let position = opt.position === undefined ? this.position : opt.position
        this.tryPlayData.data = {
            stone: global.copy(this.stone),
            step: opt.step || global.copy(this.step),
            cache: opt.cache || global.copy(this.cache),
            position: opt.position || global.copy(this.position),
            stoneLabel: this.stoneLabel,
            positionOriginal: opt.positionOriginal,
            playData: [],
            now: now
        }
        this.checkPosition()
        this.changeLabel(0)
        this.refreshStoneLabel()
        // this.stoneLabel = 1
    }
    tryPlayClose(){
        if(!this.tryPlayData.active) return
        this.tryPlayData.active = false
        this.stone = global.copy(this.tryPlayData.data.stone)
        this.step = global.copy(this.tryPlayData.data.step)
        this.cache = global.copy(this.tryPlayData.data.cache)
        this.position = global.copy(this.tryPlayData.data.position)
        if(this.tryPlayData.data.positionOriginal !== undefined){
            this.position = global.copy(this.tryPlayData.data.positionOriginal)
            this.stone = global.copy(this.cache[this.position])
        }
        // this.stoneLabel = this.tryPlayData.data.stoneLabel
        this.now = global.copy(this.tryPlayData.data.now)
        this.tryPlayData.data.playData = []
        this.minJump = 0
        this.board.removeAllObjects()
        this.refreshStoneLabel()
        this.refreshBoard({
            position: this.position
        })
        this.stoneLabel = -1
        let label =  this.tryPlayData.data.stoneLabel
        this.changeLabel(label)
    }

    changeCoor(n){
        if(n==4){
			// $scope.coordSystem=1
			// $scope.noCoorSystem=true;
			this.board.setSection({top:0,right:0,bottom:0,left:0});
		}else{
			// $scope.coordSystem=n;
			// $scope.noCoorSystem=false;
			this.board.setSection({top:-0.5,right:-0.5,bottom:-0.5,left:-0.5});
		}
        this.board.coordSystem=n
		this.board.redraw();
    }
    getCurrectCoor(data){
        if(global.isObject(data)) return data.coor
        return data
    }
    loadSgf(sgfData, callStep, options){
        this.clearBoard()
        options = options || {}
        if(options.syncBoard && callStep){
            callStep(this.position)
        }
        let coor, opt
        for(var i in sgfData){
            if(callStep) callStep(this.position)
            coor = this.getCurrectCoor(sgfData[i])
            if(coor == -1){
                opt = this.pass()
            }else{
                coor = this.coor1to2(coor)
                opt = this.play(coor.x, coor.y)
            }

            if(!opt || !opt.isOk){
                return false
            }
            this.setStoneInBoard(opt)
        }
        this.refreshBoard({
            position: this.position
        })
        return true
    }
    //解析sgf文件数据
    parseSgfFile(data, type){
        return this.SgfParse.parseSgfFile(data, type)
        // return this.dataParse(data)
    }
    //解析GIB棋谱
    parseSgfFileGib(file){
        return this.SgfParse.parseSgfFileGib(file)
    }
    dataParse(data){
        let finalData = {
            normal: [],
            setStone: [],
            info: {},
            gtp: []
        },
        x, y, c, s, ta = [], color = 1, move
        finalData.info = this.parseSgfInfo(data)
        let testSetStone = []
        let splitChar = data.indexOf('(;') == -1 ? '(' : '(;'
        let dataCh = data.split(splitChar)
        dataCh.splice(0, 1)
        dataCh = this.removeBranch(dataCh);
        
        if(dataCh[dataCh.length - 1][dataCh[dataCh.length - 1].length-1] == ")"){
            dataCh[dataCh.length - 1] = dataCh[dataCh.length - 1].substring(0, dataCh[dataCh.length - 1].length - 1);
        }
        let realData = [];
        let firstData = this.haveInitSgf(dataCh[0]);
        if(firstData){
            realData.push(firstData);
        }
        dataCh.splice(0,1);
        realData = realData.concat(dataCh);
        for(var i in realData){
            if(realData[i][0] != 'A' && realData[i][0]!='B' && realData[i][0]!='W'){
                continue
            }
            if(realData[i][0]=="A"){
                var tem=realData[i].split("A");
                tem.splice(0,1);
                ta=[];
                for(var j in tem){
                    c=tem[j][0]=="B"?1:-1;
                    tem[j]=tem[j].substring(1,tem[j].length);
                    s=tem[j].split("[");
                    s.splice(0,1);
                    for(var k in s){
                        x = this.StoN(s[k][0]);
                        y = this.StoN(s[k][1]);
                        // ta.push({x:x,y:y,c:c,type:'play'});
                        ta.push(this.coor2to1(x, y))
                        if(finalData.normal.length){
                            if(finalData.normal[finalData.normal.length-1].c==c){
                                finalData.normal.push({x:-1,y:-1,c:-c,type:'play'});
                                finalData.gtp.push({
                                    move: 'pass',
                                    color: -c == 1 ? 'B' : 'W'
                                })
                            }
                        }
                        
                        finalData.normal.push({x:x,y:y,c:c,type:'play'});
                        move = this.coorNtoS(x, y)
                        finalData.gtp.push({
                            move: move.x + move.y,
                            color: c == 1 ? 'B' : 'W'
                        })
                    }
                }
                testSetStone.push(ta);
            }else{
                c=realData[i][0]=="B"?1:-1;
                if(i==0&&c==-1){
                    finalData.normal.push({x:-1,y:-1,c:1,type:'play', coor: -1});
                    finalData.gtp.push({
                        move: 'pass',
                        color: 'B'
                    })
                }
                if(finalData.normal.length){
                    if(finalData.normal[finalData.normal.length-1].c==c){
                        finalData.normal.push({x:-1,y:-1,c:-c,type:'play', coor: -1});
                        finalData.gtp.push({
                            move: 'pass',
                            color: 'W'
                        })
                    }
                }
                if(realData[i][2].charCodeAt()<97||realData[i][2].charCodeAt()>122
                || !this.getCoorLimit(realData[i][2])){
                    finalData.normal.push({x:-1,y:-1,c:c, coor: -1});
                    finalData.gtp.push({
                        move: 'pass',
                        color: c == 1 ? 'B' : 'W'
                    })
                }else{
                    x=this.StoN(realData[i][2]);
                    y=this.StoN(realData[i][3]);
                    if(!this.isInBoard(x, y)) continue
                    finalData.normal.push({x: x, y: y, c: c, coor: this.coor2to1(x, y)})
                    move = this.coorNtoS(x, y)
                    finalData.gtp.push({
                        move: move.x + move.y,
                        color: c == 1 ? 'B' : 'W'
                    })
                }
                
            }
        }
        // let sp = 0
        // finalData.normal= finalData.normal.splice(s, finalData.normal.length - sp)
        // finalData.gtp= finalData.gtp.splice(s, finalData.gtp.length - sp)
        // finalData.normal.pop()
        // finalData.gtp.pop()
        return finalData;
    }
    getCoorLimit(x){
        let size = this.boardSize
        let limit = global.getCoorLimit(size)
        if(!limit) return false
        return x.charCodeAt() >= limit.min.charCodeAt() && x.charCodeAt() <= limit.max.charCodeAt() ? true : false
    }
    parseSgfInfo(data){
        let info={}
        let komi=findKomi(data)
        let size=findSize(data)
        for(var i in global.sgfInfo){
            info[i]=handle(data, i.toUpperCase())
        }
        function handle(d,st){
            var key=d.indexOf(st)
            if(key < 0) return null
            var rd=global.copy(d)
            rd=rd.substring(key,rd.length)
            var data=rd.substring(rd.indexOf('[')+1,rd.indexOf(']'))
            return data;
        }
        function findKomi(d){
            var key=d.indexOf('KM')
            if(key<0) return null
            var rd=global.copy(d)
            rd=rd.substring(key,rd.length)
            var data=rd.substring(rd.indexOf('[')+1,rd.indexOf(']'))
            return data;
        }
        function findSize(d){
            var key=d.indexOf('SZ')
            if(key<0) return 19
            var rd=global.copy(d)
            rd=rd.substring(key,rd.length)
            var data=rd.substring(rd.indexOf('[')+1,rd.indexOf(']'))
            return data;
        }
        return info
    }
    removeBranch(data){
        if(data.length==1){
            return data[0].split(";");
        }else{
            var re=[];
            re=re.concat(data[0].split(";"));
            data.splice(0,1);
            for(var i in data){
                if(data[i][data[i].length-1]!=")"){
                    re=re.concat(data[i].split(";"));
                }else{
                    var s=data[i].substring(0,data[i].length-1);
                    re=re.concat(s.split(";"));
                    break;
                }
            }
            return re;
        }
    }
    haveInitSgf(data){
        var realData=null
        var firstP=null,s;
        if(data.indexOf("AB")!=-1||data.indexOf("AW")!=-1){
            if(data.indexOf("AB")!=-1&&data.indexOf("AW")!=-1){
                s=data.indexOf("AB")<data.indexOf("AW")?data.indexOf("AB"):data.indexOf("AW")
            }else{
                if(data.indexOf("AB")==-1){
                    s=data.indexOf("AW")
                }else{
                    s=data.indexOf("AB")
                }
            }
            data=data.split('');
            data.splice(0,s);
            data=data.join('');
            if(data.indexOf("AB")!=-1&&data.lastIndexOf("AB")!=data.indexOf("AB")){
                firstP=data.substring(data.lastIndexOf("AB")+2,data.lastIndexOf("AB")+6);
                s=data.lastIndexOf("AB");
                data=data.split('')
                data.splice(s,6)
                data=data.join('')
                realData=splitCoor(data);
            }else if(data.indexOf("AW")!=-1&&data.lastIndexOf("AW")!=data.indexOf("AW")){
                firstP=data.substring(data.lastIndexOf("AW")+2,data.lastIndexOf("AW")+6);
                var s=data.lastIndexOf("AW");
                data=data.split('')
                data.splice(s,6)
                data=data.join('')
                realData=splitCoor(data);
            }
            else{
                firstP='';
                realData=splitCoor(data);
            }
            realData=realData.substring(0,2)+firstP+realData.substring(2,realData.length);
            return realData;
        }else{
            return false;
        }
        function splitCoor(d){
            var rd='';
            for(var i=0;i<d.length;i++){
                if((d[i]=='A'&&d[i+1]=='B')||
                (d[i]=='B'&&d[i+1]=='[')||
                (d[i]=='A'&&d[i+1]=='W')||
                (d[i]=='W'&&d[i+1]=='[')||
                d[i]=='['||
                d[i]==']'||
                (d[i].charCodeAt(0)>=97&&d[i].charCodeAt(0)<=116)){
                    rd+=d[i]
                }else{
                    break;
                }
            }
            return rd;
        }
    }
    CreateSgfDataHead(opt){
        opt.step = []
        opt.size = opt.size || this.boardSize
        opt.komi = opt.komi === undefined ? this.sgfInfo.km.value : opt.komi
        return this.SgfParse.CreateSgfDataByStep(opt)
    }
    CreateSgfData(opt){
        opt = opt || {}
        opt.step = opt.step || global.deepCopy(this.step)
        let position = opt.position || this.position
        opt.step.splice(Number(position) + 1, opt.step.length - position)
        opt.size = opt.size || this.boardSize
        opt.komi = opt.komi || this.sgfInfo.km.value
        return this.SgfParse.CreateSgfDataByStep(opt)
    }
   
    //下载棋谱
    downloadSgf(opt){
        opt = opt || {}
        let step = opt.step || global.copy(this.step)
        if(step[0].c == -1 && step[0].x == -1 && step[0].y == -1) step.shift()
        let options = {
            step: step,
            // position: opt.position || this.position - 1,
            position: opt.position === undefined ? step.length - 1 : opt.position,
            sgfInfo: opt.sgfInfo || {},
            komi: opt.komi || 0
        }
        return this.CreateSgfData(options)
    }
    getX(x){
        return this.board.getX(x)
    }
    getY(y){
        return this.board.getY(y)
    }
    gameJudgeOnEngine_6_5(data, stone, remove){
        remove = remove || this.remove
        stone = stone || this.stone
        this.gameJudge.active = true
        let coor, color, tem, final = true, result = {b: 0, w: 0, u: 0, e: 0, final: true}
        for(var i in data){
            if(data[i] == 'U'){
                result.final = false
                result.u++
            }
            let tem = 0
            if(data[i] == 'B') result.b++
            if(data[i] == 'W') result.w++
            if(data[i] == 'E') result.e++
            coor = this.coor1to2(i)
            color = data[i] == 'B' ? 1 : data[i] == 'W' ?  -1 : 0
            this.board.removeObject({
                x: coor.x,
                y: coor.y,
                type: 'judge'
            })
            if(stone[i] && stone[i] == color) continue
            tem = {x: coor.x, y: coor.y, type: "judge", set: data[i]}
            this.gameJudge.draw.push(tem)
            this.board.addObject(tem)
        }
        return result
    }
    gameJudgeOnEngine(data, stone, remove){
        remove = remove || this.remove
        stone = stone || this.stone
        this.gameJudge.active = true
        let coor, color, tem, final = true, result = {b: 0, w: 0, u: 0, e: 0, final: true}
        for(var i in data){
            if(data[i] == 'U'){
                result.final = false
                result.u++
            }
            let tem = 0
            if(data[i] == 'B'){
                if(stone[i] == -1) tem = 2
                else if(stone[i] != -1 && stone[i] != 1) tem = 1
                result.b = Number(result.b) + tem
            }
            if(data[i] == 'W'){
                if(stone[i] == 1) tem = 2
                else if(stone[i] != -1 && stone[i] != 1) tem = 1
                result.w = Number(result.w) + tem
            }
            if(data[i] == 'E'){
                result.e = Number(result.e) + 2
            }
            coor = this.coor1to2(i)
            color = data[i] == 'B' ? 1 : data[i] == 'W' ?  -1 : 0
            this.board.removeObject({
                x: coor.x,
                y: coor.y,
                type: 'judge'
            })
            if(stone[i] && stone[i] == color) continue
            tem = {x: coor.x, y: coor.y, type: "judge", set: data[i]}
            this.gameJudge.draw.push(tem)
            this.board.addObject(tem)
        }
        // return final ? result : final
        result.b = Number(result.b) + remove.w
        result.w = Number(result.w) + remove.b
        return result
    }
    gameJudgeOn(data, stone){
        stone = stone || this.stone
        this.gameJudge.active = true
        let coor, color, tem, final = true, result = {b: 0, w: 0, u: 0, e: 0, final: true}
        for(var i in data){
            if(data[i] == 'U'){
                result.final = false
                result.u++
            }
            if(data[i] == 'B') result.b++
            if(data[i] == 'W') result.w++
            if(data[i] == 'E') result.e++
            coor = this.coor1to2(i)
            color = data[i] == 'B' ? 1 : data[i] == 'W' ?  -1 : 0
            this.board.removeObject({
                x: coor.x,
                y: coor.y,
                type: 'judge'
            })
            if(stone[i] && stone[i] == color) continue
            tem = {x: coor.x, y: coor.y, type: "judge", set: data[i]}
            this.gameJudge.draw.push(tem)
            this.board.addObject(tem)
        }
        // return final ? result : final
        return result
    }
    gameJudgeOnPlay(resultData, stone){
        stone = stone || this.stone
        this.gameJudge.active = true
        let coor, color, tem, final = true, result = {b: 0, w: 0, u: 0, e: 0, final: true}, data = resultData.owner, sc
        
        for(var i in data){
            // if(data[i] == 'U') final = false
            if(data[i] == 1) result.b++
            if(data[i] == -1) result.w++
            if(data[i] == 0){
                result.final = false
                result.u++
            }
            coor = this.coor1to2(i)
            color = data[i]
            sc = data[i] == 0 ? 'U' : (data[i] == 1 ? 'B' : 'W')
            this.board.removeObject({
                x: coor.x,
                y: coor.y,
                type: 'judge'
            })
            if(stone[i] && stone[i] == color) continue
            tem = {x: coor.x, y: coor.y, type: "judge", set: sc}
            this.gameJudge.draw.push(tem)
            this.board.addObject(tem)
        }
        // if(status == 0) return false
        return result
    }
    gameJudgeOffPlay(){
        this.gameJudge.active = false
        this.clearGameJudge()
    }
    clearGameJudgePlay(){
        let draw = this.gameJudge.draw;
        for(var i in draw){
            this.board.removeObject({
                x: draw[i].x,
                y: draw[i].y,
                type: 'judge'
            })
        }
        this.gameJudge.draw = []
    }
    gameJudgeOff(){
        this.gameJudge.active = false
        this.clearGameJudge()
    }
    clearGameJudge(){
        let draw = this.gameJudge.draw;
        for(var i in draw){
            this.board.removeObject({
                x: draw[i].x,
                y: draw[i].y,
                type: 'judge'
            })
        }
        this.gameJudge.draw = []
    }
    areaLAdd(data){
        let coor, tem
        for(var i in data){
            data[i] = Number(data[i])
            coor = this.coor1to2(i)
            if(data[i] < 0 || data[i] < global.areaMinValue) continue
            this.board.removeObject({
                x: coor.x,
                y: coor.y,
                type: 'CAC'
            })
            this.board.removeObject({
                x: coor.x,
                y: coor.y,
                type: 'CA'
            })
            tem = {x: coor.x, y: coor.y, type: "CAC", ran: Math.abs((data[i]).toFixed(2))}
            this.area.draw.push(tem)
            this.board.addObject(tem)
        }
    }
    areaDataCheck(area){
        let data = {}
        if(area.length > 361){
            data.areaN = area.splice(361, area.length - 361)
            data.area = area
            // this.areaLAdd(data)
        }else{
            data.areaN = []
            data.area = area
        }
        return data
    }
    areaOn(data, color){
        color = color || this.now
        if(!this.area.active) this.areaOpenVoicePlay()
        this.area.active = true
        let coor, show, c, tem, pre = []
        let stone = this.stone
        if(this.branch.active) stone = this.branch.stone
        else if(this.splitBranch.active && this.splitBranch.moves && this.splitBranch.moves.length) stone = this.splitBranch.stone
        let area = this.areaDataCheck(data)
        data = area.area
        for(var i in data){
            data[i] = Number(data[i])
            data[i] *= color
            coor = this.coor1to2(i)
            this.board.removeObject({
                x: coor.x,
                y: coor.y,
                type: 'CA'
            })
            if((stone[i] == 1 && data[i] > 0) || (stone[i] == -1 && data[i] < 0) || Math.abs(data[i]) < global.areaMinValue){
                show=false;
            }else{
                show=true;
            }
            pre.push(data[i])
            if(data[i] > 0){
                c = 0
            }else if(data[i] < 0){
                c = 255
            }
            if(show){
                tem = {x: coor.x, y: coor.y, type: "CA", c: c, ran: Math.abs((data[i]).toFixed(2)), show: show}
                this.area.draw.push(tem)
                this.board.addObject(tem)
            }
        }
        this.areaLAdd(area.areaN)
        return pre
    }
    areaOff(){
        this.area.active = false
        this.clearArea()
        // let draw = this.area.draw;
        // for(var i in draw){
        //     this.board.removeObject({
        //         x: draw[i].x,
        //         y: draw[i].y,
        //         type: 'CA'
        //     })
        // }
        // this.area.draw = []
    }
    propRefresh(data){
        data = data || this.prop.draw
        this.board.addObject(data)
    }
    propOn(opt){
        this.clearProp()
        // if(!this.prop.active){
        //     this.propOpenVoice()
        // }
        this.prop.active = true
        let coor, per = Array(this.boardSize * this.boardSize), tem, c, max = 0, maxIndex = 0, draw = []
        for(var i in opt){
            coor = this.splitGtp(opt[i].Move)
            per[this.coor2to1(coor.x, coor.y)] = opt[i].Proportion
            c = Math.pow(opt[i].Proportion, 1 / 4);
            draw.push({
                x: coor.x,
                y: coor.y,
                c: c,
                color: this.now,
                type:"PN",
                label:'mcts',
                background: '5, 160, 5'
            })
            if(opt[i].Proportion > max){
                max = opt[i].Proportion
                maxIndex = draw.length - 1
            }
        }
        if(draw[maxIndex]){
            draw[maxIndex].max = true
        }
        this.prop.draw = global.copy(draw)
        this.board.addObject(draw)
        return per
    }
    propOnPlay(opt){
        this.clearProp()
        this.prop.active = true
        let coor, per = Array(this.boardSize * this.boardSize), tem, c, max = 0, maxIndex = 0, draw = []
        for(var i in opt){
            // coor = this.splitGtp(opt[i].Move)
            coor = this.coor1to2(opt[i])
            // per[this.coor2to1(coor.x, coor.y)] = opt[i].Proportion
            // c = Math.pow(opt[i].Proportion, 1 / 4);
            c = ((opt.length - i) / opt.length).toFixed(1)
            draw.push({
                x: coor.x,
                y: coor.y,
                c: c,
                color: this.now,
                type:"PN",
                label:'mcts',
                background: '5, 160, 5'
            })
            // if(opt[i].Proportion > max){
            //     max = opt[i].Proportion
            //     maxIndex = draw.length - 1
            // }
        }
        draw[0].max = true
        // if(draw[maxIndex]){
        //     draw[maxIndex].max = true
        // }
        this.prop.draw = global.deepCopy(draw)
        this.board.addObject(draw)
        return per
    }
    propOff(){
        this.prop.active = false
        this.clearProp()
    }
    clearProp(){
        let draw = this.prop.draw;
        for(var i in draw){
            this.board.removeObject({
                x: draw[i].x,
                y: draw[i].y,
                type: 'PN'
            })
        }
        this.prop.draw = []
    }
    spotLightOpacity(data){
        let list = [
            {val: 0.03, opacity: 0.2},
            {val: 0.1, opacity: 0.4},
            {val: 0.3, opacity: 0.6},
            {val: 0.6, opacity: 0.8},
            {val: 1, opacity: 1},
        ]
        let opacity = null
        for(var i in list){
            if(data <= list[i].val){
                opacity = list[i].opacity
                break
            }
        }
        if(opacity === null) opacity = 1
        return opacity
    }
    getSpotlightStone(){
        let stone = global.deepCopy(this.stone)
        if(this.branch.active){
            let data = this.branch.data
            let c = this.step[this.position].c
            for(var i in data){
                stone[data[i]] = c
                c = -c
            }
        }
        return stone
    }
    getStepByCoor(x, y){
        let step = global.deepCopy(this.step)
        let p = Number(this.position)
        // if(step[0].x == -1 && step[0].y == -1 && step[0].c == -1) step.shift()
        let data = null
        for(var i = p; i >= 1; i--){
            if(step[i].x == x && step[i].y == y){
                data = step[i]
                break
            }
        }
        return data
    }
    spotlightOn(opt){
        // 0-0.03  0.2 , 
        // 0.03 - 0.10, 0.4 
        // 0.11- 0.30 0.6 
        // 0.31 - 0.60 0.8 
        // 0.61 - 1 1
        this.clearSpotLight()
        this.spotlight.active = true
        let coor, per = Array(this.boardSize * this.boardSize), tem, c, max = 0, maxIndex = 0, draw = []
        // let stone = this.getSpotlightStone()
        let stone = global.deepCopy(this.stone)
        // if(this.branch.active){
        //     stone = global.deepCopy(this.branch.stone)
        // }
        let stoneData = []
        for(var i in opt){
            let s = 0
            let opa = this.spotLightOpacity(opt[i].Proportion)
            let coor = this.splitGtp(opt[i].Move)
            per[this.coor2to1(coor.x, coor.y)] = global.deepCopy(opt[i].Proportion)

            if(opt[i].Proportion > 1) opt[i].Proportion = 1
            if(opt[i].Proportion < 0) opt[i].Proportion = 0
            c = Math.pow(opt[i].Proportion, 1 / 4);
            let tem = {
                x: coor.x,
                y: coor.y,
                c: c,
                color: this.now,
                type:"SP",
                label:'mcts',
                background: '5, 160, 5',
                opacity: opa,
            }
            if(stone[this.coor2to1(coor.x, coor.y)]){
                let step = this.getStepByCoor(coor.x, coor.y)
                stoneData.push(step)
                this.board.removeObjectsAt(coor.x, coor.y)
            }
            draw.push(tem)
            if(opt[i].Proportion > max){
                max = opt[i].Proportion
                maxIndex = draw.length - 1
            }
        }
        if(draw[maxIndex]){
            draw[maxIndex].max = true
        }
        this.spotlight.draw = global.copy(draw)
        this.board.addObject(draw)
        if(stoneData && stoneData.length){
            let branchStone = this.branch.active ? this.branch.stone : null
            for(var i in stoneData){
                this.addStone({x: stoneData[i].x, y: stoneData[i].y, c: stoneData[i].c, type: 'REALISTIC'})
                // if(stoneData[i].tryPlay){
                //     this.board.addObject({x: stoneData[i].x, y: stoneData[i].y, type: 'CT', txt: stoneData[i].position})
                // }else{
                    
                // }
                let active = false
                if(this.position == stoneData[i].position) active = true
                stoneData[i].active = active
                if(branchStone && !branchStone[this.coor2to1(stoneData[i].x, stoneData[i].y)]) continue
                if(stoneData[i].tryPlay || active || this.stoneLabel == 1){
                    stoneData[i].txt = stoneData[i].position
                    // stoneData[i].c = -stoneData[i].c
                    if(active) this.setStoneLabel(stoneData[i])
                    else this.stoneLabelPlayCheck(stoneData[i])
                }
            }
        }
        if(this.branch.active) this.branchRefresh()
        return per
    }
    spotlightOff(){
        this.spotlight.active = false
        this.clearSpotLight()
    }
    clearSpotLight(){
        let draw = this.spotlight.draw;
        for(var i in draw){
            this.board.removeObject({
                x: draw[i].x,
                y: draw[i].y,
                type: 'SP'
            })
        }
        this.spotlight.draw = []
    }
    clearArea(){
        let draw = this.area.draw;
        for(var i in draw){
            this.board.removeObject({
                x: draw[i].x,
                y: draw[i].y,
                type: draw[i].type
            })
        }
        this.area.draw = []
    }
    branchCheck(moves){
        if(!this.splitBranch.active) return moves
        let splitBranchMoves = global.deepCopy(this.splitBranch.moves)
        if(!splitBranchMoves || !splitBranchMoves.length) return moves
        let rd = []
        for(var i in splitBranchMoves){
            rd.push({
                coor: splitBranchMoves[i],
                noneTxt: true
            })
        }
        rd = rd.concat(moves)
        return rd
    }
    branchStoneTxtInitVal(){
        if(this.modal != 'ldp' || !this.tryPlayData.active) return 0
        let stepSave = this.tryPlayData.data.step
        let step = this.step
        return step.length - stepSave.length - (step.length - 1 - this.position)
    }
    branchOnMoodalFun(){
        if(this.modal != 'ldp') return
        if(!this.tryPlayData.active) return
        let step = this.step[this.position] || {}
        this.removeStoneLabelLdp({position: Number(this.position) + 1, txt: step.position})
    }
    branchRemoveLdpCheck(branch, opt){
        if(branch || this.modal != 'ldp' || !this.tryPlayData.active) return branch
        opt = opt || {}
        let x = opt.x, y = opt.y
        let stepOr = this.tryPlayData.data.step
        let step = this.step
        let k = stepOr.length, p = this.position
        if(!step[k]) return branch
        let f = branch
        for(var i = k; i <= p; i++){
            if(!step[i]) continue
            if(step[i].x == x && step[i].y == y){
                f = true
                break
            }
        }
        return f
    }
    getLdpIncreaseStep(){
        let stepOr = this.tryPlayData.data.step
        let step = this.step
        let k = stepOr.length, p = this.position
        if(!step[k]) return []
        let rd = []
        for(var i = k; i <= p; i++){
            if(!step[i]) continue
            rd.push(global.deepCopy(step[i]))
        }
        return rd
    }
    branchStoneTemStep(){
        if(this.modal != 'ldp' || !this.tryPlayData.active) return []
        let step = this.getLdpIncreaseStep()
        let rd = []
        for(var i in step){
            rd.push({
                type: 'ST',
                x: step[i].x,
                y: step[i].y,
                c: step[i].c,
                txt: step[i].position
            })
        }
        return rd
        // x: coor.x,
        // y: coor.y,
        // type: 'ST',
        // active: active,
        // c: now,
        // txt: stoneTxt
    }
    branchOn(moves){
        this.branch.orginData = global.deepCopy(moves)
        moves = this.branchCheck(moves)
        
        let length = moves.length
        let stoneLabel = this.stoneLabel
        this.changeLabel(0)
        if(!this.branch.active) this.branchOpenVoice()
        this.branch.active = true
        this.clearBranch(this.branch.data)
        let now = this.now, coor
        let stone = global.copy(this.stone), ban, remove = [], active, temStep = []
        let stoneTxt = this.branchStoneTxtInitVal()
        temStep = this.branchStoneTemStep()
        let drawData = []
        this.branchOnMoodalFun()
        for(var i in moves){
            active = false
            coor = moves[i]
            let noneTxt = false
            if(global.isObject(moves[i])){
                coor = moves[i].coor
                noneTxt = moves[i].noneTxt
            }
            
            if(!global.isObject(coor)){
                coor = this.coor1to2(coor)
            }
            if(this.isInBoard(coor.x, coor.y)){

                this.board.removeObjectsAt(coor.x, coor.y)
            }
            if(i == length - 1){
                active = true
            }
            if(!noneTxt) stoneTxt++
            if(this.isInBoard(coor.x, coor.y)){
                let tem = {
                    x: coor.x,
                    y: coor.y,
                    type: 'ST',
                    active: active,
                    c: now,
                    txt: stoneTxt
                }
                this.board.addObject(tem)
                temStep.push(tem)
                drawData.push(tem)
            }
            ban = this.isBan({
                x: coor.x,
                y: coor.y,
                c: now,
                stone: stone
            })
            stone[this.coor2to1(coor.x, coor.y)] = now
            for(var j in ban.remove){
                let bx = ban.remove[j].x, by = ban.remove[j].y
                this.board.removeObjectsAt(ban.remove[j].x, ban.remove[j].y)
                stone[this.coor2to1(ban.remove[j].x, ban.remove[j].y)] = 0
                let branch = this.stone[this.coor2to1(ban.remove[j].x, ban.remove[j].y)] ? false : true
                branch = this.branchRemoveLdpCheck(branch, {x: ban.remove[j].x, y: ban.remove[j].y})
                let removeTem = {
                    x: ban.remove[j].x,
                    y: ban.remove[j].y,
                    c: ban.remove[j].c,
                    type: 'death',
                    branch: branch,
                    temStep: temStep,
                    xr: ban.remove[j].x,
                    yr: ban.remove[j].y
                }
                    this.board.addObject(removeTem)
                    drawData.push(removeTem)
                // }
            }
            now = -now
        }
        this.branch.data = moves
        this.branch.stone = stone
        this.branch.drawData = drawData
        this.branch.stoneLabel = this.branch.stoneLabel == null ? stoneLabel : this.branch.stoneLabel
    }
    branchRefresh(){
        if(!this.branch.active) return
        let data = this.branch.drawData || []
        for(var i in data){
            this.board.removeObject({
                x: data[i].x,
                y: data[i].y,
                type: 'ST'
            })
            this.board.removeObject({
                x: data[i].x,
                y: data[i].y,
                type: 'death'
            })
            this.board.removeObject({
                x: data[i].x,
                y: data[i].y,
                type: 'REALISTIC'
            })
            this.board.addObject(data[i])
        }
    }
    branchOff(){
        let stoneLabel = this.branch.stoneLabel
        this.clearBranch(this.branch.data)
        this.branch.active = false
        this.branch.data = []
        this.branch.stoneLabel = null
        this.refreshBoard({
            position: this.position
        })
        // if(!this.tryPlayData.active) this.changeLabel(this.branch.stoneLabel)
        this.changeLabel(stoneLabel)
    }
    clearBranch(moves){
        let coor
        for(var i in moves){
            coor = moves[i]
            if(!global.isObject(coor)){
                coor = this.coor1to2(moves[i])
            }
            this.board.removeObject({
                x: coor.x,
                y: coor.y,
                type: 'ST'
            })
        }
        this.refreshBoard({
            position: this.position
        })
    }
    splitBranchOn(data, moves){
        this.splitBranchClear()
        this.splitBranch.active = true
        this.splitBranchMoves(moves)
        let rd = []
        for(var i in data){
            let coor = data[i].coor
            if(!global.isObject(coor)) coor = this.splitGtp(coor)
            rd.push({
                x: coor.x,
                y: coor.y,
                txt: data[i].txt,
                c: data[i].c,
                type: 'RE',
                Proportion: data[i].Proportion
            })
        }
        this.splitBranch.draw = rd
        this.board.addObject(rd)
        if(this.branch.active) this.branchOn(this.branch.orginData)
    }
    splitBranchOff(){
        this.splitBranchClear()
        this.splitBranch.active = false
        this.splitBranch.draw = []
        this.splitBranch.moves = []
        this.splitBranch.stoneLabel = null
    }
    splitBranchClear(data){
        data = data || this.splitBranch.draw || []
        for(var i in data){
            let coor = data[i]
            if(!global.isObject(coor)) coor = this.splitGtp(coor)
            this.board.removeObject({
                x: coor.x,
                y: coor.y,
                type: 'RE'
            })
        }
        this.refreshBoard({
            position: this.position
        })
    }
    splitBranchMoves(moves){
        if(!moves || !moves.length) return
        let stoneLabel = this.stoneLabel
        this.changeLabel(0)
        this.clearBranch(this.splitBranch.moves)
        let now = this.now, coor
        let stone = global.copy(this.stone), ban, remove = [], active, temStep = []
        for(var i in moves){
            active = false
            coor = moves[i]
            if(!global.isObject(coor)){
                coor = this.coor1to2(moves[i])
            }
            if(this.isInBoard(coor.x, coor.y)){
                this.board.removeObjectsAt(coor.x, coor.y)
            }
            if(i == moves.length - 1){
                active = true
            }
            if(this.isInBoard(coor.x, coor.y)){
                this.board.addObject({
                    x: coor.x,
                    y: coor.y,
                    type: 'ST',
                    active: active,
                    c: now,
                    txt: Number(i) + 1
                })
                temStep.push({
                    x: coor.x,
                    y: coor.y,
                    type: 'ST',
                    active: active,
                    c: now,
                    txt: Number(i) + 1
                })
            }
            ban = this.isBan({
                x: coor.x,
                y: coor.y,
                c: now,
                stone: stone
            })
            stone[this.coor2to1(coor.x, coor.y)] = now
            for(var j in ban.remove){

                this.board.removeObjectsAt(ban.remove[j].x, ban.remove[j].y)
                stone[this.coor2to1(ban.remove[j].x, ban.remove[j].y)] = 0
                let branch = this.stone[this.coor2to1(ban.remove[j].x, ban.remove[j].y)] ? false : true
                this.board.addObject({
                    x: ban.remove[j].x,
                    y: ban.remove[j].y,
                    c: ban.remove[j].c,
                    type: 'death',
                    branch: branch,
                    temStep: temStep,
                    xr: ban.remove[j].x,
                    yr: ban.remove[j].y
                })
            }
            now = -now
        }
        this.splitBranch.moves = moves
        this.splitBranch.stone = stone
        this.splitBranch.stoneLabel = this.splitBranch.stoneLabel == null ? stoneLabel : this.splitBranch.stoneLabel
    }
    clearSplitBranchMoves(moves){
        let coor
        for(var i in moves){
            coor = moves[i]
            if(!global.isObject(coor)){
                coor = this.coor1to2(moves[i])
            }
            this.board.removeObject({
                x: coor.x,
                y: coor.y,
                type: 'ST'
            })
        }
        this.refreshBoard({
            position: this.position
        })
    }
    posHasChanged(){
        let opt = {
            position: this.position,
            step: this.step.length - 1,
            tryPlay: this.tryPlayData.active,
            minJump: this.minJump,
            now: this.now,
            stepMoves: this.step,
            boardTryPlayData: this.tryPlayData.data,
            removeStone: this.remove,
            branchStatus: this.branch.active,
            boardStoneLabel: this.stoneLabel,
            classLabelData: this.classLabel.data,
            sgfChangeMove: this.sgfChangeMove,
            sgfChangeDelete: this.sgfChangeDelete,
            sgfChangeInsert: this.sgfChangeInsert,
        }
        return opt
    }

    getBoardGtp(){
        let step = global.copy(this.step)
        if(step[0].x == -1 && step[0].y == -1 && step[0].c == -1) step.shift()
        let data = [], coor
        for(var i in step){
            coor = this.coorNtoS(step[i].x, step[i].y)
            data.push(coor.x + coor.y)
        }
        return data
    }
    getSetMovesData(p, opt){
        opt = opt || {}
        let step = opt.step || global.copy(this.step)
        if(step[0].x == -1 && step[0].y == -1 && step[0].c == -1) step.shift()
        p = p == undefined ? step.length - 1 : p - 1 
        let data = [], coor
        for(var i = 0; i <= p; i++){
            let x, y
            if(!isNaN(Number(step[i]))){
                let coor = this.coor1to2(step[i])
                x = coor.x, y = coor.y
            }else{
                x = step[i].x
                y = step[i].y
            }
            if(x == -1 || y == -1){
                x = 't'
                y = 't'
            }else{
                x = this.NtoS(x)
                y = this.NtoS(y)
            }
            data.push(x + y)
        }
        return data
    }
    getSetMovesDataLdp(p, orMoves, opt){
        if(!orMoves) return this.getSetMovesData(p, opt)
        let step = orMoves || []
        p = p == undefined ? step.length - 1 : p - 1 
        let data = []
        for(var i = 0; i <= p; i++){
            let x, y
            if(!isNaN(Number(step[i]))){
                let coor = this.coor1to2(step[i])
                x = coor.x, y = coor.y
            }else{
                x = step[i].x
                y = step[i].y
            }
            if(x == -1 || y == -1){
                x = 't'
                y = 't'
            }else{
                x = this.NtoS(x)
                y = this.NtoS(y)
            }
            data.push(x + y)
        }
        return data
    }
    getBoardGtpWithColor(p){
        let step = global.copy(this.step)
        if(step[0].x == -1 && step[0].y == -1 && step[0].c == -1) step.shift()
        p = p == undefined ? step.length - 1 : p - 1 
        let data = [], coor
        // for(var i in step){
        for(var i = 0; i <= p; i++){
            coor = this.coorNtoS(step[i].x, step[i].y)
            data.push({
                move: coor.x + coor.y,
                color: step[i].c == 1 ? 'B' : 'W',
                position: Number(i) + 1
            })
        }
        return data
    }
    getSituation(p){
        p = p || this.position
        let step = global.deepCopy(this.step), moves = []
        if(step[0].c == -1) step.shift()
        if(p > step.length) p = step.length
        for(var i in step){
            if(i >= p) break
            moves.push(this.coor2to1(step[i].x, step[i].y))
        }
        return moves.join(',')
    }
    getSituationForClass(p){
        p = p || this.position
        let step = global.deepCopy(this.step), moves = []
        if(this.tryPlayData.active) step = global.deepCopy(this.tryPlayData.data.step)
        if(step[0].c == -1) step.shift()
        if(p > step.length) p = step.length
        for(var i in step){
            if(i >= p) break
            moves.push(this.coor2to1(step[i].x, step[i].y))
        }
        return moves.join(',')
    }
    getSituationGtp(p, c){
        p = p || this.position
        if(c == undefined) c = ','
        let step = global.deepCopy(this.step), moves = []
        if(step[0].c == -1) step.shift()
        for(var i in step){
            if(i >= p) break
            let gtp = this.coorNtoS(step[i].x, step[i].y)
            moves.push(gtp.x + gtp.y)
        }
        return moves.join(c)
    }
    resetBoard(opt){
        opt = opt || {}
        if(opt.source == 'init'){
            this.stone = global.deepCopy(this.cache[0])
        }else{
            this.stone = this.getInitStone()
        }
        this.cache = []
        this.cache.push(global.copy(this.stone))
        this.step = [
            {x: -1, y: -1, c: -1, remove: {b: 0, w: 0}}
        ]
        this.position = 0
        this.now = 1
        this.minJump = 0
        this.remove = {b: 0, w: 0}
        this.preData = Array(this.boardSize * this.boardSize)
        this.branch = {
            active: false,
            data: [],
            stone: []
        }
        this.classLabel = {
            typeMap: {
                '2': 'ri',
                '3': 'tr',
                '4': 'sq',
                '6': 'le'
            },
            letter: 0,
            data: {},
        }
    }
    reSetData(){
        this.resetBoard()
        this.tryPlayClose()
    }
    getLastCoor(index){
        index = index || this.step.length - 1
        let data = global.deepCopy(this.step[index])
        data.index = index
        if(data.x == -1 || data.y == -1){
            if(index <= 0) return false
            index--
            return this.getLastCoor(index)
        }
        return data
    }
    setStoneLabelToNormal(opt){
        opt = opt || {}
        let step = opt.step || this.step,
        position = opt.position || this.position,
        coor = opt.coor || this.getLastCoor(),
        type = this.stoneLabel,
        tryPlay = opt.tryPlay == undefined ? this.step[this.position].tryPlay : opt.tryPlay
        this.board.removeObject({
            x: coor.x, y: coor.y, type: 'CT',
        })
        if(coor.x == step[position].x && coor.y == step[position].y){
            this.setStoneLabel()
            return
        }
        if(tryPlay && !this.branch.active){
            this.board.addObject({x: coor.x, y: coor.y, type: 'CT', txt: position})
            return
        }
        if(type == 0) return
        this.board.addObject({x: coor.x, y: coor.y, type: 'CT', txt: coor.index, c: coor.c})
    }
    timeReadReset(){
        this.setStoneLabel()
        // this.setStoneLabelToNormal()
    }
    timeRead(second, data, color){
        data = data || this.getLastCoor()
        color = color || data.c
        this.readVoicePlay(second)
        if(!data) return
        this.timeReadData = data
        let coor = {
            x: data.x,
            y: data.y
        }
        if(!this.stone[this.coor2to1(coor.x, coor.y)]) return
        this.board.removeObject({
            x: coor.x, y: coor.y, type: 'CR',
        })
        this.board.addObject({x: coor.x, y: coor.y, type: 'CT', txt: second, c: color, active: true})
    }
    timeReadClear(coor){
        this.setStoneLabel()
    }
    actualStoneSet(opt){
        if(opt.specLabel) this.board.removeObject({x: opt.x, y: opt.y, type: 'PN'})
        opt.color = opt.c
        opt.type = 'AC'
        this.actualStoneData.draw = global.deepCopy(opt)
        this.board.removeObject({x: opt.x, y: opt.y, type: 'AC'})
        this.board.addObject(opt)
    }
    actualStoneOff(opt){
        opt = opt || this.actualStoneData.draw
        if(!opt) return
        this.board.removeObject({x: opt.x, y: opt.y, type: 'AC'})
        this.actualStoneData.draw = null
    }
    getStepString(){
        let data = []
        let step = global.deepCopy(this.step)
        if(step[0].x == -1 && step[0].y == -1 && step[0].c == -1) step.shift()
        for(var i in step){
            data.push(step[i].coor)
        }
        return data
    }
    setBoardByImage(moves){
        this.board.removeAllObjects()
        for(var i in moves){
            let coor = this.coor1to2(moves[i].coor)
            this.board.addObject({
                x: coor.x,
                y: coor.y,
                c: moves[i].color,
                type: 'REALISTIC'
            })
        }
    }
    mpaClassLabel(label){
        if(isNaN(Number(label))) return label
        let typeMap = this.classLabel.typeMap
        return typeMap[label]
    }
    playByClickForLabel(x, y, label, opt){
        opt = opt || {}
        let type = opt.type || 'play'
        let letter = opt.letter === undefined ? this.classLabel.letter : opt.letter
        label = this.mpaClassLabel(label)
        let labelData = this.classLabel.data || {}
        if(labelData[this.coor2to1(x, y)] && type == 'play'){
            let tem = labelData[this.coor2to1(x, y)]
            this.classLabelLetterCheck(labelData[this.coor2to1(x, y)].letter)
            this.classLabelClearSingle(labelData[this.coor2to1(x, y)])
            if(tem.stone && tem.position !== undefined){
                if(tem.position <= this.position) return
            }
            return
        }
        this.board.removeObject({x: x, y: y, type: 'CLS'})
        let color = 1, stone = false
        if(this.stone[this.coor2to1(x, y)] == 1){
            color = -1
        }
        if(this.stone[this.coor2to1(x, y)] != 0){
            stone = true
        }
        this.board.addObject({x: x, y: y, type: 'CLS', label: label, c: color, letter: letter, stone: stone})
        this.classLabelDataSet(x, y, label, letter)
        return this.coor2to1(x, y)
    }
    classLabelLetterCheck(letter){
        if(letter === null || letter === undefined) return
        let letterNow = this.classLabel.letter
        if(Number(letter) == Number(letterNow) - 1){
            // this.classLabel.letter = letter
            let data = this.classLabel.data, max = 0
            for(var i in data){
                if(data[i].letter === null || data[i].letter === undefined || isNaN(Number(data[i].letter)) || data[i].letter == letter) continue
                if(Number(data[i].letter) >= max){
                    max = Number(data[i].letter) + 1
                }
            }
            this.classLabel.letter = max
        }
    }
    classLabelDataSet(x, y, label, letterDe){
        this.classLabel.data = this.classLabel.data || {}
        let step = this.step
        let letter = null
        if(label == 'le'){
            if(letterDe !== undefined){
                this.classLabel.letter = letterDe
            }
            letter = this.classLabel.letter
            this.classLabel.letter++
        }
        let stone = this.stone[this.coor2to1(x, y)], position = undefined
        if(stone != 0){
            for(var i = step.length - 1; i >= 0; i--){
                if(step[i].x == x && step[i].y == y){
                    position = i
                    break
                }
            }
        }
        this.classLabel.data[this.coor2to1(x, y)] = {
            x: x, y: y, label: label,
            stone: stone,
            position: position,
            letter: letter
        }
    }

    classLabelClearDataGet(data){
        if(global.isArray(data)) return data
        if(data.x !== undefined && data.y !== undefined && data.label !== undefined) return [data]
        return data
    }
    classLabelClear(data){
        data = data || this.classLabel.data
        data = this.classLabelClearDataGet(data)
        // if(!global.isArray(data)) data = [data]
        for(var i in data){
            let x = data[i].x, y = data[i].y
            this.board.removeObject({x: x, y: y, type: 'CLS'})
        }
        this.classLabel.data = {}
        this.classLabel.letter = 0
    }
    classLabelClearSingle(data){
        data = data || {}
        if(data.x === undefined || data.y === undefined) return
        let x = data.x, y = data.y
        this.board.removeObject({x: x, y: y, type: 'CLS'})
        delete this.classLabel.data[this.coor2to1(x, y)]
    }
    classLabelHide(){
        let data = this.classLabel.data
        for(var i in data){
            let x = data[i].x, y = data[i].y
            this.board.removeObject({x: x, y: y, type: 'CLS'})
        }
    }
    classLabelRefresh(){
        let data = this.classLabel.data
        let step = this.step
        this.classLabel.letter = 0
        for(var i in data){
            if(data[i].stone != 0 && data[i].position !== undefined){
                if(this.position < data[i].position){
                    this.classLabelLetterCheck(data[i].letter)
                    this.classLabelClearSingle(data[i])
                    continue
                }
                let tem = step[data[i].position]
                if(!tem || (tem.x != data[i].x && tem.y != data[i].y)){
                    delete data[i]
                    continue
                }
                this.playByClickForLabel(data[i].x, data[i].y, data[i].label, {type: 'refresh'})
                continue
            }
            let coor = this.coor2to1(data[i].x, data[i].y)
            if(this.stone[coor] != 0){
                delete data[i]
                continue
            }
            this.playByClickForLabel(data[i].x, data[i].y, data[i].label, {type: 'refresh', letter: data[i].letter})
            if(data[i].letter !== undefined && data[i].letter !== null && data[i].letter >= this.classLabel.letter) this.classLabel.letter = Number(data[i].letter) + 1
        }
        this.classLabelLetterRepair()
    }
    classLabelLetterRepair(){
        let data = this.classLabel.data
        let max = 0
        for(var i in data){
            if(data[i].label != 'le') continue
            if(Number(data[i].letter) >= max) max = Number(data[i].letter) + 1
        }
        this.classLabel.letter = max
    }
    stoneOverForLabel(x, y, label){
        this.removeOutline()
        this.moveTem = {
            x: x, y: y
        }
        let color = 1, stone = false
        if(this.stone[this.coor2to1(x, y)] == 1){
            color = -1
        }
        if(this.stone[this.coor2to1(x, y)] != 0){
            stone = true
        }
        let typeMap = this.classLabel.typeMap
        label = typeMap[label]
        this.board.removeObject({
            x: x,
            y: y,
            type: 'CLA'
        })
        this.board.addObject({
            x: x,
            y: y,
            c: color,
            label: label,
            type: 'CLA',
            // opacity: stone ? 1 : (color == 1 ? 0.3 : 0.7),
            opacity: color == 1 ? 0.3 : 0.7,
            stone: stone,
            letter: this.classLabel.letter
        })
    }
    removeStoneLabelAction(options){
        options = options || {}
        let type = options.type || this.stoneLabel == 0? 'CR' : 'CT',
            x = options.x || this.step[this.position].x,
            y = options.y || this.step[this.position].y,
            opt
        opt = {
            x: x,
            y: y,
            type: type
        }
        this.board.removeObject(opt)
    }
    removeTryPlayStoneLabel(options){
        if(!this.tryPlayData.active) return
        options = options || {}
        let step = this.tryPlayData.data.step
        let position = this.tryPlayData.data.position
        let data = step[position] || {}
        let type = 'CR',
            x = options.x === undefined ? data.x : options.x,
            y = options.y === undefined ? data.y : options.y,
            opt
        opt = {
            x: x,
            y: y,
            type: type
        }
        this.board.removeObject(opt)
    }
    isPlayed(x, y){
        let stone = this.stone
        return stone[this.coor2to1(x, y)] == 1 || stone[this.coor2to1(x, y)] == -1
    }
    getStepData(coor, opt){
        let step = this.step
        opt = opt || {}
        let min = opt.min || 0
        if(!isNaN(Number(coor))) coor = this.coor1to2(coor)
        let data = null
        for(var i = step.length - 1; i >= min; i--){
            if(step[i].x == coor.x && step[i].y == coor.y){
                data = step[i]
                break
            }
        }
        return data
    }
    getStepDataWithIndex(){

    }
    // 更改棋谱-移动
    sgfMoveOn(){
        this.sgfChangeMove.active = true
    }
    sgfMoveOff(){
        if(!this.sgfChangeMove.active) return
        let selected = global.deepCopy(this.sgfChangeMove.selected)
        this.sgfChangeMove.active = false
        this.sgfChangeMove.selected = null
        if(selected)
            this.refreshBoard({
                position: this.position
            })
    }
    sgfMoveSet(x, y){
        let step = this.sgfChangeStepCheck(x, y)
        if(!step) return
        let minJump = this.minJump
        if(!step.tryPlay) minJump = 0
        this.sgfChangeMove.selected = {
            coor: this.coor2to1(x, y),
            position: Number(step.position) + minJump,
            x: x, y: y,
            c: step.c,
            rinalPosition: this.position
        }
        this.sgfMoveSelectRefresh()
    }
    sgfMoveSelectRefresh(){
        if(!this.sgfChangeMove.active || !this.sgfChangeMove.selected) return
        let step = this.sgfChangeMove.selected
        this.board.removeObjectsAt(step.x, step.y)
        let labelType, active = false
        if(step.position == this.step.length - 1) active = true
        if(this.stoneLabel == 0 && active) labelType = 'CR'
        else if(this.stoneLabel == 1){
            labelType = 'CT'
        }else if(active){
            labelType = 'CT'
        }
        this.board.addObject({
            x: step.x,
            y: step.y,
            c: step.c,
            type: 'SMOVE',
            labelType: labelType,
            active: active,
            txt: step.position
        })
    }
    sgfMoveClear(){
        if(this.sgfChangeMove.selected === null) return
        let selected = global.deepCopy(this.sgfChangeMove.selected)
        this.sgfChangeMove.selected = null
        this.refreshBoard({
            position: this.position
        })
    }
    sgfMovePlay(x, y, opt){
        if(this.sgfChangeMove.selected === null){
            this.sgfMoveSet(x, y)
            return
        }
        opt = opt || {}
        let stone = this.stone[this.coor2to1(x, y)]
        if(stone == 1 || stone == -1) return
        let selected = this.sgfChangeMove.selected
        let cache = opt.cache || this.cache
        let step = opt.step || this.step
        stone = global.deepCopy(cache[selected.position - 1])
        let color = step[selected.position].c
        let ban = this.isBan({
            x: x,
            y: y,
            c: color,
            stone: stone
        })
        if(!ban.isOk){
            return
        }
        let p = selected.rinalPosition
        let res = this.sgfChangePlay(selected.position, x, y, opt)
        if(!res || res.code != 0) return res
        this.sgfMoveOff()
        this.sgfChangeJumpTo(p)
    }

    // 更改棋谱-删除
    sgfDeleteOn(){
        this.sgfChangeDelete.active = true
    }
    sgfDeleteOff(){
        if(!this.sgfChangeDelete.active) return
        this.sgfChangeDelete.active = false
        this.sgfDeleteClear()
    }
    sgfDeleteClear(){
        this.sgfChangeDelete.selected = null
    }
    sgfDeletePlayCheck(x, y){
        let index = this.coor2to1(x, y)
        if(this.stone[index] != -1 || this.stone[index] != 1) return false
        let min = 0
        if(this.tryPlayData.active){
            min = 1 + this.tryPlayData.data.position
        }
        let step = global.deepCopy(this.getStepData({x: x, y: y}, {min: min}))
        if(!step) return false
        return true
    }
    sgfDeleteSet(x, y){
        if(this.sgfChangeDelete.selected){
            return true
        }
        let step = this.sgfChangeStepCheck(x, y)
        if(!step) return false
        let minJump = this.minJump
        if(!step.tryPlay) minJump = 0
        this.sgfChangeDelete.selected = {
            coor: this.coor2to1(x, y),
            position: Number(step.position) + minJump,
            x: x, y: y,
            c: step.c,
            rinalPosition: this.position
        }
        return true
    }
    sgfDeletePlay(x, y, opt){
        if(!this.sgfDeleteSet(x, y)) return
        let res = this.sgfDeletePlayAction(x, y, opt)
        if(!res || res.code != 0) return res
        this.refreshBoard({
            position: this.position
        })
        let p = this.sgfChangeDelete.selected.rinalPosition
        // this.sgfDeleteOff()
        this.sgfChangeJumpTo(p)
        this.sgfDeleteClear()
        return res
    }
    sgfDeletePlayAction(x, y, opt){
        let data = global.deepCopy(this.getStepData({x: x, y: y})) || {}
        if(data.position == this.step.length - 1){
            let resBack = this.back(1)
            return {code: 0, positionChange: true}
        }
        let res = this.sgfChangePlay(this.sgfChangeDelete.selected.position, -1, -1, opt)
        return res
    }
    //更改棋谱-插入
    sgfInsertReset(){
        this.sgfChangeInsert = {
            active: false,
            type: null,
            color: null,
            step: null,
            cache: null,
            position: null,
            data: []
        }
    }
    sgfInsertOn(type){
        this.sgfChangeInsert.active = true
        this.sgfChangeInsert.step = global.deepCopy(this.step)
        this.sgfChangeInsert.cache = global.deepCopy(this.cache)
        this.sgfChangeInsert.position = global.deepCopy(this.position)
        this.sgfInsertSetColor(type)
        let p = this.position, s = this.step.length
        this.step.splice(Number(p) + 1, s - p)
        this.cache.splice(Number(p) + 1, s - p)
    }
    sgfInsertSetColor(type){
        this.sgfChangeInsert.type = type
        if(type == 0) this.sgfChangeInsert.color = this.now
        else this.sgfChangeInsert.color = type
    }
    sgfInsertOff(){
        if(!this.sgfChangeInsert.active) return
        let step = global.deepCopy(this.sgfChangeInsert.step)
        let cache = global.deepCopy(this.sgfChangeInsert.cache)
        let position = global.deepCopy(this.sgfChangeInsert.position)
        this.sgfInsertReset()
        // if(position == this.position){
        //     return
        // }
        step = step.splice(1 + position, step.length - (1 + position))
        if(!step.length) return
        let increaseNum = this.step.length - 1
        let i = 0
        while(i < step.length){
            let p = Number(this.position) + 1 + Number(i)
            if(!this.checkCoorStatus(step[i].x, step[i].y, {c: step[i].c})){
                break
            }
            if(this.step[this.position] && step[i].c == this.step[this.position].c){
                this.sgfChangePlay(p, -1, -1)
                continue
            }
            let res = this.sgfChangePlay(p, step[i].x, step[i].y)
            i++
        }
        this.sgfChangeJumpTo(increaseNum)
    }
    sgfInsertColorGet(){
        if(this.sgfChangeInsert.type == 0) return this.now
        return this.sgfChangeInsert.type
    }
    sgfInsertPlaySet(data){
        data = data || []
        this.sgfChangeInsert.data = this.sgfChangeInsert.data || []
        for(var i in data){
            let x = data[i].x, y = data[i].y, color = data[i].color || this.sgfInsertColorGet(),
                position = data[i].position || this.position
            this.sgfChangeInsert.data.push({
                x: x, y: y,
                color: color,
                position: position
            })
        }
    }
    sgfInsertPlay(x, y, opt){
        opt = opt || {}
        opt.clickType = opt.clickType || 'left'
        if(this.stone[this.coor2to1(x, y)] == 1 || this.stone[this.coor2to1(x, y)] == -1) return
        let color = this.sgfInsertColorGet()
        if(opt.clickType == 'right') color = -color
        if(color != this.now){
            if(this.position > 0 && this.step[this.position].x == -1 && this.step[this.position].y == -1) this.back(1)
            else this.passByClick()
        }
        let res = this.playByclick(x, y)
        if(this.sgfChangeInsert.type == 0) color = this.now
        // this.sgfDeletePass()
        // 
        return res
    }


    //更改棋谱-通用
    checkCoorStatus(x, y, opt){
        if(x == -1 && y == -1) return true
        if(!this.isInBoard(x, y)){
            return false
        }
        opt = opt || {}
        let cache = opt.cache || this.cache
        let step = opt.step || this.step
        let position = opt.position || step.length - 1
        let stone = global.deepCopy(cache[position])
        let color = opt.c || step[position].c
        if(stone[this.coor2to1(x, y)] !== 0){
            return false
        }
        let ban = this.isBan({
            x: x,
            y: y,
            c: color,
            stone: stone
        })
        return ban.isOk
    }
    sgfChangeStepCheck(x, y){
        let index = this.coor2to1(x, y)
        if(this.stone[index] != -1 && this.stone[index] != 1) return false
        let min = 0
        // if(this.tryPlayData.active){
        //     min = 1 + this.tryPlayData.data.position
        // }
        let step = global.deepCopy(this.getStepData({x: x, y: y}, {min: min}))
        if(!step) return false
        return step
    }
    sgfChangePlay(position, stateX, stateY, opt){
        opt = opt || {}
        let step = opt.step || global.deepCopy(this.step)
        let cache = opt.cache || global.deepCopy(this.cache)
        let insert = opt.insert
        let spliceP = insert ? (1 + position) : position
        cache.splice(spliceP, step.length - spliceP)
        let stepRe = step.splice(spliceP, step.length - spliceP)
        if(insert){
            for(var j in insert){
                stepRe.unshift({x: insert[j].x, y: insert[j].y})
            }
        }else{
            stepRe[0] = {
                x: stateX, y: stateY
            }
        }
        
        if(opt.sgf && !this.tryPlayData.active){
            return {code: 1, position: step.length - 1}
        }
        this.step = step
        this.cache = cache
        this.stone = global.deepCopy(this.cache[this.cache.length - 1])
        this.now = -step[step.length - 1].c
        this.position = step.length - 1
        let f = true, positionChange = false
        if(this.step.length > 1 && (this.step[this.step.length - 1].x == -1 || this.step[this.step.length - 1].y == -1)){
            if(stepRe[0].x == -1 || stepRe[0].y == -1){
                positionChange = true
                stepRe.shift()
                this.step.pop()
                this.cache.pop()
                this.stone = global.deepCopy(this.cache[this.cache.length - 1])
                this.now = -this.step[this.step.length - 1].c
                this.position = this.step.length - 1
            }
        }
        let i = 0
        while(i < stepRe.length){
            let opt, x = stepRe[i].x, y = stepRe[i].y
            if(!this.tryPlayData.active){
                if(x == -1 || y == -1){
                    if(stepRe[Number(i) + 1] && (stepRe[Number(i) + 1].x == -1 || stepRe[Number(i) + 1].y == -1)){
                        i = Number(i) + 2
                        continue
                    }
                    opt = this.pass()
                }
                else opt = this.play(x, y)
                if(!opt || !opt.isOk){
                    f = false
                    break
                }
                this.setStoneInBoard(opt)
            }else{
                if(x == -1 || y == -1){
                    if(stepRe[Number(i) + 1] && (stepRe[Number(i) + 1].x == -1 || stepRe[Number(i) + 1].y == -1)){
                        i = Number(i) + 2
                        positionChange = true
                        continue
                    }
                    this.passByClick()
                    opt = {isOk: true}
                }else{
                    let optPlay = this.playByclick(x, y)
                    opt = {isOk: optPlay}
                }
                if(!opt || !opt.isOk){
                    f = false
                    break
                }
            }
            i++
        }
        return {code: 0, positionChange: positionChange, status: f}
    }
    sgfChangeJumpTo(p){
        let position = p - this.position
        if(p == 0) position = 's'
        if(p == this.step.length - 1) position = 'l'
        this.jumpTo(position)
    }
    sgfPassCheck(p){
        if(p === undefined) return
        let step = global.deepCopy(this.step)
        let next = Number(p) - 1, last = Number(p) + 1
        if(step[next] && (step[next].x == -1 || step[next].y == -1)){

        }
    }
    sgfDeletePass(opt){
        opt = opt || {}
        let cache = opt.cache || global.deepCopy(this.cache)
        let step = opt.step || global.deepCopy(this.step)
        let position = opt.position || this.position
        let stepData = []
        let cacheData = []
        let i = 0
        let p = 1
        let length = step.length
        let root = null
        if(step[0].c == -1) root = step.shift()
        while(i < step.length){
            if(step[i].x == -1 && step[i].y == -1){
                let j = 1 + i
                if(step[j] && step[j].x == -1 && step[j].y == -1){
                    i = 2 + i
                    continue
                }
                // if(step[j].x == -1 && step[j].y == -1){
                //     step.splice(i, 2)
                //     cache.splice(i, 2)
                //     i = 2 + i
                //     continue
                // }
            }
            step[i].position = p
            stepData.push(global.deepCopy(step[i]))
            cacheData.push(global.deepCopy(cache[i]))
            p++
            i++
        }
        if(root) step.unshift(root)
        this.step = stepData
        this.cache = cacheData
        if(position > step.length - 1) position = this.step.length - 1
        this.stone = global.deepCopy(this.cache[position])
        this.position = position
        // this.refreshBoard({
        //     position: position
        // })
    }
    setMinNum(val){
        this.minNum = val || 0
    }

    //解析带分支的SGF
    parseSgfWithBranch(data){
        let promise = new Promise(success => {
            data = data.replace(/\ +/g,"")
            data = data.replace(/[\r\n]/g,"")
            this.SgfParse.parseSgfObj.init(data, res => {
                success(res)
            })
        })
        return promise
    }
    async parseSgfToStep(data){
        return this.SgfParse.parseSgfToStep(data)
        
    }
    commonSgfToStep(data, step){
    }

    //领地分析
    areaAnalyseOn(data1, data2, color1){
        color1 = color1 || this.now
        let color2 = -color1
        this.areaAnalyseData.active = true
        let coor, show, c, tem, pre = []
        let stone = this.stone
        let area1 = this.areaDataCheck(data1)
        let area2 = this.areaDataCheck(data2)
        area1 = area1.area
        area2 = area2.area
        this.areaAnalyseData.data = []
        for(var i in area1){
            area1[i] = Number(area1[i])
            area2[i] = Number(area2[i])
            // if(color1 == -1){
            //     area1[i] *= color1
            //     area2[i] *= color2
            // }
            area1[i] *= color1
            area2[i] *= color2
            coor = this.coor1to2(i)
            this.board.removeObject({
                x: coor.x,
                y: coor.y,
                type: 'CAS'
            })
            let temData = (area1[i] - area2[i]) / 2
            if(Math.abs(temData) < global.areaMinValue){
                show=false;
            }else{
                show=true;
            }
            pre.push(temData)
            if(color1 == -1) temData = -temData
            if(temData > 0){
                c = '#059F05'
            }else if(temData < 0){
                c = '#B43131'
            }
            if(show){
                tem = {x: coor.x, y: coor.y, type: "CAS", c: c, ran: Math.abs((temData).toFixed(2)), show: show}
                this.areaAnalyseData.data.push(tem)
                this.board.addObject(tem)
            }
        }
        // this.areaLAdd(area.areaN)
        return pre
    }
    areaAnalyseOff(){
        this.areaAnalyseData.active = false
        if(this.areaAnalyseData.data && this.areaAnalyseData.data.length) this.board.removeObject(this.areaAnalyseData.data)
        this.areaAnalyseData.data = null
    }
    getSyncBoard(p){
        p = p === undefined ? this.position - 1 : p - 1
        let step = global.deepCopy(this.step)
        if(step[0].x == -1 && step[0].y == -1 && step[0].c == -1) step.shift()
        let rd = []
        for(var i = 0; i <= p; i++){
            let x = step[i].x, y = step[i].y
            let coor = {
                x: String.fromCharCode(x + 97),
                y: String.fromCharCode(y + 97)
            }
            if(x == -1 || y == -1){
                coor.x = 't', coor.y = 't'
            }
            step[i] = `${coor.x}${coor.y}`
            rd.push(`${coor.x}${coor.y}`)
        }
        return rd.join('')
    }
    sgfChangeInsertRemove(x, y){
        let step = this.step
    }
    targetStoneSetRemove(coor){
        let data = this.targetStone.data || []
        let rd = []
        for(var i in data){
            if(data[i].x == coor.x && data[i].y == coor.y) continue
            rd.push(data[i])
        }
        this.targetStone.data = rd
    }
    targetStoneSetAction(moves, opt){
        opt = opt || {}
        let type = opt.type || 'add'
        let rd = []
        // this.targetStone.data = []
        for(var i in moves){
            let coor = moves[i]
            if(!global.isObject(coor) && !isNaN(Number(coor))) coor = this.coor1to2(coor)
            if(!this.isPlayed(coor.x, coor.y)) continue
            let color = this.stone[this.coor2to1(coor.x, coor.y)]
            // if(this.ldpLabelDisplay){
                this.board.removeObject({
                    x: coor.x,
                    y: coor.y,
                    type: 'TA'
                })
            // }
            
            rd.push({
                color: color,
                x: coor.x,
                y: coor.y,
                type: 'TA',
                coor: this.coor2to1(coor.x, coor.y)
            })
            if(type == 'remove'){
                this.targetStoneSetRemove(coor)
            }
        }
        // if(JSON.stringify(rd) == JSON.stringify(this.targetStone.data) && !opt.refresh) return rd
        if(type == 'add'){
            this.board.addObject(rd)
            this.targetStone.data = rd
        }else{

        }
        return rd
    }
    targetStoneSet(x, y, opt){
        if(!this.isPlayed(x, y)) return
        let color = this.stone[this.coor2to1(x, y)]
        let moves = this.getRelationStone(x, y)
        if(!moves || !moves.length) return []
        return this.targetStoneSetAction(moves, opt)
    }
    targetStoneClear(moves){
        this.targetStoneClearAction(moves)
        this.targetStone.data = []
    }
    targetStoneClearAction(moves){
        moves = moves || this.targetStone.data
        if(!moves || !moves.length) return
        this.board.removeObject(moves)
    }
    //战斗区
    fightingZoneSetAction(moves, opt){
        opt = opt || {}
        let type = opt.type || 'add'
        let rd = [], stone = Array(this.boardSize * this.boardSize)
        for(var i in moves){
            let coor = moves[i]
            if(!global.isObject(coor) && !isNaN(Number(coor))) coor = this.coor1to2(coor)
            let color = this.stone[this.coor2to1(coor.x, coor.y)]
            let tem = {
                color: color,
                x: coor.x,
                y: coor.y,
                type: 'FT',
                coor: this.coor2to1(coor.x, coor.y),
                played: this.isPlayed(coor.x, coor.y),
            }
            stone[this.coor2to1(coor.x, coor.y)] = 1
            rd.push(tem)
            // if(this.ldpLabelDisplay){
            //     this.board.removeObjectsAt(coor.x, coor.y)
            //     if(type == 'add') this.board.addObject(tem)
            //     if(this.isPlayed(coor.x, coor.y)){
            //         this.board.addObject({
            //             x: coor.x, y: coor.y, type: 'REALISTIC', c: color,
            //         })
            //     }
            // }

        }
        // if(this.targetStone.data && this.targetStone.data.length){
        //     this.targetStoneSetAction(global.deepCopy(this.targetStone.data), {refresh: true})
        // }
        this.fightingZone.data = rd
        this.fightingZone.stone = stone
        if(this.prop.active) this.propRefresh()
        return rd
    }
    fightingZoneClear(moves){
        this.fightingZoneClearAction(moves)
        this.fightingZone.data = []
    }
    fightingZoneClearAction(moves){
        moves = moves || this.fightingZone.data
        if(!moves || !moves.length) return
        this.board.removeObject(moves)
    }
    getFightingPoints(){
        let stone = this.fightingZone.stone
        if(!stone || !stone.length) return []
        let rd = []
        for(var i in stone){
            if(!stone[i]) continue
            let coor = this.coor1to2(i)
            rd.push({
                point_one: stone[i]
            })
            if(coor.x < this.boardSize) continue
            // while()
        }
        
    }
    getRelationStone(x, y, opt){
        opt = opt || {}
        let stone = opt.stone || global.deepCopy(this.stone)
        let rd = [this.coor2to1(x, y)]
        let color = stone[this.coor2to1(x, y)]
        var Q = new Array();
        var S = new Array(this.boardSize * this.boardSize);
        let tmp = this.coor2to1(x, y)
        Q.push(tmp);
        S[tmp] = true;
        while (Q.length > 0) {
            var coor = this.coor1to2(Q.shift());
            for (var i in delta) {
                var nx = coor.x + delta[i][0];
                var ny = coor.y + delta[i][1];
                if (!this.isInBoard(nx, ny)) {
                    continue;
                }
                if (!stone[this.coor2to1(nx, ny)]) {
                    continue
                }
                if (stone[this.coor2to1(nx, ny)] == color) {
                    tmp = this.coor2to1(nx, ny);
                    if (S[tmp] == undefined) {
                        rd.push(tmp)
                        S[tmp] = true;
                        Q.push(tmp);
                    }
                }
            }
        }
        return rd;
    }
    borderAfterSet(moves, borderMoves, opt){
        opt = opt || {}
        if(!moves || !moves.length) return
        if(borderMoves) moves = moves.concat(borderMoves)
        this.borderZone.data = global.deepCopy(moves)
        let movesObj = {}
        for(var i in moves){
            let coor = moves[i]
            if(global.isObject(coor)) coor = moves[i].coor
            movesObj[coor] = moves[i]
        }
        let step = this.step
        let stone = opt.stone || global.deepCopy(this.stone)
        let positionNow = this.position
        for(var i = 0; i <= positionNow; i++){
            let coor = this.coor2to1(step[i].x, step[i].y)
            this.board.removeObject({x: step[i].x, y: step[i].y, type: 'CT'})
            this.board.removeObject({x: step[i].x, y: step[i].y, type: 'REALISTIC'})
            if(movesObj[coor]){
                if(stone[coor]){
                    this.board.addObject({x: step[i].x, y: step[i].y, type: 'REALISTIC', c: step[i].c})
                }
                if(step[i - 1] && step[i - 1].tryPlay){
                    this.removeStoneLabelLdp({position: i, txt: step[i - 1].position, stone: stone})
                }
                if(step[i].tryPlay && stone[coor]){
                    let active = this.branch.active ? false : true
                    this.setStoneLabelLdp({position: i, txt: step[i].position, active: active}, 'border after set')
                }
                continue
            }
        }
        if(borderMoves && borderMoves.length) this.borderZone.borderMoves = borderMoves
        // if(!this.ldpLabelDisplay){
        //     this.borderZoneClearAction()
        // }
        this.borderZoneClearAction()
    }
    borderZoneClear(){
        this.borderZone.data = []
        this.borderZone.borderMoves = []
    }
    borderZoneClearAction(moves){
        moves = moves || this.borderZone.borderMoves
        if(!moves || !moves.length) return
        for(var i in moves){
            if(!moves[i] || isNaN(Number(moves[i]))) continue
            let coor = this.coor1to2(moves[i])
            this.board.removeObject({x: coor.x, y: coor.y, type: 'REALISTIC'})
        }
    }
    ldpRefresh(type, opt){
        opt = opt || {}
        let stone = opt.stone || null
        // if(!this.ldpLabelDisplay) return
        type = type || {target: true, fighting: true, border: true}
        if(type.target && this.targetStone.data && this.targetStone.data.length && this.ldpLabelDisplay){
            this.targetStoneSetAction(global.deepCopy(this.targetStone.data))
        }
        if(type.fighting && this.fightingZone.data && this.fightingZone.data.length) this.fightingZoneSetAction(global.deepCopy(this.fightingZone.data))
        if(type.border && this.borderZone.data && this.borderZone.data.length){
            this.borderAfterSet(global.deepCopy(this.borderZone.data), undefined, {stone: stone})
        }
    }
    ldpLabelOn(){
        this.ldpRefresh()
    }
    ldpLabelOff(){
        this.targetStoneClearAction()
        this.fightingZoneClearAction()
        this.borderZoneClearAction()
    }
    setModal(val){
        this.modal = val || 'normal'
    }
    setSize(size){
        this.boardSize = size
        this.board.setSize(size)
        this.initData({size: size, modal: this.modal})
    }
    getInitStone(){
        let stone = Array(this.boardSize * this.boardSize)
        for(var i = 0; i < this.boardSize * this.boardSize; i++){
            stone[i] = 0
        }
        return stone
    }
    initData(options){
        this.sgfInfo = global.deepCopy(global.sgfInfo)
        options = options || {}
        this.sgfInsertReset()
        this.targetStone = {
            active: true,
            data: []
        }
        this.fightingZone = {
            active: true,
            data: [],
            stone: [],
        }
        this.borderZone = {
            data: null,
            borderMoves: []
        }
        this.areaAnalyseData = {
            active: true,
            data: null
        }
        this.sgfChangeMove = {
            active: false,
            selected: null
        }
        this.sgfChangeDelete = {
            active: false,
            selected: null
        }
        this.area = {
            draw: [],
            perData: null,
            active: false
        }
        this.gameJudge = {
            draw: [],
            active: false
        }
        this.prop = {
            active: false,
            data: [],
            perData: null,
        }
        this.spotlight = {
            active: false,
            data: [],
            perData: null,
        }
        this.splitBranch = {
            draw: [],
            active: false,
            moves: [],
            stoneLabel: null
        }
        this.actualStoneData = {
            draw: null
        }
        this.classLabel = {
            typeMap: {
                '2': 'ri',
                '3': 'tr',
                '4': 'sq',
                '6': 'le'
            },
            letter: 0,
            data: {},
        }
        // this.now = 1
        // this.minJump = 0
        // this.position = 0
        // this.step = [{x: -1, y: -1, c: -1, remove: {b:0, w:0}}]
        // this.remove = {b: 0, w: 0}
        this.sgfHead="(;CA[utf8]AP[golaxy]";
        this.stoneLabel = 0
        this.cache = []
        this.moveTem = {}
        this.boardSize = options.size || 19
        this.modal = options.modal || 'normal'
        this.specStoneLabel = options.specStoneLabel || null
        this.tryPlayData = {
            data:{},
            active: false
        }
        this.stone = this.getInitStone()
        this.cache.push(global.copy(this.stone))
        this.resetBoard({source: 'init'})
    }
}

