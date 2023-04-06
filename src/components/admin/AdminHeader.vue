<template>
  <div>
    <a-space>
      <a-button type="link" @click="routerToIndex">回到首页</a-button>
    </a-space>
  </div>
</template>
<script>


export default {

  components:{},

  data() {
    return {

    }
  },
  methods: {
    routerToIndex(){
      this.$router.push("/")
    }
  },
};
</script>
