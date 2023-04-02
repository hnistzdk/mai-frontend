<template>
  <a-list item-layout="vertical" size="small" :pagination="pagination" :data-source="data" style="cursor: pointer;">
    <a-list-item slot="renderItem" slot-scope="item, index">
      <template v-for="{ type, text } in actions" slot="actions">
        <span :key="type">
          <span v-if="type === 'reply'">
            <a style="margin-right: 8px" class="operate comment-comment" @click.stop="routerPostDetail(item.objectId, item.commentId)">
              <i class="iconfont icon-comment" style="color: #8a919f;">
                <small> {{ $t("common.reply") }}</small>
              </i>
            </a>
          </span>
          <span v-if="type === 'reply'">
            <span>
              <a-button v-if="!item.readFlag" type="link" shape="round" @click="readOne(item,index)">
              标记为已读
              </a-button>
              <a-button v-if="item.readFlag" type="danger" shape="round" @click="readOne(item,index)">
              标记为未读
              </a-button>
            </span>
          </span>
        </span>
      </template>
      <a-list-item-meta >
          <span slot="description">
            回复 {{'@'+$store.state.username}}：{{item.content}}
          </span>
        <a-avatar slot="avatar" :src="item.senderAvatar ? item.senderAvatar : require('@/assets/img/default_avatar.png')"
                  @click.stop="routerUserCenter(item.senderId)"/>
        <span slot="title">
            <a class="username" @click.stop="routerUserCenter(item.senderId)">
                {{ item.senderUsername }}
            </a>
            <span class="left">
                <span style="padding-right: 2px;"> 回复了你的{{item.objectType === 1 ? '贴子' : '评论:'}} </span>
              <a-badge :dot="!item.readFlag"></a-badge>
            </span>
          </span>
        <span slot="title" v-if="item.objectType === 2">
            {{item.commentVO.content}}
          </span>
        <div slot="title">
          <a @click.stop="routerPostDetail(item.objectId)">
            <span v-if="item.objectType === 1">{{item.postDetailVO.title ? item.postDetailVO.title : item.postDetailVO.content}}</span>
          </a>
        </div>
      </a-list-item-meta>
      <div>
        <small style="color: #b5b9b9; padding-left: 10px;padding-right: 10px" v-text="item.updateTime"></small>
      </div>
    </a-list-item>
    <a-button v-if="data.length > 0" type="link" block shape="round" @click="readAll">
      全部已读
    </a-button>
  </a-list>
</template>
<script>
import infiniteScroll from 'vue-infinite-scroll';
import messageService from "@/service/messageService";


export default {
  directives: { infiniteScroll },
  data() {
    return {
      actions: [
        { type: 'reply', text: '156' },
      ],
      data: [],
      messageType: 1,
      noticeType: 1,
      currentPage: 1,
      pageSize: global.defaultPageSize,
      params: {currentPage: 1, pageSize: global.defaultPageSize,noticeType:1,messageType:1},
      totalCount: 0,
      pagination: {
        onChange: (page,pageSize) => {
          this.pagination.current = page;
          this.pagination.pageSize = pageSize;
          let params = {currentPage: page, pageSize: pageSize,noticeType:1,messageType:1};
          messageService.getMessageList(params)
              .then((res) =>{
                this.data = res.data.list;
                this.pagination.total = res.data.totalCount;
              }).catch((err) => {
                this.$message.error(err.msg);
          });
        },
        defaultCurrent: 1,
        current: 1,
        pageSize: global.defaultPageSize,
        total: 0
      },
    };
  },
  beforeMount() {
    this.params.currentPage = 1;
    messageService.getMessageList(this.params)
        .then((res) =>{
          console.log('res',res.data.list[0])
          this.data = res.data.list;
          this.pagination.total = res.data.totalCount;
        }).catch((err) => {
          this.$message.error(err.msg);
    });
  },
  methods: {
    readOne(item,index){
        //当前的状态
      let params = {noticeId:item.noticeId, readFlag: item.readFlag,userId:this.$store.state.userId};
      this.data[index].readFlag = !params.readFlag;
      messageService.markRead(params)
          .then((res) => {
            this.$message.success(res.msg)
          }).catch((err) => {
          //请求异常改回来
          this.data[index].readFlag = params.readFlag;
          this.$message.error(err.msg)
      });

    },
    readAll(){
      let params = {userId:this.$store.state.userId,messageType:this.messageType,noticeType: this.noticeType};
      console.log('params',params);
      for (let i = 0; i < this.data.length; i++) {
        this.data[i].readFlag = true;
      }
      messageService.makeAllRead(params)
          .then((res) => {
            this.$message.success(res.msg)
          }).catch((err) => {
            this.$message.error(err.msg)
          });
    },

    // 路由到用户中心页面
    routerUserCenter(userId) {
      let routeData = this.$router.resolve("/user/" + userId);
      window.open(routeData.href, '_blank');
    },

    // 路由到文章详情页面
    routerPostDetail(postId, commentId) {
      let url = "/detail/" + postId;
      if (commentId) {
        url = url + '#reply-' + commentId;
      }
      window.open(this.$router.resolve(url).href, '_blank');
    },

  },
};
</script>
<style lang="less">
.demo-infinite-container {
  border: 1px solid #bbc7d3;
  border-radius: 4px;
  overflow: auto;
  padding: 8px 24px;
  height: 200px;
}
.demo-loading-container {
  position: absolute;
  bottom: 40px;
  width: 100%;
  text-align: center;
}
</style>
