import http from "@/http";
import { ResDataType, ResRoot } from "@/http/index.d";
import { AppDataType, FormState, ProcessDataType } from ".";
export const getFlowList = async (data: FormState) =>
  http.request<ResDataType<AppDataType[]>>({
    method: "get",
    url: `/actuator/app/search?keyword=${data.keyWord}&limit=${data.limit}&page=${data.page}`,
  });

export const addTask = (task_path: string) =>
  http.request<ResRoot<any>>({
    url: `/actuator/app/add?task_path=${task_path}`,
  });

// export const deleteTask = (app_id: string) =>
//   http.request<ResRoot<any>>({
//     url: `/actuator/app/remove?app_id=${app_id}`,
//   });
export const deleteTask = (app_id: string) =>
  http.request<ResRoot<any>>({
    url: `designer/app_manage/remove?app_id=${app_id}`,
  });

export const runTask = (app_id: string) =>
  http.request<ResRoot<any>>({
    url: `designer/app_run/run?app_id=${app_id}`,
  });
// export const runTask = (app_id: string) =>
//   http.request<ResRoot<any>>({
//     url: `/actuator/app/run?app_id=${app_id}`,
//   });
