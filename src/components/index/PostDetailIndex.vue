<template>
  <a-layout>
    <a-layout id="post-detail-index">
      <IndexHeader class="header"/>
      <a-layout-content>
        <!-- 解决手机端mavonEditor代码块code布局问题 -->
        <main class="content" :style="$store.state.collapsed ? 'width: 100%;' : 'width: 1100px;'">
          <div class="post-left-buttons">
            <!-- 左边浮着的那些按钮 -->
            <LeftButtons
                @postCommentCountFn="postCommentCountFn"
                ref="child"/>
          </div>
          <a-col :span="$store.state.collapsed ? 24 : 18"
                 :style="$store.state.collapsed ? '' : 'border-right: 20px solid #f0f2f5'">
            <!-- 文章详情 -->
            <PostDetail
                @initLabelIds="initLabelIds"
                @initPostInfo="initPostInfo"
                style="background: #fff;"/>
            <br/>
            <!-- 文章评论 -->
            <PostComment
                @refresh="refresh"
                :postUserId="userId"
                :postCommentCount="postCommentCount"
                :post-info="postInfo"
                style="background: #fff"/>
            <a-row>
              <a-col :span="24" style="height: 10px;"/>
            </a-row>
          </a-col>
          <a-col v-if="!$store.state.collapsed" :span="6">
            <!-- 作者板块 -->
            <AuthorBlock
                v-if="finishPostDetail"
                :userId="userId"
                style="background: #fff;"/>
            <a-row>
              <a-col :span="24" style="height: 10px;"/>
            </a-row>
            <!-- 相关文章 -->
            <RelatPost
                v-if="finishPostDetail"
                :labelIds="labelIds"
                style="background: #fff;"/>
            <a-row>
              <a-col :span="24" style="height: 10px;"/>
            </a-row>
            <!-- 作者榜 -->
            <AuthorsList style="background: #fff;"/>
            <a-row>
              <a-col :span="24" style="height: 10px;"/>
            </a-row>
            <!-- 目录 -->
            <Toc v-if="postHtml"
                 :postHtml="postHtml"
                 style="background: #fff;"/>
            <a-row>
              <a-col :span="24" style="height: 10px;"/>
            </a-row>
            <!-- 备案信息 -->
<!--            <FilingInfo/>-->
          </a-col>
        </main>
      </a-layout-content>
      <FooterButtons v-if="!$store.state.collapsed"/>
    </a-layout>
  </a-layout>
</template>

<script>
  import IndexHeader from "@/components/index/head/IndexHeader";
  import AuthorsList from "@/components/right/AuthorsList";
  import FilingInfo from "@/components/right/FilingInfo";
  import PostDetail from "@/components/post/PostDetail";
  import FooterButtons from "@/components/utils/FooterButtons";
  import LeftButtons from "@/components/post/LeftButtons";
  import PostComment from "@/components/comment/PostComment";
  import AuthorBlock from "@/components/right/AuthorBlock";
  import RelatPost from "@/components/right/RelatPost";
  import Toc from "@/components/right/MarkdownToc";

  export default {
    components: {
      IndexHeader,
      PostDetail,
      AuthorBlock,
      AuthorsList,
      FilingInfo,
      FooterButtons,
      LeftButtons,
      PostComment,
      RelatPost,
      Toc
    },

    data() {
      return {
        postHtml: '',
        finishPostDetail: false,
        labelIds: [],
        // 当前文章的作者
        userId: 0,
        // 文章总的评论数
        postCommentCount: 0,
        postInfo: {},
      };
    },

    methods: {
      // 初始化标签等
      initLabelIds(labelIds, finishPostDetail, userId, postHtml) {
        this.labelIds = labelIds;
        this.finishPostDetail = finishPostDetail;
        this.userId = userId;
        this.postHtml = this.$utils.toToc(postHtml);
      },
      //把贴子信息传回来
      initPostInfo(postInfo){
        this.postInfo = postInfo;
        this.postHtml = this.$utils.toToc(postInfo.html);
      },

      refresh() {
        // 获取文章一些统计数据
        this.$refs.child.getStatisticalData()
      },

      postCommentCountFn(commentCount) {
        this.postCommentCount = commentCount;
      }
    }

  };
</script>


<style>
  #post-detail-index .header {
    position: fixed;
    width: 100%;
    z-index: 999;
    background: #fff;
    border-bottom: 1px solid #00000021;
  }

  #post-detail-index .content {
    margin-top: 64px;
  }

  #post-detail-index .ant-layout-header {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  #post-detail-index .ant-layout-content {
    display: flex;
    justify-content: center;
  }

  #post-detail-index .post-left-buttons {
    position: relative;
    right: 70px;
    top: 140px;
  }

  #post-detail-index .ant-layout-header {
    background: #fff;
    height: auto;
    line-height: 2.3;
  }

  .index-drawer-wrap .ant-drawer-content-wrapper {
    width: 250px !important;
  }

  #components-layout-demo-custom-trigger .trigger {
    font-size: 18px;
    line-height: 64px;
    padding: 0 24px;
    cursor: pointer;
    transition: color 0.3s;
  }

  #components-layout-demo-custom-trigger .trigger:hover {
    color: #1890ff;
  }

  #components-layout-demo-custom-trigger .logo {
    height: 64px;
    background: rgba(255, 255, 255, 0.2);
    margin: 0;
  }
</style>
