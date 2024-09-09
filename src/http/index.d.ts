export type ResRoot<T> = {
  success: boolean;
  msg: string;
  data: T;
};
export interface ResDataType<T> {
  code: number;
  count: number;
  limit: number;
  msg: string;
  success: boolean;
  max_pages: number;
  data: T;
}
