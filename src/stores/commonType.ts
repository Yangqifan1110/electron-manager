interface FlowDTO {
  filename: string;
  groupName: string;
  kind: string;
  name: string;
  closable?: boolean;
}

interface nodeDTO {
  id: string;
  name: string;
  inputs?: any;
  outputs?: any;
  changeLevel?: "up" | "down";
  sortLevel?: number;
  desc?: string;
  type?: string;
}

interface draftDTO {
  draftId: string;
  saveTime: number;
  nodeList: nodeDTO[];
}

interface State {
  appId: string;
  appName: string;
  processList: FlowDTO[];
  currentProcess: FlowDTO;
  currentNode: nodeDTO | undefined;
  nodeList: nodeDTO[];
  draftList: draftDTO[];
}
