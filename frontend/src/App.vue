<template>
  <v-app>
    <Navigation v-if="navigation" />
    <Toolbar v-if="toolbar" />
    <Snackbar />
    <v-main>
      <component :is="component"> </component>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
//
import obj from "object-path";
import moment from "moment";

// services
import data from "./services/data.service";
import config from "./services/config.service";
import event from "./services/event.service";
import auth from "./services/auth.service";
import util from "./services/util.service";

// layout
import Navigation from "./layout/Navigation.vue";
import Toolbar from "./layout/Toolbar.vue";
import Snackbar from "./layout/Snackbar.vue";

export default Vue.extend({
  name: "app",
  components: {
    Toolbar,
    Navigation,
    Snackbar,
  },
  provide: function () {
    return {
      data,
      config,
      event,
      auth,
      util,
    };
  },
  data: function () {
    return {
      component: null,
      toolbar: false,
      navigation: false,
    };
  },
  mounted: async function () {
    // check if requires login
    if (config.get("login") && !auth.isAuthenticated()) {
      this.component = config.get("login");
      // subscribe to login-success event
      event.subscribe(this._uid, "login-success", async (event) => {
        await this.init();
      });
    } else {
      await this.init();
    }

    //
  },
  destroyed: function () {
    event.unsubscribe_all(this._uid);
  },
  watch: {
    // react to route changes...
    async $route(to, from) {
      this.load(to.path);
    },
  },
  methods: {
    async init() {
      // check toolbar
      if (config.get("toolbar")) this.toolbar = true;

      // check navigation
      if (config.get("navigation")) this.navigation = true;

      // go to given navigation      
      this.$router
        .push(util.get(window, "params.parameter.url", config.get("nav.0.url")))
        .catch(async (error) => {          
          if (error.name == "NavigationDuplicated") {
            await this.load(this.$route.path);
          }
        });
    },
    load(url) {
      // find the matching nav
      const nav = config.get("nav", []);
      const matchingNav = nav.find((x) => x.url == url);
      
      // udpate ui
      if (matchingNav) this.component = matchingNav.component;
    },
  },
});
</script>

<style scoped>
/deep/ .v-main__wrap {
  display: flex;
  flex-flow: column;
}

/deep/ p {
  margin-bottom: 0 !important;
}
</style>