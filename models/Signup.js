const mongoose = require('mongoose');

// Define the schema for signup including investment details
const signupSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true, unique: true },
  
  // KYC Information (Optional)
  aadharNumber: { type: String, unique: true }, // Unique but not required
  panNumber: { type: String, unique: true }, // Unique but not required
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
  
  // Investments (Array)
  investments: [{
    planId: { type: Object, required: true }, // Plan ID or name of the investment plan
    amount: { type: Number, required: true }, // Amount invested
    investmentDate: { type: Date, default: Date.now } // Date of investment
  }],
}, {
  timestamps: true
});

module.exports = mongoose.model('Signup', signupSchema);
