<template>
  <svg :class="svgClass" aria-hidden="true">
    <use :xlink:href="iconName" :fill="color" />
  </svg>
</template>

<script setup lang="ts">
  import { computed } from "vue";

  interface Props {
    name: string;
    class?: string;
    color?: string;
  }
  const props = withDefaults(defineProps<Props>(), {
    name: "",
    class: "",
    color: "#7C859B",
  });
  const iconName = computed(() => `#icon-${props.name}`);
  const svgClass = computed(() => `svg-icon ${props.class}`);
  const color = computed(() => props.color);
</script>

<style lang="less" scoped></style>
