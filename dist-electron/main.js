"use strict";
var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
const require$$0$5 = require("electron");
const url = require("url");
const require$$2 = require("path");
const require$$0 = require("fs");
const require$$0$1 = require("child_process");
const require$$1 = require("os");
const require$$0$2 = require("util");
const require$$0$3 = require("events");
const require$$0$4 = require("http");
const require$$1$1 = require("https");
var _documentCurrentScript = typeof document !== "undefined" ? document.currentScript : null;
function getDefaultExportFromCjs(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
}
var src = { exports: {} };
var electronLogPreload = { exports: {} };
var hasRequiredElectronLogPreload;
function requireElectronLogPreload() {
  if (hasRequiredElectronLogPreload)
    return electronLogPreload.exports;
  hasRequiredElectronLogPreload = 1;
  (function(module2) {
    let electron = {};
    try {
      electron = require("electron");
    } catch (e) {
    }
    if (electron.ipcRenderer) {
      initialize2(electron);
    }
    {
      module2.exports = initialize2;
    }
    function initialize2({ contextBridge, ipcRenderer }) {
      if (!ipcRenderer) {
        return;
      }
      ipcRenderer.on("__ELECTRON_LOG_IPC__", (_, message) => {
        window.postMessage({ cmd: "message", ...message });
      });
      ipcRenderer.invoke("__ELECTRON_LOG__", { cmd: "getOptions" }).catch((e) => console.error(new Error(
        `electron-log isn't initialized in the main process. Please call log.initialize() before. ${e.message}`
      )));
      const electronLog = {
        sendToMain(message) {
          try {
            ipcRenderer.send("__ELECTRON_LOG__", message);
          } catch (e) {
            console.error("electronLog.sendToMain ", e, "data:", message);
            ipcRenderer.send("__ELECTRON_LOG__", {
              cmd: "errorHandler",
              error: { message: e == null ? void 0 : e.message, stack: e == null ? void 0 : e.stack },
              errorName: "sendToMain"
            });
          }
        },
        log(...data) {
          electronLog.sendToMain({ data, level: "info" });
        }
      };
      for (const level of ["error", "warn", "info", "verbose", "debug", "silly"]) {
        electronLog[level] = (...data) => electronLog.sendToMain({
          data,
          level
        });
      }
      if (contextBridge && process.contextIsolated) {
        try {
          contextBridge.exposeInMainWorld("__electronLog", electronLog);
        } catch {
        }
      }
      if (typeof window === "object") {
        window.__electronLog = electronLog;
      } else {
        __electronLog = electronLog;
      }
    }
  })(electronLogPreload);
  return electronLogPreload.exports;
}
var renderer = { exports: {} };
var scope;
var hasRequiredScope;
function requireScope() {
  if (hasRequiredScope)
    return scope;
  hasRequiredScope = 1;
  scope = scopeFactory;
  function scopeFactory(logger2) {
    return Object.defineProperties(scope2, {
      defaultLabel: { value: "", writable: true },
      labelPadding: { value: true, writable: true },
      maxLabelLength: { value: 0, writable: true },
      labelLength: {
        get() {
          switch (typeof scope2.labelPadding) {
            case "boolean":
              return scope2.labelPadding ? scope2.maxLabelLength : 0;
            case "number":
              return scope2.labelPadding;
            default:
              return 0;
          }
        }
      }
    });
    function scope2(label) {
      scope2.maxLabelLength = Math.max(scope2.maxLabelLength, label.length);
      const newScope = {};
      for (const level of [...logger2.levels, "log"]) {
        newScope[level] = (...d) => logger2.logData(d, { level, scope: label });
      }
      return newScope;
    }
  }
  return scope;
}
var Logger_1;
var hasRequiredLogger;
function requireLogger() {
  if (hasRequiredLogger)
    return Logger_1;
  hasRequiredLogger = 1;
  const scopeFactory = requireScope();
  const _Logger = class _Logger {
    constructor({
      allowUnknownLevel = false,
      dependencies = {},
      errorHandler,
      eventLogger,
      initializeFn,
      isDev = false,
      levels = ["error", "warn", "info", "verbose", "debug", "silly"],
      logId,
      transportFactories = {},
      variables
    } = {}) {
      __publicField(this, "dependencies", {});
      __publicField(this, "errorHandler", null);
      __publicField(this, "eventLogger", null);
      __publicField(this, "functions", {});
      __publicField(this, "hooks", []);
      __publicField(this, "isDev", false);
      __publicField(this, "levels", null);
      __publicField(this, "logId", null);
      __publicField(this, "scope", null);
      __publicField(this, "transports", {});
      __publicField(this, "variables", {});
      this.addLevel = this.addLevel.bind(this);
      this.create = this.create.bind(this);
      this.initialize = this.initialize.bind(this);
      this.logData = this.logData.bind(this);
      this.processMessage = this.processMessage.bind(this);
      this.allowUnknownLevel = allowUnknownLevel;
      this.dependencies = dependencies;
      this.initializeFn = initializeFn;
      this.isDev = isDev;
      this.levels = levels;
      this.logId = logId;
      this.transportFactories = transportFactories;
      this.variables = variables || {};
      this.scope = scopeFactory(this);
      this.addLevel("log", false);
      for (const name of this.levels) {
        this.addLevel(name, false);
      }
      this.errorHandler = errorHandler;
      errorHandler == null ? void 0 : errorHandler.setOptions({ ...dependencies, logFn: this.error });
      this.eventLogger = eventLogger;
      eventLogger == null ? void 0 : eventLogger.setOptions({ ...dependencies, logger: this });
      for (const [name, factory] of Object.entries(transportFactories)) {
        this.transports[name] = factory(this, dependencies);
      }
      _Logger.instances[logId] = this;
    }
    static getInstance({ logId }) {
      return this.instances[logId] || this.instances.default;
    }
    addLevel(level, index = this.levels.length) {
      if (index !== false) {
        this.levels.splice(index, 0, level);
      }
      this[level] = (...args) => this.logData(args, { level });
      this.functions[level] = this[level];
    }
    catchErrors(options) {
      this.processMessage(
        {
          data: ["log.catchErrors is deprecated. Use log.errorHandler instead"],
          level: "warn"
        },
        { transports: ["console"] }
      );
      return this.errorHandler.startCatching(options);
    }
    create(options) {
      if (typeof options === "string") {
        options = { logId: options };
      }
      return new _Logger({
        dependencies: this.dependencies,
        errorHandler: this.errorHandler,
        initializeFn: this.initializeFn,
        isDev: this.isDev,
        transportFactories: this.transportFactories,
        variables: { ...this.variables },
        ...options
      });
    }
    compareLevels(passLevel, checkLevel, levels = this.levels) {
      const pass = levels.indexOf(passLevel);
      const check = levels.indexOf(checkLevel);
      if (check === -1 || pass === -1) {
        return true;
      }
      return check <= pass;
    }
    initialize(options = {}) {
      this.initializeFn({ logger: this, ...this.dependencies, ...options });
    }
    logData(data, options = {}) {
      this.processMessage({ data, ...options });
    }
    processMessage(message, { transports = this.transports } = {}) {
      if (message.cmd === "errorHandler") {
        this.errorHandler.handle(message.error, {
          errorName: message.errorName,
          processType: "renderer",
          showDialog: Boolean(message.showDialog)
        });
        return;
      }
      let level = message.level;
      if (!this.allowUnknownLevel) {
        level = this.levels.includes(message.level) ? message.level : "info";
      }
      const normalizedMessage = {
        date: /* @__PURE__ */ new Date(),
        ...message,
        level,
        variables: {
          ...this.variables,
          ...message.variables
        }
      };
      for (const [transName, transFn] of this.transportEntries(transports)) {
        if (typeof transFn !== "function" || transFn.level === false) {
          continue;
        }
        if (!this.compareLevels(transFn.level, message.level)) {
          continue;
        }
        try {
          const transformedMsg = this.hooks.reduce((msg, hook) => {
            return msg ? hook(msg, transFn, transName) : msg;
          }, normalizedMessage);
          if (transformedMsg) {
            transFn({ ...transformedMsg, data: [...transformedMsg.data] });
          }
        } catch (e) {
          this.processInternalErrorFn(e);
        }
      }
    }
    processInternalErrorFn(_e) {
    }
    transportEntries(transports = this.transports) {
      const transportArray = Array.isArray(transports) ? transports : Object.entries(transports);
      return transportArray.map((item) => {
        switch (typeof item) {
          case "string":
            return this.transports[item] ? [item, this.transports[item]] : null;
          case "function":
            return [item.name, item];
          default:
            return Array.isArray(item) ? item : null;
        }
      }).filter(Boolean);
    }
  };
  __publicField(_Logger, "instances", {});
  let Logger = _Logger;
  Logger_1 = Logger;
  return Logger_1;
}
var RendererErrorHandler_1;
var hasRequiredRendererErrorHandler;
function requireRendererErrorHandler() {
  if (hasRequiredRendererErrorHandler)
    return RendererErrorHandler_1;
  hasRequiredRendererErrorHandler = 1;
  const consoleError = console.error;
  class RendererErrorHandler {
    constructor({ logFn = null } = {}) {
      __publicField(this, "logFn", null);
      __publicField(this, "onError", null);
      __publicField(this, "showDialog", false);
      __publicField(this, "preventDefault", true);
      this.handleError = this.handleError.bind(this);
      this.handleRejection = this.handleRejection.bind(this);
      this.startCatching = this.startCatching.bind(this);
      this.logFn = logFn;
    }
    handle(error, {
      logFn = this.logFn,
      errorName = "",
      onError = this.onError,
      showDialog = this.showDialog
    } = {}) {
      try {
        if ((onError == null ? void 0 : onError({ error, errorName, processType: "renderer" })) !== false) {
          logFn({ error, errorName, showDialog });
        }
      } catch {
        consoleError(error);
      }
    }
    setOptions({ logFn, onError, preventDefault, showDialog }) {
      if (typeof logFn === "function") {
        this.logFn = logFn;
      }
      if (typeof onError === "function") {
        this.onError = onError;
      }
      if (typeof preventDefault === "boolean") {
        this.preventDefault = preventDefault;
      }
      if (typeof showDialog === "boolean") {
        this.showDialog = showDialog;
      }
    }
    startCatching({ onError, showDialog } = {}) {
      if (this.isActive) {
        return;
      }
      this.isActive = true;
      this.setOptions({ onError, showDialog });
      window.addEventListener("error", (event) => {
        var _a;
        this.preventDefault && ((_a = event.preventDefault) == null ? void 0 : _a.call(event));
        this.handleError(event.error || event);
      });
      window.addEventListener("unhandledrejection", (event) => {
        var _a;
        this.preventDefault && ((_a = event.preventDefault) == null ? void 0 : _a.call(event));
        this.handleRejection(event.reason || event);
      });
    }
    handleError(error) {
      this.handle(error, { errorName: "Unhandled" });
    }
    handleRejection(reason) {
      const error = reason instanceof Error ? reason : new Error(JSON.stringify(reason));
      this.handle(error, { errorName: "Unhandled rejection" });
    }
  }
  RendererErrorHandler_1 = RendererErrorHandler;
  return RendererErrorHandler_1;
}
var console_1$1;
var hasRequiredConsole$1;
function requireConsole$1() {
  if (hasRequiredConsole$1)
    return console_1$1;
  hasRequiredConsole$1 = 1;
  console_1$1 = consoleTransportRendererFactory;
  const consoleMethods = {
    error: console.error,
    warn: console.warn,
    info: console.info,
    verbose: console.info,
    debug: console.debug,
    silly: console.debug,
    log: console.log
  };
  function consoleTransportRendererFactory(logger2) {
    return Object.assign(transport, {
      format: "{h}:{i}:{s}.{ms}{scope} › {text}",
      formatDataFn({
        data = [],
        date: date2 = /* @__PURE__ */ new Date(),
        format: format2 = transport.format,
        logId = logger2.logId,
        scope: scope2 = logger2.scopeName,
        ...message
      }) {
        if (typeof format2 === "function") {
          return format2({ ...message, data, date: date2, logId, scope: scope2 });
        }
        if (typeof format2 !== "string") {
          return data;
        }
        data.unshift(format2);
        if (typeof data[1] === "string" && data[1].match(/%[1cdfiOos]/)) {
          data = [`${data[0]} ${data[1]}`, ...data.slice(2)];
        }
        data[0] = data[0].replace(/\{(\w+)}/g, (substring, name) => {
          var _a;
          switch (name) {
            case "level":
              return message.level;
            case "logId":
              return logId;
            case "scope":
              return scope2 ? ` (${scope2})` : "";
            case "text":
              return "";
            case "y":
              return date2.getFullYear().toString(10);
            case "m":
              return (date2.getMonth() + 1).toString(10).padStart(2, "0");
            case "d":
              return date2.getDate().toString(10).padStart(2, "0");
            case "h":
              return date2.getHours().toString(10).padStart(2, "0");
            case "i":
              return date2.getMinutes().toString(10).padStart(2, "0");
            case "s":
              return date2.getSeconds().toString(10).padStart(2, "0");
            case "ms":
              return date2.getMilliseconds().toString(10).padStart(3, "0");
            case "iso":
              return date2.toISOString();
            default: {
              return ((_a = message.variables) == null ? void 0 : _a[name]) || substring;
            }
          }
        }).trim();
        return data;
      },
      writeFn({ message: { level, data } }) {
        const consoleLogFn = consoleMethods[level] || consoleMethods.info;
        setTimeout(() => consoleLogFn(...data));
      }
    });
    function transport(message) {
      transport.writeFn({
        message: { ...message, data: transport.formatDataFn(message) }
      });
    }
  }
  return console_1$1;
}
var ipc$1;
var hasRequiredIpc$1;
function requireIpc$1() {
  if (hasRequiredIpc$1)
    return ipc$1;
  hasRequiredIpc$1 = 1;
  ipc$1 = ipcTransportRendererFactory;
  const RESTRICTED_TYPES = /* @__PURE__ */ new Set([Promise, WeakMap, WeakSet]);
  function ipcTransportRendererFactory(logger2) {
    return Object.assign(transport, {
      depth: 5,
      serializeFn(data, { depth = 5, seen = /* @__PURE__ */ new WeakSet() } = {}) {
        if (seen.has(data)) {
          return "[Circular]";
        }
        if (depth < 1) {
          if (isPrimitive(data)) {
            return data;
          }
          if (Array.isArray(data)) {
            return "[Array]";
          }
          return `[${typeof data}]`;
        }
        if (["function", "symbol"].includes(typeof data)) {
          return data.toString();
        }
        if (isPrimitive(data)) {
          return data;
        }
        if (RESTRICTED_TYPES.has(data.constructor)) {
          return `[${data.constructor.name}]`;
        }
        if (Array.isArray(data)) {
          return data.map((item) => transport.serializeFn(
            item,
            { depth: depth - 1, seen }
          ));
        }
        if (data instanceof Date) {
          return data.toISOString();
        }
        if (data instanceof Error) {
          return data.stack;
        }
        if (data instanceof Map) {
          return new Map(
            Array.from(data).map(([key, value]) => [
              transport.serializeFn(key, { depth: depth - 1, seen }),
              transport.serializeFn(value, { depth: depth - 1, seen })
            ])
          );
        }
        if (data instanceof Set) {
          return new Set(
            Array.from(data).map(
              (val) => transport.serializeFn(val, { depth: depth - 1, seen })
            )
          );
        }
        seen.add(data);
        return Object.fromEntries(
          Object.entries(data).map(
            ([key, value]) => [
              key,
              transport.serializeFn(value, { depth: depth - 1, seen })
            ]
          )
        );
      }
    });
    function transport(message) {
      if (!window.__electronLog) {
        logger2.processMessage(
          {
            data: ["electron-log: logger isn't initialized in the main process"],
            level: "error"
          },
          { transports: ["console"] }
        );
        return;
      }
      try {
        __electronLog.sendToMain(transport.serializeFn(message, {
          depth: transport.depth
        }));
      } catch (e) {
        logger2.transports.console({
          data: ["electronLog.transports.ipc", e, "data:", message.data],
          level: "error"
        });
      }
    }
  }
  function isPrimitive(value) {
    return Object(value) !== value;
  }
  return ipc$1;
}
var hasRequiredRenderer;
function requireRenderer() {
  if (hasRequiredRenderer)
    return renderer.exports;
  hasRequiredRenderer = 1;
  (function(module2) {
    const Logger = requireLogger();
    const RendererErrorHandler = requireRendererErrorHandler();
    const transportConsole = requireConsole$1();
    const transportIpc = requireIpc$1();
    module2.exports = createLogger();
    module2.exports.Logger = Logger;
    module2.exports.default = module2.exports;
    function createLogger() {
      const logger2 = new Logger({
        allowUnknownLevel: true,
        errorHandler: new RendererErrorHandler(),
        initializeFn: () => {
        },
        logId: "default",
        transportFactories: {
          console: transportConsole,
          ipc: transportIpc
        },
        variables: {
          processType: "renderer"
        }
      });
      logger2.errorHandler.setOptions({
        logFn({ error, errorName, showDialog }) {
          logger2.transports.console({
            data: [errorName, error].filter(Boolean),
            level: "error"
          });
          logger2.transports.ipc({
            cmd: "errorHandler",
            error: {
              cause: error == null ? void 0 : error.cause,
              code: error == null ? void 0 : error.code,
              name: error == null ? void 0 : error.name,
              message: error == null ? void 0 : error.message,
              stack: error == null ? void 0 : error.stack
            },
            errorName,
            logId: logger2.logId,
            showDialog
          });
        }
      });
      if (typeof window === "object") {
        window.addEventListener("message", (event) => {
          const { cmd, logId, ...message } = event.data || {};
          const instance = Logger.getInstance({ logId });
          if (cmd === "message") {
            instance.processMessage(message, { transports: ["console"] });
          }
        });
      }
      return new Proxy(logger2, {
        get(target, prop) {
          if (typeof target[prop] !== "undefined") {
            return target[prop];
          }
          return (...data) => logger2.logData(data, { level: prop });
        }
      });
    }
  })(renderer);
  return renderer.exports;
}
var packageJson;
var hasRequiredPackageJson;
function requirePackageJson() {
  if (hasRequiredPackageJson)
    return packageJson;
  hasRequiredPackageJson = 1;
  const fs = require$$0;
  const path = require$$2;
  packageJson = {
    findAndReadPackageJson,
    tryReadJsonAt
  };
  function findAndReadPackageJson() {
    return tryReadJsonAt(getMainModulePath()) || tryReadJsonAt(extractPathFromArgs()) || tryReadJsonAt(process.resourcesPath, "app.asar") || tryReadJsonAt(process.resourcesPath, "app") || tryReadJsonAt(process.cwd()) || { name: void 0, version: void 0 };
  }
  function tryReadJsonAt(...searchPaths) {
    if (!searchPaths[0]) {
      return void 0;
    }
    try {
      const searchPath = path.join(...searchPaths);
      const fileName = findUp("package.json", searchPath);
      if (!fileName) {
        return void 0;
      }
      const json = JSON.parse(fs.readFileSync(fileName, "utf8"));
      const name = (json == null ? void 0 : json.productName) || (json == null ? void 0 : json.name);
      if (!name || name.toLowerCase() === "electron") {
        return void 0;
      }
      if (name) {
        return { name, version: json == null ? void 0 : json.version };
      }
      return void 0;
    } catch (e) {
      return void 0;
    }
  }
  function findUp(fileName, cwd) {
    let currentPath = cwd;
    while (true) {
      const parsedPath = path.parse(currentPath);
      const root = parsedPath.root;
      const dir = parsedPath.dir;
      if (fs.existsSync(path.join(currentPath, fileName))) {
        return path.resolve(path.join(currentPath, fileName));
      }
      if (currentPath === root) {
        return null;
      }
      currentPath = dir;
    }
  }
  function extractPathFromArgs() {
    const matchedArgs = process.argv.filter((arg) => {
      return arg.indexOf("--user-data-dir=") === 0;
    });
    if (matchedArgs.length === 0 || typeof matchedArgs[0] !== "string") {
      return null;
    }
    const userDataDir = matchedArgs[0];
    return userDataDir.replace("--user-data-dir=", "");
  }
  function getMainModulePath() {
    var _a;
    try {
      return (_a = require.main) == null ? void 0 : _a.filename;
    } catch {
      return void 0;
    }
  }
  return packageJson;
}
var NodeExternalApi_1;
var hasRequiredNodeExternalApi;
function requireNodeExternalApi() {
  if (hasRequiredNodeExternalApi)
    return NodeExternalApi_1;
  hasRequiredNodeExternalApi = 1;
  const childProcess = require$$0$1;
  const os = require$$1;
  const path = require$$2;
  const packageJson2 = requirePackageJson();
  class NodeExternalApi {
    constructor() {
      __publicField(this, "appName");
      __publicField(this, "appPackageJson");
      __publicField(this, "platform", process.platform);
    }
    getAppLogPath(appName = this.getAppName()) {
      if (this.platform === "darwin") {
        return path.join(this.getSystemPathHome(), "Library/Logs", appName);
      }
      return path.join(this.getAppUserDataPath(appName), "logs");
    }
    getAppName() {
      var _a;
      const appName = this.appName || ((_a = this.getAppPackageJson()) == null ? void 0 : _a.name);
      if (!appName) {
        throw new Error(
          "electron-log can't determine the app name. It tried these methods:\n1. Use `electron.app.name`\n2. Use productName or name from the nearest package.json`\nYou can also set it through log.transports.file.setAppName()"
        );
      }
      return appName;
    }
    /**
     * @private
     * @returns {undefined}
     */
    getAppPackageJson() {
      if (typeof this.appPackageJson !== "object") {
        this.appPackageJson = packageJson2.findAndReadPackageJson();
      }
      return this.appPackageJson;
    }
    getAppUserDataPath(appName = this.getAppName()) {
      return appName ? path.join(this.getSystemPathAppData(), appName) : void 0;
    }
    getAppVersion() {
      var _a;
      return (_a = this.getAppPackageJson()) == null ? void 0 : _a.version;
    }
    getElectronLogPath() {
      return this.getAppLogPath();
    }
    getMacOsVersion() {
      const release = Number(os.release().split(".")[0]);
      if (release <= 19) {
        return `10.${release - 4}`;
      }
      return release - 9;
    }
    /**
     * @protected
     * @returns {string}
     */
    getOsVersion() {
      let osName = os.type().replace("_", " ");
      let osVersion = os.release();
      if (osName === "Darwin") {
        osName = "macOS";
        osVersion = this.getMacOsVersion();
      }
      return `${osName} ${osVersion}`;
    }
    /**
     * @return {PathVariables}
     */
    getPathVariables() {
      const appName = this.getAppName();
      const appVersion = this.getAppVersion();
      const self = this;
      return {
        appData: this.getSystemPathAppData(),
        appName,
        appVersion,
        get electronDefaultDir() {
          return self.getElectronLogPath();
        },
        home: this.getSystemPathHome(),
        libraryDefaultDir: this.getAppLogPath(appName),
        libraryTemplate: this.getAppLogPath("{appName}"),
        temp: this.getSystemPathTemp(),
        userData: this.getAppUserDataPath(appName)
      };
    }
    getSystemPathAppData() {
      const home = this.getSystemPathHome();
      switch (this.platform) {
        case "darwin": {
          return path.join(home, "Library/Application Support");
        }
        case "win32": {
          return process.env.APPDATA || path.join(home, "AppData/Roaming");
        }
        default: {
          return process.env.XDG_CONFIG_HOME || path.join(home, ".config");
        }
      }
    }
    getSystemPathHome() {
      var _a;
      return ((_a = os.homedir) == null ? void 0 : _a.call(os)) || process.env.HOME;
    }
    getSystemPathTemp() {
      return os.tmpdir();
    }
    getVersions() {
      return {
        app: `${this.getAppName()} ${this.getAppVersion()}`,
        electron: void 0,
        os: this.getOsVersion()
      };
    }
    isDev() {
      return process.env.NODE_ENV === "development" || process.env.ELECTRON_IS_DEV === "1";
    }
    isElectron() {
      return Boolean(process.versions.electron);
    }
    onAppEvent(_eventName, _handler) {
    }
    onAppReady(handler) {
      handler();
    }
    onEveryWebContentsEvent(eventName, handler) {
    }
    /**
     * Listen to async messages sent from opposite process
     * @param {string} channel
     * @param {function} listener
     */
    onIpc(channel, listener) {
    }
    onIpcInvoke(channel, listener) {
    }
    /**
     * @param {string} url
     * @param {Function} [logFunction]
     */
    openUrl(url2, logFunction = console.error) {
      const startMap = { darwin: "open", win32: "start", linux: "xdg-open" };
      const start = startMap[process.platform] || "xdg-open";
      childProcess.exec(`${start} ${url2}`, {}, (err) => {
        if (err) {
          logFunction(err);
        }
      });
    }
    setAppName(appName) {
      this.appName = appName;
    }
    setPlatform(platform) {
      this.platform = platform;
    }
    setPreloadFileForSessions({
      filePath,
      // eslint-disable-line no-unused-vars
      includeFutureSession = true,
      // eslint-disable-line no-unused-vars
      getSessions = () => []
      // eslint-disable-line no-unused-vars
    }) {
    }
    /**
     * Sent a message to opposite process
     * @param {string} channel
     * @param {any} message
     */
    sendIpc(channel, message) {
    }
    showErrorBox(title, message) {
    }
  }
  NodeExternalApi_1 = NodeExternalApi;
  return NodeExternalApi_1;
}
var ElectronExternalApi_1;
var hasRequiredElectronExternalApi;
function requireElectronExternalApi() {
  if (hasRequiredElectronExternalApi)
    return ElectronExternalApi_1;
  hasRequiredElectronExternalApi = 1;
  const path = require$$2;
  const NodeExternalApi = requireNodeExternalApi();
  class ElectronExternalApi extends NodeExternalApi {
    /**
     * @param {object} options
     * @param {typeof Electron} [options.electron]
     */
    constructor({ electron } = {}) {
      super();
      /**
       * @type {typeof Electron}
       */
      __publicField(this, "electron");
      this.electron = electron;
    }
    getAppName() {
      var _a, _b;
      let appName;
      try {
        appName = this.appName || ((_a = this.electron.app) == null ? void 0 : _a.name) || ((_b = this.electron.app) == null ? void 0 : _b.getName());
      } catch {
      }
      return appName || super.getAppName();
    }
    getAppUserDataPath(appName) {
      return this.getPath("userData") || super.getAppUserDataPath(appName);
    }
    getAppVersion() {
      var _a;
      let appVersion;
      try {
        appVersion = (_a = this.electron.app) == null ? void 0 : _a.getVersion();
      } catch {
      }
      return appVersion || super.getAppVersion();
    }
    getElectronLogPath() {
      return this.getPath("logs") || super.getElectronLogPath();
    }
    /**
     * @private
     * @param {any} name
     * @returns {string|undefined}
     */
    getPath(name) {
      var _a;
      try {
        return (_a = this.electron.app) == null ? void 0 : _a.getPath(name);
      } catch {
        return void 0;
      }
    }
    getVersions() {
      return {
        app: `${this.getAppName()} ${this.getAppVersion()}`,
        electron: `Electron ${process.versions.electron}`,
        os: this.getOsVersion()
      };
    }
    getSystemPathAppData() {
      return this.getPath("appData") || super.getSystemPathAppData();
    }
    isDev() {
      var _a;
      if (((_a = this.electron.app) == null ? void 0 : _a.isPackaged) !== void 0) {
        return !this.electron.app.isPackaged;
      }
      if (typeof process.execPath === "string") {
        const execFileName = path.basename(process.execPath).toLowerCase();
        return execFileName.startsWith("electron");
      }
      return super.isDev();
    }
    onAppEvent(eventName, handler) {
      var _a;
      (_a = this.electron.app) == null ? void 0 : _a.on(eventName, handler);
      return () => {
        var _a2;
        (_a2 = this.electron.app) == null ? void 0 : _a2.off(eventName, handler);
      };
    }
    onAppReady(handler) {
      var _a, _b, _c;
      if ((_a = this.electron.app) == null ? void 0 : _a.isReady()) {
        handler();
      } else if ((_b = this.electron.app) == null ? void 0 : _b.once) {
        (_c = this.electron.app) == null ? void 0 : _c.once("ready", handler);
      } else {
        handler();
      }
    }
    onEveryWebContentsEvent(eventName, handler) {
      var _a, _b, _c;
      (_b = (_a = this.electron.webContents) == null ? void 0 : _a.getAllWebContents()) == null ? void 0 : _b.forEach((webContents) => {
        webContents.on(eventName, handler);
      });
      (_c = this.electron.app) == null ? void 0 : _c.on("web-contents-created", onWebContentsCreated);
      return () => {
        var _a2, _b2;
        (_a2 = this.electron.webContents) == null ? void 0 : _a2.getAllWebContents().forEach((webContents) => {
          webContents.off(eventName, handler);
        });
        (_b2 = this.electron.app) == null ? void 0 : _b2.off("web-contents-created", onWebContentsCreated);
      };
      function onWebContentsCreated(_, webContents) {
        webContents.on(eventName, handler);
      }
    }
    /**
     * Listen to async messages sent from opposite process
     * @param {string} channel
     * @param {function} listener
     */
    onIpc(channel, listener) {
      var _a;
      (_a = this.electron.ipcMain) == null ? void 0 : _a.on(channel, listener);
    }
    onIpcInvoke(channel, listener) {
      var _a, _b;
      (_b = (_a = this.electron.ipcMain) == null ? void 0 : _a.handle) == null ? void 0 : _b.call(_a, channel, listener);
    }
    /**
     * @param {string} url
     * @param {Function} [logFunction]
     */
    openUrl(url2, logFunction = console.error) {
      var _a;
      (_a = this.electron.shell) == null ? void 0 : _a.openExternal(url2).catch(logFunction);
    }
    setPreloadFileForSessions({
      filePath,
      includeFutureSession = true,
      getSessions = () => {
        var _a;
        return [(_a = this.electron.session) == null ? void 0 : _a.defaultSession];
      }
    }) {
      for (const session of getSessions().filter(Boolean)) {
        setPreload(session);
      }
      if (includeFutureSession) {
        this.onAppEvent("session-created", (session) => {
          setPreload(session);
        });
      }
      function setPreload(session) {
        session.setPreloads([...session.getPreloads(), filePath]);
      }
    }
    /**
     * Sent a message to opposite process
     * @param {string} channel
     * @param {any} message
     */
    sendIpc(channel, message) {
      var _a, _b;
      (_b = (_a = this.electron.BrowserWindow) == null ? void 0 : _a.getAllWindows()) == null ? void 0 : _b.forEach((wnd) => {
        var _a2;
        if (((_a2 = wnd.webContents) == null ? void 0 : _a2.isDestroyed()) === false) {
          wnd.webContents.send(channel, message);
        }
      });
    }
    showErrorBox(title, message) {
      var _a;
      (_a = this.electron.dialog) == null ? void 0 : _a.showErrorBox(title, message);
    }
  }
  ElectronExternalApi_1 = ElectronExternalApi;
  return ElectronExternalApi_1;
}
var initialize;
var hasRequiredInitialize;
function requireInitialize() {
  if (hasRequiredInitialize)
    return initialize;
  hasRequiredInitialize = 1;
  const fs = require$$0;
  const os = require$$1;
  const path = require$$2;
  const preloadInitializeFn = requireElectronLogPreload();
  initialize = {
    initialize({
      externalApi,
      getSessions,
      includeFutureSession,
      logger: logger2,
      preload = true,
      spyRendererConsole = false
    }) {
      externalApi.onAppReady(() => {
        try {
          if (preload) {
            initializePreload({
              externalApi,
              getSessions,
              includeFutureSession,
              preloadOption: preload
            });
          }
          if (spyRendererConsole) {
            initializeSpyRendererConsole({ externalApi, logger: logger2 });
          }
        } catch (err) {
          logger2.warn(err);
        }
      });
    }
  };
  function initializePreload({
    externalApi,
    getSessions,
    includeFutureSession,
    preloadOption
  }) {
    let preloadPath = typeof preloadOption === "string" ? preloadOption : void 0;
    try {
      preloadPath = path.resolve(
        __dirname,
        "../renderer/electron-log-preload.js"
      );
    } catch {
    }
    if (!preloadPath || !fs.existsSync(preloadPath)) {
      preloadPath = path.join(
        externalApi.getAppUserDataPath() || os.tmpdir(),
        "electron-log-preload.js"
      );
      const preloadCode = `
      try {
        (${preloadInitializeFn.toString()})(require('electron'));
      } catch(e) {
        console.error(e);
      }
    `;
      fs.writeFileSync(preloadPath, preloadCode, "utf8");
    }
    externalApi.setPreloadFileForSessions({
      filePath: preloadPath,
      includeFutureSession,
      getSessions
    });
  }
  function initializeSpyRendererConsole({ externalApi, logger: logger2 }) {
    const levels = ["verbose", "info", "warning", "error"];
    externalApi.onEveryWebContentsEvent(
      "console-message",
      (event, level, message) => {
        logger2.processMessage({
          data: [message],
          level: levels[level],
          variables: { processType: "renderer" }
        });
      }
    );
  }
  return initialize;
}
var ErrorHandler_1;
var hasRequiredErrorHandler;
function requireErrorHandler() {
  if (hasRequiredErrorHandler)
    return ErrorHandler_1;
  hasRequiredErrorHandler = 1;
  class ErrorHandler {
    constructor({
      externalApi,
      logFn = void 0,
      onError = void 0,
      showDialog = void 0
    } = {}) {
      __publicField(this, "externalApi");
      __publicField(this, "isActive", false);
      __publicField(this, "logFn");
      __publicField(this, "onError");
      __publicField(this, "showDialog", true);
      this.createIssue = this.createIssue.bind(this);
      this.handleError = this.handleError.bind(this);
      this.handleRejection = this.handleRejection.bind(this);
      this.setOptions({ externalApi, logFn, onError, showDialog });
      this.startCatching = this.startCatching.bind(this);
      this.stopCatching = this.stopCatching.bind(this);
    }
    handle(error, {
      logFn = this.logFn,
      onError = this.onError,
      processType = "browser",
      showDialog = this.showDialog,
      errorName = ""
    } = {}) {
      var _a;
      error = normalizeError(error);
      try {
        if (typeof onError === "function") {
          const versions = ((_a = this.externalApi) == null ? void 0 : _a.getVersions()) || {};
          const createIssue = this.createIssue;
          const result = onError({
            createIssue,
            error,
            errorName,
            processType,
            versions
          });
          if (result === false) {
            return;
          }
        }
        errorName ? logFn(errorName, error) : logFn(error);
        if (showDialog && !errorName.includes("rejection") && this.externalApi) {
          this.externalApi.showErrorBox(
            `A JavaScript error occurred in the ${processType} process`,
            error.stack
          );
        }
      } catch {
        console.error(error);
      }
    }
    setOptions({ externalApi, logFn, onError, showDialog }) {
      if (typeof externalApi === "object") {
        this.externalApi = externalApi;
      }
      if (typeof logFn === "function") {
        this.logFn = logFn;
      }
      if (typeof onError === "function") {
        this.onError = onError;
      }
      if (typeof showDialog === "boolean") {
        this.showDialog = showDialog;
      }
    }
    startCatching({ onError, showDialog } = {}) {
      if (this.isActive) {
        return;
      }
      this.isActive = true;
      this.setOptions({ onError, showDialog });
      process.on("uncaughtException", this.handleError);
      process.on("unhandledRejection", this.handleRejection);
    }
    stopCatching() {
      this.isActive = false;
      process.removeListener("uncaughtException", this.handleError);
      process.removeListener("unhandledRejection", this.handleRejection);
    }
    createIssue(pageUrl, queryParams) {
      var _a;
      (_a = this.externalApi) == null ? void 0 : _a.openUrl(
        `${pageUrl}?${new URLSearchParams(queryParams).toString()}`
      );
    }
    handleError(error) {
      this.handle(error, { errorName: "Unhandled" });
    }
    handleRejection(reason) {
      const error = reason instanceof Error ? reason : new Error(JSON.stringify(reason));
      this.handle(error, { errorName: "Unhandled rejection" });
    }
  }
  function normalizeError(e) {
    if (e instanceof Error) {
      return e;
    }
    if (e && typeof e === "object") {
      if (e.message) {
        return Object.assign(new Error(e.message), e);
      }
      try {
        return new Error(JSON.stringify(e));
      } catch (serErr) {
        return new Error(`Couldn't normalize error ${String(e)}: ${serErr}`);
      }
    }
    return new Error(`Can't normalize error ${String(e)}`);
  }
  ErrorHandler_1 = ErrorHandler;
  return ErrorHandler_1;
}
var EventLogger_1;
var hasRequiredEventLogger;
function requireEventLogger() {
  if (hasRequiredEventLogger)
    return EventLogger_1;
  hasRequiredEventLogger = 1;
  class EventLogger {
    constructor(options = {}) {
      __publicField(this, "disposers", []);
      __publicField(this, "format", "{eventSource}#{eventName}:");
      __publicField(this, "formatters", {
        app: {
          "certificate-error": ({ args }) => {
            return this.arrayToObject(args.slice(1, 4), [
              "url",
              "error",
              "certificate"
            ]);
          },
          "child-process-gone": ({ args }) => {
            return args.length === 1 ? args[0] : args;
          },
          "render-process-gone": ({ args: [webContents, details] }) => {
            return details && typeof details === "object" ? { ...details, ...this.getWebContentsDetails(webContents) } : [];
          }
        },
        webContents: {
          "console-message": ({ args: [level, message, line, sourceId] }) => {
            if (level < 3) {
              return void 0;
            }
            return { message, source: `${sourceId}:${line}` };
          },
          "did-fail-load": ({ args }) => {
            return this.arrayToObject(args, [
              "errorCode",
              "errorDescription",
              "validatedURL",
              "isMainFrame",
              "frameProcessId",
              "frameRoutingId"
            ]);
          },
          "did-fail-provisional-load": ({ args }) => {
            return this.arrayToObject(args, [
              "errorCode",
              "errorDescription",
              "validatedURL",
              "isMainFrame",
              "frameProcessId",
              "frameRoutingId"
            ]);
          },
          "plugin-crashed": ({ args }) => {
            return this.arrayToObject(args, ["name", "version"]);
          },
          "preload-error": ({ args }) => {
            return this.arrayToObject(args, ["preloadPath", "error"]);
          }
        }
      });
      __publicField(this, "events", {
        app: {
          "certificate-error": true,
          "child-process-gone": true,
          "render-process-gone": true
        },
        webContents: {
          // 'console-message': true,
          "did-fail-load": true,
          "did-fail-provisional-load": true,
          "plugin-crashed": true,
          "preload-error": true,
          "unresponsive": true
        }
      });
      __publicField(this, "externalApi");
      __publicField(this, "level", "error");
      __publicField(this, "scope", "");
      this.setOptions(options);
    }
    setOptions({
      events,
      externalApi,
      level,
      logger: logger2,
      format: format2,
      formatters,
      scope: scope2
    }) {
      if (typeof events === "object") {
        this.events = events;
      }
      if (typeof externalApi === "object") {
        this.externalApi = externalApi;
      }
      if (typeof level === "string") {
        this.level = level;
      }
      if (typeof logger2 === "object") {
        this.logger = logger2;
      }
      if (typeof format2 === "string" || typeof format2 === "function") {
        this.format = format2;
      }
      if (typeof formatters === "object") {
        this.formatters = formatters;
      }
      if (typeof scope2 === "string") {
        this.scope = scope2;
      }
    }
    startLogging(options = {}) {
      this.setOptions(options);
      this.disposeListeners();
      for (const eventName of this.getEventNames(this.events.app)) {
        this.disposers.push(
          this.externalApi.onAppEvent(eventName, (...handlerArgs) => {
            this.handleEvent({ eventSource: "app", eventName, handlerArgs });
          })
        );
      }
      for (const eventName of this.getEventNames(this.events.webContents)) {
        this.disposers.push(
          this.externalApi.onEveryWebContentsEvent(
            eventName,
            (...handlerArgs) => {
              this.handleEvent(
                { eventSource: "webContents", eventName, handlerArgs }
              );
            }
          )
        );
      }
    }
    stopLogging() {
      this.disposeListeners();
    }
    arrayToObject(array, fieldNames) {
      const obj = {};
      fieldNames.forEach((fieldName, index) => {
        obj[fieldName] = array[index];
      });
      if (array.length > fieldNames.length) {
        obj.unknownArgs = array.slice(fieldNames.length);
      }
      return obj;
    }
    disposeListeners() {
      this.disposers.forEach((disposer) => disposer());
      this.disposers = [];
    }
    formatEventLog({ eventName, eventSource, handlerArgs }) {
      var _a;
      const [event, ...args] = handlerArgs;
      if (typeof this.format === "function") {
        return this.format({ args, event, eventName, eventSource });
      }
      const formatter = (_a = this.formatters[eventSource]) == null ? void 0 : _a[eventName];
      let formattedArgs = args;
      if (typeof formatter === "function") {
        formattedArgs = formatter({ args, event, eventName, eventSource });
      }
      if (!formattedArgs) {
        return void 0;
      }
      const eventData = {};
      if (Array.isArray(formattedArgs)) {
        eventData.args = formattedArgs;
      } else if (typeof formattedArgs === "object") {
        Object.assign(eventData, formattedArgs);
      }
      if (eventSource === "webContents") {
        Object.assign(eventData, this.getWebContentsDetails(event == null ? void 0 : event.sender));
      }
      const title = this.format.replace("{eventSource}", eventSource === "app" ? "App" : "WebContents").replace("{eventName}", eventName);
      return [title, eventData];
    }
    getEventNames(eventMap) {
      if (!eventMap || typeof eventMap !== "object") {
        return [];
      }
      return Object.entries(eventMap).filter(([_, listen]) => listen).map(([eventName]) => eventName);
    }
    getWebContentsDetails(webContents) {
      if (!(webContents == null ? void 0 : webContents.loadURL)) {
        return {};
      }
      try {
        return {
          webContents: {
            id: webContents.id,
            url: webContents.getURL()
          }
        };
      } catch {
        return {};
      }
    }
    handleEvent({ eventName, eventSource, handlerArgs }) {
      var _a;
      const log2 = this.formatEventLog({ eventName, eventSource, handlerArgs });
      if (log2) {
        const logFns = this.scope ? this.logger.scope(this.scope) : this.logger;
        (_a = logFns == null ? void 0 : logFns[this.level]) == null ? void 0 : _a.call(logFns, ...log2);
      }
    }
  }
  EventLogger_1 = EventLogger;
  return EventLogger_1;
}
var transform_1;
var hasRequiredTransform;
function requireTransform() {
  if (hasRequiredTransform)
    return transform_1;
  hasRequiredTransform = 1;
  transform_1 = { transform };
  function transform({
    logger: logger2,
    message,
    transport,
    initialData = (message == null ? void 0 : message.data) || [],
    transforms = transport == null ? void 0 : transport.transforms
  }) {
    return transforms.reduce((data, trans) => {
      if (typeof trans === "function") {
        return trans({ data, logger: logger2, message, transport });
      }
      return data;
    }, initialData);
  }
  return transform_1;
}
var format;
var hasRequiredFormat;
function requireFormat() {
  if (hasRequiredFormat)
    return format;
  hasRequiredFormat = 1;
  const { transform } = requireTransform();
  format = {
    concatFirstStringElements,
    formatScope,
    formatText,
    formatVariables,
    timeZoneFromOffset,
    format({ message, logger: logger2, transport, data = message == null ? void 0 : message.data }) {
      switch (typeof transport.format) {
        case "string": {
          return transform({
            message,
            logger: logger2,
            transforms: [formatVariables, formatScope, formatText],
            transport,
            initialData: [transport.format, ...data]
          });
        }
        case "function": {
          return transport.format({
            data,
            level: (message == null ? void 0 : message.level) || "info",
            logger: logger2,
            message,
            transport
          });
        }
        default: {
          return data;
        }
      }
    }
  };
  function concatFirstStringElements({ data }) {
    if (typeof data[0] !== "string" || typeof data[1] !== "string") {
      return data;
    }
    if (data[0].match(/%[1cdfiOos]/)) {
      return data;
    }
    return [`${data[0]} ${data[1]}`, ...data.slice(2)];
  }
  function timeZoneFromOffset(minutesOffset) {
    const minutesPositive = Math.abs(minutesOffset);
    const sign = minutesOffset >= 0 ? "-" : "+";
    const hours = Math.floor(minutesPositive / 60).toString().padStart(2, "0");
    const minutes = (minutesPositive % 60).toString().padStart(2, "0");
    return `${sign}${hours}:${minutes}`;
  }
  function formatScope({ data, logger: logger2, message }) {
    const { defaultLabel, labelLength } = (logger2 == null ? void 0 : logger2.scope) || {};
    const template = data[0];
    let label = message.scope;
    if (!label) {
      label = defaultLabel;
    }
    let scopeText;
    if (label === "") {
      scopeText = labelLength > 0 ? "".padEnd(labelLength + 3) : "";
    } else if (typeof label === "string") {
      scopeText = ` (${label})`.padEnd(labelLength + 3);
    } else {
      scopeText = "";
    }
    data[0] = template.replace("{scope}", scopeText);
    return data;
  }
  function formatVariables({ data, message }) {
    let template = data[0];
    if (typeof template !== "string") {
      return data;
    }
    template = template.replace("{level}]", `${message.level}]`.padEnd(6, " "));
    const date2 = message.date || /* @__PURE__ */ new Date();
    data[0] = template.replace(/\{(\w+)}/g, (substring, name) => {
      var _a;
      switch (name) {
        case "level":
          return message.level || "info";
        case "logId":
          return message.logId;
        case "y":
          return date2.getFullYear().toString(10);
        case "m":
          return (date2.getMonth() + 1).toString(10).padStart(2, "0");
        case "d":
          return date2.getDate().toString(10).padStart(2, "0");
        case "h":
          return date2.getHours().toString(10).padStart(2, "0");
        case "i":
          return date2.getMinutes().toString(10).padStart(2, "0");
        case "s":
          return date2.getSeconds().toString(10).padStart(2, "0");
        case "ms":
          return date2.getMilliseconds().toString(10).padStart(3, "0");
        case "z":
          return timeZoneFromOffset(date2.getTimezoneOffset());
        case "iso":
          return date2.toISOString();
        default: {
          return ((_a = message.variables) == null ? void 0 : _a[name]) || substring;
        }
      }
    }).trim();
    return data;
  }
  function formatText({ data }) {
    const template = data[0];
    if (typeof template !== "string") {
      return data;
    }
    const textTplPosition = template.lastIndexOf("{text}");
    if (textTplPosition === template.length - 6) {
      data[0] = template.replace(/\s?{text}/, "");
      if (data[0] === "") {
        data.shift();
      }
      return data;
    }
    const templatePieces = template.split("{text}");
    let result = [];
    if (templatePieces[0] !== "") {
      result.push(templatePieces[0]);
    }
    result = result.concat(data.slice(1));
    if (templatePieces[1] !== "") {
      result.push(templatePieces[1]);
    }
    return result;
  }
  return format;
}
var object = { exports: {} };
var hasRequiredObject;
function requireObject() {
  if (hasRequiredObject)
    return object.exports;
  hasRequiredObject = 1;
  (function(module2) {
    const util = require$$0$2;
    module2.exports = {
      serialize,
      maxDepth({ data, transport, depth = (transport == null ? void 0 : transport.depth) ?? 6 }) {
        if (!data) {
          return data;
        }
        if (depth < 1) {
          if (Array.isArray(data))
            return "[array]";
          if (typeof data === "object" && data)
            return "[object]";
          return data;
        }
        if (Array.isArray(data)) {
          return data.map((child2) => module2.exports.maxDepth({
            data: child2,
            depth: depth - 1
          }));
        }
        if (typeof data !== "object") {
          return data;
        }
        if (data && typeof data.toISOString === "function") {
          return data;
        }
        if (data === null) {
          return null;
        }
        if (data instanceof Error) {
          return data;
        }
        const newJson = {};
        for (const i in data) {
          if (!Object.prototype.hasOwnProperty.call(data, i))
            continue;
          newJson[i] = module2.exports.maxDepth({
            data: data[i],
            depth: depth - 1
          });
        }
        return newJson;
      },
      toJSON({ data }) {
        return JSON.parse(JSON.stringify(data, createSerializer()));
      },
      toString({ data, transport }) {
        const inspectOptions = (transport == null ? void 0 : transport.inspectOptions) || {};
        const simplifiedData = data.map((item) => {
          if (item === void 0) {
            return void 0;
          }
          try {
            const str = JSON.stringify(item, createSerializer(), "  ");
            return str === void 0 ? void 0 : JSON.parse(str);
          } catch (e) {
            return item;
          }
        });
        return util.formatWithOptions(inspectOptions, ...simplifiedData);
      }
    };
    function createSerializer(options = {}) {
      const seen = /* @__PURE__ */ new WeakSet();
      return function(key, value) {
        if (typeof value === "object" && value !== null) {
          if (seen.has(value)) {
            return void 0;
          }
          seen.add(value);
        }
        return serialize(key, value, options);
      };
    }
    function serialize(key, value, options = {}) {
      const serializeMapAndSet = (options == null ? void 0 : options.serializeMapAndSet) !== false;
      if (value instanceof Error) {
        return value.stack;
      }
      if (!value) {
        return value;
      }
      if (typeof value === "function") {
        return `[function] ${value.toString()}`;
      }
      if (value instanceof Date) {
        return value.toISOString();
      }
      if (serializeMapAndSet && value instanceof Map && Object.fromEntries) {
        return Object.fromEntries(value);
      }
      if (serializeMapAndSet && value instanceof Set && Array.from) {
        return Array.from(value);
      }
      return value;
    }
  })(object);
  return object.exports;
}
var style;
var hasRequiredStyle;
function requireStyle() {
  if (hasRequiredStyle)
    return style;
  hasRequiredStyle = 1;
  style = {
    transformStyles,
    applyAnsiStyles({ data }) {
      return transformStyles(data, styleToAnsi, resetAnsiStyle);
    },
    removeStyles({ data }) {
      return transformStyles(data, () => "");
    }
  };
  const ANSI_COLORS = {
    unset: "\x1B[0m",
    black: "\x1B[30m",
    red: "\x1B[31m",
    green: "\x1B[32m",
    yellow: "\x1B[33m",
    blue: "\x1B[34m",
    magenta: "\x1B[35m",
    cyan: "\x1B[36m",
    white: "\x1B[37m"
  };
  function styleToAnsi(style2) {
    const color = style2.replace(/color:\s*(\w+).*/, "$1").toLowerCase();
    return ANSI_COLORS[color] || "";
  }
  function resetAnsiStyle(string) {
    return string + ANSI_COLORS.unset;
  }
  function transformStyles(data, onStyleFound, onStyleApplied) {
    const foundStyles = {};
    return data.reduce((result, item, index, array) => {
      if (foundStyles[index]) {
        return result;
      }
      if (typeof item === "string") {
        let valueIndex = index;
        let styleApplied = false;
        item = item.replace(/%[1cdfiOos]/g, (match) => {
          valueIndex += 1;
          if (match !== "%c") {
            return match;
          }
          const style2 = array[valueIndex];
          if (typeof style2 === "string") {
            foundStyles[valueIndex] = true;
            styleApplied = true;
            return onStyleFound(style2, item);
          }
          return match;
        });
        if (styleApplied && onStyleApplied) {
          item = onStyleApplied(item);
        }
      }
      result.push(item);
      return result;
    }, []);
  }
  return style;
}
var console_1;
var hasRequiredConsole;
function requireConsole() {
  if (hasRequiredConsole)
    return console_1;
  hasRequiredConsole = 1;
  const { concatFirstStringElements, format: format2 } = requireFormat();
  const { maxDepth, toJSON } = requireObject();
  const { applyAnsiStyles, removeStyles } = requireStyle();
  const { transform } = requireTransform();
  const consoleMethods = {
    error: console.error,
    warn: console.warn,
    info: console.info,
    verbose: console.info,
    debug: console.debug,
    silly: console.debug,
    log: console.log
  };
  console_1 = consoleTransportFactory;
  const separator = process.platform === "win32" ? ">" : "›";
  const DEFAULT_FORMAT = `%c{h}:{i}:{s}.{ms}{scope}%c ${separator} {text}`;
  Object.assign(consoleTransportFactory, {
    DEFAULT_FORMAT
  });
  function consoleTransportFactory(logger2) {
    return Object.assign(transport, {
      format: DEFAULT_FORMAT,
      level: "silly",
      transforms: [
        addTemplateColors,
        format2,
        formatStyles,
        concatFirstStringElements,
        maxDepth,
        toJSON
      ],
      useStyles: process.env.FORCE_STYLES,
      writeFn({ message }) {
        const consoleLogFn = consoleMethods[message.level] || consoleMethods.info;
        consoleLogFn(...message.data);
      }
    });
    function transport(message) {
      const data = transform({ logger: logger2, message, transport });
      transport.writeFn({
        message: { ...message, data }
      });
    }
  }
  function addTemplateColors({ data, message, transport }) {
    if (transport.format !== DEFAULT_FORMAT) {
      return data;
    }
    return [`color:${levelToStyle(message.level)}`, "color:unset", ...data];
  }
  function canUseStyles(useStyleValue, level) {
    if (typeof useStyleValue === "boolean") {
      return useStyleValue;
    }
    const useStderr = level === "error" || level === "warn";
    const stream = useStderr ? process.stderr : process.stdout;
    return stream && stream.isTTY;
  }
  function formatStyles(args) {
    const { message, transport } = args;
    const useStyles = canUseStyles(transport.useStyles, message.level);
    const nextTransform = useStyles ? applyAnsiStyles : removeStyles;
    return nextTransform(args);
  }
  function levelToStyle(level) {
    const map = { error: "red", warn: "yellow", info: "cyan", default: "unset" };
    return map[level] || map.default;
  }
  return console_1;
}
var File_1;
var hasRequiredFile$1;
function requireFile$1() {
  if (hasRequiredFile$1)
    return File_1;
  hasRequiredFile$1 = 1;
  const EventEmitter = require$$0$3;
  const fs = require$$0;
  const os = require$$1;
  class File extends EventEmitter {
    constructor({
      path,
      writeOptions = { encoding: "utf8", flag: "a", mode: 438 },
      writeAsync = false
    }) {
      super();
      __publicField(this, "asyncWriteQueue", []);
      __publicField(this, "bytesWritten", 0);
      __publicField(this, "hasActiveAsyncWriting", false);
      __publicField(this, "path", null);
      __publicField(this, "initialSize");
      __publicField(this, "writeOptions", null);
      __publicField(this, "writeAsync", false);
      this.path = path;
      this.writeOptions = writeOptions;
      this.writeAsync = writeAsync;
    }
    get size() {
      return this.getSize();
    }
    clear() {
      try {
        fs.writeFileSync(this.path, "", {
          mode: this.writeOptions.mode,
          flag: "w"
        });
        this.reset();
        return true;
      } catch (e) {
        if (e.code === "ENOENT") {
          return true;
        }
        this.emit("error", e, this);
        return false;
      }
    }
    crop(bytesAfter) {
      try {
        const content = readFileSyncFromEnd(this.path, bytesAfter || 4096);
        this.clear();
        this.writeLine(`[log cropped]${os.EOL}${content}`);
      } catch (e) {
        this.emit(
          "error",
          new Error(`Couldn't crop file ${this.path}. ${e.message}`),
          this
        );
      }
    }
    getSize() {
      if (this.initialSize === void 0) {
        try {
          const stats = fs.statSync(this.path);
          this.initialSize = stats.size;
        } catch (e) {
          this.initialSize = 0;
        }
      }
      return this.initialSize + this.bytesWritten;
    }
    increaseBytesWrittenCounter(text) {
      this.bytesWritten += Buffer.byteLength(text, this.writeOptions.encoding);
    }
    isNull() {
      return false;
    }
    nextAsyncWrite() {
      const file2 = this;
      if (this.hasActiveAsyncWriting || this.asyncWriteQueue.length === 0) {
        return;
      }
      const text = this.asyncWriteQueue.join("");
      this.asyncWriteQueue = [];
      this.hasActiveAsyncWriting = true;
      fs.writeFile(this.path, text, this.writeOptions, (e) => {
        file2.hasActiveAsyncWriting = false;
        if (e) {
          file2.emit(
            "error",
            new Error(`Couldn't write to ${file2.path}. ${e.message}`),
            this
          );
        } else {
          file2.increaseBytesWrittenCounter(text);
        }
        file2.nextAsyncWrite();
      });
    }
    reset() {
      this.initialSize = void 0;
      this.bytesWritten = 0;
    }
    toString() {
      return this.path;
    }
    writeLine(text) {
      text += os.EOL;
      if (this.writeAsync) {
        this.asyncWriteQueue.push(text);
        this.nextAsyncWrite();
        return;
      }
      try {
        fs.writeFileSync(this.path, text, this.writeOptions);
        this.increaseBytesWrittenCounter(text);
      } catch (e) {
        this.emit(
          "error",
          new Error(`Couldn't write to ${this.path}. ${e.message}`),
          this
        );
      }
    }
  }
  File_1 = File;
  function readFileSyncFromEnd(filePath, bytesCount) {
    const buffer = Buffer.alloc(bytesCount);
    const stats = fs.statSync(filePath);
    const readLength = Math.min(stats.size, bytesCount);
    const offset = Math.max(0, stats.size - bytesCount);
    const fd = fs.openSync(filePath, "r");
    const totalBytes = fs.readSync(fd, buffer, 0, readLength, offset);
    fs.closeSync(fd);
    return buffer.toString("utf8", 0, totalBytes);
  }
  return File_1;
}
var NullFile_1;
var hasRequiredNullFile;
function requireNullFile() {
  if (hasRequiredNullFile)
    return NullFile_1;
  hasRequiredNullFile = 1;
  const File = requireFile$1();
  class NullFile extends File {
    clear() {
    }
    crop() {
    }
    getSize() {
      return 0;
    }
    isNull() {
      return true;
    }
    writeLine() {
    }
  }
  NullFile_1 = NullFile;
  return NullFile_1;
}
var FileRegistry_1;
var hasRequiredFileRegistry;
function requireFileRegistry() {
  if (hasRequiredFileRegistry)
    return FileRegistry_1;
  hasRequiredFileRegistry = 1;
  const EventEmitter = require$$0$3;
  const fs = require$$0;
  const path = require$$2;
  const File = requireFile$1();
  const NullFile = requireNullFile();
  class FileRegistry extends EventEmitter {
    constructor() {
      super();
      __publicField(this, "store", {});
      this.emitError = this.emitError.bind(this);
    }
    /**
     * Provide a File object corresponding to the filePath
     * @param {string} filePath
     * @param {WriteOptions} [writeOptions]
     * @param {boolean} [writeAsync]
     * @return {File}
     */
    provide({ filePath, writeOptions = {}, writeAsync = false }) {
      let file2;
      try {
        filePath = path.resolve(filePath);
        if (this.store[filePath]) {
          return this.store[filePath];
        }
        file2 = this.createFile({ filePath, writeOptions, writeAsync });
      } catch (e) {
        file2 = new NullFile({ path: filePath });
        this.emitError(e, file2);
      }
      file2.on("error", this.emitError);
      this.store[filePath] = file2;
      return file2;
    }
    /**
     * @param {string} filePath
     * @param {WriteOptions} writeOptions
     * @param {boolean} async
     * @return {File}
     * @private
     */
    createFile({ filePath, writeOptions, writeAsync }) {
      this.testFileWriting({ filePath, writeOptions });
      return new File({ path: filePath, writeOptions, writeAsync });
    }
    /**
     * @param {Error} error
     * @param {File} file
     * @private
     */
    emitError(error, file2) {
      this.emit("error", error, file2);
    }
    /**
     * @param {string} filePath
     * @param {WriteOptions} writeOptions
     * @private
     */
    testFileWriting({ filePath, writeOptions }) {
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      fs.writeFileSync(filePath, "", { flag: "a", mode: writeOptions.mode });
    }
  }
  FileRegistry_1 = FileRegistry;
  return FileRegistry_1;
}
var file;
var hasRequiredFile;
function requireFile() {
  if (hasRequiredFile)
    return file;
  hasRequiredFile = 1;
  const fs = require$$0;
  const os = require$$1;
  const path = require$$2;
  const FileRegistry = requireFileRegistry();
  const { transform } = requireTransform();
  const { removeStyles } = requireStyle();
  const {
    format: format2,
    concatFirstStringElements
  } = requireFormat();
  const { toString } = requireObject();
  file = fileTransportFactory;
  const globalRegistry = new FileRegistry();
  function fileTransportFactory(logger2, { registry = globalRegistry, externalApi } = {}) {
    let pathVariables;
    if (registry.listenerCount("error") < 1) {
      registry.on("error", (e, file2) => {
        logConsole(`Can't write to ${file2}`, e);
      });
    }
    return Object.assign(transport, {
      fileName: getDefaultFileName(logger2.variables.processType),
      format: "[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}]{scope} {text}",
      getFile,
      inspectOptions: { depth: 5 },
      level: "silly",
      maxSize: 1024 ** 2,
      readAllLogs,
      sync: true,
      transforms: [removeStyles, format2, concatFirstStringElements, toString],
      writeOptions: { flag: "a", mode: 438, encoding: "utf8" },
      archiveLogFn(file2) {
        const oldPath = file2.toString();
        const inf = path.parse(oldPath);
        try {
          fs.renameSync(oldPath, path.join(inf.dir, `${inf.name}.old${inf.ext}`));
        } catch (e) {
          logConsole("Could not rotate log", e);
          const quarterOfMaxSize = Math.round(transport.maxSize / 4);
          file2.crop(Math.min(quarterOfMaxSize, 256 * 1024));
        }
      },
      resolvePathFn(vars) {
        return path.join(vars.libraryDefaultDir, vars.fileName);
      },
      setAppName(name) {
        logger2.dependencies.externalApi.setAppName(name);
      }
    });
    function transport(message) {
      const file2 = getFile(message);
      const needLogRotation = transport.maxSize > 0 && file2.size > transport.maxSize;
      if (needLogRotation) {
        transport.archiveLogFn(file2);
        file2.reset();
      }
      const content = transform({ logger: logger2, message, transport });
      file2.writeLine(content);
    }
    function initializeOnFirstAccess() {
      if (pathVariables) {
        return;
      }
      pathVariables = Object.create(
        Object.prototype,
        {
          ...Object.getOwnPropertyDescriptors(
            externalApi.getPathVariables()
          ),
          fileName: {
            get() {
              return transport.fileName;
            },
            enumerable: true
          }
        }
      );
      if (typeof transport.archiveLog === "function") {
        transport.archiveLogFn = transport.archiveLog;
        logConsole("archiveLog is deprecated. Use archiveLogFn instead");
      }
      if (typeof transport.resolvePath === "function") {
        transport.resolvePathFn = transport.resolvePath;
        logConsole("resolvePath is deprecated. Use resolvePathFn instead");
      }
    }
    function logConsole(message, error = null, level = "error") {
      const data = [`electron-log.transports.file: ${message}`];
      if (error) {
        data.push(error);
      }
      logger2.transports.console({ data, date: /* @__PURE__ */ new Date(), level });
    }
    function getFile(msg) {
      initializeOnFirstAccess();
      const filePath = transport.resolvePathFn(pathVariables, msg);
      return registry.provide({
        filePath,
        writeAsync: !transport.sync,
        writeOptions: transport.writeOptions
      });
    }
    function readAllLogs({ fileFilter = (f) => f.endsWith(".log") } = {}) {
      initializeOnFirstAccess();
      const logsPath = path.dirname(transport.resolvePathFn(pathVariables));
      if (!fs.existsSync(logsPath)) {
        return [];
      }
      return fs.readdirSync(logsPath).map((fileName) => path.join(logsPath, fileName)).filter(fileFilter).map((logPath) => {
        try {
          return {
            path: logPath,
            lines: fs.readFileSync(logPath, "utf8").split(os.EOL)
          };
        } catch {
          return null;
        }
      }).filter(Boolean);
    }
  }
  function getDefaultFileName(processType = process.type) {
    switch (processType) {
      case "renderer":
        return "renderer.log";
      case "worker":
        return "worker.log";
      default:
        return "main.log";
    }
  }
  return file;
}
var ipc;
var hasRequiredIpc;
function requireIpc() {
  if (hasRequiredIpc)
    return ipc;
  hasRequiredIpc = 1;
  const { maxDepth, toJSON } = requireObject();
  const { transform } = requireTransform();
  ipc = ipcTransportFactory;
  function ipcTransportFactory(logger2, { externalApi }) {
    Object.assign(transport, {
      depth: 3,
      eventId: "__ELECTRON_LOG_IPC__",
      level: logger2.isDev ? "silly" : false,
      transforms: [toJSON, maxDepth]
    });
    return (externalApi == null ? void 0 : externalApi.isElectron()) ? transport : void 0;
    function transport(message) {
      var _a;
      if (((_a = message == null ? void 0 : message.variables) == null ? void 0 : _a.processType) === "renderer") {
        return;
      }
      externalApi == null ? void 0 : externalApi.sendIpc(transport.eventId, {
        ...message,
        data: transform({ logger: logger2, message, transport })
      });
    }
  }
  return ipc;
}
var remote;
var hasRequiredRemote;
function requireRemote() {
  if (hasRequiredRemote)
    return remote;
  hasRequiredRemote = 1;
  const http = require$$0$4;
  const https = require$$1$1;
  const { transform } = requireTransform();
  const { removeStyles } = requireStyle();
  const { toJSON, maxDepth } = requireObject();
  remote = remoteTransportFactory;
  function remoteTransportFactory(logger2) {
    return Object.assign(transport, {
      client: { name: "electron-application" },
      depth: 6,
      level: false,
      requestOptions: {},
      transforms: [removeStyles, toJSON, maxDepth],
      makeBodyFn({ message }) {
        return JSON.stringify({
          client: transport.client,
          data: message.data,
          date: message.date.getTime(),
          level: message.level,
          scope: message.scope,
          variables: message.variables
        });
      },
      processErrorFn({ error }) {
        logger2.processMessage(
          {
            data: [`electron-log: can't POST ${transport.url}`, error],
            level: "warn"
          },
          { transports: ["console", "file"] }
        );
      },
      sendRequestFn({ serverUrl, requestOptions, body }) {
        const httpTransport = serverUrl.startsWith("https:") ? https : http;
        const request = httpTransport.request(serverUrl, {
          method: "POST",
          ...requestOptions,
          headers: {
            "Content-Type": "application/json",
            "Content-Length": body.length,
            ...requestOptions.headers
          }
        });
        request.write(body);
        request.end();
        return request;
      }
    });
    function transport(message) {
      if (!transport.url) {
        return;
      }
      const body = transport.makeBodyFn({
        logger: logger2,
        message: { ...message, data: transform({ logger: logger2, message, transport }) },
        transport
      });
      const request = transport.sendRequestFn({
        serverUrl: transport.url,
        requestOptions: transport.requestOptions,
        body: Buffer.from(body, "utf8")
      });
      request.on("error", (error) => transport.processErrorFn({
        error,
        logger: logger2,
        message,
        request,
        transport
      }));
    }
  }
  return remote;
}
var createDefaultLogger_1;
var hasRequiredCreateDefaultLogger;
function requireCreateDefaultLogger() {
  if (hasRequiredCreateDefaultLogger)
    return createDefaultLogger_1;
  hasRequiredCreateDefaultLogger = 1;
  const Logger = requireLogger();
  const ErrorHandler = requireErrorHandler();
  const EventLogger = requireEventLogger();
  const transportConsole = requireConsole();
  const transportFile = requireFile();
  const transportIpc = requireIpc();
  const transportRemote = requireRemote();
  createDefaultLogger_1 = createDefaultLogger;
  function createDefaultLogger({ dependencies, initializeFn }) {
    var _a;
    const defaultLogger = new Logger({
      dependencies,
      errorHandler: new ErrorHandler(),
      eventLogger: new EventLogger(),
      initializeFn,
      isDev: (_a = dependencies.externalApi) == null ? void 0 : _a.isDev(),
      logId: "default",
      transportFactories: {
        console: transportConsole,
        file: transportFile,
        ipc: transportIpc,
        remote: transportRemote
      },
      variables: {
        processType: "main"
      }
    });
    defaultLogger.default = defaultLogger;
    defaultLogger.Logger = Logger;
    defaultLogger.processInternalErrorFn = (e) => {
      defaultLogger.transports.console.writeFn({
        message: {
          data: ["Unhandled electron-log error", e],
          level: "error"
        }
      });
    };
    return defaultLogger;
  }
  return createDefaultLogger_1;
}
var main;
var hasRequiredMain;
function requireMain() {
  if (hasRequiredMain)
    return main;
  hasRequiredMain = 1;
  const electron = require$$0$5;
  const ElectronExternalApi = requireElectronExternalApi();
  const { initialize: initialize2 } = requireInitialize();
  const createDefaultLogger = requireCreateDefaultLogger();
  const externalApi = new ElectronExternalApi({ electron });
  const defaultLogger = createDefaultLogger({
    dependencies: { externalApi },
    initializeFn: initialize2
  });
  main = defaultLogger;
  externalApi.onIpc("__ELECTRON_LOG__", (_, message) => {
    if (message.scope) {
      defaultLogger.Logger.getInstance(message).scope(message.scope);
    }
    const date2 = new Date(message.date);
    processMessage({
      ...message,
      date: date2.getTime() ? date2 : /* @__PURE__ */ new Date()
    });
  });
  externalApi.onIpcInvoke("__ELECTRON_LOG__", (_, { cmd = "", logId }) => {
    switch (cmd) {
      case "getOptions": {
        const logger2 = defaultLogger.Logger.getInstance({ logId });
        return {
          levels: logger2.levels,
          logId
        };
      }
      default: {
        processMessage({ data: [`Unknown cmd '${cmd}'`], level: "error" });
        return {};
      }
    }
  });
  function processMessage(message) {
    var _a;
    (_a = defaultLogger.Logger.getInstance(message)) == null ? void 0 : _a.processMessage(message);
  }
  return main;
}
var node;
var hasRequiredNode;
function requireNode() {
  if (hasRequiredNode)
    return node;
  hasRequiredNode = 1;
  const NodeExternalApi = requireNodeExternalApi();
  const createDefaultLogger = requireCreateDefaultLogger();
  const externalApi = new NodeExternalApi();
  const defaultLogger = createDefaultLogger({
    dependencies: { externalApi }
  });
  node = defaultLogger;
  return node;
}
const isRenderer = typeof process === "undefined" || (process.type === "renderer" || process.type === "worker");
const isMain = typeof process === "object" && process.type === "browser";
if (isRenderer) {
  requireElectronLogPreload();
  src.exports = requireRenderer();
} else if (isMain) {
  src.exports = requireMain();
} else {
  src.exports = requireNode();
}
var srcExports = src.exports;
const logger = /* @__PURE__ */ getDefaultExportFromCjs(srcExports);
logger.transports.file.level = "debug";
logger.transports.file.maxSize = 10 * 1024 * 1024;
logger.transports.file.format = "[{y}-{m}-{d} {h}:{i}:{s}] [{level}] [{scope}] {text}";
const date = /* @__PURE__ */ new Date();
const currentDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
logger.transports.file.resolvePathFn = () => require$$2.join("C:", "botLogs", `${currentDate}.log`);
const log = {
  info(param, scope2 = "main") {
    logger.scope(scope2).info(param);
  },
  warn(param, scope2 = "main") {
    logger.scope(scope2).warn(param);
  },
  error(param, scope2 = "main") {
    logger.scope(scope2).error(param);
  },
  debug(param, scope2 = "main") {
    logger.scope(scope2).debug(param);
  },
  silly(param, scope2 = "main") {
    logger.scope(scope2).silly(param);
  },
  verbose(param, scope2 = "main") {
    logger.scope(scope2).verbose(param);
  }
};
class SystemLog {
  constructor() {
    this.init();
  }
  init() {
    log.info("日志初始化");
    require$$0$5.app.on("child-process-gone", (event, details) => {
      log.error(
        `APP-ERROR:GPU进程或子进程结束; event: ${JSON.stringify(
          event
        )}; details:${JSON.stringify(details)}`,
        "main"
      );
    });
    require$$0$5.app.on("render-process-gone", (event, webContents, details) => {
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
const __filename$2 = url.fileURLToPath(typeof document === "undefined" ? require("url").pathToFileURL(__filename).href : _documentCurrentScript && _documentCurrentScript.src || new URL("main.js", document.baseURI).href);
const __dirname$2 = require$$2.dirname(__filename$2);
let taskWindow;
let child;
const isDevelopment$1 = process.env.NODE_ENV === "development";
function setupIpcHandlers(win2) {
  log.info("初始化ipcMain");
  require$$0$5.ipcMain.on("start", () => {
    var _a, _b;
    let exeFilePath;
    if (isDevelopment$1) {
      exeFilePath = require$$2.join(
        require$$0$5.app.getAppPath(),
        "dist-electron",
        "exe",
        "BestBot.exe"
      );
    } else {
      exeFilePath = require$$2.join(process.resourcesPath, "exe", "BestBot.exe");
    }
    log.info(`程序文件: ${require$$0.existsSync(exeFilePath)}`, "ipcMain");
    if (!require$$0.existsSync(exeFilePath)) {
      log.error(`文件未找到: ${exeFilePath}`);
      win2.webContents.send("reply", { success: false, message: "文件未找到" });
      return;
    }
    const options = {
      detached: true
      // 允许子进程在后台运行
    };
    child = require$$0$1.spawn(exeFilePath, [], options);
    (_a = child.stdout) == null ? void 0 : _a.on("data", (_data) => {
      win2.webContents.send("reply", { success: true, message: "启动成功" });
    });
    (_b = child.stderr) == null ? void 0 : _b.on("data", (_data) => {
      win2.webContents.send("reply", {
        success: false,
        message: "启动成功但存在错误"
      });
    });
    child.on("close", (code) => {
      console.log(`子进程退出码: ${code}`);
    });
    child.on("error", (error) => {
      console.error(`执行错误: ${error}`);
      win2.webContents.send("reply", { success: false, message: "启动失败" });
    });
  });
  require$$0$5.ipcMain.on("changWindowSize", (_e, { width, height, maximize = false }) => {
    if (win2) {
      if (maximize) {
        win2.maximize();
      } else {
        win2.unmaximize();
        win2.setSize(width, height);
      }
    }
  });
  require$$0$5.ipcMain.on("runTask", () => {
    if (win2) {
      if (!win2.isMinimized()) {
        win2.minimize();
      }
    }
    if (taskWindow) {
      taskWindow.close();
      taskWindow = null;
    }
    createTaskWindow();
  });
  require$$0$5.ipcMain.on("closeTask", () => {
    if (taskWindow) {
      taskWindow.close();
      taskWindow = null;
    }
    if (win2) {
      if (win2.isMinimized()) {
        win2.restore();
      }
    }
  });
  require$$0$5.ipcMain.on("updateConfig", (event, newConfig) => {
    const configPath2 = require$$2.join(require$$0$5.app.getPath("userData"), "best_bot_config.json");
    require$$0.writeFileSync(configPath2, JSON.stringify(newConfig, null, 2));
    require$$0$5.app.setLoginItemSettings({ openAtLogin: newConfig.autoLaunch });
  });
  require$$0$5.ipcMain.handle("openFile", async (_event) => {
    const res = await require$$0$5.dialog.showOpenDialog(win2, {
      properties: ["openFile"],
      filters: [{ name: "All Files", extensions: ["*"] }]
    });
    return res.filePaths[0];
  });
}
const createTaskWindow = () => {
  const { width, height } = require$$0$5.screen.getPrimaryDisplay().workAreaSize;
  console.log("width", width, height);
  taskWindow = new require$$0$5.BrowserWindow({
    width: 364,
    height: 140,
    frame: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    transparent: true,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true
    }
  });
  taskWindow.setBounds({
    x: width - 400,
    y: height - 220,
    width: 364,
    height: 140
  });
  if (!isDevelopment$1) {
    taskWindow.loadFile(require$$2.join(__dirname$2, "./index.html"), { hash: "/task" });
    require$$0$5.Menu.setApplicationMenu(null);
  } else {
    let url2 = "http://localhost:8080/#/task";
    taskWindow.loadURL(url2);
  }
};
const __filename$1 = url.fileURLToPath(typeof document === "undefined" ? require("url").pathToFileURL(__filename).href : _documentCurrentScript && _documentCurrentScript.src || new URL("main.js", document.baseURI).href);
const __dirname$1 = require$$2.dirname(__filename$1);
const isDevelopment = process.env.NODE_ENV === "development";
log.info(`环境${process.env.NODE_ENV}`, "main");
if (isDevelopment) {
  Object.defineProperty(require$$0$5.app, "isPackaged", {
    get() {
      return true;
    }
  });
}
let win;
let tray = null;
const configPath = require$$2.join(require$$0$5.app.getPath("userData"), "best_bot_config.json");
const createWindow = () => {
  win = new require$$0$5.BrowserWindow({
    // frame: false,
    // width: 800,
    // height: 600,
    // fullscreen: true,
    webPreferences: {
      contextIsolation: false,
      // 是否开启隔离上下文
      nodeIntegration: true,
      // 渲染进程使用Node API
      // enableRemoteModule: true,
      preload: require$$2.join(__dirname$1, "preload.js")
      // 需要引用js文件
    }
  });
  if (!isDevelopment) {
    const filePath = require$$2.join(__dirname$1, "./index.html");
    log.info(`${"打包后加载地址" + filePath}`);
    win.loadFile(filePath);
    win.webContents.openDevTools();
    require$$0$5.Menu.setApplicationMenu(null);
  } else {
    log.info("本地加载");
    let url2 = "http://localhost:8080";
    win.loadURL(url2);
    win.webContents.openDevTools();
  }
  win.on("close", async (e) => {
    e.preventDefault();
    const { hideOnClose } = readConfig();
    if (hideOnClose) {
      win.hide();
    } else {
      require$$0$5.app.exit();
    }
  });
};
require$$0$5.app.whenReady().then(() => {
  createWindow();
  systemConfig();
  setupIpcHandlers(win);
  require$$0$5.app.on("activate", () => {
    if (require$$0$5.BrowserWindow.getAllWindows().length === 0)
      createWindow();
  });
  new SystemLog();
  creatTray();
});
require$$0$5.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    require$$0$5.app.quit();
  }
});
const creatTray = () => {
  const iconPath = isDevelopment ? require$$2.join(require$$0$5.app.getAppPath(), "public", "icon.png") : require$$2.join(require$$0$5.app.getAppPath(), "dist-electron", "icon.png");
  tray = new require$$0$5.Tray(iconPath);
  const contextMenu = require$$0$5.Menu.buildFromTemplate([
    {
      label: "显示应用",
      click: () => {
        win.show();
      }
    },
    {
      label: "退出",
      click: () => {
        win.destroy();
      }
    }
  ]);
  tray.setToolTip("bestbot");
  tray.setContextMenu(contextMenu);
  tray.on("click", () => {
    win.show();
  });
};
const systemConfig = () => {
  let config = {
    autoLaunch: false,
    // 开机自启动
    hideOnClose: false
    // 点击退出时是否隐藏到托盘
  };
  if (!require$$0.existsSync(configPath)) {
    require$$0.writeFileSync(configPath, JSON.stringify(config, null, 2));
  }
};
const readConfig = () => {
  const data = require$$0.readFileSync(configPath, "utf-8");
  return JSON.parse(data);
};
