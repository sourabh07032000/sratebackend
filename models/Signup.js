const mongoose = require('mongoose');

// Signup schema
const signupSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true, unique: true },
  
  // KYC Information
  aadharNumber: { type: String, required: true, unique: true },
  panNumber: { type: String, required: true, unique: true },
  occupation: { type: String, required: true },
  fullName: { type: String, required: true },
  nomineeName: { type: String },
  nomineeRelation: { type: String },
  nomineeAadharNumber: { type: String },
  
  // Photo URLs
  selfie: { type: String, required: true }, // URL for Selfie photo
  panPhoto: { type: String, required: true }, // URL for PAN photo
  aadharFrontPhoto: { type: String, required: true }, // URL for Aadhar Front photo
  aadharBackPhoto: { type: String, required: true }, // URL for Aadhar Back photo
  
  // Verification Status
  kycVerified: { type: Boolean, default: false },
}, {
  timestamps: true
});

module.exports = mongoose.model('Signup', signupSchema);
