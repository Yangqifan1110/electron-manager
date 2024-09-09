<template>
  <div class="actionBox">
    <div class="actionArea">
      <a-tabs
        v-model:activeKey="activeKey"
        type="editable-card"
        @edit="onEditTab"
        @change="changeTabs"
      >
        <a-tab-pane
          v-for="pane in flowStore.getTabList"
          :key="pane.filename"
          :tab="pane.name"
          :closable="pane.closable"
        >
        </a-tab-pane>
      </a-tabs>

      <VueDraggable
        v-model="targetList"
        :animation="150"
        group="node"
        ghostClass="ghostTarget"
        class="targetDragArea"
        :onSort="updateNode"
        @click="unSelect"
        :onAdd="(addNode as any)"
      >
        <div
          v-for="(item, index) in targetList"
          :key="item.id"
          :class="
            componentStore.getSelectedIndex.indexOf(index) !== -1
              ? 'dragItem selectedItem'
              : 'dragItem'
          "
          @contextmenu="($event) => rightClick($event, index)"
          @click.exact.stop="($event) => chooseSelect($event, index)"
          @click.ctrl.stop="($event) => multipleCtrlSelect($event, index)"
          @click.meta.stop="($event) => multipleCtrlSelect($event, index)"
          @click.shift.stop="($event) => multipleShiftSelect($event, index)"
          :style="{ marginLeft: `${(item?.sortLevel || 0) * 30}px` }"
        >
          <div>
            {{ item.name }}
            {{ componentStore.getCurrentComponent?.id === item.id ? "*" : "" }}
          </div>
        </div>
      </VueDraggable>
    </div>
    <div class="bottomBar">
      <div>
        {{ JSON.stringify(componentStore.getComponentList) }}
        <!-- {{ JSON.stringify(draftStore.getDraftList) }} -->
        <!-- <div v-for="item in draftStore.getDraftList">
          {{ JSON.stringify(item) }}
        </div> -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref, watch, watchEffect } from "vue";
  import { VueDraggable } from "vue-draggable-plus";
  import { menusEvent } from "vue3-menus";
  import { useDraftStore } from "@/stores/draft";

  import { useComponentStore } from "@/stores/component";
  import { NODE_MAP, NodeType, PAIRS_NODE } from "../../nodeBase/nodeType";
  import { useFlowStore } from "@/stores/flow";
  import { isNil } from "lodash";
  import { BlockType } from "../../api/index.d";
  interface Props {
    blocks: BlockType[];
  }
  const props = defineProps<Props>();
  const componentStore = useComponentStore();
  const flowStore = useFlowStore();
  const draftStore = useDraftStore();

  const menus = ref({
    menus: [
      {
        label: "菜单",
        tip: "不关闭菜单",
        click: () => {},
      },
      {
        label: "菜单",
        tip: "不关闭菜单",
        click: () => {},
      },
      {
        label: "菜单",
        tip: "不关闭菜单",
        click: () => {},
      },
      {
        label: "菜单",
        tip: "不关闭菜单",
        click: () => {},
        divided: true,
      },
      {
        label: "删除",
        tip: "Alt+向左箭头",
        click: (e: void, index: number) => {
          removeNode(index);
        },
      },
    ],
  });
  const targetList = ref<nodeDTO[]>([]);

  const activeKey = ref(flowStore.getActiveKey);

  const chooseSelect = (e: any, index: any) => {
    componentStore.setSelectedComponent([index]);
    componentStore.changeCurrentComponentByIndex(index);
    e.preventDefault();
  };
  const multipleCtrlSelect = (e: any, index: number) => {
    //
    const selectNodeList = componentStore.getSelectedIndex;
    let result = [];
    if (selectNodeList.indexOf(index) !== -1) {
      result = selectNodeList.filter((item) => item !== index);
    } else {
      result = [...selectNodeList, index];
    }
    componentStore.setSelectedComponent(result);
    componentStore.changeCurrentComponentByIndex(index);
    e.preventDefault();
  };
  const multipleShiftSelect = (e: any, index: number) => {
    const startIndex = componentStore.getCurrentIndex;
    if (startIndex == index) {
      //
    }
    if (!isNil(startIndex)) {
      const result = componentStore.getComponentList
        .map((_, nodeIndex) => {
          if (startIndex > index) {
            if (startIndex >= nodeIndex && nodeIndex >= index) {
              return nodeIndex;
            }
          } else {
            if (index >= nodeIndex && nodeIndex >= startIndex) {
              return nodeIndex;
            }
          }
        })
        .filter((item) => !isNil(item));
      componentStore.setSelectedComponent(result);
      componentStore.changeCurrentComponentByIndex(index);
    } else {
      //
    }
    e.preventDefault();
  };

  const unSelect = () => {
    componentStore.cancalCurrentComponent();
  };

  // 新增 换顺序触发
  const updateNode = (element: any) => {
    // 更新自动选中
    // componentStore.setSelectedComponent([element.newIndex]);
    componentStore.changeCurrentComponentByIndex(element.newIndex);

    componentStore.setComponentList(targetList.value as any);
    draftStore.saveDraft();
  };

  // 删除触发
  const removeNode = (index: number) => {
    // console.log("removeNode");
    if (index === componentStore.getCurrentIndex) {
      componentStore.cancalCurrentComponent();
    }
    componentStore.delComponent([index]);
    draftStore.saveDraft();
  };

  const addNode = (element: {
    newIndex: number;
    clonedData: { type: NodeType };
  }) => {
    // console.log("addNode", element);

    // 1拖2

    if (PAIRS_NODE?.[element.clonedData.type]) {
      const id = crypto.randomUUID();
      const addItem = {
        ...NODE_MAP[PAIRS_NODE[element.clonedData.type]!],
        id,
      };
      const copyList = targetList.value.splice(
        element.newIndex + 1,
        0,
        addItem
      );
      componentStore.setComponentList(copyList);
    }
  };

  const rightClick = (event: MouseEvent, index: number) => {
    componentStore.setSelectedComponent([index]);
    componentStore.changeCurrentComponentByIndex(index);
    menusEvent(event, menus.value as any, index);
    event.preventDefault();
  };

  const addTab = () => {
    flowStore.createFlow();
  };

  const removeTab = (targetKey: string) => {
    flowStore.removeTab(targetKey);
  };

  const onEditTab = (targetKey: string | MouseEvent, action: string) => {
    console.log("targetKey", targetKey);
    if (action === "add") {
      addTab();
    } else {
      removeTab(targetKey as string);
    }
  };
  const changeTabs = (activeKey: string) => {
    console.log("changeTabs", activeKey);
    flowStore.setActiveKey(activeKey);
  };
  watchEffect(() => {
    // 同步
    activeKey.value = flowStore.getActiveKey;
  });

  watch(
    () => componentStore.getComponentList,
    () => {
      targetList.value = componentStore.getComponentList;
    },
    {
      immediate: true,
      deep: true,
    }
  );
  watch(
    () => props.blocks,
    () => {
      componentStore.setComponentList(props.blocks);
      componentStore.currentIndex = 0;
    }
  );
</script>

<style lang="less">
  .actionBox {
    width: 100%;
    display: flex;
    flex-direction: column;
  }

  .actionArea {
    height: calc(100vh - 260px);
    overflow-y: scroll;
    overflow-x: hidden;
  }

  .dragItem {
    margin: 6px;
    height: 50px;
    background: #DADEE4;
    align-items: center;
  }

  .dragSourceItem {
    width: 280px;
    height: 30px;
    background: #999;
    margin: 6px 0;
    cursor: pointer;
  }

  .bottomBar {
    height: 200px;
    border: 1px solid #DADEE4;
    margin-bottom: 0;
  }

  .ghostTarget {
    height: 0;
    border: 1px solid blue;
    width: 100%;
    overflow: hidden;
  }
  .targetDragArea {
    height: 100%;
  }

  .selectedItem {
    background: #999;
  }
</style>
