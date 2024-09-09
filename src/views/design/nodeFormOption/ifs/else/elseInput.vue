<template>
  <AppForm v-model="formState" v-model:type="type">
    <template #formContent>
      <a-form-item label="Activity nameAAAA">
        <a-input v-model:value="formState.nameAAAA" />
      </a-form-item>
    </template>
  </AppForm>
</template>
<script lang="ts" setup>
  import { reactive } from "vue";
  import type { UnwrapRef } from "vue";
  const type = "input";
  const props = defineProps<{
    dataSource: any;
  }>();
  interface FormState {
    nameAAAA: string;
  }
  const formState: UnwrapRef<FormState> = reactive(
    props?.dataSource?.inputs || {
      nameAAAA: "",
    }
  );
</script>
