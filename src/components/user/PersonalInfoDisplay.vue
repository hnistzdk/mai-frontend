<template>
  <div id="personal-info-display"
       :style="$store.state.collapsed ? 'padding: 10px' : 'padding: 20px;'">
    <div class="top">
      <div class="left">
        <div class="avatar">
          <a-avatar :size="88" class="avatar"
                    :src="data.avatar ? data.avatar : require('@/assets/img/default_avatar.png')"/>
        </div>
        <div class="info" v-if="data.level !== undefined">
          <div class="username">
            <span>{{ data.username }} </span>
            <img :src="require('@/assets/img/level/' + data.level + '.svg')" alt=""/>
          </div>
          <div class="office">
            <span v-if="data.position">
              <i class="iconfont icon-office"></i>
              <span>{{ data.position }}</span>
            </span>
            <span v-else-if="$store.state.userId === data.id" @click="routerSetUp">
              <a><a-icon type="plus"/>{{ $t("common.notJob") }}</a>
            </span>
          </div>
          <div class="intro">
            <span v-if="data.selfIntroduction">
              <i class="iconfont icon-intro"></i>
              <span>{{ data.selfIntroduction }}</span>
            </span>
            <span v-else-if="$store.state.userId === data.id" @click="routerSetUp">
              <a><a-icon type="plus"/>{{ $t("common.notHobbies") }}</a>
            </span>
          </div>
        </div>
      </div>
      <div class="right">
        <div class="follow-box">
          <div class="personalEdit" v-if="$store.state.userId === data.userId">
            <a-button class="follow-btn"
                      @click="routerSetUp"
                      :style="{color: $store.state.themeColor, border: '1px solid' + $store.state.themeColor}">
              {{ $t("common.personalEdit") }}
            </a-button>
          </div>
          <div class="follow" v-else>
            <a-button class="follow-btn"
                      v-if="!data.isFollow"
                      @click="updateFollowState()"
                      :style="{color: $store.state.themeColor, border: '1px solid' + $store.state.themeColor}">
              {{ $t("common.follow") }}
            </a-button>
            <a-button class="follow-btn-close"
                      v-if="data.isFollow"
                      @click="updateFollowState()">
              {{ $t("common.haveFollowed") }}
            </a-button>
          </div>
        </div>
      </div>
    </div>
    <a-divider style="margin: 30px 0 20px 0"/>
    <div class="bottom">
      <div>
        <img src="@/assets/img/badge.svg" alt=""/>
        <span>{{ $t("common.getBadge") + ' ' + (getBadgeCount(data.points) === undefined ? '' : getBadgeCount(data.points)) }}</span>
      </div>
      <div>
        <a-tooltip placement="top" v-if="data.points >= 0">
          <template slot="title">
            初入职场
          </template>
          <img src="@/assets/img/level/badge-Lv1.svg" alt="" style="margin-left: 8px;cursor: pointer" @click="routerBook"/>
        </a-tooltip>
        <a-tooltip placement="top" v-if="data.points >= 100">
          <template slot="title">
            兢兢业业
          </template>
          <img src="@/assets/img/level/badge-Lv2.svg" alt="" style="margin-left: 8px;cursor: pointer" @click="routerBook"/>
        </a-tooltip>
        <a-tooltip placement="top" v-if="data.points >= 300">
          <template slot="title">
            反骨仔
          </template>
          <img src="@/assets/img/level/badge-Lv3.svg" alt="" style="margin-left: 8px;cursor: pointer" @click="routerBook"/>
        </a-tooltip>
        <a-tooltip placement="top" v-if="data.points >= 600">
          <template slot="title">
            职场老鸟
          </template>
          <img src="@/assets/img/level/badge-Lv4.svg" alt="" style="margin-left: 8px;cursor: pointer" @click="routerBook"/>
        </a-tooltip>
        <a-tooltip placement="top" v-if="data.points >= 1000">
          <template slot="title">
            老白兔
          </template>
          <img src="@/assets/img/level/badge-Lv5.svg" alt="" style="margin-left: 8px;cursor: pointer" @click="routerBook"/>
        </a-tooltip>
        <a-tooltip placement="top" v-if="data.points >= 1500">
          <template slot="title">
            被裁者
          </template>
          <img src="@/assets/img/level/badge-Lv6.svg" alt="" style="margin-left: 8px;cursor: pointer" @click="routerBook"/>
        </a-tooltip>
      </div>
    </div>
  </div>
</template>

<script>
  import userService from "@/service/userService";
  import store from "@/store";

  export default {
    name: "",

    props: {
      data: {type: Object, default: {}},
    },

    methods: {
      // 更新关注状态
      updateFollowState() {
        if (!this.$store.state.isLogin){
          this.$message.error("请先登录");
          store.state.loginVisible = true;
          return;
        }
        userService.updateFollowState({toUser: this.data.userId,toUsername: this.data.username})
            .then(() => {
              this.$emit("refresh");
            })
            .catch(err => {
              this.$message.error(err.msg);
            });
      },

      hrefFn(url) {
        if (url){
          window.open(url, '_blank');
        } else {
          this.routerSetUp();
        }
      },

      getBadgeCount(points) {
        if (points >= 0 && points < 100) {
          return 1;
        }
        if (points >= 100 && points < 300) {
          return 2;
        }
        if (points >= 300 && points < 600) {
          return 3;
        }
        if (points >= 600 && points < 1000) {
          return 4;
        }
        if (points >= 1000 && points < 1500) {
          return 5;
        }
        if (points >= 1500) {
          return 6;
        }
      },

      // 路由到设置页面
      routerSetUp() {
        this.$router.push("/settings/profile");
      },

      // 路由到Book说明页面
      routerBook() {
        let routeData = this.$router.resolve("/book");
        window.open(routeData.href, '_blank');
      }
    },

  }
</script>

<style lang="less" scoped>
  #personal-info-display .top {
    display: flex;
    justify-content: space-between;

    .info {
      padding-left: 20px;

      .username {
        padding-bottom: 5px;

        span {
          font-size: 26px;
          font-weight: 700;
          color: #000;
        }

        img {
          position: relative;
          top: -10px;
        }
      }

      .office, .intro {
        display: flex;
        align-items: baseline;
        line-height: 28px;

        span {
          padding-left: 5px;
        }
      }
    }

    .left {
      display: flex;
    }

    .right {
      padding-left: 20px;

      .link {
        i {
          cursor: pointer;
          margin-left: 10px;
          font-size: 20px;
        }
      }

      .follow, .personalEdit {
        padding-top: 30px;
      }

      .follow {
        /* 关注按钮--start */

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
          /*width: 77px;*/
          height: 27px;
          border-radius: 2px;
        }

        .follow-btn-close:hover {
          background: #3ee002;
          border: 1px solid rgba(55, 199, 1, 0.7) !important;
        }

        /* 关注按钮--end */
      }
    }
  }

  #personal-info-display .bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;

    img {
      width: 26px;
    }

    span {
      padding-left: 5px;
      font-size: 16px;
      font-weight: 500;
    }
  }
</style>
