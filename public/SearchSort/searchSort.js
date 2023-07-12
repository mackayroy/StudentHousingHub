Vue.createApp({
  data() {
    return {
      userSession: false,
      search: "",
      showMobileContainer: false,
    };
  },
  methods: {
    Ham: function () {
      this.showMobileContainer = !this.showMobileContainer; // Toggle the value
      console.log("Ham");
    },
  },
  created: function () {},
}).mount("#app");
