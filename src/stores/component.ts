import { defineStore } from "pinia";
import { isNil } from "lodash";
import { useDraftStore } from "./draft";

interface State {
  componentList: nodeDTO[];
  currentIndex: number | undefined;
  selectedIndex: number[];
}

export const useComponentStore = defineStore("component", {
  state: (): State => ({
    componentList: [],
    // 当前组件表单
    currentIndex: undefined,
    // 选中状态
    selectedIndex: [],
  }),
  getters: {
    getComponentList: (state) => state.componentList,
    getCurrentIndex: (state) => state.currentIndex,
    getCurrentComponent: (state) => {
      if (isNil(state.currentIndex)) return;
      return state.componentList[state.currentIndex!];
    },

    getSelectedIndex: (state) => state.selectedIndex,
  },
  actions: {
    // selected操作
    setSelectedComponent(index: number[]) {
      this.selectedIndex = index;
    },

    // current操作
    changeCurrentComponent(data: nodeDTO) {
      const index = this.componentList.map((item) => item.id).indexOf(data.id);
      this.currentIndex = index;
    },
    changeCurrentComponentByIndex(index: number) {
      this.currentIndex = index;
      // this.setSelectedComponent([index]);
    },
    cancalCurrentComponent() {
      this.currentIndex = undefined;
    },
    setInputsData(data: any) {
      if (isNil(this.currentIndex)) return;
      this.componentList[this.currentIndex!].inputs = data ?? "";
    },
    setOutputsData(data: any) {
      if (isNil(this.currentIndex)) return;
      this.componentList[this.currentIndex!].outputs = data ?? "";
    },

    // componentList操作
    setComponentList(data: nodeDTO[]) {
      this.componentList = data;
      this.sortComponentListLevel();
    },
    delComponent(indexList: number[]) {
      // this.componentList.splice(index, 1);
      indexList.map((item) => {
        this.componentList.splice(item, 1);
      });
      this.sortComponentListLevel();
    },
    insertComponent(index: number, item: nodeDTO) {
      this.componentList.splice(index, 0, item);
      this.sortComponentListLevel();
    },

    sortComponentListLevel() {
      let level = 0;
      this.componentList.map((item) => {
        if (item?.changeLevel === "down") {
          level > 0 && level--;
        }
        item.sortLevel = level;
        if (item?.changeLevel === "up") {
          level++;
        }
      });
    },
  },
});
