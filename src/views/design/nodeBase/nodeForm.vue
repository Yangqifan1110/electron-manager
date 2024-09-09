<template>
  <div>
    input:
    <!-- 动态渲染 inputMap 中对应的组件 -->
    <component :is="inputComponent" v-bind="commonProps" />
    output:
    <!-- 动态渲染 outputMap 中对应的组件 -->
    <component :is="outputComponent" v-bind="commonProps" />
  </div>
</template>

<script lang="ts">
  import { defineComponent, computed, resolveComponent } from "vue";
  import { NodeType } from "./nodeType";
  export default defineComponent({
    name: "NodeForm",
    props: {
      dataSource: { type: Object, required: true },
    },
    setup(props) {
      const nodeType = props.dataSource?.type as NodeType;
      const commonProps = { dataSource: props.dataSource };
      // 使用对象映射 nodeType 到对应的组件名称字符串
      const inputMap: Record<string, string> = {
        [NodeType.IF]: "IfForm",
        [NodeType.ENDIF]: "EndIfForm",
        [NodeType.ELSE]: "ElseForm",
        [NodeType.WEBPAGE]: "WebpageForm",
        [NodeType.PRINT]: "PrintForm",
        [NodeType.RANDOMNUM]: "RandomNum", 
        [NodeType.XXX]: "IfForm",
      };

      const outputMap: Record<string, string> = {
        [NodeType.RANDOMNUM]: "RandomNumOutput", 
      };

      // 动态解析组件名称
      const inputComponent = computed(() => {
        const componentName = inputMap[nodeType] || "";
        const component = resolveComponent(componentName);
        console.log("Input Component:", componentName, component);
        return component;
      });
      const outputComponent = computed(() =>
        resolveComponent(outputMap[nodeType] || "")
      );

      return {
        commonProps,
        inputComponent,
        outputComponent,
      };
    },
  });
</script>
