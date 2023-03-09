<template>
  <div id="index-create">
    <div class="top">
      <a-form :form="form" @submit="handleSubmit" style="width: 100%;" class="createPost">
        <a-form-item>
          <a-textarea allow-clear @keydown.enter.native="keyDown"
                      v-decorator="['content', validatorRules.content]"
                      :placeholder="$t('common.releaseTheIdeaOfThisMoment')"
                      :auto-size="{ minRows: 5, maxRows: 5 }"/>
          <div>
            <a-upload
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                list-type="picture"
                :default-file-list="fileList"
                :data="uploadParam"
                class="upload-list-inline">
              <a-button> <a-icon type="upload"/> 上传图片 </a-button>
            </a-upload>
          </div>
          <a-button class="button" type="primary" html-type="submit" style="float: right;">
            {{ $t("common.release") }}
          </a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>
<script>

import store from "@/store";

export default {
  components: {},

  data() {
    return {
      uploadParam:{
        //存储的基础路径
        base:"/design/post/picture/"
      },
      fileList: [
        {
          uid: '-1',
          name: 'xxx.png',
          status: 'done',
          url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
          thumbUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        },
        {
          uid: '-2',
          name: 'yyy.png',
          status: 'done',
          url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
          thumbUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        },
      ],
      data: {},
      form: this.$form.createForm(this, {name: 'coordinated'}),
      // 表单验证
      validatorRules: {
        content: {
          // 检验规则
          rules: [
            // 是否必须填写
            {required: false, message: this.$t('common.pleaseEnterComment')}
          ]
        }
      }
    };
  },

  methods: {
    handleSubmit(e) {
      e.preventDefault();
    },

    // 用户点击了ctrl+enter触发
    keyDown(e) {
      if (e.ctrlKey && e.keyCode === 13) {
        this.handleSubmit(e);
      }
    },

    //发布之前把上传的图片拼在后面以便markdown显示
    buildContent(){

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
.createPost{
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
