const mongoose = require("mongoose");
const { Schema } = mongoose;
const dotenv = require("dotenv");
dotenv.config();
const { rejects } = require("assert");
const bcrypt = require('bcryptjs');

mongoose.set("strictQuery", false);
mongoose.connect(process.env.DB_LINK);


const PhotoSchema = new mongoose.Schema({
  key: {
    type: String,
    required: [true]
  },
  bucketName: {
    type: String,
    required: [true, 'Bucket must have a name.']
  }
});


const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'User must have a name.']
  },
  phoneNumber: {
    type: Number,
    required: [true, 'User must have a phone number.']
  },
  email: {
    type: String,
    required: [true, 'User must have a email.']
  },
  password: {
    type: String,
    required: [true, 'User must have a password.']
  },

});

UserSchema.methods.setPassword = function(plainPassword) {
  var promise = new Promise((resolve, reject) => {
    bcrypt.hash(plainPassword, 12).then(hashedPassword => {
      console.log(hashedPassword)
      this.password = hashedPassword;
      console.log(this.password)
      resolve();
    })
  });
  return promise;
}

UserSchema.methods.verifyPassword = function(plainPassword) {
  var promise  = new Promise((resolve, reject) => {
    bcrypt.compare(plainPassword, this.password).then(result => {
      resolve(result);
    });
  });
  return promise; 
}

const Photo = mongoose.model("Photo", PhotoSchema);
const User  = mongoose.model("User", UserSchema);
const RedactedUser = mongoose.model("RedactedUser", UserSchema)


User.createCollection();
RedactedUser.createCollection({
    viewOn: 'users',
    pipeline: [{
        $set: {
            name: '$name',
            email: '$email',
            passord: '***'
        }
    }]
});


module.exports = {
  Photo: Photo,
  User: User,
  RedactedUser: RedactedUser
};
