<template>
  <div>
    <button @click="start">打开QQ</button>
  </div>
</template>

<script setup lang="ts">
  import { ipcRenderer } from "electron";
  const start = () => {
    ipcRenderer.send("start");
    // window.electron.ipcRenderer.send('start');
  };
</script>

<style scoped></style>
