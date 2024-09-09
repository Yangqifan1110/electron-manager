export interface NodeVO {
  name: string;
  type: string;
  desc: string;
  icon?: string;
  // id: string;
  changeLevel?: "up" | "down";
  inputs: null;
  outputs: null;
}

// node类型枚举
export enum NodeType {
  // if
  IF = "if",
  ENDIF = "endif",
  ELSE = "else",

  // 循环
  FOR = "for",
  ENDFOR = "endfor",

  // 网页
  WEBPAGE = "webpage",
  // 随机数
  RANDOMNUM = "randomnum",

  PRINT = "print",
  // 其他
  XXX = "xxx",
}

// node vo 属性map
export const NODE_MAP: Record<NodeType, NodeVO> = {
  [NodeType.IF]: {
    name: "if",
    type: "if",
    desc: "如果",
    changeLevel: "up",
    inputs: null,
    outputs: null,
  },
  [NodeType.ENDIF]: {
    name: "# endif",
    type: "endif",
    desc: "ENDIF",
    changeLevel: "down",
    inputs: null,
    outputs: null,
  },
  [NodeType.ELSE]: {
    name: "else",
    type: "else",
    desc: "XXXX",
    inputs: null,
    outputs: null,
  },

  //
  [NodeType.FOR]: {
    name: "for",
    type: "for",
    desc: "for",
    changeLevel: "up",
    inputs: null,
    outputs: null,
  },
  [NodeType.ENDFOR]: {
    name: "endfor",
    type: "endfor",
    desc: "endfor",
    changeLevel: "down",
    inputs: null,
    outputs: null,
  },
  //
  [NodeType.WEBPAGE]: {
    name: "打开网页",
    type: "webpage",
    desc: "webpage",
    inputs: null,
    outputs: null,
  },

  [NodeType.RANDOMNUM]: {
    name: "base_order.GetRandomNum",
    type: "randomnum",
    desc: "随机数",
    inputs: null,
    outputs: null,
  },
  [NodeType.PRINT]: {
    name: "base_order.Print",
    type: "print",
    desc: "输出",
    inputs: null,
    outputs: null,
  },

  [NodeType.XXX]: {
    name: "xxx",
    type: "XX",
    desc: "XXXX",
    inputs: null,
    outputs: null,
  },
};

// 1拖2 对应关系
export const PAIRS_NODE: Partial<Record<NodeType, NodeType>> = {
  [NodeType.IF]: NodeType.ENDIF,
  [NodeType.FOR]: NodeType.ENDFOR,
};
