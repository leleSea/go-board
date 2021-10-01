import commonApi from './common'
import sgfParse from './sgfParse'

export default class sgf extends commonApi{
    constructor(){
        let localKey = 'user_sgf'
        super({localKey: localKey})
        this.propInit()
        this._sgfParse = new sgfParse()
    }
    propInit(){
        this.folderList = []
        this.staticList = [
            {
                title: '我的棋谱',
                login: true,
                sort: 0,
                children: [
                    {
                        title: 'AI对弈', command: 'AISgf', game_type: 0
                    },
                    {
                        title: '我的上传', command: 'myUpload', game_type: 1
                    },
                    {
                        title: '我的收藏', command: 'myFavourite', refresh: true
                    },
                    {
                        title: '分析报告', command: 'report',
                    },
                ]
            },
            {
                title: '公共棋谱',
                login: false,
                sort: 3,
                children: [
                    {title: '大赛棋谱', command: 'publicMatchSgf'},
                ]
            },
            {
                title: '死活题', 
                login: true,
                command: 'lifeDeathSgf',
                sort: 2,
                value: 'lifeDeath'
            }
        ],
        this.listInitFun = {
            '我的盘面': 'engineSgfGet',
            '学生棋谱': 'stuSgfGet',
            '我的棋谱': 'staticGet',
            '公共棋谱': 'staticGet'
        }
        this.list = []

        this.apiList = {
            'normalGameList': {url: '/games/{username}'},
            'publicGameList': {url: '/games/{username}', login: false},
            'gameSgfGet': {url: '/games/{username}/{id}', login: false},
            'gameMeta': {url: '/games/meta/{username}/{id}', login: false},
            'favourite': {url: '/games/{username}/favourite'},
            'report': {url: '/games/report/{username}'},
            'situations': {url: '/situations/{username}/{folder}'},
            'situationsData': {url: '/situations/{id}'},
            'ldpSgf': {url: '/puzzle/life/meta/list/{username}'},
            'ldpSgfData': {url: '/puzzle/life/meta/{id}'},
            'ldpSgfDelete': {url: '/puzzle/life/meta/{id}'},
            'collectSgf': {url: '/games/{username}/favourite'},
            'deleteSgf': {url: '/games/{username}/{id}'},
            'engineDelete': {url: '/situations/delete'},

            'saveSgf': {url: '/games'},
            'modifySgf': {url: '/games/metas'},

            'searchSgf': {url: '/games/search/{username}'},
            'searchPublicSgf': {url: '/games/search/public'},
        }
    }
    async listGet(){
        let staticList = await this.listGetAction()
        staticList = this._global.sortData(staticList, (v1, v2) => {
            let sort1 = v1.sort || 0, sort2 = v2.sort || 0
            return sort1 < sort2
        })
        staticList = this.pathKeySet(staticList)
        this.list = staticList
        
        return staticList
    }
    async listGetAction(funList, data, finishFun){
        finishFun = finishFun || {}
        data = data || []
        funList = funList || this._global.deepCopy(this.listInitFun)
        if(this._global.isObject(funList)) funList = Object.values(funList)
        if(!funList || !funList.length) return data
        let fun = funList.pop()
        if(this[fun] && !finishFun[fun]){
            let listData = await this[fun]()
            finishFun[fun] = true
            if(listData){
                if(this._global.isArray(listData)) data = data.concat(listData)
                else data.push(listData)
            }
        }
        return this.listGetAction(funList, data, finishFun)
    }
    async refreshList(opt){
        return this.listGet()
    }
    async refreshListAction(refreshKey, list){
        list = list || this.list
        let funList = this.listInitFun
        let realFunList = []
        for(var i in refreshKey){
            if(funList[refreshKey[i]]) realFunList.push(funList[refreshKey[i]])
        }
    }
    async staticGet(){
        return this._global.deepCopy(this.staticList)
    }
    pathKeySet(list){
        list = list || []
        for(var i in list){
            list[i].index = i
            list[i] = this.pathKeySetAction(list[i])
        }
        return list
    }
    pathKeySetAction(data, key, nodeKey){
        data = data || {}
        let children = data.children
        key = key ? `${key}-${data.title}` : data.title
        nodeKey = nodeKey ? `${nodeKey}-${data.index}` : data.index
        data.key = key
        data.nodeKey = nodeKey

        if(!children || !children.length){
            return data
        }
        for(var i in children){
            children[i].index = i
            let chi = children[i].children
            children[i].key = `${key}-${children[i].title}`
            children[i].nodeKey = `${nodeKey}-${children[i].index}`
            if(chi && chi.length){
                children[i] = this.pathKeySetAction(children[i], key, nodeKey)
                continue
            }
        }
        data.children = children
        return data
    }
    async engineSgfGet(){
        this._loading.open()
        let res = await this._global.getSaceBoardFolder()
        let menu = null
        menu = {
            title: '我的盘面', 
            openStatus: false,
            login: true,
            children: [],
            sort: 1
        }
        if(res && res.code == 0){
            let data = res.data
            this.folderList = this._global.deepCopy(data)
            if(!this._global.isArray(data)) data = [data]
            
            for(var i in data){
                let signLabel = null
                if(i == data.length - 1) signLabel = 'lastSitu'
                name = data[i]
                let defaultFolder = this._global.engineSgfNameGet(name)
                menu.children.push({
                    title: name,
                    command: 'engineSgfOpen',
                    value: data[i],
                    type: 'situation',
                    signLabel: signLabel,
                    board: true,
                    default: defaultFolder,
                    deleteAvai: defaultFolder ? false : true
                })
            }
            menu.children.push({
                title: '新建',
                command: 'createSitFolderOn',
                type: 'createFolder',
                class: 'create-box',
                subTextIcon: 'el-icon-plus'
            })
        }
        this._loading.close()
        return menu
    }
    async stuSgfGet(){
        this._loading.open()
        let res = await this._global.getStusSgf()
        let menu = null
        if(res && res.code == 0 && res.data && res.data.length){
            let data = res.data
            if(!this._global.isArray(data)) data = [data]
            let rd = {}
            for(var i in data){
                let key = `${data[i].className}`
                if(!rd[key]) rd[key] = []
                rd[key].push({
                    title: data[i].studentNickname || data[i].student,
                    username: data[i].student,
                    command: 'studentSgfOpen',
                    className: data[i].className,
                    organization: data[i].organization,
                    school: data[i].school,
                    nickname: data[i].studentNickname
                }) 
            }
            let stuMenu = []
            for(var i in rd){
                for(var j in rd[i]){
                    rd[i][j].children = [
                        {
                            title: '对弈',
                            username: rd[i][j].username,
                            command: 'studentSgfOpen',
                            className: rd[i][j].className,
                            organization: rd[i][j].organization,
                            school: rd[i][j].school,
                            nickname: rd[i][j].nickname,
                            gameType: 0
                        },
                        {
                            title: '上传',
                            username: rd[i][j].username,
                            command: 'studentSgfOpen',
                            className: rd[i][j].className,
                            organization: rd[i][j].organization,
                            school: rd[i][j].school,
                            nickname: rd[i][j].nickname,
                            gameType: 1
                        },
                        {
                            title: '特训',
                            username: rd[i][j].username,
                            command: 'studentSgfOpen',
                            className: rd[i][j].className,
                            organization: rd[i][j].organization,
                            school: rd[i][j].school,
                            nickname: rd[i][j].nickname,
                            gameType: 5
                        },
                    ]
                }
                stuMenu.push({
                    title: i,
                    children: rd[i]
                })
            }
            menu = {
                title: '学生棋谱', 
                openStatus: false,
                children: stuMenu,
                login: true,
                sort: 4
            }
        }
        this._loading.close()
        return menu
    }
    ldpSgfGet(){
        let menu = {
            title: '死活题', 
            login: true,
            command: 'lifeDeathSgf',
            sort: 1,
            value: 'lifeDeath'
        }
        return menu
    }

    //删除盘面文件夹
    async deleteFolder(node){
        node = node || {}
        let folder = node.value
        let res = await this._global.deleteSitFolder(folder)
        return res
    }


    //获取棋谱列表
    async getNormalSgf(opt){
        let options = {
            data: opt,
        }
        let {gameType} = opt
        // let url = 'normalGameList'
        // if(gameType == )
        return this.requestAction('normalGameList', options)
    }

    //获取公共棋谱
    async getpublicSgf(opt) {
        opt = opt || {}
        opt['username'] = '0086-golaxy_public'
        opt['game_type'] = 2
        let options = {
            data: opt,
            username: opt.username
        }
        return this.requestAction('publicGameList', options)
    }
    async getSgfData(id, opt){
        let username = this._appData.getStoreItem('username') || null
        if(!username) username = 'guest'
        let options = {
            data: {id},
            username,
            id
        }
        let res = await this.requestAction('gameSgfGet', options)
        if(res){
            let {sgf} = res
            // sgf = await this._sgfParse.parseBranch_sgf(sgf)
            // let movesData = this._sgfParse.parseBranchToMoveFull({sgf})
            opt = opt || {}
            let {boardSize} = opt
            let movesData = await this.sgfDataParse(sgf, boardSize)
            let d = this._global.sgfLengthCheckSync(movesData.moves)
            if(!d) return false
            
            // let moves = this._sgfParse.sgfToMoves(movesData.moves, boardSize)
            res.moves = movesData.moves
            res.sgfInfo = movesData.sgfInfo
        }
        return res
    }

    async getSituationsData(id, opt){
        let options = {
            data: {id},
            id
        }
        let res = await this.requestAction('situationsData', options)
        if(res){
            opt = opt || {}
            let {boardSize} = opt
            let sgf = res.moves
            let movesData = await this.sgfDataParse(sgf, boardSize)
            let d = this._global.sgfLengthCheckSync(movesData.moves)
            if(!d) return false
            res.moves = movesData.moves
            res.sgfInfo = movesData.sgfInfo
        }
        return res
    }
    async getLdpSgfData(id, opt){
        let options = {
            data: {id},
            id
        }
        let res = await this.requestAction('ldpSgfData', options)
        if(res){
            opt = opt || {}
            let {boardSize} = opt
            let {sgf} = res
            let movesData = await this.sgfDataParse(sgf, boardSize)
            let d = this._global.sgfLengthCheckSync(movesData.moves)
            if(!d) return false
            res.moves = movesData.moves
            res.sgfInfo = movesData.sgfInfo
        }
        return res
    }

    async sgfDataParse(sgf, boardSize){
        sgf = await this._sgfParse.parseBranch_sgf(sgf)
        let movesData = this._sgfParse.parseBranchToMoveFull({sgf})
        boardSize = boardSize || movesData.sgfInfo.sz.value || 19
        movesData.moves = this._sgfParse.sgfToMoves(movesData.moves, boardSize)
        return movesData
    }
    async getGameMeta(id){
        // `/games/meta/${store.state.username}/${id}`,
        let username = this._appData.getStoreItem('username') || null
        if(!username) username = 'guest'
        let options = {
            data: {
                id,
                username
            },
            id,
            username
        }
        return this.requestAction('gameMeta', options)
    }
    async getSgfList(type, opt){
        if(!this[`${type}Sgf_get`]) return false
        return this[`${type}Sgf_get`](opt)
    }
    async normalSgf_get(opt){
        let username = this._appData.getStoreItem('username') || null
        opt.username = opt.username || username
        let options = {
            data: opt,
            username: opt.username
        }
        return this.requestAction('normalGameList', options)
    }
    async favouriteSgf_get(opt){
        opt = opt || {}
        let username = this._appData.getStoreItem('username') || null
        if(!username) return false
        opt.username = opt.username || username
        let options = {
            data: opt,
            username
        }
        return this.requestAction('favourite', options)
    }
    async reportSgf_get(opt){
        opt = opt || {}
        let username = this._appData.getStoreItem('username') || null
        if(!username) return false
        opt.username = opt.username || username
        let options = {
            data: opt,
            username
        }
        return this.requestAction('report', options)
    }
    async situationsSgf_get(opt){
        opt = opt || {}
        // /api/engine/situations/0086-mobile_test/%E9%BB%98%E8%AE%A4?username=0086-mobile_test&folder=%E9%BB%98%E8%AE%A4
        let username = this._appData.getStoreItem('username') || null
        if(!username) return false
        let {folder} = opt
        opt.username = opt.username || username
        let options = {
            data: opt,
            username,
            folder
        }
        return this.requestAction('situations', options)
    }
    async ldpSgf_get(opt){
        // /puzzle/life/meta/list/0086-15010193341?page=0&size=8
        opt = opt || {}
        let username = this._appData.getStoreItem('username') || null
        opt.username = opt.username || username
        if(!opt.username) return false
        let options = {
            data: opt,
            username
        }
        return this.requestAction('ldpSgf', options)
    }
    async collectSgfSet(id, opt){
        // /games/0086-15010193341/favourite
        opt = opt || {}
        let username = this._appData.getStoreItem('username') || null
        opt.username = opt.username || username
        if(!opt.username) return false
        let options = {
            data: {
                id,
                username: opt.username
            },
            method: 'POST',
            id
        }
        return this.requestAction('collectSgf', options)
    }
    async collectSgfCancel(id, opt){
        opt = opt || {}
        let username = this._appData.getStoreItem('username') || null
        opt.username = opt.username || username
        if(!opt.username) return false
        let options = {
            data: {
                id,
                username: opt.username
            },
            method: 'DELETE',
            id
        }
        return this.requestAction('collectSgf', options)
    }
    async sgfDelete(id, opt){
        opt = opt || {}
        let {type} = opt
        type = type || 'normal'
        if(!this[`${type}_sgfDelete`]) return
        return this[`${type}_sgfDelete`](id, opt)
    }
    async normal_sgfDelete(id, opt){
        opt = opt || {}
        let username = this._appData.getStoreItem('username') || null
        opt.username = opt.username || username
        if(!opt.username) return false
        let options = {
            data: {
                id,
                username: opt.username
            },
            username: opt.username,
            method: 'DELETE',
            id
        }
        return this.requestAction('deleteSgf', options)
    }
    async engine_sgfDelete(id, opt){
        let options = {
            data: {
                id,
            },
            method: 'POST',
        }
        return this.requestAction('engineDelete', options)
    }
    async ldp_sgfDelete(id, opt){
        let options = {
            data: {
                id,
            },
            id,
            method: 'DELETE',
        }
        return this.requestAction('ldpSgfDelete', options)
    }


    async saveSgf(params){
        params = params || {}
        params = this._global.saveGameOptGet(params)
        let {sgf} = params
        let d = await this._global.sgfLengthCheck(sgf)
        if(!d) return false
        let options = {
            data: params,
            method: 'POST',
        }
        return this.requestAction('saveSgf', options)
    }

    async modifyInfo(params){
        // modifySgf
        params = params || {}
        params = this._global.editGameOptGet(params)
        let options = {
            data: params,
            method: 'POST',
        }
        return this.requestAction('modifySgf', options)
    }
    getSearchApi(type){
        return type == 'public' ? 'searchPublicSgf' : 'searchSgf'
    }
    async searchSgf(opt){
        opt = opt || {}
        let {username, key, page, size, type} = opt
        page = page || 0
        username = username || this.usernameGet() || 'guest'
        if(username == 'guest') type = 'public'
        if(!key) return []
        let api = this.getSearchApi(type)
        let options = {
            data: {
                key, username,
                page, size
            },
            method: 'GET',
            username
        }
        return this.requestAction(api, options)
    }
}