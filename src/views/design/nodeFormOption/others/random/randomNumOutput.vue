<template>
  <AppForm v-model="formState" v-model:type="type">
    <template #formContent>
      <a-form-item label="Activity name">
        <a-input v-model:value="formState.value" />
      </a-form-item>
    </template>
  </AppForm>
</template>
<script lang="ts" setup>
  import { reactive } from "vue";
  import type { UnwrapRef } from "vue";
  const type = "output";
  const props = defineProps<{
    dataSource: any;
  }>();

  interface FormState {
    value: string;
  }
  const formState: UnwrapRef<FormState> = reactive(
    props?.dataSource?.outputs || {
      value: "",
    }
  );
</script>
