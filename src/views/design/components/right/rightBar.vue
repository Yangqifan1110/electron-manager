<template>
  <div class="rightBar">
    <a-button type="primary" @click="save">保存</a-button>
    <NodeForm
      v-if="componentStore.getCurrentComponent?.id"
      :key="componentStore.getCurrentComponent.id"
      :data-source="componentStore.getCurrentComponent"
    />
  </div>
</template>

<script setup lang="ts">
  import { useFlowStore } from "@/stores/flow.ts";
  import NodeForm from "../../nodeBase/nodeForm.tsx";
  // import NodeForm from "../../nodeBasenodeForm.vue";
  import { useComponentStore } from "@/stores/component";
  import { editFlowJson } from "../../api/index.ts";
  import { message } from "ant-design-vue";
  import { useRouter } from "vue-router";
  const router = useRouter();
  const componentStore = useComponentStore();
  const flowStore = useFlowStore();
  const save = async () => {
    // console.log("componentStore", componentStore.getComponentList);
    // console.log("flowStore", flowStore.getActiveKey);
    const data = {
      appId: flowStore.appId,
      flowFileName: flowStore.activeKey,
      blocks: componentStore.getComponentList,
    };
    const res = await editFlowJson(data);
    console.log("res", res);
    message.success(res.msg);
    componentStore.setComponentList([]);
    router.back();
  };
</script>

<style lang="less" scoped>
  .rightBar {
    width: 450px;
    border: 1px solid #DADEE4;
  }
</style>
