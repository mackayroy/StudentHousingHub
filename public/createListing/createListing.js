const URL = "http://localhost:8080/";

Vue.createApp({
  data() {
    return {
      search: "",
      ammenitylist: [],
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
        // photos: "",
        creator: "",
      },
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
      user: {
        name: "",
        email: "",
        phoneNumber: "",
        password: "",
      },
      userId: "",
      updateUser: {},
    };
  },
  methods: {
    backtoHome: function () {
      window.location.href = "../index.html";
    },
    toCreateListing: function () {
      window.location.href = "../createListing/createListing.html";
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
          this.user.name = data.name;
          this.user.email = data.email;
          this.user.phoneNumber = data.phoneNumber;
          this.user.password = data.password;
        });
    },
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
        this.propertyInfo.rent == null ||
        this.propertyInfo.rooms == null ||
        this.propertyInfo.bathrooms == null
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
      this.moveAmmenties();
      this.pushListing();
      this.propertyInfo.creator = this.userId;
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
          window.location.href = "../index.html";
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
  created: function () {
    this.loggedIn();
  },
}).mount("#app");
