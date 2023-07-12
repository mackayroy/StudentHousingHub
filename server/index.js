const express = require("express");
const cors = require("cors");
const model = require("./model");
const session = require('express-session')
// const { getFileStream, uploadFile } = require("./s3");

const app = express();
const port = 8080;

app.use(express.json());
app.use(cors());
app.use(session({
  secret: "kdbdfiebfuiwnufewifbkenfibeifniwbfhwrfierfbiefiefieqneifnwf9eqrifnwfnwqofeowqneufbwuoefwoefiwbfiwbfkbif",
  saveUninitialized: true,
  resave: false
}));

// middleware
function AuthMiddleware(req, res, next) {
  if (req.session && req.session.userId) {
      model.User.findOne({'_id': req.session.userId}).then(user => {
          if (user) {
              req.user = user;
              next(); // proceed to next process
          }
          else {
              res.status(401).send('Unauthenticated') // user doesnt exist
          }
      })
  }
  else {
      res.status(401).send('Unauthenticated') // no session to authorize
  }
}

// // photos ***Not finished with photos section gonna come back to it later***
// app.get('/photos/:key', function(req, res) {
//   console.log(req.params);
//   const key = req.params;
//   const readStream = getFileStream(key);

//   readStream.pipe();
// });

// app.post('/photos', upload.single('photo'), async function(req, res) {
//     const file = req.file;
//     console.log(file);

//     const result = await uploadFile(file);
//     await unlinkFile(file.path);
//     console.log(result);
// });

// users
app.post('/users', function(req, res) {
  const newUser = new model.User({
    name: req.body.name,
    phoneNumber: req.body.phoneNumber,
    email: req.body.email
  })
  newUser.setPassword(req.body.password).then(function() {
    newUser.save().then(function() {
      res.status(201).send('User created.');
    }).catch(function(errors) {
      console.log(errors)
      res.status(422).send('Failed to create user.')
    });
  });
});

app.get('/users', function(req, res) {
  model.User.find().then(function(users) {
    res.send(users)
  })
})

app.get('/users/:usersId', function(req, res) {
  model.User.findOne({'_id': req.params.usersId}).then(function(user) {
    if (user){
      res.send(user)
    }
    else {
      res.status(404).send('User not found.')
    }
  })
})

app.put("/users/:usersId", function(req, res) {
  var usersId = req.params.usersId;
  model.User.findOne({'_id': usersId}).then(user => {
      if (user){
        user.name = req.body.name,
        
        user.save().then(function() {
          res.status(200).send('Updated user.')
        }).catch(errors => {
          console.log(errors);
          res.status(422).send('Error updating user.')
        })
      }
      else {
        res.status(404).send('User not found.')
      }
  })
});



// session
app.get('/session', function(req, res) {
  console.log(req.session);
  res.send(req.session);
});

app.post('/session', function(req, res) {

  model.User.findOne({'email': req.body.email}).then(user => {
      if (user) {
          // user exist now check password
          user.verifyPassword(req.body.password).then(result => {
              if (result) {
                  // password matches
                  req.session.userId = user._id
                  req.session.name = user.name
                  res.status(201).send(req.session)
              }
              else {
                  // password doesnt match
                  res.status(401).send("Couldn't authenticate. Check email/password.")
              }
          })
      }
      else {
          // user doesnt exist
          res.status(401).send("Couldn't authenticate. Check email/password.")
      }
  }).catch(errors => {})
})

app.delete('/session', function(req, res) {
  req.session.userId = undefined;
  req.session.name = undefined;

  res.status(204).send(req.session)
})

app.listen(port, function () {
  console.log(`Running server on port ${port}...`);
});
