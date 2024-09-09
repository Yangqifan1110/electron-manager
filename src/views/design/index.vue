<template>
  <DesignHeader :dataSource="dataSource" />
  <div class="dragFlex">
    <LeftBar />
    <ActionBox :blocks="blocks" />
    <RightBar />
  </div>
</template>

<script setup lang="ts">
  import { ipcRenderer } from "electron";
  import { onMounted, ref } from "vue";
  import DesignHeader from "./components/header/designHeader.vue";
  import LeftBar from "./components/left/leftBar.vue";
  import ActionBox from "./components/action/actionBox.vue";
  import RightBar from "./components/right/rightBar.vue";
  import { useFlowStore } from "@/stores/flow";
  import { registerHotkey } from "./utils/hotkey";
  import { createMain, getFlowJson, openMain } from "./api";
  import { useRoute } from "vue-router";
  import { BlockType, MainData } from "./api/index.d";

  const flowStore = useFlowStore();
  const route = useRoute();
  // const appId = ref("");
  const blocks = ref<BlockType[]>([]);
  const dataSource = ref<MainData>();
  const initCreate = async () => {
    const resCreat = await createMain();
    console.log("resCreat", resCreat);
    flowStore.appId = resCreat.data;
    // appId.value = resCreat.data;
  };
  const init = async (appId: string) => {
    flowStore.appId = appId;
    const resOpen = await openMain(appId);
    console.log("resOpen", resOpen);
    dataSource.value = resOpen.data;
    resOpen.data.flows = resOpen.data.flows.map((item, index) => {
      return {
        ...item,
        closable: index === 0 ? false : true,
      };
    });
    flowStore.setTabList(resOpen.data.flows);
    const resFlowJson = await getFlowJson(
      appId,
      resOpen.data.flows[0].filename
    );
    console.log("resFlowJson", resFlowJson);
    blocks.value = resFlowJson.data.blocks;
  };
  onMounted(async () => {
    const type = route.query.type;
    const id = (route.query.appId as string) ?? "";
    ipcRenderer.send("changWindowSize", { maximize: true });
    if (type === "create") {
      await initCreate();
      await init(flowStore.appId);
    } else {
      console.log("编辑");
      await init(id);
    }
    // 注册快捷键
    registerHotkey();

    // flowStore.setProcessList([
    //   {
    //     id: "1",
    //     name: "process1",
    //   },
    // ]);
  });
</script>

<style lang="less" scoped>
  .dragFlex {
    display: flex;
    height: calc(100vh - 60px);

    user-select: none;
  }
</style>
