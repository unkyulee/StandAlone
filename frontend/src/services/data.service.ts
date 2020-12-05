export default {
  async get(table, filter?) {
    return db[table];
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
