<template>
  <div id="relat-post" v-if="data.length !== 0">
    <header class="post-block-header">
      <i class="iconfont icon-relat-post" :style="{ color: $store.state.themeColor}"></i>
      {{ $t("common.relatArtilce") }}
    </header>
    <a-divider style="margin: 10px 0 0 0;"/>
    <a-list item-layout="horizontal" :data-source="data" :split="false">
      <a-list-item slot="renderItem" slot-scope="item, index" @click="routerPostDetail(item.id)">
        <a-list-item-meta
            :description="item.postCountDTO.likeCount + ' ' + $t('common.like') +
            ' · ' + item.postCountDTO.commentCount + ' ' + $t('common.comment')">
          <span slot="title">{{ item.title }}</span>
        </a-list-item-meta>
      </a-list-item>
    </a-list>
  </div>
</template>

<script>
import postService from "@/service/postService";

export default {
  props: {
    labelIds: {type: Array, default: []},
  },

  data() {
    return {
      data: [],
      params: {currentPage: 1, pageSize: global.relatedDefaultPageSize},
      finish: false,
    };
  },

  methods: {
    // 获取相关文章列表信息
    getRelatPostList(params) {
      this.finish = false;
      params.labelIds = this.labelIds.join(',');
      postService.getPostList(params)
          .then(res => {
            this.data = res.data.list;
            this.finish = true;
          })
          .catch(err => {
            this.finish = true;
            this.$message.error(err.desc);
          });
    },

    // 路由到文章详情页面
    routerPostDetail(postId) {
      let routeData = this.$router.resolve("/detail/" + postId);
      window.open(routeData.href, '_blank');
    },
  },

  mounted() {
    // this.getRelatPostList(this.params);
  },

};
</script>

<style scoped>
#relat-post {
  padding-bottom: 10px;
}

#relat-post .post-block-header {
  padding: 15px 10px 0 15px;
}

#relat-post .ant-list-item {
  padding: 12px 0 6px 0;
}

#relat-post .ant-list-item-meta {
  display: flex;
  align-items: center;
  padding: 0 15px;
}

#relat-post .ant-list-item-meta-title > a, .ant-list-item-meta-description {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
}

#relat-post .ant-list-item-meta-title {
  line-height: 22px;
  font-size: 14px;
  font-weight: 400;
  color: #252933;
}

#relat-post .ant-list-item-meta-description {
  font-size: 12px;
  color: #909090;
  line-height: 22px;
}

#relat-post .ant-list-item, .full-list {
  cursor: pointer;
}

#relat-post .ant-list-item:hover {
  background: #8b87870a;
}

#relat-post .full-list:hover {
  background: #8b87870a;
}
</style>
