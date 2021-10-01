// E11001("11001", "传参为空"),
// E13003("13003", "文件格式不正确"),

// //authentication error
// E6001("6001", "invalid token"),
// E6002("6002", "permission denied"),
// E6003("6003", "no authorities information"),

// // cert 500XX
// E50001("50001", "user cert error"),

// // school 501XX
// E50101("50101", "get school info error"),
// E50102("50102", "cert school info error"),
// E50103("50103", "update school cert info error"),
// E50104("50104", "get school cert status error"),
// E50105("50105", "update school cert status error"),

// // teacher 502XX
// E50201("50201", "get teacher info error"),
// E50202("50202", "cert teacher info error"),
// E50203("50203", "update teacher cert info error"),
// E50204("50204", "get teacher cert status error"),
// E50205("50205", "update teacher cert status error"),
// E50206("50206", "get all teacher infos error "),

// // student 503XX
// E50301("50301", "get student info error"),
// E50302("50302", "cert student info error"),
// E50303("50303", "update student cert info error"),
// E50304("50304", "get student cert status error"),
// E50305("50305", "update student cert status error"),
// E50306("50306", "get all student infos error "),

// // class 504XX
// E50401("50401", "add class info error"),
// E50402("50402", "get class info error"),
// E50403("50403", "update class info error"),
// E50404("50404", "delete class info error"),
// E50405("50405", "get class student rel error"),
// E50406("50406", "add student into class error"),
// E50407("50407", "update student status error");


export default {
    'school': {
        '11001': '传参为空',
        '13003': '文件格式不正确',

        '6001': '登录信息已失效，请重新登录',

        '50001': '认证错误，请重试',

        '6002': '您当前权限不足，请联系管理员',

        '50202': '认证信息错误',

        '50401': '新增课程失败，请稍后再试'
    },
    'defaultMsg': '获取数据失败，请检查网络或稍后再试',
    'common': {
        "14001": "用户不存在",
        "14002": "用户已关注",
        "14003": "关注错误",
        "14004": "查询错误",
        "14005": "展示错误",
        "14006": "消息不存在",
        "14007": "删除消息失败",
        "14008": "用户不属于群组",
        "14009": "群组不存在",
        "14010": "权限不足",
        "14011": "用户已在群组",
        "14012": "更新失败",
    },
    'course': {
        'notPurchase': '你还未购买该课程，请先前往购买',
        'purchaseGuid': '购买课程后可解锁全部章节'
    }
}