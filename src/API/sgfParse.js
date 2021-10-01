import dataType from '@/utility/dataType'

export default class sgfParse{
    constructor(opt){
        this.init()
    }
    init(opt){
        for(let i in opt){
            this[i] = opt[i]
        }
        this.sgfInfo = {
            gn: { label: '棋谱名', value: null },
            pw: { label: '白方姓名', value: null },
            pb: { label: '黑方姓名', value: null },
            wr: { label: '白方段位', value: null },
            br: { label: '黑方段位', value: null },
            wt: { label: '白方代表队', value: null },
            bt: { label: '黑方代表队', value: null },
            ha: { label: '让子', value: null },
            re: { label: '结果', value: null },
            ev: { label: '赛事', value: null },
            dt: { label: '日期', value: null },
            pc: { label: '地点', value: null },
            tm: { label: '比赛用时', value: null },
            ro: { label: '回合', value: null },
            lt: { label: '读秒', value: null },
            lc: { label: '读秒次数', value: null },
            rd: { label: '日期', value: null },
            km: { value: 7.5, label: '3又3/4子' },
            sz: { label: '棋谱路数', value: 19 },
            up: { label: '类型', value: null },
            st: { label: '起始手数', value: 0 }
        }
        this.branchKey = '_children'
        this._dataType = new dataType()
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
    parseBranch_sgf(sgf){
        return new Promise(success => {
            this.parseSgfObj.init(sgf, res => {
                success(res)
            })
        })
    }
    parseBranchToMove(opt){
        opt = opt || {}
        let {key, sgf, moves} = opt
        key = key || this.branchKey
        let data = sgf[key] || []
        moves = moves || []
        data = data[0] || {}
        if(data.B || data.W){
            moves.push(data.B || data.W)
        }
        if(!data[key]) return moves
        return this.parseBranchToMove({
            sgf: data,
            moves,
            key
        })
    }
    parseBranchToMoveAct(opt){
        let {key, data, moves} = opt
        moves = moves || []
        key = key || this.branchKey

    }
    sgfInfoHand(data, sgfInfo){
        data = data || {}
        sgfInfo = sgfInfo || {}
        for(var i in data){
            let key = i.toLowerCase()
            if(key == 'sz'){
                let sz = Number(data[i])
                if(isNaN(sz)) sz = 19
                data[i] = sz
            }
            if(sgfInfo[key] !== undefined) sgfInfo[key].value = data[i]
        }
        return sgfInfo
    }
    parseBranchToMoveFull(opt){
        opt = opt || {}
        let {key, sgf, moves, sgfInfo} = opt
        key = key || this.branchKey
        moves = moves || []
        sgfInfo = sgfInfo || this.sgfInfo
        sgfInfo = this._dataType.deepCopy(sgfInfo)
        sgfInfo = this.sgfInfoHand(sgf, sgfInfo)
        if(sgf.B == '' || sgf.B == ' ') sgf.B = 'tt'
        if(sgf.W == '' || sgf.W == ' ') sgf.W = 'tt'
        if(sgf.B || sgf.W){
            moves.push(sgf.B || sgf.W)
        }
        sgf = sgf[key] || []
        if(!sgf || !sgf.length) return {moves, sgfInfo}
        sgf = sgf[0]
        
        return this.parseBranchToMoveFull({sgf, moves, sgfInfo, key})
    }
    StoN(s) {
        return s.charCodeAt() - 97
    }
    NtoS(n) {
        return String.fromCharCode(n + 97)
    }
    coor2to1(x, y, boardSize) {
        boardSize = boardSize || 19
        if (x == -1 || y == -1) {
            return -1
        }
        return y * boardSize + x;
    }
    coor1to2(n, boardSize) {
        boardSize = boardSize || 19
        if (n == -1) {
            return {
                x: -1,
                y: -1
            }
        }
        return {
            x: n % boardSize,
            y: parseInt(n / boardSize)
        };
    }
    sgfToMoves(data, boardSize){
        boardSize = boardSize || 19
        let list = this._dataType.deepCopy(data)
        if(!this._dataType.isArray(list)) list = [list]
        for(var i in list){
            let tem = list[i] || ''
            if(!tem || tem == '' || tem == ' ') continue
            tem = tem.toLowerCase()
            let coor
            if(tem == 'pass' || tem == 'tt') coor = -1
            else{            
                let x = this.StoN(tem[0]), y = this.StoN(tem[1])
                coor = this.coor2to1(x, y, boardSize)
            }
            list[i] = coor

        }
        if(!this._dataType.isArray(data)) list = list[0]
        return list
    }
} 