import { defineStore } from "pinia";
import { useComponentStore } from "@/stores/component";
import { cloneDeep } from "lodash";
import { message } from "ant-design-vue";

interface State {
  draftList: draftDTO[];
}
interface draftDTO {
  draftId: number;
  data: nodeDTO[];
}

export const useDraftStore = defineStore("draft", {
  state: (): State => ({
    draftList: [],
  }),
  getters: {
    getDraftList: (state) => state.draftList,
  },
  actions: {
    saveDraft() {
      const MAX_TIME = 20 * 60 * 1000;
      const MAX_LENGTH = 30;

      const componentStore = useComponentStore();
      const nodeList = cloneDeep(componentStore.getComponentList);
      if (!nodeList.length) return;
      const currentTime = Date.parse(String(new Date()));
      //   const lastDraftTime = this.draftList?.[0].draftId || currentTime
      //   const time = currentTime - lastDraftTime
      if (this.draftList.length > MAX_LENGTH) {
        this.draftList.shift();
      }
      this.draftList.push({
        draftId: currentTime,
        data: nodeList,
      });
    },

    cancelDraft() {
      console.log("cancelDraft");
      const componentStore = useComponentStore();

      this.draftList.pop();

      
      if (this.draftList.length) {
        componentStore.setComponentList(
          this.draftList[this.draftList.length - 1]?.data || []
        );
      } else {
        // 
        message.error('没有草稿')
      }
      

      //   console.log('')
    },
    // setProcessList(data: any) {
    //   this.processList = data;
    // },
  },
});
