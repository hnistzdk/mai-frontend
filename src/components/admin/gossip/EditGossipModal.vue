<template>
  <a-modal
      :centered="true"
      :title="null"
      :footer="null"
      :destroyOnClose="true"
      :maskClosable="true"
      @cancel="handleCancel"
      @ok="handleOk"
      :visible="visible"
      width="50%"
  >
    <div id="index-create">
      <div class="top">
        <div style="width: 100%;" class="createPost">
          <a-textarea id="textarea" allow-clear @keydown.enter.native="keyDown"
                      v-model="content"
                      :placeholder="$t('common.releaseTheIdeaOfThisMoment')"
                      :auto-size="{ minRows: 5, maxRows: 5 }"
                      style="padding-bottom: 10px"
          />
          <div>
            <a-space size="large">
              <a-button @click="showModal" title="表情">
                <a-icon type="smile" theme="twoTone" />
              </a-button>
            </a-space>
            <a-upload
                list-type="picture"
                :beforeUpload="uploadImg"
                :file-list="fileList"
                :data="uploadParam"
                :remove="removeImg"
                class="upload-list-inline">
              <a-button v-if="$store.state.isLogin" title="图片">
                <a-icon type="file-image" theme="twoTone" />
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
      <a-modal title="表情符号" :visible="emojiModalVisible" :footer="null" :dialog-style="{ right: '12%',bottom: '10%' }"
               @cancel="handleEmojiCancel">
        <div class="face">
          <Picker @select="showEmoji" :i18n="I18N" />
        </div>
      </a-modal>
    </div>

  </a-modal>
</template>
<script>

import store from "@/store";
import IndexCreate from "@/components/post/IndexCreate";
import { Picker } from "emoji-mart-vue";
import postService from "@/service/postService";


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

  components:{IndexCreate,Picker},

  props:{
    data: {},
    visible: false,
  },


  data() {

    return {
      uploadParam: {
        //存储的基础路径
        base: "/design/post/picture/"
      },
      fileList: [],
      postId: 0,
      content: '',
      I18N: I18N,
      images: [],
      emojiModalVisible: false,

    }
  },
  methods: {
    // 选择表情
    showEmoji(emoji) {
      const str = emoji.native
      let oText = document.getElementById('textarea')
      let index = this.getCursorPosition(oText)
      this.$nextTick( () => {
        this.insert(oText,str,index)
      })
      this.emojiModalVisible = false;
    },
    // 插入表情
    insert (oText,varStr,index) {
      let text = this.content
      let startStr = text.substring(0, index)
      let endStr = text.substring(index, text.length)
      this.content = startStr + varStr + endStr
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
      this.emojiModalVisible = true;
    },
    handleEmojiCancel(){
      this.emojiModalVisible = false;
    },

    //提交
    handleSubmit(e) {
      e.preventDefault();
      if (!this.$store.state.isLogin) {
        this.$message.error("请先登录");
        store.state.loginVisible = true;
        return;
      }
      this.buildImages();
      let data = {postId: this.postId,content: this.content, html: this.content, markdown: this.content, images: this.images, type: 2};
      if (this.content.length === 0) {
        this.$message.warning("内容不能为空");
        return;
      }
      // 更新职言
      postService.postUpdate(data)
          .then(res => {
            // 刷新
            this.$utils.successModal(()=>this.$router.go(0),"提示","发布成功");
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


    handleOk(){

    },

    handleCancel(){
      this.$emit("closeEditModal");
    },

  },

  mounted() {
    this.postId = this.data.postId;
    this.content = this.data.content;
    this.images = this.data.images ? this.data.images.split(",") : [];
    if (this.images.length > 0){
      for (let i = 0; i < this.images.length; i++) {
        if (this.images[0] === ''){
          continue;
        }
        let filename = this.images[i].substring(this.images[i].lastIndexOf("/")+1,this.images[i].length).split(".")[0];
        let imgInfo = {
          uid: filename,
          name: filename,
          status: 'done',
          url: this.images[i],
          thumbUrl: this.images[i],
        }
        this.fileList.push(imgInfo);
      }
      // 重置为空 防止图片重复
      this.images = [];
    }
  }

};
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

.smileHover:hover{
  color: #1890ff;
  cursor: pointer;
}

</style>
