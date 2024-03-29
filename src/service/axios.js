import axios from "axios";
import store from '../store/index'
import dayjs from "dayjs";
// 设置xhr请求超时时间和baseURL（毫秒）
axios.defaults.timeout = 30000;
if (process.env.NODE_ENV === "production") {
    // axios.defaults.baseURL = "http://localhost:9527";
    axios.defaults.baseURL = "http://mai-api.com/api";
}
export default (() => {

    //校验过期时间
    let expireTimeStamp =  store.state.expire;
    if (expireTimeStamp) {
        let now = dayjs().valueOf();
        if (now >= expireTimeStamp) {
            //证明已过期
            store.state.token = '';
            store.state.expire = 0;
            store.state.userId = 0;
            store.state.username = '';
            store.state.isManage = false;
            store.state.isLogin = false;
        }
    }

    // 每次请求前处理
    axios.interceptors.request.use(config => {
        let token = store.state.token;
        let userId = store.state.userId;
        let username = store.state.username;
        if (token) {
            config.headers.authorization = token;
        }
        if (userId) {
            config.headers.userId = userId;
        }
        if (username) {
            config.headers.username = encodeURIComponent(username);
        }
        return config
    }, error => {
        return Promise.reject(error);
    })

    // 每次请求回来的处理
    axios.interceptors.response.use(response => {
            // 后台会在响应头带上用户头像链接，每次和存在store中的比较，不同就替换，实现头像更新
            if (response.headers["x-user-avatar"]) {
                store.state.avatar = response.headers["x-user-avatar"];
            }
            // 后台会在响应头带上用户任务提醒和消息通知的数量，存在store里面，
            if (response.headers["x-message-reply-count"]) {
                store.state.replyMessageCount = response.headers["x-message-reply-count"];
            }
            if (response.headers["x-message-like-count"]) {
                store.state.likeMessageCount = response.headers["x-message-like-count"];
            }
            if (response.headers["x-message-follow-count"]) {
                store.state.followMessageCount = response.headers["x-message-follow-count"];
            }
            if (response.headers["x-message-system-count"]) {
                store.state.systemMessageCount = response.headers["x-message-system-count"];
            }
            if (response.headers["x-message-all-count"]) {
                store.state.allMessageCount = response.headers["x-message-all-count"];
            }
            // console.log('axios响应',response)
            if (response.status === 200) {
                if (response.data) {
                    if (response.data.code === 0) {
                        return Promise.resolve(response.data);
                    }
                    //token过期或验证失败  清除token信息
                    else if (response.data.code === 40001 || response.data.code === 401) {
                        store.state.token = '';
                        store.state.expire = 0;
                        store.state.userId = 0;
                        store.state.username = '';
                        store.state.isLogin = false;
                        store.state.isManage = false;
                        store.state.loginVisible = true;
                        throw response.data;
                    } else {
                        throw response.data;
                    }
                } else {
                    throw response;
                }
            } else {
                // 响应码不是200则返回一个失败的Promise
                return Promise.reject(response);
            }
        }, error => {
            console.log('error', error)
            let resp = error.response;
            if (resp.status === 401) {
                store.state.token = '';
                store.state.expire = 0;
                store.state.userId = 0;
                store.state.username = '';
                store.state.isLogin = false;
                store.state.isManage = false;
                store.state.loginVisible = true;
            } else {
                return Promise.reject(error);
            }
        }
    );
})();
