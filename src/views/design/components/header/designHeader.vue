<template>
  <div class="designHeaderBox">
    <div class="left">
      <div class="back" @click="router.back()">
        <LeftOutlined />
      </div>
      <img src="@/assets/imgs/file0.png" alt="" />
      <span class="name">{{ name }}</span>
      <div class="edit" @click="edit">
        <AppPopover :content="'编辑'">
          <EditOutlined />
        </AppPopover>
      </div>
    </div>
    <div class="right">
      <div class="cancel" @click="cancelDraft">
        <AppPopover :content="'撤销'">
          <RollbackOutlined />
        </AppPopover>
      </div>
      <div class="play" @click="play">
        <PlayCircleOutlined style="color: green" />
        <span class="text">调试运行</span>
      </div>
      <div class="pause" @click="pause">
        <PauseCircleOutlined style="color: red" />
        <span class="text">暂停</span>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { useRouter } from "vue-router";
  import {
    EditOutlined,
    LeftOutlined,
    RollbackOutlined,
    PlayCircleOutlined,
    PauseCircleOutlined,
  } from "@ant-design/icons-vue";
  import AppPopover from "@/components/AppPopover.vue";
  import { useDraftStore } from "@/stores/draft";
  import { useComponentStore } from "@/stores/component";
  import { useFlowStore } from "@/stores/flow";
  import { MainData } from "../../api/index.d";
  import { ref, watchEffect } from "vue";
  interface Props {
    dataSource?: MainData;
  }
  const draftStore = useDraftStore();
  const componentStore = useComponentStore();
  const flowStore = useFlowStore();
  const router = useRouter();
  const props = defineProps<Props>();
  const name = ref("");
  const cancelDraft = () => {
    draftStore.cancelDraft();
  };
  const play = () => {
    console.log("play");
  };
  const pause = () => {
    console.log("pause");
  };
  const edit = () => {
    console.log("flowStore", flowStore.appId);
  };
  const save = () => {
    console.log("getDraftList", componentStore.getComponentList);
    // const pre = JSON.parse(
    //   '[{"name":"IF 条件","type":"if","desc":"XXXX","id":"47df62cd-6922-485d-8ad1-e468d5c78db8","changeLevel":"up","sortLevel":0,"input":{"name":"1","delivery":false,"type":[],"resource":"","desc":"11"}},{"name":"ENDIF","type":"ENDIF","desc":"ENDIF","id":"b1773cb9-a242-4ccc-ab6e-a1e111e42b02","changeLevel":"down","sortLevel":0}]'
    // );
    // console.log("pre", pre);
    // componentStore.setComponentList(pre);
  };
  watchEffect(() => {
    if (props.dataSource) {
      name.value = props.dataSource.name;
    }
  });
</script>

<style lang="less" scoped>
  .designHeaderBox {
    height: 50px;
    width: 100%;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #DADEE4;
    align-items: center;
    user-select: none;
    background: linear-gradient(
      90deg,
      #f0f5fe 0%,
      #ffffff 22%,
      #ffffff 50%,
      #ffffff 80%,
      #f2feff 100%
    );
    .left {
      display: flex;
      align-items: center;
      .name {
        font-size: 16px;
        font-weight: 600;
      }
      img {
        width: 24px;
        height: 24px;
        margin: 0 10px;
      }
      .back,
      .edit {
        font-size: 16px;
        color: #aaa;
        margin-left: 5px;
        cursor: pointer;
      }
    }
    .right {
      display: flex;
      align-items: center;
      .cancel {
        font-size: 16px;
        color: #aaa;
        margin-left: 200px;
        cursor: pointer;
      }
      .play,
      .pause {
        margin-left: 10px;
        background: #f2f5f8;
        padding: 5px 7px;
        font-size: 12px;
        box-sizing: border-box;
        cursor: pointer;
        .text {
          margin-left: 5px;
        }
      }
    }
  }
</style>
