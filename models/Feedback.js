const mongoose = require('mongoose');

// Plan schema
const FeedbackSchema = new mongoose.Schema({
  name : String,
  email : String,
  phoneNumber : Number,
  message : String,

});

module.exports = mongoose.model('Feedback', FeedbackSchema);
