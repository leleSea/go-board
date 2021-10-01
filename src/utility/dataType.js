export default class localDataControl{
    constructor(opt){

    }
    deepCopy(obj) {
        if (this.isString(obj) || this.isBool(obj) || this.isNumber(obj) || !obj) return obj
        return JSON.parse(JSON.stringify(obj))
    }
    copy(obj) {
        let type = null
        if (this.isArray(obj)) {
            type = []
        } else if (this.isObject(obj)) {
            type = {}
        } else {
            return obj
        }
        return Object.assign(type, obj)
    }
    isArray(obj) {
        return Object.prototype.toString.call(obj) == '[object Array]'
    }
    isObject(obj) {
        return Object.prototype.toString.call(obj) == '[object Object]'
    }
    isString(obj) {
        return Object.prototype.toString.call(obj) == '[object String]'
    }
    isNumber(obj) {
        return Object.prototype.toString.call(obj) == '[object Number]'
    }
    isBool(obj) {
        return Object.prototype.toString.call(obj) == '[object Boolean]'
    }
    isVideo(val){
        let rx = /\.(mp4|wmv|ramb|avi|flv)(\?.*)?$/
        return rx.test(val)
    }
    isImg(val){
        let rx = /\.(png|jpe?g|gif|svg)(\?.*)?$/
        return rx.test(val)
    }

}