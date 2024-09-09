import { app } from "electron";
import log from "./log";

export class SystemLog {
  constructor() {
    this.init();
  }

  init() {
    log.info('日志初始化')
    // 子进程结束
    app.on("child-process-gone", (event, details) => {
      log.error(
        `APP-ERROR:GPU进程或子进程结束; event: ${JSON.stringify(
          event
        )}; details:${JSON.stringify(details)}`,
        "main"
      );
    });

    // 渲染进程结束
    app.on("render-process-gone", (event, webContents, details) => {
      log.error(
        `APP-ERROR:渲染进程结束; event: ${JSON.stringify(
          event
        )}; webContents:${JSON.stringify(
          webContents
        )}; details:${JSON.stringify(details)}`,
        "main"
      );
    });
  }
}
