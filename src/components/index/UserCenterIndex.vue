<template>
  <a-layout>
    <a-layout id="post-detail-index">
      <IndexHeader class="header"/>
      <a-layout-content>
        <main class="content">
          <a-col :span="$store.state.collapsed ? 24 : 18"
                 :style="$store.state.collapsed ? '' : 'border-right: 20px solid #f0f2f5'">
            <PersonalInfoDisplay
                :data="data"
                @refresh="getAuthorBlockList"
                style="background: #fff;"/>
            <a-row>
              <a-col :span="24" style="height: 10px;"/>
            </a-row>
            <UserTabs
                :userId="userId"
                style="background: #fff;"/>
          </a-col>
          <a-col v-if="!$store.state.collapsed" :span="6">
            <!-- 作者板块 -->
            <PersonalAchievement
                :data="data"
                style="background: #fff;"/>
            <a-row>
              <a-col :span="24" style="height: 10px;"/>
            </a-row>
            <FollowCount
                :userId="userId"
                style="background: #fff;"/>
            <a-row>
              <a-col :span="24" style="height: 10px;"/>
            </a-row>
            <a-row>
              <a-col :span="24" style="height: 10px;"/>
            </a-row>
          </a-col>
        </main>
      </a-layout-content>
      <FooterButtons v-if="!$store.state.collapsed"/>
    </a-layout>
  </a-layout>
</template>

<script>
import IndexHeader from "@/components/index/head/IndexHeader";
import PersonalAchievement from "@/components/right/PersonalAchievement";
import FollowCount from "@/components/right/FollowCount";
import PersonalInfoDisplay from "@/components/user/PersonalInfoDisplay";
import UserTabs from "@/components/user/UserTabs";
import FooterButtons from "@/components/utils/FooterButtons";
import userService from "@/service/userService";

export default {
  name: "",
  components: {IndexHeader, PersonalAchievement, FollowCount, PersonalInfoDisplay, UserTabs, FooterButtons},

  data() {
    return {
      userId: Number(this.$route.params.id),
      // 用户信息
      data: {},
    };
  },

  methods: {
    // 获取用户信息
    getAuthorBlockList() {
      userService.getUserInfo({userId: this.userId})
          .then(res => {
            this.data = res.data;
          })
          .catch(err => {
            this.$message.error(err.msg);
          });
    },
  },

  mounted() {
    this.getAuthorBlockList();
  },

};
</script>


<style>
#post-detail-index .header {
  position: fixed;
  width: 100%;
  z-index: 999;
  background: #fff;
  border-bottom: 1px solid #00000021;
}

#post-detail-index .content {
  margin-top: 64px;
  width: 1100px;
}

@media screen and (max-width: 576px) {
  #post-detail-index .content {
    margin-top: 64px;
    width: 100%;
  }
}

#post-detail-index .ant-layout-header {
  display: flex;
  align-items: center;
  justify-content: center;
}

#post-detail-index .ant-layout-content {
  display: flex;
  justify-content: center;
}

#post-detail-index .ant-layout-header {
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
