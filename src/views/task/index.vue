<template>
  <div class="task" style="-webkit-app-region: drag">
    <div class="header">
      <div class="title">
        <img src="@/assets/imgs/file0.png" alt="" /> 新建文件
      </div>
      <div class="control">
        <!-- <div
          style="-webkit-app-region: no-drag"
          type="primary"
          @click="closeTask"
        >
          <MinusOutlined />
        </div> -->
        <div
          style="-webkit-app-region: no-drag; margin-left: 15px"
          type="primary"
          @click="closeTask"
        >
          <CloseOutlined />
        </div>
      </div>
    </div>
    <div class="mid">
      <CheckCircleOutlined
        style="color: #87d068; font-size: 16px; margin-right: 5px"
      />
      <span>运行成功</span>
    </div>
    <div class="fot">
      <div class="time"><FieldTimeOutlined /> <span>00:00:00</span></div>
      <div class="option">
        <span><FileTextOutlined /></span> <span><ProfileOutlined /></span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ipcRenderer } from "electron";
  import {
    MinusOutlined,
    CloseOutlined,
    CheckCircleOutlined,
    FieldTimeOutlined,
    FileTextOutlined,
    ProfileOutlined,
  } from "@ant-design/icons-vue";
  const closeTask = () => {
    ipcRenderer.send("closeTask");
  };
</script>

<style lang="less" scoped>
  .task {
    border-radius: 5px;
    width: 364px;
    height: 140px;
    background: #fff;
    padding: 15px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .title {
        font-size: 15px;
        color: #202632;
        font-weight: bold;
        letter-spacing: 1px;
      }
      .control {
        display: flex;
      }
    }
    .mid {
      font-size: 12px;
      color: #57606f;
      display: flex;
      align-items: center;
    }
    .fot {
      display: flex;
      justify-content: space-between;
      .time {
        color: #a2a8b9;
        font-size: 12px;
      }
      .option {
        span {
          -webkit-app-region: no-drag;
          color: #475164;
          font-size: 16px;
          margin-left: 5px;
        }
      }
    }
  }
</style>
