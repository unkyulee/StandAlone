// _id: recipe-list
new Object({
  template: `
<div :style="style">
  <v-breadcrumbs :items="breadcrumbs"></v-breadcrumbs>
  <v-parallax v-if="category.image" :src="category.image" height="300">
    <v-row align="center" justify="center">
      <v-col class="text-center" cols="12" style="background: black; opacity: 0.8;">
        <h1 class="display-1 font-weight-bold mb-4">{{category.name}}</h1>
        <h4 class="font-weight-thin">{{category.description}}</h4>
      </v-col>
    </v-row>
  </v-parallax>
  <div :style="listStyle">
    <v-card v-for="(recipe, index) of recipes" :key="index" :style="cardStyle">
      <v-img v-if="recipe.image" height="250" :src="recipe.image"></v-img>
      <v-card-title>{{ recipe.name }}</v-card-title>
      <v-card-text>{{ recipe.description }}</v-card-text>
      <v-card-actions>
        <v-btn color="pink" text @click="click(recipe)">
        DETTAGLIO
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</div>
  `,
  inject: ["data", "config", "event"],
  data: function () {
    return {
      breadcrumbs: [],
      category: {},
      recipes: [],
      style: {
        display: "flex",
        flexFlow: "column",
        height: "100%"
      },
      listStyle: {
        display: "flex",
        flexFlow: "row wrap",
        background: "lightgray"
      },
      cardStyle: {
        width: "300px",
        maxWidth: "300px",
        margin: "24px",
      },
    };
  },
  mounted: async function () {
    // load category detail
    this.category = this.$route.query.category;

    // configure bread crumbs
    // Ricette > "Selected Category"
    this.breadcrumbs.push({
      text: "Ricette",
      disabled: false,
      to: "/",
    });

    this.breadcrumbs.push({
      text: this.category.name,
      disabled: true,
    });

    // download recipe lists
    let response = await this.data.get("Recipe", `(x) => x.category_id == ${this.category._id}`);
    this.recipes = response.data;
  },
  methods: {
    click: function(recipe) {
      this.$router.push({
        path: `/recipe-detail`,
        query: {
          category: this.category,
          recipe
        }
      })
    }
  },
});
