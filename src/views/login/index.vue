<template>
  <div class="login">
    <div class="box">
      <div class="left">
        <div class="logo">
          <img src="@/assets/imgs/logo.png" alt="" />
        </div>
        <div class="bg">
          <img src="@/assets/imgs/login.png" alt="" />
        </div>
        <!-- <div class="title">欢迎使用BestCreator</div> -->
      </div>
      <div class="right">
        <div class="text">登陆</div>
        <div class="tabs">
          <div
            :class="['right-title', activeKey == '1' ? 'active' : '']"
            @click="tabChange('1')"
          >
            账号登录
          </div>

          <div
            :class="['right-title', activeKey == '2' ? 'active' : '']"
            @click="tabChange('2')"
          >
            激活码登录
          </div>
        </div>
        <div v-if="activeKey == '1'">
          <a-form :model="formState" name="basic" autocomplete="off">
            <a-form-item name="username">
              <a-input
                v-model:value="formState.username"
                size="large"
                placeholder="请输入登录账号"
              >
                <template #prefix>
                  <UserOutlined class="site-form-item-icon" />
                </template>
              </a-input>
            </a-form-item>

            <a-form-item name="password">
              <a-input-password
                v-model:value="formState.password"
                size="large"
                placeholder="请输入账号密码"
              >
                <template #prefix>
                  <LockOutlined class="site-form-item-icon" />
                </template>
              </a-input-password>
            </a-form-item>
            <a-form-item
              name="remember"
              style="width: 100%; display: flex; justify-content: space-between"
            >
              <a-checkbox v-model:checked="formState.rememberPwd"
                >记住密码</a-checkbox
              >
              <a class="login-form-forgot">忘记密码</a>
            </a-form-item>
          </a-form>
        </div>
        <div v-if="activeKey == '2'">
          <a-form :model="state" name="basic" autocomplete="off">
            <a-form-item name="machineCode">
              <a-input
                v-model:value="state.machineCode"
                size="large"
                disabled
                placeholder="机器码自动获取"
              >
                <template #prefix
                  ><WindowsOutlined class="site-form-item-icon"
                /></template>
              </a-input>
            </a-form-item>

            <a-form-item name="encrypted_code">
              <a-input
                v-model:value="state.encrypted_code"
                size="large"
                placeholder="请输入激活码"
              >
                <template #prefix>
                  <UserOutlined class="site-form-item-icon" />
                </template>
              </a-input>
            </a-form-item>
            <a-form-item name="tip">
              <div class="tip">
                <img src="@/assets/imgs/tip.png" alt="" />
                离线激活：一个激活码仅能在一台设备上使用
              </div>
            </a-form-item>
            <a-form-item
              name="remember"
              style="width: 100%; display: flex; justify-content: space-between"
            >
              <a-checkbox v-model:checked="formState.rememberPwd"
                >记住激活码</a-checkbox
              >
            </a-form-item>
          </a-form>
        </div>

        <div class="submit">
          <a-button type="primary" class="login-form-button" @click="submit">
            登录
          </a-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, reactive, ref } from "vue";
  import { getMachineCode, login } from "./index.api";
  import { useRouter } from "vue-router";
  import {
    UserOutlined,
    LockOutlined,
    WindowsOutlined,
  } from "@ant-design/icons-vue";
  import { useLoginStore } from "@/stores/login";
  import { ipcRenderer } from "electron";
  const router = useRouter();
  const loginStore = useLoginStore();
  const activeKey = ref("2");
  interface FormState {
    username: string;
    password: string;
    rememberPwd: boolean;
  }

  const formState = reactive<FormState>({
    username: "",
    password: "",
    rememberPwd: false,
  });
  const state = reactive({
    machineCode: "",
    encrypted_code:
      "vi05YtgR0nNNl8AO7vQSdVn9aeNJHb8YqV+AQQTGhyoHsirbNd6LfmVjaAQsFoh5GW4Hihw80+oS8Zu5xQ==",
    // encrypted_code: "",
    checked: false,
  });
  const tabChange = (e: string) => {
    activeKey.value = e;
  };
  const submit = async () => {
    const res = await login({ encrypted_code: state.encrypted_code });
    if (res.success) {
      loginStore.setExpireDate(res.data);
      loginStore.setLoginInfo({ isLogin: true, isCheck: state.checked });

      router.push("/processList");
    }
    // router.push("/");
  };
  const init = async () => {
    console.log("init");
    const res = await getMachineCode();
    state.machineCode = res.data;
    localStorage.machineCode = res.data;
  };
  ipcRenderer.on("reply", (_event, { success, message }) => {
    console.log("reply", success, message);
    if (success) {
      setTimeout(() => {
        init();
      }, 5000);
    }
  });
  onMounted(() => {
    init();
    ipcRenderer.send("changWindowSize", { width: 800, height: 500 });
  });
</script>

<style lang="less" scoped>
  .login {
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .login-title {
    font-size: 16px;
    color: #3b0e7b;
    margin: 30px 0;
  }
  .box {
    width: 100%;
    height: 100%;
    display: flex;
    padding: 20px 44px 20px 33px;
  }
  .left {
    width: 50%;
  }
  .logo img {
    // width: 20%;
    width: 70px;
    margin-bottom: 20px;
  }
  .title {
    color: #333;
    font-weight: bold;
    font-size: 18px;
    text-align: center;
  }
  .bg {
    width: 90%;
    height: 90%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: url("@/assets/imgs/loginBg.png") no-repeat center center / cover;
  }
  .bg img {
    // width: 350px;
    // width: 100%;
    // height: 100%;
  }
  .right {
    width: 50%;
    .ant-form-item {
      margin-bottom: 16px;
    }
    .login-form-forgot {
      float: right;
    }
    .login-form-button {
      width: 100%;
    }
    .text {
      font-size: 22px;
      font-weight: bold;
      margin: 60px 0 26px 0;
    }
    .tabs {
      display: flex;
      margin: 20px 0;
      padding-bottom: 10px;
      border-bottom: 1px solid #DADEE4;
      cursor: pointer;
      .right-title {
        width: 50%;
        color: #7c859b;
        font-size: 14px;
        font-weight: bold;
        text-align: center;
        position: relative;
      }
      & .active {
        color: #367bf5;
      }
      .right-title.active::after {
        content: "";
        position: absolute;
        bottom: -10px;
        left: 50%;
        transform: translateX(-50%);
        width: 100%;
        height: 3px;
        background-color: #007bff;
      }
    }
  }

  .tip {
    display: flex;
    align-items: center;
    font-size: 13px;
    color: #0f40f5;
    padding: 10px;
    background: #d4e3fc;
    border-radius: 5px;
  }
  .tip img {
    margin-right: 5px;
  }
  .check {
    margin: 20px 0;
  }
  .submit {
    display: flex;
    justify-content: center;
  }
  .btn {
    width: 150px;
    font-size: 14px;
    color: #fff;
    background: #0f40f5;
    text-align: center;
    padding: 10px 20px;
    border-radius: 30px;
  }
</style>
