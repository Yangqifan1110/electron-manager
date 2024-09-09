import {
  createWebHashHistory,
  createWebHistory,
  createRouter,
} from "vue-router";

import ProcessList from "@/views/processList/index.vue";
import OperationRecord from "@/views/operationRecord/index.vue";
import LayoutRoot from "@/views/layout/index.vue";
export const routes = [
  {
    path: "/",
    // redirect: "/login",
    redirect: "/processList",
    name: "root",
    component: LayoutRoot,
    children: [
      {
        path: "/processList",
        name: "processList",
        component: ProcessList,
        meta: {
          title: "流程列表",
          icon: "UnorderedListOutlined",
        },
      },
      {
        path: "/setUp",
        name: "setUp",
        component: () => import("@/views/setUp/index.vue"),
        meta: {
          title: "设置页面",
          icon: "UnorderedListOutlined",
        },
      },
      {
        path: "/operationRecord",
        name: "operationRecord",
        component: OperationRecord,
        meta: {
          title: "运行记录",
          icon: "ContainerOutlined",
        },
      },
      {
        path: "/logDetails",
        name: "logDetails",
        component: () => import("@/views/operationRecord/logDetails.vue"),
        meta: {
          title: "日志明细",
          // icon:'ContainerOutlined',
          hidden: true,
        },
      },
    ],
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/login/index.vue"),
    meta: {
      title: "登录",
    },
  },
  {
    path: "/task",
    name: "task",
    component: () => import("@/views/task/index.vue"),
    meta: {
      title: "子任务",
    },
  },
  {
    path: "/design",
    name: "design",
    component: () => import("@/views/design/index.vue"),
    meta: {
      title: "设计",
    },
  },
];
export const router = createRouter({
  history: createWebHashHistory(),
  // history: createWebHistory(),
  routes,
});
router.beforeEach((to, _from, next) => {
  // const isLogin = localStorage.isLogin;
  // const isCheck = localStorage.isCheck;
  // if (!isLogin && to.path !== "/login") {
  //   next("/login");
  // } else {
  //   next();
  // }
  window.document.title = to.meta.title as string;
  next();
});
