<template>
  
  <div id="layout">
    <div
      class="sider"
      :style="{
        background:
          theme == 'default'
            ? `url(${siderBg}) no-repeat center center/cover`
            : '#1b1e29',
      }"
    >
      <div class="logo">
        <img src="@/assets/imgs/logo.png" alt="" />
      </div>
      <div class="menu">
        <div
          v-for="item in menus"
          :class="['menu-item', { active: currentItem == item.icon }]"
          @click="handleChange(item)"
        >
          <SvgIcon
            class="menu-icon"
            :name="item.icon"
            :color="
              currentItem == item.icon
                ? '#367bf5'
                : theme == 'default'
                ? '#7C859B'
                : '#FCFCFC'
            "
          ></SvgIcon>
          <div class="menu-name">{{ item.name }}</div>
        </div>
      </div>
    </div>
    <div class="container">
      <div class="header" style="-webkit-app-region: drag;">
        <div class="left"></div>
        <div class="right" style="-webkit-app-region: no-drag;">
          <LogOut />
        </div>
      </div>
      <div class="main">
        <AppMain />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { computed, h, reactive, ref } from "vue";
  import siderBg from "@/assets/imgs/siderBg.png";
  import AppMain from "./AppMain.vue";
  import LogOut from "@/components/LogOut.vue";
  import SvgIcon from "@/components/SvgIcon.vue";
  import { useRoute, useRouter } from "vue-router";
  import { useAppStore } from "@/stores/app";
  interface IMenu {
    icon: string;
    name: string;
    path: string;
  }
  const app = useAppStore();
  const menus: IMenu[] = [
    {
      icon: "appstore",
      name: "应用管理",
      path: "/processList",
    },
    {
      icon: "record",
      name: "运行日志",
      path: "/operationRecord",
    },
    {
      icon: "tool",
      name: "工具",
      path: "/task",
    },
    {
      icon: "control",
      name: "设置",
      path: "/setUp",
    },
  ];
  const currentItem = ref("appstore");
  const router = useRouter();
  // const route = useRoute();
  // const collapsed = ref<boolean>(false);
  // const state = reactive({
  //   collapsed: false,
  //   openKeys: ["/processList"],
  // });

  const theme = computed(() => app.theme);
  // const AntdIcons: any = { UnorderedListOutlined, ContainerOutlined };
  // // 筛选要渲染在页面的路由
  // const routesRender = routes[0].children?.filter((item) => !item.meta.hidden);
  // const items = routesRender?.map((item) => {
  //   return {
  //     key: item.path,
  //     icon: () => (item.meta.icon ? h(AntdIcons[item.meta.icon]) : ""),
  //     label: item.meta.title,
  //     title: item.meta.title,
  //   };
  // });
  const handleChange = (item: IMenu) => {
    currentItem.value = item.icon;
    router.push(item.path);
  };
</script>
<style lang="less" scoped>
  #layout {
    width: 100vw;
    height: 100vh;
    display: flex;
    .sider {
      width: 75px;
      height: 100%;
      background: @background-color;
      display: flex;
      flex-direction: column;
      border-right: 1px solid #d9d9d9;
      .logo {
        display: flex;
        align-items: center;
        padding: 10px;
      }
      .logo img {
        width: 100%;
      }
      .menu {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .menu-item {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          margin-bottom: 24px;
          color: @sider-nameColor;
          &.active {
            color: #367bf5;
          }
          .menu-icon {
            width: 24px;
            height: 24px;
            margin-bottom: 8px;
          }
          .menu-name {
            font-size: 12px;
            font-weight: bold;
          }
        }
      }
    }
    .container {
      flex: 1;
      display: flex;
      flex-direction: column;
      .header {
        border-bottom: 1px solid #d9d9d9;
        background: @background-color;
        height: 50px;
        padding: 0 24px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .main {
        flex: 1;
        background: @background-color;
      }
    }
  }
  .logo .title {
    font-size: 18px;
    font-weight: bold;
  }
  .site-layout .site-layout-background {
    background: #fff;
  }
  .layout-content {
    background: @background-color;
    min-height: 280px;
    overflow: auto;
  }
</style>
