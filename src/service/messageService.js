import axios from "axios";

export default {
    // 分页获取通知信息
    getMessageList(params) {
        return new Promise((resolve, reject) => {
            axios.get("/message/list", {params})
                .then(res => resolve(res))
                .catch(err => reject(err));
        });
    },
    // 全部已读
    makeAllRead(params) {
        return new Promise((resolve, reject) => {
            axios.post("/message/allRead",  params)
                .then(res => resolve(res))
                .catch(err => reject(err));
        });
    },
    // 标记已读
    markRead(data) {
        return new Promise((resolve, reject) => {
            axios.post("/message/markRead", data)
                .then(res => resolve(res))
                .catch(err => reject(err));
        });
    },

    // 获取消息数量
    getNotReadMessageCount() {
        return new Promise((resolve, reject) => {
            axios.get("/message/count")
                .then(res => resolve(res))
                .catch(err => reject(err));
        });
    }
};
