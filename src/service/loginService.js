import axios from "axios"

export default {
    // 注册
    register(data) {
        return new Promise((resolve, reject) => {
            axios.post("/auth/register", data)
                .then(res => resolve(res))
                .catch(err => reject(err));
        });
    },
    // 登录
    login(data) {
        return new Promise((resolve, reject) => {
            axios.post("/auth/login", data)
                .then(res => resolve(res))
                .catch(err => reject(err));
        });
    },
    // 退出登录
    logout(data) {
        return new Promise((resolve, reject) => {
            axios.post("/auth/logout", data)
                .then(res => resolve(res))
                .catch(err => reject(err))
        })
    }
}
