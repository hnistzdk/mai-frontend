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
  >
    <a-form-model ref="editForm"
            :rules="rules"
            :model="data">
      <a-form-item label="昵称" has-feedback prop="nickname">
        <a-input allow-clear
                 placeholder="昵称"
                 :value="data.nickname"
        />
      </a-form-item>
      <a-form-item label="性别" has-feedback prop="sex">
        <a-select :value="data.sex">
          <a-select-option value="0">
            男
          </a-select-option>
          <a-select-option value="1">
            女
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="手机" has-feedback prop="phone">
        <a-input allow-clear
                 placeholder="手机"
                 :value="data.phone"
        />
      </a-form-item>
      <a-form-item label="角色" has-feedback prop="roleId">
        <a-select :value="data.roleId"
                  :options="roleOptions"
                  @change="changeRoleSelect"
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
    this.form = this.$form.createForm(this, {name: 'user_edit'});
  },


  data() {
    // 验证昵称
    let validateNickname = (rule, value, callback) => {
      console.log('验证昵称')
      if (value === '') {
        callback(new Error("昵称不能为空"));
      } else if (value.length > 10) {
        callback(new Error("昵称长度在10个字符以内"));
      }else {
        callback();
      }
    };

    return {
      rules: {
        nickname: [{validator: validateNickname, trigger: 'change'}],
      },
      roleOptions:[],
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
            userId: this.data.userId,
            roleId: this.data.roleId,
            nickname: this.data.nickname,
            sex: this.sex,
            position: this.data.position,
            company: this.data.company,
            selfIntroduction: this.data.selfIntroduction,
            graduationYear: this.data.graduationYear,
            educationalBackground: this.data.educationalBackground,
            graduatedFrom: this.data.graduatedFrom,
            specializedSubject: this.data.specializedSubject,
          };
          adminService.updateUserInfo(data)
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

    changeRoleSelect(value){
      this.data.roleId = value;
    }

  },


  beforeMount() {
    adminService.getRoleSelectData()
        .then((res) => {

          let data = res.data;

          for (let i = 0; i < data.length; i++) {

            let option = {label: data[i].roleName, value: data[i].roleId};

            this.roleOptions.push(option);

          }

        }).catch((err) => {
          this.$message.error(err.msg)
    })
  }


};
</script>
