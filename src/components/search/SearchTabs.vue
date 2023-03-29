<template>
  <div id="personal-info-display">
      <!--  搜索框   -->
    <a-space direction="vertical">
      <a-input-search v-model="query" :placeholder="$t('common.searchPlaceholder')"
                      style="min-width: 100px; width: 100%"
                      @search="onSearch"
      />
    </a-space>
    <a-tabs :default-active-key="defaultActiveKey" @change="changeTab">
      <a-tab-pane key="post">
        <span slot="tab">
          <i class="iconfont icon-relat-post"></i>
<!--          {{ $t("common.post") + ' ' + postCount }}-->
          {{ $t("common.post") }}
        </span>
        <!-- 贴子列表 -->
        <SearchPagePost
            v-if="isPostTab"
            :finish="finish"
            :hasNext="hasNext"
            :data="postData"
            :userId="userId"
            @refresh="postRefresh"
            style="background: #fff;"/>
      </a-tab-pane>
      <a-tab-pane key="gossip">
        <span slot="tab">
          <i class="iconfont icon-relat-post"></i>
<!--          {{ $t("common.gossip") + ' ' + gossipCount }}-->
          {{ $t("common.gossip") }}
        </span>
        <!-- 职言列表 -->
        <SearchPagePost
            v-if="isGossipTab"
            :finish="finish"
            :hasNext="hasNext"
            :data="gossipData"
            :userId="userId"
            @refresh="gossipRefresh"
            style="background: #fff;"/>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import SearchPagePost from "@/components/search/SearchPagePost";
import searchService from "@/service/searchService";

export default {

  components: {SearchPagePost},

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
      // 我的贴子
      postData: [],
      // 发表贴子总数
      postCount: 0,
      // 职言
      gossipData: [],
      // 发表职言总数
      gossipCount: 0,
      // hasNext和finish名称不能改(和滚动加载相关)
      hasNext: true,
      finish: false,
      // 加载中...
      dynamicSpinning: true,
      params: {currentPage: 1, pageSize: global.defaultPageSize, userId: this.userId},
      query: '',
    };
  },

  methods: {
    // 搜索
    onSearch(value) {
      this.query = value;
      let params = this.params;
      params.query = value;
      this.searchPost(params);
    },
    // 加载更多（滚动加载）
    loadMore() {
      this.params.currentPage++;
      if (this.isPostTab) {
        let params = this.params;
        params.type = 1;
        this.searchPost(params, true);
      }
      if (this.isGossipTab) {
        let params = this.params;
        params.type = 2;
        this.searchGossips(params, true);
      }
    },


    // 获取个人发布的贴子（所有）
    searchPost(params, isLoadMore) {
      if (!isLoadMore) {
        this.params.currentPage = 1;
      }
      this.finish = false;
      params.userId = this.userId;
      params.query = this.query;
      this.$delete(params, 'userId');
      // 不是管理员
      if (!this.$store.state.isManage) {
        // 只看启用的贴子
        params.postStateEnum = "enable";
      }
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
          })
          .catch(err => {
            this.finish = true;
            this.$message.error(err.msg);
          });
    },

    // 获取个人发布的职言（所有）
    searchGossips(params, isLoadMore) {
      if (!isLoadMore) {
        this.params.currentPage = 1;
      }
      this.finish = false;
      params.userId = this.userId;
      params.query = this.query;
      this.$delete(params, 'userId');
      // 不是管理员
      if (!this.$store.state.isManage) {
        // 只看启用的贴子
        params.postStateEnum = "enable";
      }
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
          })
          .catch(err => {
            this.finish = true;
            this.$message.error(err.msg);
          });
    },


    // 刷新列表
    postRefresh() {
      // this.params = {currentPage: 1, pageSize: global.defaultPageSize};
      this.searchPost(this.params);
    },
    gossipRefresh() {
      // this.params = {currentPage: 1, pageSize: global.defaultPageSize};
      this.searchGossips(this.params);
    },

    // tab切换回调
    changeTab(activeKey, isFirst) {
      if (activeKey === 'post') {
        this.isPostTab = true;
        this.isGossipTab = false;
        this.hasNext = true;
        let params = this.params;
        params.type = 1;
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
        this.hasNext = true;
        let params = this.params;
        params.type = 2;
        this.searchGossips(params);
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

</style>
