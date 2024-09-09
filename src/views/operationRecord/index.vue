<template>
  <div class="operationRecord">
    <a-table
      :dataSource="dataSource"
      :columns="columns"
      :pagination="false"
      :customRow="customRow"
      :rowClassName="setRowClassName"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'result'"> 执行成功 </template>
        <template v-if="column.dataIndex === 'operation'">
          <FileTextOutlined :style="style" @click="detail(record.log_id)" />
        </template>
      </template>
    </a-table>
  </div>
  <a-modal v-model:open="open" title="运行日志" :footer="null">
    <p style="white-space: pre-line" v-html="recordDetail"></p>
  </a-modal>
</template>

<script setup lang="ts">
  import { FileTextOutlined, SyncOutlined } from "@ant-design/icons-vue";
  import { columns } from "./index.enum";
  import { useRouter } from "vue-router";
  import { onMounted, reactive, ref } from "vue";
  import { SearchDataType, TaskRecordDataType } from ".";
  import { getLog, getRecordList } from "./index.api";
  const style = { color: "@primary-color", fontSize: "16px" };
  const router = useRouter();
  const open = ref<boolean>(false);
  const recordDetail = ref("");
  const total = ref(0);
  const dataSource = ref<TaskRecordDataType[]>([]);
  const formState = reactive<SearchDataType>({
    page: 1,
    limit: 10,
  });
  const highlightedRow = ref();
  const customRow = (record: TaskRecordDataType) => {
    return {
      onClick: () => {
        console.log('record',record)
        highlightedRow.value = record.log_id;
      },
    };
  };
  const setRowClassName = (record: TaskRecordDataType) => {
    return record.log_id === highlightedRow.value ? "highlighted-row" : "";
  };
  const detail = async (e: string) => {
    open.value = true;
    const res = await getLog(e);
    recordDetail.value = res.data;
    // router.push({ path: "/logDetails", query: { logId: e } });
  };
  const init = async () => {
    const res = await getRecordList(formState);
    dataSource.value = res.data;
    total.value = res.count;
  };
  onMounted(() => {
    init();
  });
</script>

<style lang="less" scoped>
  .operationRecord {
    padding: 24px;
    background: @background-color;
  }
 
  :deep(.ant-table) {
    background: @background-color;
  }
  :deep(.ant-table-thead .ant-table-cell) {
    background: @background-color;
    color: @primary-color;
    font-size: 12px;
    font-weight: 500;
  }
  :deep(.ant-table-row) {
    .ant-table-cell {
      color: @primary-color;
      font-size: 13px;
      &:first-child {
        font-size: 15px;
        color: @primary-color;
      }
    }
    .ant-table-cell-row-hover{
      color: #202631 !important;
      background: #F2F5F8 !important;
    }
  }
</style>
