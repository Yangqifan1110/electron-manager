import { autoUpdater } from "electron-updater";
import { ipcMain, BrowserWindow } from "electron";
import { join } from "path";
import fs from "fs";
import log from "./log";
import { UPDATE_STATUS } from "./index.enum";
const isDevelopment = process.env.NODE_ENV === "development";
let mainWin: BrowserWindow;
export const setupAutoUpdater = (win: BrowserWindow) => {
  mainWin = win;
  //我们的软件发布地址
  const url = isDevelopment ? "http://localhost:3003" : "http://localhost:3003";

  // let yaml = "";
  // let appName = "BestBot";
  // yaml += "provider: generic\n";
  // yaml += "url: http://localhost:3003\n";
  // yaml += "useMultipleRangeRequest: false\n";
  // yaml += "channel: latest\n";
  // yaml += "updaterCacheDirName: " + appName;

  // let update_file = [join(process.resourcesPath, "app-update.yml"), yaml];
  // let dev_update_file = [
  //   join(process.resourcesPath, "dev-app-update.yml"),
  //   yaml,
  // ];
  // let chechFiles = [update_file, dev_update_file];

  // for (let file of chechFiles) {
  //   if (!fs.existsSync(file[0])) {
  //     fs.writeFileSync(file[0], file[1], () => {});
  //   }
  // }
  try {
    autoUpdater.setFeedURL(url);
    autoUpdater.autoDownload = false;
    // 渲染进程获取更新
    ipcMain.on("checkForUpdates", () => {
      autoUpdater.checkForUpdates();
    });
    // 更新错误
    autoUpdater.on("error", (e) => {
      log.error(`更新错误:${e}`, "update");
      printUpdaterMessage(UPDATE_STATUS.ERROR);
    });
    // 检查是否有更新
    autoUpdater.on("checking-for-update", () => {
      printUpdaterMessage(UPDATE_STATUS.CHECKING);
    });
    //   有更新
    autoUpdater.on("update-available", () => {
      printUpdaterMessage(UPDATE_STATUS.UPDATE_AVAILABLE);
    });
    // 无更新
    autoUpdater.on("update-not-available", () => {
      printUpdaterMessage(UPDATE_STATUS.UPDATE_NOT_AVAILABLE);
    });

    // 下载进度
    autoUpdater.on("download-progress", (e) => {
      printUpdaterMessage(UPDATE_STATUS.DOWNLOAD_PROGRESS, e);
    });
    //   确认更新开始更新
    ipcMain.on("comfirmUpdate", () => {
      autoUpdater.downloadUpdate();
    });
    //   下载完成
    autoUpdater.on("update-downloaded", (info) => {
      log.info(info.downloadedFile, "update");
      printUpdaterMessage(UPDATE_STATUS.UPDATE_DOWNLOADED);
      ipcMain.on("installNow", () => {
        autoUpdater.quitAndInstall();
      });
    });
  } catch (error) {
    log.error(`设置自动更新器时出错: ${error}`, "update");
    printUpdaterMessage(UPDATE_STATUS.ERROR);
  }
};
function printUpdaterMessage(type: string, arg?: any) {
  mainWin.webContents.send("updateMessage", {
    type,
    arg,
  });
}
