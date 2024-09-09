<template>
  <div class="home">
    <div class="header">
      <div class="tabs">
        <div
          :class="['right-title', activeKey == '2' ? 'active' : '']"
          @click="tabChange('2')"
        >
          我开发的应用
        </div>
        <div
          :class="['right-title', activeKey == '1' ? 'active' : '']"
          @click="tabChange('1')"
        >
          我获取的应用
        </div>
      </div>
      <div class="header-right">
        <div class="search-box">
          <div @click="search"><SearchOutlined /> 搜索</div>
          <input type="text" placeholder="" v-model="formState.keyWord" />
        </div>
        <div class="create">
          <div
            class="add"
            @click="router.push({ path: '/design', query: { type: 'create' } })"
          >
            <AppstoreAddOutlined style="margin-right: 5px" />新建
          </div>
          <div class="export" @click="add">
            <ExportOutlined style="margin-right: 5px" />导入
          </div>
        </div>
      </div>
    </div>
    <div class="list">
      <div v-for="item in dataSource" :key="item.app_id" class="list-item">
        <div class="content">
          <div class="file-img">
            <img :src="item.imgIndex" alt="" />
          </div>
          <div class="desc">
            <div class="title">
              <div class="name">{{ item.app_name }}</div>
              <div class="version">v {{ item.version }}</div>
            </div>
            <div class="date">{{ item.update_at }}</div>
          </div>
        </div>
        <div class="option">
          <div @click="play(item.app_id)">
            <PlayCircleOutlined class="icon" />
          </div>
          <div><DownloadOutlined class="icon" /></div>
          <div v-if="activeKey == '2'" @click="edit(item.app_id)">
            <EditOutlined class="icon" />
          </div>
          <div style="margin-left: auto">
            <a-dropdown>
              <a class="ant-dropdown-link" @click.prevent>
                <EllipsisOutlined style="color: #babcbf" />
              </a>
              <template #overlay>
                <a-menu>
                  <a-menu-item @click="del(item.app_id)">
                    <DeleteOutlined class="del" />
                    <span class="option-text">删除</span></a-menu-item
                  >
                </a-menu>
              </template>
            </a-dropdown>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, reactive, ref } from "vue";
  import {
    SearchOutlined,
    AppstoreAddOutlined,
    ExportOutlined,
    DownloadOutlined,
    EditOutlined,
    EllipsisOutlined,
    PlayCircleOutlined,
    DeleteOutlined,
  } from "@ant-design/icons-vue";
  import { ipcRenderer } from "electron";
  import file0 from "@/assets/imgs/file0.png";
  import file1 from "@/assets/imgs/file1.png";
  import file2 from "@/assets/imgs/file2.png";

  import { addTask, getFlowList, deleteTask, runTask } from "./index.api";
  import { getDesignList } from "@/views/design/api/index";
  import { message } from "ant-design-vue";
  import { ProcessDataType, FormState, AppDataType } from ".";
  import { useRouter } from "vue-router";
  const router = useRouter();
  const formState = reactive<FormState>({
    keyWord: "",
    page: 1,
    limit: 9999,
  });
  const activeKey = ref("2");
  const dataSource = ref<AppDataType[]>([]);
  const tabChange = (e: string) => {
    activeKey.value = e;
    formState.keyWord = "";
    init();
  };
  const search = () => {
    init();
  };
  const add = async () => {
    const filePath = await ipcRenderer.invoke("openFile");
    if (!filePath) return message.error("请选择文件");
    const res = await addTask(filePath);
    if (res.success) {
      message.success("导入成功");
      init();
    } else {
      message.error("导入失败");
    }
  };
  const play = async (e: string) => {
    // isPlay.value = true;
    const res = await runTask(e);
    console.log("res", res);
    message.success(res.msg);
    ipcRenderer.send("runTask");
  };
  const del = async (e: string) => {
    const res = await deleteTask(e);
    message.success(res.msg);
    init();
  };
  const edit = (appId: string) => {
    router.push({
      path: "/design",
      query: {
        type: "edit",
        appId,
      },
    });
  };
  const init = async () => {
    console.log("active", activeKey.value);
    const res =
      activeKey.value == "1"
        ? await getFlowList(formState)
        : await getDesignList(formState);
    const randomImg = [file0, file1, file2];
    dataSource.value = res.data.map((item) => {
      return {
        ...item,
        imgIndex: randomImg[Math.floor(Math.random() * randomImg.length)],
      };
    });
  };

  onMounted(() => {
    init();
    ipcRenderer.send("changWindowSize", { width: 1293, height: 760 });
  });
</script>

<style lang="less" scoped>
  .home {
    padding: 20px 24px;
    background: @background-color;
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 18px;
      .tabs {
        width: 300px;
        display: flex;
        padding-bottom: 10px;
        border-bottom: 1px solid #DADEE4;
        cursor: pointer;
        .right-title {
          width: 50%;
          color: #7c859b;
          font-size: 14px;
          font-weight: 600;
          text-align: center;
          position: relative;
        }
        & .active {
          color: @tabs-activeColor;
        }
        .right-title.active::after {
          content: "";
          position: absolute;
          bottom: -10px;
          left: 50%;
          transform: translateX(-50%);
          width: 100%;
          height: 3px;
          background-color: @tabs-activeBgColor;
        }
      }
      .header-right {
        display: flex;
        cursor: pointer;
        .create {
          width: 162px;
          height: 36px;
          background: @create-bgColor;
          border-radius: 22px 22px 22px 22px;
          display: flex;
          text-align: center;
          padding: 8px;
          font-size: 16px;
          color: #222732;
          .add {
            width: 50%;
            border-right: 2px solid #000;
          }
          .export {
            width: 50%;
          }
        }
      }
    }
    .list {
      display: grid;
      // grid-template-columns: repeat(5, 216px);
      grid-template-columns:repeat(auto-fill, minmax(216px, 1fr));
      grid-auto-rows: 112px;
      gap: 19px;
      .list-item {
        border-radius: 10px;
        border: 1px solid #e0e4eb;
        display: flex;
        flex-direction: column;
        .content {
          padding: 14px 20px;
          border-bottom: 1px solid #e0e4eb;
          display: flex;
          .file-img {
            width: 36px;
            height: 36px;
            margin-right: 12px;
            img {
              width: 100%;
              height: 100%;
            }
          }
          .desc {
            .title {
              margin-bottom: 5px;
              display: flex;
              .name {
                max-width: 80px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                font-size: 16px;
                margin-right: 5px;
                font-weight: 600;
                color: @primary-color;
              }
              .version {
                font-size: 12px;
                color: #babcbf;
                margin-top: 5px;
              }
            }
            .date {
              font-size: 12px;
              color: #c2d4e6;
            }
          }
        }
        .option {
          padding: 0 20px;
          flex: 1;
          display: flex;
          align-items: center;
          .icon {
            margin-right: 20px;
            color: #babcbf;
          }
        }
      }
    }
  }
  .del {
    color: #f5222d;
  }
  .option-text {
    margin-left: 10px;
    color: #f5222d;
  }

  .search-box {
    color: #fff;
    margin-right: 10px;
    width: auto;
    border-radius: 25px;
    min-width: 92px;
    height: 36px;
    line-height: 36px;
    display: inline-block;
    position: relative;
    overflow: hidden;
    background: #518aef;
    text-align: center;
    cursor: pointer;
  }

  .search-box div {
    position: absolute;
    right: 0;
    top: 0;
    width: 92px;
    height: 36px;
    text-align: center;
    font-size: 16px;
    cursor: pointer;
  }

  .search-box input {
    display: inline-block;
    background: 0 0;
    outline: none;
    border: none;
    color: #fff;
    padding-left: 20px;
    line-height: 36px !important;
    height: 36px;
    box-sizing: border-box;
    vertical-align: 4px;
    font-size: 16px;
    width: 50px;
    transition: all 0.3s ease-in-out;
  }
  .search-box:hover input,
  .search-box:focus-within input {
    display: inline-block;
    width: 200px;
    padding-right: 50px;
  }

  .search-box input:not(:placeholder-shown) {
    display: inline-block;
    width: 200px;
    padding-right: 80px;
  }
  // .search-box input:focus {
  //   outline: none; /* 移除聚焦时的外边框 */
  // }

  // .search-box:focus-within {
  //   outline: none; /* 当子元素获得焦点时移除聚焦线 */
  // }
</style>
