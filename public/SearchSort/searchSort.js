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
          privetRoom: false,
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
          privetRoom: true,
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
          privetRoom: false,
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
          privetRoom: false,
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
          privetRoom: false,
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
          privetRoom: true,
        },
      ],
      sortedProperties: [],
      active_search: [],
      sort: false,
      minPrice: null,
      maxPrice: null,
      minBedrooms: null,
      minBathrooms: null,
      poolCheckbox: false,
      wifiCheckbox: false,
      printerCheckbox: false,
      kitchenCheckbox: false,
      privetRoomCheckbox: false,
      activeSort: "",
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
    privetRoomCheckbox: "filterProperties",
  },
  methods: {
    sortByLowestPrice: function () {
      this.properties.sort((a, b) => a.price - b.price);
      console.log("low");
      this.activeSort = "low";
    },

    sortByHighestPrice: function () {
      this.properties.sort((a, b) => b.price - a.price);
      console.log("high");
      this.activeSort = "high";
    },

    toggleDropdown: function () {
      var dropdownContent =
        document.getElementsByClassName("dropdown-content")[0];
      dropdownContent.classList.toggle("show");
    },
    clearSearch() {
      this.sortedProperties = [];
      let checkboxes = document.querySelectorAll('[id^="myCheckbox"]');
      checkboxes.forEach(function (checkbox) {
        checkbox.checked = false;
      });
      this.minPrice = null;
      this.maxPrice = null;
      this.minBedrooms = null;
      this.minBathrooms = null;
      this.poolCheckbox = false;
      this.wifiCheckbox = false;
      this.printerCheckbox = false;
      this.kitchenCheckbox = false;
      this.privetRoomCheckbox = false;
      this.sort = false;
    },

    filterProperties() {
      this.sortedProperties = [];

      for (let i = 0; i < this.properties.length; i++) {
        let property = this.properties[i];
        let meetsCriteria = true;
        this.sort = true;

        if (this.minPrice && property.price < this.minPrice)
          meetsCriteria = false;
        if (this.maxPrice && property.price > this.maxPrice)
          meetsCriteria = false;
        if (
          this.minBedrooms &&
          parseInt(property.numBeds) !== this.minBedrooms
        ) {
          meetsCriteria = false;
        }
        if (
          this.minBathrooms &&
          parseInt(property.numBaths) !== this.minBathrooms
        )
          meetsCriteria = false;
        if (this.poolCheckbox && property.Pool !== true) meetsCriteria = false;
        if (this.wifiCheckbox && property.Wifi !== true) meetsCriteria = false;
        if (this.printerCheckbox && property.Printer !== true)
          meetsCriteria = false;
        if (this.kitchenCheckbox && property.Kitchen !== true)
          meetsCriteria = false;
        if (this.privetRoomCheckbox && property.privetRoom !== true)
          meetsCriteria = false;

        if (meetsCriteria) {
          this.sortedProperties.push(property);
        }
      }
      console.log(this.sort);
      console.log(this.sortedProperties);
    },
    bookMark: function (index, type = "unsorted") {
      console.log(this.properties[index].bookMark);
      if (type === "sorted") {
        if (!this.sortedProperties[index].bookMark) {
          this.sortedProperties[index].bookMark = true;
        } else {
          this.sortedProperties[index].bookMark =
            !this.sortedProperties[index].bookMark;
        }
        console.log("bookMark sorted");
      } else {
        if (!this.properties[index].bookMark) {
          this.properties[index].bookMark = true;
        } else {
          this.properties[index].bookMark = !this.properties[index].bookMark;
        }
      }
    },
  },

  created: function () {},
}).mount("#app");
