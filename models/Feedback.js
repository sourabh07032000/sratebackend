const mongoose = require('mongoose');

// Plan schema
const FeedbackSchema = new mongoose.Schema({
  name : String,
  email : String,
  phoneNumber : String,
  message : String,
  referBy: String,

});

module.exports = mongoose.model('Feedback', FeedbackSchema);
