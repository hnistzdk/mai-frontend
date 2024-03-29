<template>
  <div id="personal-info-display" class="card-container">
      <!--  搜索框   -->
    <a-space direction="vertical">
      <a-input-search :loading="!finish"
                      enter-button
                      allow-clear
                      v-model="query"
                      :placeholder="$t('common.searchPlaceholder')"
                      style="width: 250%; padding-bottom: 10%"
                      @search="onSearch"
                      :maxLength="50"
      />
    </a-space>

    <a-tabs :default-active-key="defaultActiveKey"
            @change="changeTab"
            type="card"
            :tabBarGutter="0">

      <!--  贴子tab -->
      <a-tab-pane key="post">
        <span slot="tab">
          <i class="iconfont icon-relat-post"></i>
          {{ $t("common.post") }}
        </span>
        <!-- 贴子 -->
        <SearchPagePost
            v-if="isPostTab && !spinning"
            :finish="finish"
            :hasNext="hasNext"
            :data="postData"
            :userId="userId"
            @refresh="postRefresh"
            style="background: #fff;"/>
        <a-skeleton v-if="showSkeleton"/>
      </a-tab-pane>

      <!--  职言tab -->
      <a-tab-pane key="gossip">
        <span slot="tab">
          <i class="iconfont icon-relat-post"></i>
          {{ $t("common.gossip") }}
        </span>
        <!-- 职言 -->
        <SearchPagePost
            v-if="isGossipTab && !spinning"
            :finish="finish"
            :hasNext="hasNext"
            :data="gossipData"
            :userId="userId"
            @refresh="gossipRefresh"
            style="background: #fff;"/>
        <a-skeleton v-if="showSkeleton"/>
      </a-tab-pane>

      <!--  用户tab -->
      <a-tab-pane key="user">
        <span slot="tab">
          <i class="iconfont icon-relat-post"></i>
          {{ $t("common.userTab") }}
        </span>
        <!-- 用户 -->
        <SearchPagePost
            v-if="isGossipTab && !spinning"
            :finish="finish"
            :hasNext="hasNext"
            :data="gossipData"
            :userId="userId"
            @refresh="gossipRefresh"
            style="background: #fff;"/>
        <SearchUserList
            v-if="isUserTab && !spinning"
            :finish="finish"
            :hasNext="hasNext"
            :data="userData"
            :userId="userId"
            @refresh="userRefresh"
            style="background: #fff;"/>
        <a-skeleton v-if="showSkeleton"/>
      </a-tab-pane>

      <!-- 选择排序方式 -->
      <span v-if="isPostTab || isGossipTab" slot="tabBarExtraContent">
          <a-radio-group :default-value="sortRule" size="small" @change="onChangeRadio">
            <a-radio-button value="hottest">
              {{ $t("common.hottest") }}
            </a-radio-button>
            <a-radio-button value="newest">
              {{ $t("common.newest") }}
            </a-radio-button>
          </a-radio-group>
        </span>
    </a-tabs>
  </div>
</template>

<script>
import SearchPagePost from "@/components/search/SearchPagePost";
import searchService from "@/service/searchService";
import SearchUserList from "@/components/search/SearchUserList";

export default {

  components: {SearchUserList, SearchPagePost},

  props: {
    userId: {type: Number, default: 0},
  },

  data() {
    return {
      defaultActiveKey: 'post',
      // 是否在贴子tab下
      isPostTab: false,
      // 是否在职言tab下
      isGossipTab: false,
      // 是否在用户tab下
      isUserTab: false,
      // 贴子
      postData: [],
      // 贴子总数
      postCount: 0,
      // 职言
      gossipData: [],
      // 职言总数
      gossipCount: 0,
      // 用户
      userData: [],
      // 用户总数
      userCount: 0,
      // hasNext和finish名称不能改(和滚动加载相关)
      hasNext: true,
      finish: false,
      // 加载中...
      spinning: true,
      // 加载中...
      dynamicSpinning: true,
      query: '',
      sortRule: 'hottest',
      params: {currentPage: 1, pageSize: global.defaultPageSize, userId: this.userId},
      showSkeleton: false,
    };
  },

  methods: {

    /**
     * 搜索排序规则改变时的事件
     * @param e
     */
    onChangeRadio(e) {
      this.sortRule = e.target.value;
      if (this.isPostTab) {
        // 刷新列表
        this.postRefresh()
      }
      if (this.isGossipTab) {
        this.gossipRefresh()
      }
      if (this.isUserTab){
        this.userRefresh();
      }
    },

    /**
     * 构建贴子搜索时的参数
     * @returns {{pageSize: *, currentPage: number, userId: *}}
     */
    buildPostSearchParams(){
        let params = this.params;
        if (this.isPostTab){
          params.sortRule = this.sortRule;
          params.type = 1;
        }
        if (this.isGossipTab){
          params.sortRule = this.sortRule;
          params.type = 2;
        }
        params.query = this.query;
        params.userId = this.userId;
        return params;
    },


    /**
     * 搜索框事件
     * @param value
     */
    onSearch(value) {
      this.finish = false;
      this.query = value;
      let params = this.buildPostSearchParams();
      if (this.isPostTab) {
        this.searchPost(params);
      }
      if (this.isGossipTab) {
        this.searchGossips(params);
      }
      if (this.isUserTab) {
        this.searchUser(params);
      }
    },


    /**
     * 滚动加载
     */
    loadMore() {
      this.params.currentPage++;
      let params = this.buildPostSearchParams();
      if (this.isPostTab) {
        this.searchPost(params, true);
      }
      if (this.isGossipTab) {
        this.searchGossips(params, true);
      }
      if (this.isUserTab){
        this.searchUser(params,true);
      }
    },


    /**
     * 搜索贴子
     * @param params
     * @param isLoadMore
     */
    searchPost(params, isLoadMore) {
      if (!isLoadMore) {
        this.params.currentPage = 1;
      }
      this.finish = false;
      params = this.buildPostSearchParams();
      if (params.query.length === 0){
        this.finish = true;
        this.hasNext = false;
        return;
      }
      this.showSkeleton = true;
      searchService.searchPost(params)
          .then(res => {
            if (isLoadMore) {
              this.postData = this.postData.concat(res.data.list);
              this.hasNext = res.data.list.length !== 0;
            } else {
              this.postData = res.data.list;
            }
            this.postCount = res.data.totalCount;
            this.finish = true;
            this.spinning = false;
            this.showSkeleton = false;
          })
          .catch(err => {
            this.finish = true;
            this.hasNext = false;
            this.showSkeleton = false;
            this.$message.error(err.msg);
          });
    },

    /**
     * 搜索职言
     * @param params
     * @param isLoadMore
     */
    searchGossips(params, isLoadMore) {
      if (!isLoadMore) {
        this.params.currentPage = 1;
      }
      this.finish = false;
      params = this.buildPostSearchParams();
      if (params.query.length === 0){
        this.finish = true;
        this.hasNext = false;
        return;
      }
      this.showSkeleton = true;
      searchService.searchPost(params)
          .then(res => {
            if (isLoadMore) {
              this.gossipData = this.gossipData.concat(res.data.list);
              this.hasNext = res.data.list.length !== 0;
            } else {
              this.gossipData = res.data.list;
            }
            this.gossipCount = res.data.totalCount;
            this.finish = true;
            this.spinning = false;
            this.showSkeleton = false;
          })
          .catch(err => {
            this.finish = true;
            this.hasNext = false;
            this.showSkeleton = false;
            this.$message.error(err.msg);
          });
    },

    /**
     * 搜索用户
     * @param params
     * @param isLoadMore
     */
    searchUser(params, isLoadMore) {
      if (!isLoadMore) {
        this.params.currentPage = 1;
      }
      this.finish = false;
      params = this.buildPostSearchParams();
      if (params.query.length === 0){
        this.finish = true;
        this.hasNext = false;
        return;
      }
      this.showSkeleton = true;
      searchService.searchUser(params)
          .then(res => {
            if (isLoadMore) {
              this.userData = this.userData.concat(res.data.list);
              this.hasNext = res.data.list.length !== 0;
            } else {
              this.userData = res.data.list;
            }
            this.userCount = res.data.totalCount;
            this.finish = true;
            this.spinning = false;
            this.showSkeleton = false;
          })
          .catch(err => {
            this.finish = true;
            this.hasNext = false;
            this.showSkeleton = false;
            this.$message.error(err.msg);
          });
    },


    // 刷新列表
    postRefresh() {
      let params = this.buildPostSearchParams();
      this.searchPost(params);
    },
    gossipRefresh() {
      let params = this.buildPostSearchParams();
      this.searchGossips(params);
    },
    userRefresh() {
      let params = this.buildPostSearchParams();
      this.searchUser(params);
    },

    // tab切换回调
    changeTab(activeKey, isFirst) {
      if (activeKey === 'post') {
        this.isPostTab = true;
        this.isGossipTab = false;
        this.isUserTab = false;
        this.hasNext = true;
        let params = this.buildPostSearchParams();
        this.searchPost(params);
        // 解決和mounted()滚动加载重复的问题
        if (!isFirst) {
          // 监听滚动，做滚动加载
          this.$utils.scroll.call(this, document.querySelector('#app'));
        }
      }
      if (activeKey === 'gossip') {
        this.isPostTab = false;
        this.isGossipTab = true;
        this.isUserTab = false;
        this.hasNext = true;
        let params = this.buildPostSearchParams();
        this.searchGossips(params);
        // 解決和mounted()滚动加载重复的问题
        if (!isFirst) {
          // 监听滚动，做滚动加载
          this.$utils.scroll.call(this, document.querySelector('#app'));
        }
      }
      if (activeKey === 'user') {
        this.isPostTab = false;
        this.isGossipTab = false;
        this.isUserTab = true;
        this.hasNext = true;
        let params = this.buildPostSearchParams();
        this.searchUser(params);
        // 解決和mounted()滚动加载重复的问题
        if (!isFirst) {
          // 监听滚动，做滚动加载
          this.$utils.scroll.call(this, document.querySelector('#app'));
        }
      }
    },
  },

  mounted() {
    // 监听滚动，做滚动加载
    this.query = this.$route.query.query;
    this.$utils.scroll.call(this, document.querySelector('#app'));
  },

  created() {
    this.query = this.$route.query.query;
    this.defaultActiveKey = this.$route.params.userCenterTab === undefined ? 'post' : this.$route.params.userCenterTab;
    this.changeTab(this.defaultActiveKey, true);
  },

  watch: {
    // 路由值改变时触发
    $route() {
      // 跳转到该页面后需要进行的操作
      this.query = this.$route.query.query;
      this.onSearch(this.$route.query.query)
    }
  }

}
</script>

<style scoped>
.card-container {
  background: #f5f5f5;
  overflow: hidden;
  padding: 24px;
}
.card-container > .ant-tabs-card > .ant-tabs-content {
  height: 120px;
  margin-top: -16px;
}

.card-container > .ant-tabs-card > .ant-tabs-content > .ant-tabs-tabpane {
  background: #fff;
  padding: 16px;
}

.card-container > .ant-tabs-card > .ant-tabs-bar {
  border-color: #fff;
}

.card-container > .ant-tabs-card > .ant-tabs-bar .ant-tabs-tab {
  border-color: transparent;
  background: transparent;
}

.card-container > .ant-tabs-card > .ant-tabs-bar .ant-tabs-tab-active {
  border-color: #fff;
  background: #fff;
}
</style>
