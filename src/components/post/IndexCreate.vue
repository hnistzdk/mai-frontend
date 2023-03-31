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
          <a-space size="large">
            <a-button v-if="$store.state.isLogin" @click="showModal" title="表情">
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
    <a-modal title="表情符号" :visible="isModalVisible" :footer="null" :dialog-style="{ right: '12%',bottom: '10%' }"
    @ok="handleOk" @cancel="handleCancel">
      <div>
        <a-col :span="2" :gutter="1" @click="handleOk(item.emoji)" v-for="(item,index) in emojiList" :key="item.id">
          <a :title="item.title">{{item.emoji}}</a>
        </a-col>
      </div>
      <br>
      <br>
      <br>
      <br>
      <br>
      <br>
      <br>
      <br>
      <br>
    </a-modal>
  </div>
</template>
<script>

import store from "@/store";
import postService from "@/service/postService";
import middleUtil from "@/utils/MiddleUtil";

export default {

  name: "IndexCreate",

  props:{
    gossipData:{}
  },

  data() {
    return {

      uploadParam: {
        //存储的基础路径
        base: "/design/post/picture/"
      },
      fileList: [],
      data: {},
      postId: 0,
      content: '',
      images: [],
      isModalVisible: false,
      emojiList: [
        {id:1,title:"嘿嘿",emoji:"😀"},
        {id:2,title:"嘻嘻",emoji:"😁"},
        {id:3,title:"笑哭了",emoji:"😂"},
        {id:4,title:"哈哈",emoji:"😃"},
        {id:5,title:"大笑",emoji:"😄"},
        {id:6,title:"苦笑",emoji:"😅"},
        {id:7,title:"斜眼笑",emoji:"😆"},
        {id:8,title:"微笑天使",emoji:"😇"},
        {id:9,title:"眨眼",emoji:"😉"},
        {id:10,title:"羞涩微笑",emoji:"😊"},
        {id:11,title:"呵呵",emoji:"🙂"},
        {id:12,title:"倒脸",emoji:"🙃"},
        {id:13,title:"笑得满地打滚",emoji:"🤣"},
        {id:14,title:"困扰",emoji:"😕"},
        {id:15,title:"担心",emoji:"😟"},
        {id:16,title:"微微不满",emoji:"🙁"},
        {id:17,title:"吃惊",emoji:"😮"},
        {id:18,title:"缄默",emoji:"😯"},
        {id:19,title:"震惊",emoji:"😲"},
        {id:20,title:"脸红",emoji:"😳"},
        {id:21,title:"恳求的脸",emoji:"🥺"},
        {id:22,title:"啊",emoji:"😦"},
        {id:23,title:"极度痛苦",emoji:"😧"},
        {id:24,title:"害怕",emoji:"😨"},
        {id:25,title:"冷汗",emoji:"😰"},
        {id:26,title:"失望但如释重负",emoji:"😥"},
        {id:27,title:"哭",emoji:"😢"},
        {id:28,title:"放声大哭",emoji:"😭"},
        {id:29,title:"吓死了",emoji:"😱"},
        {id:30,title:"困惑",emoji:"😖"},
        {id:31,title:"痛苦",emoji:"😣"},
        {id:32,title:"失望",emoji:"😞"},
        {id:33,title:"汗",emoji:"😓"},
        {id:34,title:"累死了",emoji:"😩"},
        {id:35,title:"累",emoji:"😫"},
        {id:36,title:"打哈欠",emoji:"🥱"},
        {id:37,title:"傲慢",emoji:"😤"},
        {id:38,title:"喜笑颜开",emoji:"🥰"},
        {id:39,title:"好崇拜哦",emoji:"🤩"},
        {id:40,title:"花痴",emoji:"😍"},
        {id:41,title:"亲亲",emoji:"😗"},
        {id:42,title:"飞吻",emoji:"😘"},
        {id:43,title:"微笑亲亲",emoji:"😙"},
        {id:44,title:"羞涩亲亲",emoji:"😚"},
        {id:45,title:"好吃",emoji:"😋"},
        {id:46,title:"吐舌",emoji:"😛"},
        {id:47,title:"单眼吐舌",emoji:"😜"},
        {id:48,title:"滑稽",emoji:"🤪"},
        {id:49,title:"眯眼吐舌",emoji:"😝"},
        {id:50,title:"发财",emoji:"🤑"},
        {id:51,title:"抱抱",emoji:"🤗"},
        {id:52,title:"不说",emoji:"🤭"},
        {id:53,title:"安静的脸",emoji:"🤫"},
        {id:54,title:"想一想",emoji:"🤔"},
        {id:55,title:"闭嘴",emoji:"🤐"},
        {id:56,title:"挑眉",emoji:"🤨"},
        {id:57,title:"冷漠",emoji:"😐"},
        {id:58,title:"无语",emoji:"😑"},
        {id:59,title:"沉默",emoji:"😶"},
        {id:60,title:"迷茫",emoji:"😶‍🌫️"},
        {id:61,title:"得意",emoji:"😏"},
        {id:62,title:"不高兴",emoji:"😒"},
        {id:63,title:"翻白眼",emoji:"🙄"},
        {id:64,title:"龇牙咧嘴",emoji:"😬"},
        {id:65,title:"呼气",emoji:"😮‍💨"},
        {id:66,title:"说谎",emoji:"🤥"},
        {id:67,title:"松了口气",emoji:"😌"},
        {id:68,title:"沉思",emoji:"😔"},
        {id:69,title:"困",emoji:"😪"},
        {id:70,title:"流口水",emoji:"🤤"},
        {id:71,title:"睡着了",emoji:"😴"},
        {id:72,title:"感冒",emoji:"😷"},
        {id:73,title:"发烧",emoji:"🤒"},
        {id:74,title:"受伤",emoji:"🤕"},
        {id:75,title:"恶心",emoji:"🤢"},
        {id:76,title:"呕吐",emoji:"🤮"},
        {id:77,title:"打喷嚏",emoji:"🤧"},
        {id:78,title:"脸发烧",emoji:"🥵"},
        {id:79,title:"冷脸",emoji:"🥶"},
        {id:80,title:"头昏眼花",emoji:"🥴"},
        {id:81,title:"晕头转向",emoji:"😵"},
        {id:82,title:"晕",emoji:"😵‍💫"},
        {id:83,title:"爆炸头",emoji:"🤯"},
        {id:84,title:"牛仔帽脸",emoji:"🤠"},
        {id:85,title:"聚会笑脸",emoji:"🥳"},
        {id:86,title:"墨镜笑脸",emoji:"😎"},
        {id:87,title:"书呆子脸",emoji:"🤓"},
        {id:88,title:"带单片眼镜的脸",emoji:"🧐"},
        {id:89,title:"怒火中烧",emoji:"😡"},
        {id:90,title:"生气",emoji:"😠"},
        {id:91,title:"脏话",emoji:"🤬"},
        {id:92,title:"恶魔微笑",emoji:"😈"},
        {id:93,title:"生气的恶魔",emoji:"👿"},
        {id:94,title:"头骨",emoji:"💀"},
        {id:95,title:"骷髅头",emoji:"☠"},
        {id:96,title:"大便",emoji:"💩"},
        {id:97,title:"小丑",emoji:"🤡"},
        {id:98,title:"鬼",emoji:"👻"},
        {id:99,title:"外星人",emoji:"👽"},
        {id:100,title:"外星怪物",emoji:"👾"},
        {id:101,title:"机器人",emoji:"🤖"},
        {id:102,title:"非礼勿视",emoji:"🙈"},
        {id:103,title:"非礼勿听",emoji:"🙉"},
        {id:104,title:"非礼勿言",emoji:"🙊"},
      ],
    };
  },

  methods: {
    showModal(){
      this.isModalVisible = true;
    },
    handleOk(item){
      this.content = this.content + item;
      this.isModalVisible = false;
    },
    handleCancel(){
      this.isModalVisible = false;
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
      if (data.postId === 0){
        postService.postCreate(data)
            .then(res => {
              // this.$router.push("/user/" + this.$store.state.userId + "/post");
              this.$message.success(res.msg);
              this.$router.go(0);
            })
            .catch(err => {
              this.$message.error(err.msg);
            });
      }else {
        // 更新职言
        postService.postUpdate(data)
            .then(res => {
              // 刷新
              this.$utils.successModal(()=>this.$router.go(0),"提示","发布成功");
            })
            .catch(err => {
              this.$message.error(err.msg);
            });
      }

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

    //编辑时填充数据
    fillEditData(data){
      console.log(' 编辑数据',data);
      if (data){
        this.postId = data.postId;
        this.content = data.content;
        this.images = data.images.split(",");
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
        //回到顶部
        document.querySelector("#app").scrollTop = 0;
      }
    },


  },

  mounted() {
    let _this = this;
    middleUtil.$on('fillEditData',(data)=> {
      _this.fillEditData(data);
    })
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

.smileHover:hover{
  color: #1890ff;
  cursor: pointer;
}

</style>
