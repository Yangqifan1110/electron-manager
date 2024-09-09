<template>
  <a-config-provider :locale="locale"><RouterView /></a-config-provider>
  <a-modal v-model:open="open" title="更新" @ok="handleOk">
    <div v-if="updateType === UPDATE_STATUS.UPDATE_AVAILABLE">
      有新版本，确认更新吗？
    </div>
    <div v-else-if="updateType === UPDATE_STATUS.DOWNLOAD_PROGRESS">
      下载进度:{{ percent }}%
    </div>
    <div v-else-if="updateType === UPDATE_STATUS.UPDATE_DOWNLOADED">
      下载完成，是否安装？
    </div>
  </a-modal>
</template>
<script setup lang="ts">
  import { RouterView } from "vue-router";
  import dayjs from "dayjs";
  import "dayjs/locale/zh-cn";
  import locale from "ant-design-vue/es/locale/zh_CN";
  import { onMounted, ref } from "vue";
  import { UPDATE_STATUS } from "@/utils/index.enum";
  import { ipcRenderer } from "electron";
  dayjs.locale("zh-cn");
  const updateType = ref("");
  const percent = ref('')
  const open = ref<boolean>(false);
  const initUpdate = () => {
    ipcRenderer.send("checkForUpdates");
    ipcRenderer.on("updateMessage", (_e, data) => {
      console.log("updateMessage", data);
      updateType.value = data.type;
      switch (data.type) {
        case UPDATE_STATUS.UPDATE_AVAILABLE:
          console.log("有新版本");
          open.value = true;
          break;
        case UPDATE_STATUS.DOWNLOAD_PROGRESS:
          console.log("下载进度", data);
          percent.value = data.percent;
          open.value = true;
          break;
        case UPDATE_STATUS.UPDATE_DOWNLOADED:
          console.log("下载完成");
          break;
      }
    });
    // ipcRenderer.on("updateAvailable", (_event, arg) => {
    //   console.log("有新版本确认更新", arg);
    // });
    // ipcRenderer.on("downloadProgress", (_event, arg) => {
    //   console.log("下载进度", arg);
    // });
    // ipcRenderer.on("updateDownloaded", (_event, arg) => {
    //   console.log("下载完成", arg);
    // });
  };
  // ipcRenderer.send("comfirmUpdate");
  // ipcRenderer.send("installNow");

  const handleOk = () => {
    switch (updateType.value) {
      case UPDATE_STATUS.UPDATE_AVAILABLE:
        ipcRenderer.send("comfirmUpdate");
        break;
      case UPDATE_STATUS.UPDATE_DOWNLOADED:
        ipcRenderer.send("installNow");
        break;
    }
    open.value = false;
  };
  onMounted(() => {
    // ipcRenderer.send("start");
    // initUpdate();
  });
</script>
<style scoped></style>
