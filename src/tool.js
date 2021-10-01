
export default {
    deepCopy(obj){
        if(this.isString(obj) || this.isBool(obj) || this.isNumber(obj) || !obj) return obj
        return JSON.parse(JSON.stringify(obj))
    },
    copy(obj){
        let type =  null
        if(this.isArray(obj)){
            type = []
        }else if(this.isObject(obj)){
            type = {}
        }else{
            return obj
        }
        return Object.assign(type, obj)
    },
    isArray(obj){
        return Object.prototype.toString.call(obj) == '[object Array]'
    },
    isObject(obj){
        return Object.prototype.toString.call(obj) == '[object Object]'
    },
    isString(obj){
        return Object.prototype.toString.call(obj) == '[object String]'
    },
    isNumber(obj){
        return Object.prototype.toString.call(obj) == '[object Number]'
    },
    isBool(obj){
        return Object.prototype.toString.call(obj) == '[object Boolean]'
    },
    isDate(obj){
        return Object.prototype.toString.call(obj) == '[object Date]'
    },
}