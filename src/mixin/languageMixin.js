import errorMsgLan from '../assets/errorMsg'
import tool from '../tool'
var i18nObj
let msgHandle = (data)  => {
    data = data || tool.deepCopy(errorMsgLan)
    for(var i in data){
        if(tool.isBool(data[i]) || tool.isNumber(data[i])) continue

        if(tool.isObject(data[i]) || tool.isArray(data[i])){
            data[i] = msgHandle(data[i])
            continue
        }
        data[i] = i18nObj.t(data[i])
    }
    return data
}
let msg = {
    errorMsg: {}
}
window.__ERRORMSG = msg
let languageLang
let init = () => {
    let GLOBALATTR = tool.deepCopy(window.GLOBALATTR)
    i18nObj = window.i18n || null
    languageLang = {
        i18n: {
            locale: i18nObj.locale
        }
    }
    let _data
    let msg = {
        errorMsg: {}
    }
    window.__ERRORMSG = msg
    
    if(i18nObj){
        msg.errorMsg = msgHandle()
        // window.GLOBALATTR = msgHandle(tool.deepCopy(GLOBALATTR))
        _data = {
            data(){
                return {
                    errorMsgMixin: msg,
                    languageLang: languageLang,
                }
            },
            methods: {
            },
            created(){
            },
            watch: {
                errorMsgMixin:{
                    handler(val){
                        if(val && val.errorMsg) this.errorMsg = val.errorMsg
                    },
                    deep: true,
                    immediate: true
                },
                $route: {
                    handler(newVal, oldVal){
                        if(this.watchRoute) this.watchRoute(newVal, oldVal)
                    },
                    deep: true,
                    immediate: true
                }
                // languageLang: {
                //     handler(val){
                //         if(this.languageLangChange) this.languageLangChange()
                //     },
                //     deep: true,
                //     immediate: true
                // },
            }
        }
        return _data
    }
}

// let GLOBALATTR = tool.deepCopy(window.GLOBALATTR)
// let i18nObj = window.i18n || null
// let languageLang = {
//     i18n: {
//         locale: i18nObj.locale
//     }
// }
// let _data
// let msg = {
//     errorMsg: {}
// }
// window.__ERRORMSG = msg
// let msgHandle = (data)  => {
//     data = data || tool.deepCopy(errorMsgLan)
//     for(var i in data){
//         if(tool.isBool(data[i]) || tool.isNumber(data[i])) continue

//         if(tool.isObject(data[i]) || tool.isArray(data[i])){
//             data[i] = msgHandle(data[i])
//             continue
//         }
//         data[i] = i18nObj.t(data[i])
//     }
//     return data
// }
// if(i18nObj){
//     msg.errorMsg = msgHandle()
//     window.GLOBALATTR = msgHandle(tool.deepCopy(GLOBALATTR))
//     _data = {
//         data(){
//             return {
//                 errorMsgMixin: msg,
//                 languageLang: languageLang
//             }
//         },
//         methods: {
//         },
//         created(){
//         },
//         watch: {
//             errorMsgMixin:{
//                 handler(val){
//                     if(val && val.errorMsg) this.errorMsg = val.errorMsg
//                 },
//                 deep: true,
//                 immediate: true
//             },
//             languageLang: {
//                 handler(val){
//                 },
//                 deep: true,
//                 immediate: true
//             },
//         }
//     }
// }
export const languageMixinSetup = () => {
    msg.errorMsg = msgHandle()
    // window.__GLOBALATTR.GLOBALATTR = msgHandle(tool.deepCopy(GLOBALATTR))
    languageLang.i18n = {
        locale: i18nObj.locale
    }
}
export const langRequireHandle = msgHandle
export const langMixedInit = init
// export default _data