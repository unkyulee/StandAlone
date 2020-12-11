/* */
let _data_ = {};

export default {
  async get(table, filter?, option?) {
    if (!option) option = {};

    // check cache
    let key = `${table}_${filter}_${JSON.stringify(option)}`;
    if (_data_[key]) return _data_[key];

    // run google script
    let response = await this.run("search", {
      table,
      filter,
      ...option,
    });
    // save cache
    _data_[key] = response;

    return response;
  },

  async set(table, data) {
    // run google script
    let response = await this.run("upsert", {
      table,
      data,
    });   

    return response;
  },

  run(fn, params) {
    return new Promise((res) =>
      google.script.run.withSuccessHandler((data) => res(data))[fn](params)
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
