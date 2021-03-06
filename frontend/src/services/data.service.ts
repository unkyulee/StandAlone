export default {
  async get(table, option?) {
    if (!option) option = {};    

    // run google script
    let response = await this.run("search", {
      table,      
      ...option,
    });

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
    return new Promise((ok) =>
      google.script.run
        .withSuccessHandler((data) => ok(data))[fn](params)
    );
  },
};