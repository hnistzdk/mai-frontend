<template>
  <a-layout>
    <a-layout id="components-layout-basic">
      <IndexHeader class="header"
                   @refresh="refresh"
                   :searchContent="searchContent"/>
      <a-layout-content>
        <main class="content">
          <a-col :span="$store.state.collapsed ? 24 : 18"
                 :style="$store.state.collapsed ? '' : 'border-right: 20px solid #f0f2f5'">
            <CustomEmpty v-if="spinning"/>
            <div v-else>
              <!-- 发布  -->
              <IndexCreate v-if="$store.state.isLogin"/>


              <a-row v-if="!$store.state.collapsed && $store.state.isCarousel">
                <a-col :span="24" style="height: 2px;"/>
              </a-row>
              <!-- 贴子列表 -->
              <FrontPagePost v-if="!spinning"
                             :finish="finish"
                             :hasNext="hasNext"
                             :data="listData"
                             :service="postService"
                             @refresh="refresh"
                             style="background: #fff;"/>
            </div>
          </a-col>
          <a-col v-if="!$store.state.collapsed" :span="6">

            <a-row>
              <a-col :span="24" style="height: 10px;"/>
            </a-row>
            <!-- 作者榜 -->
            <AuthorsList style="background: #fff;"/>
            <a-row>
              <a-col :span="24" style="height: 10px;"/>
            </a-row>
            <!-- 全站热榜 -->
            <HotList style="background: #fff;"/>
            <a-row>
              <a-col :span="24" style="height: 10px;"/>
            </a-row>
          </a-col>
        </main>
      </a-layout-content>
      <FooterButtons v-if="!$store.state.collapsed"/>
    </a-layout>
  </a-layout>
</template>

<script>
import IndexHeader from "@/components/index/head/IndexHeader";
import FrontPagePost from "@/components/post/FrontPagePost";
import postService from "@/service/postService";
import AuthorsList from "@/components/right/AuthorsList";
import FooterButtons from "@/components/utils/FooterButtons";
import CustomEmpty from "@/components/utils/CustomEmpty";
import HotList from "@/components/right/HotList";
import IndexCreate from "@/components/post/IndexCreate";

export default {

  components: {
    IndexHeader,
    FooterButtons,
    FrontPagePost,
    AuthorsList,
    CustomEmpty,
    HotList,
    IndexCreate,
  },
  data() {
    return {
      // 加载中...
      spinning: true,
      postService: postService,
      listData: [],
      pendingReviewData: [],
      reviewRejectedData: [],
      totalCount: 0,
      totalPage: 0,
      pendingReviewTotal: 0,
      reviewRejectedTotal: 0,
      hasNext: true,
      finish: false,
      params: {currentPage: 1, pageSize: global.defaultPageSize, type:2},
      searchContent: '',
    };
  },

  methods: {
    // 加载更多（滚动加载）
    loadMore() {
      this.params.currentPage++;
      this.getPostList(this.params, true);
    },

    // 获取贴子列表信息
    getPostList(params, isLoadMore) {
      if (!isLoadMore) {
        this.params.currentPage = 1;
      }
      this.finish = false;
      postService.getPostList(params)
          .then(res => {
            if (isLoadMore) {
              this.listData = this.listData.concat(res.data.list);
              this.hasNext = res.data.list.length !== 0;
            } else {
              this.listData = res.data.list;
            }
            this.totalCount = res.data.totalCount;
            this.totalPage = res.data.totalPage;
            this.spinning = false;
            this.finish = true;
          })
          .catch(err => {
            this.finish = true;
            this.hasNext = false;
            this.$message.error(err.msg);
          });
    },

    // 刷新列表
    refresh() {
      this.params = {currentPage: 1, pageSize: global.defaultPageSize, type: 2};
      this.getPostList(this.params);
    },
  },

  mounted() {
    let query = this.$route.query.query;
    this.searchContent = query;
    this.params.title = query;
    this.getPostList(this.params);
    // 监听滚动，做滚动加载
    this.$utils.scroll.call(this, document.querySelector('#app'));
  },

  watch: {
    // 路由值改变时触发
    $route() {
      // 跳转到该页面后需要进行的操作
      let query = this.$route.query.query;
      this.searchContent = query;
      this.params.title = query;
      this.getPostList(this.params);
    }
  }
};
</script>


<style>
#components-layout-basic .header {
  position: fixed;
  z-index: 999;
  width: 100%;
  background: #fff;
  border-bottom: 1px solid #00000021;
}

#components-layout-basic .content {
  margin-top: 64px;
  width: 1100px;
}

#components-layout-basic .ant-layout-header, .ant-layout-content {
  display: flex;
  align-items: center;
  justify-content: center;
}

#components-layout-basic .ant-layout-header {
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
