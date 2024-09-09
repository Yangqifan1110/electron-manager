<template>
  <div style="display: flex; justify-content: flex-end; margin-top: 20px">
    <a-pagination
      v-model:current="current"
      :total="props.total"
      @change="handleChange"
    />
  </div>
</template>
<script lang="ts" setup>
  import { ref } from "vue";
  const current = ref(1);
  interface PropsType {
    total: number;
  }
  const props = withDefaults(defineProps<PropsType>(), {
    total: 10,
  });
  const emit = defineEmits(["change"]);
  const handleChange = (page: number, pageSize: number) => {
    emit("change", page, pageSize);
  };
</script>
