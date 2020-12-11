import obj from "object-path";

declare var window: any;

export default {
  safeStr(str) {
    if (str) return str.replace(/[^a-zA-Z ]/g, "");
  },
  loadApp() {
    window.app = obj.get(window.params, "parameter.app");
    window.app = this.safeStr(window.app);
    if (!window.app) window.app = "default";    
    console.log(window.app);
  },
  generateId() {
    return parseInt(`${new Date().getTime() / 100 % 10000000}`);
  }
};
