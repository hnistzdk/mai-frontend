import Vue from 'vue';
import Antd from 'ant-design-vue';
import App from './App';
import 'ant-design-vue/dist/antd.css';

import router from './router'
import store from './store'
import "@/assets/css/main.css"
// 引入自定义全局字体样式表
import '@/assets/font/font.css'
// 引入iconfont的样式（iconfont的使用参照iconfont官网）
import '@/assets/icon/iconfont.css'
// 引入axios 初始化axios里面的配置
import "@/service/axios"
import moment from "moment"
import "./assets/css/main.less"
import utils from "./utils/utils"
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import axios from "axios";
import constants from './constants/constants'
import Message from "ant-design-vue/lib/message";

// true为开启开发模式
Vue.config.productionTip = true;

// 引入自定义工具模块
Vue.prototype.$utils = utils
Vue.prototype.$moment = moment
// 将国际化添加为Vue的原型上的方法
Vue.prototype.$t = store.state.translate.bind(store.state)
axios.defaults.baseURL = "http://localhost:9527";
Vue.use(Antd);
Vue.use(mavonEditor)
Vue.use(constants)


export default new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')

router.beforeEach((to, from, next) => {
    //设置延时器让created先执行再进行路由跳转
    setTimeout((res) => {
        // 判断该路由是否需要登录权限
        if (to.meta.requireAuth) {
            // 通过vuex state获取当前的状态是否存在
            if (store.state.isLogin && store.state.isManage) {
                next();
            } else {
                next({
                    path: '/',
                    query: {
                        redirect: to.fullPath
                    } // 将跳转的路由path作为参数，登录成功后跳转到该路由
                })
            }
        } else {
            next();
        }
    }, 100);
})
