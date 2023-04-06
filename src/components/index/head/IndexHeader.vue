<template>
  <a-layout-header>
    <div class="main-header">
      <div class="header-left-content">
        <!-- logo -->
        <div @click="refresh" class="header-item-logo">
          <img slot="avatar" src="@/assets/img/logo-lanse.png" alt="默认图片" style="height: 100%"/>
        </div>

        <!-- 首页 -->
        <div>
          <a-menu v-if="!$store.state.collapsed" v-model="current" mode="horizontal">
            <a-menu-item key="frontPage" @click="refresh">{{ $t("common.home") }}</a-menu-item>
            <a-menu-item key="gossipPage" @click="routerGossip">{{ $t("common.gossip") }}</a-menu-item>
            <a-menu-item key="liveStreaming" @click="routerResource">{{ $t("common.resource") }}</a-menu-item>
          </a-menu>
          <a-select class="phone-frontPage" v-if="$store.state.collapsed" :default-value="current"
                    @change="handleChange" style="min-width: 90px; width: 100%">
            <a-select-option value="frontPage" @click="refresh">{{ $t("common.home") }}</a-select-option>
            <a-select-option value="gossipPage" @click="routerGossip">{{ $t("common.gossip") }}</a-select-option>
            <a-select-option value="liveStreaming" @click="routerResource">{{ $t("common.resource") }}</a-select-option>
          </a-select>
        </div>
      </div>

      <div class="header-right-content">
        <!-- 搜索框 -->
        <div class="header-search">
          <a-space direction="vertical">
            <a-input-search v-model="searchContentTemp" :placeholder="$t('common.searchPlaceholder')"
                            style="min-width: 100px; width: 100%"
                            @search="onSearch"
            />
          </a-space>
        </div>

        <!-- 发帖 -->
        <div v-if="!$store.state.collapsed && $store.state.isLogin && $route.path !== '/gossip'" class="header-item" @click="routerWrite">
          <div class="options">
            <span>{{ $t("common.writePost") }}</span>
          </div>
        </div>

        <!-- 主题色 -->
        <div class="header-item">
          <a-dropdown overlayClassName="header-theme-color-config" :placement="'bottomRight'"
                      :trigger="['click']">
            <div class="ant-dropdown-menu" slot="overlay">
              <p>{{ $t("common.themeColor") }}</p>
              <div class="color-options">
                <div @click="changeColor(color)" v-for="color of colorOptions" :key="color"
                     :style="'background: ' + color">
                  <a-icon v-if="themeColor === color" style="color: white" type="check"/>
                </div>
              </div>
            </div>
            <div class="options theme-color">
              <i class="iconfont icon-theme" :style="{ color: themeColor }"></i>
            </div>
          </a-dropdown>
        </div>

        <div class="header-item badge-container" v-if="$store.state.isLogin">
          <a-badge :dot="$store.state.allMessageCount > 0">
            <a-dropdown class="dropdown" overlayClassName="header-message-box" :trigger="['click']">
              <a class="ant-dropdown-link" @click="e => e.preventDefault()">
                <i class="iconfont icon-bell"></i>
              </a>
              <a-menu slot="overlay" @click="handleClickMessage">
                <a-menu-item key="reply">
                  <span style="display: flex">
                    <span style="padding-right: 5px;">回复我的</span>
                    <a-badge :count="$store.state.replyMessageCount" :overflow-count="99"/>
                  </span>
                </a-menu-item>

                <a-menu-item key="like">
                  <span style="display: flex">

                  </span>
                  <span style="padding-right: 5px;">收到的赞</span>
                  <a-badge :count="$store.state.likeMessageCount" :overflow-count="99"/>
                </a-menu-item>

                <a-menu-item key="follow">
                  <span style="display: flex">
                    <span style="padding-right: 5px;">新增粉丝</span>
                    <a-badge  :count="$store.state.followMessageCount" :overflow-count="99"/>
                  </span>
                </a-menu-item>
                <a-menu-divider />

<!--                <a-menu-item key="system">-->
<!--                  <span style="display: flex">-->
<!--                    <span style="padding-right: 5px;">系统通知</span>-->
<!--                    <a-badge :count="$store.state.systemMessageCount" :overflow-count="99"/>-->
<!--                  </span>-->
<!--                </a-menu-item>-->


              </a-menu>
            </a-dropdown>
          </a-badge>
        </div>

        <!-- 头像 -->
        <div class="header-item avatar-container" v-if="$store.state.isLogin">
          <a-dropdown :placement="'bottomRight'" :trigger="['click']">
            <a-menu @click="handleClick" slot="overlay">
              <a-menu-item key="PROFILE">
                <i class="iconfont icon-user-picture"></i>{{ ' ' + $t("common.profile") }}
              </a-menu-item>
              <a-divider style="margin: 3px 0 3px 0"/>
              <a-menu-item key="setUp">
                <i class="iconfont icon-setUp"></i>{{ ' ' + $t("common.setUp") }}
              </a-menu-item>
              <a-divider style="margin: 3px 0 3px 0"/>
              <a-menu-item key="management">
                <i class="iconfont icon-setUp"></i>{{ ' ' + $t("common.management") }}
              </a-menu-item>
              <a-divider style="margin: 3px 0 3px 0"/>
              <a-menu-item key="LOG_OUT">
                <i class="iconfont icon-quit"></i>{{ ' ' + $t("common.logOut") }}
              </a-menu-item>
            </a-menu>
            <div class="options">
              <a-avatar class="avatar" v-if="$store.state.avatar"
                        :src="$store.state.avatar"/>
              <img v-else src="@/assets/img/default_avatar.png" class="default-avatar" width="32"/>
            </div>
          </a-dropdown>
        </div>

        <!-- 语言 -->
        <div v-if="!$store.state.collapsed" class="header-item languages">
          <a-dropdown :placement="'bottomRight'" :trigger="['click']">
            <a-menu @click="changeLanguage" slot="overlay">
              <a-menu-item key="zh_CN">
                <i class="iconfont icon-chinese avatar-menu-icon"></i>
                <span>中文</span>
              </a-menu-item>
              <a-menu-item key="en_US">
                <i class="iconfont icon-english avatar-menu-icon"></i>
                <span>English</span>
              </a-menu-item>
            </a-menu>
            <div class="options">
              <a-icon type="global"/>
              <span style="padding-left: 6px">{{ languageTitle }}</span>
            </div>
          </a-dropdown>
        </div>

        <!-- 登录 -->
        <div class="header-item-login" v-if="!$store.state.isLogin">
          <div class="options" @click="showLoginModal">
            <a-button style="border: 1px solid rgba(30,128,255,.3); background: rgba(30,128,255,.05); color: #007fff;">
              {{ $t("common.login") }}
            </a-button>
          </div>
          <!-- 登录Model -->
          <Login
              @refresh="refresh"/>
          <!-- 注册Model -->
          <Register
              @refresh="refresh"/>
          <!-- 手机重置密码Model -->
          <MobileResetPassword
              @refresh="refresh"/>
          <!-- 邮箱重置密码Model -->
          <EmailResetPassword
              @refresh="refresh"/>
        </div>
      </div>
    </div>
    <a-modal title="回复我的"
             :destroyOnClose="true"
             :visible="showReply"
             :footer="null"
             :width="800"
             @cancel="handleCancelReply">
      <ReplyMessageList/>
    </a-modal>
    <a-modal title="收到的赞"
             :destroyOnClose="true"
             :visible="showLike"
             :footer="null"
             :width="800"
             @cancel="handleCancelLike">
      <LikeMessageList/>
    </a-modal>
    <a-modal title="新增粉丝"
             :destroyOnClose="true"
             :visible="showFollow"
             :footer="null"
             :width="800"
             @cancel="handleCancelFollow">
      <FollowMessageList/>
    </a-modal>
  </a-layout-header>
</template>

<script>
import {mapMutations, mapState} from "vuex";
import loginService from "@/service/loginService";
import Login from "@/components/login/Login";
import store from "@/store";
import Register from "@/components/login/Register";
import MobileResetPassword from "@/components/login/MobileResetPassword";
import EmailResetPassword from "@/components/login/EmailResetPassword";
import userService from "@/service/userService";
import ReplyMessageList from "@/components/index/messages/ReplyMessageList";
import LikeMessageList from "@/components/index/messages/LikeMessageList";
import FollowMessageList from "@/components/index/messages/FollowMessageList";


export default {
  components: {Login, Register, MobileResetPassword, EmailResetPassword,ReplyMessageList
  ,LikeMessageList,FollowMessageList},

  props: {
    searchContent: {type: String, default: ""},
  },

  data() {
    return {
      showReply: false,
      showLike: false,
      showFollow: false,
      visible: false,
      params: {currentPage: 1, pageSize: global.defaultPageSize},
      // 如果不用watch监听searchContent值的变化,只会在该组件被创建时赋值一次
      searchContentTemp: this.searchContent,
      current: ['frontPage'],
    }
  },

  computed: {
    ...mapState(["userInfo", "locale", "themeColor", "colorOptions", "systemNotifyCount", "taskNotifyCount"]),
    // 总消息数量
    messageNumbers() {
      return Number(this.systemNotifyCount) + Number(this.taskNotifyCount);
    },
    languageTitle() {
      if (this.locale === "zh_CN") {
        return "中文";
      }
      return "English";
    }
  },

  methods: {
    ...mapMutations(["changeColor",'changeLoginVisible','changeIsLogin'
      ,'changeIsManage','changeLocale','changeAvatar'
    ,'changeToken','changeExpire','changeUserId','changeUsername']),
    // 设置语言
    changeLanguage({key}) {
      this.changeLocale(key);
      localStorage.language = key;
    },

    // 点击菜单根据点击的key做出相应
    handleClick({key}) {
      if (key === 'writePost') {
        this.routerWrite();
      }
      if (key === 'PROFILE') {
        this.routerUserCenter(this.$store.state.userId);
      }
      if (key === 'setUp') {
        this.routerSetUp();
      }
      if (key === 'about') {
        this.routerAbout();
      }
      if (key === 'management') {
        this.routerManage();
      }
      if (key === "LOG_OUT") {
        this.logout();
      }
    },
    handleClickMessage({key}){
      if (key === 'reply') {
        this.showReply = true;
      }
      if (key === 'like') {
        this.showLike = true;
      }
      if (key === 'follow') {
        this.showFollow = true;
      }
      if (key === 'system') {
      }
    },
    handleCancelReply(){
      this.showReply = false;
    },
    handleCancelLike(){
      this.showLike = false;
    },
    handleCancelFollow(){
      this.showFollow = false;
    },
    // 显示登录框
    showLoginModal() {
      this.changeLoginVisible(true);
    },

    // 退出登录
    logout() {
      loginService.logout()
          .then(res => {
            //清除localstorage
            this.changeToken('');
            this.changeExpire(0);
            this.changeUserId(0);
            this.changeUsername('');
            //设置登录状态为false
            this.changeIsLogin(false);
            this.changeIsManage(false);

            this.$message.success('退出成功')
          })
          .catch(err => {
            this.$message.error(err.msg);
          });
    },

    // 搜索
    onSearch(value) {
      this.$router.push({path: "/search", query: {query: value}});
    },

    // 刷新
    refresh() {
      // 跳转到首页
      this.$router.push('/');
      // 刷新首页数据（登录后需要）
      this.$emit("refresh");
    },

    handleChange(value) {
      // 清空数组
      this.current.pop();
      // 添加新值
      this.current.push(value);
    },

    // 路由到用户中心页面
    routerUserCenter(userId) {
      let routeData = this.$router.resolve("/user/" + userId);
      window.open(routeData.href, '_self');
      // this.$router.push("/user/" + userId);
    },

    // 路由到写文章页面
    routerWrite() {

      this.$router.push("/write");
    },

    //路由到职言页面
    routerGossip(){
      this.$router.push("/gossip");
    },

    // 路由到资源导航页面
    routerResource() {
      this.$router.push("/resource");
    },

    // 路由到设置页面
    routerSetUp() {
      this.$router.push("/settings/profile");
    },

    // 点击跳转到 关于我们 页面
    routerAbout() {
      window.open('/about', '_blank');
    },

    // 路由到管理端
    routerManage() {
      if (this.$store.state.isManage){
        this.$router.push("/admin");
      }else {
        this.$router.push("/admin/post");
      }
    },

  },

  mounted() {
    let name = this.$route.name;

    // 清空数组
    this.current.pop();
    // 首页
    if (name === 'home') {
      // 添加新值
      this.current.push('frontPage');
    }
    // 职言
    if (name === 'gossip') {
      // 添加新值
      this.current.push('gossipPage');
    }
    // 标签
    if (name === 'label') {
      // 添加新值
      this.current.push('boilingPoint');
    }
    // 资源导航
    if (name === 'resource') {
      // 添加新值
      this.current.push('liveStreaming');
    }
  },

  watch: {
    // searchContent值改变时触发
    searchContent: {
      handler(newVal, oldVal) {
        this.searchContentTemp = newVal;
      }
    }
  }
};
</script>

<style lang="less" scoped>
.main-header {
  width: 1100px;
  background: #fff;
  padding: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left-content {
  display: flex;
  justify-content: left;
  align-items: center;

  .header-item-logo {
    cursor: pointer;
    height: 40px;
  }
}

.header-right-content {
  //padding-right: 16px;
  display: flex;
  align-items: center;
  justify-content: flex-end;

  .header-search, .header-item, .header-item-login {
    padding: 0 12px;
  }

  .badge-container {
    .badge {
      position: relative;
      top: 3px;
    }

    .ant-avatar {
      background-color: transparent;
      overflow: visible;
    }

    .iconfont {
      color: #807a7a;
      cursor: pointer;
    }
  }

  .avatar-container {
    .default-avatar,
    .avatar {
      cursor: pointer;
      user-select: none;
    }

    .default-avatar {
      border-radius: 50%;
    }
  }

  .languages {
    padding-left: 6px;
    box-sizing: content-box;

    .options {
      div {
        height: 40px;
      }
    }
  }

  .header-item {
    cursor: pointer;
    color: #71777c;

    .options:hover {
      opacity: 0.7;
    }
  }

  .header-item-login {
    cursor: auto;
    color: #71777c;

    .options:hover {
      opacity: 0.7;
    }
  }
}

.header-message-box {
  .ant-tabs-nav-container {
    padding: 0 16px;
  }
}

// 移动端
@media screen and (max-width: 900px) {
  .header-message-box {
    left: 0 !important;
    position: relative;
    display: flex;
    justify-content: center;
  }

  .header-left-content {
    .phone-frontPage {
      padding: 0 8px;
    }
  }

  .header-right-content {
    .header-search, .header-item, .header-item-login {
      padding: 0 8px;
    }
  }
}

.ant-tabs-nav .ant-tabs-tab {
  margin: 0;
}

.header-theme-color-config {
  .ant-dropdown-menu {
    margin-top: -2px;
    padding: 12px;

    .color-options {
      display: flex;
      justify-content: space-around;

      div {
        width: 20px;
        height: 20px;
        margin: 0 4px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
}

.avatar-menu-icon {
  font-size: 16px !important;
}

/* 去掉a-menu组件的下划线 */
.ant-menu-horizontal {
  border-bottom: 0;
}

.ant-menu-horizontal > .ant-menu-item-active, .ant-menu-horizontal > .ant-menu-item-open, .ant-menu-horizontal > .ant-menu-item-selected, .ant-menu-horizontal:not(.ant-menu-dark) > .ant-menu-item:hover, .ant-menu-horizontal > .ant-menu-submenu-active, .ant-menu-horizontal > .ant-menu-submenu-open, .ant-menu-horizontal:not(.ant-menu-dark) > .ant-menu-submenu-selected, .ant-menu-horizontal:not(.ant-menu-dark) > .ant-menu-submenu {
  border-bottom: 2px solid transparent;
}

/* 调整a-menu-item的padding */
.ant-menu-item, .ant-menu-submenu-title {
  padding: 0 16px;
}
</style>
