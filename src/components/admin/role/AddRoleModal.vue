<template>
  <a-modal
      :centered="true"
      title="添加角色"
      :footer="null"
      :destroyOnClose="true"
      :maskClosable="true"
      @cancel="handleCancel"
      @ok="handleOk"
      :visible="visible"
  >
    <a-form id="addForm"
            :rules="rules"
            :form="form"
            @submit="handleSubmit"
                  >
      <a-form-item label="角色名">
        <a-input allow-clear
                 placeholder="角色名"
                 v-decorator="['roleName',{ rules: [{ required: true, message: '角色名不能为空' }] },]"
        />
      </a-form-item>
      <a-form-item label="顺序">
        <a-input allow-clear
                 placeholder="顺序"
                 type="number"
                 min="0"
                 v-decorator="['roleSort',{ rules: [{ required: true, message: '顺序不能为空' }] },]"
        />
      </a-form-item>

      <!-- 按钮 -->
      <a-form-item>
        <a-button type="primary" html-type="submit"
                  class="form-item-submit">
          {{ $t('common.saveChanges') }}
        </a-button>
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script>


import adminService from "@/service/adminService";


export default {

  components:{},

  props:{
    visible: false,
  },

  beforeCreate() {
    this.form = this.$form.createForm(this, {name: 'role_add'});
  },


  data() {
    // 验证昵称
    let validateRoleName = (rule, value, callback) => {
      console.log('验证角色名')
      if (value === '') {
        callback(new Error("角色名不能为空"));
      } else if (value.length > 10) {
        callback(new Error("角色名长度在10个字符以内"));
      }else {
        callback();
      }
    };

    return {
      rules: {
        nickname: [{validator: validateRoleName, trigger: 'change'}],
      },
    }
  },
  methods: {
    handleOk(){

    },

    handleCancel(){
      this.$emit("closeAddModal");
    },

    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          adminService.createRole(values)
              .then(res => {
                this.$utils.successModal(()=>this.$router.go(0),"提示","添加成功");
              })
              .catch(err => {
                this.$message.error(err.msg);
              });
        }
      });
    },

  },
};
</script>
