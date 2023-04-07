<template>
  <div>
    <a-modal v-model="$store.state.loginVisible" :footer="null" :width="'450px'">
      <a-form id="login-form-content"
              :form="form"
              class="login-form"
              @submit="handleSubmit"
      >
        <h1 class="title">{{ $t("common.accountPasswordLogin") }}</h1>
        <a-form-item>
          <a-input
              v-decorator="['username',{ rules: [{ required: true, message: $t('common.pleaseInputYourUsername') }] },]"
              :placeholder="$t('common.username')" size="large">
            <a-icon slot="prefix" type="user" style="color: rgba(0,0,0,.25)"/>
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-input
              v-decorator="['password', { rules: [{ required: true, message: $t('common.pleaseInputYourPassword') }] },]"
              type="password" :placeholder="$t('common.password')" size="large">
            <a-icon slot="prefix" type="lock" style="color: rgba(0,0,0,.25)"/>
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-checkbox v-decorator="[ 'remember', { valuePropName: 'checked', initialValue: true, }, ]">
            {{ $t("common.rememberMe") }}
          </a-checkbox>
          <A class="login-form-forgot" @click="mobileResetPassword">
            {{ $t("common.forgotPassword") }}
          </A>
          <a-button type="primary" html-type="submit" class="login-form-button" size="large">
            {{ $t("common.login") }}
          </a-button>
          Or
          <a @click="register">
            {{ $t("common.registerNow") }}
          </a>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
  import loginService from "@/service/loginService";
  import store from "@/store";
  import {mapMutations} from "vuex";
  import dayjs from "dayjs";

  export default {
    beforeCreate() {
      this.form = this.$form.createForm(this, {name: 'normal_login'});

    },

    methods: {
      ...mapMutations(['changeLoginVisible','changeIsLogin','changeUserId',
        'changeUsername','changeIsManage','changeRegisterVisible',
      'changeEmailResetPasswordVisible','changeToken','changeExpire']),

      handleSubmit(e) {
        e.preventDefault();
        this.form.validateFields((err, values) => {
          if (!err) {
            loginService.login(values)
                .then(res => {
                  //设置用户相关信息
                  this.changeToken(res.data.accessToken);
                  this.changeUserId(res.data.userId);
                  this.changeUsername(res.data.username);
                  let isManage = res.data.admin ? res.data.admin : false;

                  this.changeIsManage(isManage);
                  //过期分钟数
                  let expiresIn = res.data.expiresIn;
                  let expireTimeStamp = dayjs().add(expiresIn,'minute').valueOf();
                  this.changeExpire(expireTimeStamp);
                  //设置登录状态
                  this.changeIsLogin(true);
                  //关闭登录弹框
                  this.changeLoginVisible(false);

                  this.$message.success(this.$t('common.loginSuccess'))
                })
                .catch(err => {
                  this.$message.error(err.msg);
                });
          }
        });
      },

      register() {
        this.changeLoginVisible(false);
        this.changeRegisterVisible(true);
      },

      mobileResetPassword() {
        this.changeLoginVisible(false);
        this.changeEmailResetPasswordVisible(true);
      },

    },
  }
</script>

<style>
  #login-form-content .title {
    font-size: 20px;
    font-weight: bold;
    padding-bottom: 15px;
  }

  #login-form-content .ant-input-affix-wrapper .ant-input {
    font-size: 14px;
  }

  #login-form-content .login-form-forgot {
    float: right;
  }

  #login-form-content .login-form-button {
    width: 100%;
  }

  #login-form-content .ant-form-item {
    margin-bottom: 10px;
  }
</style>
