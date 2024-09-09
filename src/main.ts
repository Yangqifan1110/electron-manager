import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import { router } from "./router";
import Antd from "ant-design-vue";
import "ant-design-vue/dist/reset.css";
import { createPinia } from "pinia";
import "@/assets/style/variables.less";
import "animate.css/animate.min.css";
import Menus from "vue3-menus";
import "virtual:svg-icons-register";
import SvgIcon from "@/components/SvgIcon.vue";

const pinia = createPinia();
// document.addEventListener("DOMContentLoaded", async () => {
document.documentElement.className = "theme-default";
const app = createApp(App);
app.use(pinia);
app.use(router);
app.use(Antd);
// @ts-ignore
app.use(Menus);
app.component("svg-icon", SvgIcon);
app.mount("#app");
// });
