<template>
  <div>
    <a-modal v-model="$store.state.loginVisible" @ok="handleOk" :footer="null" :width="'320px'">
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

  export default {
    beforeCreate() {
      this.form = this.$form.createForm(this, {name: 'normal_login'});

    }, beforeMount() {
      let state = window.localStorage.getItem("state");
      if (state){
        this.$store.replaceState(JSON.parse(state));
      }
    },

    methods: {
      ...mapMutations([]),
      // 隐藏登录框
      handleOk() {
        this.$store.state.loginVisible = false;
      },
      setLoginState() {
        this.$store.state.isLogin = true;
      },
      setUserInfo(userId,username) {
        this.$store.state.userId = userId;
        this.$store.state.username = username;
      },
      //获取token过期的时间以便比较
      getExpireDate(expiresIn){
        let date=new Date();     //1. js获取当前时间
        let min=date.getMinutes();  //2. 获取当前分钟
        date.setMinutes(min+expiresIn);
        return date;
      },

      handleSubmit(e) {
        e.preventDefault();
        this.form.validateFields((err, values) => {
          if (!err) {
            loginService.login(values)
                .then(res => {
                  window.localStorage.setItem("access_token",res.data.accessToken)
                  window.localStorage.setItem("userId",res.data.userId)
                  window.localStorage.setItem("username",res.data.username)
                  //设置登录状态
                  this.setLoginState();
                  this.handleOk();
                  this.setUserInfo(res.data.userId,res.data.username)
                  //将state存入localStorage供刷新页面后恢复状态
                  window.localStorage.setItem("state",JSON.stringify(store.state));
                  // 刷新当前页面
                  this.$router.go(0);
                })
                .catch(err => {
                  this.$message.error(err.msg);
                });
          }
        });
      },

      register() {
        this.$store.state.loginVisible = false;
        this.$store.state.registerVisible = true;
      },

      mobileResetPassword() {
        this.$store.state.loginVisible = false;
        this.$store.state.mobileResetPasswordVisible = true;
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
