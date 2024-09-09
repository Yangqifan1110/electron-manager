<template>
  <div class="leftBar">
    <div class="leftTitleBox">
      <div class="titleText">主流程</div>
      <div>
        <img class="titleIcon" src="@/assets/icons/add-circle@2x.png" alt="" />
      </div>
    </div>

    <div class="flowsBox">
      <div
        v-for="item in flowStore.getFlowList"
        :key="item.filename"
        @click="flowListClick(item)"
      >
        <div class="flowItem">
          <img class="flowIcon" src="@/assets/icons/layers@2x.png" alt="" />
          <div class="flowText">{{ item.name }}</div>
        </div>
      </div>
    </div>

    <div class="leftTitleBox">
      <div class="titleText">组件</div>
      <!-- <div class="componentSearch">
        <AppstoreAddOutlined style="margin-right: 5px" />
        请输入关键词
      </div> -->
      <input class="componentSearch" type="text" placeholder="请输入关键词" />
    </div>

    <Collapse v-for="menu in MENU_OPTION" :key="menu.key" :title="menu.title">
      <template #content>
        <VueDraggable
          v-model="menu.items"
          :animation="150"
          :group="{ name: 'node', pull: 'clone', put: false }"
          :clone="cloneComponent"
          :sort="false"
          ghostClass="ghost"
          :forceFallback="true"
        >
          <div
            v-for="item in menu.items"
            :key="NODE_MAP[item].type"
            class="dragSourceItem"
          >
            <div>{{ NODE_MAP[item].name }}</div>
          </div>
        </VueDraggable>
      </template>
    </Collapse>
  </div>
</template>

<script setup lang="ts">
import { VueDraggable } from "vue-draggable-plus";
import { NODE_MAP, NodeType } from "../../nodeBase/nodeType";
import { useFlowStore } from "@/stores/flow.ts";
import Collapse from "./collapse.vue";
import { MENU_OPTION } from "./leftBarMenuOption";
import {
  SearchOutlined,
  AppstoreAddOutlined,
  ExportOutlined,
  DownloadOutlined,
  EditOutlined,
  EllipsisOutlined,
  PlayCircleOutlined,
  DeleteOutlined,
} from "@ant-design/icons-vue";

const flowStore = useFlowStore();

const cloneComponent = (type: NodeType) => {
  const id = crypto.randomUUID();
  const element = NODE_MAP[type];

  return {
    ...element,
    id,
  };
};

const flowListClick = (item: FlowDTO) => {
  const filterData = flowStore.getTabList.filter(
    (data) => data.filename === item.filename
  );
  if (filterData?.length) {
    flowStore.setActiveKey(item.filename);
  } else {
    flowStore.addNewTab(item);
    flowStore.setActiveKey(item.filename);
  }
};
</script>

<style lang="less">
.leftBar {
  min-width: 280px;
  width: 280px;
  border: 1px solid #dadee4;
}

.dragSourceItem {
  width: 280px;
  height: 30px;
  background: #999;
  margin: 6px 0;
  cursor: pointer;
}

.processList {
  height: 200px;
  border: 1px solid #dadee4;
}

.leftTitleBox {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
}

.titleIcon {
  width: 16px;
  height: 16px;
}

.titleText {
  font-weight: 600;
  font-size: 14px;
  color: #202631;
}

.flowsBox {
  padding: 0 12px;
  min-height: 100px;
  max-height: 600px;
  border-bottom: 1px solid #dadee4;
}

.flowItem {
  display: flex;
  align-items: center;
}
.flowIcon {
  width: 16px;
  height: 16px;
  margin-right: 6px;
}
.flowText {
  font-size: 14px;
  color: #202632;
}
.componentSearch {
  outline-style: none;
  border-radius: 14px;
  border: none;
  height: 28px;
  padding: 6px 16px;
  width: 160px;
  font-size: 14px;
  background: #f2f5f8;
}
</style>
