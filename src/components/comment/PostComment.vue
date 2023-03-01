<template>
  <div id="post-comment"
       :style="$store.state.collapsed ? 'padding: 10px' : 'padding: 20px;'">
    <p class="title">{{ $t('common.comment') }}</p>
    <CreateComment
        @refresh="refresh"/>

    <div class="commentText">
      <p class="text"><span id="post-comment-all"></span>{{ $t('common.hotComment') }}</p>
      <span style="color:#9499a0; padding: 0 15px 0 5px">{{ postCommentCount }}</span>
      <span>
        <a-radio-group :default-value="sortRule" size="small" @change="onChange">
          <a-radio-button value="hottest">
            {{ $t("common.hottest") }}
          </a-radio-button>
          <a-radio-button value="newest">
            {{ $t("common.newest") }}
          </a-radio-button>
        </a-radio-group>
      </span>
    </div>

    <a-empty :description="false" v-if="comments.length === 0"/>
    <ChildComment v-else
                  v-for="(item, index) of comments"
                  :data="item"
                  :key="index"
                  :postUserId="postUserId"
                  @getCommentByPostId="getCommentByPostId"/>
  </div>
</template>

<script>
  import ChildComment from "@/components/comment/ChildComment";
  import commentService from "@/service/commentService";
  import CreateComment from "@/components/comment/CreateComment";

  export default {
    components: {ChildComment, CreateComment},

    props: {
      // 当前文章的作者
      postUserId: {type: Number, default: 0},
      // 文章总的评论数
      postCommentCount: {type: Number, default: 0},
    },

    data() {
      return {
        comments: [],
        // 排序规则（默认最热）
        sortRule: 'hottest',
      };
    },

    methods: {
      onChange(e) {
        this.sortRule = e.target.value;
        this.refresh();
      },

      // 获取文章的评论信息
      getCommentByPostId() {
        commentService.getCommentByPostId({postId: this.$route.params.id, sortRule: this.sortRule})
            .then((res) => {
              this.comments = res.data;
            })
            .catch(err => {
              this.$message.error(err.desc);
            });
      },

      // 刷新
      refresh() {
        this.getCommentByPostId();
        // 获取文章一些统计数据(刷新)
        this.$emit("refresh");
      },
    },

    mounted() {
      this.getCommentByPostId();
    },

  }
</script>

<style lang="less" scoped>
  #post-comment {
    #post-comment-all {
      /* 优化文章标题锚点跳转时被顶部导航栏遮挡 */
      margin-top: -70px;
      padding-top: 70px;
    }

    .title {
      font-size: 18px;
      font-weight: 600;
      color: #252933;
      line-height: 30px;
    }

    .commentText {
      display: flex;
      justify-content: flex-start;
      text-align: center;
      line-height: 30px;

      .text {
        font-size: 18px;
        font-weight: 600;
        color: #252933;
      }
    }

  }
</style>
