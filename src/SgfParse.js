import global from './global.js'

export default class SgfParse{
    constructor(options){
        options = options || {}
        let size = options.size || 19
        this.options = {
            size: size
        }
        this.initData(options)
        this.sgfHead = "(;CA[utf8]AP[golaxy]";
    }
    initData(options){
        let opt = this.options
        for(var i in opt){
            if(!options[i]){
                this[i] = opt[i]
                continue
            } 
            this[i] = options[i]
        }
        this.parseSgfObj = {
            /**
             * @constructor
             * @param {String} sgf Raw SGF data to parse
             */
            init: function(sgf, completeFn) {
                completeFn = (typeof completeFn == "function") ? completeFn : null;
                this.sgf = sgf;
                this.index = 0;
                this.root = {_children: []};
                let res = this.parseTree(this.root);
                completeFn && completeFn(res);
            },
            parseTree: function(curnode) {
                while (this.index < this.sgf.length) {
                    var c = this.curChar();
                    this.index++;
                    switch (c) {
                        case ';':
                            curnode = this.parseNode(curnode);
                            break;
                        case '(':
                            this.parseTree(curnode);
                            break;
                        case ')':
                            return;
                            break;
                    }
                }
                return curnode
            },
            parseNode: function(parent) {
                var node = {_children: []};
                if (parent)
                    parent._children.push(node);
                else
                    this.root = node;
                node = this.parseProperties(node);
                return node;
            },
            parseProperties: function(node) {
                var key = "";
                var values = [];
                var i = 0;
                while (this.index < this.sgf.length) {
                    var c = this.curChar();
                    if (c == ';' || c == '(' || c == ')') {
                        break;
                    }
                    if (this.curChar() == '[') {
                        while (this.curChar() == '[') {
                            this.index++;
                            values[i] = "";
                            while (this.curChar() != ']' && this.index < this.sgf.length) {
                                if (this.curChar() == '\\') {
                                    this.index++;
                                    // not technically correct, but works in practice
                                    while (this.curChar() == "\r" || this.curChar() == "\n") {
                                        this.index++;
                                    }
                                }
                                values[i] += this.curChar();
                                this.index++;
                            }
                            i++;
                            while (this.curChar() == ']' || this.curChar() == "\n" || this.curChar() == "\r") {
                                this.index++;
                            }
                        }
                        if (node[key]) {
                            if (!(node[key] instanceof Array)) {
                                node[key] = [node[key]];
                            }
                            node[key] = node[key].concat(values);
                        } else {
                            node[key] = values.length > 1 ? values : values[0];
                        }
                        key = "";
                        values = [];
                        i = 0;
                        continue;
                    }
                    if (c != " " && c != "\n" && c != "\r" && c != "\t") {
                        key += c;
                    }
                    this.index++;
                }
                return node;
            },
            curChar: function() {
                return this.sgf.charAt(this.index);
            }
        }
    }
    coor1to2(n) {
        if(n == -1){
            return {
                x: -1,
                y: -1
            }
        }
        return {
            x: n % this.boardSizeGet(),
            y: parseInt(n / this.boardSizeGet())
        };
    }
    coor2to1(x, y) {
        if(x == -1 || y == -1){
            return -1
        }
        return y * this.boardSizeGet() + x;
    }
    StoN(s, boardSize){
        boardSize = boardSize || 19
        let num = s.charCodeAt() - 97
        if(num >= boardSize || num < 0) num = -1
        return num
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
                    y:this.boardSizeGet() - coor.y
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
        switch(coorSys){
            case 1:
                let xr = x.charCodeAt() - 65;
                if(xr > 7) xr--;
                return {
                    x: xr,
                    y: this.boardSizeGet() - y
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
    isInBoard(x, y){
        if (x < 0 || x >= this.boardSizeGet() || y < 0 || y >= this.boardSizeGet()) {
            return false;
        }
        return true;
    }
    isInBoardSgf(x, y){
        return x.charCodeAt() < 97 && x.charCodeAt() > 122 && this.getCoorLimit(x)
    }
    //解析sgf文件数据
    parseSgfFile(data, format){
        format = format || 'sgf'
        if(!this[format + 'DataParse']) return false
        let sgfData = this[format + 'DataParse'](data)
        sgfData = this.parseSgfFileRepair(sgfData)
        return sgfData
        // return this.dataParse(data)
    }
    //解析GIB格式棋谱
    parseSgfFileGib(file){
        return this.gibDataParse(file)
    }
    parseSgfFileRepair(sgfData){
        let data = sgfData.moves
        if(!data) return sgfData
        let normalData = [], movesData = [], gtpData = []
        let i = 0
        while(i < data.length){
            let j = Number(i) + 1
            if(data[i] == -1 && data[j] == -1){
                i = Number(i) + 2
            }else{
                normalData.push(sgfData.normal[i])
                movesData.push(sgfData.moves[i])
                gtpData.push(sgfData.gtp[i])
                i++
            }
        }
        sgfData.normal = normalData
        sgfData.moves = movesData
        sgfData.gtp = gtpData
        return sgfData
    }
    sgfDataParse(data){
        let boardSize = 19
        let finalData = {
            normal: [],
            setStone: [],
            info: {},
            gtp: [],
            moves: []
        },
        x, y, c, s, ta = [], color = 1, move, p = 1
        finalData.info = this.parseSgfInfo(data)
        let sizeTem = this.boardSizeGet()
        if(finalData.info && finalData.info.sz){
            this.size = this.boardSizeGet(finalData.info.sz)
        }
        data = data.replace(/\s/g,"");
        let testSetStone = []
        let splitChar = data.indexOf('(;') == -1 ? '(' : '(;'
        let dataCh = data.split(splitChar)
        if(dataCh[0] == '' || !dataCh[0]) dataCh.splice(0, 1)
        dataCh = this.removeBranch(dataCh);
        if(dataCh[dataCh.length - 1][dataCh[dataCh.length - 1].length-1] == ")"){
            dataCh[dataCh.length - 1] = dataCh[dataCh.length - 1].substring(0, dataCh[dataCh.length - 1].length - 1);
        }
        
        let realData = [];
        let firstData = this.haveInitSgf(dataCh[0]);
        if(firstData){
            realData.push(firstData);
        }
        
        if(dataCh.length > 0){
            if(dataCh[0].length > 3 && dataCh[0].indexOf('B[') != 0 && dataCh[0].indexOf('W[') != 0){
                dataCh.splice(0,1);
            }
        }
        // dataCh.splice(0,1);
        realData = realData.concat(dataCh);
        for(var i in realData){
            let temData = realData[i]
            // if(temData.indexOf('AB[') > -1) temData = temData.substring(temData.indexOf('AB['), temData.indexOf('AB[') + 6)
            // if(temData.indexOf('AW[') > -1) temData = temData.substring(temData.indexOf('AW['), temData.indexOf('AW[') + 6)
            // if(temData.indexOf('B[') > -1) temData = temData.substring(temData.indexOf('B['), temData.indexOf('B[') + 5)
            // if(temData.indexOf('W[') > -1) temData = temData.substring(temData.indexOf('W['), temData.indexOf('W[') + 5)

            if(temData.indexOf('AB[') > -1) temData = temData.substring(temData.indexOf('AB['), temData.length)
            else if(temData.indexOf('AW[') > -1) temData = temData.substring(temData.indexOf('AW['), temData.length)
            else if(temData.indexOf('B[') > -1) temData = temData.substring(temData.indexOf('B['), temData.length)
            else if(temData.indexOf('W[') > -1) temData = temData.substring(temData.indexOf('W['), temData.length)
            realData[i] = temData
            if(realData[i][0] != 'A' && realData[i][0] != 'B' && realData[i][0] != 'W'){
                continue
            }
            if(realData[i][0] == "A"){
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
                                finalData.normal.push({x:-1,y:-1,c:-c,type:'play', coor: -1});
                                finalData.gtp.push({
                                    move: 'pass',
                                    color: -c == 1 ? 'B' : 'W',
                                    position: p
                                })
                                finalData.moves.push(-1)
                            }
                        }
                        
                        finalData.normal.push({x:x,y:y,c:c,type:'play', coor: this.coor2to1(x, y)});
                        move = this.coorNtoS(x, y)
                        finalData.gtp.push(this.coor2to1(x, y))
                        finalData.moves.push(-1)
                    }
                }
                testSetStone.push(ta);
            }else{
                c=realData[i][0]=="B"?1:-1;
                if(i==0&&c==-1){
                    finalData.normal.push({x:-1,y:-1,c:1,type:'play', coor: -1});
                    finalData.gtp.push({
                        move: 'pass',
                        color: 'B',
                        position: p
                    })
                    finalData.moves.push(-1)
                }
                if(finalData.normal.length){
                    if(finalData.normal[finalData.normal.length-1].c==c){
                        finalData.normal.push({x:-1,y:-1,c:-c,type:'play', coor: -1});
                        finalData.gtp.push({
                            move: 'pass',
                            color: 'W',
                            position: p
                        })
                        finalData.moves.push(-1)
                    }
                }
                if(realData[i][2].charCodeAt()<97||realData[i][2].charCodeAt()>122
                || !this.getCoorLimit(realData[i][2])){
                    finalData.normal.push({x:-1,y:-1,c:c, coor: -1});
                    finalData.gtp.push({
                        move: 'pass',
                        color: c == 1 ? 'B' : 'W',
                        position: p
                    })
                    finalData.moves.push(-1)
                }else{
                    x=this.StoN(realData[i][2]);
                    y=this.StoN(realData[i][3]);
                    if(!this.isInBoard(x, y)) continue
                    finalData.normal.push({x: x, y: y, c: c, coor: this.coor2to1(x, y)})
                    move = this.coorNtoS(x, y)
                    finalData.gtp.push({
                        move: move.x + move.y,
                        color: c == 1 ? 'B' : 'W',
                        position: p
                    })
                    finalData.moves.push(this.coor2to1(x, y))
                }
                
            }
            p++
        }
        // let sp = 0
        // finalData.normal= finalData.normal.splice(s, finalData.normal.length - sp)
        // finalData.gtp= finalData.gtp.splice(s, finalData.gtp.length - sp)
        // finalData.normal.pop()
        // finalData.gtp.pop()
        this.size = sizeTem
        return finalData;
    }
    boardSizeGet(size){
        size = size || this.size
        let sizeMap = {
            9: true,
            13: true,
            19: true,
        }
        let defaultSize = 19
        if(sizeMap[size]) return size
        return defaultSize
    }
    getCoorLimit(x){
        let size = this.boardSizeGet()
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
            if(key < 0 || d[Number(key) + 2] != '[') return null
            var rd=global.copy(d)
            rd=rd.substring(key,rd.length)
            var data=rd.substring(rd.indexOf('[')+1,rd.indexOf(']'))
            data = data.replace(';', '')
            return data;
        }
        function findKomi(d){
            var key=d.indexOf('KM')
            if(key<0 || d[key + 2] != '[') return null
            var rd=global.copy(d)
            rd=rd.substring(key,rd.length)
            var data=rd.substring(rd.indexOf('[')+1,rd.indexOf(']'))
            data = data.replace(';', '')
            return data;
        }
        function findSize(d){
            var key=d.indexOf('SZ')
            if(key<0 || d[key + 2] != '[') return 19
            var rd=global.copy(d)
            rd=rd.substring(key,rd.length)
            var data=rd.substring(rd.indexOf('[')+1,rd.indexOf(']'))
            data = data.replace(';', '')
            return data;
        }
        return info
    }
    removeBranch(data){
        if(data.length == 1){
            return data[0].split(";");
        }else{
            var re = [];
            re = re.concat(data[0].split(";"));
            data.splice(0, 1);
            for(var i in data){
                if(data[i][data[i].length-1] != ")"){
                    re = re.concat(data[i].split(";"));
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
    deleteHead(data){
        let str = data.indexOf('(;')
        if(str != -1 && str == 0) data = data.substring(2, data.length) 
        let str1 = data.indexOf(';'), str2 = data.indexOf('(;'), rindex
        if(str1 != -1 && str2 != -1){
            rindex = str1 < str2 ? str1 : str2
        }else if(str1)
        if(str1 < str2 && str1 != -1) data.substring(Number(str1) + 1, data.length)
    }
    branchPush(data, color){
        color = color || 1
        data = data.split(';')
        let rdata = [], sdata = [], tem
        for(var i in data){
            if(data[i] == "" || !data[i]) continue
            if(data[i].indexOf(')') != -1) data[i] = data[i].substring(0, data[i].indexOf(")"))
            
            sdata.push(data[i])
            // rdata.push()
            tem = this.parseSgfCoor(data[i])
            // if(tem[0] && tem[0].c == color) tem.unshift({x: -1, y: -1, c: -color})
            rdata = rdata.concat(tem)
        }
        return rdata
    } 
    //SGF coor transfrom
    parseSgfCoor(coor){
        let color = coor[0] == 'A' ? coor[1] : coor[0]
        color = color == 'B' ? 1 : -1
        let moves = coor.substring(coor.indexOf('['))
        moves = moves.split('[')
        moves = moves.join('')
        moves = moves.split(']')
        let data = [], rcoor
        for(var i in moves){
            if(moves[i] == '') continue
            if(data[data.length - 1]){
                if(data[data.length - 1].c == color){
                    data.push({
                        c: -color,
                        x: -1, y: -1
                    })
                }
            }
            rcoor = {c: color}
            if(moves[i].length >= 2){
                rcoor.x = this.StoN(moves[i][0])
                rcoor.y = this.StoN(moves[i][1])
                if(!this.isInBoard(rcoor.x, rcoor.y)) rcoor.x = -1, rcoor.y = -1
            }else rcoor.x = -1, rcoor.y = -1
            data.push(rcoor)
            // color = -color
        }
        return data
    }
    //带分支SGF
    branchDataParse(data){
        // return global.getStaticData(`${process.env.BASE_URL}txt/test.txt`)
        // .then(data => {
            data = data.replace(/\s/g,"");
            data = data.split('(')
            // data = data.filter(d => d)
            if(data[0] == '' || !data[0]) data.splice(0, 1)
            let head = data.shift()
            head = head.split(';')
            if(head[0] == '' || !head[0]) head.splice(0, 1)
            let step = []
            if(global.isArray(head)){
                let tem = head.shift()
                if(head && head.length){
                    step = step.concat(global.deepCopy(head))
                }
                head = tem
            }
            let sgfInfo = this.parseSgfInfo(head)
            data[data.length - 1].slice(-1)
            let color = null, rstep = []
            for(var i in step){
                rstep = rstep.concat(this.parseSgfCoor(step[i]))
            }
            step = rstep
            step.push([])
            let stack = [step[step.length - 1]], tem, index
            for(var i in data){
                tem = this.branchPush(data[i])
                stack[stack.length - 1].push(tem)
                stack.push(stack[stack.length - 1][stack[stack.length - 1].length - 1])
                if(data[i].indexOf(')') != -1){
                    let temp = data[i].substring(data[i].indexOf(')'))
                    temp = temp.split('')
                    temp.filter(j => {
                        stack.pop()
                    })
                }
            } 
            return step
        // })
    }
    parseBranchSgf(data, step, i){
        i = i || 0
        let tem = this.branchPush(data[i])
        step = step || []
        step.push(tem)
        i++
        if(i < data.length) return this.parseBranchSgf(data, step[step.length - 1], i)
        return step
        // if(data[i].indexOf(')') != -1)
    }
    // dataParseByBranch
    //GIB格式
    async gibDataParse(file){
        if(!file) return false
        let res = await global.parseGibData(file, 'gib')
        if(res && res.code == 0) return res.data
        return false
    }

    createSgfInfoGet(sgfInfo){
        sgfInfo = sgfInfo || {}
        let {ha} = sgfInfo
        if(ha && !isNaN(Number(ha))){
            sgfInfo.st = sgfInfo.st || {}
            sgfInfo.st.value = ha.value * 2 - 1
        }
        return sgfInfo
    }
    //生成SGF数据
    CreateSgfDataByStep(options){
        // step,setStone,n,scope
        let step = options.step,
            setStone = options.setStone || [],
            position = options.position || step.length - 1,
            komi = options.komi,
            sgfInfo = options.sgfInfo || {},
            size = this.boardSizeGet(options.size)
        // var postData = this.sgfHead + "SZ[" + size + "]";
        let postData = this.sgfHead, kmL = false, szL = false
        if(step[0] && step[0].c == -1) step.shift()
        sgfInfo = this.createSgfInfoGet(sgfInfo)
        for(var i in sgfInfo){
            if(sgfInfo[i].value !== undefined && sgfInfo[i].value !== null && sgfInfo[i].value !== '' && i != 'fileName'){
                if(i == 'km') kmL = true
                if(i == 'sz') szL = true
                sgfInfo[i].value = (sgfInfo[i].value + '').replace(';', '')
                postData += (i.toUpperCase() + "[" + sgfInfo[i].value + "]");
            }
        }
        if(!szL) postData+="SZ[" + size + "];"
        if(!kmL){
            postData = postData.slice(0, -1)
            postData += 'KM[' + komi + '];'
        }
        if(szL && kmL) postData += ';'
        var color=null, rco, coord, setColor=null, j = 0;
        for(var i = 0; i <= position; i++){
            if(!step[i]) continue
            setColor=null;
            if(setStone[j] && setStone[j].k == i){
                for(var k in setStone[j].v){
                    coord={
                        x:String.fromCharCode(setStone[j].v[k].x+97),
                        y:String.fromCharCode(setStone[j].v[k].y+97)
                    }
                    color=setStone[j].v[k].c==1?'AB':'AW';
                    if(setColor==color){
                        postData+="["+coord.x+coord.y+"]"
                    }else{
                        setColor=color
                        postData+=setColor;
                        postData+="["+coord.x+coord.y+"]"
                    }
                }
                postData+=";"
                j++;
            }
            coord={
                    x: String.fromCharCode(step[i].x + 97),
                    y: String.fromCharCode(step[i].y + 97)
                }
            color = step[i].c == 1 ? 'B' : 'W';
            if(step[i].x != -1 && step[i].y != -1){
                postData = postData+color + '['+coord.x+coord.y+"];"
            }else{
                postData = postData+color + "[];"
            }
        }
        if(setStone[j]){
            setColor = null;
            for(var k in setStone[j].v){
                coord={
                    x: String.fromCharCode(setStone[j].v[k].x+97),
                    y: String.fromCharCode(setStone[j].v[k].y+97)
                }
                color=setStone[j].v[k].c == 1 ? 'AB' : 'AW';
                if(setColor == color){
                    postData += "[" + coord.x+coord.y + "]"
                }else{
                    setColor = color
                    postData += setColor;
                    postData += "[" + coord.x+coord.y + "]"
                }
            }
            postData += ";";
        }
        postData = postData.substring(0, postData.length - 1) + ")";
        return postData;
    }
    async sgfDataParseByPath(path){
        let data = await global.getStaticData(`${process.env.BASE_URL}txt/${path}`)
        return this.sgfDataParseNew(data)
    }
    // parse sgf file
    sgfDataParseNew(data){
        return this.sgfDataParse(data)
        data = data.replace(/\s/g,"");
        data = data.split('(')
        // data = data.filter(d => d)
        if(data[0] == '' || !data[0]) data.splice(0, 1)
        let head = ''
        if(data.length > 1) head = data.shift()
        head = head.split(';')
        if(head[0] == '' || !head[0]) head.splice(0, 1)
        let step = []
        if(global.isArray(head) && head.length > 0){
            let tem = head.shift()
            if(head && head.length){
                step = step.concat(global.deepCopy(head))
            }
            head = tem
        }
        let sgfInfo = this.parseSgfInfo(head)
        data[data.length - 1].slice(-1)
        let color = null, rstep = []
        for(var i in step){
            rstep = rstep.concat(this.parseSgfCoor(step[i]))
        }
        step = rstep
        return this.sgfDataParseAction({
            head: head,
            sgf: data[0]
        })
    }
    sgfDataParseAction(opt){
        let finalData = {
            normal: [],
            setStone: [],
            info: {},
            gtp: []
        },
        
        x, y, c, s, ta = [], color = 1, move
        return
    }
    parseSgfWithBranch(data){
        // data = data.replace(/\s/g,"");
        data = data.replace(/^\s*|\s*$/g, '');
        
        data = data.split('(')
        // data = data.filter(d => d)
        if(data[0] == '' || !data[0]) data.splice(0, 1)
        let head = data.shift()
        head = head.split(';')
        if(head[0] == '' || !head[0]) head.splice(0, 1)
        let step = []
        if(global.isArray(head)){
            let tem = head.shift()
            if(head && head.length){
                step = step.concat(global.deepCopy(head))
            }
            head = tem
        }
        data = data.join('(')
        data = `(;(${data}`
    }
    
    parseSgfWithBranch(data){
        let promise = new Promise(success => {
            data = data.replace(/\ +/g,"")
            data = data.replace(/[\r\n]/g,"")
            this.parseSgfObj.init(data, res => {
                success(res)
            })
        })
        return promise
    }

    async parseSgfToStep(data){
        let res = await this.parseSgfWithBranch(data)
        let step = this.commonSgfToStep(res)
        return step
    }
    commonSgfToStep(data, step){
        let coorPush = (coor) => {
            let c = step.length % 2 == 0 ? 1 : -1
            coor = coor || 'tt'
            coor = {
                x: this.StoN(coor[0]),
                y: this.StoN(coor[1]),
            }
            coor = this.coor2to1(coor.x, coor.y)
            if(step[step.length - 1] == -1 && coor == -1){
                step.pop()
            }else{
                step.push(coor)
            }
            c = -c
            return c
        }


        data = data || {}
        let key = '_children'
        step = step || []
        let AB = global.deepCopy(data.AB) || [], AW = global.deepCopy(data.AW) || [], B = data.B, W = data.W
        let setStone = {AB, AW}, norStone = {B, W}
        let c = step.length % 2 == 0 ? 1 : -1
        let num = Math.abs(AB.length - AW.length)
        if(num > 0){
            let key = AB.length > AW.length ? 'AW' : 'AB'
            for(var i = 1; i <= num; i++){
                setStone[key].push('tt')
            }
        }
        let len = setStone.AB.length
        let acColor = c == 1 ? 'AB' : 'AW'
        let otColor = c == 1 ? 'AW' : 'AB'
        for(var i = 0; i < len; i++){
            coorPush(setStone[acColor][i])
            coorPush(setStone[otColor][i])
        }
        acColor = c == 1 ? 'B' : 'W'
        otColor = c == 1 ? 'W' : 'B'
        coorPush(norStone[acColor])
        coorPush(norStone[otColor])
        if(step[step.length - 1] == -1) step.pop()
        let nextStep = data[key] || []
        if(!nextStep.length) return step
        return this.commonSgfToStep(nextStep[0], step)
    }
}

