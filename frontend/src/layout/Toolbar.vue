<template>
  <v-app-bar
    app    
    :dark="toolbar.dark == 1 ? true : false"
    :color="toolbar.color"
  >
    <v-app-bar-nav-icon @click.stop="toggleDrawer()"></v-app-bar-nav-icon>
    <v-toolbar-title>{{ title }}</v-toolbar-title>
    <v-spacer></v-spacer>
    <component v-for="(action, index) of actions" :is="action" :key="index">
    </component>
  </v-app-bar>
</template>

<script>
export default {
  inject: ["data", "config", "event"],
  data: function () {
    return {
      title: "",
      toolbar: {
        color: null,
        dark: false,
      },
      actions: [],
    };
  },
  mounted: function () {
    // load toolbar theme
    this.title = this.config.get("name", "");
    this.toolbar.dark = this.config.get("dark", false);
    this.toolbar.color = this.config.get("color");

    // actions
    if(this.config.get("actions")) {
      try {
        this.actions = JSON.parse(this.config.get("actions", []));
      } catch {}
    }
  },
  watch: {
    // react to route changes...
    async $route(to, from) {
      // find the matching nav
      const nav = this.config.get("nav", []);
      const matchingNav = nav.find((x) => x.url == to.path);
      // udpate ui
      if (matchingNav) this.title = matchingNav.name;
    },
  },
  methods: {
    toggleDrawer() {
      this.event.send({ name: "toggle-drawer" });
    },
  },
};
</script>