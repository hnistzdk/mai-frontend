<template>
  <div id="index-create">
    <div class="top">
      <div style="width: 100%;" class="createPost">
        <a-textarea allow-clear @keydown.enter.native="keyDown"
                    v-model="content"
                    :placeholder="$t('common.releaseTheIdeaOfThisMoment')"
                    :auto-size="{ minRows: 5, maxRows: 5 }"
                    style="padding-bottom: 10px"
        />
        <div>
          <a-upload
              list-type="picture"
              :beforeUpload="uploadImg"
              :file-list="fileList"
              :data="uploadParam"
              :remove="removeImg"
              class="upload-list-inline">
            <a-button v-if="$store.state.isLogin">
              <a-icon type="file-image" theme="twoTone" />
              图片
            </a-button>
          </a-upload>
        </div>
        <div>
          <a-button @click="handleSubmit" class="button"  shape="round" type="primary" html-type="submit" style="float: right;">
            {{ $t("common.release") }}
          </a-button>
        </div>

      </div>
    </div>
  </div>
</template>
<script>

import store from "@/store";
import postService from "@/service/postService";

export default {

  name: "IndexCreate",

  data() {
    return {
      uploadParam: {
        //存储的基础路径
        base: "/design/post/picture/"
      },
      fileList: [],
      data: {},
      content: '',
      images: [],
    };
  },

  methods: {
    //提交
    handleSubmit(e) {
      e.preventDefault();
      if (!this.$store.state.isLogin) {
        this.$message.error("请先登录");
        store.state.loginVisible = true;
        return;
      }
      this.buildImages();
      let data = {content: this.content, html: this.content, markdown: this.content, images: this.images, type: 2};
      if (this.content.length === 0) {
        this.$message.warning("内容不能为空");
        return;
      }
      postService.postCreate(data)
          .then(res => {
            // this.$router.push("/user/" + this.$store.state.userId + "/post");
            this.$message.success(res.msg);
            this.$router.go(0);
          })
          .catch(err => {
            this.$message.error(err.msg);
          });
    },

    // 用户点击了ctrl+enter触发
    keyDown(e) {
      if (e.ctrlKey && e.keyCode === 13) {
        this.handleSubmit(e);
      }
    },

    removeImg(nowFile){
      this.fileList = this.fileList.filter(file => file.uid !== nowFile.uid);
    },

    //上传图片
    uploadImg(file) {
      let imageCount = this.fileList.length;
      if (imageCount >= global.gossipMaxImgCount){
        this.$message.warning("最多只能上传"+global.gossipMaxImgCount+"张图片");
        return;
      }
      // 校验图片大小（不能超过3M）
      if (file.size > global.maxImageSize) {
        this.$message.warning(this.$t("common.avatarSizeTip"));
        return;
      }
      const data = new FormData();
      data.append("image", file);
      data.append("base", this.uploadParam.base);
      postService.uploadPostImg(data)
          .then((res) => {
            let imgData = res.data
            let imgInfo = {
              uid: imgData.uid,
              name: imgData.filename,
              status: 'done',
              url: imgData.url,
              thumbUrl: imgData.url,
            }
            this.fileList.push(imgInfo);
          })
          .catch((err) => {
            console.log(err);
          });
    },

    buildImages() {
      let files = this.fileList;
      for (let i = 0; i < files.length; i++) {
        this.images.push(files[i].url)
      }
    },

  },

  mounted() {

  }
}
</script>

<style lang="less" scoped>

#index-create .top {
  display: flex;
  justify-content: center;
  align-items: center;

  .avatar {
    margin-right: 15px;
  }
}

.createPost {
  border: 2px solid rgb(236, 229, 229);
  padding: 5px;
}

/* tile uploaded pictures */
.upload-list-inline /deep/ .ant-upload-list-item {
  float: left;
  width: 200px;
  margin-right: 8px;
}

.upload-list-inline /deep/ .ant-upload-animate-enter {
  animation-name: uploadAnimateInlineIn;
}

.upload-list-inline /deep/ .ant-upload-animate-leave {
  animation-name: uploadAnimateInlineOut;
}

</style>
