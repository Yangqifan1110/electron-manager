<template>
  <AppForm v-model="formState" v-model:type="type">
    <template #formContent>
      <a-form-item label="输出">
        <a-input v-model:value="formState.info.value" />
      </a-form-item>
    </template>
  </AppForm>
</template>

<script setup lang="ts">
  import { reactive, UnwrapRef } from "vue";
  const type = "input";
  interface FormState {
    info: {
      value: string;
    };
  }
  const props = defineProps<{
    dataSource: any;
  }>();
  const formState: UnwrapRef<FormState> = reactive(
    props?.dataSource?.inputs || {
      info: {
        value: "",
      },
    }
  );
</script>

<style lang="less" scoped></style>
