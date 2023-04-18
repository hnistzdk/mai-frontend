<template>
  <div id="child-comment">
    <a-comment :id="'reply-' + data.commentId">
      <a class="username" slot="author" @click="routerUserCenter(data.createBy)">
        <span style="font-weight: bold">
          {{ data.createUsername }}
        </span>
        <small class="time" slot="title" style="color: #b5b9b9" v-text="$utils.showtime(data.updateTime)"></small>
      </a>
      <a-avatar slot="avatar" :src="data.avatar ? data.avatar : require('@/assets/img/default_avatar.png')"
                @click="routerUserCenter(data.createBy)"/>
      <p class="comment-content" slot="content">
        <span v-html="data.content" style="width: 100%">{{ data.content }}</span>
<!--        <span class="del" v-if="data.createBy === $store.state.userId"-->
<!--              @click="deleteComment(data.commentId)">{{ $t("common.delete") }}</span>-->
      </p>
      <span slot="content">
        <a class="operate comment-like">
          <i class="iconfont icon-like" @click="likeCommentAction(data.commentId,data.like)"
             :style="data.like ? 'color:' + $store.state.themeColor : 'color: #8a919f;'">
            <small> {{ $t("common.like") }}</small>
            <small> {{ data.likeCount === 0 ? '' : data.likeCount }}</small>
          </i>
        </a>
        <a class="operate comment-comment" v-if="data.depth < 2" @click="isShowFn(data.commentId)">
          <i class="iconfont icon-comment" style="color: #8a919f;">
            <small v-if="isShow"> {{ $t("common.cancelReply") }}</small>
            <small v-else> {{ $t("common.reply") }}</small>
            <small> {{ data.repliesCount === 0 ? '' : data.repliesCount}}</small>
          </i>
        </a>
        <!-- 自己的评论 or 自己的贴子  都可以删除对应评论信息 -->
        <b v-if="data.createBy === $store.state.userId || postInfo.authorId === $store.state.userId">
          <a-dropdown :placement="'bottomCenter'" :trigger="['click']">
            <a-menu slot="overlay">
              <a-menu-item key="delete" @click="deleteComment(data.commentId)">
                <span style="color: red">{{ ' ' + $t("common.delete") }}</span>
              </a-menu-item>
            </a-menu>
            <span class="options comment-operate">
              <a-icon type="ellipsis" style="cursor: pointer"/>
            </span>
          </a-dropdown>
        </b>
      </span>
      <CreateComment v-show="isShow"
                     :parentId="parentId"
                     :post-info="postInfo"
                     :comment-info="commentInfo"
                     :id="'childTextarea'"
                     @refresh="getCommentByPostId"/>
      <!-- 根据rootId循环 -->
      <ChildCommentList v-if="data.depth < 2"
                    v-for="(item, index) of data.toComment"
                    :data="item"
                    :key="index"
                    :postUserId="postUserId"
                    :post-info="postInfo"
                    :comment-info="item"
                    @getCommentByPostId="getCommentByPostId"/>
    </a-comment>
  </div>
</template>

<script>
import CreateComment from "@/components/comment/CreateComment";
import ChildCommentList from "@/components/comment/ChildCommentList";
import store from "@/store";
import commentService from "@/service/commentService";


export default {
  name: 'ChildComment',

  components: {CreateComment,ChildCommentList},

  props: {
    data: {type: Object, default: () => ({})},
    // 当前贴子的作者
    postUserId: {type: Number, default: 0},
    //贴子信息
    postInfo: {},
    //评论信息
    commentInfo:{},
  },

  data() {
    return {
      isShow: false,
      parentId: 0,
    }
  },

  methods: {
    // 点赞/取消点赞
    likeCommentAction(commentId,state) {
      if (!this.$store.state.isLogin){
        this.$message.error("请先登录");
        store.state.loginVisible = true;
      }else {
        this.data.like = !state;
        commentService.updateLikeCommentState({commentId: commentId,state:state})
            .then(() => {
              if (state){
                this.$message.success("取消成功");
              }else {
                this.$message.success("点赞成功");
              }
              this.$emit("getCommentByPostId");
            })
            .catch(err => {
              this.data.like = state;
              this.$message.error(err.msg);
            });
      }
    },

    // 刷新评论数据
    getCommentByPostId() {
      this.$emit("getCommentByPostId");
    },

    // 评论回复 的显示与否
    isShowFn(id) {
      if (this.$store.state.isLogin) {
        this.isShow = !this.isShow;
        this.parentId = id;
      } else {
        store.state.loginVisible = true;
      }
    },

    //  删除评论
    deleteComment(commentId) {
      this.$confirm({
        centered: true,
        title: this.$t("common.deleteCommentTitle"),
        content: this.$t("common.deletePrompt"),
        onOk: () => {
          commentService.deleteComment({commentId:commentId,postId:this.postInfo.postId})
              .then(() => {
                this.$emit("getCommentByPostId");

                //以下通过vuex更新贴子统计数据
                let commentRefreshPostStatisticalData = this.$store.state.commentRefreshPostStatisticalData;
                this.$store.commit("changeCommentRefreshPostStatisticalData", !commentRefreshPostStatisticalData);

              })
              .catch((err) => {
                this.$message.error(err.msg);
              });
        },
      });
    },

    // 路由到用户中心页面
    routerUserCenter(userId) {
      let routeData = this.$router.resolve("/user/" + userId);
      window.open(routeData.href, '_blank');
    },

  },
}
</script>

<style lang="less" >
#child-comment {
  /* 背景色逐渐消失-start */
  @keyframes myAnimation {
    from {
      background-color: rgba(19,194,194,0.15);
    }
    to {
      background-color: transparent;
    }
  }
  .selectedComment {
    animation: myAnimation 8s running;
    transition: background-color 8s;
  }
  /* 背景色逐渐消失-end */
}

#child-comment .ant-comment-content-author-name {
  width: 100%;

  .username {
    font-size: 14px;
  }

  .time {
    float: right;
    cursor: auto;
  }

}

#child-comment .operate .iconfont:hover {
  color: #8a919fb3 !important;
}

#child-comment .comment-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;

  span {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    //-webkit-line-clamp: 3;
    /* 实现长英文字母自动换行*/
    word-break: break-all;
  }

  .del {
    cursor: pointer;
    color: red;
    padding-right: 8px;
  }
}

#child-comment .comment-comment, .comment-operate {
  margin-left: 16px;
}

#child-comment .ant-comment-nested {
  margin-left: 20px;
}

#child-comment .ant-comment-inner {
  padding: 5px 0;
}

</style>
