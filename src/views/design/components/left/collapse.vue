<template>
  <div>
    <div @click="toggle()">
      <span>{{ isOpen ? "折叠" : "展开" }} -- {{ title }}</span>
    </div>
    <div v-show="isOpen">
      <slot name="content" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const props = defineProps<{
  title: string;
}>();

const isOpen = ref(true);

function toggle() {
  isOpen.value = !isOpen.value;
}
</script>
