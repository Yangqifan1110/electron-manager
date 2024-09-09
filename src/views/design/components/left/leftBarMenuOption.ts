import { NodeType } from "../../nodeBase/nodeType";

export const MENU_OPTION = [
  {
    key: "ifType",
    title: "条件判断",
    items: [NodeType.IF, NodeType.ELSE],
  },
  {
    key: "whileType",
    title: "循环",
    items: [NodeType.FOR],
  },
  {
    key: "webpage",
    title: "打开网页",
    items: [NodeType.WEBPAGE],
  },
  {
    key: "random",
    title: "随机数",
    items: [NodeType.RANDOMNUM],
  },

  {
    key: "print",
    title: "输出",
    items: [NodeType.PRINT],
  },
  {
    key: "qita",
    title: "其他",
    items: [NodeType.XXX],
  },
];
