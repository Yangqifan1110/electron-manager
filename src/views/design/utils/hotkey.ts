import { useDraftStore } from "@/stores/draft";
import { useComponentStore } from "@/stores/component";
import { useFlowStore } from "@/stores/flow";
import hotkeys from "hotkeys-js";

const componentStore = useComponentStore();
const flowStore = useFlowStore();
const draftStore = useDraftStore();

export const registerHotkey = () => {
  // 撤销
  hotkeys("ctrl+z, command+z", function () {
    draftStore.cancelDraft();
  });

  // 保存
  hotkeys("ctrl+s, command+s", function () {
    //
  });

  // 删除
  hotkeys("backspace, Del", function () {
    const indexList = componentStore.getSelectedIndex;

    if (indexList) {
      componentStore.delComponent(indexList);
      draftStore.saveDraft();
      componentStore.cancalCurrentComponent();
    }
  });

  // // 删除
  // hotkeys("backspace", function () {
  //   const index = componentStore.getCurrentIndex;
  //   if (index) {
  //     componentStore.delComponent(index);
  //     draftStore.saveDraft();
  //     componentStore.cancalCurrentComponent();
  //   }
  // });
};
