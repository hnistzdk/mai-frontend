<template>
  <div>
    <a-empty v-if="data.length === 0"/>
    <div class="user-list" v-for="(item, index) in data" v-else>
      <div class="item">
        <div class="link">
          <img :src="item.userInfo.avatar ? item.userInfo.avatar : require('@/assets/img/default_avatar.png')" alt=""
               class="avatar" @click="routerUserCenter(getFollow ? item.toUser : item.fromUser)">
          <div class="info-box" style="flex: 1 1 auto; min-width: 0;">
            <a target="_blank" rel="" class="username"
               @click="routerUserCenter(getFollow ? item.toUser : item.fromUser)">
              <span class="name" style="padding-right: 2px;" v-text="item.userInfo.username"></span>
              <img :src="require('@/assets/img/level/' + item.userInfo.level + '.svg')" alt=""/>
            </a>
            <div class="detail" v-text="item.userInfo.selfIntroduction"></div>
            <div class="describe">
              <span>{{ $t("common.get") }}</span>
              <span> {{ item.userInfo.likeCount + ' ' + $t("common.praise") }}</span>
              <span>·</span>
              <span> {{ item.userInfo.readCount + ' ' + $t("common.read") }}</span>
            </div>
          </div>
          <a-button class="follow-btn" v-if="$store.state.isLogin && !item.userInfo.isFollow
                                                "
                    @click="updateFollowState(getFollow ? item.toUser : item.fromUser, index)"
                    :style="{color: $store.state.themeColor, border: '1px solid' + $store.state.themeColor}">
            {{ $t("common.follow") }}
          </a-button>
          <a-button class="follow-btn-close" v-if="$store.state.isLogin && item.userInfo.isFollow
                                                   && item.userInfo.userId !== $store.state.userId             "
                    @click="updateFollowState(getFollow ? item.toUser : item.fromUser, index)">
            {{ $t("common.haveFollowed") }}
          </a-button>
        </div>
      </div>
    </div>
    <div style="text-align: center; padding: 20px;" v-if="!hasNext && finish">{{ $t("common.noAgain") }}</div>
  </div>
</template>

<script>
  import userService from "@/service/userService";
  import store from "@/store";

  export default {
    props: {
      data: {type: Array, default: []},
      finish: {type: Boolean, default: false},
      hasNext: {type: Boolean, default: false},
      getFollow: {type: Number, default: 0},
    },

    methods: {
      // 更新关注状态
      updateFollowState(toUser, index) {
        if (!this.$store.state.isLogin){
          this.$message.error("请先登录");
          store.state.loginVisible = true;
          return;
        }
        let origin = this.data[index].userInfo.isFollow;
        this.data[index].userInfo.isFollow = !origin;
        userService.updateFollowState({toUser: toUser,toUsername:this.data[index].toUsername})
            .then(() => {
              if (origin){
                this.$message.success("取消关注成功");
              }else {
                this.$message.success("关注成功");
              }

            })
            .catch(err => {
              this.data[index].userInfo.isFollow = origin;
              this.$message.error(err.msg);
            });
      },

      // 路由到用户中心页面
      routerUserCenter(userId) {
        let routeData = this.$router.resolve("/user/" + userId);
        window.open(routeData.href, '_blank');
      }
    },

  }
</script>

<style lang="less" scoped>
  .user-list {
    padding: 0;
    margin: 0;

    .item {
      border-bottom: 1px solid rgba(178, 186, 194, .15);

      .link {
        display: flex;
        align-items: center;
        padding: 0.5rem 2.4rem;
        min-height: 7rem;
        color: #b9c0c8;

        .username {
          display: flex;
          align-items: baseline;
        }

        .avatar {
          flex: 0 0 auto;
          margin-right: 1.667rem;
          width: 4.17rem;
          height: 4.17rem;
          border-radius: 50%;
          cursor: pointer;
        }

        /* 关注按钮 */

        .follow-btn {
          width: 77px;
          height: 27px;
          border-radius: 2px;
        }

        .follow-btn:hover {
          background: #37c701;
          border: 1px solid rgba(55, 199, 1, .6) !important;
          color: #fff !important;
        }

        .follow-btn-close {
          background: #37c701;
          border: 1px solid rgba(55, 199, 1, .6) !important;
          color: #fff !important;
          /*width: 80px;*/
          height: 27px;
          border-radius: 2px;
        }

        .follow-btn-close:hover {
          background: #3ee002;
          border: 1px solid rgba(55, 199, 1, 0.7) !important;
        }
      }
    }
  }
</style>
