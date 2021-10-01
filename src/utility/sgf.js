import store from '../store'
import sgfParse from '@/API/sgfParse'
const _sgfParse = new sgfParse()

export default {
    $store: store,
    _sgfParse: _sgfParse,
    async lengthCheck(moves){
        console.log()
        if(this._sgfParse._dataType.isString(moves)){
            moves = await this._sgfParse.parseBranch_sgf(moves)
            moves = _sgfParse.parseBranchToMove({sgf: moves})
        }
        return this.lengthCheckSync(moves)
    },
    lengthCheckSync(moves){
        if(!this._sgfParse._dataType.isArray(moves)) return false
        let {max} = this.$store.state.sgf
        if(moves.length <= max) return {code: 0}
        return {code: 'length is too long', max: max}
    }
}