<template>
  <v-app-bar app dense flat :dark="toolbar.dark" :color="toolbar.color">
    <v-app-bar-nav-icon @click.stop="toggleDrawer()"></v-app-bar-nav-icon>
    <v-toolbar-title>{{ title }}</v-toolbar-title>
    <v-spacer></v-spacer>
  </v-app-bar>
</template>

<script>
import Base from "./Base";

export default {
  extends: Base,
  data: function () {
    return {
      title: "",
      toolbar: {
        color: null,
        dark: false,
      },
    };
  },
  mounted: function () {
    // subscribe to data-change event
    this.event.subscribe("Toolbar", "nav-loaded", (event) => {
      // load toolbar theme
      this.title = this.config.get("name", "");
      this.toolbar.dark = this.config.get("dark", false);
      this.toolbar.color = this.config.get("color");
    });
  },
  destroyed: function () {
    this.event.unsubscribe_all("Toolbar");
  },
  methods: {
    toggleDrawer() {
      this.event.send({ name: "toggle-drawer" });
    },
  },
};
</script>