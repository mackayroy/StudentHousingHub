const URL = "https://studenthousinghub-production.up.railway.app/";
Vue.createApp({
  data() {
    return {
      propertyId: "",
      search: "",
      login: "false",
      lng: 0,
      lat: 0,
      collegeLat: 0,
      collegeLng: 0,
      distance: 0,

      userInfo: {
        name: "",
        phoneNumber: "",
        email: "",
      },

      propertyInfo: {
        college: "",
        propertyName: "",
        address: "",
        rent: null,
        rooms: null,
        bathrooms: null,
        private: false,
        wifi: false,
        washerDryer: false,
        parking: false,
        amenities: [],
        description: "",
        creator: "",
      },
      userSession: false,
      heroSearch: "",
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
      showSavedModal: false,
      showMyListingsModal: false,
      savedListings: [],
    };
  },
  methods: {
    // Function to calculate the distance between two coordinates in miles
    calculateDistance(lat1, lon1, lat2, lon2) {
      const earthRadiusKm = 6371; // Radius of the Earth in kilometers

      // Convert latitude and longitude from degrees to radians
      const latRad1 = this.degToRad(lat1);
      const lonRad1 = this.degToRad(lon1);
      const latRad2 = this.degToRad(lat2);
      const lonRad2 = this.degToRad(lon2);

      // Calculate the differences between the coordinates
      const latDiff = latRad2 - latRad1;
      const lonDiff = lonRad2 - lonRad1;

      // Use the Haversine formula to calculate the distance in kilometers
      const a =
        Math.sin(latDiff / 2) ** 2 +
        Math.cos(latRad1) * Math.cos(latRad2) * Math.sin(lonDiff / 2) ** 2;
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distanceKm = earthRadiusKm * c;

      // Convert distance from kilometers to miles
      const distanceMiles = (distanceKm * 0.621371).toFixed(1);

      return distanceMiles;
    },
    degToRad(degrees) {
      return (degrees * Math.PI) / 180;
    },
    // Function to get the coordinates of the address
    async fetchCoordinates() {
      try {
        const collegeResponse = await fetch(
          "https://maps.googleapis.com/maps/api/geocode/json?address=" +
            this.propertyInfo.college +
            "&key=AIzaSyCqxIxZcHaBCF5z_I73rdc53GkkmF3KHOw"
        );
        const collegeData = await collegeResponse.json();
        this.collegeLat = collegeData.results[0].geometry.location.lat;
        this.collegeLng = collegeData.results[0].geometry.location.lng;

        const propertyResponse = await fetch(
          "https://maps.googleapis.com/maps/api/geocode/json?address=" +
            this.propertyInfo.address +
            "&key=AIzaSyCqxIxZcHaBCF5z_I73rdc53GkkmF3KHOw"
        );
        const propertyData = await propertyResponse.json();
        this.lat = propertyData.results[0].geometry.location.lat;
        this.lng = propertyData.results[0].geometry.location.lng;

        this.distance = this.calculateDistance(
          this.collegeLat,
          this.collegeLng,
          this.lat,
          this.lng
        );

        // Call the map function here after coordinates are fetched
        this.map();
      } catch (error) {}
    },
    // Function to display the map and create markers
    map() {
      const addMarker = (props) => {
        var marker = new google.maps.Marker({
          position: props.coords,
          map: map,
        });
        if (props.content) {
          var infoWindow = new google.maps.InfoWindow({
            content: props.content,
          });
          marker.addListener("click", function () {
            infoWindow.open(map, marker);
          });
        }
      };

      let map;
      async function initMap() {
        const { Map } = await google.maps.importLibrary("maps");
        const { AdvancedMarkerElement } = await google.maps.importLibrary(
          "marker"
        );
        map = new Map(document.getElementById("map"), {
          zoom: 10,
          center: { lat: this.collegeLat, lng: this.collegeLng },
        });
        addMarker({
          coords: { lat: this.collegeLat, lng: this.collegeLng },
          content: "<h3>College</h3>",
        });
        addMarker({
          coords: { lat: this.lat, lng: this.lng },
          content: "<h3>Property</h3>",
        });
      }
      initMap.call(this);
    },

    // Function to display the login form
    loginBtn() {
      this.login = "true";
    },

    // Function to display the get the property information
    getProperty: function () {
      fetch(URL + "properties/" + this.propertyId)
        .then((response) => response.json())
        .then((data) => {
          this.propertyInfo = data;
          this.getUserInfo();
          this.fetchCoordinates();
        });
    },

    getUserInfo: function () {
      fetch(URL + "users/" + this.propertyInfo.creator)
        .then((response) => response.json())
        .then((data) => {
          this.userInfo = data;
        });
    },
    navSaveListing: function (index) {
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      var options = {
        method: "PUT",
        headers: myHeaders,
        credentials: "include",
      };

      fetch(
        URL + "users/" + this.userId + "/" + this.savedListings[index]._id,
        options
      ).then((response) => {
        if (response.status != 200) {
          alert("Unable to save listing.");
        } else {
          this.savedListings.splice(index, 1);

          this.user.savedListings.push(this.properties[index]._id);
        }
      });
    },
    getMyListings: function () {
      fetch(URL + "users/" + this.userId + "/listings")
        .then((response) => response.json())
        .then((data) => {
          this.user.myListings = data;
        });
    },
    // Sign In / Up Modal
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

    // Saved Modal
    toggleSavedModal: function () {
      if (this.showSavedModal) {
        this.showSavedModal = false;
      } else {
        this.showSavedModal = true;
      }
    },

    // My Listings Modal

    toggleMyListingsModal: function () {
      if (this.showMyListingsModal) {
        this.showMyListingsModal = false;
      } else {
        this.showMyListingsModal = true;
      }
      console.log(this.user);
    },

    deleteListing: function (index) {
      var listingId = this.user.myListings[index]._id;
      var requestOptions = {
        method: "DELETE",
      };

      fetch(URL + "properties/" + listingId, requestOptions).then(
        (response) => {
          if (response.status === 204) {
            console.log("Listing deleted");
            this.user.myListings.splice(index, 1);
          } else {
            alert("Not able to delete listing");
          }
        }
      );
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
    toCreateListing: function () {
      window.location.href = "../createListing/createListing.html";
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
              this.getMyListings();
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
            this.getMyListings();
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
        this.user = {};
        this.userId = "";
        window.location.href = "index.html";
      });
    },
    setUser: function () {
      fetch(URL + "users/" + this.userId)
        .then((response) => response.json())
        .then((data) => {
          this.user = data;
          this.user.savedListings.forEach((listingId) => {
            fetch(URL + "properties/" + listingId)
              .then((response) => response.json())
              .then((data) => {
                if (data !== "Property not found.") {
                  console.log(data);
                  this.savedListings.push(data);
                }
              });
          });
          this.getMyListings();
        });
    },
  },
  created() {
    this.propertyId = window.location.href.split("=")[1];
    this.loggedIn();
    this.getProperty();
    this.loginBtn();
  },
}).mount("#app");
