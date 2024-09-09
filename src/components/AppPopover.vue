<template>
  <a-popover>
    <template #content>
      {{ props.content }}
    </template>
    <slot></slot>
  </a-popover>
</template>
<script setup lang="ts">
  const props = defineProps({
    content: {
      type: String,
      default: "",
    },
  });
</script>
<style lang="less" scoped></style>
