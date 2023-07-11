const mongoose = require("mongoose");
const { Schema } = mongoose;
const dotenv = require("dotenv");

dotenv.config();

mongoose.set("strictQuery", false);
mongoose.connect(process.env.DB_LINK);

const PhotoSchema = Schema({
  
});

const Sample = mongoose.model("Sample", sampleSchema);

module.exports = {
  Sample: Sample,
};
