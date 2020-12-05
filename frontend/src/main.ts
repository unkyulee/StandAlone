import Vue from 'vue'
import vuetify from './plugins/vuetify'
import Loading from './layout/Loading.vue'
import App from './App.vue'
import "./style.css"

// Router plugin
import VueRouter from "vue-router";
Vue.use(VueRouter);
const routes = [{ path: "*", component: App }];
const router = new VueRouter({ routes });

// Display Loading Screend
new Vue({
  vuetify,
  render: (h) => h(Loading),
}).$mount('#loading');

// services
import ui from "./services/ui.service";
import data from "./services/data.service";
import config from "./services/config.service";

(async () => {
  // register ui components
  await ui.registerComponents();
  
  // load app config
  let app = await data.get("App");
  if (app && app.data && app.data.length > 0) {
    app = app.data[0];
    for (let key of Object.keys(app)) config.set(key, app[key]);
  }

  // load navigation from data base
  const nav = await data.get("Navigation");
  config.set("nav", nav.data);

  // init view
  new Vue({
    el: '#app',
    vuetify,
    router,
    render: (h) => h(App),
  })
})();
