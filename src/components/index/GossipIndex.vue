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
              <!-- 轮播图 -->
              <!--              <SlideShow v-if="!$store.state.collapsed && $store.state.isCarousel"/>-->
              <!-- 发布  -->
              <IndexCreate v-if="$store.state.isLogin"/>


              <a-row v-if="!$store.state.collapsed && $store.state.isCarousel">
                <a-col :span="24" style="height: 2px;"/>
              </a-row>
              <!-- 管理员才需要 -->
              <a-tabs default-active-key="approved" @change="changeTab" style="background: #fff;" v-if="$store.state.isManage">
                <a-tab-pane key="approved">
                  <span slot="tab">
                    {{ $t("common.approved") + "(" + totalCount + ")" }}
                  </span>
                  <!-- 贴子列表 -->
                  <FrontPagePost v-if="!spinning && isApprovedTab"
                                 :finish="finish"
                                 :hasNext="hasNext"
                                 :data="listData"
                                 :service="postService"
                                 :isAdminAudit="true"
                                 @updateData="updateData"
                                 @updateTotal="updateTotal"
                                 @updateReviewRejectedTotal="updateReviewRejectedTotal"
                                 @refresh="refresh"
                                 style="background: #fff;"/>
                </a-tab-pane>
                <a-tab-pane key="pendingReview">
                  <span slot="tab">
                    {{ $t("common.pendingReview") + "(" + pendingReviewTotal + ")"}}
                  </span>
                  <!-- 贴子列表 -->
                  <FrontPagePost v-if="!spinning && isPendingReviewTab"
                                 :finish="finish"
                                 :hasNext="hasNext"
                                 :data="pendingReviewData"
                                 :service="postService"
                                 :isAdminAudit="true"
                                 @updatePendingReviewData="updatePendingReviewData"
                                 @updatePendingReviewTotal="updatePendingReviewTotal"
                                 @updateTotal="updateTotal"
                                 @updateReviewRejectedTotal="updateReviewRejectedTotal"
                                 @refresh="refresh"
                                 style="background: #fff;"/>
                </a-tab-pane>
                <a-tab-pane key="reviewRejected">
                  <span slot="tab">
                    {{ $t("common.reviewRejected") + "(" + reviewRejectedTotal + ")"}}
                  </span>
                  <!-- 贴子列表 -->
                  <FrontPagePost v-if="!spinning && isReviewRejectedTab"
                                 :finish="finish"
                                 :hasNext="hasNext"
                                 :data="reviewRejectedData"
                                 :service="postService"
                                 :isAdminAudit="true"
                                 @updateReviewRejectedData="updateReviewRejectedData"
                                 @updateTotal="updateTotal"
                                 @updateReviewRejectedTotal="updateReviewRejectedTotal"
                                 @refresh="refresh"
                                 style="background: #fff;"/>
                </a-tab-pane>
              </a-tabs>
              <!-- 贴子列表 -->
              <FrontPagePost v-if="!$store.state.isManage && !spinning"
                             :finish="finish"
                             :hasNext="hasNext"
                             :data="listData"
                             :service="postService"
                             @refresh="refresh"
                             style="background: #fff;"/>
            </div>
          </a-col>
          <a-col v-if="!$store.state.collapsed" :span="6">
            <!-- 系统简介 -->
<!--            <ProjectIntro style="background: #fff;"/>-->
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
<!--            &lt;!&ndash; 友情捐赠 &ndash;&gt;-->
<!--            <FriendDonate style="background: #fff;"/>-->
<!--            <a-row>-->
<!--              <a-col :span="24" style="height: 10px;"/>-->
<!--            </a-row>-->
<!--            &lt;!&ndash; 备案信息 &ndash;&gt;-->
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
import SlideShow from "@/components/concern/SlideShow";
import FrontPagePost from "@/components/post/FrontPagePost";
import ProjectIntro from "@/components/right/ProjectIntro";
import postService from "@/service/postService";
import AuthorsList from "@/components/right/AuthorsList";
import FilingInfo from "@/components/right/FilingInfo";
import FooterButtons from "@/components/utils/FooterButtons";
import CustomEmpty from "@/components/utils/CustomEmpty";
import HotList from "@/components/right/HotList";
import FriendDonate from "@/components/right/FriendDonate";
import IndexCreate from "@/components/post/IndexCreate";
import userService from "@/service/userService";

export default {

  components: {
    IndexHeader,
    FooterButtons,
    SlideShow,
    FrontPagePost,
    ProjectIntro,
    AuthorsList,
    FilingInfo,
    CustomEmpty,
    HotList,
    IndexCreate,
    FriendDonate
  },
  beforeUpdate() {
    if (this.$store.state.isLogin){
      userService.validateExpire()
          .then(res=>{
          }).catch(error=>{

      });
    }
  },
  data() {
    return {
      // 是否在审批通过tab下
      isApprovedTab: true,
      isPendingReviewTab: false,
      isReviewRejectedTab: false,
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
      params: {currentPage: 1, pageSize: 12, type:2},
      searchContent: '',
    };
  },

  methods: {
    // 加载更多（滚动加载）
    loadMore() {
      this.params.currentPage++;
      if (this.isApprovedTab) {
        this.getPostList(this.params, true);
      }
      if (this.isPendingReviewTab) {
        this.getPendingReviewPosts(this.params, true);
      }
      if (this.isReviewRejectedTab) {
        this.getDisabledPosts(this.params, true);
      }
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

    // 获取待审核的贴子
    getPendingReviewPosts(params, isLoadMore) {
      if (!isLoadMore) {
        this.params.currentPage = 1;
      }
      this.finish = false;
      postService.getPendingReviewPosts(params)
          .then(res => {
            if (isLoadMore) {
              this.pendingReviewData = this.pendingReviewData.concat(res.data.list);
              this.hasNext = res.data.list.length !== 0;
            } else {
              this.pendingReviewData = res.data.list;
            }
            this.pendingReviewTotal = res.data.total;
            this.spinning = false;
            this.finish = true;
          })
          .catch(err => {
            this.finish = true;
            this.$message.error(err.msg);
          });
    },

    // 获取禁用的贴子
    getDisabledPosts(params, isLoadMore) {
      if (!isLoadMore) {
        this.params.currentPage = 1;
      }
      this.finish = false;
      postService.getDisabledPosts(params)
          .then(res => {
            if (isLoadMore) {
              this.reviewRejectedData = this.reviewRejectedData.concat(res.data.list);
              this.hasNext = res.data.list.length !== 0;
            } else {
              this.reviewRejectedData = res.data.list;
            }
            this.reviewRejectedTotal = res.data.total;
            this.spinning = false;
            this.finish = true;
          })
          .catch(err => {
            this.finish = true;
            this.$message.error(err.msg);
          });
    },

    // 刷新列表
    refresh() {
      this.params = {currentPage: 1, pageSize: 10, type: 2};
      this.getPostList(this.params);
    },

    // tab切换回调
    changeTab(activeKey) {
      if (activeKey === 'approved') {
        this.isApprovedTab = true;
        this.isPendingReviewTab = false;
        this.isReviewRejectedTab = false;
        this.hasNext = true;
        this.getPostList(this.params);
        // 监听滚动，做滚动加载
        this.$utils.scroll.call(this, document.querySelector('#app'));
      }
      if (activeKey === 'pendingReview') {
        this.isApprovedTab = false;
        this.isPendingReviewTab = true;
        this.isReviewRejectedTab = false;
        this.hasNext = true;
        this.getPendingReviewPosts(this.params);
        // 监听滚动，做滚动加载
        this.$utils.scroll.call(this, document.querySelector('#app'));
      }
      if (activeKey === 'reviewRejected') {
        this.isApprovedTab = false;
        this.isPendingReviewTab = false;
        this.isReviewRejectedTab = true;
        this.hasNext = true;
        this.getDisabledPosts(this.params);
        // 监听滚动，做滚动加载
        this.$utils.scroll.call(this, document.querySelector('#app'));
      }
    },

    // 通过
    updateTotal(count) {
      this.totalCount += count;
    },
    // 同步data变化
    updateData(tempData) {
      this.listData = tempData;
    },
    // 拒绝
    updateReviewRejectedTotal(count) {
      this.reviewRejectedTotal += count;
    },
    updateReviewRejectedData(tempData) {
      this.reviewRejectedData = tempData;
    },
    // 待审核
    updatePendingReviewTotal(count) {
      this.pendingReviewTotal += count;
    },
    updatePendingReviewData(tempData) {
      this.pendingReviewData = tempData;
    },
  },

  mounted() {
    let query = this.$route.query.query;
    this.searchContent = query;
    this.params.title = query;
    this.getPostList(this.params);
    if (this.$store.state.isManage) {
      this.getPendingReviewPosts(this.params);
      this.getDisabledPosts(this.params);
    }
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
