import { defineStore } from "pinia";

export const useAppStore = defineStore("app", {
  state: () => ({
    appId: "",
    appName: "",
    theme: "default",
  }),
  getters: {
    getTheme(): string {
      return this.theme;
    },
  },
  actions: {
    setTheme(e: string) {
      this.theme = e;
    },
  },
});
