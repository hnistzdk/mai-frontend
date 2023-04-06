import axios from "axios";

export default {
    // 获取用户列表
    getUserList(params) {
        return new Promise((resolve, reject) => {
            axios.get("/admin/user/list", {params})
                .then((res) => resolve(res))
                .catch((err) => reject(err));
        });
    },

    //更新用户信息
    updateUserInfo(data) {
        return new Promise((resolve, reject) => {
            axios.post("/admin/user/update", data)
                .then((res) => resolve(res))
                .catch((err) => reject(err));
        });
    },


    // 角色列表
    getRoleList(params) {
        return new Promise((resolve, reject) => {
            axios.get("/admin/role/list", {params})
                .then((res) => resolve(res))
                .catch((err) => reject(err));
        });
    },

    //获取更新用户信息时选择角色的数据
    getRoleSelectData() {
        return new Promise((resolve, reject) => {
            axios.get("/admin/role/selectData")
                .then((res) => resolve(res))
                .catch((err) => reject(err));
        });
    },


    createRole(data) {
        return new Promise((resolve, reject) => {
            axios.post("/admin/role/create", data)
                .then((res) => resolve(res))
                .catch((err) => reject(err));
        });
    },

    updateRole(data) {
        return new Promise((resolve, reject) => {
            axios.post("/admin/role/update", data)
                .then((res) => resolve(res))
                .catch((err) => reject(err));
        });
    },

    getPostList(params){
        return new Promise((resolve, reject) => {
            axios.get("/admin/post/list", {params})
                .then((res) => resolve(res))
                .catch((err) => reject(err));
        });
    }

};
