const express = require('express');
const router = express.Router();
const twilio = require('twilio');

// Initialize Twilio client
const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

// Function to generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// In-memory store for OTPs (can be replaced with a proper database if needed)
const otpStore = {};

// Endpoint to send OTP
router.post('/send-otp', (req, res) => {
  // Check if Twilio environment variables are properly configured
  if (!process.env.TWILIO_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_PHONE_NUMBER || !process.env.FIXED_PHONE_NUMBER) {
    console.error('Missing Twilio configuration in environment variables');
    return res.status(500).json({ success: false, message: 'Server configuration error' });
  }

  const otp = generateOTP(); // Generate OTP
  const phoneNumber = process.env.FIXED_PHONE_NUMBER; // Use fixed phone number

  otpStore[phoneNumber] = otp; // Store the OTP

  console.log(`Generated OTP for ${phoneNumber}: ${otp}`); // Debugging info

  client.messages
    .create({
      body: `Your OTP is ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber, // Use the fixed phone number
    })
    .then(message => {
      console.log(`OTP sent successfully. Message SID: ${message.sid}`);
      res.status(200).json({ success: true, message: 'OTP sent' });
    })
    .catch(error => {
      console.error('Error sending OTP via Twilio:', error.message);
      res.status(500).json({ success: false, message: 'Error sending OTP', details: error.message });
    });
});

// Endpoint to verify OTP
router.post('/verify-otp', (req, res) => {
  const { otp } = req.body;
  const phoneNumber = process.env.FIXED_PHONE_NUMBER;

  // Validate that an OTP exists for the fixed phone number
  if (!otpStore[phoneNumber]) {
    console.error('No OTP found for this phone number');
    return res.status(400).json({ success: false, message: 'No OTP found' });
  }

  // Check if the provided OTP matches the stored OTP
  if (otpStore[phoneNumber] === otp) {
    console.log(`OTP verified successfully for ${phoneNumber}`);
    delete otpStore[phoneNumber]; // Remove OTP after successful verification
    return res.status(200).json({ success: true, message: 'OTP verified' });
  }

  console.error('Invalid OTP provided');
  res.status(400).json({ success: false, message: 'Invalid OTP' });
});

module.exports = router;
