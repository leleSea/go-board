import localData from './localData.js'
import store from './store'
import http from './http.js'
import { Message } from 'element-ui'
import { Notification } from 'element-ui';
import { MessageBox } from 'element-ui';
import router from './router'
import Vue from 'vue'
import FileServer from './FileSaver.js'
import sgfUti from './utility/sgf'

// import VueCookies from 'vue-cookies'
// import _GLOBAL from './public/js/GLOBAL_TEM.json'

const server = new http('userApi')
// window.assetsUrl = '~@/assets/'
// const ASSETSURL = 'https://assets.19x19.com'
const ASSETSURL = `${GLOBAL_CONFIG.__HTTPHEAD}://assets.19x19.com`
const ASSETSURLS = 'https://assets.19x19.com'
const ASSETSURLAI = 'https://assets.weiqiai.com'
const ASSETSCOURSE = 'https://course.19x19.com'
const SUBJECT_TYPE_CODE = 5
const SCHOOLROOT = 'school-act'
// var SOCKETLINK = 'www.19x19.com.cn:8085'
var SOCKETLINK = 'server2.19x19.com:8085'

let socketCon = [
    { path: 'localhost', url: 'www.19x19.com.cn:8085' },
    { path: 'ga.19x19.com', url: 'www.19x19.com.cn:8085' },
    { path: '19x19.com', url: 'server2.19x19.com.cn:8085' },
]
if (window.GLOBAL_CONFIG && window.GLOBAL_CONFIG.socket) {
    SOCKETLINK = window.GLOBAL_CONFIG.socket
} else {
    let url = window.location.href
    for (var i in socketCon) {
        if (url.indexOf(socketCon[i].path) > -1) {
            SOCKETLINK = socketCon[i].url
            break
        }
    }
}
const optionsScore = {
    'inProp': [
        { value: 0.05, score: '很好', color: '#4DBE46', rgb: '77,190,70', label: false, key: 'score2', arrayKey: 1 },
        { value: 0.01, score: '不错', color: '#4DBE46', rgb: '77,190,70', label: false, key: 'score3', arrayKey: 2 },
        { value: 0, delta: 0, score: '可下', color: '#A4B436', rgb: '164,180,54', label: false, icon: 'sc1', key: 'score4', arrayKey: 2 },
    ],
    'outProp': [
        { value: 0.3, delta: 10, score: '恶手', color: '#bb2121', rgb: '187,33,33', label: true, icon: 'sc4', key: 'score7', arrayKey: 5, badPointcon: 'bd3', pr: 1 },
        { value: 0.15, delta: 6, score: '失误', color: '#CF6B09', rgb: '207,107,9', label: true, icon: 'sc3', key: 'score6', arrayKey: 4, badPointcon: 'bd2', pr: 0.66 },
        { value: 0.05, delta: 2.5, score: '欠佳', color: '#D6A318', rgb: '214,163,24', label: true, icon: 'sc2', key: 'score5', arrayKey: 3, badPointcon: 'bd1', pr: 1 },

    ],
    "sp1": { score: '最佳', color: '#4DBE46', rgb: '77,190,70', label: false, key: 'score1', arrayKey: 0 },
}
let __main_data = {
    _sgfUti: sgfUti,
    org: 'golaxy_web',
    subjectTypeCode: SUBJECT_TYPE_CODE,
    liveSetBoardShow: false,
    watchEngineInfoTime: { //使用引擎时检测余额
        interval: 60000,
        warnTime: [
            { time: 3 },
            { time: 10 },
        ]
    },
    // errorMsg: errorMsg,
    scRole: 1,
    schoolId: '',
    identity: '',
    info: 1,
    loginPath: '/engine/login',
    localKeyPlayReady: 'playReady',
    connectorLocalKey: 'connectorAtt',
    clineIp: '60.205.176.66',
    proClintHost: 'www.19x19.com',
    testClintHost: 'server2.19x19.com',
    clintHostList: {
        'www.19x19.com': '60.205.176.66',
        'server2.19x19.com': '182.92.151.70'
    },
    clineQueryTime: 10000,
    common_token_type: 'Basic',
    common_access_token: 'Z29sYXh5X3dlYjp4aW5nemhlbjA3MzA=',
    pageList: {
        'certificate': {
            'normal': '/engine/certificate'
        },
        'report': {
            'public': '/engine/report/0',
            'report': '/engine/report/1',
            'create': '/engine/report/2',
            'default': '/engine/report'
        },
        'record': {
            'engine': '/engine/record/0',
            'store': '/engine/record/1',
            'recharge': '/engine/record/3',
            'entity': '/engine/record/2',
        },
        // 'play': {
        //     'ready': '/engine/play/set',
        //     'normal': '/engine/play/normal/game',
        //     'level': '/engine/play/level/game',
        //     'engine': '/engine/playEngine',
        // },
        'play': {
            'main': '/engine/game',
            'ready': '/engine/game/config',
            'normal': '/engine/game/normal/game',
            'level': '/engine/game/rank/game',
            // 'ready': '/engine/game/config',
            // 'normal': '/engine/game/normal',
            // 'level': '/engine/play/level/game',
            'engine': '/engine/playEngine',

            'configFull': '/engine/game/config/{sgfId}',
            'normalNew': '/engine/game/normal/{status}',
            'normalNewFull': '/engine/game/normal/{status}/{gameParams}',
        },
        'engine': {
            'normal': '/engine/analyse'
        },
        'user': {
            'normal': '/engine/user'
        },
        'store': {
            'cardExtend': '/engine/store/purchase/card/select/extend',
            'cardUpgrade': '/engine/store/purchase/card/select/upgrade',
            'cardNormal': '/engine/store/purchase/card/select/normal',
            'card': '/engine/store/purchase/card/select',
            'cardRemain': '/engine/store/set/card/remain',
            'cardControl': '/engine/store/purchase/card/select/control',
            'reportNormal': '/engine/store/purchase/report/1',
            'ordinaryReport': '/engine/store/purchase/report/1',
            'precisionReport': '/engine/store/purchase/report/4',
            'propsNormal': '/engine/store/purchase/prop/5',
            'propsArea': '/engine/store/purchase/prop/0',
            'propsUndo': '/engine/store/purchase/prop/1',
            'propsOptions': '/engine/store/purchase/prop/2',
            'propsBranch': '/engine/store/purchase/prop/3',
            'course': '/engine/store/purchase/course',
            'present': '/engine/store/purchase/present',
            'peripheralList': '/engine/store/purchase/peripheral/list',
            'peripheralDetail': '/engine/store/purchase/peripheral/detail',
            'alipay': '/engine/store/purchase/alipay',
            'goodsPurchased': '/engine/store/purchase/status/{goodsId}/{optionsId}/{backPath}',
            'courseFull': '/engine/store/purchase/course/{courseType}',

        },
        'recharge': {
            'normal': '/engine/recharge/normal',
            'present': '/engine/recharge/present',
            'success': '/engine/recharge/success',
        },
        'help': {
            "FAQ": '/engine/help/summary'
        },
        'document': {
            'default': '/engine/document',
            'game': '/engine/document/game_detail',
            'engine': '/engine/document/engine_detail',
            'report': '/engine/document/report_detail',
            'live': '/engine/document/live_detail',
            'subject': '/engine/document/subject_detail',
            'card': '/engine/document/card_detail',
            'props': '/engine/document/props_detail',
            'course': '/engine/document/course_info'
        },
        'live': {
            'list': '/engine/live/list/0',
            'listWithPar': '/engine/live/list',
            'data': '/engine/live/data'
        },
        'video': {
            'list': '/engine/video/list',
            'data': '/engine/video/data',
            'defaultList': '/engine/video/list/0',
        },
        'productNavView': {
            'intro': '/engine/productNavView/intro',
            'contactus': '/engine/productNavView/contactus'
        },
        'training': {
            'list': '/engine/subject/list',
            'data': '/engine/subject/action',
            'set': '/engine/subject/action/set',
            'game': '/engine/subject/action/game',
            'sgfPre': '/engine/subject/action/sgf',
            'defaultList': '/engine/subject/list/0/0',
        },
        'course': {
            'list': '/engine/course/list',
            'info': '/engine/course/info',
            'pay': '/engine/course/pay',
            'success': '/engine/course/success',
            'training': '/engine/course/training',
            // 'trainingIndex': '/engine/course/training/{courseId}/video',
            'trainingIndex': '/engine/course/training/{courseId}/{goodsId}/video',
            'trainingDetail': '/engine/course/training/{courseId}/{goodsId}/{pageType}/{chapter}/{section}/{qus_num}',
            'select': '/engine/course/select',
            'selectFull': '/engine/course/select/{courseType}',
            'video': '/engine/course/video/list',
            'payVideo': '/engine/course/video/pay',


            'successVideo': '/engine/course/video/success',
            'college': '/engine/course/college/detail',
            'successCollege': '/engine/course/college/success',
            'common': '/engine/course/common/detail',
            'commonNew': '/engine/course/common/detail/{courseId}',
            'commonDetail': '/engine/course/common/detail/{courseId}/{optionsId}',
            'commonSuccess': '/engine/course/common/success',
            'bookingList': '/engine/course/booking/list',

            'mediaList': '/engine/course/media/detail',
            'mediaListNew': '/engine/course/media/detail/{courseId}',
            'mediaListFull': '/engine/course/media/detail/{courseId}/{optionsId}',
            'mediaPurchased': '/engine/course/media/success/{goodsId}/{optionsId}',

            'smallClass': '/engine/course/common/detail/{goodsId}/{optionsId}',

            'teacherIndex': '/engine/course/teacher',
            'teacher': '/engine/course/teacher/{goodsId}',
            'teacherInfo': '/engine/course/teacher/info/{goodsId}/{optionsId}',
            'teacherPay': '/engine/course/teacher/pay/{goodsId}/{data_key}/{optionsId}',
            'teacherPaySim': '/engine/course/teacher/pay/{goodsId}/{data_key}',

            'mediaLisGoods': '/engine/course/media/detail/{goodsId}',
            'commongoods': '/engine/course/common/detail/{goodsId}',

            'patternGoods': '/engine/course/pattern/detail/{goodsId}',
            'patternGoodsFull': '/engine/course/pattern/detail/{goodsId}/{optionsId}',

            'videoDetail': '/engine/course/video/detail/{goodsId}',
            'videoDetailFull': '/engine/course/video/detail/{goodsId}/{optionsId}',
            'videoAction': '/engine/course/video/action/{goodsId}/{optionsId}',
            'videoActionFull': '/engine/course/video/action/{goodsId}/{optionsId}/{section}',
            
        },
        'class': {
            'list': '/engine/class/list',
            'room': '/engine/class/room'
        },
        'authenticate': {
            normal: '/engine/authenticate/set/select',
            select: '/engine/authenticate/set/select',
            teacher: '/engine/authenticate/set/teacher',
            student: '/engine/authenticate/set/student',
            create: '/engine/authenticate/create',
            audit: '/engine/authenticate/set/audit',
            personal: '/engine/authenticate/info/personal',
            school: '/engine/authenticate/info/school',
            personalCert: '/engine/authenticate/personal/cert'
        },
        'pdf': {
            normal: "/pdf"
        },
        'achievement': {
            list: '/engine/achievement/list',
            data: '/engine/achievement/data',
        },
        'index': {
            normal: '/engine/index'
        },
        'lifeAndDeath': {
            index: '/engine/lifeAndDeath/set',
            keyWord: '/engine/lifeAndDeath/set',
            'set': '/engine/lifeAndDeath/set',
            'action': '/engine/lifeAndDeath/action',
            'pageFull': '/engine/lifeAndDeath/{pageStatus}/{menu}'
        },
        'school': {
            /*
             *params1：school_id 学校id
             *params2:scRole 用户权限  1：棋校管理员 0.棋校教师 2.学生  9.系统管理员
             *params3:班级id
            */
            'default': '/engine/school/authenticate/info/personal',//登录后默认进入的信息页面
            'schoolBox': '/engine/school',
            'authenticate': {
                normal: '/engine/school/authenticate/set/select',
                select: '/engine/school/authenticate/set/select',
                teacher: '/engine/school/authenticate/set/teacher',
                student: '/engine/school/authenticate/set/student',
                create: '/engine/school/authenticate/create',
                audit: '/engine/school/authenticate/set/audit',
                personal: '/engine/school/authenticate/info/personal',
                school: '/engine/school/authenticate/info/school',
                personalCert: '/engine/school/authenticate/personal/cert'
            },
            'applySelect': '/engine/school/applySelect',//棋校的申请列表
            'applySelectInfo': '/engine/school/applySelectInfo/{params1}',//棋校的信息

            'admin': '/engine/school/admin/{params1}/{params2}',//教师及管理员的首页

            //以下页面需要scRole(用户权限)为1 a：admin M：manage A：apply
            'aclassM': '/engine/school/admin/{params1}/{params2}/aclassM', //班级管理
            'ateacherM': '/engine/school/admin/{params1}/{params2}/ateacherM',//教师管理
            'ateacherA': '/engine/school/admin/{params1}/{params2}/ateacherA',//教师申请
            'astudentM': '/engine/school/admin/{params1}/{params2}/astudentM/{params3}',//学生管理
            'astudentA': '/engine/school/admin/{params1}/{params2}/astudentA',//学生申请

            //以下页面权限1,0都可以访问  t:teacher CM:chess manual 棋谱 V：view
            'tclassV': '/engine/school/admin/{params1}/{params2}/tclassV',
            'tstudentCM': '/engine/school/admin/{params1}/{params2}/tstudentCM',  //学生棋谱
            'troomV': '/engine/school/admin/{params1}/{params2}/troomV',//教师教室列表
            'tstudentV': '/engine/school/admin/{params1}/{params2}/tstudentV/{params3}',//教师查看学生信息
            'tInfo': '/engine/school/admin/{params1}/{params2}/tInfo',//教师个人信息
            'schoolInfo': '/engine/school/admin/{params1}/{params2}/schoolInfo',//棋校信息

            //学生页面
            'student': '/engine/school/student/{params1}',
            'studentCM': '/engine/school/student/{params1}/studentCM',
            'studentInfo': '/engine/school/student/{params1}/studentInfo',//学生信息
            'studentR': '/engine/school/student/{params1}/studentR',//学生教师
            'studentSchoolInfo': '/engine/school/student/{params1}/studentSchoolInfo'

        },
        'sgfHub': {
            'list': '/engine/sgf/list',
            'listFull': '/engine/sgf/list/{routeData}',
            // 'listFull': '/engine/sgf/list/{sgfId}',
            'data': '/enginesgf/data',
            'dataFull': '/engine/sgf/data/{routeData}'
        },

        'school-le': {
            'root': `/engine/${SCHOOLROOT}`,
            'index': `/engine/${SCHOOLROOT}/home`,

            'authSelect': `/engine/${SCHOOLROOT}/authen/select`,
            'authenStudent': `/engine/${SCHOOLROOT}/authen/student`,
            'authenTeacher': `/engine/${SCHOOLROOT}/authen/teacher`,
            'authenCert': `/engine/${SCHOOLROOT}/authen/cert`,
            'authenGroup': `/engine/${SCHOOLROOT}/authen/group`,

            'personalInfo': `/engine/${SCHOOLROOT}/info/personal`,
            'schoolInfo': `/engine/${SCHOOLROOT}/info/school`,

            'manage': `/engine/${SCHOOLROOT}/manage`,

            'content': `/engine/${SCHOOLROOT}/content`,
            'schoolContent': `/engine/${SCHOOLROOT}/content/school`,
            'personalContent': `/engine/${SCHOOLROOT}/content/{schoolCode}/{role}/personal`,
            'classContent': `/engine/${SCHOOLROOT}/content/{schoolCode}/{role}/class`,
            'studentContent': `/engine/${SCHOOLROOT}/content/{schoolCode}/{role}/student`,
            'teacherContent': `/engine/${SCHOOLROOT}/content/{schoolCode}/{role}/teacher`,

        },
        'alipay': {
            window: '/alipay/action'
        },
        'social': {
            'myFriend': '/engine/social/userShow/myFriend',
            'messageWindowFull': '/engine/social/messageShow/{routeData}'
        },
        'userRelation': {
            'user': '/engine/user/relation/user',
            'userFull': '/engine/user/relation/user/{routeData}',
            'message': '/engine/user/relation/message',
        },
        'gameCenter': {
            'index': '/engine/game/center'
        },
    },

    // gotoSchoolLe(type, fun, params, opt)
    getRoute(dataOpt){
        dataOpt = dataOpt || {}
        let {page, path, opt} = dataOpt
        let pageData = this.pageList[page] || {}
        let pathData = pageData[path]
        if(!pathData) return
        opt = opt || {}
        let fun = opt.fun
        let params = opt.params
        if(params && this.isObject(params)){
            pathData = this.urlParse(pathData, params)
        }
        let hash = opt.hash
        if (hash !== undefined) {
            pathData = pathData + `#${opt.hash}`
        }
        return pathData
    },


    gotoPage(dataOpt){
        dataOpt = dataOpt || {}
        let {page, path, opt} = dataOpt
        let pageData = this.pageList[page] || {}
        let pathData = pageData[path]
        if(!pathData) return
        opt = opt || {}
        let fun = opt.fun
        let params = opt.params
        if(params && this.isObject(params)){
            pathData = this.urlParse(pathData, params)
        }
        let hash = opt.hash
        if (hash !== undefined) {
            pathData = pathData + `#${opt.hash}`
        }
        this.jumpToByList(pathData, fun)


        // opt = opt || {}
        // if (!this.pageList['school-le'][type]) {
        //     type = 'index'
        //     params = undefined
        // }
        // let path = this.pageList['school-le'][type]
        // if (!path) return
        // let pathParams = opt.pathParams
        // if(pathParams){
        //     for(var i in pathParams){
        //         if(path.indexOf(`{${i}}`) <= -1) continue
        //         path = path.replace(`{${i}}`, pathParams[i])
        //     }
        // }
        // if (params !== undefined) {
        //     if (!this.isArray(params)) {
        //         params = [params]
        //     }
        //     for (var i in params) {
        //         path = `${path}/${params[i]}`
        //     }
        // }
        // if (opt.hash !== undefined) {
        //     path = path + `#${opt.hash}`
        // }
        // this.jumpToByList(path, fun, params)
    },

    jumpToByList(path, type) {
        type = type || 'jumpToPage'
        if (!this[type]) return
        this[type](path)
    },
    gotoSgf(type, fun, params, opt) {
        opt = opt || {}
        // type = type || 'list'
        if (!this.pageList.sgfHub[type]) {
            type = 'list'
            params = null
        }
        let path = this.pageList.play[type]
        if (!path) return
        if (params !== undefined) {
            if (!this.isArray(params)) {
                params = [params]
            }
            for (var i in params) {
                path = `${path}/${params[i]}`
            }
        }
        if (opt.hash !== undefined) {
            path = path + `#${opt.hash}`
        }
        this.jumpToByList(path, fun, params)
    },
    gotoSchoolLe(type, fun, params, opt){
        opt = opt || {}
        if (!this.pageList['school-le'][type]) {
            type = 'index'
            params = undefined
        }
        let path = this.pageList['school-le'][type]
        if (!path) return
        let pathParams = opt.pathParams
        if(pathParams){
            for(var i in pathParams){
                if(path.indexOf(`{${i}}`) <= -1) continue
                path = path.replace(`{${i}}`, pathParams[i])
            }
        }
        if (params !== undefined) {
            if (!this.isArray(params)) {
                params = [params]
            }
            for (var i in params) {
                path = `${path}/${params[i]}`
            }
        }
        if (opt.hash !== undefined) {
            path = path + `#${opt.hash}`
        }
        this.jumpToByList(path, fun, params)
    },
    gotoGamePage(type, fun, params, opt) {
        opt = opt || {}
        // type = type || 'list'
        type = type || 'normal'
        if (!this.pageList.play[type]) {
            type = 'normal'
            params = null
        }
        let path = this.pageList.play[type]
        if (!path) return
        if (params !== undefined) {
            if (!this.isArray(params)) {
                params = [params]
            }
            for (var i in params) {
                path = `${path}/${params[i]}`
            }
        }
        if (opt.hash !== undefined) {
            path = path + `#${opt.hash}`
        }
        this.jumpToByList(path, fun, params)
    },
    gotoRecord(type, fun, params) {
        type = type || 'engine'
        let path = this.pageList.record[type]
        if (!path) return
        if (params != undefined) {
            if (!this.isArray(params)) {
                params = [params]
            }
            for (var i in params) {
                path = `${path}/${params[i]}`
            }
        }
        this.jumpToByList(path, fun, params)
    },
    gotoAuthen(type, fun, params) {
        type = type || 'normal'
        let path = this.pageList.school.authenticate[type]
        if (!path) return
        if (params != undefined) {
            if (!this.isArray(params)) {
                params = [params]
            }
            for (var i in params) {
                path = `${path}/${params[i]}`
            }
        }
        this.jumpToByList(path, fun, params)
    },
    gotoPdfPreview(type, fun, params) {
        // type = type || 'list'
        type = type || 'normal'
        if (!this.pageList.pdf[type]) return
        let path = this.pageList.pdf[type]
        if (!path) return
        if (params !== undefined) {
            if (!this.isArray(params)) {
                params = [params]
            }
            for (var i in params) {
                path = `${path}/${params[i]}`
            }
        }
        this.jumpToByList(path, fun, params)
    },
    gotoAchievement(type, fun, params, opt) {
        opt = opt || {}
        // type = type || 'list'
        type = type || 'list'
        if (!this.pageList.achievement[type]) {
            type = 'list'
            params = null
        }
        let path = this.pageList.achievement[type]
        if (!path) return
        if (params != undefined) {
            if (!this.isArray(params)) {
                params = [params]
            }
            for (var i in params) {
                path = `${path}/${params[i]}`
            }
        }
        if (opt.hash !== undefined) {
            path = path + `#${opt.hash}`
        }
        this.jumpToByList(path, fun, params)
    },
    gotoSchool_n(type, fun, params, opt) {
        opt = opt || {}
        // type = type || 'list'
        type = type || 'default'
        if (!this.pageList.school[type]) {
            type = 'default'
            params = null
        }
        let path = this.pageList.school[type]
        if (!path) return
        if (params != undefined) {
            if (!this.isArray(params)) {
                params = [params]
            }
            for (var i in params) {
                path = `${path}/${params[i]}`
            }
        }
        if (opt.hash !== undefined) {
            path = path + `#${opt.hash}`
        }
        if (opt.replaceParams) {
            let par = opt.replaceParams || {}
            for (var i in par) {
                path = path.replace(`{${i}}`, par[i])
            }
        }
        this.jumpToByList(path, fun, params)
    },
    gotoCourse(type, fun, params, opt) {
        opt = opt || {}
        // type = type || 'list'
        type = type || 'select'
        if (!this.pageList.course[type]) {
            type = 'select'
            params = null
        }
        let path = this.pageList.course[type]
        if (!path) return
        if (params != undefined) {
            if (!this.isArray(params)) {
                params = [params]
            }
            for (var i in params) {
                path = `${path}/${params[i]}`
            }
        }
        if (opt.hash !== undefined) {
            path = path + `#${opt.hash}`
        }
        this.jumpToByList(path, fun, params)
    },
    gotoLdp(type, fun, params, opt) {
        opt = opt || {}
        // type = type || 'list'
        type = type || 'set'
        if (!this.pageList.lifeAndDeath[type]) {
            type = 'set'
            params = null
        }
        let path = this.pageList.lifeAndDeath[type]
        if (!path) return
        if (params != undefined) {
            if (!this.isArray(params)) {
                params = [params]
            }
            for (var i in params) {
                path = `${path}/${params[i]}`
            }
        }
        if (opt.hash !== undefined) {
            path = path + `#${opt.hash}`
        }
        this.jumpToByList(path, fun, params)
    },
    gotoStore(type, fun, params) {
        type = type || 'cardControl'
        if (!this.pageList.store[type]) {
            type = 'cardControl'
            params = null
        }
        let path = this.pageList.store[type]
        if (!path) return
        if (params != undefined) {
            if (!this.isArray(params)) {
                params = [params]
            }
            for (var i in params) {
                path = `${path}/${params[i]}`
            }
        }
        this.jumpToByList(path, fun, params)
    },
    //进入学校
    gotoSchool(type, fun) {
        let path = this.pageList.school[type]
        // let path = path ||this.pageList.school.applySelect
        this.jumpToByList(path, fun)
    },
    gotoClass(type, fun, params) {
        type = type || 'list'
        let path = this.pageList.class[type]
        if (!path) return
        if (params != undefined) {
            if (!this.isArray(params)) {
                params = [params]
            }
            for (var i in params) {
                path = `${path}/${params[i]}`
            }
        }
        this.jumpToByList(path, fun, params)
    },
    gotoVideo(type, fun, params) {
        type = type || 'list'
        let path = this.pageList.video[type]
        if (!path) return
        if (params != undefined) {
            path += `/${params}`
        }
        this.jumpToByList(path, fun, params)
    },
    gotoLive(type, fun, params) {
        type = type || 'list'
        let path = this.pageList.live[type]
        if (!path) return
        if (params != undefined && type != 'list') {
            path += `/${params}`
        }
        // this.jumpToPage(path)
        this.jumpToByList(path, fun, params)
    },
    gotoTrainingSet(type, fun, params) {
        type = type || 'set'
        let path = this.pageList.training[type]
        if (!path) return
        if (params != undefined) {
            if (!this.isObject(params)) {
                let tem = {}
                tem[params] = params
                params = tem
            }
            for (var i in params) {
                path = `${path}/${params[i]}`
            }
        }
        this.jumpToByList(path, fun, params)
    },
    gotoTraining(type, fun, params) {
        type = type || 'list'
        let path = this.pageList.training[type]
        if (!path) return
        if (params != undefined) {
            if (!this.isArray(params)) {
                params = [params]
                // tem[params] = params
                // params = tem
            }
            for (var i in params) {
                path = `${path}/${params[i]}`
            }
        }
        // this.jumpToPage(path)
        this.jumpToByList(path, fun, params)
    },
    setLivePage(page, params) {
        params = params || 0
        this.setStoreItem({
            livePage: `${page}/${params}`
        })
    },
    getLivePage() {
        let data = store.state.livePage
        let page = 'list', params = 0
        if (data) {
            page = data.substring(0, data.indexOf('/'))
            params = data.substring(1 + data.indexOf('/'), data.length)
        }
        return {
            page: page,
            params: params
        }
    },
    setCoursePage(page, params) {
        let path = page
        if (params != undefined) path = `${path}/${params}`
        this.setStoreItem({
            coursePage: `${page}/${params}`
        })
    },
    getCoursePage() {
        let data = store.state.coursePage
        let page = 'select', params = undefined
        if (data) {
            page = data.substring(0, data.indexOf('/'))
            params = data.substring(1 + data.indexOf('/'), data.length)
            try {
                params = eval(params)
            } catch (e) { }
        }
        return {
            page: page,
            params: params
        }
    },
    getStorePagePath(key) {
        let data = store.state[key]
        if (!data) return null
        let page = data.substring(0, data.indexOf('/'))
        let params = data.substring(1 + data.indexOf('/'), data.length)
        return {
            page: page,
            params: params
        }
    },
    saveStorePagePath(key, page, params) {
        let path = page
        if (params != undefined) path = `${path}/${params}`
        let saveData = {}
        saveData[key] = `${page}/${params}`
        this.setStoreItem(saveData)
    },
    gotoDocument(type) {
        let path = this.pageList.document[type]
        if (!path) return
        this.jumpToPage(path)
    },
    gotoPathByFun(opt) {
        opt = opt || {}
        if (opt.canJumpKey && opt.pathNow) {
            if (opt.pathNow.indexOf(opt.canJumpKey) == -1) return
        }
        if (this[opt.jumpToFun]) this[opt.jumpToFun](opt)
    },
    gotoFAQ(path) {
        path = path || this.pageList.help.FAQ
        this.jumpToPage(path)
    },
    gotoReport(type, fun, params) {
        // path = path || this.pageList.report.create
        // this.jumpToPage(path)



        type = type || 'create'
        let path = this.pageList.report[type]
        if (!path) path = this.pageList.report.create
        if (params != undefined) {
            if (!this.isArray(params)) {
                params = [params]
                // tem[params] = params
                // params = tem
            }
            for (var i in params) {
                path = `${path}/${params[i]}`
            }
        }
        // this.jumpToPage(path)
        this.jumpToByList(path, fun, params)
    },
    gotoGame(path) {
        path = path || this.pageList.play.ready
        this.jumpToPage(path)
    },
    gotoEngine(path) {
        path = path || this.pageList.engine.normal
        this.jumpToPage(path)
    },
    gotoUser(path) {
        path = path || this.pageList.user.normal
        this.jumpToPage(path)
    },
    gotoCardNormal(opt) {
        opt = opt || {}
        let path = opt.path || this.pageList.store.cardNormal
        this.jumpToPage(path)
    },
    gotoCardExtend(opt) {
        opt = opt || {}
        let path = opt.path || this.pageList.store.cardExtend
        this.jumpToPage(path)
    },
    gotoCardUpgrade(opt) {
        opt = opt || {}
        let path = opt.path || this.pageList.store.cardUpgrade
        this.jumpToPage(path)
    },
    // gotoRecharge(path) {
    //     path = path || this.pageList.recharge.normal
    //     this.jumpToPage(path)
    // },
    gotoRecharge(type, fun, params, opt) {
        opt = opt || {}
        type = type || 'normal'
        if (!this.pageList.recharge[type]) {
            type = 'normal'
            params = null
        }
        let path = this.pageList.recharge[type]
        if (!path) return
        if (params != undefined) {
            if (!this.isArray(params)) {
                params = [params]
            }
            for (var i in params) {
                path = `${path}/${params[i]}`
            }
        }
        if (opt.hash !== undefined) {
            path = path + `#${opt.hash}`
        }
        this.jumpToByList(path, fun, params)
    },
    gotoStoreReport(path) {
        path = path || this.pageList.store.ordinaryReport
        this.jumpToPage(path)
    },
    gotoStoreProps(path) {
        path = path || this.pageList.store.propsNormal
        this.jumpToPage(path)
    },
    // bonusConfig: {
    //     'area_increment': {
    //         'name': '领地'
    //     },
    //     'options_increment': {
    //         'name': '支招'
    //     },
    //     'back_move_increment': {
    //         'name': '悔棋'
    //     },
    //     'variation_increment': {
    //         'name': '变化图'
    //     },
    // },
    reportPlan: {
        time: {
            '普通': 2,
            '精准': 8
        }
    },
    sgfDisabledHandle: {
        '2': true,
        '3': true,
        '4': true,
    },
    leConfirm: null,
    leConfirmOpen(type) {
        if (!this.leConfirm || !this.leConfirm[type]) return
        this.leConfirm[type].open({
            // button: [
            //     {name: '确定'}
            // ]
        })
    },
    routerCallback: null,

    themeConfig: {
        'dark': {
            panelBackground: '#606266'
        },
        'light': {
            panelBackground: '#BBBBBB'
        },
    },
    getReportIcon(po) {
        return this.reportLabel[po] || this.reportLabel['default']
    },
    getReportIconBySgf(val) {
        if (val.analyzeStatus == 0) return null
        let data = this.getReportIcon(val.analyzePo)
        return data[`icon${val.analyzeStatus}`]
    },
    getReportIconBySgfCul(val) {
        if (val.analyzeStatus == 0) return null
        let data = this.getReportIcon(val.analyzePo)
        if (data.type && data.type == 'default') return null
        return data[`icon${val.analyzeStatus}`]
    },
    getReportIconSub(val) {
        if (val.analyzeStatus == 0) return null
        let icon
        // let icon = this.getReportIconBySgfCul(val)
        // if(icon) return icon
        let po = val.analyzePo || 0
        let tem = this.reportIconForSgf
        let gameType = val.gameType === undefined ? '00' : ('' + val.gameType)
        for (var i in tem) {
            let max = tem[i].max
            if (this.isString(max) && max == 'max') {
                icon = tem[i][`icon${val.analyzeStatus}`]
                break
            }
            if (po <= max) {
                if (tem[i].gameType !== undefined) {
                    if (tem[i].gameType == gameType) {
                        icon = tem[i][`icon${val.analyzeStatus}`]
                        break
                    }
                } else {
                    icon = tem[i][`icon${val.analyzeStatus}`]
                    break
                }
            }
        }
        return icon
    },
    optionsScore: optionsScore,
    scoreList: {
        score1: optionsScore.sp1,
        score2: optionsScore.inProp[0],
        // score3: optionsScore.inProp[1],
        score4: optionsScore.inProp[2],
        score5: optionsScore.outProp[2],
        score6: optionsScore.outProp[1],
        score7: optionsScore.outProp[0],
    },
    scoreListArr: [
        optionsScore.sp1,       //最佳 - 0
        optionsScore.inProp[0], //很好 - 1
        optionsScore.inProp[1], //不错 - 2 -- 改为3
        optionsScore.inProp[2], //可下 - 3
        optionsScore.outProp[2], //欠佳 - 4
        optionsScore.outProp[1], //失误 - 5
        optionsScore.outProp[0], //恶手 - 6
    ],
    badPointList: {
        // score4: optionsScore.outProp[3],
        score5: optionsScore.outProp[2],
        score6: optionsScore.outProp[1],
        score7: optionsScore.outProp[0],
    },
    badPointListForSetStone: {
        score4: optionsScore.inProp[2],
        score5: optionsScore.outProp[2],
        score6: optionsScore.outProp[1],
        score7: optionsScore.outProp[0],
    },
    onresizeFunction: {},
    boardPreHandle: {
        position: -1,
    },
    yearCard: 9, //年卡价格 = 月卡价格的倍数
    language: {},
    timeoutClass: null,
    aiName: '星阵',
    sgfNameDefault: '我的新棋谱',
    assetsUrlS: ASSETSURLS,
    assetsUrl: ASSETSURL,
    assetsUrlAi: ASSETSURLAI,
    assetsCourse: ASSETSCOURSE,
    socketUrl: SOCKETLINK,
    weburl: "19x19",
    boardObj: null,
    adaptive: true,
    http: new http('userApi'),
    optionsMin: 0,//opitons最小模拟次数
    // optionsMaxNum: 11, //选点个数上限
    optionsMaxNum: 10, //选点个数上限
    branchMin: 10,//branch最小模拟次数
    simuRateMin: 0.01, //options最小占比
    reportFilter: {
        options: {
            prop: 0.01,
            num: 3
        },
        badPoint: {
            num: 5,
            MaxLabelNum: 5
        },
        levelBar: {
            all: 'all',
            start: [0, 60], //布局
            middle: [61, 180], //中盘
            end: [181, 'e'], //官子
        },
        reportWatchTime: 1500,
        minCreateNum: 20
    },
    simuRateMinBr: 0.01, //branch最小占比
    refreshOpt: 3000, //options刷新时间
    playTimeout: 100,//棋盘变化时刷新options时间
    optIntervalTime: 2000, //options刷新时间
    // optIntervalTime: 10000, //options刷新时间
    optIntervalTimeLive: 3000,
    optSpeInterval: 50,
    branchTimeout: 300,
    genmoveMaxStep: 250, //包干制总手数
    syncBoardTime: 3, //n次请求options以后检测盘面
    optionsTimeoutShow: true, //延时显示模拟次数
    genmoveTime: 4000, //genmove时请求options的频率
    pageAutoQuit: true, //无动作自动退出
    areaMinValue: 0.1,
    minJudgeP: 150, //终局数子可用手数
    timeWarning: 50, //剩余时间少于50%时告警
    refreshTokenTime: 600, //刷新token时间 秒
    genmoveNetworkNoticeNum: 3, //重复genmove时网络提示
    requestRetryNum: 3,
    saveGameMinNum: 20,
    resignPosition: 15,
    minThinkingTime: 2000,
    resendNum: 3,
    readSecondNum: 10, //最小读秒时间
    webHeadHeight: 3,//web head height
    maxQuitTime: 120 * 60, //最长登录时间
    cookieMaxTime: 60000,
    AIresignRate: {
        winrate: 0.08,
        delta: 5,
        position: 150
    },
    levelGameParSet: {
        // minute: 10,
        // second: 30,
        // num: 3,
        unavailable: false
    },
    card: {
        maxExtend: 1296000
    },
    planUnavailableReason(jar) {
        return this.__ERRORMSGDEFINE.errorMsg['main'][jar] || null
    },
    sgfPhoto: {
        '0': {
            '星阵': 'p69.png'
        },
        '00': {
            '星阵': 'p69.png'
        },
        '01': {
            '星阵': 'p69.png'
        },
        '02': {
            '星阵': 'p69.png'
        },
        '03': {
            '星阵': 'p69.png'
        },
        '5': {
            '星阵': 'p69.png'
        },
        '2': true,
        '3': true,
        '4': true,
        // default: 'm7.png',
        default: window.GLOBALATTR.userPhotoDefault.path,
    },
    needRefreshPage: {
        '/play': true,
        '/engine': true,
        '/playEngine': true
    },
    userRole: {
        'vip1': {
            icon: `${ASSETSURL}/img/h1.png`,
            name: 'vip1'
        },
        'vip2': {
            icon: `${ASSETSURL}/img/h2.png`,
            name: 'vip2'
        },
        'vip3': {
            icon: `${ASSETSURL}/img/h3.png`,
            name: 'vip3'
        },
        // 'new_user': {
        //     icon: `${ASSETSURL}/img/h3.png`,
        //     name: 'new_user'
        // },
        'default': {
            icon: `${ASSETSURL}/img/m7Dark.png`,
            name: 'new_user'
        }
    },
    voiceList: {
        'play': { id: 'play', path: `${ASSETSURL}/voice/play.wav` },
        'timeout': { id: 'timeout', path: `${ASSETSURL}/voice/timeout.wav` },
        'last': { id: 'timeout', path: `${ASSETSURL}/voice/last` },
        'start': { id: 'timeout', path: `${ASSETSURL}/voice/start.wav` },
        'remove1': { id: 'remove1', path: `${ASSETSURL}/voice/remove1.wav` },
        'remove2': { id: 'remove2', path: `${ASSETSURL}/voice/remove2.wav` },
        'remove3': { id: 'remove2', path: `${ASSETSURL}/voice/remove2.wav` },
        'remove4': { id: 'remove4', path: `${ASSETSURL}/voice/remove4.wav` },
        'remove0': { id: 'remove0', path: `${ASSETSURL}/voice/remove0.wav` },
        // 'readSec0': {id: 'readSec0', path: `${ASSETSURL}/voice/readSec0.wav`},
        'readSec1': { id: 'readSec1', path: `${ASSETSURL}/voice/readSec1.wav` },
        'readSec2': { id: 'readSec2', path: `${ASSETSURL}/voice/readSec2.wav` },
        'readSec3': { id: 'readSec3', path: `${ASSETSURL}/voice/readSec3.wav` },
        'readSec4': { id: 'readSec4', path: `${ASSETSURL}/voice/readSec4.wav` },
        'readSec5': { id: 'readSec5', path: `${ASSETSURL}/voice/readSec5.wav` },
        'readSec6': { id: 'readSec6', path: `${ASSETSURL}/voice/readSec6.wav` },
        'readSec7': { id: 'readSec7', path: `${ASSETSURL}/voice/readSec7.wav` },
        'readSec8': { id: 'readSec8', path: `${ASSETSURL}/voice/readSec8.wav` },
        'readSec9': { id: 'readSec9', path: `${ASSETSURL}/voice/readSec9.wav` },
        'readSec10': { id: 'readSec10', path: `${ASSETSURL}/voice/readSec10.wav` },
        'gameStart': { id: 'gameStart', path: `${ASSETSURL}/voice/gameStart.wav` },
        'tool': { id: 'tool', path: `${ASSETSURL}/voice/` },
        'result': { id: 'result', path: `${ASSETSURL}/voice/` },
        'volume': { id: 'volume', path: `${ASSETSURL}/voice/volume.wav` },
        'branch1': { id: 'branch1', path: `${ASSETSURL}/voice/play.wav` },
        'branch2': { id: 'branch1', path: `${ASSETSURL}/voice/branch_2.wav` },
        'branch3': { id: 'branch2', path: `${ASSETSURL}/voice/branch_3.wav` },
        'branch4': { id: 'branch3', path: `${ASSETSURL}/voice/branch_4.wav` },
        'branch7': { id: 'branch4', path: `${ASSETSURL}/voice/branch_7.wav` },
        'branch8': { id: 'branch8', path: `${ASSETSURL}/voice/branch_8.wav` },
        'branchMove': { id: 'branchMove', path: `${ASSETSURL}/voice/branch_move.wav` },
    },
    planRole: {
        '1': {
            txt: '所有用户均可使用'
        },
        '2': {
            txt: '充值可用'
        },
        '3': {
            txt: '充值可用'
        },
        '4': {
            txt: '充值可用'
        },
        '5': {
            txt: 'vip1会员可用（近1年累计充值达到1000元）'
        },
        '6': {
            txt: 'vip2会员可用（近1年累计充值达到3000元）'
        },
        '7': {
            txt: 'vip3会员可用（近1年累计充值达到10000元）'
        },
    },
    activityStatus: {
        '0': { txt: '领取', name: 'available' },
        '1': { txt: '已领取', name: 'unavailable' },
        '2': { txt: '已过期', name: 'unavailable' },
    },
    tool: {

    },

    payType: {
        'alipay': {
            name: '支付宝', currency: { sym: '￥', name: '人民币' }, spec: '支付'
        },
        'androidalipay': {
            name: '支付宝', currency: { sym: '￥', name: '人民币' }, spec: '支付'
        },
        'wxpay': {
            name: '微信', currency: { sym: '￥', name: '人民币' }, spec: '支付'
        },
        'androidwxpay': {
            name: '微信', currency: { sym: '￥', name: '人民币' }, spec: '支付'
        },
        'activity': {
            name: '礼金券', currency: { sym: '￥', name: '人民币' }
        },
        'paypal': {
            name: 'PayPal', currency: { sym: '$', name: '美元' }, spec: '支付'
        },
        'manual': {
            name: '转账', currency: { sym: '￥', name: '人民币' }
        },
        'IOSPay': {
            name: '苹果支付', currency: { sym: '￥', name: '人民币' }
        },
        'WX_PAY': {
            name: '微信', currency: { sym: '￥', name: '人民币' }, spec: '支付'
        },
        'gift_card': {
            name: '礼品卡', currency: { sym: '￥', name: '人民币' }, spec: '支付'
        },
        'balance': {
            name: '余额', currency: { sym: '￥', name: '人民币' }, spec: '支付'
        },
    },
    orderStatus: {
        'OPEN': { message: '等待支付', value: 0, },
        'CANCEL': { message: '已取消', value: 1, },
        'CLOSE': { message: '交易已关闭', value: 2, },
        'FINISHED': { message: '支付成功', value: 3, },
    },
    courierStatus: {
        'NEW': { message: '待发货', value: 0 },
        'WAIT_SEND': { message: '待发货', value: 1 },
        'TRANSPORT': { message: '已发货', value: 2 },
        'WAIT_RECEIVE': { message: '已发货', value: 3 },
    },
    timeToQuit: {
        autoQuitTime: 5,
        noticeTime: 30,
        countTime: 300
    },
    pageKeyCode: {
        '37': {
            fun: 'jumpTo',
            params: '-1'
        },
        '39': {
            fun: 'jumpTo',
            params: '1'
        }
    },
    funNeedEngine: {
        'jumpTo': true,
        'play': true,
        'conputerPlay': true
    },
    funActionCheck(fun) {
        return this.funNeedEngine[fun] && !store.state.engine_id
    },
    getKeyUpObj(code) {
        code = '' + code
        return this.pageKeyCode[code] || null
    },
    optionsKey: [
        'PathCode', 'Color', 'Move', 'Policy', 'value',
        'Proportion', 'Number', 'BP_Value',
        'BP_Delta', 'Prior', 'WinRate', 'Urgency'
    ],
    optionsKeyNew: [
        'PathCode', 'Move', 'Number', 'BP_Value',
        'BP_Delta', 'ldp_result'
    ],
    router: {
        'logged': '/personal',
        'engined': 'engined',
        'guest': '/login'
    },
    loggedDisabledPath: {
        '/login': true,
        '/register': true,
        '/forgetPsw': true,
        // '/engine': true,
        // '/play': true,
    },
    enginedDisabledPath: {
        '/login': true,
        '/register': true,
        '/personal': true,
        '/forgetPsw': true,
        '/engineMenu': true,
        // '/changePsw': true,
        '/': true
    },
    guestDisabledPath: {
        // '/store': true,
        // '/engine/analyse': true,
        // '/recharge': true,
        '/record': true,
        '/rechargeRecord': true,
        '/changePsw': true,
        '/certificate': true,
        '/activity': true,
        '/recharge': true,
        '/engine/store': true,
        '/engine/user': true,
        '/engine/report/1': '/engine/report/2',
        '/engine/subject/action': true,
        '/engine/course/pay': true,
        '/engine/course/teacher/pay': true,
        '/engine/class/room': true,
        // '/engine/course/video/pay': true,
        '/engine/course/video/success': true,
        '/engine/course/training': true,
        '/pdf': true,
        '/engine/course/college/success': true,
        '/engine/achievement': true,
        '/engine/course/booking/list': true,
        '/engine/school': true,
        '/engine/course/video/action': true,
        '/engine/social/': true
    },
    userInfoItem: {
        'username': '',
        'access_token': '',
        'loginTime': '',
        'expires_in': '',
        'token_type': '',
        'refresh_token': '',
        'status': '',
        'engine_id': '',
        'nickname': '',
        'role': '',
        'photo': '',
        'usercode': ''
    },
    loginSetItem: {
        'username': '',
        'access_token': '',
        'loginTime': '',
        'expires_in': '',
        'token_type': '',
        'refresh_token': '',
        'status': '',
        'nickname': '',
        'role': '',
        'area': '',
        'photo': '',
        'usercode': ''
    },
    planType: [ //配置类型
        { name: '专业版' },
        { name: '旗舰版' }
    ],
    sgfInfo: {
        gn: { label: '棋谱名', value: null },
        pw: { label: '白方姓名', value: null },
        pb: { label: '黑方姓名', value: null },
        wr: { label: '白方段位', value: null },
        br: { label: '黑方段位', value: null },
        wt: { label: '白方代表队', value: null },
        bt: { label: '黑方代表队', value: null },
        ha: { label: '让子', value: null },
        re: { label: '结果', value: null },
        ev: { label: '赛事', value: null },
        dt: { label: '日期', value: null },
        pc: { label: '地点', value: null },
        tm: { label: '比赛用时', value: null },
        ro: { label: '回合', value: null },
        lt: { label: '读秒', value: null },
        lc: { label: '读秒次数', value: null },
        rd: { label: '日期', value: null },
        km: { value: 7.5, label: '3又3/4子' },
        sz: { label: '棋谱路数', value: 19 },
        up: { label: '类型', value: null },
        st: { label: '起始手数', value: 0 }
    },
    sgfInfoParse(info) {
        let sgfInfo = this.deepCopy(this.sgfInfo)
        for (var i in sgfInfo) {
            if (info[i] !== undefined) {
                sgfInfo[i].value = info[i]
            }
        }
        return sgfInfo
    },
    size: [
        { value: 19, label: '19x19', name: '19路棋盘' },
        { value: 9, label: '9x9', name: '9路棋盘' },
    ],
    gameType: [
        { value: 'competitive_match', label: '升降战', name: '对弈类型：升降战' },
        { value: 'placement_match', label: '定级战', name: '对弈类型：定级战' },
        { value: 'casual_match', label: '自由战', name: '对弈类型：自由战' },
    ],
    handicap: [
        { value: 1, label: '分先', name: '分先', realVal: 0 },
        { value: 0, label: '分先', name: '分先' },
        { value: 2, label: '让2子', name: '让2子' },
        { value: 3, label: '让3子', name: '让3子' },
        { value: 4, label: '让4子', name: '让4子' },
        { value: 5, label: '让5子', name: '让5子' },
        { value: 6, label: '让6子', name: '让6子' },
        { value: 7, label: '让7子', name: '让7子' },
        { value: 8, label: '让8子', name: '让8子' },
        { value: 9, label: '让9子', name: '让9子' },
    ],
    getKomi(komi) {
        let opt = this.komi, data = null
        for (var i in opt) {
            if (opt[i].value == komi) {
                data = opt[i]
                break
            }
        }
        return data
    },
    highLevelHtml: {
        '3300': {
            icon: `<div class='high-level-box'><span class='high-level-txt'></span><img src='${ASSETSURL}/img/p33.png' class='high-level-label' alt=''></div>`,
            name: '职业'
        },
        '3200': {
            icon: `<div class='high-level-box'><span class='high-level-txt'></span><img src='${ASSETSURL}/img/p32.png' class='high-level-label' alt=''></div>`,
            name: '职业'
        },
        '3100': {
            icon: `<div class='high-level-box'><span class='high-level-txt'></span><img src='${ASSETSURL}/img/p31.png' class='high-level-label' alt=''></div>`,
            name: '职业'
        },
    },
    levelGameProp: {
        time: [
            { level: 1201, minute: 30, second: 30, num: 3, unavailable: false },
            { level: 2001, minute: 40, second: 30, num: 3, unavailable: false },
            { level: 3001, minute: 45, second: 40, num: 3, unavailable: false },
            { level: 4000, minute: 60, second: 60, num: 3, unavailable: false },
        ]
    },
    getLevelGameTime(level) {
        let time = this.levelGameProp.time, data = null
        for (var i in time) {
            if (time[i].level >= level) {
                data = time[i]
                break
            }
        }
        if (!data) data = time[0]
        return data
    },
    handicap13: [
        [],
        [42, 126],
        [42, 126, 48],
        [42, 126, 48, 120],
        [42, 126, 48, 120, 84]
    ],
    handicap9: [
        [],
        [20, 24],
        [20, 24, 56],
        [20, 24, 56, 60]
    ],
    handicap19: [
        [],
        [],
        [
            72, 288,
        ],
        [
            72,
            288,
            60
        ],
        [
            72,
            288,
            60,
            300
        ],
        [
            72,
            288,
            60,
            300,
            180
        ],
        [
            72,
            288,
            60,
            300,
            174,
            186
        ],
        [
            72,
            288,
            60,
            300,
            174,
            186,
            180
        ],
        [
            72,
            288,
            60,
            300,
            174,
            186,
            66,
            294
        ],
        [
            72,
            288,
            60,
            300,
            174,
            186,
            66,
            294,
            180
        ],
    ],
    gameResult: {
        '0': [
            {
                txt: '和',
                label: 1
            },
            {
                txt: '无效对局',
                label: 0
            }
        ],
        '1': [
            {
                txt: '白中盘胜',
                label: 3
            },
            {
                txt: '白超时胜',
                label: 7
            },
            {
                txt: '白胜',
                label: 5
            }
        ],
        '-1': [
            {
                txt: '黑中盘胜',
                label: 2
            },
            {
                txt: '黑超时胜',
                label: 6
            },
            {
                txt: '黑胜',
                label: 4
            }
        ]
    },
    coorLimit: {
        '19': {
            min: 'a',
            max: 's'
        },
        '13': {
            min: 'a',
            max: 'm'
        },
        '9': {
            min: 'a',
            max: 'i'
        },
    },
    resultTxt: {
        'B+R': { txt: '黑中盘胜', win: 'b', num: false },
        'W+R': { txt: '白中盘胜', win: 'w', num: false },
        'B+T': { txt: '黑超时胜', win: 'b', num: false },
        'W+T': { txt: '白超时胜', win: 'w', num: false },
        'N+R': { txt: '', win: null, num: false, liveTxt: '无胜负' },
        'B+': { txt: '黑胜', win: 'b', num: true },
        'W+': { txt: '白胜', win: 'w', num: true }
    },
    resultSelect: [
        { value: 'N+R', label: ' ', name: '结果：无', liveTxt: '无胜负', hide: true },
        { value: 'B+R', label: '黑中盘胜', name: '结果：黑中盘胜' },
        { value: 'W+R', label: '白中盘胜', name: '结果：白中盘胜' },
        { value: 'B+T', label: '黑超时胜', name: '结果：黑超时胜' },
        { value: 'W+T', label: '白超时胜', name: '结果：白超时胜' },
        { value: 'B+', label: '黑胜', name: '结果：黑胜', num: true },
        { value: 'W+', label: '白胜', name: '结果：白胜', num: true },
        { value: 'R+R', label: '和棋', name: '结果：和棋', hide: true },
    ],
    userLevel: [
        {}
    ],
    pageNumber: {

    },
    loadFileType: {
        'sgf': true,
        // 'branch': true
        'gib': true
    },
    getLoadFileTypeTxt() {
        let f = this.loadFileType, txt = ''
        for (var i in f) {
            txt += i + ','
        }
        txt = txt.substring(0, txt.length - 1)
        return txt
    },
    fileSuffixGet(filename) {
        return filename.substring(filename.lastIndexOf('.') + 1, filename.length)
    },
    checkLoadSgfSuffix(filename) {
        let suffix = this.fileSuffixGet(filename)
        suffix = suffix.toLowerCase()
        return this.loadFileType[suffix] || false
    },
    getCoorLimit(size) {
        return this.coorLimit[size] || null
    },
    getResult(opt) {
        let re = this.copy(this.gameResult[opt.color][opt.type])
        if (opt.type == 2) {
            re.txt = re.txt + opt.winNum + '子'
        }
        return re
    },
    getHandiCap(size, num) {
        let moves = this['handicap' + size] || []
        moves = moves[num] || []
        return moves
    },
    commandErrorFun: {
        'genmove': ''
    },
    engineRequestMaxTime: {
        'genmove': 120,
        'play': 10,
        'play_multi': 10
    },
    engineErrorFun: {
        '8002': {
            fun: 'quit',
            duration: false,
            displayError: true
        },
        '7001': {
            fun: 'quit',
            duration: false,
            displayError: true
        }
    },
    errorNoticeConfig: {
        'type': 'error',
        'message': '',
        'duration': 3000,
        'showClose': true
    },
    alertConfig: {
        'message': '',
        'title': '',
        'callback': undefined,
        'confirmButtonText': '确定',
        'type': undefined,
        'dangerouslyUseHTMLString': false,
        'customClass': ''
    },
    confirmConfig: {
        'message': '',
        'title': '',
        'confirmButtonText': '确定',
        'cancelButtonText': '取消',
        'type': undefined,
        'center': false
    },
    notifyConfig: {
        'title': '',
        'message': '',
        'dangerouslyUseHTMLString': false,
        'duration': 3000,
        'showClose': true
    },
    quit() {

        let item = this.deepCopy(this.userInfoItem)
        this.removeItem(item)
        if (this.updateUserAttr) this.updateUserAttr()
    },
    getTemItem(key) {
        return localData.getTemItem(key)
    },
    setTemItem(items) {
        localData.setTemItem(items)
        this.setStoreItem(items)
    },
    removeTemItem(items) {
        localData.removeTemItem(items)
        this.removeStoreItem(items)
    },
    setItem(items) {
        // localData.setItem(items)
        this.setLocalItem(items)
        this.setStoreItem(items)
    },
    setStoreItem(items) {
        store.dispatch('setItem', items)
    },
    removeItem(items) {
        // localData.removeItem(items)
        this.removeLocalItem(items)
        this.removeStoreItem(items)
    },
    removeStoreItem(items) {
        store.dispatch('removeItem', items)
    },
    setLocalItem(items) {
        localData.setItem(items)
    },
    removeLocalItem(items) {
        localData.removeItem(items)
    },
    getLocalItem(items) {
        return localData.getItem(items)
    },
    loginSet(res) {
        let item = Object.assign({}, this.loginSetItem)
        for (var i in item) {
            if (res[i]) {
                item[i] = res[i]
            }
        }
        this.setToken(item)
        this.setStatus('logged')
        if (res.username) this.setItem({ 'keep_login_username': res.username })
        if (this.updateUserAttr) this.updateUserAttr()
        if (this.userMessageInit) this.userMessageInit()
        // this.bonusEveryday()
        // this.bonusEverydayNew()
    },
    setToken(item) {
        item.loginTime = parseInt(new Date().getTime() / 1000)
        localData.setItem(item)
        store.dispatch('setItem', item)
    },
    async engineSet(res) {
        let device = 'web'
        if (res.device) device = res.device
        let opt = {
            engine_id: res.engine_id || null,
            planId: res.planId || null,
            engine_device: device
        }
        this.setItem(opt)
        this.setStatus('engined')
        if (this.updateUserAttr) this.updateUserAttr()
        return this.connectLineCheck()
    },
    async loginOut() {
        if (!store.state.engine_id) return
        return this.engineQuitSend()
    },
    async engineQuitSend() {
        if (!this.engineIsAvailableCheck()) return
        if (!store.state.engine_id) return
        // let options = {
        //     url: '/engines/' + store.state.engine_id,
        //     method: 'DELETE',
        //     data: {
        //         engine_id: store.state.engine_id,
        //     }
        // }
        // let res = await this.request('engine', options)
        let res = await this.engineQuitAction()
        this.engineQuit(res)
        return res
    },
    async engineQuitAction() {
        let options = {
            url: '/engines/' + store.state.engine_id,
            method: 'DELETE',
            data: {
                engine_id: store.state.engine_id,
            }
        }
        let res = await this.request('engine', options)
        return res
    },
    formateDate(num) {
        if (num < 10) return '0' + num
        return num
    },
    async getPlan(id) {
        let planList
        let res = await this.enginePlan()
        if (res && res.code == 0) {
            try {
                res.data = JSON.parse(res.data)
            } catch (e) { }
            planList = res.data
            // this.setItem({
            //     planList: this.copy(planList)
            // })
        }
        if (!planList) return
        for (var i in planList) {
            if (planList[i].id == id) {
                return planList[i]
            }
        }
    },
    engineQuit(res) {
        let planId = store.state.planId
        let opt = {
            engine_id: null,
            enginePO: null
        }
        this.removeItem(opt)
        if (this.updateUserAttr) this.updateUserAttr()
        this.setStatus('logged')
        this.clineDelete()
        if (!res || res.code != 0) return
        this.engineBillDisplay(planId, res)
    },
    async engineBillDisplay(planId, res) {
        let plan = await this.getPlan(planId)
        if (res.code == 0) {
            let resCard = await this.cardPlanRemain()
            let discounts = 1
            if (resCard && resCard.code == 0 && resCard.data) discounts = resCard.data.discounts
            let Sdate = res.data.startTime.date.year + window.i18n.t('年1') +
                this.formateDate(res.data.startTime.date.month) + window.i18n.t('月1') +
                this.formateDate(res.data.startTime.date.day) + window.i18n.t('日1')
            let Stime = this.formateDate(res.data.startTime.time.hour) + ':' +
                this.formateDate(res.data.startTime.time.minute) + ':' +
                this.formateDate(res.data.startTime.time.second)
            let Edate = res.data.endTime.date.year + window.i18n.t('年1') +
                this.formateDate(res.data.endTime.date.month) + window.i18n.t('月1') +
                this.formateDate(res.data.endTime.date.day) + window.i18n.t('日1')
            let Etime = this.formateDate(res.data.endTime.time.hour) + ':' +
                this.formateDate(res.data.endTime.time.minute) + ':' +
                this.formateDate(res.data.endTime.time.second)
            let opt = {
                discounts: discounts,
                startTime: Sdate + ' ' + Stime,
                endTime: Edate + ' ' + Etime,
                cost: res.data.bill.toFixed(2),
                plan: plan || {},
                durationTime: res.data.durationTime
            }
            this.useRecodeShow(opt)
        }
    },
    localDataInit() {
        let data = localData.getAll()
        let item = {}, tem
        for (var i in data) {

            if (data[i] == 'undefined') {
                tem = {}
                tem[i] = true
                localData.removeItem(tem)
                continue
            }
            item[i] = data[i]
        }
        item['requestTime'] = {}
        store.dispatch('setItem', item)
    },
    init() {
        this.localDataInit()
        let stone19 = Array(19 * 19)
        let stone13 = Array(13 * 13)
        let stone9 = Array(9 * 9)
        let max = 19 * 19
        for (var i = 0; i < max; i++) {
            stone19[i] = -1
            if (i < stone13.length) stone13[i] = -1
            if (i < stone9.length) stone9[i] = -1
        }
        this.stone19 = stone19
        this.stone13 = stone13
        this.stone9 = stone9
    },
    getEnginePath() {
        return store.state.enginePath || '/engine'
    },
    getRouter(status, pathNow) {
        return this[status + 'Path'](pathNow)
        let path = this.router[status] || '/login'
        if (path == 'engined') {
            path = this.getEnginePath()
        }
        return path
    },
    loggedPath(pathNow) {
        let loggedDisabledPath = this.loggedDisabledPath
        if (loggedDisabledPath[pathNow]) return '/index'
        // if(loggedDisabledPath[pathNow]) return '/personal'
        // if(loggedDisabledPath[pathNow]) return this.getEnginePath()
        return pathNow
    },
    enginedPath(pathNow) {
        let enginedDisabledPath = this.enginedDisabledPath
        if (enginedDisabledPath[pathNow]) return this.getEnginePath()
        return pathNow
    },
    guestPath(pathNow) {
        let guestDisabledPath = this.guestDisabledPath
        let f = false
        for (var i in guestDisabledPath) {
            try {
                if (pathNow.indexOf(i) > -1) f = true
            } catch (e) { }
            if (f) break
        }
        if (f) return '/index'
        return pathNow
    },
    getUserInfo() {
        let userInfo = {
            username: store.state.username,
            userType: store.state.userType,
            nickname: store.state.nickname,
            photo: store.state.photo,
            status: store.state.status || 'guest',
        }
        return userInfo
    },
    setStatus(status) {
        let item = {
            status: status
        }
        store.dispatch('setItem', item)
    },
    async checkUser(access_token, token_type) {
        let options = {
            headers: {
                Authorization: 'Basic Z29sYXh5X3dlYjp4aW5nemhlbjA3MzA='
            },
            data: {
                token: access_token
            },
            url: '/oauth/check_token',
        }
        let res = await this.request('user', options)
        let co = Object.assign({}, res)
        return res
    },
    async refreshToken(refresh_token) {
        let options = {
            data: {
                grant_type: 'refresh_token',
                client_id: 'golaxy_web',
                refresh_token: refresh_token,
                client_secret: 'xingzhen0730',
            },
            url: '/oauth/token',
            headers: {
                Authorization: 'Basic Z29sYXh5X3dlYjp4aW5nemhlbjA3MzA='
            }
        }
        let res = await this.request('user', options).then(res => res)
        // .catch(error => {
        //     return {
        //         code: 1
        //     }
        // })
        return res
    },
    async pageEngineCheck() {
        let username = store.state.username,
            access_token = store.state.access_token,
            token_type = store.state.token_type
        if (!token_type || !access_token || !username) return false
        let res = await this.checkEngine(username, access_token, token_type)
        if (res && res.code == 0 && res.data != '') {
            let engine_id = res.data.engineId
            let device = res.data.device || 'web'
            let r = await this.engineSet({
                engine_id: engine_id,
                planId: res.data.planId,
                device: device
            })
        } else {
            this.engineQuit()
        }
        return res
    },
    async checkEngine(username, token, token_type) {
        let options = {
            data: {
                // username: username
            },
            url: '/engines/ids/' + username,
            method: 'GET',
            headers: {
                // Authorization: 'Basic Z29sYXh5X3dlYjp4aW5nemhlbjA3MzA='
                Authorization: token_type + ' ' + token

            }
        }
        let res = await this.request('engine', options).then(res => res)
        // .catch(error => {
        //     return {
        //         code: 1
        //     }
        // })
        return res
    },
    async refreshTokenByOutside() {
        if (!store.state.refresh_token) return
        let res = await this.refreshToken(store.state.refresh_token)
        if (res && res.code == 0) {
            res.username = store.state.username
            this.loginSet(res)
        }
        return res
    },
    async userCheckToken(token) {
        token = token || localStorage.access_token
        let options = {
            data: {
                // grant_type: 'refresh_token',
                client_id: 'golaxy_web',
                // refresh_token: refresh_token,
                client_secret: 'xingzhen0730',
                token: token
            },
            url: '/oauth/check_token',
            headers: {
                Authorization: 'Basic Z29sYXh5X3dlYjp4aW5nemhlbjA3MzA='
            }
        }
        let res = await this.request('user', options).then(res => res)
        return res
    },
    checklogintimeByRequest() {
        let path, active = true
        if (!this.checklogintime()) {
            this.quit()
            path = '/engine/login'
            this.MessageOpen({
                message: this.__ERRORMSGDEFINE.errorMsg.main['401'],
                duration: 0
            })
            active = false
        }
        return {
            active: active,
            path: path
        }
    },
    checklogintime() {
        let loginTime = this.getLocalItem('loginTime')
        if (!loginTime) return false
        let time = parseInt(new Date().getTime() / 1000) - loginTime
        if (time >= this.maxQuitTime) return false
        return true
    },
    updateRequstStatus() {
        let loginTime = parseInt(new Date().getTime() / 1000)
        this.setItem({
            loginTime: loginTime
        })
    },
    async checkTokenTime() {
        let refresh_token = localStorage.refresh_token || null
        let status
        if (!refresh_token) return false
        status = true
        let res = await this.userCheckToken().then(checkRes => {
            if (checkRes && checkRes.code == 0) {
                return this.refreshToken(refresh_token)
            } else {
                let opt = {
                    username: store.state.username,
                    access_token: store.state.access_token,
                    token_type: store.state.token_type
                }
                return this.checkEngine(opt.username, opt.access_token, opt.token_type)
                    .then(engineRes => {
                        if (engineRes && engineRes.code == 0 && engineRes.data != '') {
                            return this.refreshToken(refresh_token)
                                .then(refreshRes => {
                                    if (refreshRes && refreshRes.code == 0) {
                                        refreshRes.username = store.state.username
                                        this.loginSet(refreshRes)
                                    }
                                    return refreshRes
                                })
                        } else {
                            return false
                        }
                    })
            }
        })
        if (res && res.code == 0) {
            res.username = store.state.username
            this.loginSet(res)
        }
        else status = false
        return status
    },
    updateLocalToken() {
        let access_token = this.getLocalItem('access_token')
        this.setStoreItem({
            access_token: access_token
        })
    },
    clearLocalDataDis: {
        'theme': true,
        'stoneLabel': true,
        'voice': true,
        'winrateSwitchPlay': true,
        'coor': true,
        'AISpeed': true,
        'playReady': true,
        'enginePlanValue': true,
        'userGameStatus': true,
        'userPropsNotice': true,
        'engineDataConfig': true,
        'lifeAndDeath': true
    },
    clearLocalData() {
        let board = this.getLocalBoard()
        let list = this.deepCopy(localData.getAll())
        let disList = this.clearLocalDataDis
        let deleteData = {}
        for (var i in list) {
            if (disList[i]) continue
            deleteData[i] = true
        }
        // localData.clear()
        this.removeItem(deleteData)
        this.saveBoard(board)
    },
    async engineVersion() {
        let options = {
            method: 'GET',
            url: '/info/version/web',
            headers: {
                Authorization: 'Basic Z29sYXh5X3dlYjp4aW5nemhlbjA3MzA='
            }
        }
        let res = await this.request('engine', options).then(res => res)
        return res
    },
    async checkVersion() {
        let res = await this.engineVersion()
        let version = this.getLocalItem('version')
        if (!res || res.code != 0) {
            // return this.resendCodeAction()
        }
        if (version != res.data) this.clearLocalData()
        this.setLocalItem({
            version: res.data
        })
        return res
    },
    async computerLevelInsert(list) {
        if (!list || list.length <= 0 || this.computerLevelHasInsert) return
        let computerLevel = this.computerLevel
        for (var i in list) {
            computerLevel.unshift({
                value: list[i].id,
                label: list[i].name,
                name: list[i].name,
                AIname: '星阵',
                engine: true
            })
        }
        this.computerLevel = computerLevel
        this.computerLevelHasInsert = true
    },
    getCurrentPathForRewrite() {
        let path = window.GLOBAL_CONFIG.SHARE_URL
        return path + window.location.pathname
    },
    async pageStart() {
        this.getCurrentPathForRewrite()
        if (this._isMobile()) {
            // window.location.href = window.GLOBAL_CONFIG.SHARE_URL
            window.location.href = this.getCurrentPathForRewrite()
            return
        }
        await this.nationalityInit()
        await this.photoInit()
        let res = await this.checkVersion()
        res = await this.checkTokenStatus()
        return res
        // let res = await this.checkVersion()
        // .then(() => {
        //     return this.checkTokenStatus().then(resData => {
        //         
        //         return resData
        //     })
        // })
        // return res
    },
    async checkTokenStatus() {
        // this.checkVersion()
        // .then(() => {})
        let username = store.state.username || null
        let access_token = store.state.access_token || null
        let engine_id, planId, device = 'web'
        if (!username || !access_token) {
            this.quit()
            return false
        }
        let res = await this.checkTokenTime()
            .then(res => {
                if (!res) return res
                let opt = {
                    username: store.state.username,
                    access_token: store.state.access_token,
                    token_type: store.state.token_type
                }
                return this.checkEngine(opt.username, opt.access_token, opt.token_type)
                    .then(enRes => {
                        if (enRes && enRes.code == 0) {
                            device = enRes.device || 'web'
                            engine_id = enRes.data.engineId
                            planId = enRes.data.planId
                        }
                        return res
                    })
            })
        if (!res) {
            this.quit()
            return false
        }
        if (engine_id) {
            let resCline = await this.engineSet({
                engine_id: engine_id,
                planId: planId,
                device: device
            })
            // this.connectLineCheck()
        }
        return res
    },
    async checkStatus() {
        let data = Object.assign({}, localStorage)
        this.setStatus('guest')
        let username = store.state.username || null
        let access_token = store.state.access_token || null
        let refresh_token = store.state.refresh_token || null
        let loginTime = store.state.loginTime || null
        let expires_in = store.state.expires_in || null
        let token_type = store.state.token_type || null
        let engine_id = null, planId
        let device = 'web'
        if (!username || !access_token) {
            this.quit()
            return false
        }
        let timeNow = parseInt(new Date().getTime() / 1000)
        if ((Number(timeNow) - Number(loginTime)) >= expires_in) {
            this.quit()
            return false
        }
        let res = await this.checkUser(access_token, token_type)
            .then(res => {
                if (res && res.code == 0) {
                    return this.refreshToken(refresh_token)
                        .then(res => {
                            if (!res.username) res.username = username
                            if (res && res.code == 0) {
                                return this.checkEngine(username, res.access_token, res.token_type)
                                    .then(enRes => {
                                        if (enRes && enRes.code == 0) {
                                            device = enRes.data.device
                                            engine_id = enRes.data.engineId
                                            planId = enRes.data.planId
                                        }
                                        return res
                                    })
                                // .catch(error => {
                                //     return res
                                // })
                            } else {
                                return res
                            }
                        })

                } else {
                    this.quit()
                    return res
                }

            })
        if (!res || res.code != 0) {
            this.quit()
            return false
        }
        this.loginSet(res)
        if (engine_id) {
            this.engineSet({
                engine_id: engine_id,
                planId: planId,
                device: device
            })
        }
        return true
    },
    isLowerCase(data) {
        return (data > 'a' && data < 'z')
    },
    isCapital(data) {
        return (data > 'A' && data < 'Z')
    },
    deepCopy(obj) {
        if (this.isString(obj) || this.isBool(obj) || this.isNumber(obj) || !obj) return obj
        return JSON.parse(JSON.stringify(obj))
    },
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
    },
    isArray(obj) {
        return Object.prototype.toString.call(obj) == '[object Array]'
    },
    isObject(obj) {
        return Object.prototype.toString.call(obj) == '[object Object]'
    },
    isString(obj) {
        return Object.prototype.toString.call(obj) == '[object String]'
    },
    isNumber(obj) {
        return Object.prototype.toString.call(obj) == '[object Number]'
    },
    isBool(obj) {
        return Object.prototype.toString.call(obj) == '[object Boolean]'
    },
    isDate(obj){
        return Object.prototype.toString.call(obj) == '[object Date]'
    },
    isVideo(val){
        let rx = /\.(mp4|wmv|ramb|avi|flv)(\?.*)?$/
        return rx.test(val)
    },
    isImg(val){
        let rx = /\.(png|jpe?g|gif|svg)(\?.*)?$/
        return rx.test(val)
    },
    valueParse(val) {
        val = Number(val)
        if (val < 0) {
            val = -1 - val
            val = Math.abs(val) * 0.5
        } else {
            val = val * 0.5
            val = Math.abs(val) + 0.5
        }
        return val
    },
    delBasic: {
        // width:1700,
        // width: 1536,
        width: window.GLOBALATTR.delBasic.width,
        maxHeight: window.GLOBALATTR.delBasic.maxHeight,
        minWidthRax: window.GLOBALATTR.delBasic.minWidthRax,
        fontSize: 20,
        boardH: 39,
        optW: 26,
        height: 821,
        realHeight: document.body.offsetHeight,
        css: {
            'font-size': 20
        }
    },
    // delBasic: {
    //     width:1920,
    //     fontSize:20,
    //     boardH: 39,
    //     css: {
    //       'font-size': 20
    //     }
    // },
    boardWidthSet() {
        if (!this.boardObj) return
        let width = document.querySelector('.wgo-board canvas').offsetWidth
        this.boardObj.setWidth(width)
        this.boardObj.setHeight(width)
    },
    calculateWindowSize() {
        let ele = document.querySelector('#app')
        let WindowHeight = window.screen.availHeight * 0.92
        let WindowWidth = document.body.offsetWidth
        let rate = (WindowHeight / this.delBasic.height).toFixed(2), rateW
        let calFontSize = rate * this.delBasic.fontSize
        if (WindowWidth < (calFontSize * this.delBasic.boardH + calFontSize * this.delBasic.optW)) {
            rateW = (WindowWidth / this.delBasic.width).toFixed(2)
            rate = rateW
            if (rateW < 0.8) rate = 0.8
        }
        return rate
    },
    sizeInitForH() {
        if (!this.adaptive) return
        this.boardWidthSet()
        let height = this.delBasic.realHeight
        let screeH = document.body.offsetHeight
        let ele = document.querySelector('#app')
        // let rate = (ele.offsetWidth / this.delBasic.width).toFixed(2)
        let rate = (ele.offsetHeight / this.delBasic.height).toFixed(2)
        let maxHeight = 0.95
        if (rate < 0.8) {
            rate = 0.8
        } else if (this.delBasic.boardH * (rate * this.delBasic.fontSize) > height * maxHeight) {
            rate = (height * maxHeight / this.delBasic.boardH / this.delBasic.fontSize).toFixed(2)
        }
        let realSize = this.delBasic.fontSize * rate
        this.htmlFontSize = realSize
        document.querySelector('html').style.fontSize = realSize + 'px'
    },
    sizeInit() {
        
        if (!this.adaptive) return
        this.boardWidthSet()

        // let height = window.screen.availHeight
        let height = this.delBasic.realHeight
        // let height = document.body.offsetHeight
        let screeH = document.body.offsetHeight
        let ele = document.querySelector('#app')
        // let height = ele.offsetHeight


        // let rate = this.calculateWindowSize()
        let rate = (ele.offsetWidth / this.delBasic.width).toFixed(2)
        let rate2 = (ele.offsetHeight / this.delBasic.height).toFixed(2)
        let maxHeight = this.delBasic.maxHeight
        let minWidthRax = this.delBasic.minWidthRax
        if (rate < minWidthRax) {
            rate = minWidthRax
        } else if (this.delBasic.boardH * (rate * this.delBasic.fontSize) > height * maxHeight) {
            rate = (height * maxHeight / this.delBasic.boardH / this.delBasic.fontSize).toFixed(2)
        }
        let realSize = this.delBasic.fontSize * rate
        // if(realSize * pageWidth > window.screen.width * pageMax){
        //     let maxWidth = window.screen.width * pageMax
        //     realSize = maxWidth / pageWidth
        // }
        this.htmlFontSize = realSize
        document.querySelector('html').style.fontSize = realSize + 'px'
        if (this.onresizeFunction) {
            for (var i in this.onresizeFunction) {
                if (this.onresizeFunction[i]) this.onresizeFunction[i]()
            }
        }
    },
    parseOptions(rd, rootData) {
        if (!rd || rd == '' || rd == '') {
            return []
        }
        let post = [], tem, j = 0
        let optionsKey = this.optionsKey
        // this.parseOptionsActionNew(rd)
        rd = rd.split(';')
        // return this.parseOptionsAction(rd)
        return this.parseOptionsActionNew(rd, rootData)
    },
    parseBranch(rd, rootData) {
        if (!rd || rd == '' || rd == '') {
            return []
        }
        let post = [], tem, j = 0
        let optionsKey = this.optionsKey
        rd = rd.split(';')
        return this.parseOptionsActionNew(rd, rootData, 'branch')
    },
    parseOptions2(rd) {
        if (!rd || rd == '' || rd == '') {
            return []
        }
        rd = rd.split(';')
        return this.parseOptions2ActionNew(rd)
    },
    StoN(s) {
        return s.charCodeAt() - 97
    },
    NtoS(n) {
        return String.fromCharCode(n + 97)
    },
    parseOptionsHistory(data) {
        data = data.replace('&&&', '')
        if (!data || data.length <= 0) return data
        let moves = []
        for (var i = 0; i < data.length; i = Number(i) + 2) {
            let x = data[i], y = data[1 + i]
            if (!x || !y) continue
            if ((x == 't' && y == 't') || (x == 'z')) {
                moves.push('pass')
                continue
            }
            x = this.StoN(x);
            y = this.StoN(y);
            let coor = this.coorNtoS(x, y, 1)
            moves.push(coor.x + coor.y)
        }
        return moves.join(' ')
    },
    amountNumLdpRepaire(num, list) {
        for (var i in list) {
            let data = this.parseOptionsSingleNew(list[i])
            if (data.Move == 'KO_R' && data.PathCode.length <= 1) {
                num = num - Number(data.Number)
                break
            }
        }
        return num
    },
    parseOptionsActionNew(rd, rootData, parseType) {
        parseType = parseType || 'options'
        rootData = rootData || {}
        let post = [], tem, j = 0
        let optionsKey = this.optionsKeyNew
        let history = null
        let colorNow = null
        let colorNext = null
        let moveNum, rise = null
        if (rd[0].indexOf('Move') != -1 && rd[0].indexOf('NodeNum') != -1) {
            let optionsHead = rd[0]
            optionsHead = optionsHead.split(' ')
            rd.splice(0, 1)
            if (!isNaN(Number(optionsHead[1]))) {
                let num = Number(optionsHead[1])
                colorNow = (num % 2 == 0) ? 'BLACK' : 'WHITE'
                colorNext = (num % 2 == 0) ? 'WHITE' : 'BLACK'
                moveNum = num
            }
            if (optionsHead[4] == 'Rise') {
                rise = optionsHead[5]
            }

        }
        let amountNum = null
        let colorNowNum = colorNow == 'BLACK' ? 1 : -1
        for (var i in rd) {
            let realColor = parseType == 'options' ? colorNowNum : (i % 2 == 0 ? colorNowNum : -colorNowNum)
            realColor = realColor == 1 ? 'BLACK' : 'WHITE'
            if (!rd[i] || rd[i] == '' || rd[i] == ' ') continue
            if (rd[i].indexOf('&&&') > -1) {
                history = this.parseOptionsHistory(rd[i])
                continue
            }
            tem = rd[i].split(' ')
            j = 0
            post.push(this.parseOptionsSingleNew(rd[i]))
            // for(var k in tem){
            //     if(tem[k] == '' || tem[k] == ' ') continue
            //     post[post.length - 1][optionsKey[j]] = tem[k]
            //     if(optionsKey[j] == 'BP_Value'){
            //         post[post.length - 1][optionsKey[j]] = this.valueParse(post[post.length - 1][optionsKey[j]] / 100)
            //     }
            //     j++
            // }

            if (post[post.length - 1].PathCode == 'root') {
                amountNum = post[post.length - 1].Number
                amountNum = this.amountNumLdpRepaire(amountNum, rd)
                post[post.length - 1].Color = colorNext
            } else {
                // post[post.length - 1].Color = colorNow
                post[post.length - 1].Color = realColor
            }
            if (amountNum != null || rootData.Number) {
                let am = amountNum || rootData.Number
                post[post.length - 1].Proportion = (post[post.length - 1].Number / am)
            }
        }
        let opt = { options: post, history: history, moveNum: moveNum, head: { rise: rise } }
        return opt
    },
    parseOptions2ActionNew(rd) {
        let post = []
        let history = null
        let colorNow = null
        let colorNext = null
        let moveNum, rise = null
        if (rd[0].indexOf('Move') != -1 && rd[0].indexOf('NodeNum') != -1) {
            let optionsHead = rd[0]
            optionsHead = optionsHead.split(' ')
            rd.splice(0, 1)
            if (!isNaN(Number(optionsHead[1]))) {
                let num = Number(optionsHead[1])
                colorNow = (num % 2 == 0) ? 'BLACK' : 'WHITE'
                colorNext = (num % 2 == 0) ? 'WHITE' : 'BLACK'
                moveNum = num
            }
            if (optionsHead[4] == 'Rise') {
                rise = optionsHead[5]
            }
        }
        let amountNum = null
        let saveData = {}
        let rootPoint
        for (var i in rd) {
            if (!rd[i] || rd[i] == '' || rd[i] == ' ') continue
            if (rd[i].indexOf('&&&') > -1) {
                history = this.parseOptionsHistory(rd[i])
                continue
            }
            let singleData = this.parseOptionsSingleNew(rd[i])
            if (singleData.PathCode == 'root') {
                amountNum = singleData.Number
                amountNum = this.amountNumLdpRepaire(amountNum, rd)
                singleData.Color = colorNext
                rootPoint = this.deepCopy(singleData)
            } else if (singleData.PathCode.length <= 1) {
                singleData.Color = colorNow
            } else {
                singleData.Color = colorNext
            }
            if (amountNum != null) {
                singleData.Proportion = (singleData.Number / amountNum).toFixed(4)
            } else {
                // singleData.Proportion = (singleData.Number / amountNum)
            }
            if (!saveData[singleData.PathCode] && (singleData.PathCode == 'root' || singleData.PathCode.length <= 1))
                saveData[singleData.PathCode] = singleData
            else {
                let realPathCode = singleData.PathCode[0]
                if (saveData[realPathCode]) {
                    if (!saveData[realPathCode].nextOptions) saveData[realPathCode].nextOptions = []
                    singleData.Proportion = (singleData.Number / saveData[realPathCode].Number).toFixed(4)
                    saveData[realPathCode].nextOptions.push(singleData)
                }

            }
            // amountNum = null
            // post.push(singleData)
        }
        if (rootPoint) post.push(rootPoint)
        for (var i in saveData) {
            if (i == 'root') continue
            post.push(saveData[i])
        }
        let opt = { options: post, history: history, moveNum: moveNum, head: { rise: rise } }
        return opt
    },
    parseOptionsSingleNew(data) {
        let optionsKey = this.optionsKeyNew
        let tem = data.split(' ')
        let j = 0
        let post = {}
        for (var k in tem) {
            if (tem[k] == '' || tem[k] == ' ') continue
            post[optionsKey[j]] = tem[k]
            if (optionsKey[j] == 'BP_Value') {
                post[optionsKey[j]] = this.valueParse(post[optionsKey[j]] / 100)
            }
            j++
        }
        return post
    },
    parseOptionsAction(rd) {
        let post = [], tem, j = 0
        let optionsKey = this.optionsKey
        let history = null
        for (var i in rd) {
            if (!rd[i] || rd[i] == '' || rd[i] == ' ') continue
            if (rd[i].indexOf('&&&') > -1) {
                history = this.parseOptionsHistory(rd[i])
                continue
            }
            tem = rd[i].split(' ')
            j = 0
            post.push({})
            for (var k in tem) {
                if (tem[k] == '' || tem[k] == ' ') continue
                post[post.length - 1][optionsKey[j]] = tem[k]
                if (optionsKey[j] == 'BP_Value') {
                    post[post.length - 1][optionsKey[j]] = this.valueParse(post[post.length - 1][optionsKey[j]])
                }
                j++
            }
            if (post[post.length - 1]['PathCode'] == 'root') {
                post[post.length - 1]['WinRate'] = post[post.length - 1]['Prior']
                post[post.length - 1]['Prior'] = ''
            }
        }
        return { options: post, history: history }
    },
    parseArea(data) {
        data = data.split(' ')
        if (data[0] == '') data.splice(0, 1)
        if (data[data.length - 1] == '') data.splice(data.length - 1, 1)
        // if(data.length > 361){
        //     data.splice(361, data.length - 361)
        // }
        return data

    },
    parseMoves(moves) {
        moves = moves.split(' ')
        let data = []
        for (var i in moves) {
            if (!moves[i] && moves[i] == '' || moves[i] == ' ') continue
            data.push(moves[i])
        }
        return data
    },
    parseMovesForClient(moves) {
        if (!this.isArray(moves)) moves = moves.split(' ')
        let data = []
        for (var i in moves) {
            if (!moves[i] && moves[i] == '' || moves[i] == ' ') continue
            let coor = this.splitGtp(moves[i])
            coor.x = this.NtoS(coor.x)
            coor.y = this.NtoS(coor.y)
            data.push(coor.x + coor.y)
        }
        return data
    },
    setClockFormatToEng(time, second, num) {
        return time + ':' + second + ':' + num
    },
    async sendEngineCode(opt) {
        this.sendCodeBefore(opt.command || '')
        if (!store.state.engine_id) return false
        let method = opt.method || 'POST'
        let msgKey = 'engineCode'
        let timeout = opt.timeout
        if (isNaN(Number(timeout))) timeout = 25000
        let options = {
            url: '/engines/' + store.state.engine_id,
            timeout: timeout,
            method: method,
            msgKey: msgKey,
            data: {
                command: opt.command,
                params: opt.params,
                get_moves: opt.get_moves || false
            }
        }
        let res = await this.request('engine', options)
        this.sendCodeAfter(opt.command || '')
        return res
    },
    async engineHistory(opt) {
        opt = opt || {}
        let options = {
            command: 'get_moves',
            params: ''
        }
        // for(var i in opt){
        //     options[i] = opt[i]
        // }
        let res = await this.sendEngineCode(options)
        if (res && res.code == 0) {
            if (!opt.orginalData) res.data = this.parseOptionsHistory(res.data)
        }
        return res
    },
    async engineOptions(getMoves) {
        getMoves = getMoves || false
        // let opt = {
        //     command: 'options',
        //     params: '',
        //     method: 'GET',
        //     timeout: 25000
        // }
        // let res = await this.sendEngineCode(opt)
        // return res
        if (!store.state.engine_id || !store.state.username) return false
        let options = {
            url: `/engines/options/${store.state.engine_id}`,
            method: 'GET',
            headers: {
                // 'Authorization': 'Basic Z29sYXh5X3dlYjp4aW5nemhlbjA3MzA='
                'Authorization': ''
            },
            data: {
                get_moves: getMoves,
                engine_id: store.state.engine_id,
                username: store.state.username
            },
        }
        let res = await this.request('engine', options)
        // if(res && res.code == 0){
        //     let data = this.deepCopy(res.data)
        //     data = data.split(';')
        //     data[0] = `${data[0]} testNode D5`
        //     data = data.join(';')
        //     res.data = data
        // }
        return res
    },
    async engineKomi(komi) {
        if (!store.state.engine_id || !store.state.username) return false
        let opt = {
            command: 'komi',
            params: komi,
            method: 'GET'
        }
        if (komi === undefined) opt['params'] = ''
        let res = await this.sendEngineCode(opt)
        return res
    },
    async engineArea(moves, coors) {
        let params = coors || moves
        let opt = {
            command: 'area',
            params: params,
            method: 'GET'
        }
        let res = await this.sendEngineCode(opt)
        return res
    },
    async targetStoneSetAuto() {
        if (!store.state.engine_id || !store.state.username) return false
        let opt = {
            command: 'target_zone',
            params: 'auto',
            method: 'GET',
            get_moves: true
        }
        let res = await this.sendEngineCode(opt)
        // if (res && res.code == 0) {
        //     res.data = this.parseEngineTargetStone(res.data, 'auto')
        // }
        // this.errorHandle(res)
        // return res
        return this.ldpResponse(res, 'auto')
    },
    async targetStoneClear() {
        if (!store.state.engine_id || !store.state.username) return false
        let opt = {
            command: 'target_zone',
            params: 'clear',
            method: 'GET',
            get_moves: true
        }
        let res = await this.sendEngineCode(opt)
        // if (res && res.code == 0) {
        //     res.data = this.parseEngineTargetStone(res.data)
        // }
        // this.errorHandle(res)
        // return res
        return this.ldpResponse(res)
    },
    async targetStoneSet(options) {
        if (!store.state.engine_id || !store.state.username) return false
        options = options || {}
        let type = options.type || 'add'
        let coor = options.coor
        if (!this.isArray(coor)) coor = [coor]
        let params = coor.join(':')
        params = `${type}:${params}`
        let opt = {
            command: 'target_zone',
            params: params,
            method: 'GET',
            get_moves: true
        }
        let res = await this.sendEngineCode(opt)
        // if (res && res.code == 0) {
        //     res.data = this.parseEngineTargetStone(res.data, params)
            
        // }
        // this.errorHandle(res)
        // return res
        return this.ldpResponse(res)
    },
    async targetZongGet() {
        if (!store.state.engine_id || !store.state.username) return false
        let opt = {
            command: 'target_zone',
            params: '',
            method: 'GET',
            get_moves: true
        }
        let res = await this.sendEngineCode(opt)
        // if (res && res.code == 0) {
        //     res.data = this.parseEngineTargetStone(res.data)
            
        // }
        // this.errorHandle(res)
        // return res
        return this.ldpResponse(res)
    },
    async fightingAuto() {
        if (!store.state.engine_id || !store.state.username) return false
        let opt = {
            command: 'fighting_zone',
            params: 'auto',
            method: 'GET',
            get_moves: true
        }
        let res = await this.sendEngineCode(opt)
        // if (res && res.code == 0) {
        //     res.data = this.parseEngineTargetStone(res.data, 'auto')
            
        // }
        // return res
        return this.ldpResponse(res, 'auto')
    },
    async fightingZongGet() {
        if (!store.state.engine_id || !store.state.username) return false
        let opt = {
            command: 'fighting_zone',
            params: '',
            method: 'GET',
            get_moves: true
        }
        let res = await this.sendEngineCode(opt)
        // if (res && res.code == 0) {
        //     res.data = this.parseEngineTargetStone(res.data)
            
        // }
        // return res
        return this.ldpResponse(res)
    },
    async fightZoneClear() {
        if (!store.state.engine_id || !store.state.username) return false
        let opt = {
            command: 'fighting_zone',
            params: 'clear',
            method: 'GET',
            get_moves: true
        }
        let res = await this.sendEngineCode(opt)
        // if (res && res.code == 0) {
        //     res.data = this.parseEngineTargetStone(res.data)
            
        // }
        // return res
        return this.ldpResponse(res)
    },
    async borderZoneAuto() {
        if (!store.state.engine_id || !store.state.username) return false
        let opt = {
            command: 'boarder',
            params: 'auto',
            method: 'GET',
            get_moves: true
        }
        let res = await this.sendEngineCode(opt)
        // if (res && res.code == 0) {
        //     res.data = this.parseEngineTargetStone(res.data, 'auto')
            
        // }
        // return res
        return this.ldpResponse(res, 'auto')
    },
    async borderZoneGet() {
        if (!store.state.engine_id || !store.state.username) return false
        let opt = {
            command: 'boarder',
            params: '',
            method: 'GET',
            get_moves: true
        }
        let res = await this.sendEngineCode(opt)
        // if (res && res.code == 0) {
        //     res.data = this.parseEngineTargetStone(res.data)
            
        // }
        // return res
        return this.ldpResponse(res)
    },
    async borderZoneClear() {
        if (!store.state.engine_id || !store.state.username) return false
        let opt = {
            command: 'boarder',
            params: 'clear',
            method: 'GET',
            get_moves: true
        }
        let res = await this.sendEngineCode(opt)
        // if (res && res.code == 0) {
        //     res.data = this.parseEngineTargetStone(res.data)
            
        // }
        // return res
        return this.ldpResponse(res)
    },
    async ldpParamsClear() {
        if (!store.state.engine_id || !store.state.username) return false
        let opt = {
            command: 'life_death',
            params: 'clear',
            method: 'GET',
            get_moves: true
        }
        let res = await this.sendEngineCode(opt)
        // if (res && res.code == 0) {
        //     res.data = this.parseEngineTargetStone(res.data)
            
        // }
        // return res
        return this.ldpResponse(res)
    },
    async lifeDeathCommand(params) {
        if (!store.state.engine_id || !store.state.username) return false
        let opt = {
            command: 'life_death',
            params: params || '',
            method: 'GET',
            get_moves: true
        }
        let res = await this.sendEngineCode(opt)
        // if (res && res.code == 0) {
        //     res.data = this.parseEngineTargetStone(res.data, params)
            
        // }
        // return res
        return this.ldpResponse(res, params)
    },
    async setCurrentBoardLdp(params){
        if (!store.state.engine_id || !store.state.username) return false
        let opt = {
            command: 'set_stones',
            params: params || '',
            method: 'POST',
            get_moves: true
        }
        let res = await this.sendEngineCode(opt)
        // if (res && res.code == 0) {
        //     res.data = this.parseEngineTargetStone(res.data, params)
        // }
        // return res
        return this.ldpResponse(res, params)
    },
    ldpResponse(res, params){
        if(res && res.code == 0){
            res.data = this.parseEngineTargetStone(res.data, params)
            let data = res.data || {}
            data.error_code = Number(data.error_code)
            if(data.error_code){
                res.code = -1
            }
            return res
        }
        this.errorHandle(res)
        return res
    },
    parseEngineTargetStone(data, params) {
        let splitCh = '&&&'
        if (data.indexOf(splitCh) <= -1) splitCh = '&&'
        data = data.split(splitCh)
        let rd = []
        for (var i in data) {
            if (!data[i]) continue
            rd.push(data[i])
        }
        let tem = data[0].split(';')
        let error_code
        if(tem.length > 1){
            error_code = tem.pop()
            error_code = error_code.replace(' ', '')
            data[0] = tem.join(';')
        }
        let opt = {
            error_code: error_code,
            coors: data[0],
            history: data[1]
        }
        if(params && opt.error_code !== undefined && opt.error_code != 0){
            // this.errorHandle({code: opt.error_code}, 'ldp', {noTimeCheck: true})
            this.errorHandler({code: opt.error_code}, 'ldp', {noTimeCheck: true})
        }
        return opt
    },
    async engineRuleSet(rule) {
        if (!store.state.engine_id || !store.state.username) return false
        let opt = {
            command: 'rule',
            params: rule,
            method: 'GET',
            get_moves: true
        }
        let res = await this.sendEngineCode(opt)
        return res
    },
    async engineRuleGet() {
        if (!store.state.engine_id || !store.state.username) return false
        let opt = {
            command: 'rule',
            params: '',
            method: 'GET',
        }
        let res = await this.sendEngineCode(opt)
        return res
    },
    async engineSpotlight(params) {
        params = params || ''
        let opt = {
            command: 'spotlight',
            method: 'GET',
            params: params,
        }
        let res = await this.sendEngineCode(opt)
        this.errorHandle(res)
        return res
    },
    spotlightParse(data) {
        if (!data) return []
        data = data.split(';')
        let rd = []
        for (var i in data) {
            if (!data[i] || data[i] == '' || data[i] == ' ') continue
            let tem = data[i]
            tem = tem.split(' ')
            let tem2 = []
            for (var j in tem) {
                if (!tem[j] || tem[j] == '' || tem[j] == ' ') continue
                tem2.push(tem[j])
            }

            rd.push({
                Move: tem2[0],
                Proportion: Number(tem2[1])
            })
        }
        return rd
    },
    async engineOptions2(getMoves) {

        let opt = {
            command: 'options2',
            params: '',
            method: 'GET',
            timeout: 25000,
            get_moves: true
        }
        let res = await this.sendEngineCode(opt)
        return res
    },
    async getParseOptions() {
        let res = await this.engineOptions()
        if (!res || res.code != 0) return false
        let data = this.parseOptions(res.data)
        data = data.options
        return data
    },
    sendCodeBefore() { },
    sendCodeAfter() { },

    async tokenTimeCheck() {
        let loginTime = store.state.loginTime
        let userInfo = this.getUserInfo()
        let timeNow = parseInt(new Date().getTime() / 1000)
        let username = store.state.username
        if (userInfo.status == 'guest') return
        if (loginTime && timeNow - loginTime < this.refreshTokenTime) return

        let refresh_token = store.state.refresh_token || null
        if (!refresh_token) return false
        let res = await this.refreshToken(refresh_token)

        if (res && res.code == 0) {
            res.username = username
            this.setToken(res)
        }
    },
    requestAfter() {
        // this.tokenTimeCheck()
    },
    async request(type, options) {
        // this.localDataInit()
        let res = await this.http.request(type, options)
        this.requestAfter()
        return res
    },
    async getStaticData(path, opt) {
        let post = {}
        opt = opt || {}
        for (var i in opt) {
            post[i] = opt[i]
        }
        post['path'] = path
        let res = await this.http.staticSendCode(post)
        return res
    },
    async getStaticDataJsonp(path) {
        let res = await this.http.sendCodeJsonp(path)
        return res
    },
    coor2to1(x, y, boardSize) {
        boardSize = boardSize || 19
        if (x == -1 || y == -1) {
            return -1
        }
        return y * boardSize + x;
    },
    coor1to2(n, boardSize) {
        boardSize = boardSize || 19
        if (n == -1) {
            return {
                x: -1,
                y: -1
            }
        }
        return {
            x: n % boardSize,
            y: parseInt(n / boardSize)
        };
    },
    coorNtoS(x, y, coorSys, boardSize) {
        boardSize = boardSize || 19
        coorSys = coorSys || 1
        var coor = {};
        if (x && !y) coor = this.coor1to2(x);
        else if (x != 0 && !x) return false
        else coor.x = x, coor.y = y;
        switch (coorSys) {
            case 1:
                if (coor.x > 7) coor.x += 1;
                return {
                    x: String.fromCharCode(coor.x + 65),
                    y: boardSize - coor.y
                }
            case 2:
                return {
                    x: coor.x + 1,
                    y: coor.y + 1
                }
            case 3:
                return {
                    x: String.fromCharCode(coor.x + 65),
                    y: coor.y + 1
                }
        }
    },
    async syncBoardToEngine(step, history) {
        if (!history && history != '') {
            let res = await this.engineHistory()
            if (!res || res.code != 0) return res
            history = this.parseMoves(res.data)
        }
        let data = this.syncBoardToEngineAction(history, step)
        return data
        // if(res.code != 0)
    },
    historyBoard(step, history) {
        let HistoryL = history.length
        let historyCopy = this.copy(history)
        let coor, moves = [], color = 1, back = 0, eindex = null, go = null
        if (step.length <= 0) {
            if (history.length <= 0) {
                return {
                    moves: moves,
                    back: back
                }
            } else {
                return {
                    moves: moves,
                    back: back,
                    clearBoard: true
                }
            }
        }
        if (history.length > step.length) {
            back = history.length - step.length
            history.splice(step.length, history.length - step.length)
        }
        // for (var i = step.length - 1; i >= 0; i--) {
        //     if (step[i].move != history[i]) {
        //         if (history[i] != undefined) {
        //             back++
        //         }
        //         moves.unshift({
        //             color: step[i].color,
        //             move: step[i].move,
        //             position: 1 + Number(i)
        //         })
        //     }
        // }
        let movesWtFor = []
        for (var i in step) {
            if (step[i].move != history[i]) {
                if (history[i]) {
                    back += history.length - i
                }
                movesWtFor = step.splice(i, step.length - i)
                break
            }
        }
        for (var i in movesWtFor) {
            moves.push({
                move: movesWtFor[i].move,
                color: movesWtFor[i].color,
                position: movesWtFor[i].position,
            })
        }
        if (back != 0) {
            go = HistoryL - back
        }
        return {
            moves: moves,
            back: back,
            go: go
        }
    },
    syncBoardToEngineAction(history, step) {
        if (step[0] && step[0].c == -1) step.shift()
        let data = this.historyBoard(step, history)
        data.code = 0
        if (data.moves.length > 0 || data.back > 0 || data.clearBoard) data.code = -2
        return data
    },
    MessageOpen(opt) {
        // Message.closeAll()
        this.MessageCloseAll()
        for (var i in this.errorNoticeConfig) {
            if (opt[i] != undefined) continue
            opt[i] = this.errorNoticeConfig[i]
        }
        try {
            opt.message = window.i18n.t(opt.message)
        } catch (e) { }
        Message(opt)
    },
    MessageCloseAll() {
        Message.closeAll()
    },
    async engineLinkTest() {
        let res = await this.engineHistory()
        return res
    },
    //获取账户余额
    async getUserBalances(username) {
        if (!username) return false
        let options = {
            url: '/balances/' + username,
            timeout: 0,
            method: 'get',
            data: {
                username: username
            }
        }
        let res = await this.request('engine', options).then(res => res)
        if (res && res.code == 0) {
            // res.data.balance = res.data.balance.toFixed(2)
            res.data.balance = this.numToFixed2(res.data.balance)
        }
        return res
    },
    numToFixed2(num) {
        return parseFloat(num.toFixed(2))
        // let tem = parseInt(num), n
        // if(tem == num) n = 0
        // if(tem < num){
        //     let tem2 = num % tem
        //     tem2 = '' + tem2
        //     if(tem2.length >= 2) n = 2
        //     else n = 1
        //     if(tem2[tem2.length - 1] == 0) n--
        // }
        // return num.toFixed(n)
    },
    async engineErrorHandle(command, code, step) {
        let res = await this.engineHistory()
        if (!res) {
            this.MessageOpen({
                message: this.__ERRORMSGDEFINE.errorMsg.main[-2],
                duration: 0
            })
            return {
                code: -1,
            }
        }
        if (res.code == 0) {
            this.syncBoardToEngineAction(this.parseMoves(res.data))
            return {
                code: 0
            }
        }
        if (res.code == -1) {
            let maxTime = this.engineRequestMaxTime[command] || 25000
            let rt = store.state.requestTime[command]
            if (rt >= maxTime) {
                this.MessageOpen({
                    message: this.__ERRORMSGDEFINE.errorMsg.main[-2],
                    duration: 0
                })
                return {
                    code: -1,
                }
            } else {
                setTimeout(() => {
                    this.engineErrorHandle(command, code, step)
                }, (maxTime - rt) * 1000);
            }
        }
    },
    saveBoard(step) {
        localData.setItem({
            board: step
        })
    },
    saveBoardForLevel(items) {
        localData.setItem(items)
    },
    clearLocalBoard() {
        localData.removeItem({
            board: ''
        })
    },
    getLocalBoard(key) {
        key = key || 'board'
        return localData.getItem(key)
    },
    clearBoard() {
        localData.removeItem({
            board: ''
        })
    },
    clearBoardForLevel() {
        // levelBoard: data.join(',')
        localData.removeItem({
            levelBoard: '',
            levelGameTime: ''
        })
    },
    tokenErrorCode(code){
        code = '' + code
        let f = false
        switch (code) {
            case '401':
                if (store.state.username) {
                    f = true
                }
                break
            case '6001':
                if (store.state.username) {
                    f = true
                }
                break
        }
        return f
    },
    requestErrorNumber: {
        '401': () => {
            let path = null
            this.quit()
            path = '/engine/login'
            this.MessageOpen({
                message: this.__ERRORMSGDEFINE.errorMsg.main['401'],
                duration: 0
            })
            return path
        }
    },
    requestError(code) {
        // let path = null
        // code = '' + code
        // if(this.requestErrorNumber[code]) path = this.requestErrorNumber[code]()
        code = '' + code
        let path = null
        switch (code) {
            case '401':
                if (store.state.username) {
                    this.quit()
                    path = '/engine/login'
                    this.MessageOpen({
                        message: this.__ERRORMSGDEFINE.errorMsg.main['401'],
                        duration: 0
                    })
                }
                break
            case '6001':
                if (store.state.username) {
                    this.quit()
                    path = '/engine/login'
                    this.MessageOpen({
                        message: this.__ERRORMSGDEFINE.errorMsg.main['401'],
                        duration: 0
                    })
                }
                break
        }
        return path
    },
    notifyOpen(opt) {
        this.notifyCloseAll()
        let config = this.notifyConfig
        for (var i in config) {
            if (opt[i] != undefined) continue
            opt[i] = config[i]
        }
        Notification(opt)
    },
    notifyCloseAll() {
        Notification.closeAll()
    },
    useRecodeShow(opt) {
        let startTime = opt.startTime
        let endTime = opt.endTime
        let cost = opt.cost
        let plan = opt.plan
        let discounts = opt.discounts || 1
        let priceEle = `${plan.price}`
        let realPrice = (discounts * plan.price).toFixed(2)
        let durationTime = opt.durationTime
        let oriPrice = (durationTime * plan.price).toFixed(2)
        let costEle = cost
        if (cost != oriPrice) {
            costEle = `<span class="delete">${oriPrice}</span>${cost}`
        }
        if (discounts < 1) {
            priceEle = `<span class="delete">${plan.price}</span>${realPrice}`
        }
        let html = `
                <div class="use-record">
                    <div class="item">${window.i18n.t('开始时间：')}${startTime}</div>
                    <div class="item">${window.i18n.t('结束时间：')}${endTime}</div>
                    <div class="item">${window.i18n.t('配置信息：')}${window.i18n.t(plan.name)} ￥${priceEle}<span class="currency"> CNY </span> /${window.i18n.t('分钟')}</div>
                    <div class="item cost">${window.i18n.t('费用：')} ￥ ${costEle}  <span class="currency"> CNY </span> </div>
                </div>
            `
        this.notifyOpen({
            title: window.i18n.t('已结束使用'),
            message: html,
            dangerouslyUseHTMLString: true,
            duration: 20000,
            // duration: 0,
        })
    },
    noticeTimeout: null,
    paseClearPageMsg() {
        if (this.noticeTimeout == null) return
        clearTimeout(this.noticeTimeout)
    },
    clearPageMsgAction() {
        Notification.closeAll()
        Message.closeAll()
    },
    clearPageMsg() {
        this.noticeTimeout = setTimeout(() => {
            this.clearPageMsgAction()
        }, 2000)
    },
    async resendCode(type, opt, num) {
        if (num <= 0) return {
            code: -1
        }
        let res = await this.resendCodeAction(type, opt)
        if (!res || res.code == -1) {
            num--
            this.resendCode(type, opt, num)
        } else {
            return res
        }
    },
    async resendCodeAction(type, opt) {
        let res = await this.request(type, opt)
        return res
    },
    async engineStart() {
        let opt = {
            command: 'start',
            params: '',
            method: 'GET',
            timeout: 25000
        }
        let res = await this.sendEngineCode(opt)
        return res
    },
    async genmove() {
        let res = await this.engineStart()
            .then(res => {

            })
    },
    async engineGoto(p) {
        let options = {
            command: 'goto',
            params: p
        }
        let res = await this.sendEngineCode(options)
        return res
    },
    formatTime(s) {
        let h, m
        m = parseInt(s / 60)
        s = s % 60
        h = parseInt(m / 60)
        m = m % 60
        if (h == 0) h = ''
        if (s < 10) s = '0' + s
        if (m < 10) m = '0' + m
        if (h != 0 && h < 10) h = '0' + h
        if (h != 0) h = h + ':'
        else h = ''

        return h + m + ':' + s
    },
    async enginePlan(komi) {
        let url = `/gpu/plans`
        let data = undefined
        // komi = 7.5
        if (komi !== undefined) {
            komi = Number(komi)
            komi = komi == 6.5 ? 6.5 : 7.5
            data = { komi: komi }
        }
        if (store.state.username) url = `/gpu/plans/${store.state.username}`
        let res = await this.request('engine', {
            url: '/gpu/plans',
            method: 'GET',
            data: data,
            noMsg: true
        })
        if (res && res.code == 0) {
            this.computerLevelInsert(this.deepCopy(res.data))
            if (!store.state.username) {
                for (var i in res.data) {
                    // res.data[i].unavailableReason = "permission denied"
                    res.data[i].unavailableReason = "none login"
                    res.data[i].available = false
                }
            }
        }
        return res
    },
    coorStoN(x, y, coorSys, boardSize) {
        boardSize = boardSize || 19
        switch (coorSys) {
            case 1:
                let xr = x.charCodeAt() - 65;
                if (xr > 7) xr--;
                return {
                    x: xr,
                    y: boardSize - y
                }
            case 2:
                return {
                    x: x - 1,
                    y: y - 1
                }
            case 3:
                return {
                    x: x.charCodeAt() - 65,
                    y: y - 1
                }
        }
    },
    splitGtp(s) {

        if (s == 'pass' || s == 'Pass' || s == 'PASS') {
            return { x: -1, y: -1 }
        }
        let coor = s.toUpperCase()
        let x = coor[0], y = ''
        for (var i = 1; i < s.length; i++) {
            y += String(s[i])
        }
        return this.coorStoN(x, y, 1);
    },
    isAIresign(opt, position, positionNum) {

        let ropt = this.deepCopy(opt)
        if (Number(position) >= this.AIresignRate.position &&
            Number(ropt.BP_Value) < this.AIresignRate.winrate &&
            Number(positionNum >= this.resignPosition) &&
            this.AIresignRate.delta > Number(ropt.BP_Delta)) return true
        return false
    },
    checkGenmoveCoor(opt, position, positionNum) {
        let coor = opt.coor
        if (this.isAIresign(opt, position, positionNum)) coor = -3
        return coor
    },
    parseJudge(data) {
        if (this.isArray(data)) return data
        data = data.split('')
        let rd = []
        for (var i in data) {
            if (!data[i] || data[i] == '' || data[i] == ' ') continue
            rd.push(data[i])
        }
        // if (data[0] == '') data.splice(0, 1)
        // if (data[data.length - 1] == '') data.splice(data.length - 1, 1)
        return rd
    },
    parseJudgeEngine(data){
        if (this.isArray(data)) return data
        let result = null
        if(data.indexOf('&') > -1){
            data = data.split('&')
            result = data[1]
            result = result.replace(/\s/g, '')
            data = data[0]
            data = data.replace(/\s/g, '')
        }
        data = data.split('')
        let rd = []
        for (var i in data) {
            if (!data[i] || data[i] == '' || data[i] == ' ') continue
            rd.push(data[i])
        }
        result = result || ''
        let winner, delta, belong = rd
        if(result.indexOf('+') <= -1){
            winner = 'U'
            delta = 0
        }else{
            let re = this.parseResultSelect(result)
            winner = result[0]
            winner = winner.toUpperCase()
            delta = result.substring(result.indexOf('+') + 1, result.length)
        }
        return {belong, winner, delta}
    },
    async engineJudge() {
        let options = {
            command: 'judge',
            params: ''
        }
        let res = await this.sendEngineCode(options).then(res => res)
        // if(res && res.code == 0){
        //     res.data = `${res.data} &&& W+2.5`

        // }
        return res
    },
    setUserAtt(items) {
        this.setItem(items)
    },
    saveSgfInfo(sgfInfo) {
        this.setItem({
            sgfInfo: JSON.stringify(sgfInfo)
        })
    },
    clearSgfInfo() {
        this.removeItem({
            sgfInfo: ''
        })
    },
    getPagePathByIndex(index) {
        let routes = router.options.routes
        return routes[index] || routes[0]
    },
    getPagePathByName(name) {
        let routes = router.options.routes
        let index = 0
        let r = routes[i]
        for (var i in routes) {
            if (routes[i].name == name) {
                r = routes[i]
                index = i
                break
            }
        }
        return {
            route: r,
            index: index
        }
    },
    pagePreCheck(pathNow) {
        let userInfo = this.getUserInfo();
        let path = this.getRouter(userInfo.status, pathNow)
        if (path != pathNow) router.push({ path: path })
    },
    backPage(path) {
        router.back(path)
    },
    replacePage(path, from, to) {
        let query = null
        if (from || to) {
            query = {
                from: from,
                to: to
            }
        }
        router.replace({
            path: path,
            query: query
        })
    },
    jumpToPageReplace(path, from, to) {
        let query = null
        if (from || to) {
            query = {
                from: from,
                to: to
            }
        }
        router.replace({
            path: path,
            query: query
        })
        this.clearPageMsgAction()
    },

    jumpToPage(path, from, to) {
        let query = null
        if (from || to) {
            query = {
                from: from,
                to: to
            }
        }
        router.push({
            path: path,
            query: query
        })
        this.clearPageMsgAction()
    },
    jumpToPageNew(path, query) {
        const { href } = router.resolve({
            path: path,
            query: query
        })
        window.open(href, '_blank')
    },
    jumpToPageBack(num) {
        num = num || -1
        router.go(num)
    },
    errorHandleSpecHandle(code, errKey) {
        // let codeList = this.errorHandleSpecCode
        // if(!codeList[code]) return true
        if (!this[`codeHandle${code}`]) return true
        this[`codeHandle${code}`](errKey)
    },
    codeHandle401() {
        let path = this.requestErrorHandle(401)
    },
    codeHandle6001() {
        this.requestErrorHandle(401)
    },
    requestErrorHandle(code) {
        let path = this.requestError(code)
        if (path) {

            // this.jumpToPageReplace(path)
        }
        return path
    },
    async codeHandle7001(key) {
        // key = key || 'store'
        // if(!this.leConfirm[key]){
        //     key = this.errorHandleSpecCode[key] || 'store'
        // }
        // this.leConfirmOpen(key) 
        key = key || 'default'
        if (!this.leConfirm[key]) {
            key = 'default'
        }
        let opt = {
            icon: 'g1',
            btnName: '去充值',
            gotoPath: this.pageList.recharge.normal,
            msg: '请充值后再继续使用。'
        }
        let icon = 'g1'
        let btnName = '去充值'
        let gotoPath = this.pageList.recharge.normal
        let msg = '请充值后再继续使用。'
        let res = await this.haveValueGet()
        if (res) {

            opt.btnName = '去领取'
            opt.gotoPath = '/engine/activity'
            opt.msg = '您还有未领取的礼金，领取后可继续使用。'
        }
        this.error7001Notice(opt)
    },
    error7001Notice(opt) {
        opt = opt || {}
        let key = opt.key || 'default'
        let icon = opt.icon || 'g1'
        let btnName = opt.btnName || '去充值'
        let gotoPath = opt.gotoPath || this.pageList.recharge.normal
        let msg = opt.msg || '请充值后再继续使用。'
        let message = `
            <div class="balance-not-enough">
                <div class="message">
                    <span class="txt">
                    您当前
                    <img src="${this.assetsUrl}/img/${icon}.png" class="notice-icon" alt="">
                    余额不足，${msg}</span>
                </div>
            </div>
        `
        this.leConfirm[key].open({
            message: message,
            button: [
                { name: btnName, label: 0 }
            ]
        }).then(res => {
            if (res && res.label == 0) {
                this.jumpToPage(gotoPath)
            }
        })
        if (this.createReportCom) this.createReportCom.close()
    },
    async probResponseCheck(code, errKey) {
        if (!this[`codeHandle${code}New`]) return 0
        return this[`codeHandle${code}New`](errKey)
    },
    async codeHandle7003New(errKey) {
        let key = 'default'
        if (!errKey || !this.propsIcon[errKey]) return
        if (!this.prob7003Com) return this.codeHandle7003(errKey)
        let res = await this.prob7003Com.open(errKey)
        return res ? 1 : 2
    },
    async codeHandle7003(errKey) {
        let key = 'default'
        if (!errKey || !this.propsIcon[errKey]) return
        let icon = this.propsIcon[errKey].icon
        let name = this.propsIcon[errKey].name
        let index = this.propsIcon[errKey].sort - 1
        let res = await this.havePropsGet()
        let msg = '请前往商城购买。'
        let gotoPath = `/engine/store/purchase/prop/${index}`
        let btnName = '去购买'
        if (res) {
            msg = '您还有未领取的道具。'
            btnName = '去领取'
            gotoPath = '/engine/activity'
        }
        let message = `
            <div class="balance-not-enough">
                <div class="message">
                    <span class="txt">
                    您的
                    <img src="${this.assetsUrl}/img/${icon}.png" class="notice-icon" alt="">
                    ${name}道具已用尽，${msg}</span>
                </div>
            </div>
        `
        if (!this.leConfirm[key]) return
        this.leConfirm[key].open({
            message: message,
            button: [
                { name: btnName, label: 0 }
            ]
        }).then(res => {
            if (res && res.label == 0) {
                if (this.gotoStoreBefore) {
                    this.gotoStoreBefore().then(res => {
                        this.jumpToPage(gotoPath)
                    })
                }
            }
        })
    },
    async reportHandle7003(errkey) {
        let opt = {
            icon: 'g1',
            btnName: '去充值',
            gotoPath: this.pageList.recharge.normal,
            msg: '请充值后再继续使用。'
        }
        let res = await this.haveReportGet()
        if (res) {
            let sIcon = 're2'
            let name = '报告'
            let index = 0
            if (this.storeReportIconStore[res]) {
                sIcon = this.storeReportIconStore[res].icon
                name = this.storeReportIconStore[res].name
                index = this.storeReportIconStore[res].sort
                opt.btnName = '去领取'
                opt.gotoPath = '/engine/activity'
                let type = res == 'value' ? '礼金券' : '报告券'
                opt.msg = `您有未领取的${type}，领取后可使用。`
            } else if (res == 'value') {
                opt.btnName = '去领取'
                opt.gotoPath = '/engine/activity'
                opt.msg = '您还有未领取的礼金，领取后可继续使用。'
            }
        }
        this.error7001Notice(opt)
    },
    errorMsgGet(key1, key2) {
        key1 = key1 || 'main'
        let msg = ''
        try {
            msg = this.__ERRORMSGDEFINE.errorMsg[key1][key2]
        } catch (e) { }
        return msg
    },
    errorHandleMsgGet(res, errKey) {
        if (res && res.code == 0) return
        if (!this.errorHandleSpecHandle(res.code, errKey)) return
        let msg = this.__ERRORMSGDEFINE.errorMsg['main']['-1']
        if (errKey != undefined && this.__ERRORMSGDEFINE.errorMsg[errKey] && this.__ERRORMSGDEFINE.errorMsg[errKey][res.code]) {
            msg = this.__ERRORMSGDEFINE.errorMsg[errKey][res.code]
        } else if (this.__ERRORMSGDEFINE.errorMsg[errKey] && this.__ERRORMSGDEFINE.errorMsg[errKey][res.msg]) {
            msg = this.__ERRORMSGDEFINE.errorMsg[errKey][res.msg]
        } else {
            let checkMsg = null
            if (this.__ERRORMSGDEFINE.errorMsg[errKey]) {
                let data = this.__ERRORMSGDEFINE.errorMsg[errKey]
                for (var i in data) {
                    if (res.msg.indexOf(i) > -1) {
                        checkMsg = data[i]
                        break
                    }
                }
            }
            if (!checkMsg) msg = this.__ERRORMSGDEFINE.errorMsg['main'][res.code] || this.__ERRORMSGDEFINE.errorMsg['main'][res.msg] || this.__ERRORMSGDEFINE.errorMsg['main']['-1']
            else msg = checkMsg
        }
        return msg
    },
    errorNoticeList: {},
    errorNoticeInterval: 10,
    errorSplitCheck(res) {
        let key = JSON.stringify(res)
        let errorNoticeList = this.errorNoticeList
        if (!errorNoticeList[key]) {
            let t = parseInt(((new Date()).getTime()) / 1000)
            errorNoticeList[key] = t
            return true
        }
        let t = errorNoticeList[key]
        let tNow = parseInt(((new Date()).getTime()) / 1000)
        if ((tNow - t) > this.errorNoticeInterval) {
            delete this.errorNoticeList[key]
            return true
        }
        return false
    },
    errorHandle(res, errKey, opt) {
        opt = opt || {}
        if (!res || !this.isObject(res)) {
            return
        }
        if (res && res.code == 0) {
            return
        }
        if (!this.errorHandleSpecHandle(res.code, errKey)) {
            return
        }
        if (!opt.noTimeCheck && !this.errorSplitCheck(res)) {
            return
        }
        let msg = this.__ERRORMSGDEFINE.errorMsg['main']['-1']
        if (errKey != undefined && this.__ERRORMSGDEFINE.errorMsg[errKey] && this.__ERRORMSGDEFINE.errorMsg[errKey][res.code]) {
            msg = this.__ERRORMSGDEFINE.errorMsg[errKey][res.code]
        } else if (this.__ERRORMSGDEFINE.errorMsg[errKey] && this.__ERRORMSGDEFINE.errorMsg[errKey][res.msg]) {
            msg = this.__ERRORMSGDEFINE.errorMsg[errKey][res.msg]
        } else {
            let checkMsg = null
            if (this.__ERRORMSGDEFINE.errorMsg[errKey]) {
                let data = this.__ERRORMSGDEFINE.errorMsg[errKey]
                for (var i in data) {
                    if (res.msg && res.msg.indexOf(i) > -1) {
                        checkMsg = data[i]
                        break
                    }
                }
            }
            if (!checkMsg) msg = this.__ERRORMSGDEFINE.errorMsg['main'][res.code] || this.__ERRORMSGDEFINE.errorMsg['main'][res.msg] || this.__ERRORMSGDEFINE.errorMsg['main']['-1']
            else msg = checkMsg
        }
        this.MessageOpen({
            message: msg,
            duration: 5000
        })
    },
    async errorHandler(res, errKey, opt){
        if(!this.leConfirm || !this.leConfirm.default){
            this.errorHandle(res, errKey, opt)
            return Promise.resolve()
        }
        opt = opt || {}
        if (!res || !this.isObject(res)) {
            return
        }
        if (res && res.code == 0) {
            return
        }
        if (!this.errorHandleSpecHandle(res.code, errKey)) {
            return
        }
        if (!opt.noTimeCheck && !this.errorSplitCheck(res)) {
            return
        }
        let msg = this.__ERRORMSGDEFINE.errorMsg['main']['-1']
        if (errKey != undefined && this.__ERRORMSGDEFINE.errorMsg[errKey] && this.__ERRORMSGDEFINE.errorMsg[errKey][res.code]) {
            msg = this.__ERRORMSGDEFINE.errorMsg[errKey][res.code]
        } else if (this.__ERRORMSGDEFINE.errorMsg[errKey] && this.__ERRORMSGDEFINE.errorMsg[errKey][res.msg]) {
            msg = this.__ERRORMSGDEFINE.errorMsg[errKey][res.msg]
        } else {
            let checkMsg = null
            if (this.__ERRORMSGDEFINE.errorMsg[errKey]) {
                let data = this.__ERRORMSGDEFINE.errorMsg[errKey]
                for (var i in data) {
                    if (res.msg && res.msg.indexOf(i) > -1) {
                        checkMsg = data[i]
                        break
                    }
                }
            }
            if (!checkMsg) msg = this.__ERRORMSGDEFINE.errorMsg['main'][res.code] || this.__ERRORMSGDEFINE.errorMsg['main'][res.msg] || this.__ERRORMSGDEFINE.errorMsg['main']['-1']
            else msg = checkMsg
        }
        this.leConfirm.default.close()
        msg = this.urlParse(msg, opt)
        let sta = await this.leConfirm.default.open({
            message: msg,
            button: [
                {name: '确定'}
            ]
        })
        return sta
        // this.MessageOpen({
        //     message: msg,
        //     duration: 5000
        // })
    },
    checkEnterEngineTime() {
        if (store.state.enterEngineTime != this.getLocalItem('enterEngineTime')) {
            this.jumpToPage('/index')
            this.MessageOpen({
                message: this.__ERRORMSGDEFINE.errorMsg.notAllowThisPage,
                duration: 0
            })
            return false
        }
        return true
    },
    urlCheck() {
        let url = window.location.origin
        let local = 'localhost'
        if (url.indexOf(this.weburl) != -1 || url.indexOf(local) != -1) return true
        return false
    },
    async genmoveGetPublic(opt) {
        let options = {
            url: `/dcnn/public/genmove`,
            method: 'GET',
            data: {
                situation: opt.situation,
                level: opt.level,
                board_size: opt.board_size
            },
            timeout: 15000
        }
        let res = await this.request('engine', options)
        return res
    },
    async genmoveGet(opt, api) {
        if (!store.state.username) return this.genmoveGetPublic(opt)
        // https://golaxy.weiqiai.com:8087/dcnn/genmove?situation=300,72&level=3000&board_size=19
        let resign = opt.resign == undefined ? 1 : opt.resign
        api = api || 'dcnn'
        let options = {
            url: `/${api}/genmove`,
            method: 'GET',
            data: {
                situation: opt.situation,
                level: opt.level,
                board_size: opt.board_size,
                resign: resign
            },
            timeout: 15000,
            __retryCount: opt.resend || 0
            // errorMsgHide: true
        }
        let res = await this.request('engine', options)
        return res
    },
    async playValueGet(moves, boardSize, api, level) {
        this.areaLoading = true
        api = api || 'dcnn'
        level = level || 3000
        let opt = {
            url: `/${api}/area`,
            method: 'GET',
            data: {
                situation: moves,
                board_size: boardSize,
                level: level
            }
        }
        // let data = await this.areaLocalDataGet(moves)

        let data = await this.probsDataStoreGet(moves, 'area')

        let res
        res = data ? { code: 0, data: data, local: true } : await this.request('engine', opt)
        this.areaLoading = false
        if (res && res.code == 0) this.probsDataStoreSet(moves, res.data, 'area')
        return res
    },
    //领地数据暂存
    areaLocalDataSet(moves, data) {
        let key = 'areaProbsBoard'
        let post = {
            moves: moves,
            data: data
        }
        let setData = {}
        setData[key] = JSON.stringify(post)
        this.setStoreItem(setData)
    },
    async areaLocalDataGet(moves) {
        let key = 'areaProbsBoard'
        let movesLocal = store.state[key]
        if (movesLocal) {
            try {
                movesLocal = JSON.parse(movesLocal)
            } catch (e) {
            }
        }
        if (!movesLocal || movesLocal.moves !== moves) {
            return false
        }
        return movesLocal.data
    },
    probsKeysStoreKey: {
        'area': 'areaProbsBoard',
        'options': 'optionsProbsBoard',
        'branch': 'branchProbsBoard'
    },
    //道具数据暂存
    probsDataStoreSet(moves, data, type) {
        let keyList = this.probsKeysStoreKey
        if (!type || !keyList[type]) return
        let key = keyList[type]
        let post = {
            moves: moves,
            data: data
        }
        let setData = {}
        setData[key] = JSON.stringify(post)
        this.setStoreItem(setData)
    },
    //道具本地数据获取
    async probsDataStoreGet(moves, type) {
        let keyList = this.probsKeysStoreKey
        if (!type || !keyList[type]) return
        let key = keyList[type]
        let movesLocal = store.state[key]
        if (movesLocal) {
            try {
                movesLocal = JSON.parse(movesLocal)
            } catch (e) {
            }
        }
        if (!movesLocal || movesLocal.moves !== moves) {
            return false
        }
        return movesLocal.data
    },
    //道具本地数据清空
    async probsDataStoreClear() {
        let list = this.probsKeysStoreKey
        let clearData = {}
        for (var i in list) {
            clearData[list[i]] = ''
        }
        this.removeStoreItem(clearData)
    },
    async deductPropb(type) {
        let opt = {
            url: `/items/${type}`,
            method: 'POST',
        }
        let res = await this.request('engine', opt)
        return res
    },
    parseAreaPlay(data) {
        try {
            data = JSON.parse(data)
        } catch (e) { }
        return data
    },
    async engineUndoForPlay() {
        if (!store.state.username) return
        this.playAction('tool', 'undo')
        let opt = {
            url: `/items/backmove/${store.state.username}`,
            method: 'POST',
        }
        let res = await this.request('engine', opt)
        return res
    },
    async engineAreaForPlay(moves, boardSize, api, level) {
        let res = await this.playValueGet(moves, boardSize, api, level)
        if (!res || res.code != 0) {
            let errorCheck = await this.probResponseCheck(res.code, 'area')
            if (errorCheck == 0) return this.errorHandle(res, 'area')
            if (errorCheck == 1) return this.engineAreaForPlay(moves, boardSize, api, level)
            if (errorCheck == 2) return false
        }
        res.data = this.parseAreaPlay(res.data)
        // this.playAction('tool', 'area')
        return res
    },
    async engineJudgeForPlay(moves, boardSize, api, level) {
        this.gameJudgeLoading = true
        boardSize = boardSize == undefined ? 19 : boardSize
        api = api || 'dcnn'
        level = level || 3000
        let url = `/${api}/judge`
        if (!store.state.username) url = `/dcnn/public/judge`
        let opt = {
            url: url,
            method: 'GET',
            data: {
                situation: moves,
                board_size: boardSize,
                level: level
            }
        }
        let res = await this.request('engine', opt)
        this.errorHandle(res, 'endgame')
        res.data = this.parseGameJudge(res.data)
        this.gameJudgeLoading = false
        return res
    },
    parseGameJudge(data) {
        try {
            data = JSON.parse(data)
        } catch (e) { }
        // if(!this.isObject(data)){
        //     try{
        //         data = data.split(',')
        //     }catch(e){}
        // }
        // if(!this.isObject(data)){
        //     try{
        //         data = data.split(' ')
        //     }catch(e){}
        // }
        return data
    },
    async engineJudgePlay(moves, boardSize, api, level) {
        let res = await this.engineJudgeForPlay(moves, boardSize, api, level)
        if (!res || res.code != 0) return res
        res.data = this.parseAreaPlay(res.data)
        return res
    },
    async engineBranchPlay(moves, boardSize, api, level) {
        this.branchLoading = true
        level = level || 3000
        api = api || 'dcnn'
        let opt = {
            url: `/${api}/variation`,
            method: 'GET',
            data: {
                situation: moves,
                board_size: boardSize,
                level: level
            }
        }
        let res
        let data = await this.probsDataStoreGet(moves, 'branch')
        res = data ? { code: 0, data: data, local: true } : await this.request('engine', opt)
        if (res && res.code == 0) this.probsDataStoreSet(moves, res.data, 'branch')


        // let res = await this.request('engine', opt)
        if (!res || res.code != 0) {
            let errorCheck = await this.probResponseCheck(res.code, 'variation')
            if (errorCheck == 0) return this.errorHandle(res, 'variation')
            if (errorCheck == 1) return this.engineBranchPlay(moves, boardSize, api, level)
            if (errorCheck == 2) return false
        }



        // this.errorHandle(res, 'variation')
        this.branchLoading = false
        if (!res || res.code != 0) return res
        try {
            res.data = res.data.split(',')
        } catch (e) { }

        // this.playAction('tool', 'branch')
        return res
    },
    async enginePropPlay(moves, boardSize, api, level) {
        this.propLoading = true
        api = api || 'dcnn'
        level = level || 3000
        let opt = {
            url: `/${api}/options`,
            method: 'GET',
            data: {
                situation: moves,
                board_size: boardSize,
                level: level
            }
        }
        let res
        let data = await this.probsDataStoreGet(moves, 'options')

        res = data ? { code: 0, data: data, local: true } : await this.request('engine', opt)
        if (res && res.code == 0) this.probsDataStoreSet(moves, res.data, 'options')
        if (!res || res.code != 0) {
            let errorCheck = await this.probResponseCheck(res.code, 'options')
            if (errorCheck == 0) return this.errorHandle(res, 'options')
            if (errorCheck == 1) return this.enginePropPlay(moves, boardSize, api, level)
            if (errorCheck == 2) return false
        }



        // this.errorHandle(res, 'options')
        this.propLoading = false
        if (!res || res.code != 0) return res
        try {
            res.data = res.data.split(',')
        } catch (e) { }
        this.playAction('tool', 'prop')
        return res
    },
    async undoPropPlay(propNum) {
        if (propNum <= 0) {
            let errorCheck = await this.probResponseCheck('7003', 'back_move')
            if (errorCheck == 1) return true
            if (errorCheck == 2) return false
        }
        return true
    },
    parsePlanList(list) {
        let data = [], type, j = 0, i = 0, listCopy = this.deepCopy(list), k = 0
        let config = false
        while (j <= list.length - 1) {
            type = list[j].planType
            i = j
            data.push({
                name: this.planType[type].name,
                planList: [],
            })
            data[data.length - 1].index = data.length - 1
            for (i = j; i < list.length; i++) {
                if (list[i].planType == type) {
                    if (list[i].available) {
                        list[i].available = {
                            active: true,
                            txt: '当前可用',
                            css: 'available',
                            txtCss: 'available'
                        }
                    } else {
                        let reason = this.planUnavailableReason(list[i].unavailableReason) || { type: 2, txt: '当前不可用' }
                        list[i].available = {
                            active: false,
                            txt: reason.txt,
                            // css: reason.type != 1 ? 'unavailable' : 'available',
                            css: 'unavailable',
                            type: reason.type,
                            txtCss: 'unavailable'
                        }
                    }
                    data[data.length - 1].planList.push(list[i])
                    data[data.length - 1].planList[data[data.length - 1].planList.length - 1].index = data[data.length - 1].planList.length - 1
                } else {
                    break
                }
            }
            j = i
        }
        return data
    },
    async planSet(id, komi) {
        if (!store.state.username) return false
        let data = { plan_id: id }
        // komi = 7.5

        if (komi !== undefined) {
            komi = Number(komi)
            komi = komi == 6.5 ? 6.5 : 7.5
            data['komi'] = komi
        }
        let options = {
            url: '/engines',
            timeout: 20000,
            data: data
        }
        let res = await this.request('engine', options)
        if (res && res.code == 0) {
            let options = {
                engine_id: res.data,
                planId: id,
                engine_komi: komi,
                device: 'web'
            }
            let r = await this.engineSet(options)
        } else {
            this.errorHandle(res, 'gpu_plans')
        }
        return res
        // .then(res => {
        //     this.$emit('confirmSet', {
        //         res: res,
        //         enginePlan: this.lists[this.indexP].planList[this.index]
        //     })
        // })
    },
    filterOpt(opt, min) {
        min = min || this.simuRateMin
        let options = [], index = 0, optSimuVal = [], lastOpt = [], tem
        for (var i in opt) {
            if (Number(opt[i].Proportion) < min) continue
            opt[i].index = index
            options.push(this.copy(opt[i]))
            index++
        }
        return options
    },
    filterBranch(opt, min) {
        min = min || this.simuRateMin
        let options = [], index = 0
        let color = this.now == 1 ? 'BLACK' : 'WHITE'
        for (var i in opt) {
            if (Number(opt[i].Proportion) < min) break
            if (opt[i].Color != color) opt[i].WinRate = 1 - opt[i].WinRate
            opt[i].index = index
            options.push(this.deepCopy(opt[i]))
            index++
        }
        return options
    },
    async userActivityListGet() {
        let options = {
            url: '/activities',
            timeout: 20000,
            method: 'get',
        }
        let res = await this.request('engine', options).then(res => res)
        return res
    },
    async userActivityAvailableGet() {
        if (!store.state.username) return false
        let options = {
            url: '/activities/available',
            timeout: 20000,
            method: 'get',
        }
        let res = await this.request('engine', options).then(res => res)
        if (this.noticeActivityAttr) this.noticeActivityAttr(res)
        return res
    },
    async activityRe(id) {
        let options = {
            url: `/activities/${id}/receive`,
            timeout: 20000,
            method: 'post',
            data: {
                activity_id: id
            }
        }
        let res = await this.request('engine', options).then(res => res)
        this.userActivityAvailableGet()
        return res
    },
    serverTimeFormat(obj) {
        let data = this.deepCopy(obj)
        // let y = obj.year, m = obj.month, d = obj.day
        // if(y < 10) y = '0' + y
        // if(m < 10) m = '0' + m
        // if(d < 10) d = '0' + d
        for (var i in data) {
            if (data[i] < 10) data[i] = '0' + data[i]
        }
        return data
    },
    serverTimeToTimestamp(data) {
        data = data || {}
        let date = data.date
        let time = data.time
        if (!date || !time) return
        let t = `${date.year}-${date.month}-${date.day} ${time.hour}:${time.minute}:${time.second}`
        let te = new Date(t)
        if (!te || isNaN(te.getFullYear())) return
        return parseInt(te.getTime() / 1000)
    },
    getRequestMsg(res, errKey) {
        return this.__ERRORMSGDEFINE.errorMsg[errKey][res.code] || this.__ERRORMSGDEFINE.errorMsg[errKey][res.msg] || this.__ERRORMSGDEFINE.errorMsg['main']['-1']
    },
    async getTool() {
        if (!store.state.username) return false
        let res = await this.userToolGet()
        if (res && res.code == 0) {
            this.userToolHandle(res.data)
        }
        return res
    },
    userToolHandle(data) {
        let s = { code: 1, errorMsg: 1, username: 1 }, tool = {}
        for (var i in data) {
            if (s[i]) continue
            tool[i] = data[i]
        }
        this.setStoreItem({
            tool: tool
        })
        this.tool = tool
        if (this.updateUserAttr) this.updateUserAttr()
    },
    async userToolGet() {
        let options = {
            url: `/items/${store.state.username}`,
            timeout: 20000,
            method: 'get',
        }
        let res = await this.request('engine', options).then(res => res)
        try {
            res.data = JSON.parse(res.data)
        } catch (e) { }
        return res
    },
    async userBonusGet() {
        let options = {
            url: `/items/bonus`,
            timeout: 20000,
            method: 'get',
        }
        let res = await this.request('engine', options).then(res => res)
        this.userBonusCheck()
        return res
    },
    MessageBoxCloseAll() {

    },
    AlertOpen(opt) {
        for (var i in this.alertConfig) {
            if (opt[i] != undefined) continue
            opt[i] = this.alertConfig[i]
        }
        MessageBox.alert(opt.message, opt.title, opt)
    },
    ConfirmOpen(opt) {
        for (var i in this.confirmConfig) {
            if (opt[i] != undefined) continue
            opt[i] = this.alertConfig[i]
        }
        return MessageBox.confirm(opt.message, opt.title, opt)
    },
    async bonusEverydayByMessage() {
        if (!store.state.username || !this.bonusEverydayObj) return
        let res = await this.userBonusGet()
        let d = true
        if (!res || res.code != 0 || !res.data || res.data == '' || !this.isObject(res.data)) {
            d = false
        } else {
            // this.bonusEverydayObj.bonus(res.data)
            this.MessageOpen({
                message: '签到成功！',
                type: 'success'
            })
        }
        return d
    },
    async bonusEverydayNew() {
        if (!store.state.username || !this.bonusEverydayObj) return
        let res = await this.userBonusGet()
        // res = {
        //     code: 0,
        //     data: {
        //         area_increment: 5,
        //         errorMsg: undefined,
        //         options_increment: 5,
        //         variation_increment: 5,
        //         back_move_increment: 5
        //     }
        // }
        let d = true
        if (!res || res.code != 0 || !res.data || res.data == '' || !this.isObject(res.data)) {
            d = false
        } else {
            this.bonusEverydayObj.bonus(res.data)
        }
        return d
    },
    async bonusEveryday() {
        if (!store.state.username || !this.bonusEverydayObj) return
        let res = await this.userBonusGet()

        try {
            res.data = JSON.parse(res.data)
        } catch (e) { }
        if (!res || res.code != 0 || !res.data || res.data == '' || !this.isObject(res.data)) {
            // res = {
            //     code: 0,
            //     area_increment: 5,
            //     errorMsg: undefined,
            //     options_increment: 5,
            //     variation_increment: 5
            // }
            return
        }
        let data = {}, config = this.bonusConfig, f = false, itemHtml = ''
        for (var i in res) {
            if (config[i] == undefined) continue
            if (Number(res[i]) <= 0) continue
            f = true
            itemHtml += `<p class="item">${config[i].name} * ${res[i]}</p>`
            data[i] = {
                name: config[i].name,
                value: res[i]
            }
        }
        if (!f) return
        let html = `<div class="bonus-box">
                        <h1 class="title">今日首次登录，送您：</h1>
                        ${itemHtml}
                    </div>`
        this.AlertOpen({
            message: html,
            dangerouslyUseHTMLString: true
        })
    },
    saveGameOptGet(opt) {
        let post = {}
        post.gamename = opt.gamename || ''
        post.pb = opt.pb || ''
        post.pw = opt.pw || ''
        post.move_num = isNaN(Number(opt.move_num)) ? 0 : Number(opt.move_num)
        post.handicap = isNaN(Number(opt.handicap)) ? 0 : Number(opt.handicap)
        post.komi = isNaN(Number(opt.komi)) ? 7.5 : Number(opt.komi)
        post.board_size = isNaN(Number(opt.board_size)) ? 19 : Number(opt.board_size)
        post.game_result = opt.game_result || ''
        post.game_type = isNaN(Number(opt.game_type)) ? 0 : Number(opt.game_type)
        post.game_type = opt.game_type || 0
        post.sgf = opt.sgf
        post.black_level = isNaN(Number(opt.black_level)) ? 0 : Number(opt.black_level)
        post.white_level = isNaN(Number(opt.white_level)) ? 0 : Number(opt.white_level)
        post.play_time = opt.play_time || this.getTimeNow()
        post.play_time = this.formatSgfDt(post.play_time)
        post.start_move_num = opt.start_move_num || 0
        // post.user_level = opt.user_level || store.state.userLevel || 0
        // post.ai_level = opt.ai_level || 0
        // post.color = opt.color || 1




        return post
    },
    formatSgfDt(data) {
        let d = new Date(data)

        return this.getTimeNow(d)
    },
    async engineSaveSgf(data) {
        data = this.saveGameOptGet(data)
        let opt = {
            url: `/games`,
            method: 'POST',
            data: data
        }
        let {sgf} = data
        let d = await this.sgfLengthCheck(sgf)
        if(!d) return false
        let res = await this.request('engine', opt)
        this.errorHandle(res, 'saveGame')
        return res
    },
    async saveSgfOpen(opt) {
        let res = await this.engineSaveSgf(opt)
        return res

    },
    audioStatusSet: {
        'play': false,
        'second': false,
        'status': false,
    },
    audioInit(elementPlay, elementSecond, elementStatus) {
        this.audio = elementPlay
        this.audioSecond = elementSecond
        this.audioStatus = elementStatus
        this.audio.addEventListener('ended', () => {
            this.audioStatusSet.play = false
        })
        this.audioSecond.addEventListener('ended', () => {
            this.audioStatusSet.second = false
        })
        this.audioStatus.addEventListener('ended', () => {
            this.audioStatusSet.status = false
        })
    },
    audioJarCon(type) {
        type = type || 'play'
        let jar = {
            'play': [],
            'second': ['play', 'status'],
            'status': ['play'],
        }
        let data = jar[type], f = true
        if (data == undefined) return f
        for (var i in data) {
            if (this.audioStatusSet[data[i]]) {
                f = false
                break
            }
        }
        // if(f) this.audioStatusSet[type] = true
        return f
    },
    audioPlay(audio, type) {
        type = type || 'play'
        if (!this.audioJarCon(type)) return
        for (var i in this.audioStatusSet) {
            if (i == type) this.audioStatusSet[i] = true
            else this.audioStatusSet[i] = false
        }
        audio = audio || this.audio
        audio.muted = false
        this.audio.pause()
        this.audioSecond.pause()
        this.audioStatus.pause()
        audio.play()
    },
    setPath(src, audio) {
        audio = audio || this.audio
        audio.setAttribute('src', src);
    },
    audioObj: {
        'play': 'audio',
        'stone': 'audio',
        'remove': 'audio',
        'read': 'audioSecond',
        'start': 'audioStatus',
        'last': 'audioStatus',
        'timeout': 'audioStatus',
        'gameStart': 'audio',
        'tool': 'audio',
        'result': 'audio',
        'volume': 'audio',
        'branch': 'audio',
        'branchMove': 'audio'
    },

    playAction(type, opt, params) {
        if (!this[`${type}Play`] || !this[this.audioObj[type]]) return
        if (store.state.voice != 1) return
        this[`${type}Play`](opt, params)
    },
    removePlay(num, params) {
        params = params || {}
        let timeout = 300
        if (params.timeout !== undefined) timeout = params.timeout
        setTimeout(() => {
            let data = this.voiceList['remove' + num] || this.voiceList['remove0']
            this.audio.pause()
            this.setPath(data.path)
            this.audioPlay()
        }, timeout);
    },
    stonePlay() {
        let data = this.voiceList['play']
        this.setPath(data.path)
        this.audioPlay()
    },
    readPlay(num) {
        let data = this.voiceList[`readSec${num}`] || null
        if (!data) return
        this.setPath(data.path, this.audioSecond)
        this.audioPlay(this.audioSecond, 'second')
    },
    timeoutPlay() {
        let data = this.voiceList['timeout'] || null
        if (!data) return
        this.setPath(data.path, this.audioStatus)
        this.audioPlay(this.audioStatus, 'status')
    },
    startPlay() {
        let data = this.voiceList['start'] || null
        if (!data) return
        this.setPath(data.path, this.audioStatus)
        this.audioPlay(this.audioStatus, 'status')
    },
    lastPlay(num) {
        num = num || ''
        let data = this.voiceList['last'] || null
        if (!data) return
        let path = data.path + num + '.wav'
        this.setPath(path, this.audioStatus)
        this.audioPlay(this.audioStatus, 'status')
    },
    gameStartPlay() {
        let data = this.voiceList['gameStart']
        this.setPath(data.path)
        this.audioPlay()
    },
    toolPlay(d) {
        let data = this.voiceList['tool']
        if (!data) return
        this.setPath(data.path + d + '.wav')
        this.audioPlay()
    },
    resultPlay(d) {
        let data = this.voiceList['result']
        if (!data) return
        this.setPath(data.path + d + '.wav')
        this.audioPlay()
    },
    volumePlay(d) {
        let data = this.voiceList['volume']
        this.setPath(data.path)
        this.audioPlay()
    },
    branchPlay(num) {
        let data = this.voiceList['branch' + num] || this.voiceList['branch1']
        this.setPath(data.path)
        this.audioPlay()
    },
    branchMovePlay() {
        let data = this.voiceList['branchMove']
        this.setPath(data.path)
        this.audioPlay()
    },
    countResult(data) {
        return (data.b - data.w) / 2 - data.komi / 2
    },
    countResultEngine(data) {
        return data.b - data.w - data.komi
    },
    async getSgfList(page, size, username, game_type) {
        username = username || store.state.username
        if (!username) return false
        let opt = {
            url: `/games/${username}`,
            method: 'GET',
            data: {
                page: page,
                size: size,
                game_type: game_type,
                username: username
            }
        }
        let res = await this.request('engine', opt)
        this.errorHandle(res, 'getSgfList')
        return res
    },
    async getSgfFavourite(page, size, username) {
        username = username || store.state.username
        if (!username) return false
        let opt = {
            url: `/games/${username}/favourite`,
            method: 'GET',
            data: {
                page: page,
                size: size,
                username: username
            }
        }
        let res = await this.request('engine', opt)
        this.errorHandle(res, 'getSgfList')
        return res
    },
    changenum(t) {
        let date = t.date, time = t.time
        for (var i in date) {
            if (date[i] < 10) date[i] = '0' + date[i]
        }
        for (var i in time) {
            if (time[i] < 10) time[i] = '0' + time[i]
        }
        return {
            date: date,
            time: time
        }
    },
    timeToTimestamp(time) {
        let t = this.deepCopy(time)
        if (this.isObject(time)) t = `${t.date.year}-${t.date.month}-${t.date.day} ${t.time.hour}:${t.time.minute}:${t.time.second}`
        // return ((new Date(t)).getTime()) / 1000
        return parseInt(((new Date(t)).getTime()) / 1000)
    },
    async favouriteSet(id, username) {
        username = username || store.state.username
        let opt = {
            url: `/games/${username}/favourite`,
            method: 'POST',
            data: {
                id: id,
                username: username
            }
        }
        let res = await this.request('engine', opt)
        this.errorHandle(res, 'favouriteSet')
        return res
    },
    async favouriteDelete(id, username) {
        username = username || store.state.username
        let opt = {
            url: `/games/${username}/favourite`,
            method: 'DELETE',
            data: {
                id: id,
                username: username
            }
        }
        let res = await this.request('engine', opt)
        this.errorHandle(res, 'favouriteSet')
        return res
    },
    async deleteSgf(id, username) {
        let res = await this.ConfirmOpen({
            message: '确定要删除棋谱吗？',
            center: true,
            confirmButtonText: '确定'
        }).then(() => {
            return this.deleteSgfAction(id, username)
        }).catch(() => {
            return false
        })
        return res
    },
    async deleteSgfAction(id, username) {
        username = username || store.state.username
        let opt = {
            url: `/games/${username}/${id}`,
            method: 'DELETE',
            data: {
                id: id,
                username: username
            }
        }
        let res = await this.request('engine', opt)
        this.errorHandle(res, 'deleteSgf')
        return res
    },
    async getSgfData(id, username) {
        username = username || store.state.username
        let opt = {
            url: `/games/${username}/${id}`,
            // url: `/games/${id}`,
            method: 'GET',
            data: {
                id: id,
                // username: username
            }
        }

        let res = await this.request('engine', opt)
        if(res && res.code == 0){
            let {data} = res
            let {sgf} = data
            let d = await this.sgfLengthCheck(sgf)
            if(!d) return false
        }
        this.errorHandle(res, 'gamesGet')
        return res
    },
    async sgfLengthCheck(moves){
        let res = await this._sgfUti.lengthCheck(moves)
        if(res.code != 0){
            this.errorHandler(res, null, {num: res.max, noTimeCheck: true})
            return false
        }
        return true
    },
    sgfLengthCheckSync(moves){
        let res = this._sgfUti.lengthCheckSync(moves)
        if(!res) return false
        if(res.code != 0){
            this.errorHandler(res, null, {num: res.max, noTimeCheck: true})
            return false
        }
        return true
    },
    parseResult(result) {
        result = this.parseResultString(result)
        let txt = this.deepCopy(this.resultTxt)
        if (txt[result]) return txt[result]
        let color = result.substring(0, 2)
        let num = result.substring(2, result.length)
        if (!txt[color]) return txt['N+R']
        txt[color].txt = `${txt[color].txt}${num}子`
        txt[color].winNum = num
        return txt[color]
    },
    resultWinLabel(label) {
        if (label.indexOf('黑') > -1 || label.indexOf('B') > -1 || label.indexOf('b') > -1) return 'b'
        if (label.indexOf('白') > -1 || label.indexOf('W') > -1 || label.indexOf('w') > -1) return 'w'
        return null
    },
    parseResultSelect(result) {
        result = this.deepCopy(result)
        // let txt = this.deepCopy(this.resultTxt)
        // if(txt[result]) return txt[result]
        let num = null
        result = this.parseResultString(result)
        if (result.indexOf('W+') > -1 || result.indexOf('B+') > -1) {
            num = Number(result.substring(2, result.length))
            if (!isNaN(num)) {
                result = result.substring(0, 2)
            }
        }
        let rtxt = this.resultSelect[0]
        let data = this.resultSelect
        if (result == '' || result == undefined || !result) return rtxt
        for (var i in data) {
            if (data[i].value == result || data[i].label == result) {
                rtxt = data[i]
                break
            }
        }
        if (num != null && !isNaN(num)) rtxt.num = num
        return rtxt
    },
    parseResultString(result) {
        if (!result) result = 'N+R'
        result = result || ''
        let reTem = result
        try {
            result = eval(result)
        } catch (e) { }
        result = result.replace(/\\/, '')
        let rex = /^(黑胜|白胜)/
        if (rex.test(result)) {
            let re = result.indexOf('黑胜') > -1 ? 'B+' : 'W+'
            result = result.replace('黑胜', '')
            result = result.replace('白胜', '')
            result = result.replace('子', '')
            try {
                result = eval(result)
            } catch (e) { }
            if (!isNaN(Number(result))) return re + result
        }
        let list = this.resultSelect
        let label = null
        for (var i in list) {
            if (list[i].num) continue
            if (list[i].value == result || list[i].label == result) {
                label = list[i].value
                break
            }
        }

        if (label !== null) return label
        // if(result.indexOf('黑中盘胜') > -1) return 'B+R'
        // if(result.indexOf('白中盘胜') > -1) return 'W+R'
        // if(result.indexOf('黑超时胜') > -1) return 'B+T'
        // if(result.indexOf('白超时胜') > -1) return 'W+T'
        return reTem
    },
    downloadFile(data, filename) {
        filename = filename || `golaxy${(new Date).valueOf()}`
        let blob = new Blob([data], { type: "text/plain;charset=utf-8" });
        FileServer(blob, filename);
    },
    errorNotice(txt) {
        let type = 'error'
        this.MessageOpen({
            type: type,
            message: txt,
            duration: 3000,
            showClose: true
        })
    },
    fileNameFilter(filename) {
        return filename.substring(0, filename.lastIndexOf('.'))
    },
    getDateNow() {
        let date = new Date()
        let year = date.getFullYear()
        let month = date.getMonth() + 1
        let day = date.getDate()
        return {
            day: day,
            month: month,
            year: year
        }
    },
    timeoutStop() {
        clearTimeout(this.timeoutClass)
    },
    timeoutGet(time) {
        this.timeoutStop()
        let promise = new Promise(res => {
            this.timeoutClass = setTimeout(() => {
                res()
            }, time);
        })
        return promise
    },
    ononline() {
        this.notifyOpen({
            title: this.__ERRORMSGDEFINE.errorMsg['main']['lineOn'],
            type: 'success',
            duration: 3000
        })
        if (this.ononlineCallback) this.ononlineCallback()
    },
    onoffline() {
        this.notifyOpen({
            title: this.__ERRORMSGDEFINE.errorMsg['main']['lineOff'],
            type: 'error',
            duration: 0
        })
        if (this.onofflineCallback) this.onofflineCallback()
    },
    getLanguage() {
        return store.state.language || 'chs'
    },
    async setLanguage(code) {
        this.setStoreItem({
            language: code
        })
        // VueCookies.set('language', code, 60)
        let res = await this.updateLanguage()
        return res
    },
    async updateLanguage() {
        let language = store.state.language || 'chs'
        // let language = VueCookies.get('language') || 'chs'
        // let path = `${process.env.BASE_URL}txt/${language}.json`
        let path = `${this.assetsUrl}/txt/${language}.json`
        let res = await this.getStaticData(path)
        this.language = res
        return res
    },
    setLabel(items) {
        this.setStoreItem(items)
    },
    async cardPlan() {
        let options = {
            url: '/store/cardplan',
            method: 'GET',
        }
        let res = await this.request('engine', options)
        this.errorHandle(res, 'cardplanGet')
        return res
    },
    async cardPlanRemain() {
        if (!store.state.username) return
        let options = {
            url: `/cardplan/remain/${store.state.username}`,
            method: 'GET',
        }
        let res = await this.request('engine', options)
        this.errorHandle(res, 'cardplanRemain')
        return res
    },
    async cardPlanSet(item, type) {
        if (!store.state.username) return
        item.url = type == 'normal' ? '/cardplan' : (type == 'extend' ? `/cardplan/extend/${store.state.username}` : `/cardplan/upgrade/${store.state.username}`)
        return this.cardPlanSetAction(item).then(res => {
            if (this.cardInfoInit) this.cardInfoInit()
            return res
        })
    },
    async cardPlanSetAction(item) {
        let options = {
            url: item.url,
            method: 'POST',
            data: {
                card_plan_id: item.id,
                yearly: item.cardType == 1 ? true : false
            }
        }
        let res = await this.request('engine', options)
        if (res && res.code == 0 && this.noticeFreeUpgrade) this.noticeFreeUpgrade()
        this.errorHandle(res, 'cardplanSet')
        return res
    },
    async cardPlanExtend(item) {
        if (!store.state.username) return
        let options = {
            url: `/cardplan/extend/${store.state.username}`,
            method: 'POST',
            data: {
                username: store.state.username,
                card_plan_id: item.id,
                yearly: item.cardType == 1 ? true : false
            }
        }
        let res = await this.request('engine', options)
        this.errorHandle(res, 'cardPlanExtend')
        return res
    },
    async cardPlanUserGet() {
        if (!store.state.username) return
        let options = {
            url: `/cardplan/${store.state.username}`,
            method: 'GET',
        }
        let res = await this.request('engine', options)
        this.errorHandle(res, 'cardPlanUserGet')
        return res
    },
    async storeBillsGet(items) {
        if (!store.state.username) return
        items = items || {}
        items.username = items.username || store.state.username
        let options = {
            url: `/bills/store/${store.state.username}`,
            method: 'GET',
            data: items
        }
        let res = await this.request('engine', options)
        this.errorHandle(res, 'storeBills')
        return res
    },
    async engineBillsGet(items) {
        if (!store.state.username) return
        items = items || {}
        items.username = items.username || store.state.username
        let options = {
            url: `/bills/${store.state.username}`,
            method: 'GET',
            data: items
        }
        let res = await this.request('engine', options)
        this.errorHandle(res, 'storeBills')
        return res
    },
    async rechargeBillsGet(items) {
        if (!store.state.username) return
        items = items || {}
        items.username = items.username || store.state.username
        let options = {
            url: `/topups/${store.state.username}`,
            method: 'GET',
            data: items
        }
        let res = await this.request('engine', options)
        this.errorHandle(res, 'storeBills')
        return res
    },
    async storeBillsCardGet(items) {
        if (!store.state.username) return
        items = items || {}
        items.username = items.username || store.state.username
        let options = {
            url: `/mall/record`,
            method: 'GET',
            data: items
        }
        let res = await this.request('engine', options)
        this.errorHandle(res, 'storeBills')
        return res
    },
    userLevelSet(level) {
        this.setStoreItem({
            userLevel: level
        })
    },
    async userLevelInit() {
        let res = await this.getUserLevel()
            .then(res => {
                if (res && res.code == 0) {
                    let items = {
                        userLevel: res.data.level,
                        goalDifference: res.data.goalDifference,
                        challengeLevel: res.data.challengeLevel,
                        highestLevel: res.data.highestLevel,
                        certificateDate: res.data.certificateDate,
                        certificate: res.data.certificate,
                        gameId: res.data.gameId
                    }
                    this.setStoreItem(items)
                    if (this.updateUserAttr) this.updateUserAttr()
                }
                return res
            })
        return res
    },
    async getUserLevel() {
        if (!store.state.username) return
        let options = {
            url: `/infos/level/${store.state.username}`,
            method: 'GET',
        }
        let res = await this.request('engine', options)
        this.errorHandle(res, 'getUserLevel')
        return res
    },
    getLevelByLabel(level) {
        // let l = this.computerLevel, val = null
        // for(var i in l){
        //     if(l[i].label == level) {
        //         val = this.deepCopy(l[i])
        //         break
        //     }
        // }
        // if(!val) val = {value: 0, label: '无等级', name: '无等级'}
        // return val
    },
    getLevel(level) {
        let l = this.computerLevel, val = null
        for (var i in l) {
            if (l[i].value == level) {
                val = this.deepCopy(l[i])
                break
            }
        }
        if (!val) val = { value: 0, label: '', name: '' }
        return val
    },
    getLevelNew(level) {
        let l = this.computerLevel, val = null
        for (var i in l) {
            if (l[i].value == level) {
                val = this.deepCopy(l[i])
                break
            }
            let label = l[i].saveName || l[i].label
            if (label == level) {
                val = this.deepCopy(l[i])
                break
            }
        }
        if (!val) val = { value: 0, label: '', name: '' }
        return val
    },
    async setChallengeLevel(level) {
        if (!store.state.username) return
        let options = {
            url: `/games/challenge/${store.state.username}`,
            method: 'POST',
            data: {
                level: level
            }
        }
        let res = await this.request('engine', options)
        return res
    },
    async reportPrice() {
        // if(!store.state.username) return
        let url = `/store/reports`
        if (store.state.username) url = `/store/reports/${store.state.username}`
        let options = {
            url: url,
            method: 'GET',
        }
        let res = await this.request('engine', options)
        this.errorHandle(res, 'reportPrice')
        return res
    },
    async reportCreate(game_id, report_id, moves, select) {
        // this.leConfirm.default.open({
        //     message: window.i18n.t('当前暂不可用，请稍后再试.....'),
        //     button: [
        //         {name: '确定'}
        //     ]
        // })
        // return false
        let data = {
            game_id: game_id,
            report_id: report_id,
            moves: moves
        }
        let res
        if (this.createReportCom) {
            res = await this.createReportCom.open({ gameId: game_id, reportId: report_id, moves: moves, select: select })
        } else {
            res = await this.reportCreateaction(game_id, report_id, moves)
        }
        return res
    },
    async reportCreateaction(game_id, report_id, moves) {
        let options = {
            url: `/games/report`,
            method: 'POST',
            data: {
                game_id: game_id,
                report_id: report_id,
                moves: moves
            }
        }
        let res = await this.request('engine', options)
        this.errorHandle(res, 'reportCreate')
        return res
    },
    async reportWatch(game_id, move_num) {
        let username = store.state.username
        // if (!username) return
        let data = {
            game_id: game_id,
            start_move_num: move_num,
            username: username
        }
        let options = {
            url: `/games/report/${username}/${game_id}`,
            method: 'GET',
            data: data
        }
        let res = await this.request('engine', options)
        // this.errorHandle(res, 'reportPrice')
        return res
    },
    async reportGet(game_id, start_move_num, end_move_num) {
        let username = store.state.username
        // if(!username) return
        let data = {
            game_id: game_id,
            start_move_num: start_move_num,
            end_move_num: end_move_num,
            username: username
        }
        let options = {
            url: `/games/report/${username}/${game_id}`,
            method: 'GET',
            data: data
        }
        let res = await this.request('engine', options)
        // this.errorHandle(res, 'reportPrice')
        return res
    },
    async reportList(page, size) {
        let username = store.state.username
        if (!username) return
        let data = {
            username: username,
            page: page,
            size: size
        }
        let options = {
            url: `/games/report/${username}`,
            method: 'GET',
            data: data
        }
        let res = await this.request('engine', options)
        this.errorHandle(res, 'reportList')
        return res
    },
    async publicMatchSgfList(page, size) {
        let username = '0086-golaxy_public'
        let game_type = 2
        let opt = {
            url: `/games/${username}`,
            method: 'GET',
            data: {
                page: page,
                size: size,
                game_type: game_type,
                username: username
            }
        }
        let res = await this.request('engine', opt)
        this.errorHandle(res, 'getSgfList')
        return res
    },


    async publicAISgfList(page, size) {
        let username = '0086-golaxy_public'
        let game_type = 3
        let opt = {
            url: `/games/${username}`,
            method: 'GET',
            data: {
                page: page,
                size: size,
                game_type: game_type,
                username: username
            }
        }
        let res = await this.request('engine', opt)
        this.errorHandle(res, 'getSgfList')
        return res
    },
    async publicPSSgfList(page, size) {
        let username = '0086-golaxy_public'
        let game_type = 4
        let opt = {
            url: `/games/${username}`,
            method: 'GET',
            data: {
                page: page,
                size: size,
                game_type: game_type,
                username: username
            }
        }
        let res = await this.request('engine', opt)
        this.errorHandle(res, 'getSgfList')
        return res
    },
    sortData(data, handleFun) {
        let qsort = fn => ([x, ...xn]) => x == null ? []
            : [
                ...qsort(fn)(xn.filter(a => fn(a, x))),
                x,
                ...qsort(fn)(xn.filter(a => !fn(a, x)))
            ]
        return qsort((a, b) => {
            return handleFun(a, b)
            // let vala = key == undefined ? a : a[key]
            // let valb = key == undefined ? b : b[key]
            // return type == 0 ? (Number(vala) < Number(valb)) : (Number(vala) > Number(valb))
        })(data)
    },
    async quitEngineAsk(type) {
        let txt = type == 'play' ? '停止使用以后对弈将不可用' : '停止使用以后分析数据将不可见，部分功能将不可用'
        let res = MessageBox.confirm('要认输吗？', {
            message: `<div class="engine-quit-confirm">
                            <h2>确定要停止吗？</h2>
                            <p>${txt}</p>
                        </div>`,
            dangerouslyUseHTMLString: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            center: true
        }).then(() => {
            return true
        }).catch(() => {
            return false
        })
        return res
    },
    //切换配置
    async planChange(id, komi) {
        if (!store.state.engine_id) return
        let data = {
            engine_id: store.state.engine_id,
            plan_id: id
        }
        if (komi) data['komi'] = komi
        let options = {
            url: '/engines/update/' + store.state.engine_id,
            method: 'POST',
            data: data
        }
        let res = await this.request('engine', options)
        this.errorHandle(res, 'planChange')
        return res
    },
    localDataCheck(key, data) {
        let d = this.getLocalItem(key)
        try {
            d = JSON.parse(d)
        } catch (e) { }
        if (!d) d = {}
        for (var i in data) {
            d[i] = data[i]
        }
        return d
    },
    async checkRouterChange(to, from, next) {
        if (this.routerCallback == null) return true
        return this.routerCallback(to, from, next).then(res => {
            return res
        })
    },
    pathCacheList: {
        '/engine/store/purchase/peripheral': 'storePeripheral'
    },
    routerBeforeEach(to, from, next) {
        return this.checkRouterChange(to, from, next).then(res => {
            let f = false
            if (!res) return
            let userInfo = this.getUserInfo();
            let path = this.getRouter(userInfo.status, to.path)
            if (!to.query.from) to.query.from = from.path
            if (!to.query.to) to.query.to = from.path
            let jump = false
            if (to.path == path) {
                f = to.path
                next()
                this.setStoreItem({
                    referrer: from.path
                })
                this.loginMaskClose()
                jump = true
            } else if (userInfo.status == 'guest') {
                let login = this.guestRouterCheck(to)
                if (!login) {
                    f = to.path
                    next()
                    this.setStoreItem({
                        referrer: from.path
                    })
                    this.loginMaskClose()
                    jump = true
                } else {
                    to.query.to = to.path
                    this.needLogin({
                        to: to.path,
                        from: from.path
                    })
                }

            } else {
                f = path
                next(path)
                this.setStoreItem({
                    referrer: from.path
                })
                this.loginMaskClose()
                jump = true
            }
            if (jump) this.probsDataStoreClear()
            return f
        })
    },
    loginMaskClose() {
        if (this.loginMask && this.loginMask.close) this.loginMask.close()
    },
    guestDisabledJump(path) {
        let guestDisabledPath = this.guestDisabledPath
        let f = false
        for (var i in guestDisabledPath) {
            try {
                if (path.indexOf(i) > -1) {
                    if (this.isString(guestDisabledPath[i])) {
                        f = guestDisabledPath[i]
                    }
                    break
                }
            } catch (e) { }
        }
        return f
    },
    guestRouterCheck(to) {
        let userInfo = this.getUserInfo();
        if (userInfo.status != 'guest') return false
        let guestDisabledPath = this.guestDisabledPath
        let f = false
        for (var i in guestDisabledPath) {
            try {
                if (to.path.indexOf(i) > -1) f = true
            } catch (e) { }
            if (f) break
        }
        if (!f) return f
        return this.loginPath
    },
    loginRouterCheck(to) {
        let userInfo = this.getUserInfo();
        if (userInfo.status != 'logged') return false
        let loggedDisabledPath = this.loggedDisabledPath
        let f = false
        for (var i in loggedDisabledPath) {
            try {
                if (to.path.indexOf(i) > -1) f = true
            } catch (e) { }
            if (f) break
        }
        if (!f) return f
        return true
    },
    async needLogin(query, opt) {
        query = query || {}
        return this.needLoginConfirm(opt).then(res => {
            if (!res) return false
            let label = res.label
            if (label == 0) {
                if (this.loginMask) this.loginMask.open(query)
                else this.jumpToPage(this.loginPath, query.from, query.to)
            } else if (label == 1) this.jumpToPage('/engine/register')
            return res
        })
    },
    async needLoginSync(opt) {
        let res = await this.needLoginConfirm(opt)
        if (!res) return false
        let label = res.label
        if (label == 1) this.jumpToPage('/engine/register')
        else if (label == 2) return false
        else {
            if (this.loginMask) return this.loginMask.open()
            else return false
        }
    },
    async needLoginConfirm(opt) {
        if (!this.leConfirm || !this.leConfirm.default) return true
        opt = opt || {}
        opt.message = opt.message || '该功能登录后可使用'
        return this.leConfirm.default.open({
            message: opt.message,
            button: [
                { name: '登录', label: 0, type: 'login-color-bcg' },
                { name: '免费注册', label: 1, type: 'register-color-bcg' },
                { name: '暂不登录', label: 2, type: 'no-login-bcg' },
            ]
        }).then(res => {
            return res
        })
    },
    createReportTimeCul(opt) {
        let num = opt.num, po = opt.po
        let s = 0.00026 * (Number(num) + 30) * po
        return Math.ceil(s / 60)
    },
    async userBonusCheck(opt) {
        if (!store.state.username) return
        let options = {
            url: '/items/bonus/check',
            method: 'GET',
        }
        opt = opt || {}
        for(var i in opt){
            options[i] = opt[i]
        }
        let res = await this.request('engine', options)
        if (this.noticeBonusAttr) this.noticeBonusAttr(res)
        return res
    },
    async reportArea(game_id, move_num) {
        // if(!store.state.username) return
        let options = {
            url: `/games/report/area/${store.state.username}/${game_id}`,
            method: 'GET',
            data: {
                game_id: game_id,
                username: store.state.username,
                move_num: move_num
            },
        }
        let res = await this.request('engine', options)
        this.errorHandle(res, 'reportArea')
        if (res && res.code == 0) {
            res.data = this.areaCompressParse(res.data)
        }
        return res
    },
    areaCompressChart: {
        'A': 0, 'B': 1, 'C': 2, 'D': 3, 'E': 4, 'F': 5, 'G': 6, 'H': 7, 'I': 8, 'J': 9, 'K': 10,
        'a': 0, 'b': 1, 'c': 2, 'd': 3, 'e': 4, 'f': 5, 'g': 6, 'h': 7, 'i': 8, 'j': 9, 'k': 10,
    },
    areaCompressParse(data, size) {
        size = size || 19
        data = data.replace('=', '')
        data = data.split(' ')
        data = data.filter(d => d)
        let norVal = data.shift(), speVal = data
        let i = 0, length = norVal.length
        let normal = []
        while (i < length) {
            i = Number(i)
            let v1 = norVal[i], v2 = norVal[i + 1]
            let rv = (this.areaCompressChart[v1] || 0) + '' + v2
            if (this.isLowerCase(v1)) rv = -Number(rv)
            rv = rv / 100
            normal.push(rv)
            i = 2 + i
        }
        i = 0
        let publicData = this.deepCopy(this[`stone${size}`])
        while (i < speVal.length) {
            i = Number(i)
            let coor = speVal[i], val = speVal[i + 1]
            coor = this.splitGtp(speVal[i])
            coor = this.coor2to1(coor.x, coor.y)
            publicData[coor] = val / 100
            i = 2 + i
        }
        normal = normal.concat(publicData)
        return normal
    },
    async getGameMeta(id) {
        // if(!store.state.username) return
        let options = {
            url: `/games/meta/${store.state.username}/${id}`,
            method: 'GET',
            data: {
                id: id,
                username: store.state.username
            },
        }
        let res = await this.request('engine', options)
        // this.errorHandle(res, 'gameMeta')
        return res
    },
    editGameOptGet(opt) {
        let post = {}
        post.id = opt.id
        post.gamename = opt.gamename || ''
        post.pb = opt.pb || ''
        post.pw = opt.pw || ''
        post.move_num = opt.move_num || 0
        post.handicap = isNaN(Number(opt.handicap)) ? 0 : Number(opt.handicap)
        post.komi = isNaN(Number(opt.komi)) ? 7.5 : Number(opt.komi)
        post.board_size = isNaN(Number(opt.board_size)) ? 19 : Number(opt.board_size)
        post.game_result = opt.game_result || ''
        // post.game_type = isNaN(Number(opt.game_type)) ? 0 : Number(opt.game_type)
        post.game_type = opt.game_type || 0
        post.black_level = isNaN(Number(opt.black_level)) ? 0 : Number(opt.black_level)
        post.white_level = isNaN(Number(opt.white_level)) ? 0 : Number(opt.white_level)
        post.play_time = opt.play_time || this.getTimeNow()
        post.play_time = this.formatSgfDt(post.play_time)
        return post

    },
    async gameSgfInfoEdit(opt) {
        if (!store.state.username) return
        let data = this.editGameOptGet(opt)
        let options = {
            url: `/games/metas`,
            method: 'POST',
            data: data,
        }
        let res = await this.request('engine', options)
        this.errorHandle(res, 'gameMetaEdit')
        return res
    },
    getTimeNow(date) {
        date = date || new Date();
        if (isNaN(date.getFullYear())) date = new Date();
        let seperator1 = "-";
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let strDate = date.getDate();
        let hour = date.getHours()
        let minute = date.getMinutes()
        let second = date.getSeconds()
        if (hour < 10) hour = '0' + hour
        if (minute < 10) minute = '0' + minute
        if (second < 10) second = '0' + second
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        let currentdate = year + seperator1 + month + seperator1 + strDate;
        currentdate = `${currentdate} ${hour}:${minute}:${second}`
        return currentdate;
    },

    getDateWithoutTime(date) {
        // if (this.isString(date)) date = new Date(date)
        // date = date || new Date();
        date = this.getCurrentChinaTime(date)
        if (isNaN(date.getFullYear())) date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        return { year: year, month: month, day: strDate }
    },
    getCurrentChinaTime(date) {
        if (this.isString(date)) date = new Date(date)
        else if (this.isObject(date)) {
            let t = this.deepCopy(date)
            if (this.isObject(t)) t = `${t.date.year}-${t.date.month}-${t.date.day} ${t.time.hour}:${t.time.minute}:${t.time.second}`
            date = new Date(t)
        }

        let ChinaTDelta = 8
        date = date || new Date();
        let tDelta = new Date().getTimezoneOffset() / 60
        tDelta = 0 - tDelta
        tDelta = ChinaTDelta - tDelta
        let timez = tDelta * 60 * 60 * 1000
        let realTime = date.getTime() + Number(timez)
        realTime = new Date(realTime)
        return realTime
    },
    getCurrentTime(date) {
        if (this.isString(date)) date = new Date(date)
        else if (this.isObject(date)) {
            let t = this.deepCopy(date)
            if (this.isObject(t)) t = `${t.date.year}/${t.date.month}/${t.date.day} ${t.time.hour}:${t.time.minute}:${t.time.second}`
            date = new Date(t)
        }
        if (isNaN(date.getFullYear())) date = new Date();
        return date
    },
    async connectPortsCreate(engineId) {
        engineId = engineId || store.state.engine_id
        if (!engineId) return false
        if (!store.state.username) return false
        let options = {
            url: `/ports/create`,
            method: 'GET',
            data: {
                engine_id: engineId
            },
        }
        let res = await this.request('engine', options)
        this.errorHandle(res, 'portsCreate')
        if (res && res.code == 0) {
            let r = await this.clineSet({ port: res.data })
        }
        return res
    },
    async connectPortsQuery(engineId) {
        engineId = engineId || store.state.engine_id
        if (!engineId) return false
        if (!store.state.username) return false
        let options = {
            url: `/ports/query`,
            method: 'GET',
            data: {
                engine_id: engineId
            },
        }
        let res = await this.request('engine', options)
        // this.errorHandle(res, 'portsQuery')
        return res
    },
    async connectPortsDelete(engineId) {
        engineId = engineId || store.state.engine_id
        if (!engineId) return false
        if (!store.state.username) return false
        let options = {
            url: `/ports/delete`,
            method: 'GET',
            data: {
                engine_id: engineId
            },
        }
        let res = await this.request('engine', options)
        if (res && res.code == 0) this.clineDelete()
        this.errorHandle(res, 'portsDelete')
        return res
    },
    async connectLineCheck(opt) {
        if (!store.state.engine_id) return
        let res = await this.connectPortsQuery()
        if (res && res.code == 0) {
            if (res.data == -1) return this.clineDelete()
            else return this.clineSet({ port: res.data })
            // return this.connectorLocalAttSet()
        }
    },
    async connectorLocalAttSet() {
        let data = this.getLocalItem(this.connectorLocalKey)
        if (!data) return
        data = data.split(' ')
        data = data.join(':')
        return this.sendEngineCode({
            command: 'connector_flag',
            params: data
        })
    },
    async clineSet(opt) {
        if (!opt.port) return
        let port = opt.port
        // let ip = opt.ip || this.clineIp
        let ip = this.clinetIpGet()
        let data = {
            clineIp: ip,
            clinePort: port
        }
        if (store.state.clineIp == data.clineIp && store.state.clinePort == data.clinePort) return
        this.setStoreItem(data)
        return this.connectorLocalAttSet()
    },
    clinetIpGet() {
        let host = window.location.host
        let list = this.clintHostList
        let data = null
        for(var i in list){
            if(host.indexOf(i) > -1){
                data = list[i]
                break
            }
        }
        if(!data) data = this.clineIp
        return data


        // let d = 'test'
        // if(host.indexOf('www') > -1) d = 'pro'
        // if(!this[`${d}ClintHost`]) return ''
        // return this[`${d}ClintHost`]
    },
    clineDelete() {
        let data = {
            clineIp: '',
            clinePort: ''
        }
        this.removeStoreItem(data)
    },
    savePlayGameType(type) {
        type = type || 0
        let data = store.state[this.localKeyPlayReady] || {}
        try {
            data = JSON.parse(data)
        } catch (e) { }
        data['gameType'] = type
        let saveData = {}
        saveData[this.localKeyPlayReady] = JSON.stringify(data)
        this.setItem(saveData)
    },
    //获取道具购买列表
    async getStoreListProps() {
        // if(!store.state.username) return false
        let options = {
            url: `/store/items/all`,
            method: 'GET',
        }
        let res = await this.request('engine', options)
        this.errorHandle(res, 'getStoreList')
        return res
    },
    async propBuy(id, username) {
        username = username || store.state.username
        let options = {
            url: `/items/purchase/${id}`,
            method: 'POST',
            data: {
                id: id,
                username: username
            }
        }
        let res = await this.request('engine', options)
        this.errorHandle(res, 'propBuy')
        return res
    },
    ToCDB(str) {
        let tmp = "";
        if (!str) return str
        for (var i = 0; i < str.length; i++) {
            if (str.charCodeAt(i) == 12288) {
                tmp += String.fromCharCode(str.charCodeAt(i) - 12256);
                continue;
            }
            if (str.charCodeAt(i) > 65280 && str.charCodeAt(i) < 65375) {
                tmp += String.fromCharCode(str.charCodeAt(i) - 65248);
            }
            else {
                tmp += String.fromCharCode(str.charCodeAt(i));
            }
        }
        return tmp
    },
    randomColor() {
        let n = Math.round(Math.random())
        n = n == 0 ? -1 : 1;
        this.color = n
        return n
    },
    randomNum(minNum, maxNum) {
        return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
    },
    saveGameStatus(gameType, opt) {
        opt = opt || {}
        opt.gameType = gameType
        this.setItem({
            'userGameStatus': JSON.stringify(opt)
        })
    },
    getGameStatus() {
        if (!store.state.username) return false
        let data = this.getLocalItem('userGameStatus')
        if (!data) return data
        try {
            data = JSON.parse(data)
        } catch (e) { }
        return data
    },
    clearGameStatus() {
        this.removeItem({
            'userGameStatus': ''
        })
    },
    getWinrateDecline() {
        if (store.state.planId == undefined) return null
        let data = this.deepCopy(this.winrateDecline)
        let key = data.minNumber[store.state.planId] ? store.state.planId : 'default'
        data.minNumber = data.minNumber[key].value
        return data
    },
    async engineUseInfo() {
        if (!store.state.engine_id) return false
        let options = {
            url: `/engines/info/${store.state.engine_id}`,
            method: 'GET',
            data: {
                engine_id: store.state.engine_id
            }
        }
        let res = await this.request('engine', options)
        return res
    },
    userLoginOutAfterFun(page, opt) {
        if (store.state.username) return false
        if (this[`${page}LoginOutAfter`]) return this[`${page}LoginOutAfter`](opt)
    },
    playLoginOutAfter(opt) {
        let reData = { fun: 'quitToReady' }
        return reData
        opt = opt || {}
        let type = opt.type || 'normal'
        if (type != 'normal') return reData
        let level = opt.AILevel
        let data = this.getLevel(level)
        if (data.login) return reData
        return null
    },
    _isMobile() {
        if (!navigator) return false
        let flag = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)
        return flag;
    },
    functionCheck(opt) {
        opt = opt || {}
        let list = this.functionStopList
        if (!list[opt.page]) return false
        let data = list[opt.page]
        let f = true
        for (var i in data) {
            if (data[i].name == opt.fun) {
                if (data[i].stop) f = false
                else f = true
                break
            }
        }
        return f
    },
    async havePropsGet() {
        let res = await this.userBonusCheck()
        if (res && res.code == 0 && res.data) return true
        res = await this.haveActivityByType('mixed')
        return res
    },
    async haveValueGet() {
        return this.haveActivityByType('value')
    },
    async haveReportGet() {
        return this.haveActivityByType(["ordinary_report", "precision_report", 'value'])
    },
    async haveActivityByType(type) {
        if (!type) return false
        if (this.isString(type)) type = [type]
        let res = await this.userActivityListGet()
        let f = false
        if (res && res.code == 0 && res.data && res.data.length) {
            let data = res.data
            for (var i in data) {
                if (data[i].status != 0) continue
                for (var j in type) {
                    if (data[i].bonusType == type[j]) {
                        // f = type[j]
                        f = data[i]
                        break
                    }
                }
                if (f) break
            }
        }
        return f
    },
    komiParse(komi) {
        let data = this.komi, rd = null
        for (var i in data) {
            if (data[i].value == komi) {
                rd = this.deepCopy(data[i])
                break
            }
        }
        if (rd == null) rd = { value: 7.5, label: '3又3/4子', name: '贴目：3又3/4子' }
        return rd
    },
    async photoInit() {
        // let path = `${process.env.BASE_URL}txt/photoList.json`
        let path = this.assetsUrl + '/txt/photoList.json'
        let res = await this.getStaticData(path)
        if (res) this.photoList = res
        return res
    },
    async nationalityInit() {
        // let path = `${process.env.BASE_URL}txt/photoList.json`
        let path = this.assetsUrl + '/txt/nationality.json'
        let res = await this.getStaticData(path)
        if (res) this.nationalityList = res
        return res
    },
    nationalityList: {},
    isGameSgf(data, p) {
        if (!this.isAIgameForSgf(data.gameType)) return
        let aiName = '星阵'
        if(!p){
            let pb = data.pb
            let pw = data.pw
            return pb == aiName || pw == aiName
        }
        return p == '星阵'
    },
    isAIgameForSgf(gameType) {
        let f = {
            '00': true,
            '01': true,
            '02': true,
            '03': true,
            '5': true,
        }
        return f[gameType]
    },
    getPhotoByName(name, c) {
        let path = `${this.assetsUrl}`
        if (!this.photoList || !this.photoList[name]) {
            // return `${path}/user_photo/${this.sgfPhoto.default}`
            return `${path}/user_photo/${this.userPhotoDefaultGet(c)}`
        }
        return `${path}/photo/${this.photoList[name]}`
    },
    isDefaultPhoto(p, c) {
        let path = `${this.assetsUrl}`
        // return p == `${path}/user_photo/${this.sgfPhoto.default}`
        return p == `${path}/user_photo/${this.userPhotoDefaultGet(c)}`
    },
    getPhoto(data, p, c) {
        let path = `${this.assetsUrl}`
        if (this.sgfPhoto[data.gameType] &&
            this.isObject(this.sgfPhoto[data.gameType]) &&
            this.sgfPhoto[data.gameType][p]) {
            return `${path}/img/${this.sgfPhoto[data.gameType][p]}`
        }
        if (this.photoList[p] &&
            this.sgfPhoto[data.gameType] &&
            this.isBool(this.sgfPhoto[data.gameType])) {
            return `${path}/photo/${this.photoList[p]}`
        }
        // return `${path}/user_photo/${this.sgfPhoto.default}`
        return `${path}/user_photo/${this.userPhotoDefaultGet(c)}`
    },
    getPhotoForSgfMeta(data, p, c, sgfUsernameDefine) {
        if (this.isGameSgf(data, p)) {
            let key = c == 'b' ? 'blackLevel' : 'whiteLevel'
            let path = `${this.assetsUrl}/img/`
            if (data[key] && data[key].AIicon) return path + data[key].AIicon
            if (!isNaN(Number(data[key]))) {
                let temLevel = this.getLevel(data[key])
                if (temLevel && temLevel.AIicon) return path + temLevel.AIicon
            }
        }
        if (this.isAIgameForSgf(data.gameType) && !this.isGameSgf(data, p)
            && (!sgfUsernameDefine || sgfUsernameDefine == store.state.username)) {
            let path = `${this.assetsUrl}/user_photo/`
            // let photo = store.state.photo || this.userPhotoDefault.path
            let photo = store.state.photo || this.userPhotoDefaultGet(c)
            return path + photo
        }
        return this.getPhoto(data, p, c)
    },
    getPhotoForSgfHub(){

    },
    userPhotoDefaultGet(c) {
        if (c === undefined) return this.userPhotoDefault.path
        let rc
        if (isNaN(Number(c)) && this.isString(c)) rc = (c == 'b' || c == 'black') ? 'black' : 'white'
        else {
            c = Number(c)
            rc = c == 1 ? 'black' : 'white'
        }
        if (!rc) return this.userPhotoDefault.path
        return this.userPhotoDefault[`${rc}Path`]
    },
    nationalityByName(name) {
        let list = this.nationalityList
        if (!list || !list[name]) return null
        return `${this.assetsUrl}/NF/${list[name]}.png`
    },
    nationalityByNameForTxt(name) {
        let list = this.nationalityList
        if (!list || !list[name]) return null
        let countryList = this.nationality
        let key = list[name].toLowerCase()
        if (!countryList[key]) return null
        return countryList[key].name
        // return `${this.assetsUrl}/NF/${list[name]}.png`
    },
    getAIname(data, p, c) {
        if (this.isGameSgf(data, p)) {
            let key = c == 'b' ? 'blackLevel' : 'whiteLevel'
            if (data[key]) {
                if (this.isObject(data[key]) && data[key].AIname) return data[key].AIname
                else if (!isNaN(Number(data[key]))) {
                    let tem = this.getLevel(data[key])
                    if (tem && tem.AIname) return tem.AIname
                }
            }
        }
        if (!p || p == '' || p == ' ') p = c == 'b' ? '黑方' : '白方'
        return p
    },
    discountsCul(discounts) {
        discounts = discounts * 100
        let a = parseInt((discounts % 100) / 10)
        let b = parseInt(discounts % 10)
        let data = []
        if (a != 0) data.push(a)
        if (b != 0) data.push(b)
        return data
    },
    async gameSearch(opt) {
        opt = opt || {}
        let key = opt.key || ''
        let page = opt.page || 0
        let size = opt.size || 10
        let type = opt.type || 'public'
        if (this[`${type}GameSearch`]) return this[`${type}GameSearch`](key, page, size)
        return false

    },
    async publicGameSearch(page, size, username, key) {
        let opt = {
            url: `/games/search/public`,
            method: 'GET',
            data: {
                key: key,
                page: page,
                size: size,
            }
        }
        let res = await this.request('engine', opt)
        this.errorHandle(res, 'gameSearch')
        return res
    },
    async userGameSearch(page, size, username, key) {
        if (!username) return
        let opt = {
            url: `/games/search/${store.state.username}`,
            method: 'GET',
            data: {
                username: store.state.username,
                key: key,
                page: page,
                size: size,
            }
        }
        let res = await this.request('engine', opt)
        this.errorHandle(res, 'gameSearch')
        return res
    },
    test() {
    },
    async finalJudgeCheck(situation, opt) {
        let res = await this.finalJudgeCheckRequest(situation, opt)
        let f = res.final
        if (res && res.final) {
            let resA = await this.leConfirm.default.open({
                message: window.i18n.t('对手提出终局数子'),
                button: [
                    { name: '同意', label: 1, type: 'confirm' },
                    { name: '不同意', label: 0, type: 'concel' },
                ]
            })
            if (!resA) f = 0
            else f = resA.label
        }
        return {
            final: f,
            data: res.data
        }
    },
    async finalJudgeCheckRequest(situation, opt) {
        opt = opt || {}
        let split = opt.split || this.finalJudgeWatch.split
        let minPos = opt.minPos || this.finalJudgeWatch.minPos
        situation = this.isString(situation) ? situation : situation.join(',')
        let data = situation.split(',')
        if (data.length < minPos) return false
        let splitNum = data.length - minPos
        splitNum = splitNum % 2 == 1 ? (splitNum - 1) : splitNum
        if (splitNum % split != 0) return false
        opt = opt || {}
        let boardSize = opt.boardSize || 19
        let levelAPI = opt.levelAPI || 'dcnn'
        let level = opt.level || 3000
        let fun = 'engineJudgePlay'
        if (store.state.engine_id) fun = 'engineJudge'
        let res = await this[fun](situation, boardSize, levelAPI, level)
        if (this.isObject(res.data) && res.data.owner) res.data = res.data.owner
        if (!this.isObject(res.data)) res.data = this.parseJudge(res.data)
        let f = false
        if (res && res.code == 0) {
            let rd = res.data, rds = false
            for (var i in rd) {
                if (rd[i] == 'U') {
                    rds = true
                    break
                }
            }
            f = !rds
        }
        return {
            final: f,
            data: res.data
        }
    },
    async paypalAction(data, price, id) {
        if (!store.state.username) return false
        let opt = {
            url: `/pay/paypal/notify`,
            method: 'POST',
            data: {
                orderID: data.orderID,
                username: store.state.username,
                pay: price,
                top_up_id: id
            }
        }
        let res = await this.request('engine', opt)
        return res
    },
    async rechargeList() {
        let opt = {
            url: '/pay/options',
            method: 'GET',
        }
        let res = await this.request('engine', opt)
        return res
    },
    async changeOptionsFormat(type) {
        if (!store.state.engine_id) return false
        type = type == undefined ? 1 : type
        let options = {
            command: 'flag',
            params: `reply_short_text_string:${type}`
        }
        let res = await this.sendEngineCode(options)
        return res
    },
    async engineInitParamsSet(komi, advantage) {
        return
        if (!store.state.engine_id) return false
        komi = komi === undefined ? 7.5 : komi
        await this.engineKomi(komi)
        let advantageVal = advantage === 0 ? 0 : 7.5 - komi
        await this.engineAdvantage(advantageVal)
        return this.engineClearMind()
    },
    async engineParamsGet() {
        return
        if (!store.state.engine_id || !store.state.username) return false
        let komiRes = await this.engineKomi()
        let komiAdvantage = await this.engineAdvantage()
        let data = {}
        if (komiRes && komiRes.code == 0) data.komi = komiRes.data
        if (komiAdvantage && komiAdvantage.code == 0) data.advantage = komiAdvantage.data
        return data
    },
    async engineClearMind() {
        if (!store.state.engine_id) return false
        let opt = {
            command: 'clear_mind',
            params: '',
            method: 'POST'
        }
        let res = await this.sendEngineCode(opt)
        return res
    },
    async engineAdvantage(advantage) {
        if (!store.state.engine_id) return false
        let params = `advantage`
        if (advantage !== undefined) params = `advantage:${advantage}`
        let options = {
            command: 'flag',
            params: params
        }
        let res = await this.sendEngineCode(options)
        return res
    },
    async userMessage() {
        if (!store.state.username) return false
        let opt = {
            url: `/notify/message/${store.state.username}`,
            method: 'GET',
        }
        let res = await this.request('engine', opt)
        return res
    },
    specPathHandle(path) {
        let list = this.mapPathList
        if (!list[path] || !list[path].path) return path
        let localData = list[path].localData
        if (list[path].fun && this[list[path].fun.f]) {
            this[list[path].fun.f](list[path].fun.params)
        }
        path = list[path].path

        if (localData) {
            this.setStoreItem(localData)
        }
        return path
    },
    async getStusSgf() {
        if (!store.state.username) return false
        let opt = {
            // url: `/teacher/infos/${store.state.username}`,
            url: `/course/teacher/students/${store.state.username}`,
            method: 'GET',
        }
        let res = await this.request('engine', opt)
        return res
    },
    async modifyNickname(nickname) {
        if (!store.state.username) return false
        let opt = {
            url: `/infos/nickname/${store.state.username}`,
            method: 'POST',
            data: {
                username: store.state.username,
                new_nickname: nickname
            }
        }
        let res = await this.request('engine', opt)
        this.errorHandle(res, 'modifyNickname')
        if (res && res.code == 0) {
            this.setItem({
                nickname: nickname
            })
            if (this.updateUserAttr) this.updateUserAttr()
        }
        return res
    },
    async modifyPhoto(photo) {
        if (!store.state.username) return false
        let opt = {
            url: `/infos/photo/${store.state.username}`,
            method: 'POST',
            data: {
                username: store.state.username,
                photo: photo
            }
        }
        let res = await this.request('engine', opt)
        this.errorHandle(res, 'modifyPhoto')
        if (res && res.code == 0) {
            this.setItem({
                photo: photo
            })
            if (this.updateUserAttr) this.updateUserAttr()
        }
        return res
    },
    getLocalDataByType(key) {
        let data = this.getLocalItem(key) || {}
        try {
            data = JSON.parse(data)
        } catch (e) {
            data = {}
        }
        return data
    },
    setLocalDataByType(page, items) {
        let data = this.getLocalItem(page) || {}
        try {
            data = JSON.parse(data)
        } catch (e) {
            data = {}
        }
        for (var i in items) {
            data[i] = items[i]
        }
        let saveData = {}
        saveData[page] = data
        this.setItem(saveData)
    },
    removeLocalDataByType(page, items) {
        let data = this.getLocalItem(page) || {}
        try {
            data = JSON.parse(data)
        } catch (e) {
            data = {}
        }
        for (var i in items) {
            delete data[i]
        }
        let saveData = {}
        saveData[page] = data
        this.setItem(saveData)
    },
    async branchSplit(moveNum, sgfId) {
        if (!store.state.username) return false
        let opt = {
            // url: `/games/branch/${store.state.username}`,
            url: `/games/report/branch/${store.state.username}/${sgfId}`,
            
            method: 'GET',
            data: {
                game_id: sgfId,
                move_num: moveNum
            }
        }
        let res = await this.request('engine', opt)
        if (res && res.code == 0) {
            try {
                res.data = JSON.parse(res.data)
            } catch (e) { }
            let f = false
            for (var i in res.data) {
                if (res.data[i] && Object.keys(res.data[i]).length && res.data[i].v) {
                    f = true
                    break
                }
            }
            if (!f) res.data = null
        }
        this.errorHandle(res, 'branchSplit')
        return res
    },
    cnzzCountFunction(fun) {
        if (!window.__czc) return
        let list = this.needCountFunction || {}
        // category,action,label
        let username = store.state.username || '游客'
        if (list[fun]) {
            window.__czc.push(['_trackEvent', list[fun].category, list[fun].action, list[fun].label, username])
        }
    },
    languageSet(label) {
        if (!window.i18n) return
        window.i18n.locale = '' + label
        localStorage.setItem('lang', label)
        // if(window._hmt){
        //     window._hmt.push(['_trackEvent', `${returnCitySN["cip"]+','+returnCitySN["cname"]+','+localData.getItem('username')}`, '语言', label === 'ko'? '韩语' : label === 'tc'? '繁体':label === 'zh'?'简体':'其他'])
        // }
        let lang = this.getLanguageObj(label)
        lang = lang || { name: '其他' }
        this.baiduLoagPushPlay('语言', lang.name)
        if (this.languageMixinSetup) this.languageMixinSetup()
        initData()
        this.errorMsg = this.__ERRORMSGDEFINE.errorMsg
        this.setItem({ lang: label })
        if (this.updateUserAttr) this.updateUserAttr()
    },
    getLanguageObj(label) {
        let list = this.langSelectItems
        let data = null
        for (var i in list) {
            if (label === list[i].label || label === list[i].name) {
                data = list[i]
                break
            }
        }
        return data
    },
    decimalsToFractional(decimals) {
        let intNum = parseInt(decimals)
        if (intNum <= 0) intNum = ''
        else {
            decimals = decimals % intNum
        }
        let formatDecimals = decimals.toFixed(2);
        let denominator = 100;//初始化分母
        let numerator = formatDecimals * 100;//初始化分子
        let bigger = 0;
        function recursion() {
            bigger = denominator > numerator ? denominator : numerator;
            for (let i = bigger; i > 1; i--) {
                if (Number.isInteger(numerator / i) && Number.isInteger(denominator / i)) {
                    numerator = numerator / i;
                    denominator = denominator / i;
                    recursion();
                }
            }
        }
        recursion();
        if(numerator == 0 || denominator == 0) return intNum ? intNum : 0
        if(intNum) intNum = `${intNum}又`
        return `${intNum}${numerator}/${denominator}`
    },
    async uploadFiles(file) {
        // if(!store.state.engine_id) return
        let options = {
            url: '/uploader',
            method: 'POST',
            uploadFile: true,
            file: file
        }
        let res = await this.request('CQ', options)
        return res
    },
    async uploadFilesNew(file) {
        // if(!store.state.engine_id) return
        let options = {
            url: '/recognize/check',
            method: 'POST',
            uploadFile: true,
            file: file
        }
        let res = await this.request('engine', options)
        return res
    },
    async getUploadHtml(file) {
        // if(!store.state.engine_id) return
        let options = {
            url: '/upload',
            method: 'get',
            uploadFile: true,
            file: file
        }
        let res = await this.request('CQ', options)
        return res
    },
    async getLiveList(dataOpt) {
        let options = {
            url: '/golives/all',
            // url: '/golives/cache/all',
            method: 'GET',
            header: {
                cookie: 'testcookie=assssscvw'
            }
        }
        let res = await this.request('engine', options)
        dataOpt = dataOpt || {}
        if (res && this.isObject(res) && !dataOpt.noneError) {
            this.errorHandle(res, 'liveList')
        }
        return res
    },
    async getLiveBoard(liveId) {
        let options = {
            url: `/golives/situation/${liveId}`,
            method: 'GET',
        }
        let res = await this.request('engine', options)
        this.errorHandle(res, 'liveBoard')
        return res
    },
    async getLiveBoardCache(liveId) {
        let options = {
            url: `/golives/cache/situation/${liveId}`,
            method: 'GET',
        }
        let res = await this.request('engine', options)
        this.errorHandle(res, 'liveBoard')
        return res
    },
    async getLiveBoardSingle(liveId, begin_move_num, end_move_num) {
        begin_move_num = begin_move_num || 0
        end_move_num = (end_move_num === undefined || end_move_num === null) ? begin_move_num : end_move_num
        let options = {
            // url: `/golives/cache/base/${liveId}`,
            url: `/golives/base/${liveId}`,
            method: 'GET',
            data: {
                live_id: liveId,
                begin_move_num: begin_move_num,
                end_move_num: end_move_num
            }
        }
        let res = await this.request('engine', options)
        this.errorHandle(res, 'liveBoard')
        return res
    },
    async areaLiveData(liveId, moveNum) {
        let options = {
            // url: `/golives/cache/area/${liveId}`,
            url: `/golives/area/${liveId}`,
            method: 'GET',
            data: {
                live_id: liveId,
                move_num: moveNum,
            }
        }
        let res = await this.request('engine', options)
        this.errorHandle(res, 'liveBoard')
        return res
    },
    async splitBranchLiveData(liveId, moveNum) {
        let options = {
            // url: `/golives/cache/branch/${liveId}`,
            url: `/golives/branch/${liveId}`,
            method: 'GET',
            data: {
                live_id: liveId,
                move_num: moveNum,
            }
        }
        let res = await this.request('engine', options)
        this.errorHandle(res, 'liveBoard')
        return res
    },
    async getLiveWinrate(liveId, begin_move_num, end_move_num) {
        begin_move_num = begin_move_num || 0
        let opt = {}
        opt.live_id = liveId
        opt.begin_move_num = begin_move_num
        if (end_move_num !== undefined && end_move_num != null) opt.end_move_num = end_move_num
        let options = {
            // url: `/golives/cache/winrates/${liveId}`,
            url: `/golives/winrates/${liveId}`,
            method: 'GET',
            data: opt
        }
        let res = await this.request('engine', options)
        return res
    },
    async getLiveData(liveId, moveNum) {
        let options = {
            url: `/golives/situation/${liveId}`,
            method: 'GET',
        }
        let res = await this.request('engine', options)
        this.errorHandle(res, 'liveBoard')
        return res
    },
    async getLiveInfo(liveId) {
        let options = {
            url: `/golives/${liveId}`,
            method: 'GET',
        }
        let res = await this.request('engine', options)
        this.errorHandle(res, 'liveBoard')
        return res
    },
    async getLiveHistory(page, size) {
        let options = {
            url: `/golives/history`,
            method: 'GET',
            data: {
                page: page,
                size: size
            }
        }
        let res = await this.request('engine', options)
        this.errorHandle(res, 'liveBoard')
        return res
    },
    async setLiveMoves(liveId, moves) {
        let options = {
            url: `/admin/situation`,
            method: 'GET',
            data: {
                liveId: liveId,
                moves: moves
            }
        }
        let res = await this.request('engine', options)
        return res
    },
    async getLivesData(liveId, moveNum) {
        if (liveId == undefined) return false
        let options = {
            url: `/golives/data/${liveId}`,
            method: 'GET',
            data: {
                live_id: liveId,
                move_num: moveNum
            }
        }
        let res = await this.request('engine', options)
        // this.errorHandle(res, 'liveData')
        return res
    },
    async get_YIKE_live_list() {
        if (!store.state.username) return
        let options = {
            url: `/yike/golives`,
            method: 'GET',
        }
        let res = await this.request('engine', options)
        if (res && res.code == 0) {
            try {
                res.data = JSON.parse(res.data)
            } catch (e) { }
        }
        this.errorHandle(res, 'liveData')
        return res
    },
    createLiveParamsCheck(opt) {
        let nesData = ['live_id', 'name', 'pb', 'pw', 'start_time', 'po', 'gpu_plan']
        let f = true
        for (var i in nesData) {
            if (opt[nesData[i]] == undefined) {
                f = false
                break
            }
        }

        return f
    },
    async create_YIKE_live(liveId, opt) {
        if (!store.state.username) return
        if (!this.createLiveParamsCheck(opt)) return false
        let options = {
            url: `/yike/golives/active/${liveId}`,
            method: 'POST',
            data: opt
        }
        let res = await this.request('engine', options)
        this.errorHandle(res, 'liveData')
        return res
    },
    async updateLiveInfo(liveId, opt) {
        if (!store.state.username) return
        if (!this.createLiveParamsCheck(opt)) return false
        let options = {
            url: `/yike/golives/update/${liveId}`,
            method: 'POST',
            data: opt
        }
        let res = await this.request('engine', options)
        this.errorHandle(res, 'liveData')
        return res
    },
    async liveWinrateNew(liveId, begin_move_num, end_move_num) {
        begin_move_num = begin_move_num || 0
        let opt = {}
        opt.live_id = liveId
        opt.begin_move_num = begin_move_num
        if (end_move_num !== undefined && end_move_num != null) opt.end_move_num = end_move_num
        let options = {
            url: `/golives/cache/winrates/${liveId}`,
            method: 'GET',
            data: opt
        }
        let res = await this.request('engine', options)
        return res
    },
    roleFunList: {
        new_user: ['liveManage'],
        user: ['liveManage'],
        vip: ['liveManage'],
        tester: []
    },
    actionFunByRole(role, fun) {
        let list = null
        let roleFunList = this.roleFunList
        for (var i in roleFunList) {
            if (role.indexOf(i) != -1) {
                list = roleFunList[i]
                break
            }
        }
        if (!list) return false
        let f = true
        for (i in list) {
            if (list[i] == fun) {
                f = false
                break
            }
        }
        return f
    },
    async stopLive(liveId, result) {
        if (!store.state.username) return
        if (!this.actionFunByRole(store.state.role, 'liveManage')) return
        let options = {
            url: `/yike/golives/delete/${liveId}`,
            method: 'POST',
            data: {
                live_id: liveId,
                result: result
            }
        }
        let res = await this.request('engine', options)
        this.errorHandle(res, 'liveManage')
        return res
    },
    async removeLive(liveId) {
        if (!store.state.username) return
        if (!this.actionFunByRole(store.state.role, 'liveManage')) return
        let options = {
            // url: `/yike/golives/remove/${liveId}`,
            url: `/yike/golives/remove/${liveId}`,
            method: 'POST',
            data: {
                live_id: liveId,
            }
        }
        let res = await this.request('engine', options)
        this.errorHandle(res, 'liveManage')
        return res
    },
    async webMoveStart(color, num) {
        if (!store.state.engine_id) return false
        let re = this.resendNum
        let options = {
            command: 'webmove',
            params: `${color}`,
            timeout: 0,
            // get_moves: true
        }
        let res = await this.sendEngineCode(options)
        if (!res || res.code != 0) {
            if (num < re) {
                num++
                return this.webMoveStart(num)
            }
        }
        this.errorHandle(res, 'genmove')
        return res
    },
    async forceMove(num) {
        if (!store.state.engine_id) return false
        num = num || 0
        let re = this.resendNum
        let options = {
            command: 'force_move',
        }
        let res = await this.sendEngineCode(options)
        if (!res || res.code != 0) {
            if (num < re) {
                num++
                return this.forceMove(num)
            }
        }
        this.errorHandle(res, 'genmove')
        return res
    },
    async getUserTrainScore(username, type, level) {
        let post = {
            type: type,
            level: level
        }
        if (username) post.username = username
        let options = {
            url: `/subject/info`,
            method: 'GET',
            data: {
                username: username,
                type: type,
                level: level
            }
        }
        let res = await this.request('engine', options)
        this.errorHandle(res, 'training Info')
        return res
    },
    async getTrainingGame(id) {
        let options = {
            url: `/subject`,
            method: 'GET',
            data: {
                id: id
            }
        }
        let res = await this.request('engine', options)
        this.errorHandle(res, 'training Info')
        return res
    },
    async trainingJudge(opt) {
        opt = opt || {}
        let index = opt.index, id = opt.id, moves = opt.moves, moveNum = opt.moveNum
        if (id == undefined || index == undefined) return
        if (!store.state.username) return
        let options = {
            url: `/subject/judge`,
            method: 'GET',
            data: {
                id: id,
                index: index,
                moves: moves,
                move_num: moveNum
            }
        }
        let res = await this.request('engine', options)
        this.errorHandle(res, 'training judge')
        return res
    },
    async startAnalyseOpen() {
        if (!this.startAnalyse) return false
        let res = await this.startAnalyse.open()
        return res
    },
    async liveEngineStatus(liveId) {
        let options = {
            url: `/admin/golives/engine/${liveId}`,
            method: 'GET',
        }
        let res = await this.request('engine', options)
        return res
    },
    async createTestLive() {
        let options = {
            url: `/admin/start`,
            method: 'GET',
        }
        let res = await this.request('engine', options)
        this.errorHandle(res, 'training Info')
        return res
    },
    getUserColor00(moves) {
        try {
            moves = moves.split(',')
        } catch (e) { }
        return (moves.length % 2 == 0) ? 1 : -1
    },
    async getClassList() {
        return await this.request('class', {
            url: '/course/all',
            method: 'GET',
        }).then((res) => {
            return res
        })
    },
    async courseVideoList() {
        let res = await this.request('class', {
            url: '/course/media/chapter',
            method: 'GET',
        })
        this.errorHandle(res, 'course pay')
        return res
    },
    async getTeacher(id) {
        return await this.request('MT', {
            url: `/teacher/${id}`,
            method: 'GET'
        }).then((res) => {
            return res
        })
    },
    async getCourse(id) {
        return await this.request('class', {
            url: `/course/${id}`,
            method: 'GET'
        }).then((res) => {
            return res
        })
    },
    async prepay(data) {
        return await this.request('MT', {
            url: '/course',
            method: 'POST',
            data: {
                course_id: data.course_id,
                teacher_id: data.teacher_id,
                duration: data.duration,
            },
        }).then((res) => {
            return res
        })
    },
    async coursePay(courseId, teacherId, duration, phone) {
        let res = await this.request('class', {
            url: '/course',
            method: 'POST',
            data: {
                course_id: courseId,
                teacher_id: teacherId,
                duration: duration,
                phone: phone
            },
        })
        this.errorHandle(res, 'course pay')
        return res
    },
    async getroomlists() {
        return await this.request('MT', {
            url: '/classroom/lists',
            method: 'GET',
        }).then((res) => {
            return res
        })
    },
    async classroomLogin(classroomId, password) {
        return await this.request('MT', {
            url: '/classroom/login',
            method: 'POST',
            data: {
                classroom_id: classroomId,
                password: password
            }
        }).then((res) => {
            return res
        })
    },
    async getAllAction(data) {
        return await this.request('socket', {
            url: `/websocket/server/${data.id}`,
            method: 'GET',
            headers: {
                Connection: 'Upgrade',
                Upgrade: 'websocket'
            }
        }).then((res) => {
            return res
        })
    },
    async getRoomInfo(data) {
        return await this.request('MT', {
            url: '/classroom/details',
            method: 'GET',
            data: {
                classroom_id: data.id
            }
        }).then((res) => {
            return res
        })
    },
    async quitClassroom(data) {
        return await this.request('MT', {
            url: '/classroom/logout',
            method: 'POST',
            data: {
                classroom_id: data.id
            }
        }).then((res) => {
            return res
        })
    },
    async getTeacherPhoto(data) {
        return await this.request('engine', {
            url: '/infos/photo',
            method: 'GET',
            data: {
                username: data
            }
        }).then((res) => {
            return res
        })
    },
    async createRoom(classroomName, adminPassword, userPassword, beginTime, endTime, description) {
        return await this.request('MT', {
            url: '/classroom/create',
            method: 'POST',
            data: {
                classroomName: classroomName,
                adminPassword: adminPassword,
                userPassword: userPassword,
                beginTime: beginTime,
                endTime: endTime,
                description: description
            }
        }).then((res) => {
            return res
        })
    },
    async commentMsgGet(liveId, lastId) {
        // liveId = 47116
        let data = {
            // lastMessageId: lastId,
            liveId: liveId,
            id: lastId
        }
        if (lastId == undefined) {
            // data['lastMessageId'] = ''
            data['id'] = 1
        }
        // if(lastId == undefined) delete data['lastMessageId']
        let options = {
            url: `/syncChatMessage/${liveId}`,
            method: 'GET',
            data: data
        }
        // let res = await this.request('comment', options)
        let res = await this.request('engine', options)
        try {
            res.data = JSON.parse(res.data)
        } catch (e) { }
        // this.errorHandle(res, 'training Info')
        return res
    },
    async sendCommentMessage(liveId, message, nickname) {
        nickname = nickname || store.state.nickname
        // liveId = 47116
        let options = {
            url: `/addChatMessage/${liveId}`,
            method: 'POST',
            data: {
                message: message,
                liveId: liveId,
                nickname: nickname
            }
        }
        // let res = await this.request('comment', options)
        let res = await this.request('engine', options)
        // this.errorHandle(res, 'training Info')
        return res
    },
    async getSaceBoardFolder(username) {
        username = username || store.state.username
        if (!username) return false
        let options = {
            url: `/situations/folders/${username}`,
            method: 'GET',
        }
        let res = await this.request('engine', options)
        this.errorHandle(res, 'save board folder')
        return res
    },
    async saveSaceBoardData(moves, folder, name, engineId) {
        engineId = engineId || store.state.engine_id
        if (!engineId) return false
        let options = {
            url: `/situations`,
            method: 'POST',
            data: {
                moves: moves,
                engine_id: engineId,
                folder: folder,
                name: name
            }
        }
        let res = await this.request('engine', options)
        this.errorHandle(res, 'save board save')
        return res
    },
    engineSgfNameGet(name) {
        // return name == 'default' ? '默认盘面' : name
        return name == '默认' ? true : false
    },
    async getEngineSgfByFolder(folder, username) {
        username = store.state.username
        if (!username || !folder) return false
        let options = {
            url: `/situations/${username}/${folder}`,
            method: 'GET',
            data: {
                username: username,
                folder: folder,
            }
        }
        let res = await this.request('engine', options)
        this.errorHandle(res, 'save board get sgf')
        return res
    },
    async openSgfEngineBoard(id) {
        if (id == undefined) return
        let options = {
            url: `/situations/${id}`,
            method: 'GET',
            data: {
                id: id,
            }
        }
        let res = await this.request('engine', options)
        this.errorHandle(res, 'save board get data')
        return res
    },
    async deleteSgfEngineBoard(id) {
        let opt = {
            url: `/situations/delete`,
            method: 'POST',
            data: {
                id: id,
            }
        }
        let res = await this.request('engine', opt)
        this.errorHandle(res, 'save board get delete')
        return res
    },
    async createStiustionFolder(name) {
        if (!store.state.username) return
        let opt = {
            url: `/situations/folder`,
            method: 'POST',
            data: {
                name: name,
            }
        }
        let res = await this.request('engine', opt)
        this.errorHandle(res, 'save board create folder')
        return res
    },
    async deleteSitFolder(name) {
        if (!store.state.username) return
        let opt = {
            url: `/situations/folder/delete`,
            method: 'POST',
            data: {
                name: name,
            }
        }
        let res = await this.request('engine', opt)
        this.errorHandle(res, 'save board delete folder')
        return res
    },
    async classListGet() {
        let opt = {
            url: `/classroom/lists`,
            method: 'GET',
        }
        let res = await this.request('class', opt)
        this.errorHandle(res, 'class')
        return res
    },
    async createClass(params) {
        let opt = {
            url: `/classroom/create`,
            method: 'POST',
            data: params
        }
        let res = await this.request('class', opt)
        this.errorHandle(res, 'class')
        return res
    },
    async deleteClass(id, psw) {
        let opt = {
            url: `/classroom/delete`,
            method: 'DELETE',
            data: {
                classroom_id: id,
                admin_password: psw
            }
        }
        let res = await this.request('class', opt)
        this.errorHandle(res, 'class')
        return res
    },
    async loginClass(id, psw) {
        let opt = {
            url: `/classroom/login`,
            method: 'POST',
            data: {
                classroom_id: id,
                password: psw
            }
        }
        let res = await this.request('class', opt)
        this.errorHandle(res, 'class')
        return res
    },
    async logoutClass(id) {
        let opt = {
            url: `/classroom/logout`,
            method: 'POST',
            data: {
                classroom_id: id,
            }
        }
        let res = await this.request('class', opt)
        this.errorHandle(res, 'class')
        return res
    },
    async infoClass(id) {
        let opt = {
            url: `/classroom/details`,
            method: 'GET',
            data: {
                classroom_id: id,
            }
        }
        let res = await this.request('class', opt)
        this.errorHandle(res, 'class')
        return res
    },
    engineIsAvailableCheck() {
        if (!store.state.engine_id) return true
        let device = store.state.engine_device || 'web'
        let f = true
        if (device != 'web') {
            f = false
        }
        return f
    },
    engineIsAvailable() {
        let f = this.engineIsAvailableCheck()
        if (!f) {
            if (this.leConfirm && this.leConfirm.default) {
                this.leConfirm.default.open({
                    message: `${window.i18n.t('已有其他设备开启研究')}，${window.i18n.t('停止后才可使用')}`,
                    button: [
                        { name: '确定' }
                    ]
                })
            }
        }
        return f
    },
    deltaClass(delta, now) {
        delta = Number(delta)
        let color
        if (now == 1 && delta > 0 || now == -1 && delta < 0) color = 'b'
        if (now == -1 && delta > 0 || now == 1 && delta < 0) color = 'w'
        let css = `${color} `
        // let list = [
        //     {val: 0.1, css: 'd0-1'},
        //     {val: 0.2, css: 'd0-2'},
        //     {val: 0.5, css: 'd0-5'},
        //     {val: 1, css: 'd1'},
        //     {val: 2, css: 'd2'},
        //     {val: 4, css: 'd4'},
        //     {val: 8, css: 'd8'},
        //     {val: 16, css: 'd16'},
        //     {val: 32, css: 'd32'},
        //     {val: 64, css: 'd64'},
        //     {val: 128, css: 'd128'},
        //     {val: 256, css: 'd256'},
        // ]
        // delta = Math.abs(delta)
        // for(var i in list){
        //     if(delta <= list[i].val){
        //         css += list[i].css
        //         break
        //     }
        // }
        return css
    },
    deltaWidth(delta) {
        delta = Math.abs(delta)
        if (delta < 1) delta = 1
        let max = 4.8, min = 1.2
        let k = max / Math.log(360)
        let width = Math.log(delta) * k + min
        // if(width < min) width = min
        if (width > max + min) width = max + min
        return {
            width: `${width}rem`
        }
    },
    //update class user role
    classAdminUpdate(data) {
        this.setStoreItem({
            classAdmin: data
        })
        this.updateUserAttr()
    },
    baiduLoagPushPlay(type, label) {
        type = type || '自由对弈'
        this.baiduLoagPush(null, type, label)
    },
    baiduLoagPush(type, operate, label) {
        if (window._hmt) {
            let username = store.state.username ? '注册用户' : '游客'
            operate = operate || []
            type = type || []
            if (!this.isArray(type)) type = [type]
            if (!this.isArray(operate)) operate = [operate]
            if (!this.isArray(label)) label = [label]
            // type = type.join(',')
            // type = `${username}, ${type}` 
            type = username
            operate = operate.join(',')
            label = label.join(',')
            window._hmt.push([
                '_trackEvent',
                type,
                operate,
                label
            ])
        }
    },
    async scanBoardCheck(file) {
        // if(!store.state.engine_id) return
        let options = {
            url: '/recognize/check',
            method: 'post',
            uploadFile: true,
            file: file
        }
        let res = await this.request('engine', options)
        this.errorHandle(res, 'scan board')
        try {
            res.data = JSON.parse(res.data)
        } catch (e) { }
        return res
    },
    async scanBoardCheckIdentify(boardId, coors) {
        let options = {
            url: '/recognize/identify',
            method: 'post',
            data: {
                boardid: boardId,
                corners: coors
            }
        }
        let res = await this.request('engine', options)
        this.errorHandle(res, 'scan board')
        try {
            res.data = JSON.parse(res.data)
        } catch (e) { }
        return res
    },
    async uploadFileList(list) {
        let options = {
            url: '/files/upload',
            method: 'POST',
            uploadFile: true,
            file: list
        }
        let res = await this.request('class', options)
        this.errorHandle(res, 'uploadFile')
        return res
    },
    async createGroup(opt) {
        let defaultData = {
            school_name: '',
            school_address: '',
            teacher_number: '',
            student_number: '',
            admin_name: '',
            admin_contact: '',
            files: '',
            // ver_code: '',
            phone_num: '',
            sm_code: ''
        }
        let data = {}
        for (var i in defaultData) {
            if (opt[i] !== undefined) data[i] = opt[i]
        }
        let options = {
            url: '/school',
            method: 'post',
            data: opt
        }
        let res = await this.request('class', options)
        this.errorHandle(res, 'group')
        try {
            res.data = JSON.parse(res.data)
        } catch (e) { }
        return res
    },
    async sendSmsCodeLive(area, number) {
        let options = {
            url: '/school/sms/code',
            data: {
                phone_num: number,
                area: area
            },
            method: 'GET',
        }
        let res = await this.request('class', options)
        this.errorHandle(res, 'group')
        return res
    },
    async getUserGroup() {
        if (!store.state.username) return
        let options = {
            url: '/school/account',
            method: 'GET',
        }
        let res = await this.request('class', options)
        this.errorHandle(res, 'group')
        return res
    },
    async searchGroup(key) {
        if (!store.state.username) return
        let options = {
            url: `/school/code/${key}`,
            method: 'GET',
            data: {
                code: key
            }
        }
        let res = await this.request('class', options)
        this.errorHandle(res, 'group')
        return res
    },
    async studentCreate(opt) {
        if (!store.state.username) return
        opt = opt || {}
        let options = {
            url: `/school/student`,
            method: 'POST',
            data: {
                realName: opt.realName,
                code: opt.code,
                level: opt.level
            }
        }
        let res = await this.request('class', options)
        this.errorHandle(res, 'group')
        return res
    },
    async schoolUserMessage() {
        if (!store.state.username) return
        let options = {
            url: `/school/message`,
            method: 'GET',
        }
        let res = await this.request('class', options)
        this.errorHandle(res, 'group')
        return res
    },
    async agreeSchoolMessage(id) {
        if (!store.state.username) return
        let options = {
            url: `/school/message/agree/${id}`,
            method: 'POST',
            data: {
                id: id
            }
        }
        let res = await this.request('class', options)
        this.errorHandle(res, 'group')
        return res
    },
    async refuseSchoolMessage(id) {
        if (!store.state.username) return
        let options = {
            url: `/school/message/deny/${id}`,
            method: 'POST',
            data: {
                id: id
            }
        }
        let res = await this.request('class', options)
        this.errorHandle(res, 'group')
        return res
    },
    async getSchoolMember(code) {
        if (!store.state.username) return
        let options = {
            url: `/school/members`,
            method: 'GET',
            data: {
                school_id: code
            }
        }
        let res = await this.request('class', options)
        this.errorHandle(res, 'main')
        return res
    },
    async teacherCreate(opt) {
        if (!store.state.username) return
        opt = opt || {}
        let options = {
            url: `/school/teacher`,
            method: 'POST',
            data: {
                realName: opt.realName,
                code: opt.code,
                level: opt.level,
                files: opt.files
            }
        }
        // await this.schoolCert({
        //     realName: opt.realName,
        //     level: opt.level,
        // })
        let res = await this.request('class', options)
        this.errorHandle(res, 'group')
        return res
    },
    async schoolCert(opt) {
        if (!store.state.username) return
        opt = opt || {}
        let options = {
            url: `/school/cert/info`,
            method: 'POST',
            data: {
                realName: opt.realName,
                level: opt.level,
                phone: opt.phone || '',
                email: opt.email || ''
            }
        }
        let res = await this.request('class', options)
        this.errorHandle(res, 'group')
        return res
    },
    async userCertInfo() {
        if (!store.state.username) return
        let options = {
            url: `/school/cert`,
            method: 'GET',
        }
        let res = await this.request('class', options)
        this.errorHandle(res, 'group')
        return res
    },
    appClick(e, atrName, checkName) {
        let ele = e.target
        // let atrName = 'fun-list'
        let f = false
        while (ele) {
            let atr = ele.getAttribute(checkName)
            if (atr && atr == atrName) {
                f = true
                break
            }
            ele = ele.parentElement
        }
        return f
    },
    //视频课程
    async getVideoCourse() {
        let options = {
            url: `/course/media`,
            method: 'GET',
        }
        let res = await this.request('class', options)
        this.errorHandle(res, 'course')
        return res
    },
    //课程列表-合
    async courseListNew(page, size) {
        page = page || 0
        size = size || 10
        let options = {
            url: `/course/offline`,
            method: 'GET',
            data: {
                page: page,
                size: size
            },
        }
        let res = await this.request('class', options)
        this.errorHandle(res, 'course')
        return res
    },
    //课程购买-合
    async coursePurchaseNew(courseId, detailId) {
        let options = {
            url: `/course/offline/purchase/${courseId}`,
            method: 'POST',
            data: {
                courseId: courseId,
                detailId: detailId
            },
        }
        let res = await this.request('class', options)
        this.errorHandle(res, 'course')
        return res
    },

    async getVideoCourseCamp() {
        let options = {
            url: `/camp/info/1`,
            method: 'GET',
        }
        let res = await this.request('class', options)
        if (res && res.code == 0) {
            if (!this.isArray(res.data)) res.data = [res.data]
        }
        this.errorHandle(res, 'course')
        return res
    },
    async getCoursePurchase() {
        if (!store.state.username) return false
        let options = {
            url: `/course/media/purchased`,
            method: 'GET',
        }
        let res = await this.request('class', options)
        this.errorHandle(res, 'course')
        if (res && res.code == 0) {
            if (!res.data) res.data = [res.data]
        }
        return res
    },
    async getCourseAllItem(courseId) {
        // if (!store.state.username) return false
        let options = {
            url: `/course/media/${courseId}/section`,
            method: 'GET',
        }
        let res = await this.request('engine', options)
        this.errorHandle(res, 'course')
        try {
            res = JSON.parse(res)
        } catch (e) { }
        return res
    },
    async videoCoursePay(courseId) {
        if (!store.state.username) return false
        let options = {
            url: `/course/media/purchase/${courseId}`,
            method: 'POST',
        }
        let res = await this.request('class', options)
        this.errorHandle(res, 'course')
        try {
            res = JSON.parse(res)
        } catch (e) { }
        return res
    },
    async videoCourseCampPay(courseId) {
        if (!store.state.username) return false
        let options = {
            url: `/camp/purchase/${courseId}`,
            method: 'POST',
        }
        let res = await this.request('class', options)
        this.errorHandle(res, 'course')
        try {
            res = JSON.parse(res)
        } catch (e) { }
        return res
    },
    async videoCourseAnswer(exercisesId, correct, actual) {
        // /course/media/answer/{exercisesId}
        if (!store.state.username) return false
        let options = {
            url: `/course/media/answer/${exercisesId}`,
            method: 'POST',
            data: {
                exercisesId: exercisesId,
                actual: actual,
                correct: correct
            }
        }
        let res = await this.request('engine', options)
        // this.errorHandle(res, 'course')
        try {
            res = JSON.parse(res)
        } catch (e) { }
        return res
    },
    async videoCourseProSet(sectionId, videoProgress) {
        if (!store.state.username) return false
        let options = {
            url: `/course/media/section/progress/${sectionId}`,
            method: 'POST',
            data: {
                sectionId: sectionId,
                videoProgress: videoProgress,
            }
        }
        let res = await this.request('engine', options)
        // this.errorHandle(res, 'course')
        try {
            res = JSON.parse(res)
        } catch (e) { }
        return res
    },
    async sendSmsCodeLogin(username, area, login) {
        login = login || true
        let options = {
            url: `/sms/code`,
            method: 'GET',
            data: {
                username: username,
                login: login,
                area: area
            }
        }
        let res = await this.request('user', options)
        this.errorHandle(res, 'smsCodeRegister')
        return res
    },
    async reportPrintData(gameId, type) {
        let typeList = {
            'word': { key: 'word', },
            'pdf': { key: 'pdf', },
        }
        if (!typeList[type]) return
        let key = typeList[type].key
        let url = `/export/report/${key}/${gameId}`
        let options = {
            url: url,
            method: 'POST',
            downloadFile: true,
            responseType: 'blob'
        }
        let res = await this.request('engine', options)
        this.errorHandle(res, 'print')
        return res
    },
    async AIsgfFavInit(page, size) {
        if (!store.state.username) return false
        let options = {
            url: `/favorite/game`,
            method: 'GET',
            data: {
                page: page,
                size: size
            }
        }
        let res = await this.request('engine', options)
        this.errorHandle(res, 'sgf')
        return res
    },
    async userFavSgfList(opt) {
        if (!store.state.username) return false
        opt = opt || {}
        let page = opt.page, size = opt.size
        let type = opt.type || 'ai'
        let options = {
            url: `/favorite/game/${type}`,
            method: 'GET',
            data: {
                page: page,
                size: size,
                type: type
            }
        }
        let res = await this.request('engine', options)
        this.errorHandle(res, 'sgf')
        return res
    },
    async favouriteSetNew(id, type) {
        if (!store.state.username) return false
        type = type || 'normal'
        let url = type == 'normal' ? `/favorite/game/${id}` : `/favorite/situatioin/${id}`
        let sendData = {}
        let key = type == 'normal' ? 'gameId' : 'situationId'
        sendData[key] = id
        let opt = {
            url: url,
            method: 'POST',
            data: sendData
        }
        let res = await this.request('engine', opt)
        this.errorHandle(res, 'favouriteSet')
        return res
    },
    async favouriteDeleteNew(id, type) {
        if (!store.state.username) return false
        type = type || 'normal'
        let url = type == 'normal' ? `/favorite/game/${id}` : `/favorite/situatioin/${id}`
        let sendData = {}
        let key = type == 'normal' ? 'gameId' : 'situationId'
        sendData[key] = id
        let opt = {
            url: url,
            method: 'DELETE',
            data: sendData
        }
        let res = await this.request('engine', opt)
        this.errorHandle(res, 'favouriteSet')
        return res
    },
    async userFavSituInit(page, size) {
        if (!store.state.username) return false
        let opt = {
            url: `/favorite/situation`,
            method: 'GET',
            data: {
                page: page,
                size: size
            }
        }
        let res = await this.request('engine', opt)
        this.errorHandle(res, 'favouriteSet')
        return res
    },
    getBranchVoice(moves) {
        let list = [
            { max: 1, num: 1 },
            { max: 2, num: 2 },
            { max: 3, num: 3 },
            { max: 4, num: 4 },
            { max: 7, num: 7 },
            { max: 8, num: 8 },
        ]
        let length = moves.length
        let voice = null
        for (var i in list) {
            if (length <= list[i].max) {
                voice = list[i]
                break
            }
        }
        if (voice === null) voice = list[list.length - 1]
        return voice
    },
    async getCardPresent() {
        let opt = {
            url: `/giftcard/type`,
            method: 'GET',
        }
        let res = await this.request('engine', opt)
        this.errorHandle(res, 'cardPresent')
        return res
    },
    async cardPresentAliPay(type, params) {
        if (!store.state.username) return false
        params = params || {}
        let opt = {
            url: `/giftcard/pay/alipay/h5/${type}`,
            method: 'POST',
            data: {
                person: params.person,
                phone: params.phone,
                address: params.address,
                returnUrl: params.returnUrl
            },
        }
        let res = await this.request('engine', opt)
        this.errorHandle(res, 'cardPresent')
        return res
    },
    async cardPresentwechatPay(type, params) {
        if (!store.state.username) return false
        params = params || {}
        let opt = {
            url: `/giftcard/pay/wxpay/h5/${type}`,
            method: 'POST',
            data: {
                person: params.person,
                phone: params.phone,
                address: params.address,
            },
        }
        let res = await this.request('engine', opt)
        this.errorHandle(res, 'cardPresent')
        return res
    },
    async cardPresentExchange(cardNum, cardPsw) {
        if (!store.state.username) return false
        let opt = {
            url: `/giftcard/exchange/${cardNum}`,
            method: 'POST',
            data: {
                giftNo: cardNum,
                password_sha256: cardPsw
            }
        }
        let res = await this.request('engine', opt)
        this.errorHandle(res, 'cardPresent')
        return res
    },
    async achievementsGet(username) {
        username = username || store.state.username
        if (!username) return false
        let opt = {
            url: `/achievements/${username}`,
            method: 'GET',
            data: {
                username: username,
            },
        }
        let res = await this.request('engine', opt)
        this.errorHandle(res, 'achievement')
        return res
    },
    async achievementList() {
        let opt = {
            url: `/achievements/all`,
            method: 'GET',
        }
        let res = await this.request('engine', opt)
        this.errorHandle(res, 'achievement')
        return res
    },
    async agoraErrorHnadle(err) {
        err = err || {}
        let code = err.code
        this.errorHandle(err, 'agoraRTC')
    },
    async classRoomAgoraTokenRefresh(classroomId, password) {
        if (!store.state.username || classroomId === undefined) return
        password = password || ''
        let opt = {
            url: `/classroom/refreshAgora/${classroomId}`,
            method: 'POST',
            data: {
                password: password
            }
        }
        let res = await this.request('class', opt)
        this.errorHandle(res, 'classroom')
        return res
    },
    async bannedAgoraOn(classroomId, userId, time) {
        if (!store.state.username || classroomId === undefined) return
        let postData = {
            time: time
        }
        if (!time) postData = null
        let opt = {
            url: `/classroom/admin/shutup/${classroomId}/${userId}`,
            method: 'POST',
            data: postData
        }
        let res = await this.request('class', opt)
        this.errorHandle(res, 'classroom')
        return res
    },
    async bannedAgoraOff(classroomId, userId) {
        if (!store.state.username || classroomId === undefined) return
        let opt = {
            url: `/classroom/admin/shutup/${classroomId}/${userId}`,
            method: 'DELETE',
        }
        let res = await this.request('class', opt)
        this.errorHandle(res, 'classroom')
        return res
    },
    genmoveSpecResHandl(res) {
        let keys = {
            '3006': 'levelError',
            'P1003': 'levelError'
        }
        if (res && res.code == 0) return false
        res = res || {}
        if (!keys[res.code]) return false
        let fun = keys[res.code]
        return fun
    },
    getEngineBoardByCode(data, command) {
        data = data.substring(Number(data.lastIndexOf('&&')) + 2, data.length)
        data = data.split('')
        for (var i = 0; i < data.length; i = Number(i) + 2) {
            if (data[i] == 't' || data[i] == 'z') {
                data[i] = 't'
                if (data[Number(i) + 1] !== undefined) data[Number(i) + 1] = 't'
            }
        }
        data = data.join('')
        return data
    },
    getEngineBoardByCodeOrg(data) {
        data = data.substring(Number(data.lastIndexOf('&&')) + 2, data.length)
        return data
    },
    getHistoryByResponse(data) {

    },
    async orderTryListenSmsCode(number) {
        if (!number) return false
        let opt = {
            url: `/course/booking/sms/${number}`,
            method: 'GET',
        }
        let res = await this.request('engine', opt)
        this.errorHandle(res)
        return res
    },
    async orderTryListenSubmit(post) {
        if (!post) return false
        post = post || {}
        let opt = {
            url: `/course/booking`,
            method: 'POST',
            data: post
        }
        let res = await this.request('engine', opt)
        this.errorHandle(res)
        return res
    },
    getEngineSpeed(id) {
        let list = this.planSpeed
        let speed = null
        for (var i in list) {
            if (list[i].id == id) {
                speed = list[i].speed
                break
            }
        }
        if (speed === null) speed = list[list.length - 1].speed
        return speed
    },
    cardNameGet(card, engineData) {
        card = card || {}
        engineData = engineData || {}
        if (!Object.keys(card).length || !Object.keys(engineData).length) return null
        let name = engineData.name
        name = name.replace('专业版', '')
        name = name.replace('旗舰版', '')
        name = name.replace(' ', '')
        name = `${name}${card.giftGpuTime}`
        return name
    },
    timeoutDefine(time) {
        let promise = new Promise(success => {
            setTimeout(() => {
                success()
            }, time);
        })
        return promise
    },
    async parseGibData(file, gameType) {
        let options = {
            url: '/games/upload',
            method: 'post',
            uploadFile: true,
            file: file
        }
        let res = await this.request('engine', options)
        this.errorHandle(res, 'gib game')
        return res
    },
    async classroomAudioRole() {
        return {
            code: 0,
            data: [
                { username: '0086-15010193341' }
            ]
        }
    },
    async getBookingList() {
        let options = {
            url: '/course/booking/list',
            method: 'GET',
        }
        let res = await this.request('engine', options)
        this.errorHandle(res)
        return res
    },
    gotoBackNormal(defaultPath) {
        defaultPath = defaultPath || '/engine/index'
        let refer = store.state.referrer || ''
        let origin = document.location.origin
        let path = refer
        // if(refer.indexOf(origin) <= -1){
        //     path = defaultPath
        // }else{
        //     // refer = refer.replace('http://', '')
        //     // refer = refer.replace('https://', '')
        //     path = refer
        // }
        if (this.$route && this.$route.path == path) path = defaultPath
        this.jumpToPageReplace(path)
    },
    //死活题-保存
    async saveLifeDeath(opt) {
        let username = store.state.username
        if (!username) return false
        let params = this.lifeDeathSaveParams(opt)
        let options = {
            // url: '/puzzle/life/user/save',
            url: `/puzzle/life/meta/${username}`,
            method: 'POST',
            data: params,
        }
        let res = await this.request('engine', options)
        this.errorHandle(res)
        if (res && res.code == 0 && opt.notice) {
            this.MessageOpen({
                type: 'success',
                message: window.i18n.t(this.__ERRORMSGDEFINE.errorMsg.main['save success'])
            })
        }
        return res
    },
    lifeDeathSaveParams(opt) {
        let de = {
            seta: null,
            sgf: null,
            target_zone: null,
            fighting_zone: null,
            border: null,
            title: null
        }
        let rd = {}
        for (var i in de) {
            rd[i] = this.deepCopy(de[i])
            if (opt[i] !== undefined) rd[i] = opt[i]
        }
        return rd
    },
    //获取死活题棋谱列表
    async lifeDeathSgfList(page, size) {
        let username = store.state.username
        if (!username) return false
        page = page || 0, size = size || 10
        let options = {
            // url: '/puzzle/life/user/list',
            url: `/puzzle/life/meta/list/${username}`,
            method: 'GET',
            data: {
                page: page,
                size: size
            },
        }
        let res = await this.request('engine', options)
        this.errorHandle(res)
        return res
    },
    //删除死活题
    async deleteLdpSgf(id) {
        if (!store.state.username) return false
        let options = {
            // url: '/puzzle/life/user/delete',
            url: `/puzzle/life/meta/${id}`,
            method: 'DELETE',
            data: {
                id: id
            },
        }
        let res = await this.request('engine', options)
        this.errorHandle(res)
        return res
    },
    //通过ID获取死活题棋谱
    async getLdpSgfById(id) {
        if (!store.state.username) return false
        let options = {
            // url: '/puzzle/life/user/info',
            url: `/puzzle/life/meta/${id}`,
            method: 'GET',
            data: {
                id: id
            },
        }
        let res = await this.request('engine', options)
        this.errorHandle(res)
        return res
    },
    lifeDeathMoveParse(move) {
        if (move == 'KO_T' || move == 'KO_R') return 'pass'
        return move
    },
    async gameListRequest() {
        let options = {
            url: '/player/get_list',
            method: 'GET',
        }
        let res = await this.request('engine', options)
        this.errorHandle(res)
        return res
    },
    async gameRequest_2(api, params, par) {
        par = par || 'engine'
        let options = {
            url: api,
            method: 'GET',
            data: params
        }
        if (!params) delete options['data']
        let res = await this.request(par, options)
        this.errorHandle(res)
        return res
    },
    async loginUuidGet() {
        let options = {
            url: '/scan/code',
            method: 'GET',
        }
        let res = await this.request('user', options)
        this.errorHandle(res)
        return res
    },
    async scanStateGet(uuid) {
        let options = {
            url: '/scan/state',
            method: 'GET',
            data: {
                uuid: uuid
            }
        }
        let res = await this.request('user', options)
        return res
    },
    async loginByUuid(uuid) {
        let options = {
            url: '/oauth/token',
            method: 'POST',
            data: {
                uuid: uuid,
                grant_type: 'scan_code'
            }
        }
        let res = await this.request('user', options)
        this.errorHandle(res, 'scan code')
        return res
    },
    async getUsernameByUuid(uuid) {
        let options = {
            url: '/scan/username',
            method: 'GET',
            data: {
                uuid: uuid,
            }
        }
        let res = await this.request('user', options)
        this.errorHandle(res, 'scan code')
        return res
    },
    async getLdpInitPlanId(username) {
        username = username || store.state.username
        if (!username) return false
        let options = {
            url: `/gpu/plans/life/${username}`,
            method: 'GET',
        }
        let res = await this.request('engine', options)
        this.errorHandle(res)
        return res
    },
    toChinesNum(num){
        let changeNum = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
        let unit = ["", "十", "百", "千", "万"];
        num = parseInt(num);
        let getWan = (temp) => {
            let strArr = temp.toString().split("").reverse();
            let newNum = "";
            for (var i = 0; i < strArr.length; i++) {
                newNum = (i == 0 && strArr[i] == 0 ? "" : (i > 0 && strArr[i] == 0 && strArr[i - 1] == 0 ? "" : changeNum[strArr[i]] + (strArr[i] == 0 ? unit[0] : unit[i]))) + newNum;
            }
            return newNum;
        }
        let overWan = Math.floor(num / 10000);
        let noWan = num % 10000;
        if (noWan.toString().length < 4) noWan = "0" + noWan;
        return overWan ? getWan(overWan) + "万" + getWan(noWan) : getWan(num);
    },
    toChineseNum(num){
        if(isNaN(Number(num))) return num
        let changeNum = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
        let unit = ["", "十", "百", "千", "万"];
        num = parseInt(num);
        let getWan = (temp) => {
            let strArr = temp.toString().split("").reverse();
            let newNum = "";
            for (var i = 0; i < strArr.length; i++) {
                newNum = (i == 0 && strArr[i] == 0 ? "" : (i > 0 && strArr[i] == 0 && strArr[i - 1] == 0 ? "" : changeNum[strArr[i]] + (strArr[i] == 0 ? unit[0] : unit[i]))) + newNum;
            }
            return newNum;
        }
        let overWan = Math.floor(num / 10000);
        let noWan = num % 10000;
        if (noWan.toString().length < 4) noWan = "0" + noWan;
        return overWan ? getWan(overWan) + "万" + getWan(noWan) : getWan(num);
    },
    paramsUpdate(info){
        info = info || {}
        this.setItem(info)
        if (this.updateUserAttr) this.updateUserAttr()
    },
    urlParse(url, opt){
        opt = opt || {}
        url = url || ''
        url = url.replace(new RegExp("{","gm"), "${")
        url = url.split('$')
        let rUrl = []
        for(var i in url){
            let tem = url[i] || ''
            if(tem.indexOf('{') > -1 && tem.indexOf('}') > -1){
                let funKey = tem.substring(tem.indexOf('{') + 1, tem.indexOf('}'))
                let params = ''
                if(opt[funKey]) params = opt[funKey]
                else if(this[`${funKey}Get`]) params = this[`${funKey}Get`]()
                if(params) tem = tem.replace(`{${funKey}}`, params)
                else tem = tem.replace(`{${funKey}}`, '')
            }
            rUrl.push(tem)
        }
        return rUrl.join('')
    },
    async resendDelay(num, re){
        num = num || 0
        if(num <= 0) return true
        let time = 1000
        let maxTime = 16000
        num = num - 1
        if(num < 0) num = 0
        let f = Math.pow(2, num)
        time = time * f
        if(time > maxTime) time = maxTime
        await this.timeoutDefine(time)
        return time
    },
    encodeData(data){
        return btoa(encodeURIComponent(data))
    },
    decodeData(data){
        return decodeURIComponent(atob(decodeURIComponent(data)))
    },
    async gotoReportNotice(){
        let res = await this.leConfirm.default.open({
            message: this.errorMsg.main['report create notice'],
            button: [
                {name: '是', label: 0},
                {name: '否', label: 1, type: 'cancel'},
            ]
        })
        res = res || {}
        return res.label == 0
    },
    decodeParams(data){
        data = this.decodeData(data)
        try{
            data = JSON.parse(data)
        }catch(e){}
        return data
    },
    getLevelListNew(){
        let list = this.deepCopy(this.computerLevel)
        for(let i in list){
            list[i].eloLevel = list[i].value
            list[i].boardSize = 19
            list[i].name = list[i].AIname
            list[i].humanLevel = list[i].saveName || list[i].label
            // {"level_icon":"img/p33.png","level_name":"职业"}
            list[i].extra = null
            if(list[i].saveName){
                list[i].extra = {
                    "level_icon": `img/${list[i].AIicon}`,
                    "level_name": list[i].label,
                }
            }
        }
        return list
    },
    handicapParse(val){
        val = val.replace(/\s/g, "")
        if(val != '让0子' && val != 0) return val
        return "分先"
    },
}
function initData() {
    let configData = window.__GLOBALATTR
    for (var i in configData.GLOBALATTR) {
        __main_data[i] = configData.GLOBALATTR[i]

    }
    __main_data.delBasic = {
        // width:1700,
        // width: 1536,
        width: window.GLOBALATTR.delBasic.width,
        maxHeight: window.GLOBALATTR.delBasic.maxHeight,
        minWidthRax: window.GLOBALATTR.delBasic.minWidthRax,
        fontSize: 20,
        boardH: 39,
        optW: 26,
        height: 821,
        realHeight: document.body.offsetHeight,
        css: {
            'font-size': 20
        }
    }
}
initData()
export default __main_data