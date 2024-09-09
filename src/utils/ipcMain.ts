import { app, BrowserWindow, ipcMain, Menu, dialog, screen } from "electron";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { spawn } from "child_process";
// import * as fs from "fs";
import { existsSync, writeFileSync } from "fs";
import log from "./log";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
let taskWindow: BrowserWindow | null;
let child: ReturnType<typeof spawn>;
const isDevelopment = process.env.NODE_ENV === "development";
export function setupIpcHandlers(win: BrowserWindow) {
  log.info("初始化ipcMain");
  // 监听初始化启动程序
  ipcMain.on("start", () => {
    let exeFilePath;
    if (isDevelopment) {
      exeFilePath = join(
        app.getAppPath(),
        "dist-electron",
        "exe",
        "BestBot.exe"
      );
    } else {
      exeFilePath = join(process.resourcesPath, "exe", "BestBot.exe");
    }
    log.info(`程序文件: ${existsSync(exeFilePath)}`, "ipcMain");
    if (!existsSync(exeFilePath)) {
      log.error(`文件未找到: ${exeFilePath}`);
      win.webContents.send("reply", { success: false, message: "文件未找到" });
      return;
    }
    const options = {
      detached: true, // 允许子进程在后台运行
    };
    child = spawn(exeFilePath, [], options);
    // child = spawn(exeFilePath);
    child.stdout?.on("data", (_data) => {
      win.webContents.send("reply", { success: true, message: "启动成功" });
    });
    child.stderr?.on("data", (_data) => {
      win.webContents.send("reply", {
        success: false,
        message: "启动成功但存在错误",
      });
    });
    child.on("close", (code) => {
      console.log(`子进程退出码: ${code}`);
    });
    child.on("error", (error) => {
      console.error(`执行错误: ${error}`);
      win.webContents.send("reply", { success: false, message: "启动失败" });
    });
  });
  // 窗口变化
  ipcMain.on("changWindowSize", (_e, { width, height, maximize = false }) => {
    if (win) {
      if (maximize) {
        win.maximize();
      } else {
        win.unmaximize();
        win.setSize(width, height);
      }
    }
  });
  // 执行任务
  ipcMain.on("runTask", () => {
    if (win) {
      if (!win.isMinimized()) {
        win.minimize();
      }
    }
    if (taskWindow) {
      taskWindow.close();
      taskWindow = null;
    }
    createTaskWindow();
  });
  ipcMain.on("closeTask", () => {
    if (taskWindow) {
      taskWindow.close();
      taskWindow = null;
    }
    if (win) {
      if (win.isMinimized()) {
        win.restore();
      }
    }
  });
  ipcMain.on("updateConfig", (event, newConfig) => {
    const configPath = join(app.getPath("userData"), "best_bot_config.json");
    writeFileSync(configPath, JSON.stringify(newConfig, null, 2));
    // event.reply('config-updated', config);
    app.setLoginItemSettings({ openAtLogin: newConfig.autoLaunch });
  });
  // 打开文件
  ipcMain.handle("openFile", async (_event) => {
    const res = await dialog.showOpenDialog(win, {
      properties: ["openFile"],
      filters: [{ name: "All Files", extensions: ["*"] }],
    });
    return res.filePaths[0];
  });
}

const createTaskWindow = () => {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  console.log('width',width,height)
  taskWindow = new BrowserWindow({
    width: 364,
    height: 140,
    frame: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    transparent: true,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
    },
  });
  taskWindow.setBounds({
    x: width - 400,
    y: height - 220,
    width: 364,
    height: 140,
  });
  if (!isDevelopment) {
    taskWindow.loadFile(join(__dirname, "./index.html"), { hash: "/task" });
    // 取消顶部菜单
    Menu.setApplicationMenu(null);
  } else {
    let url = "http://localhost:8080/#/task";
    taskWindow.loadURL(url);
  }
};
