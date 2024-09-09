<template>
  <div class="user">
    <div style="margin-right: 20px">
      <a-dropdown>
        <div class="help">
          <QuestionCircleOutlined style="color: #007bff; margin-right: 5px" />
          <div class="help-text">
            帮助中心
            <DownOutlined style="width: 8px; height: 8px" />
          </div>
        </div>
        <template #overlay>
          <a-menu>
            <a-menu-item> <BoldOutlined /> 版本号：{{ version }} </a-menu-item>

            <a-menu-item @click="guide">
              <DownloadOutlined /> 下载操作指引
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </div>
    <div class="theme-switch">
      <div
        v-if="!darkTheme"
        @click="changeTheme('dark')"
        class="animate__animated animate__bounce"
      >
        <img src="@/assets/imgs/moon.png" alt="" />
      </div>
      <div
        v-else
        @click="changeTheme('default')"
        class="animate__animated animate__bounce"
      >
        <img src="@/assets/imgs/sun.png" alt="" />
      </div>
    </div>
    <a-dropdown>
      <div class="username">
        <!-- <UserOutlined style="color: #007bff" /> -->
        <a-avatar
          :style="{ backgroundColor: '#A6DBFF', verticalAlign: 'middle' }"
        >
          U
        </a-avatar>
      </div>
      <template #overlay>
        <a-menu>
          <a-menu-item>
            <FieldTimeOutlined /> {{ loginStore.getExpireDate }}到期
          </a-menu-item>

          <a-menu-item @click="logout">
            <logout-outlined /> 退出登录
          </a-menu-item>
        </a-menu>
      </template>
    </a-dropdown>
  </div>
</template>

<script setup lang="ts">
  import { useLoginStore } from "@/stores/login";
  import {
    LogoutOutlined,
    DownOutlined,
    FieldTimeOutlined,
    QuestionCircleOutlined,
    DownloadOutlined,
    BoldOutlined,
  } from "@ant-design/icons-vue";
  import { ref } from "vue";
  import { useRouter } from "vue-router";
  import { useAppStore } from "@/stores/app";
  // @ts-ignore
  const version = __Admin_VERSION__ as string;
  const router = useRouter();
  const loginStore = useLoginStore();
  const appstore = useAppStore();
  const logout = () => {
    router.push("/login");
    localStorage.clear();
  };

  const guide = () => {
    console.log("下载操作指引");
  };
  const darkTheme = ref(false);
  const changeTheme = (theme: string) => {
    switch (theme) {
      case "default":
        darkTheme.value = false;
        appstore.theme = "default";
        document.documentElement.className = "theme-default";
        break;
      case "dark":
        darkTheme.value = true;
        appstore.theme = "dark";
        document.documentElement.className = "theme-dark";
        break;
    }
  };
</script>

<style lang="less" scoped>
  .user {
    display: flex;
    align-items: center;
  }
  .help {
    display: flex;
    .help-text {
      font-size: 12px;
      padding: 7px 10px;
      background: #f2f3f9;
      border-radius: 4px;
    }
  }
  .theme-switch div {
    width: 28px;
    text-align: center;
    cursor: pointer;
  }
</style>
