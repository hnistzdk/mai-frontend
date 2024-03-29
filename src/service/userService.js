import axios from "axios";

export default {

    // 用户判重
    verifyUsername(params) {
        return new Promise((resolve, reject) => {
            axios.get("/user/verify", {params})
                .then((res) => resolve(res))
                .catch((err) => reject(err));
        });
    },

    // 获取用户信息
    getUserInfo(params) {
        return new Promise((resolve, reject) => {
            axios.get("/user/profile/"+params.userId, )
                .then((res) => resolve(res))
                .catch((err) => reject(err));
        });
    },
    // 更新用户基本信息
    updateUserBasicInfo(data) {
        return new Promise((resolve, reject) => {
            axios.post("/user/update", data)
                .then((res) => resolve(res))
                .catch((err) => reject(err));
        });
    },

    // 上传用户头像（更新）
    uploadUserAvatar(data) {
        return new Promise((resolve, reject) => {
            axios.post("/user/avatar", data).then((res) => resolve(res))
                .catch((err) => reject(err));
        });
    },

    // 更新关注状态
    updateFollowState(params) {
        return new Promise((resolve, reject) => {
            axios.post("/user/follow",params)
                .then((res) => resolve(res))
                .catch((err) => reject(err));
        });
    },


    // 获取关注者和粉丝信息
    getFollowUsers(params) {
        return new Promise((resolve, reject) => {
            axios.get("/user/follow/list", {params})
                .then((res) => resolve(res))
                .catch((err) => reject(err));
        });
    },
    // 获取关注/粉丝数量
    getFollowCount(params) {
        return new Promise((resolve, reject) => {
            axios.get("/user/follow/followCount", {params})
                .then((res) => resolve(res))
                .catch((err) => reject(err));
        });
    },


    //过期校验
    validateExpire(){
        return new Promise((resolve, reject) => {
            axios.get("/user/validate").then((res) => resolve(res))
                .catch((err) => reject(err));
        });
    },

    // 重置密码
    resetPassword(data) {
        return new Promise((resolve, reject) => {
            axios.post("/user/resetPassword", data)
                .then((res) => resolve(res))
                .catch((err) => reject(err));
        });
    },


    // 发送邮件验证码
    sendEmailVerifyCode(params) {
        return new Promise((resolve, reject) => {
            axios.get("/user/sendEmailVerifyCode", {params})
                .then((res) => resolve(res))
                .catch((err) => reject(err));
        });
    },

    // 绑定邮箱
    bindEmail(params) {
        return new Promise((resolve, reject) => {
            axios.post("/user/bindEmail", params)
                .then((res) => resolve(res))
                .catch((err) => reject(err));
        });
    },

    // 解绑邮箱
    unbindEmail(params) {
        return new Promise((resolve, reject) => {
            axios.post("/user/unbindEmail",params)
                .then((res) => resolve(res))
                .catch((err) => reject(err));
        });
    },

    // 判断email是否已经绑定
    emailExist(data) {
        return new Promise((resolve, reject) => {
            axios.post("/user/emailExist/" + data)
                .then((res) => resolve(res))
                .catch((err) => reject(err));
        });
    },

    // 邮箱重置密码
    emailResetPassword(data) {
        return new Promise((resolve, reject) => {
            axios.post("/user/emailResetPassword", data)
                .then((res) => resolve(res))
                .catch((err) => reject(err));
        });
    },





    // 发送短信验证码
    sendSmsVerifyCode(params) {
        return new Promise((resolve, reject) => {
            axios.get("/user/sendSmsVerifyCode", {params})
                .then((res) => resolve(res))
                .catch((err) => reject(err));
        });
    },

    // 绑定手机
    bindPhone(data) {
        return new Promise((resolve, reject) => {
            axios.post("/user/bindPhone", data)
                .then((res) => resolve(res))
                .catch((err) => reject(err));
        });
    },
    // 解绑手机
    untiePhone(data) {
        return new Promise((resolve, reject) => {
            axios.post("/user/untiePhone", data)
                .then((res) => resolve(res))
                .catch((err) => reject(err));
        });
    },

    // 手机判重
    isValidPhone(params) {
        return new Promise((resolve, reject) => {
            axios.get("/user/isValidPhone", {params})
                .then((res) => resolve(res))
                .catch((err) => reject(err));
        });
    },

    // 判断手机是否已经绑定
    isPhoneExist(data) {
        return new Promise((resolve, reject) => {
            axios.post("/user/isPhoneExist/" + data)
                .then((res) => resolve(res))
                .catch((err) => reject(err));
        });
    },
    // 手机重置密码
    phoneResetPassword(data) {
        return new Promise((resolve, reject) => {
            axios.post("/user/phoneResetPassword", data)
                .then((res) => resolve(res))
                .catch((err) => reject(err));
        });
    },

    // 获取当前用户权限
    getCurrentUserAccess() {
        return new Promise((resolve, reject) => {
            axios.get("/user/getCurrentUserRights")
                .then((res) => resolve(res))
                .catch((err) => reject(err));
        });
    },
    // 获取热门作者列表
    getHotAuthorsList(params) {
        return new Promise((resolve, reject) => {
            axios.get("/user/getHotAuthorsList", {params})
                .then((res) => resolve(res))
                .catch((err) => reject(err));
        });
    },
};
