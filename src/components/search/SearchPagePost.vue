<template>
  <div id="main-post-content">
    <a-list item-layout="vertical" size="large" :data-source="tempData">
      <a-list-item slot="renderItem" key="item.title" slot-scope="item, index" style="cursor: pointer;"
                   @click="routerPostDetail(item.postId)">
        <div slot="extra" class="label-titleMap">
          <div>
            <img style="padding-top: 10px" :width="$store.state.collapsed ? 80 : 150" alt="logo" v-if="item.images"
                 :src="item.images.split(',')[0]"/>
          </div>
        </div>
        <!-- 用户/标题 -->
        <a-list-item-meta :description="item.title">
          <a-avatar slot="avatar" :src="item.userInfoVO.avatar ? item.userInfoVO.avatar : require('@/assets/img/default_avatar.png')"
                    @click.stop="routerUserCenter(item.authorId)"/>
          <a slot="title" class="username" @click.stop="routerUserCenter(item.authorId)">
            <div class="left">
              <span slot="title" style="padding-right: 2px;"> {{ item.authorUsername }} </span>
              <!--              <img :src="require('@/assets/img/level/' + item.level + '.svg')" alt="" @click.stop="routerBook"/>-->
              <small style="color: #b5b9b9; padding-left: 10px" v-text="$utils.showtime(item.createTime)"></small>
            </div>
            <!-- 置顶图标 -->
            <a-tooltip placement="left">
              <template slot="title">
                {{ $t("common.top") }}
              </template>
              <a-icon type="fire" :style="{color: $store.state.themeColor}" v-if="item.top"/>
              <a-icon type="thunderbolt" :style="{color: $store.state.themeColor}" v-if="item.top" />
              <i class="iconfont icon-right-triangle" :style="{color: $store.state.themeColor}" v-if="item.top"></i>
            </a-tooltip>
          </a>
          <small slot="title" style="color: #b5b9b9;"> {{ item.userInfoVO.company }} </small>
          <small slot="title" style="color: #b5b9b9;"> {{ item.userInfoVO.position }} </small>
        </a-list-item-meta>
        <div class="post-content">
          <p v-html="item.highlightContent"></p>
        </div>
      </a-list-item>
    </a-list>
    <div style="text-align: center; padding-bottom: 20px;" v-if="!hasNext && finish">
      <a-divider/>
      {{ $t("common.noAgain") }}
    </div>
  </div>
</template>
<script>

export default {
  props: {
    data: {},
    pageSize: {type: Number, default: global.defaultPageSize},
    current: {type: Number, default: 1},
    finish: {type: Boolean, default: false},
    hasNext: {type: Boolean, default: false},
    userId: {type: Number, default: 0},
    isAdminAudit: {type: Boolean, default: false},
  },
  data() {
    return {
      tempData: this.data,
      actions: [
        {type: 'eye', text: '156'},
        {type: 'like-o', text: '156'},
        {type: 'message', text: '2'},
        {type: 'ellipsis', text: '12'},
      ],
    };
  },

  methods: {
    // 浏览点赞评论按钮的点击操作
    pageViewsLikeComment(type, postId, index) {
      // 浏览量
      if (type === 'eye') {
        console.log("浏览量")
      }
      // 点赞
      if (type === 'like-o') {
        console.log("点赞")
      }
      // 评论
      if (type === 'message') {
        console.log("评论")
      }
    },


    // 路由到贴子详情页面
    routerPostDetail(postId) {
      let routeData = this.$router.resolve("/detail/" + postId);
      window.open(routeData.href, '_blank');
    },

    // 路由到贴子详情页面（评论处）
    routerPostDetailToComment(postId) {
      let routeData = this.$router.resolve("/detail/" + postId + '#post-comment-all');
      window.open(routeData.href, '_blank');
    },

    // 路由到用户中心页面
    routerUserCenter(userId) {
      let routeData = this.$router.resolve("/user/" + userId);
      window.open(routeData.href, '_blank');
    },

    // 路由到标签贴子页面
    routerLabelToPost(labelId) {
      let routeData = this.$router.resolve("/label/" + labelId);
      window.open(routeData.href, '_blank');
    },

    // 路由到Book说明页面
    routerBook() {
      let routeData = this.$router.resolve("/book");
      window.open(routeData.href, '_blank');
    },

    // 路由到贴子编辑页面
    routerPostEdit(postId,type) {
      this.$router.push("/edit/" + postId);
    },
  },

  mounted() {
  },

  watch: {
    // data值改变时触发
    data: {
      handler(newVal, oldVal) {
        this.tempData = newVal;
      }
    }
  }

};
</script>

<style lang="less">
// 浏览量、点赞、评论取消竖杠
#main-post-content em.ant-list-item-action-split {
  display: none;
}

#main-post-content .ant-list-vertical .ant-list-item-action > li:first-child {
  padding-left: 0;
}

#main-post-content .ant-list-vertical .ant-list-item-action > li {
  padding: 0 12px;
}

#main-post-content .label-titleMap {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
}

#main-post-content .label-name {
  color: #8a919f;
}

#main-post-content .label-name:hover {
  color: #13c2c2;
}

#main-post-content .username {
  display: flex;
  justify-content: space-between;

  .left {
    display: flex;
    align-items: baseline;
  }
}

#main-post-content .ant-list-item-meta-description {
  font-weight: 700;
  font-size: 16px;
  color: #1d2129;
  line-height: 22px;
}

#main-post-content .ant-list-item-meta-description, .post-content {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
}

#main-post-content .collectLikeComment:hover {
  color: #13c2c2;
}

#main-post-content li.ant-list-item {
  padding: 20px;
}

#main-post-content li.ant-list-item:hover {
  background: #f4f5f57a;
}

// 贴子题图样式调整
#main-post-content .ant-list-item-extra img {
  max-height: 113px;
  max-width: 150px;
  width: auto;
}

@media screen and (max-width: 576px) {
  .ant-list-vertical .ant-list-item-extra {
    margin: 0 auto 16px;
  }
}
</style>
