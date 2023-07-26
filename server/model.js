const mongoose = require("mongoose");
const { Schema } = mongoose;
const dotenv = require("dotenv");
dotenv.config();
const { rejects } = require("assert");
const bcrypt = require("bcryptjs");

mongoose.set("strictQuery", false);
mongoose.connect(process.env.DB_LINK);

const PhotoSchema = new mongoose.Schema({
  key: {
    type: String,
    required: [true],
  },
  bucketName: {
    type: String,
    required: [true, "Bucket must have a name."],
  },
});

const PropertySchema = new mongoose.Schema({
  college: {
    type: String,
    required: [true, "Property must have a college."],
  },
  propertyName: {
    type: String,
  },
  address: {
    type: String,
    required: [true, "Property must have an address"],
  },
  rent: {
    type: String,
    required: [true, "Property must have rent listed."],
  },
  rooms: {
    type: Number,
    required: [true, "Property must have rooms listed."],
  },
  bathrooms: {
    type: String,
    required: [true, "Property must have bathrooms listed."],
  },
  private: {
    type: Boolean,
    required: [true, "Must be set to true or false."],
  },
  wifi: {
    type: Boolean,
    required: [true, "Must be set to true or false."],
  },
  washerDryer: {
    type: Boolean,
    required: [true, "Must be set to true or false."],
  },
  parking: {
    type: String,
    required: [true, "Property must have parking listed."],
  },
  description: {
    type: String,
    required: [true, "Property must have a description."],
  },
  amenities: [String],
  photos: [PhotoSchema],
  description: {
    type: String,
    required: [true, "Must have a description"],
  },
  creator: String,
});

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "User must have a name."],
  },
  phoneNumber: {
    type: String,
    required: [true, "User must have a phone number."],
    unique: true,
  },
  email: {
    type: String,
    required: [true, "User must have a email."],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "User must have a password."],
  },
  savedListings: [String],
});

UserSchema.methods.setPassword = function (plainPassword) {
  var promise = new Promise((resolve, reject) => {
    bcrypt.hash(plainPassword, 12).then((hashedPassword) => {
      console.log(hashedPassword);
      this.password = hashedPassword;
      console.log(this.password);
      resolve();
    });
  });
  return promise;
};

UserSchema.methods.verifyPassword = function (plainPassword) {
  var promise = new Promise((resolve, reject) => {
    bcrypt.compare(plainPassword, this.password).then((result) => {
      resolve(result);
    });
  });
  return promise;
};

const Photo = mongoose.model("Photo", PhotoSchema);
const User = mongoose.model("User", UserSchema);
const RedactedUser = mongoose.model("RedactedUser", UserSchema);
const Property = mongoose.model("Property", PropertySchema);

User.createCollection();
RedactedUser.createCollection({
  viewOn: "users",
  pipeline: [
    {
      $set: {
        name: "$name",
        email: "$email",
        passord: "***",
      },
    },
  ],
});

module.exports = {
  Photo: Photo,
  User: User,
  RedactedUser: RedactedUser,
  Property: Property,
};

//hello
