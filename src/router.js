import Vue from 'vue'
import Router from 'vue-router'
import demo from './views/demo/demo.vue'

Vue.use(Router)


let options = {}

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/demo',
            id: 14,
            name: 'demo',
            component: demo
        },
        {
            path: '/',
            id: 14,
            redirect: '/demo',
            name: 'demo',
            component: demo
        },
    ],
    scrollBehavior(to, from, savedPosition) {
        if (to.hash) {
            return {
                selector: to.hash
            }
        }
    }
})