const express = require("express");
const cors = require("cors");
const model = require("./model");

const app = express();
const port = 8080;

app.use(express.urlencoded({ extended: false }));
app.use(cors());

// photos 

app.get('/photos', function(req, res) {
  
})

app.listen(port, function () {
  console.log(`Running server on port ${port}...`);
});
