Vue.createApp({
  data() {
    return {
      userSession: false,
      search: "",
      login: "false",
      lng: 0,
      lat: 0,
      address: "798 E St George Blvd, St. George, UT 84770",
      distance: 0,
    };
  },
  methods: {
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
      const distanceMiles = (distanceKm * 0.621371).toFixed(2);

      return distanceMiles;
    },
    degToRad(degrees) {
      return (degrees * Math.PI) / 180;
    },
    coordinates() {
      fetch(
        "https://maps.googleapis.com/maps/api/geocode/json?address=" +
          this.address +
          "&key=AIzaSyCqxIxZcHaBCF5z_I73rdc53GkkmF3KHOw"
      )
        .then((response) => response.json())
        .then((data) => {
          this.lat = data.results[0].geometry.location.lat;
          this.lng = data.results[0].geometry.location.lng;
          this.map();
          const point1 = {
            lat: 37.10365039754121,
            lng: -113.56533764727399,
          };
          const point2 = {
            lat: this.lat,
            lng: this.lng,
          };
          this.distance = this.calculateDistance(
            point1.lat,
            point1.lng,
            point2.lat,
            point2.lng
          );
        });
    },
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
          center: { lat: 37.10365039754121, lng: -113.56533764727399 },
        });
        addMarker({ lat: 37.10365039754121, lng: -113.56533764727399 });
        addMarker({ lat: this.lat, lng: this.lng });
      }
      initMap.call(this);
    },
    loginBtn() {
      this.login = "true";
    },
  },
  created() {
    this.coordinates();
  },
}).mount("#app");
