Vue.createApp({
  data() {
    return {
      userSession: false,
      search: "",
      propertyInfo: {
        name: "",
        address: "",
        price: 0,
        beds: 0,
        baths: 0,
      },

      amenities: [],
      otherAmenities: [],
      description: "",
    };
  },
  methods: {
    photos: function () {
      document.querySelector("#files").addEventListener("change", (e) => {
        if (
          window.File &&
          window.FileReader &&
          window.FileList &&
          window.Blob
        ) {
          const files = e.target.files;
          const output = document.querySelector("#result");

          for (let i = 0; i < files.length; i++) {
            if (!files[i].type.match("image")) continue;
            const picReader = new FileReader();
            picReader.addEventListener("load", function (event) {
              const picFile = event.target;
              const div = document.createElement("div");
              console.log(picFile.result);
              div.innerHTML = `<img class="thumbnail" src="${picFile.result}" title="${picFile.name}"/>`;
              output.appendChild(div);
            });
            picReader.readAsDataURL(files[i]);
          }
        } else {
          alert("The File APIs are not fully supported in this browser.");
        }
      });
    },
    submitForm: function () {
      if (
        this.propertyInfo.name == "" ||
        this.propertyInfo.address == "" ||
        this.propertyInfo.price == 0 ||
        this.propertyInfo.beds == 0 ||
        this.propertyInfo.baths == 0
      ) {
        alert("Please fill out all required fields");
        return;
      } else {
        let wifiCheckbox = document.querySelector("#wifi");
        let washerCheckbox = document.querySelector("#washer");
        let parkingCheckbox = document.querySelector("#parking");
        let privateCheckbox = document.querySelector("#private");
        if (wifiCheckbox.checked) {
          this.amenities.push("Wifi");
        }
        if (washerCheckbox.checked) {
          this.amenities.push("Washer");
        }
        if (parkingCheckbox.checked) {
          this.amenities.push("Parking");
        }
        if (privateCheckbox.checked) {
          this.amenities.push("Private");
        }
        for (let i = 0; i < this.otherAmenities.length; i++) {
          if (this.otherAmenities[i].text != "") {
            this.amenities.push(this.otherAmenities[i].text);
          }
        }
        console.log(this.amenities);
      }
    },
    addAmenity: function () {
      this.otherAmenities.push({ text: "" });
    },
  },
  created: function () {},
}).mount("#app");
