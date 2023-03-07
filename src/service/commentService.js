import axios from "axios";

export default {
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
  // 更新点赞状态
  updateLikeCommentState(data) {
    return new Promise((resolve, reject) => {
      axios.post("/comment/like", data)
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
