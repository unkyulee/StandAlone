export default {
  App: [
    {
      title: "Test App DB",
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
