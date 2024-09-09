/*
 * @Descripttion:
 * @Author: taoman
 * @Date: 2024-01-10 11:04:38
 * @LastEditors: taoman
 * @LastEditTime: 2024-08-29 17:14:59
 */
import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { ResRoot } from "./index.d";
import { message } from "ant-design-vue";
// import { voiceStore } from "@/store/voice";
const baseURL = import.meta.env.DEV ? "/api" : import.meta.env.VITE_BASE_URL;
// const baseURL = import.meta.env.VITE_BASE_URL;
const defaultConfig: AxiosRequestConfig = {
  baseURL,
  timeout: 10000,
};
class AxiosWrapper {
  private static axiosInstance: AxiosInstance = axios.create(defaultConfig);
  constructor() {
    AxiosWrapper.axiosInstance.interceptors.request.use(
      (config) => {
        // config.data = removeEmptyRecursive(config.data);
        // console.log("入参", config.data);

        // // config.headers.Authorization = voiceStore.token;
        // const { enData, enPW, enobj } = encryptData(config.data);
        // // @ts-ignore
        // config.enobj = enobj;
        // config.data = { enData, enPW };
        // console.log('请求数据',config.data)
        return config;
      },
      (err) => {
        return Promise.reject(err);
      }
    );
    AxiosWrapper.axiosInstance.interceptors.response.use(
      (res) => {
        const contentType = res.headers["content-type"];
        if (
          contentType &&
          contentType.includes(
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          )
        ) {
          return res;
        }
        // @ts-ignore
        // const enobj = res.config.enobj;
        // const data = decryptData(res.data, enobj);

        const data = res.data;
        // const data = res.data;
        // console.log("http返回数据", data);
        if (data.success) {
          // message.success(data.msg);
          return data;
        } else {
          message.error(data.msg);
          return Promise.reject(data.msg);
        }
      },
      (err) => {
        return Promise.reject(err);
      }
    );
  }
  public request<T extends ResRoot<any>>(
    requestConfig: AxiosRequestConfig
  ): Promise<T> {
    const configWithDefaults: AxiosRequestConfig = {
      ...requestConfig,
      method: requestConfig.method
        ? requestConfig.method.toLowerCase()
        : "post",
    };
    return new Promise((resolve, reject) => {
      AxiosWrapper.axiosInstance
        .request(configWithDefaults)
        .then((res: any) => {
          resolve(res);
          // if (res.data.code == "200") {
          //   resolve(res.data);
          // } else {
          //   message.error(res.data.msg);
          //   reject(res.data.msg);
          // }
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}
const http = new AxiosWrapper();

export default http;
