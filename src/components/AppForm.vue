<template>
  <a-form
    ref="formRef"
    layout="vertical"
    name="custom-validation"
    v-bind="layout"
  >
    <slot name="formContent"></slot>
  </a-form>
</template>

<script setup lang="ts">
  import { useComponentStore } from "@/stores/component";
  import { toRaw, watch } from "vue";

  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 14 },
  };
  const formState = defineModel();
  const type = defineModel("type");
  const componentStore = useComponentStore();
  watch(
    () => [formState.value, type.value],
    () => {
      if (type.value === "input") {
        componentStore.setInputsData(toRaw(formState));
      } else {
        componentStore.setOutputsData(toRaw(formState));
      }
    },
    { immediate: true, deep: true }
  );
</script>

<style lang="less" scoped></style>
