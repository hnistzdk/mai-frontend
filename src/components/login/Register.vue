<template>
  <div>
    <a-modal v-model="$store.state.registerVisible" @ok="handleOk" :footer="null" :width="'450px'">
      <a-form-model ref="ruleForm" :model="ruleForm" :rules="rules" v-bind="layout" id="register-form-content">
        <h1 class="title">{{ $t("common.userRegister") }}</h1>
        <a-form-model-item has-feedback prop="username">
          <a-input v-model="ruleForm.username"
                   autocomplete="off"
                   :maxLength="$store.state.userMaxLength"
                   :suffix="usernameNum + '/' + $store.state.userMaxLength"
                   @change="usernameChange"
                   :placeholder="$t('common.pleaseInputYourUsername')"
                   size="large">
            <a-icon slot="prefix" type="user" style="color: rgba(0,0,0,.25)"/>
          </a-input>
        </a-form-model-item>
        <a-form-model-item has-feedback prop="password">
          <a-input v-model="ruleForm.password" type="password" autocomplete="off" :placeholder="$t('common.password')"
                   size="large">
            <a-icon slot="prefix" type="lock" style="color: rgba(0,0,0,.25)"/>
          </a-input>
        </a-form-model-item>
        <a-form-model-item has-feedback prop="confirmPassword">
          <a-input v-model="ruleForm.confirmPassword" type="password" autocomplete="off"
                   :placeholder="$t('common.confirmPassword')" size="large">
            <a-icon slot="prefix" type="lock" style="color: rgba(0,0,0,.25)"/>
          </a-input>
        </a-form-model-item>
        <a-form-model-item style="padding-top: 5px;">
          <a-button type="primary" html-type="submit" class="login-form-button" size="large"
                    @click="submitForm('ruleForm')">
            {{ $t("common.register") }}
          </a-button>
          Or
          <a @click="login">
            {{ $t("common.loginNow") }}
          </a>
        </a-form-model-item>
      </a-form-model>

    </a-modal>
  </div>
</template>

<script>
import loginService from "@/service/loginService";
import userService from "@/service/userService";
import store from "@/store";
import dayjs from "dayjs";
import {mapMutations} from "vuex";

export default {
  data() {
    // 验证用户名
    let validateUsername = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('common.pleaseInputYourUsername')));
      } else {
        this.isValidUser(value)
            .then(() => {
              callback();
            })
            .catch(err => {
              callback(err.msg);
            });
      }
    };
    // 验证密码
    let validatePassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('common.pleaseInputYourPassword')));
      } else {
        callback();
      }
    };
    // 验证确认密码
    let validateConfirmPassword = (rule, value, callback) => {
      if (value !== this.ruleForm.password) {
        callback(new Error(this.$t('common.passwordNotMatch')));
      } else if (value === '') {
        callback(new Error(this.$t('common.pleaseInputYourPassword')));
      } else {
        callback();
      }
    };

    return {
      usernameNum: 0,
      ruleForm: {
        username: '',
        password: '',
        confirmPassword: '',
      },
      rules: {
        username: [{validator: validateUsername, trigger: 'change'}],
        password: [{validator: validatePassword, trigger: 'change'}],
        confirmPassword: [{validator: validateConfirmPassword, trigger: 'change'}],
      },
      layout: {
        labelCol: {span: 0},
        wrapperCol: {span: 24},
      },
    };
  },

  methods: {
    ...mapMutations(['changeLoginVisible','changeIsLogin','changeUserId',
      'changeUsername','changeToken','changeRegisterVisible','changeExpire',
      'changeEmailResetPasswordVisible']),
    usernameChange(value) {
      this.usernameNum = value.target.value.length;
    },

    // 隐藏登录框
    handleOk() {

    },

    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          loginService.register({username: this.ruleForm.username, password: this.ruleForm.password})
              .then(res => {
                //设置用户相关信息
                this.changeToken(res.data.accessToken);
                this.changeUserId(res.data.userId);
                this.changeUsername(res.data.username);
                //过期分钟数
                let expiresIn = res.data.expiresIn;
                let expireTimeStamp = dayjs().add(expiresIn,'minute').valueOf();
                this.changeExpire(expireTimeStamp);

                //关闭注册弹框
                this.changeRegisterVisible(false);
                this.changeLoginVisible(false);
                // 提示
                this.changeIsLogin(true);
                this.$message.success(this.$t('common.registerSuccess'));
                this.$emit("refresh");
              })
              .catch(err => {
                this.$message.error(err.msg);
              });
        } else {
          return false;
        }
      });
    },

    // 弹出登录框
    login() {
      this.$message.success('请登录',5);
      this.changeRegisterVisible(false);
      this.changeLoginVisible(true);
    },

    // 用户判重
    isValidUser(username) {
      return new Promise((resolve, reject) => {
        userService.verifyUsername({username: username})
            .then(res => {
              if (res.code === 0) {
                resolve(res);
              } else {
                throw res;
              }
            }).catch(err => {
          reject(err);
        });
      });
    },

  },

}
</script>

<style>
#register-form-content .title {
  font-size: 20px;
  font-weight: bold;
  padding-bottom: 15px;
}

#register-form-content .ant-input-affix-wrapper .ant-input {
  font-size: 14px;
}

#register-form-content .login-form-forgot {
  float: right;
}

#register-form-content .login-form-button {
  width: 100%;
}

#register-form-content .ant-form-item {
  margin-bottom: 10px;
}
</style>
