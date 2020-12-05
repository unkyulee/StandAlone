<template>
  <v-app>
    <Navigation />
    <Toolbar />

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

// layout
import Navigation from "./layout/Navigation.vue";
import Toolbar from "./layout/Toolbar.vue";

export default Vue.extend({
  name: "app",
  components: {
    Toolbar,
    Navigation,
  },
  provide: function () {
    return {
      data,
      config,
      event,
    };
  },
  data: function () {
    return {
      component: null,
    };
  },
  mounted: async function () {
    // load the first navigation
    if (this.$route.path != "/" && config.get("nav", []).length > 0) {
      this.$router.push(config.get("nav.0.url"));
    }
    // other-wise load the selected navigation
    else {
      await this.load(this.$route.path);
    }
  },
  watch: {
    // react to route changes...
    async $route(to, from) {
      this.load(to.path);
    },
  },
  methods: {
    load: function (url) {
      // find the matching nav
      const nav = config.get("nav", []);
      const matchingNav = nav.find((x) => x.url == url);
      // udpate ui
      if (matchingNav) {
        this.component = matchingNav.component;
      }
    },
  },
});
</script>

