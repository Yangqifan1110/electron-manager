<template>
  <div class="header">
    <div class="title">
      <div class="title-text">日志查看-1.0.1</div>
      <a-button type="primary" @click="router.back()">返回</a-button>
    </div>
    <div>
      <a-form
        ref="formRef"
        layout="inline"
        :model="formState"
        @finish="onFinish"
        @finishFailed="onFinishFailed"
      >
        <a-form-item label="关键词" name="keyWord">
          <a-input
            v-model:value="formState.keyWord"
            placeholder="请输入关键词"
          />
        </a-form-item>
        <a-form-item label="日志类型" name="type">
          <a-input v-model:value="formState.type" placeholder="请输入关键词" />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" html-type="submit" style="margin-right: 20px"
            ><SearchOutlined />搜索
          </a-button>
          <a-button @click="resetForm"><RedoOutlined />重置</a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
  <div class="content">
    <a-table
      :dataSource="dataSource"
      :columns="detailColumns"
      :pagination="false"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'content'"> 已就绪 </template>
        <template v-if="column.dataIndex === 'level'"> 执行组件 </template>
      </template>
    </a-table>
    <AppPagination :total="total" @change="onChange" />
  </div>
</template>

<script setup lang="ts">
  import { onMounted, reactive, ref } from "vue";
  import { SearchOutlined, RedoOutlined } from "@ant-design/icons-vue";
  import AppPagination from "@/components/AppPagination.vue";
  import { detailColumns } from "./index.enum";
  import { useRoute, useRouter } from "vue-router";
  import { getLog } from "./index.api";
  const router = useRouter();
  const route = useRoute();
  interface FormState {
    keyWord: string;
    type: string;
  }
  const formState = reactive<FormState>({
    keyWord: "",
    type: "",
  });
  const formRef = ref();
  const isPlay = ref(false);
  const total = 500;
  const dataSource = [
    {
      key: "1",
      time: "测试1",
      age: "1.0.1",
      address: "2024-05-28 10:30",
    },
  ];
  const onFinish = (values: any) => {
    console.log("Success:", values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };
  const resetForm = () => {
    formRef.value.resetFields();
  };
  const onChange = (page: number, pageSize: number) => {
    console.log("切换");
  };
  const refresh = () => {
    console.log("刷新");
  };
  const play = () => {
    isPlay.value = true;
  };
  const pause = () => {
    isPlay.value = false;
  };
  const del = () => {
    console.log("删除");
  };
  const init = async () => {
    const logId = route.query.logId as string;
    if (logId) {
      const res = await getLog(logId);
      console.log("res", res);
    }
  };
  onMounted(() => {
    init();
  });
</script>

<style scoped>
  .header {
    padding: 24px;
    background: #fff;
    margin-bottom: 24px;
  }
  .title {
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
  }
  .title-text {
    font-size: 18px;
  }
  .content {
    padding: 24px;
    background: #fff;
  }
</style>
