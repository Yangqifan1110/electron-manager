<template>
  <AppForm v-model="formState" v-model:type="type">
    <template #formContent>
      <a-form-item label="开始">
        <a-input v-model:value="formState.startNum.value" />
      </a-form-item>
      <a-form-item label="结束">
        <a-input v-model:value="formState.endNum.value" />
      </a-form-item>
    </template>
  </AppForm>
</template>

<script setup lang="ts">
  import { reactive, UnwrapRef } from "vue";
  const type = "input";

  interface FormState {
    startNum: {
      value: string;
    };
    endNum: {
      value: string;
    };
  }
  const props = defineProps<{
    dataSource: any;
  }>();
  const formState: UnwrapRef<FormState> = reactive(
    props?.dataSource?.inputs || {
      startNum: {
        value: "",
      },
      endNum: {
        value: "",
      },
    }
  );
</script>

<style lang="less" scoped></style>
