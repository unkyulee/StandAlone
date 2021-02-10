import Vue from "vue";
import vuetify from "./plugins/vuetify";
import Loading from "./layout/Loading.vue";
import App from "./App.vue";
import "./style.css";
declare var window: any;
import moment from "moment";

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
  await Promise.all([registerComponents(), loadAppConfig(), loadNav(), loadConfig()]);

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
  let components = await data.get("UI", {
    filter: {
      app_id: [
        {
          type: "match",
          value: window.app,
        },
      ],
    },
  });
  for (let c of components.data) {
    // register the component
    try {
      // retrieve component script part
      let component = eval(c.component);
      // default should be an object
      if (!component) component = {};
      // assign template if exists
      if (c.template) component = { ...component, template: c.template };
      // register component
      Vue.component(c._id, component);
    } catch (ex) {
      console.log(c);
      console.error(ex);
    }
  }
}

async function loadAppConfig() {
  // load app config
  let app = await data.get("App", {
    filter: {
      app_id: [
        {
          type: "match",
          value: window.app,
        },
      ],
    },
  });
  if (app && app.data && app.data.length > 0) {
    app = app.data[0];
    for (let key of Object.keys(app)) config.set(key, app[key]);

    // set locale
    if(config.get("locale")) {
      moment.locale(config.get("locale"))
    }
  }
}

async function loadNav() {
  // load navigation from data base
  const nav = await data.get("Navigation", {
    filter: {
      app_id: [
        {
          type: "match",
          value: window.app,
        },
      ],
    },
  });
  config.set("nav", nav.data);
}

async function loadConfig() {
  // load navigation from data base
  const nav = await data.get("Config", {
    filter: {
      app_id: [
        {
          type: "match",
          value: window.app,
        },
      ],
    },
  });
  config.set("config", nav.data[0]);
}
