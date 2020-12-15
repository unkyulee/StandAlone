<template>
  <v-snackbar v-model="show" :timeout="timeout" :color="color">
    {{ text }}
    <template v-slot:action="{ attrs }">
      <v-btn
        v-if="action"
        v-bind="attrs"
        text
        :color="action.color"        
        @click="click()"
      >
        {{ action.label }}
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
import Vue from "vue";
const obj = require("object-path");

export default {  
  inject: ["data", "config", "event"],
  data: function () {
    return {
      show: false,
      text: "",
      color: "",
      timeout: 3000,
      action: null,
    };
  },
  mounted: function () {
    // subscribe to refresh
    this.event.subscribe(this._uid, "snackbar", (event) => {
      this.text = event.text;
      this.action = event.action;
      this.timeout = obj.get(event, "timeout", 3000);
      this.color = event.color;
      this.show = true;
    });
  },
  destroyed: function () {
    this.event.unsubscribe_all(this._uid);
  },
  methods: {
    click() {
      this.show = false;
      if (obj.get(this, "action.click")) {
        try {
          eval(obj.get(this, "action.click"));
        } catch (ex) {
          console.error(ex);
        }
      }
    },
  },
}
</script>