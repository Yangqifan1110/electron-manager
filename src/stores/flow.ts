import { defineStore } from "pinia";
import { FlowDTO } from "@/views/design/api/index.d";

interface State {
  flowList: FlowDTO[];
  tabList: FlowDTO[];
  activeKey: string;
  appId: string;
}

export const useFlowStore = defineStore("flow", {
  state: (): State => ({
    flowList: [],
    tabList: [],
    activeKey: "main",
    appId: "",
  }),
  getters: {
    // flow列表
    getFlowList: (state) => state.flowList,
    // tab列表
    getTabList: (state) => state.tabList,
    // tab key
    getActiveKey: (state) => state.activeKey,
  },
  actions: {
    setTabList(data: FlowDTO[]) {
      this.flowList = data;
      this.tabList[0] = data[0];
    },
    addNewTab(item: FlowDTO) {
      this.tabList.push(item);
    },

    createFlow() {
      const key = `${this.flowList.length}`;
      const name = `主流程${key}.flow`;
      const addItem = {
        filename: name,
        groupName: "",
        kind: "",
        name: name,
      };
      this.flowList.push(addItem);
      this.tabList.push(addItem);

      
      // draftStore.saveDraft();
      this.setActiveKey(name);
    },

    removeTab(key: string) {
      console.log("key", key);
      const lastIndex = this.getIndexByKey(key);

      this.tabList = this.tabList.filter((pane) => pane.id !== key);

      if (this.activeKey === key) {
        if (lastIndex) {
          if (this.tabList?.[lastIndex]?.id) {
            this.setActiveKey(this.tabList[lastIndex].id);
          }
        } else {
          this.setActiveKey("main");
        }
      }
    },

    getIndexByKey(key: string) {
      let lastIndex = 0;
      this.tabList.forEach((item, index) => {
        if (item.id === key) {
          lastIndex = index - 1;
        }
      });
      return lastIndex;
    },

    setActiveKey(key: string) {
      this.activeKey = key;
    },
  },
});
