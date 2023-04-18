<template>
  <div id="latest-comment" v-if="data.length !== 0">
    <header class="user-block-header">{{ $t("common.hotList") }}</header>
    <a-divider style="margin: 10px 0 0 0;"/>
    <a-list item-layout="horizontal" :data-source="data" :split="false">
      <a-list-item slot="renderItem" slot-scope="item, index" @click="routerPostDetail(item.postId, item.id)">

        <a-list-item-meta>
          <!-- 排行图片  -->
          <a-avatar class="el-image__inner" slot="avatar" :src="require('@/assets/img/hotList/' + (index+1) + '.png')" />
          <!-- 标题  -->
          <span slot="description" style="font-size: small;">{{item.title}}</span>
        </a-list-item-meta>
        <span>
          <span v-text="$utils.showHot(item.pv)"></span>
          <a-icon type="fire" theme="twoTone" two-tone-color="#eb2f96"/>
          <span v-html="'&nbsp;&nbsp;&nbsp;'"></span>
        </span>
      </a-list-item>
    </a-list>
  </div>
</template>

<script>
import postService from "@/service/postService";

export default {
  data() {
    return {
      data: [],
      params: {currentPage: 1, pageSize: global.hotListDefaultPageSize},
    };
  },

  methods: {
    getHotList() {
      postService.getPostHotList()
          .then(res => {
            this.data = res.data;
          })
          .catch(err => {
            this.$message.error(err.msg);
          });
    },

    // 路由到文章详情页面（某一条评论处）
    routerPostDetail(postId) {
      let routeData = this.$router.resolve("/detail/" + postId);
      window.open(routeData.href, '_blank');
    },
  },

  mounted() {
    this.getHotList();
  },

};
</script>

<style scoped>
#latest-comment {
  padding-bottom: 10px;
}

#latest-comment .user-block-header {
  padding: 15px 10px 0 15px;
}

#latest-comment .ant-list-item-meta {
  display: flex;
  align-items: center;
  padding: 0 15px;
}

#latest-comment .ant-list-item-meta-title > a, .ant-list-item-meta-description {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  /* 实现长英文字母自动换行*/
  word-break: break-all;
}

#latest-comment .ant-list-item-meta-description {
  font-weight: 500;
  font-size: 10px;
  color: #909090;
  line-height: 22px;
}

#latest-comment .ant-list-item, .full-list {
  cursor: pointer;
}

#latest-comment .ant-list-item:hover {
  background: #8b87870a;
}

#latest-comment .full-list:hover {
  background: #8b87870a;
}

.el-image__inner{
  vertical-align: top;
  width: 65%;
  height: 65%;
}
</style>
