<template>
  <div id="left-buttons">
    <!-- 点赞 -->
    <div class="like-div">
      <a-badge class="badge" :count="data.likeCount" :overflow-count="999" :number-style="data.like ? {
        backgroundColor: $store.state.themeColor,
        boxShadow: '0 0 0 1px ' + $store.state.themeColor+ ' inset',
      } : {
        backgroundColor: '#c2c8d1',
        boxShadow: '0 0 0 1px #c2c8d1 inset',
      }">
        <div @click="likeAction" class="like-icon-container" style="background: #fff;">
          <i class="iconfont icon-like"
             :style="data.like ? 'color:' + $store.state.themeColor : 'color: #8a919f;'"></i>
        </div>
      </a-badge>
    </div>

    <!-- 评论 -->
    <div class="comment-div">
      <a-badge class="badge" :count="data.commentCount" :overflow-count="999" :number-style="{
        backgroundColor: '#c2c8d1',
        boxShadow: '0 0 0 1px #c2c8d1 inset',
      }">
        <a href="#post-comment-all">
          <div class="comment-icon-container" style="background: #fff;">
            <i class="iconfont icon-comment" style="color: #8a919f;"></i>
          </div>
        </a>
      </a-badge>
    </div>

  </div>
</template>

<script>

import postService from "@/service/postService";
import store from "@/store";

export default {

  data() {
    return {
      data: {},
    }
  },

  methods: {
    // 获取贴子一些统计数据
    getStatisticalData() {
      postService.getStatisticalData({postId: this.$route.params.id})
          .then((res) => {
            this.data = res.data;
            this.$emit("postCommentCountFn", res.data.commentCount);
          })
          .catch(err => {
            console.log('err',err)
            this.$message.error(err.msg);
          });
    },

    // 点赞/取消点赞
    likeAction() {
      if (!this.$store.state.isLogin){
        this.$message.error("请先登录");
        store.state.loginVisible = true;
      }else {
        let like = this.data.like;
        if(like){
          this.data.likeCount = this.data.likeCount - 1;
        }else{
          this.data.likeCount = this.data.likeCount + 1;
        }
        this.data.like = !like;
        postService.updateLikeState({postId: this.$route.params.id,state: like })
            .then(() => {
              if (like){
                console.log('取消');
                this.$message.success('取消成功');
              }else {
                console.log('点赞');
                this.$message.success('点赞成功');
              }
              this.getStatisticalData();
              
            })
            .catch(err => {
              this.data.like = like;
              this.$message.error(err.msg);
            });
      }
    },
  },

  mounted() {
    this.getStatisticalData();
  },

  computed :{
    //用于删除评论后更新贴子统计数据的计算属性
    commentRefreshPostStatisticalData(){
      return this.$store.state.commentRefreshPostStatisticalData;
    }
  },

  watch:{
    //用于删除评论后更新贴子统计数据的计算属性的监听
    commentRefreshPostStatisticalData(){
      this.getStatisticalData();
    }
  }


};
</script>

<style lang="less">
#left-buttons {
  position: fixed;
  z-index: 888;

  .like-icon-container {
    border-radius: 50%;
    width: 45px;
    height: 45px;
    text-align: center;
    cursor: pointer;

    i {
      font-size: 20px;
      line-height: 45px;
    }
  }

  .comment-div {
    margin-top: 20px;
  }

  .comment-icon-container {
    border-radius: 50%;
    width: 45px;
    height: 45px;
    text-align: center;
    cursor: pointer;

    i {
      line-height: 45px;
      font-size: 20px;
    }
  }
}
</style>
