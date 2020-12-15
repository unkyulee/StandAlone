import Vue from "vue";
import vuetify from "./plugins/vuetify";
import Loading from "./layout/Loading.vue";
import App from "./App.vue";
import "./style.css";
declare var window: any;

// Router plugin
import VueRouter from "vue-router";
Vue.use(VueRouter);
const routes = [{ path: "*", component: App }];
const router = new VueRouter({ routes });

// services
import data from "./services/data.service";
import config from "./services/config.service";
import util from "./services/util.service";

// Display Loading Screen
new Vue({
  vuetify,
  render: (h) => h(Loading),
}).$mount("#loading");

// init function
window.app_init = async () => {
  // retrieve app_id
  util.loadApp();

  // initialize function
  await Promise.all([registerComponents(), loadAppConfig(), loadNav()]);

  // init view
  new Vue({
    el: "#app",
    vuetify,
    router,
    render: (h) => h(App),
  });
};

async function registerComponents() {
  // register ui components
  let components = await data.get(
    "UI",
    `(x) => x.app_id == '${window.app}' || x.app_id == 'common'`
  );
  for (let c of components.data) {
    // register the component
    try {
      Vue.component(c._id, eval(c.component));
    } catch (ex) {
      console.log(c);
      console.error(ex);
    }
  }
}

async function loadAppConfig() {
  // load app config
  let app = await data.get("App", `(x) => x.app_id == '${window.app}'`);
  if (app && app.data && app.data.length > 0) {
    app = app.data[0];
    for (let key of Object.keys(app)) config.set(key, app[key]);
  }
}

async function loadNav() {
  // load navigation from data base
  const nav = await data.get(
    "Navigation",
    `(x) => x.app_id == '${window.app}'`
  );
  config.set("nav", nav.data);
}
