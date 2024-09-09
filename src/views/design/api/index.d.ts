export interface FormState {
  keyWord?: string;
  page: number;
  limit: number;
}

export interface MainData {
  app_id: string;
  external_dependencies: any[];
  flows: FlowDTO[];
  name: string;
  variables: any[];
}

export interface FlowDTO {
  filename: string;
  groupName: string;
  kind: string;
  name: string;
  closable?: boolean;
  id?: string;
}

export interface BlocksDataType {
  blocks: BlockType[];
  kind: string;
  memo: string;
  name: string;
  parameters: any[];
}

export interface BlockType {
  changeLevel?: "up" | "down";
  desc: string;
  id: string;
  inputs?: any;
  name: string;
  sortLevel: number;
  type: string;
}
