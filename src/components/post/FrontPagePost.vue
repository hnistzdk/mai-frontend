<template>
  <div id="main-post-content">
    <a-list item-layout="vertical" size="large" :data-source="tempData">
      <a-list-item slot="renderItem" key="item.title" slot-scope="item, index" style="cursor: pointer;"
                   @click="routerPostDetail(item.postId)">
        <!-- 浏览量/点赞/评论 -->
        <template v-for="{ type, text } in actions" slot="actions">
          <span class="collectLikeComment" :key="type">
              <span v-if="type==='eye'">
                  <a-icon :type="type" style="margin-right: 6px;"/>
                  <span v-text="item.pv"></span>
              </span>
              <span v-if="type==='like-o'" @click.stop="pageViewsLikeComment(type, item.postId, index)">
                  <span v-if="item.like" :style="{color: $store.state.themeColor}">
                      <a-icon :type="type" style="margin-right: 6px"/>
                      <span v-text="item.likeCount"></span>
                  </span>
                  <span v-if="!item.like">
                      <a-icon :type="type" style="margin-right: 8px"/>
                      <span v-text="item.likeCount"></span>
                  </span>
<!--                <span :style="{color: $store.state.themeColor}">-->
<!--                      <a-icon :type="type" style="margin-right: 6px"/>-->
<!--                      <span v-text="data.likeCount"></span>-->
<!--                </span>-->
              </span>
              <span v-if="type==='message'" @click.stop="routerPostDetailToComment(item.postId)">
                  <a-icon :type="type" style="margin-right: 6px;"/>
                  <span v-text="item.commentCount"></span>
              </span>
              <span v-if="(($store.state.isManage && isAdminAudit) || $store.state.userId === item.authorId) && type==='ellipsis'"
                    @click.stop>
                <a-dropdown :placement="'bottomCenter'" :trigger="['click']">
                  <a-menu slot="overlay">
                    <!-- 审核通过 -->
                    <a-menu-item key="postPass" v-if="($store.state.isManage && isAdminAudit) && (item.state === -1 || item.state !== 1)"
                                 @click="updateState(item.postId, item.state, 1)">
                      {{ ' ' + $t("common.pass") }}
                    </a-menu-item>
                    <!-- 审核拒绝 -->
                    <a-menu-item key="postReject" v-if="($store.state.isManage && isAdminAudit) && (item.state === -1 || item.state !== 0)"
                                 @click="updateState(item.postId, item.state, 0)">
                      <span style="color: red">{{ ' ' + $t("common.reject") }}</span>
                    </a-menu-item>
                    <!-- 贴子置顶 -->
                    <a-menu-item key="postNotTop" v-if="$store.state.isManage && isAdminAudit && !item.top"
                                 @click="postTop(item.postId)">
                      <span style="color: #1869ff">{{ ' ' + $t("common.isTop") }}</span>
                    </a-menu-item>
                    <!-- 贴子取消置顶 -->
                    <a-menu-item key="postTop" v-if="$store.state.isManage && isAdminAudit && item.top"
                                 @click="postNotTop(item.postId)">
                      <span style="color: #eb2f96">{{ ' ' + $t("common.isNotTop") }}</span>
                    </a-menu-item>
                    <!-- 贴子编辑 -->
                    <a-menu-item key="postEdit" v-if="$store.state.userId === item.authorId && item.type === 1"
                                 @click="routerPostEdit(item.postId,item.type)">
                      <span style="color: #722ed1">{{ ' ' + $t("common.edit") }}</span>
                    </a-menu-item>
                    <!-- 贴子删除 -->
                    <a-menu-item key="postDel" v-if="$store.state.userId === item.authorId"
                                 @click="postDelete(item.postId, item.type)">
                      <span style="color: red">{{ ' ' + $t("common.delete") }}</span>
                    </a-menu-item>
                  </a-menu>
                  <div class="options">
                    <a-icon :type="type"/>
                  </div>
                </a-dropdown>
              </span>
          </span>
        </template>
        <!--  主要展示职言的图片 -->
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
              <!-- 用户中心 -->
              <div v-if="isUserCenter && ($store.state.userId === userId || $store.state.isManage)">
                <small style="color: #faad14; padding-left: 10px" v-if="item.state === -1">{{
                    $t("common.pendingReview")
                  }}</small>
                <small style="color: red; padding-left: 10px" v-if="item.state === 0">{{
                    $t("common.auditReviewRejected")
                  }}</small>
                <small style="color: #3eaf7c; padding-left: 10px" v-if="item.state === 1">{{
                    $t("common.auditApproved")
                  }}</small>
              </div>
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
        <!-- 这里控制一下显示的概要长度  -->
          {{ item.content.substring(0,item.content.length > 80 ? 80 : item.content.length) }}
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
import postService from "@/service/postService";

  export default {
    props: {
      data: {},
      pageSize: {type: Number, default: global.defaultPageSize},
      current: {type: Number, default: 1},
      finish: {type: Boolean, default: false},
      hasNext: {type: Boolean, default: false},
      isUserCenter: {type: Boolean, default: false},
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
          let like = this.tempData[index].like;
          //取消点赞操作
          if (like) {
            this.tempData[index].likeCount = this.tempData[index].likeCount-1;
          } else {
            this.tempData[index].likeCount = this.tempData[index].likeCount+1;
          }
          this.tempData[index].like = !like;
          postService.updateLikeState({postId: postId,state: like})
              .then(() => {

              })
              .catch(err => {
                this.$message.error(err.msg);
              });
        }
        // 评论
        if (type === 'message') {
          console.log("评论")
        }
      },

      // 修改贴子审批状态
      updateState(postId, state, toState) {
        this.$confirm({
          centered: true,
          title: this.$t("common.confirmReject"),
          onOk: () => {
            postService.updateState({id: postId, state: toState})
                .then(() => {
                  this.tempData = this.tempData.filter(post => post.postId !== postId);
                  // 待审核
                  if (state === -1) {
                    this.$emit("updatePendingReviewData", this.tempData);
                    // 通过
                    if (toState === 1) {
                      this.$emit("updatePendingReviewTotal", -1)
                      this.$emit("updateTotal", 1)
                      this.$emit("updateReviewRejectedTotal", -1)
                    }
                    // 拒绝
                    if (toState === 0) {
                      this.$emit("updatePendingReviewTotal", -1)
                      this.$emit("updateTotal", -1)
                      this.$emit("updateReviewRejectedTotal", 1)
                    }
                  }
                  // 审核拒绝
                  if (state === 0) {
                    this.$emit("updateReviewRejectedData", this.tempData);
                    // 通过
                    if (toState === 1) {
                      this.$emit("updateTotal", 1)
                      this.$emit("updateReviewRejectedTotal", -1)
                    }
                    // 拒绝
                    if (toState === 0) {
                      this.$emit("updateTotal", -1)
                      this.$emit("updateReviewRejectedTotal", 1)
                    }
                  }
                  // 审核通过
                  if (state === 1) {
                    this.$emit("updateData", this.tempData);
                    // 通过
                    if (toState === 1) {
                      this.$emit("updateTotal", 1)
                      this.$emit("updateReviewRejectedTotal", -1)
                    }
                    // 拒绝
                    if (toState === 0) {
                      this.$emit("updateTotal", -1)
                      this.$emit("updateReviewRejectedTotal", 1)
                    }
                  }
                  this.$message.success(this.$t("common.approvalSuccessed"));
                })
                .catch(err => {
                  this.$message.error(err.msg);
                });
          },
        });
      },

      // 贴子置顶
      postTop(postId) {
        this.$confirm({
          centered: true,
          title: this.$t("common.confirmTop"),
          onOk: () => {
            postService.postTop({id: postId, top: true})
                .then(() => {
                  this.$message.success(this.$t("common.topSuccessed"));
                })
                .catch(err => {
                  this.$message.error(err.msg);
                });
          },
        });
      },

      // 贴子取消置顶
      postNotTop(postId) {
        this.$confirm({
          centered: true,
          title: this.$t("common.confirmNotTop"),
          onOk: () => {
            postService.postTop({id: postId, top: false})
                .then(() => {
                  this.$message.success(this.$t("common.notTopSuccessed"));
                })
                .catch(err => {
                  this.$message.error(err.msg);
                });
          },
        });
      },

      // 删除
      postDelete(postId, type) {
        let title = type === 1 ? this.$t("common.deletePostTitle") : this.$t("common.deleteGossip")
        this.$confirm({
          centered: true,
          title: title,
          onOk: () => {
            postService.postDelete(postId)
                .then(() => {
                  this.$message.success('删除成功');
                  this.$emit("refresh");
                  // this.tempData = this.tempData.filter(post => post.postId !== postId);
                })
                .catch(err => {
                  this.$message.error(err.msg);
                });
          },
        });
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
