const mongoose = require('mongoose');

// Define the schema for signup including investment details
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  mobileNumber: { type: String, required: true, unique: true },
  password: { type: String, required: true},
  mPin: { type: String, required: true },
}, {
  timestamps: true
});

module.exports = mongoose.model('User', UserSchema);
