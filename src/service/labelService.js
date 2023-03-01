import axios from "axios";

export default {
  // 获取标签
  getLabelList(params) {
    return new Promise((resolve, reject) => {
      axios.get("/label/getList", {params})
          .then((res) => resolve(res))
          .catch((err) => reject(err));
    });
  },
  // 上传标签logo
  uploadLabelLogo(data) {
    return new Promise((resolve, reject) => {
      axios.post("/label/uploadLabelLogo", data)
          .then((res) => resolve(res))
          .catch((err) => reject(err));
    });
  },
  // 新增标签
  labelCreate(data) {
    return new Promise((resolve, reject) => {
      axios.post("/label/create", data)
          .then((res) => resolve(res))
          .catch((err) => reject(err));
    });
  },
  // 更新标签
  labelUpdate(data) {
    return new Promise((resolve, reject) => {
      axios.post("/label/update", data)
          .then((res) => resolve(res))
          .catch((err) => reject(err));
    });
  },
  // 删除标签
  labelDelete(data) {
    return new Promise((resolve, reject) => {
      axios.post("/label/delete/" + data)
          .then((res) => resolve(res))
          .catch((err) => reject(err));
    });
  },

};
