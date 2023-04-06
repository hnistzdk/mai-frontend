<template>
  <div>
    <a-input-search
        placeholder="搜索用户"
        v-model="keywords"
        style="width: 400px"
        allow-clear
        @search="onSearch" />
    <a-divider />
    <a-table
        bordered
        :columns="columns"
        :row-key="record => record.userId"
        :data-source="data"
        :pagination="pagination"
        :loading="loading"
        @change="handleTableChange"
    >

     <span slot="action" slot-scope="text, record, index" style="display: flex">
       <a-space>
         <a-button @click="editAction(index)" type="primary" shape="circle" icon="edit" size="small" title="编辑" />
       <a-button type="danger" shape="circle" icon="delete" size="small" title="删除" />
        <EditUserModal
            :visible="editVisible[index]"
            :data="record"
            @closeEditModal="closeEditModal(index)"
        />
       </a-space>
    </span>

    </a-table>
  </div>

</template>
<script>

const columns = [
  {
    title: 'id',
    key: 'userId',
    dataIndex: 'userId',
    scopedSlots: { customRender: 'userId' },
  },
  {
    title: '用户名',
    key: 'username',
    dataIndex: 'username',
    scopedSlots: { customRender: 'username' },
  },
  {
    title: '角色',
    key: 'roleName',
    dataIndex: 'roleName',
    scopedSlots: { customRender: 'roleName' },
  },
  {
    title: '昵称',
    key: 'nickname',
    dataIndex: 'nickname',
    scopedSlots: { customRender: 'nickname' },
  },
  {
    title: '性别',
    key: 'sex',
    dataIndex: 'sex',
    scopedSlots: { customRender: 'sex' },
    customRender: sex => {
      if (!sex){
        return '';
      }
      sex = sex === '0' ? '男' : '女'
      return sex;
    }
  },
  {
    title: '手机',
    key: 'phone',
    dataIndex: 'phone',
    scopedSlots: { customRender: 'phone' },
  },
  {
    title: '真实姓名',
    key: 'realName',
    dataIndex: 'realName',
    scopedSlots: { customRender: 'realName' },
  },
  {
    title: '学历',
    key: 'educationalBackground',
    dataIndex: 'educationalBackground',
    scopedSlots: { customRender: 'educationalBackground' },
  },
  {
    title: '毕业年份',
    key: 'graduationYear',
    dataIndex: 'graduationYear',
    scopedSlots: { customRender: 'graduationYear' },
  },
  {
    title: '毕业院校',
    key: 'graduatedFrom',
    dataIndex: 'graduatedFrom',
    scopedSlots: { customRender: 'graduatedFrom' },
    ellipsis: true,
  },

  {
    title: '专业',
    key: 'specializedSubject',
    dataIndex: 'specializedSubject',
    scopedSlots: { customRender: 'specializedSubject' },
  },
  {
    title: '账号状态',
    key: 'status',
    dataIndex: 'status',
    scopedSlots: { customRender: 'status' },
    customRender: status => {
      status = status === '0' ? '启用' : '停用'
      return status;
    }
  },
  {
    title: '操作',
    key: 'action',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' }
  },
];

import adminService from "@/service/adminService";
import EditUserModal from "@/components/admin/user/EditUserModal";

export default {

  components: {EditUserModal},

  data() {
    return {
      data: [],
      loading: false,
      editVisible: [],
      columns,
      params: {currentPage: 1, pageSize: global.defaultPageSize,keywords:''},
      totalCount: 0,
      keywords: '',
      pagination: {
        onChange: (page,pageSize) => {
          this.pagination.current = page;
          this.pagination.pageSize = pageSize;
          let params = {currentPage: page, pageSize: pageSize,keywords:this.keywords};
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
      let params = {currentPage: pagination.current, pageSize: pagination.pageSize,keywords:this.keywords};
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

    onSearch(){
      this.params.currentPage = 1;
      let params = this.params;
      this.getList(params);
    },

    getList(params){
      this.loading = true;
      this.params.keywords = this.keywords;
      adminService.getUserList(params)
          .then((res) =>{
            this.data = res.data.list;
            this.pagination.total = res.data.totalCount;
            this.loading = false;
          }).catch((err) => {
        this.loading = false;
        this.$message.error(err.msg);
      });
    }

  },


  beforeMount() {
    this.getList(this.params);
  },



};
</script>
