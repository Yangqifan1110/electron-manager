import { defineComponent, VNode } from "vue";
import { NodeType } from "./nodeType";
import IfInput from "../nodeFormOption/ifs/if/ifInput.vue";
import EndIfInput from "../nodeFormOption/ifs/endIf/endIfInput.vue";
import ElseInput from "../nodeFormOption/ifs/else/elseInput.vue";
import OpenPageInput from "../nodeFormOption/webPage/openPage/openPageInput.vue";
import PrintInput from "../nodeFormOption/others/print/printInput.vue";
import RandomNumInput from "../nodeFormOption/others/random/randomNumInput.vue";
import RandomNumOutput from "../nodeFormOption/others/random/randomNumOutput.vue";

export default defineComponent({
  name: "NodeForm",
  props: {
    dataSource: { type: Object, required: true },
  },
  setup(props) {
    const dataSource = props.dataSource as any;

    const nodeType = dataSource?.type as NodeType;

    const commonProps = {
      dataSource,
    };

    const inputMap: Partial<Record<NodeType, VNode>> = {
      [NodeType.IF]: <IfInput {...commonProps} />,
      [NodeType.ENDIF]: <EndIfInput {...commonProps} />,
      [NodeType.ELSE]: <ElseInput {...commonProps} />,
      [NodeType.WEBPAGE]: <OpenPageInput {...commonProps} />,
      [NodeType.PRINT]: <PrintInput {...commonProps} />,
      [NodeType.RANDOMNUM]: <RandomNumInput {...commonProps} />,
      [NodeType.XXX]: <IfInput {...commonProps} />,
    };

    const outputMap: Partial<Record<NodeType, VNode>> = {
      [NodeType.RANDOMNUM]: <RandomNumOutput {...commonProps} />,
    };

    return () => (
      <div>
        input:
        {inputMap?.[nodeType] || "无配置"}
        output:
        {outputMap?.[nodeType] || "无配置"}
      </div>
    );
  },
});
