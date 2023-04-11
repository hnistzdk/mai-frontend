<template>
  <div id="create-comment">
    <div class="top">
      <a-form :form="form" @submit="handleSubmit" style="width: 100%">
        <a-form-item>
          <a-textarea :id="id" allow-clear @keydown.enter.native="keyDown"
                      v-model="data.content"
                      :placeholder="$t('common.commentPlaceholder')"
                      :auto-size="{ minRows: 3, maxRows: 10 }"/>

          <a-button class="button" type="primary" html-type="submit" style="float: right;">
            {{ $t("common.postComment") }}
          </a-button>
          <a-space size="large">
            <a-button v-if="$store.state.isLogin" @click="showModal" title="表情">
              <a-icon type="smile" theme="twoTone" />
            </a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </div>
    <a-modal title="表情符号" :visible="isModalVisible" :footer="null" :dialog-style="{ right: '12%',bottom: '10%' }"
             @cancel="handleCancel">
      <div class="face">
        <Picker @select="showEmoji" :i18n="I18N" />
      </div>
    </a-modal>
  </div>
</template>

<script>
import commentService from "@/service/commentService";
import store from "@/store";
import { Picker } from "emoji-mart-vue";


const I18N = {
  search: '搜索',
  notfound: 'No Emoji Found',
  categories: {
    search: '搜索结果',
    recent: '常用',
    smileys: '表情与情感',
    people: '人物',
    nature: '动物与自然',
    foods: '食物与饮料',
    activity: '活动',
    places: '旅行与地理',
    objects: '物品',
    symbols: '符号标志',
    flags: '旗帜',
    // custom: 'Custom',
  },
}

export default {

  components: {Picker},

  name: "CreateComment",

  props: {
    id: '',
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
      },
      I18N: I18N,
      isModalVisible: false,
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
        if (!this.data.content){
          this.$message.warning("评论不能为空");
          return;
        }
        this.form.validateFields((err, values) => {
          if (!err) {
            if (this.parentId) {
              this.data.parentId = this.parentId;
            } else {
              this.data.parentId = 0;
            }
            this.data.postId = this.$route.params.id;
            if (this.commentInfo){
              this.data.rootId = this.commentInfo.rootId;
            }
            this.createComment();
          }
        });
      } else {
        store.state.loginVisible = true;
      }
    },

    // 添加评论
    createComment() {
      let param = this.data;
      // 填充贴子信息
      param.postUserId = this.postInfo.authorId;
      param.postUsername = this.postInfo.authorUsername;
      commentService.createComment(param)
          .then((res) => {
            // 清空表单
            this.$message.success('评论成功')
            this.form.resetFields();
            // 这里清空文本框
            let oText = document.getElementById(this.id)
            oText.value = '';
            this.$emit("refresh");
          })
          .catch(err => {
            this.$message.error(err.msg);
          });
    },

    // 选择表情
    showEmoji(emoji) {
      const str = emoji.native
      let oText = document.getElementById(this.id)
      let index = this.getCursorPosition(oText)
      this.$nextTick( () => {
        this.insert(oText,str,index)
      })
      this.isModalVisible = false;
    },
    // 插入表情
    insert (oText,varStr,index) {
      let text = this.data.content ? this.data.content : '';
      let startStr = text.substring(0, index)
      let endStr = text.substring(index, text.length)
      this.data.content = startStr + varStr + endStr
      setTimeout(() => {
        this.setCaretPosition(oText, index+2)
      }, 10);
    },
    // 获取光标位置
    getCursorPosition (obj) {
      let cursorIndex = 0
      if (document.selection) {
        obj.focus()
        let range = document.selection.createRange()
        range.moveStart('character', -obj.value.length)
        cursorIndex = range.text.length
      } else if (obj.selectionStart || obj.selectionStart === 0) {
        cursorIndex = obj.selectionStart
      }
      return cursorIndex
    },
    // 设置光标位置
    setCaretPosition(ctrl, pos){
      if(ctrl.setSelectionRange)
      {
        ctrl.focus();
        ctrl.setSelectionRange(pos,pos);
      }
      else if (ctrl.createTextRange) {
        let range = ctrl.createTextRange();
        range.collapse(true);
        range.moveEnd('character', pos);
        range.moveStart('character', pos);
        range.select();
      }
    },

    showModal(){
      this.isModalVisible = true;
    },
    handleCancel(){
      this.isModalVisible = false;
    },

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
.smileHover:hover{
  color: #1890ff;
  cursor: pointer;
}
</style>
