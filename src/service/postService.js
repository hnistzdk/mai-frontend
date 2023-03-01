import axios from "axios";

export default {
    // 获取贴子
    getPostList(params) {
        return new Promise((resolve, reject) => {
            axios.get("/post/getList", {params})
                .then((res) => resolve(res))
                .catch((err) => reject(err));
        });
    },
    // 获取个人发布的贴子（所有）
    getPersonalPosts(params) {
        return new Promise((resolve, reject) => {
            axios.get("/post/getPersonalPosts", {params})
                .then((res) => resolve(res))
                .catch((err) => reject(err));
        });
    },
    // 获取待审核的贴子
    getPendingReviewPosts(params) {
        return new Promise((resolve, reject) => {
            axios.get("/post/getPendingReviewPosts", {params})
                .then((res) => resolve(res))
                .catch((err) => reject(err));
        });
    },
    // 获取禁用的贴子
    getDisabledPosts(params) {
        return new Promise((resolve, reject) => {
            axios.get("/post/getDisabledPosts", {params})
                .then((res) => resolve(res))
                .catch((err) => reject(err));
        });
    },
    // 修改贴子审批状态
    updateState(data) {
        return new Promise((resolve, reject) => {
            axios.post("/post/updateState", data)
                .then((res) => resolve(res))
                .catch((err) => reject(err));
        });
    },
    // 获取点赞过的文章
    getLikesPost(params) {
        return new Promise((resolve, reject) => {
            axios.get("/post/getLikesPost", {params})
                .then((res) => resolve(res))
                .catch((err) => reject(err));
        });
    },
    // 获取贴子评论访问总数
    getPostCommentVisitTotal(params) {
        return new Promise((resolve, reject) => {
            axios.get("/post/getPostCommentVisitTotal", {params})
                .then((res) => resolve(res))
                .catch((err) => reject(err));
        });
    },
    // 上传图片（一张）
    uploadPicture(data) {
        return new Promise((resolve, reject) => {
            axios.post("/post/uploadPicture", data)
                .then((res) => resolve(res))
                .catch((err) => reject(err));
        });
    },
    // 发布贴子
    postCreate(data) {
        return new Promise((resolve, reject) => {
            axios.post("/post/create", data)
                .then((res) => resolve(res))
                .catch((err) => reject(err));
        });
    },
    // 更新贴子
    postUpdate(data) {
        return new Promise((resolve, reject) => {
            axios.post("/post/update", data)
                .then((res) => resolve(res))
                .catch((err) => reject(err));
        });
    },
    // 获取贴子详情
    getPostById(params) {
        return new Promise((resolve, reject) => {
            axios.get("/post/getById", {params})
                .then((res) => resolve(res))
                .catch((err) => reject(err));
        });
    },
    // 获取贴子一些统计数据
    getPostCountById(params) {
        return new Promise((resolve, reject) => {
            axios.get("/post/getCountById", {params})
                .then((res) => resolve(res))
                .catch((err) => reject(err));
        });
    },
    // 贴子置顶/取消置顶
    postTop(params) {
        return new Promise((resolve, reject) => {
            axios.get("/post/postTop", {params})
                .then((res) => resolve(res))
                .catch((err) => reject(err));
        });
    },
    //删除贴子
    postDelete(data) {
        return new Promise((resolve, reject) => {
            axios.post("/post/delete/" + data)
                .then((res) => resolve(res))
                .catch((err) => reject(err));
        });
    },

};
