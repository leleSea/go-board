import Vue from 'vue'
import i18n_USE from 'vue-i18n'
import axios from 'axios'
import {langMixedInit} from './mixin/languageMixin'

let langAvailable = (lang) =>{
    let list = window.GLOBALATTR.langSelectItems
    let f = false
    for(var i in list){
        if(list[i].label == lang){
            f = list[i].label
            break
        }
    }
    return f
}
function isBrowserDefaultLang(){
    let lang = (navigator.language||navigator.userLanguage).substr(0, 2)
    return langAvailable(lang)
}
let getLocalLang = () =>{
    let lang = localStorage.getItem('lang')
    if(!lang) return null
    return langAvailable(lang)
}
let init = async () => {
    let status = false
    let path = `https://assets.19x19.com/language/lang.json`
    // let path = `${process.env.BASE_URL}txt/language/lang.json`
    console.log(path)
    let res = await axios.get(path)
    if(res && res.status == 200){
        let data = res.data
        if(!data) return
        status = true
        let langList = window.GLOBALATTR.langSelectItems
        let langMessages = {}
        for(var i in langList){
            langMessages[langList[i].label] = {}
        }
        for(var i in data){
            for(var j in data[i]){
                if(langMessages[j] == undefined || !data[i][j] || data[i][j] == '') continue
                langMessages[j][i] = data[i][j]
            }
        }
        Vue.use(i18n_USE)
        window.i18n = new i18n_USE({
            locale:   getLocalLang() || isBrowserDefaultLang() || 'zh',
            messages: langMessages
        })
        let mixedData = langMixedInit()
        if(mixedData) Vue.mixin(mixedData)
    }
    return status
}

export const languageInit = init
