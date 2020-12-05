<template>
  <div></div>
</template>

<script>

export default {
  inject: ["data", "config", "event"],
  mounted: function () {
    // data refresh
    this.event.subscribe(this._uid, "data", (event) => {
      this.$forceUpdate();
    });
  },
  destroyed: function () {
    //
    this.event.unsubscribe_all(this._uid);
  }
};
</script>