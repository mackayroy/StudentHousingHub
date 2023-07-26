const URL = "http://localhost:8080/";

Vue.createApp({
  data() {
    return {
      userSession: false,
      search: "",
      showMobileContainer: false,
      properties: [],
      sortedProperties: [],
      searchedProperties: [],
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
      userSession: false,
      showNavModal: false,
      showProfileModal: false,
      showContactModal: false,
      showSettingsModal: false,
      currentNavModal: "signin",
      navUser: {
        name: "",
        email: "",
        phoneNumber: "",
        password: "",
      },
      navLoginUser: {
        email: "",
        password: "",
      },
      settingsUser: {
        changePhoto: false,
        name: "",
        changeName: false,
        email: "",
        changeEmail: false,
        phoneNumber: "",
        verifyPassword: "",
        changePhoneNumber: false,
        password: "",
        changePassword: false,
      },
      user: {},
      userId: "",
      updateUser: {},
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

    search(newSearch, oldSearch) {
      if (this.sort) {
        this.sortedProperties = this.sortedProperties.filter((pro) => {
          return (
            pro.name.toLowerCase().includes(newSearch.toLowerCase()) ||
            pro.location.toLowerCase().includes(newSearch.toLowerCase()) ||
            pro.university.toLowerCase().includes(newSearch.toLowerCase())
          );
        });
      }
      this.searchedProperties = this.properties.filter((pro) => {
        return (
          pro.name.toLowerCase().includes(newSearch.toLowerCase()) ||
          pro.location.toLowerCase().includes(newSearch.toLowerCase()) ||
          pro.university.toLowerCase().includes(newSearch.toLowerCase())
        );
      });
    },
  },
  methods: {
    getListings: function () {
      fetch(URL + "properties")
        .then((response) => response.json())
        .then((data) => {
          for (let i = 0; i < data.length; i++) {
            if (this.user.savedListings.includes(data[i]._id)) {
              data[i].saved = true;
            } else {
              data[i].saved = false;
            }
            console.log(data[i].saved);
          }
          this.properties = data;
        });
    },
    toCreateListing: function () {
      window.location.href = "../createListing/createListing.html";
    },
    saveListing: function (index) {
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      var options = {
        method: "PUT",
        headers: myHeaders,
        credentials: "include",
      };

      fetch(URL + "users/" + this.userId + "/" + this.properties[index]._id, options).then(
        (response) => {
          if (response.status != 200) {
            alert("Unable to save listing.");
          } else {
            if (this.properties[index].saved) {
              this.properties[index].saved = false;
            } else {
              this.properties[index].saved = true;
            }
            this.user.savedListings.push(this.properties[index]._id);
          }

        }
      });
    },
    toggleNavModal: function () {
      this.navUser.name = "";
      this.navUser.email = "";
      this.navUser.phone = "";
      this.navUser.password = "";
      this.navLoginUser.email = "";
      this.navLoginUser.password = "";
      if (this.showNavModal) {
        this.showNavModal = false;
      } else {
        this.showNavModal = true;
      }
    },
    swapNavModal: function () {
      x;
      this.navUser.name = "";
      this.navUser.email = "";
      this.navUser.phone = "";
      this.navUser.password = "";
      this.navLoginUser.email = "";
      this.navLoginUser.password = "";
      if (this.currentNavModal == "signin") {
        this.currentNavModal = "signup";
      } else {
        this.currentNavModal = "signin";
      }
    },
    goToProperty: function (index) {
      window.location.href =
        "../PropertyView/properties.html?p=" + this.properties[index]._id;
    },

    // Profile Modal
    toggleProfileModal: function () {
      if (this.showProfileModal) {
        this.showProfileModal = false;
      } else {
        this.showProfileModal = true;
      }
    },

    // Contact Modal
    toggleContactModal: function () {
      if (this.showContactModal) {
        this.showContactModal = false;
      } else {
        this.showContactModal = true;
      }
    },

    // Settings Modal
    toggleSettingsModal: function () {
      if (this.showSettingsModal) {
        this.showSettingsModal = false;

        this.settingsUser.changePhoto = false;
        this.settingsUser.changeName = false;
        this.settingsUser.changeEmail = false;
        this.settingsUser.changePhoneNumber = false;
        this.settingsUser.changePassword = false;
        this.settingsUser.verifyPassword = "";
      } else {
        this.showSettingsModal = true;
      }
    },
    updateProfile: function () {
      if (!this.settingsUser.name) {
        this.settingsUser.name = this.user.name;
      }
      if (!this.settingsUser.email) {
        this.settingsUser.email = this.user.email;
      }
      if (!this.settingsUser.phoneNumber) {
        this.settingsUser.phoneNumber = this.user.phoneNumber;
      }

      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      if (!this.settingsUser.password) {
        this.updateUser = {
          name: this.settingsUser.name,
          email: this.settingsUser.email,
          phoneNumber: this.settingsUser.phoneNumber,
          verifyPassword: this.settingsUser.verifyPassword,
        };
      } else {
        this.updateUser = {
          name: this.settingsUser.name,
          email: this.settingsUser.email,
          phoneNumber: this.settingsUser.phoneNumber,
          password: this.settingsUser.password,
          verifyPassword: this.settingsUser.verifyPassword,
        };
      }

      var options = {
        method: "PUT",
        headers: myHeaders,
        body: JSON.stringify(this.updateUser),
        credentials: "include",
      };

      fetch(URL + "users/" + this.userId, options).then((response) => {
        if (response.status == 200) {
          this.user.name = this.settingsUser.name;
          this.user.email = this.settingsUser.email;
          this.user.phoneNumber = this.settingsUser.phoneNumber;
          this.user.password = this.settingsUser.password;
          this.toggleSettingsModal();
        } else {
          alert("Unable to update user.");
        }
      });
    },

    togglePhoto: function () {
      if (this.settingsUser.changePhoto) {
        this.settingsUser.changePhoto = false;
      } else {
        this.settingsUser.changePhoto = true;
      }
    },
    toggleName: function () {
      if (this.settingsUser.changeName) {
        this.settingsUser.changeName = false;
        this.settingsUser.name = "";
      } else {
        this.settingsUser.changeName = true;
      }
    },
    toggleEmail: function () {
      if (this.settingsUser.changeEmail) {
        this.settingsUser.changeEmail = false;
        this.settingsUser.email = "";
      } else {
        this.settingsUser.changeEmail = true;
      }
    },
    togglePhoneNumber: function () {
      if (this.settingsUser.changePhoneNumber) {
        this.settingsUser.changePhoneNumber = false;
        this.settingsUser.phoneNumber = "";
      } else {
        this.settingsUser.changePhoneNumber = true;
      }
    },
    togglePassword: function () {
      if (this.settingsUser.changePassword) {
        this.settingsUser.changePassword = false;
        this.settingsUser.password = "";
      } else {
        this.settingsUser.changePassword = true;
      }
    },

    // Sessions and users

    signUp: function () {
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      var options = {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify(this.navUser),
      };

      fetch(URL + "users", options).then((response) => {
        if (response.status == 201) {
          this.navLoginUser.email = this.navUser.email;
          this.navLoginUser.password = this.navUser.password;
          this.createSession();
        } else {
          alert("Unable to create user.");
        }
      });
    },
    createSession: function () {
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      var options = {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify(this.navLoginUser),
        credentials: "include",
      };

      fetch(URL + "session", options).then((response) => {
        if (response.status == 201) {
          response.text().then((data) => {
            if (data) {
              data = JSON.parse(data);
              this.userId = data.userId;
              this.setUser();
              this.userSession = true;
              this.toggleNavModal();
            } else {
              alert("Can't log in.");
            }
          });
        } else {
          ("Unable to create user.");
        }
      });
    },
    loggedIn: function () {
      var options = {
        credentials: "include",
      };

      fetch(URL + "session", options)
        .then((response) => response.json())
        .then((data) => {
          if (data && data.cookie && data.userId) {
            this.userSession = true;
            this.userId = data.userId;
            this.user = data;
            this.setUser();
          }
        });
    },
    signOut: function () {
      var options = {
        method: "DELETE",
        credentials: "include",
      };
      fetch(URL + "session", options).then((response) => {
        this.navUser.name = "";
      });
    },
    setUser: function () {
      fetch(URL + "users/" + this.userId)
        .then((response) => response.json())
        .then((data) => {
          this.user = data;
          this.getListings();
        });
    },
    sortByLowestPrice: function () {
      this.properties.sort((a, b) => a.price - b.price);
      this.sortedProperties.sort((a, b) => a.price - b.price);
      this.activeSort = "low";
    },

    sortByHighestPrice: function () {
      this.properties.sort((a, b) => b.price - a.price);
      this.sortedProperties.sort((a, b) => b.price - a.price);
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
    },
    bookMark: function (index, type = "unsorted") {
      if (type === "sorted") {
        if (!this.sortedProperties[index].bookMark) {
          this.sortedProperties[index].bookMark = true;
        } else {
          this.sortedProperties[index].bookMark =
            !this.sortedProperties[index].bookMark;
        }
      } else {
        if (!this.properties[index].bookMark) {
          this.properties[index].bookMark = true;
        } else {
          this.properties[index].bookMark = !this.properties[index].bookMark;
        }
      }
    },
    searchProperties: function () {
      if (this.search) {
        return true;
      }
    },
    sortProperties: function () {
      if (!this.search && this.sort) {
        return true;
      }
    },
    baseProperties: function () {
      if (!this.search && !this.sort) {
        return true;
      }
    },
  },

  created: function () {
    if (sessionStorage.getItem("search")) {
      this.search = sessionStorage.getItem("search");
      sessionStorage.removeItem("search");
    }
    this.loggedIn();
  },
}).mount("#app");
