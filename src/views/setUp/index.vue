<template>
  <div>
    <a-checkbox v-model:checked="state.autoLaunch">开机自启</a-checkbox>
    <a-radio-group v-model:value="state.hideRadio" @change="updateHideOnClose">
      <a-radio :value="1">退出程序</a-radio>
      <a-radio :value="2">最小化到托盘</a-radio>
    </a-radio-group>
  </div>
</template>

<script setup lang="ts">
  import { ipcRenderer } from "electron";
  import { onMounted, reactive, watch } from "vue";

  interface State {
    autoLaunch: boolean;
    hideRadio: number;
    hideOnClose: boolean;
  }
  const config = localStorage.config ? JSON.parse(localStorage.config) : {};
  const state = reactive<State>({
    autoLaunch: config.autoLaunch ?? false,
    hideRadio: config.hideOnClose ? 2 : 1,
    hideOnClose: config.hideOnClose ?? false,
  });

  const updateConfig = () => {
    const config = {
      autoLaunch: state.autoLaunch,
      hideOnClose: state.hideOnClose,
    };
    localStorage.config = JSON.stringify(config);
    ipcRenderer.send("updateConfig", config);
  };
  const updateHideOnClose = () => {
    state.hideOnClose = state.hideRadio === 2;
  };

  watch(state, updateConfig);
</script>
<script lang="ts">
  export default {
    name: "setUp",
  };
</script>
