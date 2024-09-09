import http from "@/http";
import { BlocksDataType, FormState, MainData } from "./index.d";
import { ResDataType, ResRoot } from "@/http/index.d";
import { AppDataType } from "@/views/processList";

export const getDesignList = async (data: FormState) =>
  http.request<ResDataType<AppDataType[]>>({
    method: "get",
    url: `designer/app_manage/search?keyword=${data.keyWord}&limit=${data.limit}&page=${data.page}`,
  });

export const createMain = () =>
  http.request<ResRoot<string>>({
    url: "designer/app_manage/create",
  });

export const openMain = (appId: string) =>
  http.request<ResRoot<MainData>>({
    url: `/designer/app_edit/open?app_id=${appId}`,
  });

export const getFlowJson = (appId: string, flowFileName: string) =>
  http.request<ResRoot<BlocksDataType>>({
    url: `/designer/app_edit/get_flow_json?app_id=${appId}&flow_filename=${flowFileName}`,
  });

export const editFlowJson = (data: {
  appId: string;
  flowFileName: string;
  blocks: any;
}) =>
  http.request<ResRoot<string>>({
    url: `/designer/app_edit/set_flow_json?app_id=${data.appId}&flow_filename=${data.flowFileName}`,
    data: {
      blocks: data.blocks,
    },
  });
