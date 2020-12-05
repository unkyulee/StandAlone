// _id: recipe-category
new Object({
  template: `
<div :style="style">
  <v-card v-for="(category, index) of categories" :key="index" :style="cardStyle">
    <v-img
      height="250"
      src="https://cdn.vuetifyjs.com/images/cards/cooking.png"
    ></v-img>

    <v-card-title>{{ category.name }}</v-card-title>
    <v-card-text>{{ category.description }}</v-card-text>
    <v-card-actions>
      <v-btn color="deep-purple lighten-2" text>
        RECIPES
      </v-btn>
    </v-card-actions>
  </v-card>
</div>
`,
  inject: ["data", "config", "event"],
  data: function () {
    return {
      categories: [],
      style: {
        display: "flex",
        flexFlow: "row wrap",
        alignItems: "center",
        justifyContent: "center",
        height: "100%"
      },
      cardStyle: {
        maxWidth: "350px",
        margin: "24px"
      }
    };
  },
  mounted: async function () {
    // load recipe categories
    let response = await this.data.get("Category");
    if (response.data) this.categories = response.data;
  },
});
