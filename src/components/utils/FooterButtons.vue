<template>
  <div class="footer-buttons">
    <BackTop/>
    <a-tooltip placement="left">
      <template slot="title">
        GitHub
      </template>
      <div @click="routerGithub" class="github-icon-container" :style="{background: $store.state.themeColor}">
        <i class="iconfont icon-GitHub"></i>
      </div>
    </a-tooltip>
  </div>
</template>

<script>
import BackTop from "@/components/utils/BackTop";

export default {
  components: {BackTop},
  methods: {
    // 点击底部按钮跳转到源码页面
    routerGithub() {
      window.open('https://github.com/hnistzdk', '_blank');
    },
  }
};
</script>

<style lang="less">
.footer-buttons {
  position: fixed;
  bottom: 8.6rem;
  right: 6.6rem;
  z-index: 888;

  .feedback-icon-container, .github-icon-container, .chat-icon-container {
    border-radius: 50%;
    width: 34px;
    height: 34px;
    text-align: center;
    cursor: pointer;

    i {
      line-height: 34px;
      color: white;
    }
  }

  .chat-icon-container, .github-icon-container {
    margin-top: 10px;
  }
}
</style>
