<template>
  <div id="write-post">
    <div class="left">
      <a-input class="write-item" v-model="postTitle" :placeholder="$t('common.enterPostTitle')" size="large"/>
<!--      <a-popover v-model="visible" :title="$t('common.releasePost')" trigger="click" placement="bottomRight">-->
<!--        <div slot="content" style="width: 500px;">-->
<!--          <PostBasicInfo-->
<!--              :postUser="postAuthor"-->
<!--              :postLabel="postLabel"-->
<!--              :postTitleMap="postTitleMap"-->
<!--              :postTitle="postTitle"-->
<!--              :htmlCode="htmlCode"-->
<!--              :markdownCode="markdownCode"/>-->
<!--        </div>-->
<!--      </a-popover>-->
      <a-button class="write-item" @click="submitPost" type="primary" style="height: 30px;"
                v-text="$route.params.id ? $t('common.update') : $t('common.release')"></a-button>
      <a-icon class="write-item" type="swap"/>
      <a-tooltip placement="bottom">
        <template slot="title">
          {{ $t("common.homePage") }}
        </template>
        <div style="cursor: pointer;" @click="routerUserCenter($store.state.userId)">
          <a-avatar :size="46" slot="avatar" class="write-item"
                    :src="$store.state.avatar ? $store.state.avatar : require('@/assets/img/default_avatar.png')"/>
        </div>
      </a-tooltip>
    </div>
    <div class="right">
      <mavon-editor ref=md @imgAdd="imgAdd" @change="markdownChange" v-model="markdownCode"
                    :toolbars="toolbars"
                    toolbarsBackground="#f4f4f4"
                    codeStyle="obsidian"
                    :tabSize=4
                    :xssOptions=false
                    boxShadowStyle=""
                    :placeholder="$t('common.startEditing')"></mavon-editor>
    </div>

    <!-- 登录Model -->
<!--    <Login />-->
    <!-- 注册Model -->
<!--    <Register />-->
  </div>
</template>

<script>
import postService from "@/service/postService";
import PostBasicInfo from "@/components/post/PostBasicInfo";
import Login from "@/components/login/Login";
import Register from "@/components/login/Register";

export default {
  components: {PostBasicInfo, Login, Register},

  data() {
    return {
      // 贴子创建者
      postAuthor: 0,
      // 贴子标签
      postLabel: [],
      // 题图
      postTitleMap: '',
      // 贴子标题
      postTitle: '',
      // 贴子内容
      markdownCode: '',
      htmlCode: '',
      visible: false,
      toolbars: {
        // 粗体
        bold: true,
        // 斜体
        italic: true,
        // 标题
        header: true,
        // 下划线
        underline: true,
        // 中划线
        strikethrough: true,
        // 标记
        mark: true,
        // 上角标
        superscript: true,
        // 下角标
        subscript: true,
        // 引用
        quote: true,
        // 有序列表
        ol: true,
        // 无序列表
        ul: true,
        // 链接
        link: true,
        // 图片链接
        imagelink: true,
        // code
        code: true,
        // 表格
        table: true,
        // 全屏编辑
        fullscreen: true,
        // 沉浸式阅读
        readmodel: true,
        // 展示html源码
        htmlcode: true,
        // 帮助
        help: true,
        /* 1.3.5 */
        // 上一步
        undo: true,
        // 下一步
        redo: true,
        // 清空
        trash: true,
        // 保存（触发events中的save事件）
        save: false,
        /* 1.4.2 */
        // 导航目录
        navigation: true,
        /* 2.1.8 */
        // 左对齐
        alignleft: true,
        // 居中
        aligncenter: true,
        // 右对齐
        alignright: true,
        /* 2.2.1 */
        // 单双栏模式
        subfield: false,
        // 预览
        preview: true,
      },
      uploadParam:{
        //存储的基础路径
        base:"/design/post/picture/"
      },
      // 表单验证
      validatorRules: {
        label: {
          // 检验规则
          rules: [
            // 是否必须填写
            { required: false, message: this.$t('common.selectLabel') }
          ]
        }
      }
    };
  },

  methods: {
    // 绑定@imgAdd event
    imgAdd(pos, $file) {
      // 校验图片大小（不能超过5M）
      if ($file.size > 5 * 1024 * 1024) {
        this.$message.warning(this.$t("common.avatarSizeTip"));
        this.$refs.md.$img2Url(pos, null);
        return;
      }
      // 第一步.将图片上传到服务器.
      const formData = new FormData();
      formData.append("image", $file);
      formData.append("base", this.uploadParam.base);
      postService.uploadPostImg(formData)
          .then((res) => {
            /**
             * $vm指为mavonEditor实例，可以通过如下两种方式获取
             * 1、通过引入对象获取: import {mavonEditor} from ... 等方式引入后，此时$vm即为mavonEditor
             * 2、通过$refs获取: html声明ref : <mavon-editor ref=md ></mavon-editor>， 此时$vm为 this.$refs.md`（我使用$vm反正是不行的）
             */
            // 第二步.将返回的url替换到文本原位置![...](0) -> ![...](url)
            this.$refs.md.$img2Url(pos, res.data.url);
          })
          .catch(err => {
            this.$message.error(err.msg);
          });
    },
    submitPost(e) {
      e.preventDefault();
      if (this.postTitle.length === 0) {
        this.$message.warning("标题不能为空");
        return;
      }

      if (this.htmlCode.length === 0 || this.markdownCode.length === 0) {
        this.$message.warning("内容不能为空");
        return;
      }
      let data = {"title":this.postTitle,"markdown":this.markdownCode,"html": this.htmlCode,"images":[],type:1}
      // 地址栏有值（更新贴子）才调用
      let postId = this.$route.params.id;
      if (postId) {
        data.append("postId", postId);
        this.postUpdate(data);
      } else {
        this.postCreate(data);
      }
    },

    // 发帖
    postCreate(data) {
      postService.postCreate(data)
          .then(res => {
            this.$router.push("/user/" + this.$store.state.userId + "/post");
          })
          .catch(err => {
            this.$message.error(err.msg);
          });
    },

    // 更新贴子
    postUpdate(data) {
      if (this.$store.state.userId !== this.postUser) {
        this.$message.warning("你无权编辑他人撰写的贴子");
        return;
      }
      postService.postUpdate(data)
          .then(res => {
            // 返回上一页
            this.$router.go(-1);
          })
          .catch(err => {
            this.$message.error(err.msg);
          });
    },

    // 获取贴子详细信息
    getPostById() {
      postService.getPostById({id: this.$route.params.id})
          .then(res => {
            this.postAuthor = res.data.createUser;
            if (this.$store.state.userId !== this.postAuthor) {
              this.$message.warning("你无权编辑他人撰写的贴子");
              return;
            }
            // 标题
            this.postTitle = res.data.title;
            // 内容
            this.markdownCode = res.data.markdown;
            // 标签
            res.data.labelDTOS.forEach((item) => {
              this.postLabel.push(item.id);
            })
            // 题图
            this.postTitleMap = res.data.titleMap;
          })
          .catch(err => {
            this.$message.error(err.msg);
          });
    },

    // markdown编辑改变事件
    markdownChange() {
      this.htmlCode = this.$refs.md.d_render;
      this.markdownCode = this.$refs.md.d_value;
    },

    // 路由到用户中心页面
    routerUserCenter(userId) {
      if (this.$store.state.isLogin) {
        let routeData = this.$router.resolve("/user/" + userId);
        window.open(routeData.href, '_blank');
      } else {
        this.$store.state.loginVisible = true;
      }
    }
  },

  mounted() {
    // 地址栏有值（更新贴子）才调用
    if (this.$route.params.id) {
      this.getPostById();
    }
  }
}
</script>

<style>
#write-post {
  height: 100%;
}

#write-post .left {
  height: 8%;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}

#write-post .right {
  height: 92%;
}

#write-post .write-item {
  height: auto;
  margin: 0 15px;
}

#write-post .ant-input {
  height: 50px;
  border: none;
  font-size: 26px;
}

/* 让markdown占满 */
#write-post .v-note-wrapper.markdown-body.shadow {
  height: 100%
}

/* 代码高亮部分设置样式 */
#write-post .markdown-body .highlight pre, .markdown-body pre {
  padding: 0!important;
}
#write-post .hljs {
  padding: 10px;
}

/* markdown */
#write-post .v-note-wrapper {
  z-index: 900;
}

/* markdown */
#write-post .v-note-wrapper.markdown-body.shadow {
  z-index: 0!important;
}
</style>
