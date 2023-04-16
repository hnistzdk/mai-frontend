<template>
  <a-modal
      :centered="true"
      :title="'编辑角色'"
      :footer="null"
      :destroyOnClose="true"
      :maskClosable="true"
      @cancel="handleCancel"
      @ok="handleOk"
      :visible="visible"
  >
    <a-form-model ref="editForm"
                  :rules="rules"
                  :model="data">
      <a-form-item label="角色名" has-feedback prop="roleName">
        <a-input allow-clear
                 placeholder="角色名"
                 :value="data.roleName"
        />
      </a-form-item>
      <a-form-item label="权限" has-feedback prop="roleKey">
        <a-input allow-clear
                 placeholder="权限"
                 :value="data.roleKey"
                 type="textarea"
        />
      </a-form-item>
      <a-form-item label="顺序" has-feedback prop="roleSort">
        <a-input allow-clear
                 placeholder="顺序"
                 :value="data.roleSort"
                 type="number"
                 min="0"
        />
      </a-form-item>

      <!-- 按钮 -->
      <a-form-model-item>
        <a-form-item class="form-item-submit">
          <a-button type="primary" html-type="submit" @click="handleSubmit('editForm')">
            {{ $t('common.saveChanges') }}
          </a-button>
        </a-form-item>
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>
<script>


import adminService from "@/service/adminService";


export default {

  components:{},

  props:{
    data: {},
    visible: false,
  },

  beforeCreate() {
    this.form = this.$form.createForm(this, {name: 'role_edit'});
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
      this.$emit("closeEditModal");
    },

    handleSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const data = {
            roleId: this.data.roleId,
            roleName: this.data.roleName,
            roleSort: this.data.roleSort,
          };
          adminService.updateRole(data)
              .then(res => {
                this.$utils.successModal(()=>this.$router.go(0),"提示","修改成功");
              })
              .catch(err => {
                this.$message.error(err.msg);
              });
        } else {
          return false;
        }
      });
    },

  },
};
</script>
