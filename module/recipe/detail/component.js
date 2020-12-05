// _id: recipe-detail
new Object({
  template: `
<v-dialog v-model="show" max-width="600px" width="600px">
  <v-img v-if="recipe.image" height="250" :src="recipe.image"></v-img>

  <div style="background: white; padding: 16px;">
    <h1 class="display-1 font-weight-bold mb-4">{{recipe.name}}</h1>
    <h4 class="font-weight-thin">{{recipe.description}}</h4>

    <v-banner style="font-weight: bold">Ingredienti</v-banner>

    <v-row
      align="center"
      justify="center"
      v-if="!ingredients"
      style="height: 40px"
    >
      <v-progress-circular indeterminate color="primary" />
    </v-row>

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

    <v-banner style="font-weight: bold">Procedimento</v-banner>

    <v-row align="center" justify="center" v-if="!steps" style="height: 40px">
      <v-progress-circular indeterminate color="primary" />
    </v-row>

    <v-simple-table>
      <template v-slot:default>
        <tbody>
          <tr v-for="(item, index) of steps" :key="index">
            <td>{{ item.description }}</td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
  </div>
</v-dialog>
  `,
  inject: ["data", "config", "event"],
  data: function () {
    return {
      show: false,
      category: {},
      recipe: {},
      ingredients: [],
      steps: [],
      style: {
        display: "flex",
        flexFlow: "column",
        background: "white",
      },
    };
  },
  mounted: async function () {
    // subscribe to data-change event
    this.event.subscribe(this._uid, "show-recipe", async (event) => {
      console.log("hey");
      this.show = true;
      this.ingredients = null;
      this.steps = null;

      // load category detail
      this.category = event.category;
      this.recipe = event.recipe;

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
    });
  },
  destroyed: function () {
    this.event.unsubscribe_all(this._uid);
  },
  methods: {
    close() {
      this.show = false;
    },
  },
});
