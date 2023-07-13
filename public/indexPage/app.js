const URL = "http://localhost:8080/";

Vue.createApp({
  data() {
    return {
      userSession: false,
      search: "",
      showModal: false,
      currentModal: "signin",
      user: {
        name: "",
        email: "",
        phoneNumber: "",
        password: "",
      },
      loginUser: {
        email: "",
        password: "",
      },
    };
  },
  methods: {
    toggleModal: function () {
      if (this.showModal) {
        this.showModal = false;
      } else {
        this.showModal = true;
      }
    },
    swapModal: function () {
      this.name = "";
      this.email = "";
      this.phone = "";
      this.password = "";
      if (this.currentModal == "signin") {
        this.currentModal = "signup";
      } else {
        this.currentModal = "signin";
      }
    },

    // Sessions and users

    signUp: function () {
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      var options = {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify(this.user),
      };

      fetch(URL + "users", options).then((response) => {
        if (response.status == 201) {
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
        body: JSON.stringify(this.loginUser),
        credentials: "include",
      };

      fetch(URL + "session", options).then((response) => {
        if (response.status == 201) {
          response.text().then((data) => {
            if (data) {
              data = JSON.parse(data);
              this.user.name = data.name;
              this.userSession = true;
              this.toggleModal();
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
            console.log(data && data.cookie && data.userId);
            this.userSession = true;
          }
        });
    },
    signOut: function () {
      var options = {
        method: "DELETE",
        credentials: "include",
      };
      fetch(URL + "session", options).then((response) => {
        this.user.name = "";
      });
    },
  },
  created: function () {
    this.loggedIn();
  },
}).mount("#app");
