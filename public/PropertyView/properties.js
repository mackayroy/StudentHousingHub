Vue.createApp({
  data() {
    return {
      userSession: false,
      search: "",
      login: "false",
      lng: 0,
      lat: 0,
      collegeLat: 0,
      collegeLng: 0,
      distance: 0,

      userInfo: {
        name: "Bob Smith",
        phoneNumber: "801-555-5555",
        email: "bobsmith@gmail.com",
      },

      propertyInfo: {
        college: "UVU",
        propertyName: "Campus View Apartments",
        address: "432 S Tech Ridge Dr, St. George, UT 84770",
        rent: 450,
        rooms: 2,
        bathrooms: 2,
        private: true,
        wifi: true,
        washerDryer: false,
        parking: false,
        amenities: ["Pool", "Kitchen", "Gym", "Hot Tub", "Tennis Court", "BBQ"],
        description: "Weloome to Campus View Apartments! ",
      },
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
      } catch (error) {
        console.error("Error fetching coordinates:", error);
      }
    },
    // Function to display the map and create markers
    map() {
      const addMarker = (coords) => {
        var marker = new google.maps.Marker({
          position: coords,
          map: map,
        });
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
        addMarker({ lat: this.collegeLat, lng: this.collegeLng });
        addMarker({ lat: this.lat, lng: this.lng });
      }
      initMap.call(this);
    },

    // Function to display the login form
    loginBtn() {
      this.login = "true";
    },

    // Function to display the get the property information
    getProperty: function () {
      fetch(URL + "properties")
        .then((response) => response.json())
        .then((data) => {
          this.propertyInfo = data;
        });
    },
    getUserInfo: function () {
      fetch(URL + "users")
        .then((response) => response.json())
        .then((data) => {
          this.userInfo = data;
        });
    },
  },
  created() {
    this.fetchCoordinates();
  },
}).mount("#app");
