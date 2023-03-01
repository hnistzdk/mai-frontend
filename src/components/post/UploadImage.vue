<template>
  <div class="img-container">
    <label for="avatarFile">
      <img v-if="!postPicture"
           style="width: 100%"
           src="@/assets/img/avatar-bg.png"
           alt=""
      />
      <img v-else style="width: 100%;" :src="postPicture" alt=""/>
    </label>
    <input
        style="display: none"
        accept=".jpg, .jpeg, .png"
        @change="onFileChange"
        type="file"
        name="avatarFile"
        id="avatarFile"
    />
  </div>
</template>

<script>
export default {
  props: {
    // 题图
    postTitleMap: {type: String, default: ""},
  },

  data() {
    return {
      postPicture: this.postTitleMap,
    };
  },
  methods: {
    // 用户选择图片的回调
    onFileChange(e) {
      let file = e.target.files[0];
      this.$emit('titleMap', file);
      this.postPicture = window.URL.createObjectURL(file);
    },
  },
};
</script>

<style lang="less" scoped>
.img-container {
  padding: 0 10px;

  img {
    cursor: pointer;
  }

}
</style>
