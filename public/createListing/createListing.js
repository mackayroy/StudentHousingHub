const URL = "http://localhost:8080/";
Vue.createApp({
  data() {
    return {
      userSession: false,
      search: "",
      ammenitylist: [],
      propertyInfo: {
        college: "",
        propertyName: "",
        address: "",
        rent: 0,
        rooms: 0,
        bathrooms: 0,
        private: false,
        wifi: false,
        washerDryer: false,
        parking: false,
        amenities: [],
        description: "",
      },
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
      console.log(this.propertyInfo);
      if (
        this.propertyInfo.college == "" ||
        this.propertyInfo.propertyName == "" ||
        this.propertyInfo.address == "" ||
        this.propertyInfo.rent == 0 ||
        this.propertyInfo.rooms == 0 ||
        this.propertyInfo.bathrooms == 0
      ) {
        alert("Please fill out all required fields");
        return;
      } else {
        let wifiCheckbox = document.querySelector("#wifi");
        let washerCheckbox = document.querySelector("#washer");
        let parkingCheckbox = document.querySelector("#parking");
        let privateCheckbox = document.querySelector("#private");
        if (privateCheckbox.checked) {
          this.propertyInfo.private = true;
        }
        if (wifiCheckbox.checked) {
          this.propertyInfo.wifi = true;
        }
        if (washerCheckbox.checked) {
          this.propertyInfo.washerDryer = true;
        }
        if (parkingCheckbox.checked) {
          this.propertyInfo.parking = true;
        }
      }
      // this.moveAmmenties();
      // this.pushListing();
    },
    moveAmmenties: function () {
      for (let i = 0; i < this.ammenitylist.length; i++) {
        this.propertyInfo.amenities.push(this.ammenitylist[i].text);
      }
    },

    pushListing: function () {
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      var options = {
        method: "POST",
        credentials: "include",
        headers: myHeaders,
        body: JSON.stringify(this.propertyInfo),
      };
      fetch(URL + "properties", options).then((response) => {
        if (response.status === 201) {
          alert("Property Listed!");
          this.propertyInfo = {
            college: "",
            propertyName: "",
            address: "",
            rent: 0,
            rooms: 0,
            bathrooms: 0,
            private: false,
            wifi: false,
            washerDryer: false,
            parking: false,
            amenities: [],
            description: "",
          };
        } else {
          alert("Error listing property");
        }
      });
    },

    addAmenity: function () {
      this.ammenitylist.push({ text: "" });
    },
    async postImage() {
      const formData = new FormData();
      formData.append("file", this.$refs.uploadImage.files[0]);
      try {
        const response = await fetch("http://localhost:8080/images", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const result = await response.json();
        return result;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
  },
  created: function () {},
}).mount("#app");
