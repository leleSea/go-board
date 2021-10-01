

function singleProxy(fun){
    let instance
    let handler = {
        construct(target, args){
            if(!instance){
                instance = Reflect.construct(fun, args)
            }
            return instance
        }
    }
    return new Proxy(fun, handler)
}

export {singleProxy}