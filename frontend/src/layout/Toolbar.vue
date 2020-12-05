<template>
  <v-app-bar
    v-if="title"
    app
    dense
    flat
    :dark="toolbar.dark == 1 ? true : false"
    :color="toolbar.color"
  >
    <v-app-bar-nav-icon @click.stop="toggleDrawer()"></v-app-bar-nav-icon>
    <v-toolbar-title>{{ title }}</v-toolbar-title>
    <v-spacer></v-spacer>
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
    };
  },
  mounted: function () {
    // load toolbar theme
    this.title = this.config.get("name", "");
    this.toolbar.dark = this.config.get("dark", false);
    this.toolbar.color = this.config.get("color");
  },
  methods: {
    toggleDrawer() {
      this.event.send({ name: "toggle-drawer" });
    },
  },
};
</script>