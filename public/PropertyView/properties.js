Vue.createApp({
  data() {
    return {
      userSession: false,
      search: "",
    };
  },
  methods: {
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
        addMarker({ lat: 38.10365039754121, lng: -113.56533764727399 });
      }
      initMap();
    },
  },
  created: function () {
    this.map();
  },
}).mount("#app");
