import http from "@/http";
import { ResDataType, ResRoot } from "@/http/index.d";
import { SearchDataType, TaskRecordDataType } from ".";

export const getRecordList = (data: SearchDataType) =>
  http.request<ResDataType<TaskRecordDataType[]>>({
    method: "get",
    url: `/actuator/app/run_record?limit=${data.limit}&page=${data.page}`,
  });
export const getLog = (log_id: string) =>
  http.request({
    method: "get",
    url: `/actuator/app/get_log?log_id=${log_id}`,
  });
