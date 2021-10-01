let userPhotoList = []
let maxNum = 54
for (var i = 0; i <= maxNum; i++) {
    userPhotoList.push({
        // name: `sys_${i}.png`
        name: 'sys_' + i + '.png'
    })
}




window.GLOBALATTR = {
    cardViewStyle: [
        // { name: 'normal', cardPlan: 8 },
        { name: 'common', cardPlan: 8 },
        { name: 'ath', cardPlan: 100 },
    ],
    reportLabel: {
        '1600': { icon2: 're2.png', icon1: 're4.png', name: '普通', key: 'ordinaryReport', splitBranch: false },
        '10000': { icon2: 're3.png', icon1: 're5.png', name: '精准', key: 'precisionReport', splitBranch: true },
        '30000': { icon2: 're8.png', icon1: 're8.png', name: '直播', key: 'precisionReport', splitBranch: true },
        '50000': { icon2: 're8.png', icon1: 're8.png', name: '直播', key: 'precisionReport', splitBranch: true },
        '500000': { icon2: 're6.png', icon1: 're7.png', name: '超准', key: 'precisionReport', splitBranch: true },
        'default': { icon2: 're1.png', icon1: 're1.png', name: '其他', key: '', splitBranch: false, type: 'default' },
    },
    reportIconForSgf: [
        {min: 0, max: 1600, icon2: 're9.png', icon1: 're9_i.png', gameType: '5'}, // 特训
        {min: 0, max: 1600, icon2: 're2.png', icon1: 're4.png',}, // 普通
        {min: 1601, max: 10000, icon2: 're3.png', icon1: 're5.png'}, //精准
        {min: 10001, max: 499999, icon2: 're8.png', icon1: 're8.png'},// 直播
        {min: 500000, max: 'max', icon2: 're6.png', icon1: 're7.png'}, // 超精
    ],
    computerLevel: [
        // { value: 5000, label: '测试5000', name: '电脑等级：测试5000', api: 'dcnn', sgf: true, game: true, certicate: '超凡入圣', login: true, AIicon: 'AI19.png', AIname: '测试5000', type: 'api' },
        // { value: 4000, label: '测试4000', name: '电脑等级：测试4000', api: 'dcnn', sgf: true, game: true, certicate: '超凡入圣', login: true, AIicon: 'AI19.png', AIname: '测试4000', type: 'api' },
        // { value: 3500, label: '测试3500', name: '电脑等级：测试3500', api: 'dcnn', sgf: true, game: true, certicate: '超凡入圣', login: true, AIicon: 'AI19.png', AIname: '测试3500', type: 'api' },
        // { value: 3400, label: '测试3400', name: '电脑等级：测试3400', api: 'dcnn', sgf: true, game: true, certicate: '超凡入圣', login: true, AIicon: 'AI19.png', AIname: '测试3400', type: 'api' },




        { value: 3300, saveName: '职业三星', label: '职业', name: '电脑等级：职业', api: 'mcts', icon: 'p33', highLevel: true, game: true, certicate: '登峰造极', login: true, AIicon: 'AI31.png', AIname: '星猛虎' },
        { value: 3200, saveName: '职业二星', label: '职业', name: '电脑等级：职业', api: 'mcts', icon: 'p32', highLevel: true, game: true, certicate: '撼天动地', login: true, AIicon: 'AI30.png', AIname: '星雄狮' },
        { value: 3100, saveName: '职业一星', label: '职业', name: '电脑等级：职业', api: 'mcts', icon: 'p31', highLevel: true, game: true, certicate: '神功盖世', login: true, AIicon: 'AI29.png', AIname: '星巨象' },
        //   {value: 3002, label: '九段', name: '九段', sgf: true},
        //   {value: 3009, label: '八段', name: '八段', sgf: true},
        //   {value: 3008, label: '七段', name: '七段', sgf: true},
        //   {value: 3007, label: '六段', name: '六段', sgf: true},
        //   {value: 3006, label: '五段', name: '五段', sgf: true},
        //   {value: 3005, label: '四段', name: '四段', sgf: true},
        //   {value: 3004, label: '三段', name: '三段', sgf: true},
        //   {value: 3003, label: '二段', name: '二段', sgf: true},
        //   {value: 3001, label: '初段', name: '初段', sgf: true},
        { value: 3000, label: '9段', name: '电脑等级：9段', api: 'dcnn', sgf: true, game: true, certicate: '超凡入圣', login: true, AIicon: 'AI28.png', AIname: '星壮牛' },
        { value: 2900, label: '准9段', name: '电脑等级：准9段', api: 'dcnn', sgf: false, game: true, certicate: '出神入化', login: true, AIicon: 'AI27.png', AIname: '星蓝鲸' },
        { value: 2800, label: '8段', name: '电脑等级：8段', api: 'dcnn', sgf: true, game: true, certicate: '随心所欲', login: true, AIicon: 'AI26.png', AIname: '星美鹿' },


        { value: 2600, paramsValue: 2600, label: '准8段', name: '电脑等级：准8段', api: 'dcnn', sgf: false, game: true, certicate: '惊天动地', login: true, AIicon: 'AI25.png', AIname: '星奇豚' },
        { value: 2500, paramsValue: 2500, label: '7段', name: '电脑等级：7段', api: 'dcnn', sgf: true, game: true, certicate: '举世无双', login: true, AIicon: 'AI24.png', AIname: '星萌猪' },
        { value: 2400, paramsValue: 2400, label: '准7段', name: '电脑等级：准7段', api: 'dcnn', sgf: false, game: true, certicate: '惊世骇俗', login: true, AIicon: 'AI23.png', AIname: '星骏马' },
        { value: 2300, paramsValue: 2300, label: '6段', name: '电脑等级：6段', api: 'dcnn', sgf: true, game: true, certicate: '深不可测', login: true, AIicon: 'AI22.png', AIname: '星呆羊' },
        { value: 2200, paramsValue: 2200, label: '准6段', name: '电脑等级：准6段', api: 'dcnn', sgf: false, game: true, certicate: '所向披靡', login: true, AIicon: 'AI21.png', AIname: '星跳鼠' },
        { value: 2100, paramsValue: 2100, label: '5段', name: '电脑等级：5段', api: 'dcnn', sgf: true, game: true, certicate: '名震八方', login: false, AIicon: 'AI20.png', AIname: '星灵狐' },
        { value: 2000, paramsValue: 2000, label: '准5段', name: '电脑等级：准5段', api: 'dcnn', sgf: false, game: true, certicate: '技冠群雄', login: true, AIicon: 'AI19.png', AIname: '星智狗' },
        { value: 1900, paramsValue: 1900, label: '4段', name: '电脑等级：4段', api: 'dcnn', sgf: true, game: true, certicate: '罕有敌手', login: true, AIicon: 'AI18.png', AIname: '星巧猫' },
        { value: 1800, paramsValue: 1800, label: '准4段', name: '电脑等级：准4段', api: 'dcnn', sgf: false, game: true, certicate: '出类拔萃', login: true, AIicon: 'AI17.png', AIname: '星皮猴' },
        { value: 1700, paramsValue: 1700, label: '3段', name: '电脑等级：3段', api: 'dcnn', sgf: true, game: true, certicate: '非比寻常', login: true, AIicon: 'AI16.png', AIname: '星乖兔' },
        { value: 1600, paramsValue: 1600, label: '准3段', name: '电脑等级：准3段', api: 'dcnn', sgf: false, game: true, certicate: '豁然贯通', login: true, AIicon: 'AI15.png', AIname: '星树熊' },
        { value: 1500, paramsValue: 1500, label: '2段', name: '电脑等级：2段', api: 'dcnn', sgf: true, game: true, certicate: '炉火纯青', login: true, AIicon: 'AI14.png', AIname: '星铠虾' },
        { value: 1400, paramsValue: 1400, label: '准2段', name: '电脑等级：准2段', api: 'dcnn', sgf: false, game: true, certicate: '登堂入室', login: true, AIicon: 'AI13.png', AIname: '星夜鹰' },
        { value: 1300, paramsValue: 1300, label: '1段', name: '电脑等级：1段', api: 'dcnn', sgf: true, game: true, certicate: '鹤立鸡群', login: false, AIicon: 'AI12.png', AIname: '星刺头' },
        { value: 1200, paramsValue: 1200, label: '准1段', name: '电脑等级：准1段', api: 'dcnn', sgf: false, game: true, certicate: '已有大成', login: true, AIicon: 'AI11.png', AIname: '星黄鸭' },
        { value: 1100, paramsValue: 1100, label: '1级', name: '电脑等级：1级', api: 'dcnn', sgf: true, game: true, certicate: '心领神会', login: true, AIicon: 'AI10.png', AIname: '星绿蛙' },
        { value: 1000, paramsValue: 1000, label: '2级', name: '电脑等级：2级', api: 'dcnn', sgf: true, game: true, certicate: '了然于胸', login: true, AIicon: 'AI9.png', AIname: '星老龟' },
        { value: 900, paramsValue: 900, label: '3级', name: '电脑等级：3级', api: 'dcnn', sgf: true, game: true, certicate: '融会贯通', login: true, AIicon: 'AI8.png', AIname: '星钳蟹' },
        { value: 800, paramsValue: 800, label: '4级', name: '电脑等级：4级', api: 'dcnn', sgf: true, game: true, certicate: '驾轻就熟', login: true, AIicon: 'AI7.png', AIname: '星尾鱼' },
        { value: 700, paramsValue: 700, label: '5级', name: '电脑等级：5级', api: 'dcnn', sgf: true, game: true, certicate: '略有小成', login: false, AIicon: 'AI6.png', AIname: '星飞蜓' },
        { value: 620, paramsValue: 620, label: '6级', name: '电脑等级：6级', api: 'dcnn', sgf: true, game: true, certicate: '初出茅庐', login: true, AIicon: 'AI5.png', AIname: '星舞蝶' },
        { value: 540, paramsValue: 540, label: '7级', name: '电脑等级：7级', api: 'dcnn', sgf: true, game: true, certicate: '粗懂皮毛', login: true, AIicon: 'AI4.png', AIname: '星忙蜂' },
        { value: 460, paramsValue: 460, label: '8级', name: '电脑等级：8级', api: 'dcnn', sgf: true, game: true, certicate: '初窥门径', login: true, AIicon: 'AI3.png', AIname: '星慢蜗' },
        { value: 380, paramsValue: 380, label: '9级', name: '电脑等级：9级', api: 'dcnn', sgf: true, game: true, certicate: '略知一二', login: true, AIicon: 'AI2.png', AIname: '星花虫' },
        { value: 300, paramsValue: 300, label: '10级', name: '电脑等级：10级', api: 'dcnn', sgf: true, game: true, certicate: '初学乍练', login: true, AIicon: 'AI1.png', AIname: '星小蚁' },
        { value: 0, label: ' ', name: '', api: 'dcnn', sgf: true, game: false },
    ],
    playerLevelList: [
        {name: '18级', value: 133},
        {name: '17级', value: 132},
        {name: '16级', value: 131},
        {name: '15级', value: 130},
        {name: '14级', value: 129},
        {name: '13级', value: 128},
        {name: '12级', value: 127},
        {name: '11级', value: 126},
        {name: '10级', value: 125},
        {name: '9级', value: 124},
        {name: '8级', value: 123},
        {name: '7级', value: 122},
        {name: '6级', value: 121},
        {name: '5级', value: 120},
        {name: '4级', value: 119},
        {name: '3级', value: 118},
        {name: '2级', value: 117},
        {name: '1级', value: 116},
        {name: '业余一段', value: 101},
        {name: '业余二段', value: 102},
        {name: '业余三段', value: 103},
        {name: '业余四段', value: 104},
        {name: '业余五段', value: 105},
        {name: '业余六段', value: 106},
        {name: '职业初段', value: 107},
        {name: '职业二段', value: 108},
        {name: '职业三段', value: 109},
        {name: '职业四段', value: 110},
        {name: '职业五段', value: 111},
        {name: '职业六段', value: 112},
        {name: '职业七段', value: 113},
        {name: '职业八段', value: 114},
        {name: '职业九段', value: 115},
    ],
    winrateDecline: {
        // minNumber: {
        //     '1': {
        //         value: 3000,
        //     },
        //     '2': {
        //         value: 6000,
        //     },
        //     'default': {
        //         value: 10000,
        //     }
        // },
        minNumber: {
            '1': {
                value: 1600,
            },
            '2': {
                value: 2400,
            },
            '3': {
                value: 3600
            },
            'default': {
                value: 5400,
            }
        },
        minValue: 0.03,
        data: [
            { min: 0.03, max: 0.049, css: 'win003' },
            { min: 0.05, max: 0.149, css: 'win005' },
            { min: 0.15, max: 0.299, css: 'win015' },
            { min: 0.3, max: 1, css: 'win030' },
        ]
    },
    propsIcon: {
        'variation': { name: '变化图', icon: 'branch_icon_white', sort: 4 },
        'options': { name: '支招', icon: 'prop_icon_white', sort: 3 },
        'area': { name: '领地', icon: 'area_icon_white', sort: 1 },
        'backMove': { name: '悔棋', icon: 'undo_icon_white', sort: 2 },
        'back_move': { name: '悔棋', icon: 'undo_icon_white', sort: 2 },
        'mixed': { name: '每种', icon: ['area_icon_white', 'undo_icon_white', 'prop_icon_white', 'branch_icon_white'], sort: 5 }
    },
    propsIconStore: {
        'variation': { name: '变化图', icon: 'branch_icon_white', sort: 4 },
        'options': { name: '支招', icon: 'prop_icon_white', sort: 3 },
        'area': { name: '领地', icon: 'area_icon_white', sort: 1 },
        'back_move': { name: '悔棋', icon: 'undo_icon_white', sort: 2 },
        'mixed': { name: '每种', icon: ['area_icon_white', 'undo_icon_white', 'prop_icon_white', 'branch_icon_white'], sort: 5, num: 4 }
    },
    storeReportIcon: {
        'ordinaryReport': { name: '普通报告', icon: 're2', sort: 1 },
        'precisionReport': { name: '精准报告', icon: 're3', sort: 2 },
        'testerReport': { name: '超准报告', icon: 're6', sort: 3 },
        'subjectReport': { name: '特训报告', icon: 're9', sort: 4 },
    },
    storeReportIconStore: {
        'ordinary_report': { name: '普通报告', icon: 're2', sort: 1 },
        'precision_report': { name: '精准报告', icon: 're3', sort: 2 },
        'tester_report': { name: '超准报告', icon: 're6', sort: 3 },
        'subject_report': { name: '特训报告', icon: 're9', sort: 4 },
    },
    reportKeyCha: {
        '普通': { k1: 'ordinaryReport', k2: 'ordinary_report', icon: 're2', selectId: 1 },
        '精准': { k1: 'precisionReport', k2: 'precision_report', icon: 're3', selectId: 4 },
        '超准': { k1: 'testerReport', k2: 'tester_report', icon: 're6' },
        '特训': { k1: 'subjectReport', k2: 'subject_report', icon: 're9'},
    },
    storeHotSet: {
        props: {
            id: 6
        }
    },
    storeBillType: {
        "silver": "白银会员卡",
        "gold": "黄金会员卡",
        "platinum": "白金会员卡",
        "diamond": "钻石会员卡",
        "black_gold": "黑金会员卡",
        "upgrade to silver": "升级到白银会员卡",
        "upgrade to gold": "升级到黄金会员卡",
        "upgrade to platinum": "升级到白金会员卡",
        "upgrade to diamond": "升级到钻石会员卡",
        "upgrade to black_gold": "升级到黑金会员卡",
        "s1": "分析研究与高水平对弈",
        "s2": "前往支付",
        "media_course": {name: '网课', params: 'id'},
        "subject_report": { name: '特训报告', num: true, unit: '张' },
        "ordinary_report": { name: '普通报告', num: true, unit: '张' },
        "precision_report": { name: '精准报告', num: true, unit: '张' },
        "mixed": { name: '四拼道具各', num: 4, unit: '个' },
        'area': { name: '领地', num: 1, unit: '个' },
        'options': { name: '支招', num: 1, unit: '个' },
        'back_move': { name: '悔棋', num: 1, unit: '个' },
        'variation': { name: '变化图', num: 1, unit: '个' },
    },
    cardConfig: {
        cardName: {
            'silver': '白银',
            'gold': '黄金',
            'platinum': '白金',
            'diamond': '钻石',
            'black_gold': '黑金',
        }
    },
    errorHandleSpecCode: {
        'propBuy': 'store',
        'gpu_plans': 'engine',
        'reportCreate': 'engine'
    },
    bonusIcon: {
        'area_increment': 'area_icon_white',
        'options_increment': 'prop_icon_white',
        'variation_increment': 'branch_icon_white',
        'back_move_increment': 'undo_icon_white',
    },
    bonusConfig: {
        'area_increment': {
            'name': '领地', icon: 'area_icon_light'
        },
        'options_increment': {
            'name': '支招', icon: 'prop_icon_light'
        },
        'back_move_increment': {
            'name': '悔棋', icon: 'undo_icon_light'
        },
        'variation_increment': {
            'name': '变化图', icon: 'branch_icon_light'
        },
    },
    bonusConfigNum: 2,
    AIMinute: [
        { value: 0, label: '0分钟', name: '0分钟' },
        // {value: 0.2, label: '12秒', name: '12秒'},
        // {value: 5, label: '5分钟', name: '5分钟'},
        { value: 10, label: '10分钟', name: '10分钟' },
        { value: 20, label: '20分钟', name: '20分钟' },
        { value: 30, label: '30分钟', name: '30分钟' },
        { value: 40, label: '40分钟', name: '40分钟' },
        { value: 60, label: '60分钟', name: '60分钟' },
        { value: 120, label: '120分钟', name: '120分钟' },
    ],
    AISecond: [
        { value: 5, label: '5秒', name: '5秒' },
        { value: 10, label: '10秒', name: '10秒' },
        { value: 20, label: '20秒', name: '20秒' },
        { value: 30, label: '30秒', name: '30秒' },
        { value: 40, label: '40秒', name: '40秒' },
        { value: 60, label: '60秒', name: '60秒' },
    ],
    AINum: [
        { value: 1, label: '1次', name: '1次' },
        { value: 3, label: '3次', name: '3次' },
        { value: 5, label: '5次', name: '5次' },
        { value: 10, label: '10次', name: '10次' },
    ],
    gameMinute: [
        { value: 0, label: '0分钟', name: '0分钟' },
        // {value: 0.2, label: '12秒', name: '12秒'},
        // {value: 1, label: '1分钟', name: '1分钟'},
        { value: 10, label: '10分钟', name: '10分钟' },
        { value: 20, label: '20分钟', name: '20分钟' },
        { value: 30, label: '30分钟', name: '30分钟' },
        { value: 40, label: '40分钟', name: '40分钟' },
        // {value: 45, label: '45分钟', name: '45分钟'},
        { value: 60, label: '60分钟', name: '60分钟' },
        { value: 120, label: '120分钟', name: '120分钟' },
    ],
    gameSecond: [
        { value: 5, label: '5秒', name: '5秒' },
        { value: 10, label: '10秒', name: '10秒' },
        { value: 20, label: '20秒', name: '20秒' },
        { value: 30, label: '30秒', name: '30秒' },
        { value: 40, label: '40秒', name: '40秒' },
        { value: 60, label: '60秒', name: '60秒' },
    ],
    gameNum: [
        { value: 1, label: '1次', name: '1次' },
        { value: 3, label: '3次', name: '3次' },
        { value: 5, label: '5次', name: '5次' },
        { value: 10, label: '10次', name: '10次' },
    ],
    activityConfig: {
        activityType: {
            '-1': {
                name: '登录奖励'
            },
            '0': {
                name: '注册有礼'
            },
            '1': {
                name: '活动有礼'
            },
        },
        bonusType: {
            'value': '礼金券',
            'mixed': '道具',
            'ordinary_report': '普通报告',
            'precision_report': '精准报告'
        }
    },
    indexConfig: {
        bannerAnimationTime: 3000,
    },
    functionStopList: {
        'report': [
            { name: 'create', stop: true }
        ],
    },
    delBasic: {
        width: 1600,
        maxHeight: 0.95,
        minWidthRax: 0.5
    },
    finalJudgeWatch: {
        minPos: 180,
        split: 10,
    },
    user_config: {
        photoList: userPhotoList
    },
    currency_config: {
        'CNY': {
            name: '人民币', sym: '￥'
        },
        'USD': {
            name: '美元', sym: '$'
        },
        // 'JPY': {
        //   name: '日元', 
        // }
    },
    mapPathList: {
        'play_ready_normal': {
            path: '/engine/play/set',
            fun: { f: 'savePlayGameType', params: 0 },
        },
        'play_ready_level': {
            path: '/engine/play/set',
            fun: { f: 'savePlayGameType', params: 1 },
        },
        'play_ready_engine': {
            path: '/engine/play/set',
            fun: { f: 'savePlayGameType', params: 2 },
        },
    },
    userPhotoDefault: {
        path: 'sys_0.png',
        blackPath: 'sys_0_black.png',
        whitePath: 'sys_0_white.png',
    },
    AIPhotoDefault: {
        path: 'p68.png'
    },
    AINameDefault: {
        name: '星阵'
    },
    videoConfig: {
        titleList: [
            { name: '热门推荐' },
            { name: '教学专栏' },
            { name: '棋道文化' },
            { name: '自战解说' },
            { name: '围棋赛事' },
        ],
        listPath: 'videoList.json'
    },
    needCountFunction: {
        'paypal': {
            category: '支付',
            action: 'PayPal',
            label: 'open PayPal',
        }
    },
    engineConfig: {
        prefrechOptions: {
            interval: 3
        }
    },
    langSelectItems: [
        {name: '简体中文', index: '320', fun: 'languageChange', label: 'zh', openMenu: true, src: 'ft_cn.jpg'},
        {name: '繁體中文', index: '321', fun: 'languageChange', label: 'tc', openMenu: true, src: 'ft_kro.jpg'},
        {name: '한국어', index: '322', fun: 'languageChange', label: 'ko', openMenu: true, src: 'ft_kro.jpg'},
        {name: 'English', index: '323', fun: 'languageChange', label: 'en', openMenu: true, src: 'ft_kro.jpg'},
        {name: '日本語', index: '324', fun: 'languageChange', label: 'jp', openMenu: true, src: 'ft_kro.jpg'},
    ],
    engineAutoCloseConfig: {
        select: [
            // { value: 0.1, label: '0.1分钟', name: '0.1分钟' },
            { value: 5, label: '5分钟', name: '5分钟' },
            { value: 15, label: '15分钟', name: '15分钟' },
            { value: 30, label: '30分钟', name: '30分钟' },
        ],
        value: 5,
    },
    branchSelectConfig: {
        select: [
            { value: 0.001, label: '较长', name: '较长' },
            { value: 0.003, label: '适中', name: '适中' },
            { value: 0.01, label: '较短', name: '较短' },
        ],
        value: 0.01
    },
    probSelectConfig: {
        select: [
            { value: 0.01, label: '丰富', name: '丰富' },
            { value: 0.03, label: '正常', name: '正常' },
            { value: 0.09, label: '精简', name: '精简' },
        ],
        value: 0.01
    },
    trainingDataConfig: {
        '00': {
            color: 'getUserColor00', ruleKey: 'trainingD'
        },
        '01': {
            ruleKey: 'trainingE'
        },
        '02': {
            ruleKey: 'trainingC'
        },
        '03': {
            ruleKey: 'trainingF'
        },
        '04': {
            ruleKey: 'trainingI'
        },
        '05': {
            ruleKey: 'trainingH'
        },
        '06': {
            ruleKey: 'trainingG'
        },
        '07': {
            ruleKey: 'trainingB'
        },
        '08': {
            ruleKey: 'trainingA'
        },
    },
    nationality: {
        cn: {name: '中国'},
        ko: {name: '韩国'},
        jp: {name: '日本'},
        tw: {name: '台湾'},
        uk: {name: '英国'},
        ca: {name: '加拿大'},
        fr: {name: '法国'},
        ge: {name: '德国'},
        ru: {name: '俄罗斯'},
        us: {name: '美国'},
        il: {name: '以色列'}


    },
    trainingConfig: {
        menu: {
            f: [
                {name: '对杀', value: '00'},
                {name: '均衡', value: '01'},
                {name: '官子', value: '02'},
                {name: '进攻', value: '03'},
                {name: '破坏模样', value: '04'},
                {name: '经营模样', value: '05'},
                {name: '治孤', value: '06'},
                {name: '中后盘', value: '07'},
                {name: '布局', value: '08'},
            ],
            // 3.6.9
            s: [
                // {name: '6K', min: 300, max: 620, value: 620},
                // {name: '1K', min: 700, max: 1100, value: 1100},
                {name: '3D', min: 1200, max: 1700, value: 1700},
                {name: '6D', min: 1800, max: 2300, value: 2300},
                {name: '9D', min: 2400, max: 3000, value: 3000},
            ]
        }
    },
    bannerList: [
        {img: 'banner/banner1', routerLink: '/engine/course/video/detail/63'},
        {img: 'incb15', routerLink: '/engine/course/select/MC'},
        {img: 'incb13', routerLink: '/engine/course/media/detail/8'},
        // {img: 'incb11', routerLink: '/engine/course/common/detail/2'},
        // {img: 'incb9', routerLink: '/engine/store/purchase/present/1000'},
        // {img: `incb8`, routerLink: '/engine/course/college/detail/1'},
        // {img: 'incb7', routerLink: '/engine/course/video/list/4'},
        // {img: `incb6`, fun: 'gotoSpecReport', params: {sgfId: 1197773}},
        {img: 'incb1'},
        // {img: 'incb4'},
        {img: 'incb5', link: 'https://m.bilibili.com/video/BV1hK4y187dY'},
        {img: 'incb2'},
        // {img: `incb3`},
    ],
    indexCarousel: {
        interval: 8000
    },
    noneWithAuthorization: [
        // '/golives/cache',
        {regular: true, data: /^\/api\/engine\/golives.*/i}
        // '/golives/situation'
    ],
    courseConfig: {
        list: [
            {
                name: '围棋零基础课程',
                lessonCount: 17,
                // banner: 'co3_2.png',
                banner: 'incb7.png',
                link: 'mediaList',
                params: 'id',
                id: 4,
            },
            {
                name: '围棋零基础课程前两章',
                lessonCount: 17,
                // banner: 'co3_2.png',
                banner: 'incb7.png',
                link: 'payVideo',
                params: 'id',
                id: 4,
            },
            {
                name: '围棋零基础课程-完整版',
                lessonCount: 17,
                // banner: 'co3_2.png',
                banner: 'incb7.png',
                link: 'payVideo',
                params: 'id',
                id: 6,
            },
            {
                name: '围棋零基础课程全阶段',
                lessonCount: 17,
                banner: 'incb13.png',
                link: 'mediaList',
                params: 'id',
                id: 8,
            },
            {
                name: '星阵一对一精品网课',
                // banner: 'co1.png',
                banner: 'incb10.png',
                link: 'list',
                id: 4,
            },
            {
                parseId: 1,
                name: '星阵围棋进阶学院',
                // banner: 'co11.png',
                banner: 'incb8.png',
                
                link: 'college',
                params: 'id',
                learnType: '采取人工智能与围棋讲师互补教学，将学生培养出科学的围棋学习能力。（详情见教学内容与课程大纲）',
                level: '星阵2级至星阵5段',
                id: 1,
            },
            {
                name: '星阵围棋小班课',
                banner: 'incb11.png',
                link: 'common',
                params: 'id',
                id: 2,
                payImg: 'co22.png'
            },
        ],
        menuIcon: 'img/menu_sub1.png',
        game_pra: {
            list: [
                {min: 300, max: 300, text: '要学习更多的围棋知识？职业棋手课程现在免费试听！', link: '/engine/course/media/detail/8', goods_id: 8},
                {min: 380, max: 700, text: '想变得更强？有一个适合你的课现在可以免费试听！', link: '/engine/course/media/detail/8', goods_id: 8},
            ]
        }
    },
    authenConfig: {
        messageData: {
            '1': {type: '学生', message: ''},
            '4': {type: '机构', message: '您的资料已提交，请等待审核'},
        }
    },
    komi: [
        { value: 7.5, label: '3又3/4子', name: '黑贴3又3/4子'},
        // { value: 0, label: '0目', name: '黑贴0目' },
        // { value: 0.5, label: '0.5目', name: '黑贴0.5目' },
        // { value: 1.5, label: '1.5目', name: '黑贴1.5目' },
        // { value: 2.5, label: '2.5目', name: '黑贴2.5目' },
        // { value: 3.5, label: '3.5目', name: '黑贴3.5目' },
        // { value: 4.5, label: '4.5目', name: '黑贴4.5目' },
        // { value: 5.5, label: '5.5目', name: '黑贴5.5目' },
        { value: 6.5, label: '6.5目', name: '黑贴6.5目', singleSource: true},
        // { value: 7, label: '7目', name: '黑贴7目' },
        // { value: 8.5, label: '8.5目', name: '黑贴8.5目' },
        // { value: 9.5, label: '9.5目', name: '黑贴9.5目' },
        // { value: -20.5, label: '-20.5目', name: '白贴20.5目' },
        // { value: -25.5, label: '-25.5目', name: '白贴25.5目' },
        // { value: -30.5, label: '-30.5目', name: '白贴30.5目' },
        // { value: -35.5, label: '-35.5目', name: '白贴35.5目' },
        // { value: -40.5, label: '-40.5目', name: '白贴40.5目' },
        // { value: -50.5, label: '-50.5目', name: '白贴50.5目' },
        // { value: -100.5, label: '-100.5目', name: '白贴100.5目' },
    ],
    classroomConfig: {
        defaultPsw: '<null>'
    },
    liveConfig: {
        time: 8000
    },
    // '1': 750,
    //     '2': 1500,
    //     '3': 3000,
    //     '4': 6000,
    planSpeed: [
        {id: 1, speed: 750},
        {id: 2, speed: 1500},
        {id: 3, speed: 3000},
        {id: 4, speed: 6000},
    ],
    classRoom: {
        audioPsw: '-golaxydeteacher'
    }

    // 20.5 25.5 30.5 35.5 40.5 50.5
}
window.__GLOBALATTR = {
    GLOBALATTR: window.GLOBALATTR
}