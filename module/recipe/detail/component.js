// _id: recipe-detail
new Object({
  template: `
  <div :style="style">
  <v-breadcrumbs :items="breadcrumbs"></v-breadcrumbs>
  <v-row align="center" justify="center" style="color: white; max-width: 800px; align-self: center;">
    <v-col
      class="text-center"
      cols="12"
      style="background: black; opacity: 0.8"
    >
      <h1 class="display-1 font-weight-bold mb-4">{{recipe.name}}</h1>
      <h4 class="font-weight-thin">{{recipe.description}}</h4>
      <v-img v-if="recipe.image" height="250" :src="recipe.image"></v-img>
    </v-col>
    <v-col cols="12">
      <v-banner>Ingredienti</v-banner>
      <v-simple-table>
        <template v-slot:default>
          <tbody>
            <tr v-for="(item, index) of ingredients" :key="index">
              <td>{{ item.name }}</td>
              <td>{{ item.qty }}{{ item.unit }}</td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-col>
    <v-col cols="12">
      <v-banner>Procedimento</v-banner>
      <v-simple-table>
        <template v-slot:default>
          <tbody>
            <tr v-for="(item, index) of steps" :key="index">
              <td>{{ item.description }}</td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-col>
  </v-row>
</div>

  `,
  inject: ["data", "config", "event"],
  data: function () {
    return {
      breadcrumbs: [],
      category: {},
      recipe: {},
      ingredients: [],
      steps: [],
      style: {
        display: "flex",
        flexFlow: "column",
      },
    };
  },
  mounted: async function () {
    // load category detail
    this.category = this.$route.query.category;
    this.recipe = this.$route.query.recipe;

    // configure bread crumbs
    // Ricette > "Selected Category"
    this.breadcrumbs.push({
      text: "Ricette",
      disabled: false,
      to: "/",
    });

    this.breadcrumbs.push({
      text: this.category.name,
      disabled: false,
      to: {
        path: "/recipe-list",
        query: {
          category: this.category,
        },
      },
    });

    this.breadcrumbs.push({
      text: this.recipe.name,
      disabled: true,
    });

    // download ingredients
    let response = await this.data.get(
      "Ingredient",
      `(x) => x.recipe_id == ${this.recipe._id}`
    );
    this.ingredients = response.data;

    // download steps
    response = await this.data.get(
      "Step",
      `(x) => x.recipe_id == ${this.recipe._id}`
    );
    this.steps = response.data;
  },
});
