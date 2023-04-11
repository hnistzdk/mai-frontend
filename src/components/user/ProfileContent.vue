<template>
  <div id="profile-content" v-if="!spinning">
    <a-col :span="$store.state.collapsed ? 24 :18" style="background: #fff;">
      <div class="left">
        <a-form-model ref="ruleForm" :model="ruleForm" :rules="rules" v-bind="layout" labelAlign="left">
          <p>{{ $t('common.personalInformation') }}</p>
          <a-divider/>

          <!-- 昵称 -->
          <a-form-item has-feedback :label="$t('common.nickname')" prop="nickname">
            <a-input v-model="ruleForm.nickname"
                     @change="commonChange"
                     :maxLength="10"
                     :suffix="ruleForm.nicknameNum + '/10'"
                     autocomplete="off"
                     class="nickname"
                     :placeholder="$t('common.fillInYourNickname')"/>
          </a-form-item>

          <!-- 性别 -->
          <a-form-item has-feedback :label="$t('common.sex')" prop="sex">
            <a-select v-model="ruleForm.sex"
                      @change="commonChange"
                      :placeholder="$t('common.fillInYourSex')"
                      :options="sexOptions"
                      defaultValue="0"
                      class="sex">
            </a-select>
          </a-form-item>


          <!-- 个人介绍 -->
          <a-form-model-item has-feedback prop="selfIntroduction" :label="$t('common.selfIntro')">
            <a-textarea v-model="ruleForm.selfIntroduction"
                        :suffix="ruleForm.introNum + '/150'"
                        @change="commonChange"
                        :maxLength="150"
                        :placeholder="$t('common.fillInYour7788')"
                        :auto-size="{ minRows: 4, maxRows: 8 }"
                        class="selfIntroduction"/>
          </a-form-model-item>

          <!-- 职位 -->
          <a-form-model-item has-feedback prop="position" :label="$t('common.position')">
            <a-input v-model="ruleForm.position"
                     :suffix="ruleForm.positionNum + '/20'"
                     @change="commonChange"
                     :maxLength="20"
                     :placeholder="$t('common.fillInYourPosition')"/>
<!--            <a-select v-model="ruleForm.position"-->
<!--                      @change="commonChange"-->
<!--                      :placeholder="$t('common.fillInYourPosition')"-->
<!--                      :options="positionOptions"-->
<!--                      class="graduationYear">-->
<!--            </a-select>-->
          </a-form-model-item>
          <!-- 公司 -->
          <a-form-model-item has-feedback prop="company" :label="$t('common.company')">
            <a-input v-model="ruleForm.company"
                     :suffix="ruleForm.companyNum + '/20'"
                     @change="commonChange"
                     :maxLength="20"
                     :placeholder="$t('common.fillInYourCompany')"/>
          </a-form-model-item>

          <!-- 毕业年份 -->
          <a-form-item has-feedback prop="graduationYear" :label="$t('common.graduationYear')">
            <a-select v-model="ruleForm.graduationYear"
                      @change="commonChange"
                      :placeholder="$t('common.fillInYourGraduationYear')"
                      :options="graduationYearOptions"
                      class="graduationYear">
              </a-select>
          </a-form-item>

          <!-- 学历 -->
          <a-form-item has-feedback prop="educationalBackground" :label="$t('common.educationalBackground')">
            <a-select v-model="ruleForm.educationalBackground"
                      @change="commonChange"
                      :placeholder="$t('common.fillInYourEducationalBackground')"
                      :options="educationalBackgroundOptions"
                      class="educationalBackground">
            </a-select>
          </a-form-item>

          <!-- 毕业院校 -->
          <a-form-item has-feedback prop="graduatedFrom" :label="$t('common.graduatedFrom')">
            <a-input v-model="ruleForm.graduatedFrom"
                     @change="commonChange"
                     autocomplete="off"
                     class="graduatedFrom"
                     :suffix="ruleForm.graduatedFromNum + '/20'"
                     :maxLength="20"
                     :placeholder="$t('common.fillInYourGraduatedFrom')"/>
          </a-form-item>


          <!-- 专业 -->
          <a-form-item has-feedback prop="specializedSubject" :label="$t('common.specializedSubject')">
            <a-input v-model="ruleForm.specializedSubject"
                      @change="commonChange"
                      :placeholder="$t('common.fillInYourSpecializedSubject')"
                     :suffix="ruleForm.specializedSubjectNum + '/20'"
                     :maxLength="20"
                     class="specializedSubject">
            </a-input>
          </a-form-item>



          <!-- 按钮 -->
          <a-form-model-item>
            <a-divider style="margin: 10px 0;"></a-divider>
            <a-form-item class="form-item-submit">
              <a-button type="primary" html-type="submit" @click="submitForm('ruleForm')">
                {{ $t('common.saveChanges') }}
              </a-button>
            </a-form-item>
          </a-form-model-item>
        </a-form-model>
      </div>
    </a-col>
    <a-col :span="$store.state.collapsed ? 24 :6" style="background: #fff;">
      <div class="right">
        <a-col class="avatar-col">
          <div class="avatar">
            <div @click="openUploadModal" class="avatar-container">
              <a-avatar
                  style="cursor: pointer" :size="120" icon="user"
                  :src="$store.state.avatar ? $store.state.avatar : require('@/assets/img/default_avatar.png')"/>
              <div class="avatar-wrapper">
                <a-icon style="font-size: 38px" type="plus-circle"/>
                <span style="line-height: 40px">{{
                    $t("common.clickToChangeAvatar")
                  }}</span>
              </div>
            </div>
          </div>
          <div class="avatar-tip">
            <div>{{ $t("common.avatarTip")[0] }}</div>
            <div>{{ $t("common.avatarTip")[1] }}</div>
          </div>
        </a-col>
        <UploadModal
            :visible="visible"
            @closeModal="closeModal"
            @refresh="refresh"/>
      </div>
    </a-col>
  </div>
</template>

<script>
  import UploadModal from "@/components/user/UploadModal";
  import userService from "@/service/userService";

  export default {
    name: "ProfileContent",

    components: {UploadModal},

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

      // 验证昵称
      let validateNickName = (rule, value, callback) => {
        if (value === '') {
          callback(new Error("昵称不能为空"));
        } else if (value.length > 10) {
          callback(new Error("昵称长度在10个字符以内"));
        }else {
          callback();
        }
      };

      return {
        urlReg: /^(?=^.{3,255}$)(http(s)?:\/\/)?(www\.)?[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+(:\d+)*(\/\w+\.\w+)*$/,
        // 加载中...
        spinning: true,
        visible: false,
        sexOptions:[
          {value:"0",label:"男"},
          {value:"1",label:"女"}
        ],
        educationalBackgroundOptions:[
          {value:"博士后",label:"博士后"},
          {value:"博士",label:"博士"},
          {value:"硕士",label:"硕士"},
          {value:"本科",label:"本科"},
          {value:"专科",label:"专科"},
          {value:"高中",label:"高中"},
          {value:"初中",label:"初中"},
          {value:"小学",label:"小学"},
        ],
        positionOptions:[
          {value:"Java工程师",label:"Java工程师"},
          {value:"C++工程师",label:"C++工程师"},
          {value:"iOS工程师",label:"iOS工程师"},
          {value:"安卓工程师",label:"安卓工程师"},
          {value:"运维工程师",label:"运维工程师"},
          {value:"前端工程师",label:"前端工程师"},
          {value:"算法工程师",label:"算法工程师"},
          {value:"PHP工程师",label:"PHP工程师"},
          {value:"测试工程师",label:"测试工程师"},
          {value:"安全工程师",label:"安全工程师"},
          {value:"C#工程师",label:"C#工程师"},
          {value:"数据库工程师",label:"数据库工程师"},
          {value:"数据分析师",label:"数据分析师"},
          {value:"产品",label:"产品"},
          {value:"运营",label:"运营"},
          {value:"其他",label:"其他"},
        ],

        graduationYearOptions: this.getGraduationYearsOptions(),
        ruleForm: {
          userId: this.$store.state.userId,
          username: '',
          usernameNum: 0,
          // 职业
          position: '',
          positionNum: 0,
          // 公司
          company: '',
          companyNum: 0,
          //昵称
          nickname: '',
          nicknameNum: 0,
          //性别
          sex: 0,
          // 个人主页
          homePage: '',
          homePageNum: 0,
          // 个人介绍
          selfIntroduction: '',
          introNum: 0,
          // 组织架构id
          orgId: Number,


          //毕业年份
          graduationYear: new Date().getFullYear().valueOf(),
          //学历  小学~博士
          educationalBackground: '',
          //毕业院校
          graduatedFrom:'',
          graduatedFromNum: 0,
          //专业
          specializedSubject:'',
          specializedSubjectNum: 0,

        },
        rules: {
          username: [{validator: validateUsername, trigger: 'change'}],
          nickname: [{validator: validateNickName, trigger: 'change'}],
        },
        layout: {
          labelCol: {span: this.$store.state.collapsed ? 24 : 3},
          wrapperCol: {span: this.$store.state.collapsed ? 24 : 21},
        },
      }
    },

    methods: {
      getGraduationYearsOptions(){
          let nowYear = new Date().getFullYear().valueOf();
          let options = [];
          for (let i = nowYear+4 ; i >= 1981; i--) {
              options.push({value:i,label:i});
          }
          return options;
      },
      // 获取用户信息
      getUserInfo() {
        userService.getUserInfo({userId: this.ruleForm.userId})
            .then(res => {
              this.spinning = false;

              //用户名
              this.ruleForm.username = res.data.username;
              this.ruleForm.usernameNum = res.data.username.length;

              //昵称
              this.ruleForm.nickname = res.data.nickname ? res.data.nickname : '';
              this.ruleForm.nicknameNum = res.data.nickname ? res.data.nickname.length : 0;

              //性别
              this.ruleForm.sex = res.data.sex ? res.data.sex : 0;

              //职位
              this.ruleForm.position = res.data.position ? res.data.position : '';
              this.ruleForm.positionNum = res.data.position ? res.data.position.length : 0;

              //公司
              this.ruleForm.company = res.data.company ? res.data.company : '';
              this.ruleForm.companyNum = res.data.company ? res.data.company.length : 0;

              //简介
              this.ruleForm.selfIntroduction = res.data.selfIntroduction;
              this.ruleForm.introNum = res.data.selfIntroduction ? res.data.selfIntroduction.length : 0;

              //学历
              this.ruleForm.educationalBackground = res.data.educationalBackground;

              //毕业院校
              this.ruleForm.graduatedFrom = res.data.graduatedFrom;
              this.ruleForm.graduatedFromNum = res.data.graduatedFrom ? res.data.graduatedFrom.length : 0;

              //专业
              this.ruleForm.specializedSubject = res.data.specializedSubject;
              this.ruleForm.specializedSubjectNum = res.data.specializedSubject ? res.data.specializedSubject.length : 0;

            })
            .catch(err => {
              this.$message.error(err.msg);
            });
      },

      // 更新用户基本信息
      updateUserBasicInfo(data) {
        userService.updateUserBasicInfo(data)
            .then(res => {
              this.$message.success(this.$t('common.saveSuccessed'));
              this.getUserInfo();
            })
            .catch(err => {
              this.$message.error(err.msg);
            });
      },

      submitForm(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            const data = {
              userId: this.ruleForm.userId,
              // username: this.ruleForm.username,
              nickname: this.ruleForm.nickname,
              sex: this.ruleForm.sex,
              position: this.ruleForm.position,
              company: this.ruleForm.company,
              selfIntroduction: this.ruleForm.selfIntroduction,
              graduationYear: this.ruleForm.graduationYear,
              educationalBackground: this.ruleForm.educationalBackground,
              graduatedFrom: this.ruleForm.graduatedFrom,
              specializedSubject: this.ruleForm.specializedSubject,
            };
            this.updateUserBasicInfo(data);
          } else {
            return false;
          }
        });
      },

      usernameChange(value) {
        this.ruleForm.usernameNum = value.target.value.length;
      },
      commonChange() {
        this.ruleForm.positionNum = this.ruleForm.position ? this.ruleForm.position.length : 0;
        this.ruleForm.companyNum = this.ruleForm.company ? this.ruleForm.company.length : 0;
        this.ruleForm.introNum = this.ruleForm.selfIntroduction ? this.ruleForm.selfIntroduction.length : 0;
        this.ruleForm.nicknameNum = this.ruleForm.nickname ? this.ruleForm.nickname.length : 0;
        this.ruleForm.graduatedFromNum = this.ruleForm.graduatedFrom ? this.ruleForm.graduatedFrom.length : 0;
        this.ruleForm.specializedSubjectNum = this.ruleForm.specializedSubject ? this.ruleForm.specializedSubject.length : 0;
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
              })
              .catch(err => {
                reject(err);
              });
        });
      },

      refresh() {
        this.getUserInfo();
      },

      // 打开上传头像窗口
      openUploadModal() {
        this.visible = true;
      },

      // 关毕上传头像窗口
      closeModal() {
        this.visible = false;
      },

      // 路由到首页页面
      routerFrontPage() {
        this.$router.push("/");
      },
    },

    mounted() {
      if (this.ruleForm.userId) {
        this.getUserInfo();
      } else {
        this.routerFrontPage();
      }
    }

  }
</script>

<style lang="less">
  #profile-content {
    background: #fff;

    .left {
      padding: 30px;

      p {
        font-weight: 600;
        font-size: 20px;
        line-height: 18px;
        color: #333;
      }
    }
  }

  #profile-content .avatar-col {
    .avatar {
      margin-top: 60px;
      height: 120px;
      display: flex;
      justify-content: center;
      align-items: center;

      .avatar-container {
        cursor: pointer;
        position: relative;
        height: 120px;
        width: 120px;
        text-align: center;

        .avatar-wrapper {
          display: none;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          color: white;
          position: absolute;
          top: 0;
          border-radius: 50%;
          width: 120px;
          height: 120px;
          background-color: rgba(29, 33, 41, 0.5);
        }
      }

      .avatar-container:hover {
        .avatar-wrapper {
          display: flex;
        }
      }
    }

    .avatar-tip {
      text-align: center;
      padding: 24px 0;
      color: #86909c;
    }
  }

  #profile-content .ant-input {
    padding-right: 50px;
  }
  #profile-content .homePage .ant-input {
    padding-right: 70px;
  }
  #profile-content textarea.intro.ant-input {
    padding-right: 0!important;
  }
</style>
