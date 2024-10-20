const mongoose = require('mongoose');

// Signup schema
const signupSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true, unique: true },
  
  // KYC Information (Optional)
  aadharNumber: { type: String}, // Unique but not required
  panNumber: { type: String}, // Unique but not required
  occupation: { type: String }, // Optional
  fullName: { type: String }, // Optional
  nomineeName: { type: String }, // Optional
  nomineeRelation: { type: String }, // Optional
  nomineeAadharNumber: { type: String }, // Optional
  
  // Photo URLs (Optional)
  selfie: { type: String }, // URL for Selfie photo (Optional)
  panPhoto: { type: String }, // URL for PAN photo (Optional)
  aadharFrontPhoto: { type: String }, // URL for Aadhar Front photo (Optional)
  aadharBackPhoto: { type: String }, // URL for Aadhar Back photo (Optional)
  
  // Verification Status
  kycVerified: { type: Boolean, default: false },
}, {
  timestamps: true
});

module.exports = mongoose.model('Signup', signupSchema);

