
import Vue from 'vue'

import {languageInit} from './language.js'
// import languageMixin from './mixin/languageMixin'
import { languageMixinSetup } from './mixin/languageMixin'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/css/reset.less'
import './assets/css/reset_x.less'
import axios from 'axios';
import global from './global.js'
import errorMsgCopy from './assets/errorMsg.js'
import { Loading } from 'element-ui';
import VueMeta from 'vue-meta'
import AFTableColumn from 'af-table-column'
import leConfirm from './components/leConfirm.vue'

Vue.component('leConfirm', leConfirm)


Vue.prototype.GLOBAL = global
Vue.prototype.axios = axios



axios.defaults.retryDelay = 1000;
axios.defaults.retryNum = 3;
axios.defaults.refreshTokenLoading = false;

Vue.use(ElementUI);
Vue.use(VueMeta);
Vue.use(AFTableColumn)

Vue.config.productionTip = false
Vue.prototype.LOADING = {
    loading: null,
}
window.ononline = () => {
    global.ononline()
}
window.onoffline = () => {
    global.onoffline()
}
global.init()
let mainLoading = Loading.service({
    background: 'rgba(0, 0, 0, 0.7)',
    spinner: 'page-loading-icon-css',
    // text: "GOLAXY",
    customClass: 'page-start-loading-box'
})
mainLoading.close()
new Vue({
    render: h => h(App),
    router,
    store,
    mounted() {
        document.dispatchEvent(new Event('render-event'))
    },
    data: {
        delBasic: {
            width: 1536,
            fontSize: 20,
            boardH: 39,
            css: {
                'font-size': 20
            }
        }
    },
    methods: {
        sizeInit() {
            this.GLOBAL.sizeInit()
            window.onresize = this.sizeInit
        },
        globalInit() {
            setTimeout(() => {
                this.GLOBAL.audioInit(
                    document.getElementById('globalAudioPlay'),
                    document.getElementById('globalAudioReadSecond'),
                    document.getElementById('globalAudioReadStatus'),
                )
            }, 500);
        },
        _loadingInit(){
            this.LOADING.open = (target, opt) => {
                opt = opt || {}
                let config = {
                    background: 'rgba(0, 0, 0, 0.7)',
                    spinner: 'page-loading-icon-css',
                    target: target,
                    text: undefined,
                    customClass: 'page-common-loading-box'
                }
                for(var i in config){
                    if(opt[i] != undefined) config[i] = opt[i]
                }
                this.LOADING.loading = this.$loading(config)
            }
            this.LOADING.close = () => {
                this.LOADING.loading.close()
            }
        },
    },
    created() {
        this.GLOBAL.$route = this.$route
        this.sizeInit()
        this.globalInit()
    }
}).$mount('#app')








