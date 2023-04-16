<template>
  <div>

    <!-- 表格操作 -->
    <div class="table-operations">
      <a-button @click="addAction">
        添加角色
      </a-button>
    </div>

    <!-- 表格数据 -->
    <a-table
        bordered
        :columns="columns"
        :row-key="record => record.roleId"
        :data-source="data"
        :pagination="pagination"
        :loading="loading"
        @change="handleTableChange"
    >

     <span slot="action" slot-scope="text, record, index">
       <a-button @click="editAction(index)" type="primary" shape="circle" icon="edit" size="small" title="编辑" />
       <a-divider type="vertical" />
       <a-button type="danger" @click="deleteRole(record.roleId)" shape="circle" icon="delete" size="small" title="删除" />
        <EditRoleModal
            :visible="editVisible[index]"
            :data="record"
            @closeEditModal="closeEditModal(index)"
        />
    </span>

    </a-table>

    <AddRoleModal
        :data="{}"
        :visible="addVisible"
        @closeAddModal="closeAddModal"
    />

  </div>

</template>
<script>

import postService from "@/service/postService";

const columns = [
  {
    title: 'id',
    key: 'roleId',
    dataIndex: 'roleId',
    scopedSlots: { customRender: 'roleId' },
  },
  {
    title: '角色名',
    key: 'roleName',
    dataIndex: 'roleName',
    scopedSlots: { customRender: 'roleName' },
  },
  {
    title: '权限',
    key: 'roleKey',
    dataIndex: 'roleKey',
    scopedSlots: { customRender: 'roleKey' },
    ellipsis: true,
  },
  {
    title: '顺序',
    key: 'roleSort',
    dataIndex: 'roleSort',
    scopedSlots: { customRender: 'roleSort' },
  },
  {
    title: '操作',
    key: 'action',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' }
  },
];

import adminService from "@/service/adminService";
import EditRoleModal from "@/components/admin/role/EditRoleModal";
import AddRoleModal from "@/components/admin/role/AddRoleModal";

export default {

  components: {EditRoleModal,AddRoleModal},

  data() {
    return {
      data: [],
      loading: false,
      editVisible: [],
      //添加角色模态框
      addVisible: false,
      columns,
      params: {currentPage: 1, pageSize: global.defaultPageSize},
      totalCount: 0,
      pagination: {
        onChange: (page,pageSize) => {
          this.pagination.current = page;
          this.pagination.pageSize = pageSize;
          let params = {currentPage: page, pageSize: pageSize};
          adminService.getRoleList(params)
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

  methods: {
    handleTableChange(pagination, filters, sorter) {
      console.log(pagination);
      let params = {currentPage: pagination.current, pageSize: pagination.pageSize};
      adminService.getRoleList(params)
          .then((res) =>{
            this.data = res.data.list;
            this.pagination.total = res.data.totalCount;
          }).catch((err) => {
        this.$message.error(err.msg);
      });
    },

    editAction(index){
      this.editVisible = [];
      this.editVisible[index] = true;
    },

    closeEditModal(index) {
      this.editVisible = [];
      this.editVisible[index] = false;
    },

    addAction(){
      this.addVisible = true;
    },

    closeAddModal(){
      this.addVisible = false;
    },
    deleteRole(roleId){
      this.$confirm({
        centered: true,
        title: "你确定要删除此角色吗?",
        onOk: () => {
          adminService.deleteRole(roleId)
              .then((res) => {
                this.$message.success("删除成功");
                this.refresh();
              }).catch((err) => {
            this.$message.error(err.msg);
          })
        },
      });
    },

    refresh(){
      this.params.currentPage = 1;
      this.loading = true;
      adminService.getRoleList(this.params)
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
    this.refresh();
  },



};
</script>
