import Vue from "vue";
import Vuex from "vuex";
import zh_CN from "@/i18n/zh_CN";
import en_US from "@/i18n/en_US";
import utils from "@/config/utils";
import createPersistedState from 'vuex-persistedstate'

const langs = {zh_CN, en_US};

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        // 判断用户是否已经登录
        isLogin: false,
        // 登录modal是否可见
        loginVisible: false,
        // 注册modal是否可见
        registerVisible: false,
        // 手机找回密码modal是否可见
        mobileResetPasswordVisible: false,
        // 邮箱找回密码modal是否可见
        emailResetPasswordVisible: false,
        // 登录用户id
        userId: "",
        // 登录用户名
        username: "",
        // access_token
        token: "",
        // 过期时间戳
        expire: 0,
        // 用户头像
        avatar: "",
        // 判断用户是否是管理员
        isManage: false,
        // 用户名称长度限制
        userMaxLength: 10,
        // 主题色
        colorOptions: ["#000000", "#3eaf7c", "#13c2c2", "#1869ff", "#722ed1", "#eb2f96"],
        // 当前使能的主题色
        themeColor: "#13c2c2",
        // 是否启用跑马灯（1：启用，0：禁止）
        isCarousel: 1,
        // 菜单是否收缩
        collapsed: false,
        // 用户屏幕宽度
        width: 0,
        // 用户屏幕高度
        height: 0,
        // 语言
        locale: "zh_CN",
        // 系统通知数量
        systemNotifyCount: 0,
        // 任务提醒数量
        taskNotifyCount: 0,
        allMessageCount: 0,
        replyMessageCount:0,
        likeMessageCount:0,
        followMessageCount:0,
        systemMessageCount:0,
        // 南生运营域名
        manageDomain: 'http://manage-test.nanshengbbs.top',
        commentRefreshPostStatisticalData: false,
        // 国际化方法
        translate: function (val) {
            // 国际化方法
            if (!val) {
                return "";
            }
            const arr = val.split(".");
            let l = arr.length;
            let re;
            try {
                re = langs[this.locale];
                for (let i = 0; i < l; i++) {
                    re = re[arr[i]];
                }
            } catch (err) {
                re = arr[l - 1];
            }
            return re || arr[l - 1];
        },
    },
    getters: {
        formCol(state) {
            if (state.width >= 500) {
                return {label: 6, wrapper: 16};
            }
            return {label: 8, wrapper: 16};
        },
        // 自动计算屏幕的内容区域（减取padding、margin和菜单栏的宽度）
        contentWidth(state) {
            if (state.collapsed) {
                return state.width - 120;
            }
            return state.width - 314;
        },
        isPc(state) {
            // 根据用户屏幕宽度判断是pc访问还是移动设备访问
            return state.width > 750;

        },
        // 状态枚举，项目中多出用到，所以存到store里面使用
        stateList(state) {
            return [
                {title: state.translate("common.enabled"), value: 1},
                {title: state.translate("common.disabled"), value: 0}
            ];
        }
    },
    mutations: {
        // 更改主题色，同时将配置存在localStorage
        changeColor(state, color) {
            utils.updateTheme(color);
            window.localStorage.themeColor = color;
            state.themeColor = color;
        },
        changeCommentRefreshPostStatisticalData(state,commentRefreshPostStatisticalData) {  //  重复赋值
            state.commentRefreshPostStatisticalData = commentRefreshPostStatisticalData;
        },
        changeLoginVisible(state, value){
            state.loginVisible = value;
        },
        changeIsLogin(state, value){
            state.isLogin = value;
        },
        changeUserId(state, value){
            state.userId = value;
        },
        changeUsername(state, value){
            state.username = value;
        },
        changeIsManage(state, value){
            state.isManage = value;
        },
        changeRegisterVisible(state, value){
            state.registerVisible = value;
        },
        changeEmailResetPasswordVisible(state, value){
            state.emailResetPasswordVisible = value;
        },
        changeLocale(state, value){
            state.locale = value;
        },
        changeToken(state, value){
            state.token = value;
        },
        changeExpire(state, value){
            state.expire = value;
        },
        changeAvatar(state, value){
            state.avatar = value;
        },
    },
    actions: {

    },
    modules: {},
    //配置
    // 当state中的值发生改变，此时localStorage中的vuex的值会同步把state中的所有值存储起来，当页面刷
    // 新的时候，state的值会从localStorage自动获取vuex的value值，赋值到state中
    plugins: [createPersistedState()]

});
