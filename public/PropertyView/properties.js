Vue.createApp({
  data() {
    return {
      userSession: false,
      search: "",
      login: "false",
      lng: 0,
      lat: 0,
      address: "669 S 700 E, Saint George, UT 84770",
    };
  },
  methods: {
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
