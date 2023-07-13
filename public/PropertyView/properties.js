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
    photos: function () {
      document.querySelectorAll(".carousel").forEach((carousel) => {
        const items = carousel.querySelectorAll(".carousel__item");
        const buttonsHtml = Array.from(items, () => {
          return `<span class="carousel__button"></span>`;
        });

        carousel.insertAdjacentHTML(
          "beforeend",
          `
          <div class="carousel__nav">
            ${buttonsHtml.join("")}
          </div>
        `
        );

        const buttons = carousel.querySelectorAll(".carousel__button");

        buttons.forEach((button, i) => {
          button.addEventListener("click", () => {
            // un-select all the items
            items.forEach((item) =>
              item.classList.remove("carousel__item--selected")
            );
            buttons.forEach((button) =>
              button.classList.remove("carousel__button--selected")
            );

            items[i].classList.add("carousel__item--selected");
            button.classList.add("carousel__button--selected");
          });
        });

        // Select the first item on page load
        items[0].classList.add("carousel__item--selected");
        buttons[0].classList.add("carousel__button--selected");
      });
    },
  },
  created: function () {
    this.map();
    this.photos();
  },
}).mount("#app");
