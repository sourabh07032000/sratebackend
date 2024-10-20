const express = require('express');
const router = express.Router();
const twilio = require('twilio');

// Initialize Twilio client
const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
};

const otpStore = {}; // Simple in-memory store for OTPs

// Send OTP endpoint
router.post('/send-otp', (req, res) => {
  const { phoneNumber } = req.body; // Get phone number from request body

  // Validate phone number (basic validation)
  if (!phoneNumber ) {
    return res.status(400).json({ success: false, message: 'Invalid phone number', phoneNumber });
  }

  const otp = generateOTP();
  otpStore[phoneNumber] = otp; // Store OTP

  client.messages
      .create({
          body: `Your OTP is ${otp}`,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: phoneNumber // Use the dynamic phone number from request
      })
      .then(message => {
          console.log(`OTP sent: ${otp}`);
          res.status(200).json({ success: true, message: 'OTP sent' });
      })
      .catch(error => {
          console.error('Error sending OTP via Twilio:', error);
          res.status(500).json({ success: false, message: 'Error sending OTP' });
      });
});

// Verify OTP endpoint
router.post('/verify-otp', (req, res) => {
  const { otp, phoneNumber } = req.body; // Get OTP and phone number from request body

  // Validate input
  if (!otp || !phoneNumber) {
    return res.status(400).json({ success: false, message: 'OTP and phone number are required' });
  }

  if (otpStore[phoneNumber] === otp) {
      delete otpStore[phoneNumber]; // Remove OTP after verification
      return res.status(200).json({ success: true, message: 'OTP verified' });
  }

  res.status(400).json({ success: false, message: 'Invalid OTP' });
});

module.exports = router;
