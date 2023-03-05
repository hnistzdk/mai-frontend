import axios from "axios";

export default {
  // 根据评论rootId获取子评论信息
  getCommentByRootId(params) {
    return new Promise((resolve, reject) => {
      axios.get("/comment/list/root", {params})
          .then((res) => resolve(res))
          .catch((err) => reject(err));
    });
  },
  // 获取贴子的评论信息
  getCommentByPostId(params) {
    return new Promise((resolve, reject) => {
      axios.get("/comment/list", {params})
          .then((res) => resolve(res))
          .catch((err) => reject(err));
    });
  },
  // 获取最新评论信息
  getLatestComment(params) {
    return new Promise((resolve, reject) => {
      axios.get("/comment/getLatestComment", {params})
          .then((res) => resolve(res))
          .catch((err) => reject(err));
    });
  },
  // 创建评论
  createComment(data) {
    return new Promise((resolve, reject) => {
      axios.post("/comment/create", data)
          .then((res) => resolve(res))
          .catch((err) => reject(err));
    });
  },
  // 删除评论
  deleteComment(data) {
    return new Promise((resolve, reject) => {
      axios.post("/comment/delete/" + data)
          .then((res) => resolve(res))
          .catch((err) => reject(err));
    });
  },

};
