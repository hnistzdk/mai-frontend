// 获取贴子
import axios from "axios";

export default {
    searchPost(params) {
        return new Promise((resolve, reject) => {
            axios.get("/search/list/post", {params})
                .then((res) => resolve(res))
                .catch((err) => reject(err));
        });
    },

    searchUser(params) {
        return new Promise((resolve, reject) => {
            axios.get("/search/list/user", {params})
                .then((res) => resolve(res))
                .catch((err) => reject(err));
        });
    },

};
