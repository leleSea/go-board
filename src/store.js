import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
// public static final int SCHOOL_ROLE_UNKNOWN = -1; //未知状态
// public static final int SCHOOL_ROLE_ROOT = 0; //星阵管理员
// public static final int SCHOOL_ROLE_ADMIN = 10; //棋校管理员
// public static final int SCHOOL_ROLE_TEACHER = 20; //教师
// public static final int SCHOOL_ROLE_STUDENT = 30; //学生
// public static final int SCHOOL_ROLE_USER = 40; //用户
// public static final int SCHOOL_ROLE_VISITOR = 50; //访客
export default new Vuex.Store({
	state: {
		theme: null,
		username: null,
		nickname: null,
		mediaCourse: {
			logFile: 'courseList_full'
			// logFile: 'courseList'
		},
		school: {
			roleMap: {
				'0': {roleKey: 'golaxy_manager', roleName: '星阵管理员', page: 'manage'},
				'10': {roleKey: 'school_manager', roleName: '棋校管理员'},
				'20': {roleKey: 'school_teacher', roleName: '老师'},
				'30': {roleKey: 'school_student', roleName: '学生'},
				'40': {roleKey: 'school_user', roleName: '用户'},
				'50': {roleKey: 'school_guest', roleName: '访客'},
			},
			roleCode: {
				'golaxy_manager': 0,
				'school_manager': 10,
				'school_teacher': 20,
				'school_student': 30,
				'school_user': 40,
				'school_guest': 50,
			},
			schoolType: {
				'-1': {name: '未知'},
				'1': {name: '个人'},
				'2': {name: '企业'},
			},
			certStatus: {
				'-1': {name: '未知'},
				'1': {name: '待审核'},
				'2': {name: '已撤销'},
				'3': {name: '未通过'},
				'4': {name: '已认证'},
				'5': {name: '已关闭'},
			},
			certText_byType: [
				{status: 1, type: 2, text: '等待对方处理'},
				{status: 3, type: 2, text: '对方已拒绝'},
			],
			certStatus_msg: {
				'-1': {name: '未知'},
				'1': {name: '待审核'},
				'2': {name: '已撤销'},
				'3': {name: '已拒绝'},
				'4': {name: '已同意'},
				'5': {name: '已关闭'},
			},
			studentScaleList: [
				{name: '50-100人', value: 0, data: '50-100'},
				{name: '101-150人', value: 1, data: '101-150'},
				{name: '150人以上', value: 2, data: '150-max'},
			],
			teacherScaleList: [
				{name: '5-10人', value: 0, data: '5-10'},
				{name: '11-50人', value: 1, data: '11-50'},
				{name: '50人以上', value: 2, data: '50-max'},
			],
			classType: [
				{name: '线上', type: 1},
				{name: '线下', type: 2},
			],
			classStatus: [
				{name: '未知', value: -1},
				{name: '在校', value: 1},
				{name: '下线', value: 2},
			],
			memberStatus: [
				{name: '未知', value: -1},
				{name: '待审核', value: 1},
				{name: '已撤销', value: 2},
				{name: '未通过', value: 3},
				{name: '已通过', value: 4},
				{name: '已关闭', value: 5},
			],
			stu_tea_status: [
				{name: '未知', value: -1},
				{name: '在校', value: 1},
				{name: '离校', value: 2},
			],
			studentStatus: [
				{name: '未知', value: -1},
				{name: '待审核', value: 1},
				{name: '已撤销', value: 2},
				{name: '未通过', value: 3},
				{name: '已通过', value: 4},
				{name: '已关闭', value: 5},
			],
			contentMenuList: {
				'-1': [],
				'0': ['teacher', 'student', 'class', 'personal', 'school'],
				'10': ['teacher', 'student', 'class', 'personal', 'school'],
				'20': ['student', 'class', 'personal', 'school'],
				'30': ['personal', 'school'],
				'40': [],
				'50': []
			},
			// {name: '教师管理', key: 'teacher'},
			// {name: '学生管理', key: 'student'},
			// {name: '班级管理', key: 'class'},
			// {name: '个人信息', key: 'personal', def: true},
			// {name: '棋校信息', key: 'school'},
			certStatusCode: {
				'unknown': -1,
				'submitted': 1,
				'cancel': 2,
				'fail': 3,
				'success': 4,
				'close': 5
			},
			// public static final int CERT_STATUS_UNKNOWN = -1; //未知状态
			// public static final int CERT_STATUS_SUBMITTED = 1; //认证提交
			// public static final int CERT_STATUS_WITHDRAW = 2; //认证撤销
			// public static final int CERT_STATUS_REJECTED = 3; //认证未通过
			// public static final int CERT_STATUS_APPROVED = 4; //认证通过
			// public static final int CERT_STATUS_CLOSED = 5; //认证关闭
		},
		userInfo: {
			nickname: {
				ruleText: '昵称长度在2-12字符之间，且不包含空格和特殊符号'
			},
			signature: {
				ruleText: '长度在40字符以内'
			}
		},
		service: {
			username: 'golaxy_xingzhen2'
		},
		orderStatus: {
			'open': 0,
			'cancel': 1,
			'close': 2,
			'finished': 3
		},
		goods: {
			type: {
				'course': ['MC', 'OC', 'LC'],
				'store': ['MG']
			}
		},
		course: {
			pathCacheList: [
				'/engine/course/list',
				'/engine/course/select',
				'/engine/course/media/detail',
				'/engine/course/training',
				'/engine/course/common/detail',
				'/engine/course/teacher'
			],
			noLoginDisabledPath: [
				'/engine/course/teacher/pay',
				'/engine/course/training',
			],
			defaultPath: '/engine/course/select',
			menu: [
				{title: '全部课程', value: 'OC_MC_LC'},
				{title: '视频课程', value: 'MC'},
				{title: '直播课程', value: 'OC'},
				{title: '已购课程', value: 'OC_MC_LC_X', fun: 'purchased'},
			],
			all_goods_type: 'OC_MC_LC'
		},
		game: {
			localKey: {
				'normal_ai': 'game_data_normal',
				'rank_ai': 'game_data_rank'
			},
			st: [
				{name: '数子法', value: 'chinese'},
				{name: '数目法', value: 'japanese'},
			],
			// ktchinese: [
			// 	{name: '3又3/4子', value: 7.5},
			// 	{name: '其他贴子', value: -1},
			// ],
			ktchinese: {
				'9': [
					{name: '3又1/2子', value: 7},
					{name: '其他贴子', value: -1},
				],
				'13': [
					{name: '3又3/4子', value: 7.5},
					{name: '其他贴子', value: -1},
				],
				'19': [
					{name: '3又3/4子', value: 7.5},
					{name: '其他贴子', value: -1},
				],
			},
			// ktjapanese: [
			// 	{name: '6.5目', value: 6.5},
			// 	{name: '其他贴子', value: -1},
			// ],
			ktjapanese: {
				'9': [
					{name: '6目', value: 6},
					{name: '其他贴子', value: -1},
				],
				'13': [
					{name: '6.5目', value: 6.5},
					{name: '其他贴子', value: -1},
				],
				'19': [
					{name: '6.5目', value: 6.5},
					{name: '其他贴子', value: -1},
				],
			},
			komi: [
			],
			komiRange_japanese: {max: 59.5, min: -59.5},
			komiRange_chinese: {max: 29.75, min: -29.75},
			komiDefault_chinese: 7.5,
			komiDefault_japanese: 6.5,
			komiInit: 0.5,
			komiInit_chinese: 0.25,
			komiInit_japanese: 0.5,
			komiUnit_chinese: '子',
			komiUnit_japanese: '目',
			ha: [
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
			sz: [
				{ value: 19, label: '19x19', name: '19路棋盘' },
        		{ value: 13, label: '13x13', name: '13路棋盘' },
        		{ value: 9, label: '9x9', name: '9路棋盘' },
			],
			cl: [
				{value: 0, label: '猜先', name: '猜先'},
				{value: 1, label: '执黑', name: '执黑'},
				{value: -1, label: '执白', name: '执白'},
			],
			tc: [
				{value: 0, label: '不计时', name: '不计时'},
				{value: 1, label: '计时', name: '计时'},
			],
			m: [
				{ value: 0, label: '0分钟', name: '0分钟' },
				{ value: 0.1, label: '0.1分钟', name: '0.1分钟' },
				{ value: 10, label: '10分钟', name: '10分钟' },
				{ value: 20, label: '20分钟', name: '20分钟' },
				{ value: 30, label: '30分钟', name: '30分钟' },
				{ value: 40, label: '40分钟', name: '40分钟' },
				{ value: 60, label: '60分钟', name: '60分钟' },
				{ value: 120, label: '120分钟', name: '120分钟' },
			],
			mDefault: 10,
			s: [
				{ value: 5, label: '5秒', name: '5秒' },
				{ value: 10, label: '10秒', name: '10秒' },
				{ value: 20, label: '20秒', name: '20秒' },
				{ value: 30, label: '30秒', name: '30秒' },
				{ value: 40, label: '40秒', name: '40秒' },
				{ value: 60, label: '60秒', name: '60秒' },
			],
			sDefault: 30,
			n: [
				{ value: 1, label: '1次', name: '1次' },
				{ value: 3, label: '3次', name: '3次' },
				{ value: 5, label: '5次', name: '5次' },
				{ value: 10, label: '10次', name: '10次' },
			],
			nDefault: 3,
			handicap13: [
				[],
				[],
				[42, 126],
				[42, 126, 48],
				[42, 126, 48, 120],
				[42, 126, 48, 120, 84]
			],
			handicap9: [
				[],
				[],
				[20, 24],
				[20, 24, 56],
				[20, 24, 56, 60]
			],
			handicap19: [
				[],
				[],
				[72, 288,],
				[72, 288, 60],
				[72, 288, 60, 300],
				[72, 288, 60, 300, 180],
				[72, 288, 60, 300, 174, 186],
				[72, 288, 60, 300, 174, 186, 180],
				[72, 288, 60, 300, 174, 186, 66, 294],
				[72, 288, 60, 300, 174, 186, 66, 294, 180],
			],
			handicapKomi: [
				{},
				{},
				{chinese: 2, japanese: 0},
				{chinese: 3, japanese: 0},
				{chinese: 4, japanese: 0},
				{chinese: 5, japanese: 0},
				{chinese: 6, japanese: 0},
				{chinese: 7, japanese: 0},
				{chinese: 8, japanese: 0},
				{chinese: 9, japanese: 0},
			],
			stLabel: 'st'
		},
		sgf: {
			max: 722
		},
		funIconList: {
			'领地': {
				icon: 'fun1', prob: true
			},
			'支招': {
				icon: 'fun2', prob: true
			},
			'方向': {
				icon: 'fun35'
			},
			'变化图': {
				icon: 'fun3', prob: true
			},
			'悔棋': {
				icon: 'fun4', prob: true
			},
			'手数': {
				icon: 'fun5'
			},
			'停一手': {
				icon: 'fun6'
			},
			'试下': {
				icon: 'fun7'
			},
			'清空': {
				icon: 'fun8'
			},
			'存盘面': {
				icon: 'fun9'
			},
			'配置': {
				icon: 'fun10'
			},
			'停止': {
				icon: 'fun11'
			},
			'放弃': {
				icon: 'fun15'
			},
			'认输': {
				icon: 'fun16'
			},
			'数子': {
				icon: 'fun17'
			},
			'结果': {
				icon: 'fun17'
			},
			'新开': {
				icon: 'fun18'
			},
			'重来': {
				icon: 'fun18'
			},
			'分享': {
				icon: 'fun20'
			},
			'研究': {
				icon: 'enm2'
			},
			'报告': {
				icon: 'enm3'
			},
			'评论': {
				icon: 'fun22'
			},
			'上一题': {
				icon: 'fun23'
			},
			'下一题': {
				icon: 'fun24'
			},
			'返回': {
				icon: 'fun25'
			},
			'删除': {
				icon: 'fun_icon/fun15'
			},
			'拆解': {
				icon: 'fun27'
			},
			'直播结束': {
				icon: 'fun28'
			},
			'直播结束': {
				icon: 'fun28'
			},
			'移动': {
				icon: 'fun29'
			},
			'摆黑': {
				icon: 'fun30'
			},
			'摆白': {
				icon: 'fun31'
			},
			'交替': {
				icon: 'fun32'
			},
			'标记': {
				icon: ''
			},
			'打印': {
				icon: 'fun34'
			},
			'不提示': {
				icon: 'fun36'
			},
			'存题': {
				icon: 'fun9'
			},
			'保存并分享': {
				icon: 'fun9'
			},
			
			'看标识': {
				icon: 'fun37'
			},
			'目标子': {
				icon: 'fun38'
			},
			'下载': {
				icon: 'fun_icon/fun46'
			},
			'收藏': {
				icon: 'fun_icon/fun47'
			},
			'修改': {
				icon: 'fun_icon/fun44'
			},
			'extendIcon': {
				icon: ''
			},
			'提示': {
				icon: 'fun13'
			},
			'AI解题': {
				icon: 'fun_icon/fun45'
			},
			'落子': {
				icon: 'fun_icon/fun49'
			},
			'打开': {
				icon: 'fun_icon/fun50'
			},
			'保存': {
				icon: 'fun9'
			}
		},
		enginePlan: {
			botSize: 1500,
			botSizeCom: 1400
		},
		userRelation: {
			searchPlaceholder_user: '请输入星阵号或昵称搜索',
			groupRole: {
				'0': 'member',
				'1': 'admin',
				'2': 'owner'
			}
		}
	},
	mutations: {
		setItem(state, options) {
			for (var i in options) {
				state[i] = options[i]
			}
		},
		removeItem(state, options) {
			for (var i in options) {
				if (state[i]) {
					delete state[i]
				}
			}
		},
		schoolRoleCode(state, role){
			let map = state.roleMap
			let code = null
			for(var i in map){
				if(map[i].roleKey.indexOf(role) > -1){
					code = i
					break
				}
			}
			return code
		},
	},
	actions: {
		setItem(context, options) {
			context.commit('setItem', options)
		},
		removeItem(context, options) {
			context.commit('removeItem', options)
		},
		getItem(context, options) {
			context.commit('getItem', options)
		}
	}
})
