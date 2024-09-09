import { defineStore } from "pinia";

interface State {
  isLogin: boolean;
  isCheck: boolean;
  expireDate: string;
}
export const useLoginStore = defineStore("login", {
  state: (): State => ({
    isLogin: false,
    isCheck: false,
    expireDate: "",
  }),
  getters: {
    getExpireDate: (state) => state.expireDate || localStorage.expireDate,
  },
  actions: {
    setLoginInfo(data: { isLogin: boolean; isCheck: boolean }) {
      const { isLogin, isCheck } = data;
      this.isLogin = isLogin;
      this.isCheck = isCheck;
      localStorage.isLogin = isLogin;
      localStorage.isCheck = isCheck;
    },
    setExpireDate(data: string) {
      this.expireDate = data;
      localStorage.expireDate = data;
    },
  },
});
