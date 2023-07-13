Vue.createApp({
  data() {
    return {
      userSession: false,
      search: "",
      login: "false",
      lng: 0,
      lat: 0,
    };
    //
  },
  methods: {
    coordinates: function () {
      fetch(
        "https://maps.googleapis.com/maps/api/geocode/json?address=1600 Amphitheatre Parkway, Mountain View, CA&key=AIzaSyCqxIxZcHaBCF5z_I73rdc53GkkmF3KHOw"
      )
        .then((response) => response.json())
        .then((data) => {
          this.lat = data.results[0].geometry.location.lat;
          this.lng = data.results[0].geometry.location.lng;
          console.log(this.lat, this.lng);
        });
    },

    map: function () {
      function addMarker(coords) {
        var marker = new google.maps.Marker({
          position: coords,
          map: map,
        });
      }

      let map;
      async function initMap() {
        //@ts-ignore
        const { Map } = await google.maps.importLibrary("maps");
        const { AdvancedMarkerElement } = await google.maps.importLibrary(
          "marker"
        );
        map = new Map(document.getElementById("map"), {
          zoom: 8,
          center: { lat: 37.10365039754121, lng: -113.56533764727399 },
        });
        addMarker({ lat: 37.10365039754121, lng: -113.56533764727399 });
        addMarker({ lat: this.lat, lng: this.lng });
      }
      initMap();
    },
    loginBtn: function () {
      this.login = "true";
    },
  },
  created: function () {
    this.map();
    this.coordinates();
  },
}).mount("#app");
