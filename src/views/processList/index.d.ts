
export interface ProcessDataType {
  process_id: string;
  process_name: string;
  process_path: string;
  update_at: string;
  version: string;
  imgIndex?:string
}
export interface AppDataType {
  app_id: string;
  app_name: string;
  app_path: string;
  update_at: string;
  version: string;
  imgIndex?:string
}

export interface FormState {
  keyWord?: string;
  page: number;
  limit: number;
}
