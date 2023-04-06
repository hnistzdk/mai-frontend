<template>
  <div>
    <a-input-search
        placeholder="搜索职言"
        v-model="keywords"
        style="width: 400px"
        allow-clear
        @search="onSearch" />
    <a-divider />
    <a-table
        bordered
        :columns="columns"
        :row-key="record => record.postId"
        :data-source="data"
        :pagination="pagination"
        :loading="loading"
        @change="handleTableChange"
    >

     <span slot="action" slot-scope="text, record, index" style="display: flex">
       <a-space>
         <a-button @click="editAction(index)" type="primary" shape="circle" icon="edit" size="small" title="编辑" />
         <a-button @click="deleteAction(record.postId)" type="danger" shape="circle" icon="delete" size="small" title="删除" />
       </a-space>
       <EditGossipModal
           :visible="editVisible[index]"
           :data="record"
           @closeEditModal="closeEditModal(index)"
       />
     </span>


    </a-table>
  </div>

</template>
<script>

import adminService from "@/service/adminService";
import postService from "@/service/postService";
import EditGossipModal from "@/components/admin/gossip/EditGossipModal";


const columns = [
  {
    title: 'id',
    key: 'postId',
    dataIndex: 'postId',
    scopedSlots: { customRender: 'postId' },
  },
  {
    title: '内容',
    key: 'content',
    dataIndex: 'content',
    scopedSlots: { customRender: 'content' },
    ellipsis: true,
  },
  {
    title: '浏览量',
    key: 'pv',
    dataIndex: 'pv',
    scopedSlots: { customRender: 'pv' },
  },
  {
    title: '是否置顶',
    key: 'top',
    dataIndex: 'top',
    scopedSlots: { customRender: 'top' },
    customRender: top => {
      top = top ? '是' : '否'
      return top;
    }
  },
  {
    title: '创建时间',
    key: 'createTime',
    dataIndex: 'createTime',
    scopedSlots: { customRender: 'createTime' },
  },
  {
    title: '更新时间',
    key: 'updateTime',
    dataIndex: 'updateTime',
    scopedSlots: { customRender: 'updateTime' },
  },
  {
    title: '操作',
    key: 'action',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' }
  },
];

export default {

  components: {EditGossipModal},

  data() {
    return {
      data: [],
      loading: false,
      editVisible: [],
      columns,
      params: {currentPage: 1, pageSize: global.defaultPageSize,keywords:'',type:2},
      totalCount: 0,
      keywords: '',
      pagination: {
        onChange: (page,pageSize) => {
          this.pagination.current = page;
          this.pagination.pageSize = pageSize;
          let params = {currentPage: page, pageSize: pageSize,keywords:this.keywords,type:2};
          this.getList(params)
        },
        defaultCurrent: 1,
        current: 1,
        pageSize: global.defaultPageSize,
        total: 0
      },
    };
  },

  methods: {
    handleTableChange(pagination, filters, sorter) {
      console.log(pagination);
      let params = {currentPage: pagination.current, pageSize: pagination.pageSize,keywords:this.keywords,type:2};
      this.getList(params);
    },

    editAction(index){
      this.editVisible = [];
      this.editVisible[index] = true;
    },

    closeEditModal(index) {
      this.editVisible = [];
      this.editVisible[index] = false;
    },
    deleteAction(postId) {
      this.$confirm({
        centered: true,
        title: this.$t("common.deletePostTitle"),
        onOk: () => {
          postService.postDelete(postId)
              .then(() => {
                this.$message.success('删除成功');
                this.refresh();
              })
              .catch(err => {
                this.$message.error(err.msg);
              });
        },
      });
    },

    onSearch(){
      this.params.currentPage = 1;
      let params = this.params;
      this.getList(params);
    },

    getList(params){
      this.loading = true;
      this.params.keywords = this.keywords;
      params.userId = this.$store.state.userId;
      adminService.getPostList(params)
          .then((res) =>{
            this.data = res.data.list;
            this.pagination.total = res.data.totalCount;
            this.loading = false;
          }).catch((err) => {
        this.loading = false;
        this.$message.error(err.msg);
      });
    },

    refresh(){
      this.getList(this.params);
    },

  },

  beforeMount() {
    this.getList(this.params);
  },



};
</script>
