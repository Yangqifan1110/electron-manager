// electron-main/index.ts
import { app, BrowserWindow, dialog, Tray, ipcMain, Menu } from "electron";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { existsSync, readFileSync, writeFileSync } from "fs";
import { SystemLog } from "../src/utils/systemLog";
import { setupIpcHandlers } from "../src/utils/ipcMain";
import log from "../src/utils/log";
import { setupAutoUpdater } from "../src/utils/update";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const isDevelopment = process.env.NODE_ENV === "development";
log.info(`环境${process.env.NODE_ENV}`, "main");
if (isDevelopment) {
  Object.defineProperty(app, "isPackaged", {
    get() {
      return true;
    },
  });
}
let win: any;
let tray: Tray | null = null;

const configPath = join(app.getPath("userData"), "best_bot_config.json");
const createWindow = () => {
  win = new BrowserWindow({
    // frame: false,
    // width: 800,
    // height: 600,
    // fullscreen: true,
    webPreferences: {
      contextIsolation: false, // 是否开启隔离上下文
      nodeIntegration: true, // 渲染进程使用Node API
      // enableRemoteModule: true,
      preload: join(__dirname, "preload.js"), // 需要引用js文件
    },
  });
  // 如果打包了，渲染index.html
  if (!isDevelopment) {
    const filePath = join(__dirname, "./index.html");
    log.info(`${"打包后加载地址" + filePath}`);
    win.loadFile(filePath);
    win.webContents.openDevTools();
    // 取消顶部菜单
    Menu.setApplicationMenu(null);
  } else {
    log.info("本地加载");
    let url = "http://localhost:8080"; // 本地启动的vue项目路径。
    win.loadURL(url);
    // 打开开发者工具
    win.webContents.openDevTools();
  }
  // Menu.setApplicationMenu(null);
  // 监听窗口关闭
  win.on("close", async (e: Event) => {
    e.preventDefault();
    const { hideOnClose } = readConfig();
    if (hideOnClose) {
      win.hide();
    } else {
      app.exit();
    }
    // return;
    // const res = await dialog.showMessageBox({
    //   type: "info",
    //   title: "提示",
    //   message: "是否要退出？如有运行的进程，则会被强制关闭",
    //   defaultId: 0, // buttons中默认选中的按钮
    //   buttons: ["取消", "直接退出"],
    // });
    // console.log("promise", res);

    // if (res.response == 1) {
    //   app.exit();
    // }
  });
};

app.whenReady().then(() => {
  createWindow(); // 创建窗口
  systemConfig();
  setupIpcHandlers(win);
  // 更新
  // setupAutoUpdater(win);
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });

  new SystemLog();
  creatTray();
});
// 关闭窗口
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

const creatTray = () => {
  const iconPath = isDevelopment
    ? join(app.getAppPath(), "public", "icon.png")
    : join(app.getAppPath(), "dist-electron", "icon.png");
  tray = new Tray(iconPath);
  const contextMenu = Menu.buildFromTemplate([
    {
      label: "显示应用",
      click: () => {
        win.show();
      },
    },
    {
      label: "退出",
      click: () => {
        win.destroy();
      },
    },
  ]);
  tray.setToolTip("bestbot");
  tray.setContextMenu(contextMenu);
  tray.on("click", () => {
    win.show();
  });
};
const systemConfig = () => {
  let config = {
    autoLaunch: false, // 开机自启动
    hideOnClose: false, // 点击退出时是否隐藏到托盘
  };
  // 检查配置文件是否存在，如果不存在则创建
  if (!existsSync(configPath)) {
    writeFileSync(configPath, JSON.stringify(config, null, 2));
  }
  // else{
  //   win.webContents.send("readConfig", readConfig());
  // }
};
const readConfig = () => {
  const data = readFileSync(configPath, "utf-8");
  return JSON.parse(data);
};
