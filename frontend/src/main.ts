import Vue from 'vue'
import vuetify from './plugins/vuetify'
import App from './App.vue'
import "./style.css"

//Vue.config.productionTip = false;

// register components
import ui from "./services/ui.service";

// Router plugin
import VueRouter from "vue-router";
Vue.use(VueRouter);
const routes = [{ path: "*", component: App }];
const router = new VueRouter({ routes });

(async () => {
  await ui.registerComponents();

  // init view
  new Vue({
    el: '#app',
    vuetify,
    router,
    render: (h) => h(App),
  })
})();
