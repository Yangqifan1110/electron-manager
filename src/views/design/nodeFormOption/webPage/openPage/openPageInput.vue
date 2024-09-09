<template>
  <AppForm v-model="formState" v-model:type="type">
    <template #formContent>
      <a-form-item label="网址">
        <a-input v-model:value="formState.value.value" />
      </a-form-item>
    </template>
  </AppForm>
</template>

<script setup lang="ts">
  import { reactive, UnwrapRef } from "vue";
  const type = "input";
  interface FormState {
    value: {
      value: string;
    };
  }
  const props = defineProps<{
    dataSource: any;
  }>();
  const formState: UnwrapRef<FormState> = reactive(
    props?.dataSource?.inputs || {
      value: {
        value: "",
      },
    }
  );
</script>

<style lang="less" scoped></style>
