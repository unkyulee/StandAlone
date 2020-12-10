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

window.app_init = async () => {
  // Display Loading Screend
  new Vue({
    vuetify,
    render: (h) => h(Loading),
  }).$mount("#loading");

  (async () => {
    // retrieve app_id
    util.loadApp();

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

    // load app config
    let app = await data.get(
      "App",
      `(x) => x.app_id == '${window.app}' || x.app_id == 'default' `
    );
    if (app && app.data && app.data.length > 0) {
      app = app.data[0];
      for (let key of Object.keys(app)) config.set(key, app[key]);
    }

    // load navigation from data base
    const nav = await data.get(
      "Navigation",
      `(x) => x.app_id == '${window.app}'  || x.app_id == 'default'`
    );
    config.set("nav", nav.data);

    // init view
    new Vue({
      el: "#app",
      vuetify,
      router,
      render: (h) => h(App),
    });
  })();
};
