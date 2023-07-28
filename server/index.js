const express = require("express");
const cors = require("cors");
const model = require("./model");
const session = require("express-session");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const { getFileStream, uploadFile } = require("./s3");
const fs = require("fs");
const util = require("util");
const unlinkFile = util.promisify(fs.unlink);

const app = express();
const port = process.env.PORT || 8080;

app.use(express.static("public"));
app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: function (origin, callback) {
      callback(null, origin);
    },
  })
);
app.use(
  session({
    secret:
      "kdbdfiebfuiwnufewifbkenfibeifniwbfhwrfierfbiefiefieqneifnwf9eqrifnwfnwqofeowqneufbwuoefwoefiwbfiwbfkbif",
    cookie: { secure: false, httpOnly: false, sameSite: "lax" },
    saveUninitialized: true,
    resave: false,
  })
);
app.use(express.static("public"));

// middleware
function AuthMiddleware(req, res, next) {
  if (req.session && req.session.userId) {
    model.User.findOne({ _id: req.session.userId }).then((user) => {
      if (user) {
        req.user = user;
        next();
      } else {
        res.status(401).send("Unauthenticated");
      }
    });
  } else {
    res.status(401).send("Unauthenticated");
  }
}

// users
app.post("/users", function (req, res) {
  const newUser = new model.User({
    name: req.body.name,
    phoneNumber: req.body.phoneNumber,
    email: req.body.email,
  });
  newUser.setPassword(req.body.password).then(function () {
    newUser
      .save()
      .then(function () {
        res.status(201).send("User created.");
      })
      .catch(function (errors) {
        console.log(errors);
        res.status(422).send("Failed to create user.");
      });
  });
});

app.get("/users", function (req, res) {
  model.User.find().then(function (users) {
    res.send(users);
  });
});

app.get("/users/:usersId", function (req, res) {
  model.User.findOne({ _id: req.params.usersId }).then(function (user) {
    if (user) {
      res.send(user);
    } else {
      res.status(404).send("User not found.");
    }
  });
});

app.get("/users/:usersId/listings", function (req, res) {
  model.Property.find({ "creator": req.params.usersId }).then(function (
    properties
  ) {
    res.send(properties);
  });
});

app.put("/users/:usersId", function (req, res) {
  var usersId = req.params.usersId;
  model.User.findOne({ _id: usersId }).then((user) => {
    if (user) {
      user.verifyPassword(req.body.verifyPassword).then((result) => {
        if (result) {
          if (req.body.name) {
            user.name = req.body.name;
          }
          if (req.body.phoneNumber) {
            user.phoneNumber = req.body.phoneNumber;
          }
          if (req.body.email) {
            user.email = req.body.email;
          }
          if (req.body.password) {
            user.setPassword(req.body.password).then(function () {
              user
                .save()
                .then(function () {
                  res.status(200).send("Updated user.");
                })
                .catch((errors) => {
                  console.log(errors);
                  res.status(422).send("Error updating user.");
                });
            });
          } else {
            user
              .save()
              .then(function () {
                res.status(200).send("Updated user.");
              })
              .catch((errors) => {
                console.log(errors);
                res.status(422).send("Error updating user.");
              });
          }
        } else {
          console.log("password wrong");
        }
      });
    } else {
      res.status(404).send("User not found.");
    }
  });
});

app.put("/users/:usersId/:propertyId", AuthMiddleware, function (req, res) {
  var userId = req.params.usersId;
  var propertyId = req.params.propertyId;
  model.User.findOne({ _id: userId }).then((user) => {
    if (user) {
      if (user.savedListings.includes(propertyId)) {
        let index1 = user.savedListings.indexOf(propertyId);
        user.savedListings.splice(index1, 1);
      } else {
        user.savedListings.push(propertyId);
      }
      user
        .save()
        .then(function () {
          res.status(200).send("Saved Listing");
        })
        .catch((errors) => {
          console.log(errors);
          res.status(422).send("Error updating user.");
        });
    } else {
      res.status(404).send("User not found.");
    }
  });
});

// property
app.post("/properties", AuthMiddleware, function (req, res) {
  const newProperty = new model.Property({
    college: req.body.college,
    propertyName: req.body.college,
    address: req.body.address,
    rent: req.body.rent,
    rooms: req.body.rooms,
    bathrooms: req.body.bathrooms,
    private: req.body.private,
    wifi: req.body.wifi,
    washerDryer: req.body.washerDryer,
    parking: req.body.parking,
    amenities: req.body.amenities,
    description: req.body.description,

    // photos: req.body.photos,
    creator: req.user._id,
  });
  newProperty
    .save()
    .then(function () {
      res.status(201).send("Property listed.");
    })
    .catch(function (errors) {
      console.log(errors);
      res.status(422).send("Failed to list property.");
    });
});

app.get("/properties", function (req, res) {
  model.Property.find().then(function (properties) {
    // each prop has a key
    // for each property, getfilestream for img data
    // property.imgData = ^
    res.send(properties);
  });
});

app.get("/properties/:propertyId", function (req, res) {

  model.Property.findOne({ _id: req.params.propertyId }).then(function (property) {

    if (property) {
      res.send(property);
    } else {
      res.status(404).send(JSON.stringify("Property not found."));
    }
  });
});

app.delete("/properties/:propertiesId", AuthMiddleware, function (req, res) {
  model.Property.findOneAndDelete({ _id: req.params.propertiesId })
    .then(function (property) {
      if (property) {
        res.status(204).send("Property deleted.");
      } else {
        res.status(404).send("Property not found.");
      }
    })
    .catch(() => {
      res.status(400).send("Unable to delete question.");
    });
});

app.put("/properties/:propertiesId", AuthMiddleware, function (req, res) {
  model.Property.findOne({ _id: req.params.propertiesId }).then((property) => {
    if (property) {
      if (req.body.college) {
        property.college = req.body.college;
      }
      if (req.body.propertyName) {
        property.propertyName = req.body.propertyName;
      }
      if (req.body.address) {
        property.address = req.body.address;
      }

      if (req.body.rent) {
        property.rent = req.body.rent;
      }
      if (req.body.rooms) {
        property.rooms = req.body.rooms;
      }
      if (req.body.bathrooms) {
        property.bathrooms = req.body.bathrooms;
      }
      if (req.body.private) {
        property.private = req.body.private;
      }
      if (req.body.wifi) {
        property.wifi = req.body.wifi;
      }
      if (req.body.washerDryer) {
        property.washerDryer = req.body.washerDryer;
      }
      if (req.body.parking) {
        property.parking = req.body.parking;
      }
      if (req.body.amenities) {
        property.amenities = req.body.amenities;
      }

      property
        .save()
        .then(function () {
          res.status(200).send("Property updated");
        })
        .catch((errors) => {
          console.log(errors);
          res.status(422).send("Error updating property.");
        });
    } else {
      res.status(404).send("Property not found.");
    }
  });
});

// images
app.post("/images", upload.single("file"), async (req, res) => {
  const file = req.file;
  const result = await uploadFile(file);
  console.log(result);
  await unlinkFile("uploads/" + result.Key);
  // save listing with image(s) keys
  res.send({ imagePath: `/images/${result.Key}` });
});

app.get("/images/:bucket/:key", (req, res) => {
  // get key and bucket name from database for that property

  const key = req.params.key;
  const bucket = req.params.bucket;
  console.log(key, bucket);
  const readStream = getFileStream(key, bucket);

  readStream.pipe(res);
});

// session
app.get("/session", function (req, res) {
  res.send(req.session);
});

app.post("/session", function (req, res) {
  model.User.findOne({ email: req.body.email })
    .then((user) => {
      if (user) {
        // user exist now check password
        user.verifyPassword(req.body.password).then((result) => {
          if (result) {
            // password matches
            req.session.userId = user._id;
            req.session.name = user.name;
            res.status(201).send(req.session);
          } else {
            // password doesnt match
            res.status(401).send("Couldn't authenticate. Check email/password.");
          }
        });
      } else {
        // user doesnt exist
        res.status(401).send("Couldn't authenticate. Check email/password.");
      }
    })
    .catch((errors) => {
      console.log(errors);
    });
});

app.delete("/session", function (req, res) {
  req.session.userId = undefined;
  req.session.name = undefined;

  res.status(204).send(req.session);
});


app.listen(port, function () {
  console.log(`Running server on port ${port}...`);
});
