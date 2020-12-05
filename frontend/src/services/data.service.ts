/* */
export default {
  async get(table, filter?, page?, size?) {
    // run google script
    let response = await this.run({
      table,
      filter,
      page,
      size,
    });
    return response;
  },

  run(params) {
    return new Promise((res) =>
      google.script.run.withSuccessHandler((data) => res(data))["search"](params)
    );
  },
};

/*
// TEST function
export default {
  async get(table, filter?) {
    return {
      total: 10,
      size: 10,
      data: db[table],
    };
  },
};


let db = {
	App: [
	  {
		name: "Test App",
		dark: true,
		color: "#ff0033",
		features: "client"
	  },
	],
	Navigation: [
	  {
		url: "/",
		icon: "mdi-home",
		name: "Home",
		component: "home",
	  },
	  {
		url: "/test",
		icon: "mdi-web",
		name: "Web",
		component: "test",
	  },
	],
	UI: [
	  {
		_id: "home",
		component: `new Object({
			  template: "<div>this is home</div>"
			});`,
	  },
	  {
		_id: "test",
		component: `new Object({
			  template: "<div>this is test</div>"
			});`,
	  },
	],
  };

*/