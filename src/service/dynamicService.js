import axios from "axios";

export default {
  // 获取动态
  getDynamicList(params) {
    return new Promise((resolve, reject) => {
      axios.get("/dynamic/list", {params})
          .then((res) => resolve(res))
          .catch((err) => reject(err));
    });
  },

};
