<template>
  <div class="login-container">
    <transition name="bounce">
      <!-- 页头 -->
      <el-row type="flex" v-show="isShow" justify="center">
        <el-col :span="8" style="text-align: center">
          <div class="container_header">
            <img src="@/assets/login_images/gxtitle.png" alt="" />
          </div>
        </el-col>
      </el-row>
    </transition>

    <transition name="bounce">
      <!-- 中间内容 -->
      <el-row type="flex" v-show="isShow" justify="center">
        <el-col :xs="18" :sm="18" :md="14" :lg="12" :xl="12">
          <div class="sign_container">
            <el-col :span="13" class="hidden-xs-only">
              <img
                src="@/assets/login_images/5698781c1e6df55c0abfe2065414083.jpg"
                class="container_image"
                alt=""
              />
            </el-col>
            <el-col :span="11" :xs="24">
              <div class="container_content">
                <div class="container_content_title">排队叫号后台管理</div>
                <div class="container_form">
                  <el-form
                    ref="loginForm"
                    :model="loginForm"
                    :rules="loginRules"
                    class="login-form"
                    auto-complete="on"
                    label-position="left"
                  >
                    <el-form-item prop="UserNo">
                      <el-input
                        ref="UserNo"
                        v-model="loginForm.UserNo"
                        placeholder="请输入账号"
                        name="UserNo"
                        type="text"
                        tabindex="1"
                        clearable
                      >
                        <i
                          slot="prefix"
                          class="el-input__icon el-icon-user input_icon"
                        ></i>
                      </el-input>
                    </el-form-item>

                    <el-form-item prop="Password">
                      <el-input
                        :key="PasswordType"
                        ref="Password"
                        :type="PasswordType"
                        v-model="loginForm.Password"
                        placeholder="请输入密码"
                        name="Password"
                        tabindex="2"
                        show-password
                        @keyup.enter.native="handleLogin()"
                      >
                        <i
                          slot="prefix"
                          class="el-input__icon el-icon-lock input_icon"
                        ></i>
                      </el-input>
                    </el-form-item>

                    <el-button
                      :loading="loading"
                      type="primary"
                      style="width: 100%; margin-bottom: 30px"
                      @click.native.prevent="handleLogin"
                      >登录</el-button
                    >
                  </el-form>
                </div>
              </div>
            </el-col>
          </div>
        </el-col>
      </el-row>
    </transition>

    <!-- 页脚 -->
    <el-row type="flex" justify="center">
      <el-col :span="12" style="text-align: center">
        <div class="footer_info">南昌国讯信息技术股份有限公司</div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "Logins",
  data() {
    const validateUserNo = (rule, value, callback) => {
      if (value.length <= 0) {
        callback(new Error("请输入用户名"));
      } else {
        callback();
      }
    };
    const validatePassword = (rule, value, callback) => {
      if (value.length <= 0) {
        callback(new Error("请输入密码"));
      } else {
        callback();
      }
    };
    return {
      loading: false,
      isShow: false,
      PasswordType: "Password",
      loginForm: {
        UserNo: "",
        Password: "",
      },
      loginRules: {
        UserNo: [
          { required: true, trigger: "blur", validator: validateUserNo },
        ],
        Password: [
          // { required: true, trigger: "blur", validator: validatePassword },
        ],
      },
    };
  },
  methods: {
    showPwd() {
      if (this.PasswordType === "Password") {
        this.PasswordType = "";
      } else {
        this.PasswordType = "Password";
      }
      this.$nextTick(() => {
        this.$refs.Password.focus();
      });
    },
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          this.$store
            .dispatch("user/login", this.loginForm)
            .then(() => {
              console.log(this.loginForm);
              //本地存储UserNo，目前未加密
              localStorage.setItem("UserNo", this.loginForm.UserNo);

              this.$router.push({ name: "Dashboard" });
              this.$message({
                message: "登陆成功，进入系统！",
                type: "success",
              });
              // this.$router.push({ path: this.redirect || '/' })
              this.loading = false;
            })
            .catch((error) => {
              this.loading = false;
              console.log(error);
              this.$message.error("登录失败,服务器错误!");
            });
        } else {
          return false;
        }
      });
    },
  },
  mounted() {
    this.isShow = true;
  },
};
</script>

<style  lang="scss" scoped>
$bg: #f7fbff;
.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;
}
//头部
.container_header {
  padding: 35px 0px;
  img {
    width: 150px;
    height: 32px;
  }
}
//中间内容区域
.sign_container {
  height: 450px;
}
.container_image {
  height: 400px;
  width: 100%;
}
.container_content {
  background-color: #ffffff;
  height: 400px;
  width: 100%;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
  box-shadow: 7px 0px 7px #daebf9;
}

.container_content_title {
  color: #267bf0;
  font-size: 18px;
  font-weight: bold;
  // background-color: black;
  text-align: center;
  padding: 50px 0px;
}
.input_icon {
  color: #267bf0;
  font-size: 17.5px;
}
.container_form {
  padding: 10px 30px;
}

//页脚
.footer_info {
  color: #71706f;
  font-size: 14px;
}

.bounce-enter-active {
  animation: bounceInDown 1s;
}
.bounce-leave-active {
  animation: bounceInDown 1s;
}

.strong-enter-active {
  animation: swing 1.5s;
}
.strong-leave-active {
  animation: swing 1.5s;
}
</style>