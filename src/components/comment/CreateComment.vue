<template>
  <div id="create-comment">
    <div class="top">
      <a-form :form="form" @submit="handleSubmit" style="width: 100%">
        <a-form-item>
          <a-textarea allow-clear @keydown.enter.native="keyDown"
                      v-decorator="['content', validatorRules.comment]"
                      :placeholder="$t('common.commentPlaceholder')"
                      :auto-size="{ minRows: 3, maxRows: 10 }"/>
          <a-button class="button" type="primary" html-type="submit" style="float: right;">
            {{ $t("common.postComment") }}
          </a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script>
import commentService from "@/service/commentService";
import store from "@/store";

export default {
  name: "CreateComment",

  props: {
    parentId: {type: Number, default: 0},
    //贴子信息
    postInfo: {},
    //评论信息
    commentInfo: {}
  },

  data() {
    return {
      data: {},
      form: this.$form.createForm(this, {name: 'coordinated'}),
      // 表单验证
      validatorRules: {
        comment: {
          // 检验规则
          rules: [
            // 是否必须填写
            {required: true, message: this.$t('common.pleaseEnterComment')}
          ]
        }
      }
    };
  },

  methods: {
    // 用户点击了ctrl+enter触发
    keyDown(e) {
      if (e.ctrlKey && e.keyCode === 13) {
        this.handleSubmit(e);
      }
    },

    // 发表评论
    handleSubmit(e) {
      e.preventDefault();
      if (this.$store.state.isLogin) {
        this.form.validateFields((err, values) => {
          if (!err) {
            console.log('CreateComment中的postInfo',this.postInfo)
            console.log('commentInfo',this.commentInfo)
            if (this.parentId) {
              this.data.parentId = this.parentId;
            } else {
              this.data.parentId = 0;
            }
            this.data.postId = this.$route.params.id;
            this.data.content = values.content;
            this.data.rootId = this.commentInfo.rootId;
            this.createComment();
          }
        });
      } else {
        store.state.loginVisible = true;
      }
    },

    // 添加评论
    createComment() {
      console.log('评论请求参数',this.data)
      commentService.createComment(this.data)
          .then((res) => {
            // 清空表单
            this.form.resetFields();
            this.$emit("refresh");
          })
          .catch(err => {
            this.$message.error(err.msg);
          });
    }
  },

}
</script>

<style lang="less" scoped>

#create-comment .top {
  display: flex;
  justify-content: center;
  align-items: center;

  .avatar {
    margin-right: 15px;
  }
}
</style>
