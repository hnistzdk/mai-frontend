<template>
  <a-menu @click="handleMenuClick" theme="dark" mode="inline" :default-selected-keys="[selected]">
    <a-menu-item v-if="$store.state.isManage" key="user">
      <a-icon type="user" />
      <span class="nav-text">用户管理</span>
    </a-menu-item>
    <a-menu-item v-if="$store.state.isManage" key="role">
      <a-icon type="usergroup-add" />
      <span class="nav-text">角色管理</span>
    </a-menu-item>
    <a-menu-item key="post">
      <a-icon type="book" />
      <span class="nav-text">贴子管理</span>
    </a-menu-item>
    <a-menu-item key="gossip">
      <a-icon type="book" />
      <span class="nav-text">职言管理</span>
    </a-menu-item>
  </a-menu>
</template>
<script>


export default {

  components:{},

  props: {
    selected: '',
  },

  data() {
    return {

    }
  },
  methods: {
    handleMenuClick({key}){
      if (key === 'user') {
        this.$router.push("/admin/user");
      }
      if (key === 'role') {
        this.$router.push("/admin/role");
      }
      if (key === 'post') {
        this.$router.push("/admin/post");
      }
      if (key === 'gossip') {
        this.$router.push("/admin/gossip");
      }
    }
  },
};
</script>
