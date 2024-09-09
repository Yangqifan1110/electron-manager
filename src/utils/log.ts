import logger from "electron-log";
import path from "path";
logger.transports.file.level = "debug";
logger.transports.file.maxSize = 10 * 1024 * 1024;
logger.transports.file.format =
  "[{y}-{m}-{d} {h}:{i}:{s}] [{level}] [{scope}] {text}";
const date = new Date();
const currentDate = `${date.getFullYear()}-${
  date.getMonth() + 1
}-${date.getDate()}`;
logger.transports.file.resolvePathFn = () =>
  path.join("C:", "botLogs", `${currentDate}.log`);
export default {
  info(param: string, scope: string = "main") {
    logger.scope(scope).info(param);
  },
  warn(param: string, scope: string = "main") {
    logger.scope(scope).warn(param);
  },
  error(param: string, scope: string = "main") {
    logger.scope(scope).error(param);
  },
  debug(param: string, scope: string = "main") {
    logger.scope(scope).debug(param);
  },
  silly(param: string, scope: string = "main") {
    logger.scope(scope).silly(param);
  },
  verbose(param: string, scope: string = "main") {
    logger.scope(scope).verbose(param);
  },
};
