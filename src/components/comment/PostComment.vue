<template>
  <div id="post-comment"
       :style="$store.state.collapsed ? 'padding: 10px' : 'padding: 20px;'">
    <p class="title">{{ $t('common.comment') }}</p>
    <CreateComment
        :post-info="postInfo"
        :id="'postTextarea'"
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
    <!--  下方的评论组件  -->
    <ChildComment v-else
                  v-for="(item, index) of comments"
                  :data="item"
                  :key="index"
                  :postUserId="postUserId"
                  :postInfo="postInfo"
                  :comment-info="item"
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
      // 当前贴子的作者id
      postUserId: {type: Number, default: 0},
      // 贴子总的评论数
      postCommentCount: {type: Number, default: 0},
      //贴子信息
      postInfo: {},
    },

    data() {
      return {
        comments: [],
        // 排序规则（默认最热）
        sortRule: 'hottest',
        // hasNext和finish名称不能改(和滚动加载相关)
        hasNext: true,
        finish: false,
        currentPage: 1,
        pageSize: global.defaultPageSize,
        userId:this.userId,
        totalCount:0
      };
    },

    methods: {
      onChange(e) {
        this.sortRule = e.target.value;
        this.refresh();
      },

      loadMore(){
        this.currentPage++;
        this.getCommentByPostId(true);
      },

      // 获取贴子的评论信息
      getCommentByPostId(isLoadMore) {
        if (!isLoadMore) {
          this.currentPage = 1;
        }
        this.finish = false;
        commentService.getCommentByPostId({postId: this.$route.params.id, sortRule: this.sortRule,currentPage:this.currentPage,pageSize:this.pageSize})
            .then((res) => {
              if (isLoadMore){
                this.comments = this.comments.concat(res.data.list);
                this.hasNext = res.data.list.length !== 0;
              }else {
                this.comments = res.data.list;
              }
              this.totalCount = res.data.totalCount;
              this.finish = true;
            })
            .catch(err => {
              this.finish = true;
              this.$message.error(err.msg);
            });
      },

      // 刷新
      refresh() {
        this.getCommentByPostId();
        // 获取文章一些统计数据(刷新)
        this.$emit("refresh");
      },
      //处理下拉刷新
      handleScroll(){
        let app = document.querySelector("#app");
        let currentScrollTop = app.scrollTop;
        let currentOffsetHeight = app.scrollHeight;
        let currentClientHeight = app.clientHeight;
        if ((currentScrollTop + currentClientHeight >= currentOffsetHeight) && (this.comments.length < this.totalCount)) {
          this.loadMore();
        }
      }
    },

    mounted() {
      this.getCommentByPostId();
      document.querySelector("#app").addEventListener("scroll", this.handleScroll,true);
    },

    destroyed() {
      window.removeEventListener('scroll',this.handleScroll,true);
    }

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
