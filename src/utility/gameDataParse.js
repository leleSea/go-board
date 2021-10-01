
export default class gameConfig{
    constructor(opt){
        opt = opt || {}
        this.levelList = opt.levelList || []
        this.gameTypeMap = {
            '00': '自由对弈',
            '01': '定级对弈',
            '02': '升降级对弈',
            '03': '高水平对弈',
            '5': '特训对弈',
        }
    }
    pbParse(opt){
        opt = opt || {}
        let {levelList} = this
        let {pb, gameType, boardSize, level} = opt
        if(!this.isGamePlayer({p: pb, gameType})) return pb
        let rd = {}
        for(var i in levelList){
            if(levelList[i].eloLevel == level && levelList[i].boardSize == boardSize){
                rd = levelList[i]
                break
            }
        }
        return rd.name || pb
    }
    pwParse(opt){
        opt = opt || {}
        let {levelList} = this
        let {pw, gameType, boardSize, level} = opt
        if(!this.isGamePlayer({p: pw, gameType})){
            return pw
        }
        let rd = {}
        for(var i in levelList){
            if(levelList[i].eloLevel == level && levelList[i].boardSize == boardSize){
                rd = levelList[i]
                break
            }
        }
        return rd.name || pw
    }
    isGamePlayer(opt){
        opt = opt || {}
        let defaultAIName = '星阵'
        let {gameTypeMap} = this
        let {p, gameType} = opt
        if(!gameTypeMap[gameType] || p != defaultAIName) return false
        return true
    }
    levelParse(opt){
        opt = opt || {}
        let {level, boardSize} = opt
        let rd = {}
        for(var i in levelList){
            if(levelList[i].eloLevel == level && levelList[i].boardSize == boardSize){
                rd = levelList[i]
                break
            }
        }
        return rd.humanLevel || ''
    }
}
