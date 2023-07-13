Vue.createApp({
  data() {
    return {
      userSession: false,
      search: "",
      showMobileContainer: false,
      properties: [
        {
          price: 450,
          name: "Crusty Crab",
          location: "1234 Bikini Bottom",
          numBeds: "3",
          Pool: false,
          Wifi: true,
          Printer: false,
          Kitchen: false,
        },
        {
          price: 300,
          name: "Laughing Lighthouse",
          location: "789 Chucklesville",
          numBeds: "2",
          Pool: false,
          Wifi: false,
          Printer: false,
          Kitchen: false,
        },
        {
          price: 200,
          name: "Whimsical Wigwam",
          location: "567 Giggle Lane",
          numBeds: "3",
          Pool: false,
          Wifi: false,
          Printer: false,
          Kitchen: false,
        },
        {
          price: 150,
          name: "Silly Shack",
          location: "4321 Joke Street",
          numBeds: "1",
          Pool: false,
          Wifi: false,
          Printer: false,
          Kitchen: false,
        },
        {
          price: 500,
          name: "Quirky Quarters",
          location: "987 Gigglesville",
          numBeds: "4",
          Pool: false,
          Wifi: false,
          Printer: false,
          Kitchen: false,
        },
        {
          price: 400,
          name: "Crazy Cottage",
          location: "246 Hilarity Road",
          numBeds: "2",
          Pool: true,
          Wifi: true,
          Printer: true,
          Kitchen: false,
        },
      ],
      sortedProperties: [],
      active_search: [],
      minPrice: null,
      maxPrice: null,
      minBedrooms: null,
      minBathrooms: null,
      poolCheckbox: false,
      wifiCheckbox: false,
      printerCheckbox: false,
      kitchenCheckbox: false,
    };
  },
  watch: {
    minPrice: "filterProperties",
    maxPrice: "filterProperties",
    minBedrooms: "filterProperties",
    minBathrooms: "filterProperties",
    poolCheckbox: "filterProperties",
    wifiCheckbox: "filterProperties",
    printerCheckbox: "filterProperties",
    kitchenCheckbox: "filterProperties",
  },
  methods: {
    clearSearch() {
      this.active_search = [];
      let checkboxes = document.querySelectorAll('[id^="myCheckbox"]');
      checkboxes.forEach(function (checkbox) {
        checkbox.checked = false;
      });
      // this.minPrice= null,
      // this.maxPrice: null,
      // this.minBedrooms: null,
      // this.minBathrooms: null,
    },
    filterProperties() {
      this.sortedProperties = [];
      console.log("plan list");

      for (let i = 0; i < this.properties.length; i++) {
        let property = this.properties[i];

        if (this.minPrice && property.price < this.minPrice) {
          if (!this.sortedProperties.includes(property)) {
            this.sortedProperties.push(property);
            console.log(this.sortedProperties);
          }
        }
        if (this.maxPrice && property.price > this.maxPrice) {
          if (!this.sortedProperties.includes(property)) {
            this.sortedProperties.push(property);
            console.log(this.sortedProperties);
          }
        }
        if (this.minBedrooms && property.numBeds == this.minBedrooms) {
          if (!this.sortedProperties.includes(property)) {
            this.sortedProperties.push(property);
            console.log(this.sortedProperties);
          }
        }
        if (this.minBathrooms && property.numBaths == this.minBathrooms) {
          if (!this.sortedProperties.includes(property)) {
            this.sortedProperties.push(property);
            console.log(this.sortedProperties);
          }
        }
        if (this.poolCheckbox && property.Pool == true) {
          if (!this.sortedProperties.includes(property)) {
            this.sortedProperties.push(property);
            console.log(this.sortedProperties);
          }
        }
        if (this.wifiCheckbox && property.Wifi == true) {
          if (!this.sortedProperties.includes(property)) {
            this.sortedProperties.push(property);
            console.log(this.sortedProperties);
          }
        }
        if (this.printerCheckbox && property.Printer == true) {
          if (!this.sortedProperties.includes(property)) {
            this.sortedProperties.push(property);
            console.log(this.sortedProperties);
          }
        }
        if (this.kitchenCheckbox && property.Kitchen == true) {
          if (!this.sortedProperties.includes(property)) {
            this.sortedProperties.push(property);
            console.log(this.sortedProperties);
          }
        }
      }
    },
  },

  created: function () {},
}).mount("#app");
