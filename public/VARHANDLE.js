window.VARHANDLE = {
    deepCopy: function(obj){
        if(this.isString(obj) || this.isBool(obj) || this.isNumber(obj) || !obj) return obj
        return JSON.parse(JSON.stringify(obj))
    },
    copy: function(obj){
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
    isArray: function(obj){
        return Object.prototype.toString.call(obj) == '[object Array]'
    },
    isObject: function(obj){
        return Object.prototype.toString.call(obj) == '[object Object]'
    },
    isString: function(obj){
        return Object.prototype.toString.call(obj) == '[object String]'
    },
    isNumber: function(obj){
        return Object.prototype.toString.call(obj) == '[object Number]'
    },
    isBool: function(obj){
        return Object.prototype.toString.call(obj) == '[object Boolean]'
    },
}