const express = require('express');
const router = express.Router();
const twilio = require('twilio');

// Initialize Twilio client
const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
};

const otpStore = {}; // Simple in-memory store for OTPs

router.post('/send-otp', (req, res) => {
  const otp = generateOTP();
  const phoneNumber = process.env.FIXED_PHONE_NUMBER; // Use environment variable for fixed phone number

  otpStore[phoneNumber] = otp; // Store OTP

  client.messages
      .create({
          body: `Your OTP is ${otp}`,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: phoneNumber // Use the fixed phone number from env variable
      })
      .then(message => {
          console.log(`OTP sent: ${otp}`);
          res.status(200).json({ success: true, message: 'OTP sent' });
      })
      .catch(error => {
          console.error(error);
          res.status(500).json({ success: false, message: 'Error sending OTP' });
      });
});

// Verify OTP endpoint
router.post('/verify-otp', (req, res) => {
  const { otp } = req.body;
  const phoneNumber = process.env.FIXED_PHONE_NUMBER; // Use the same environment variable

  if (otpStore[phoneNumber] === otp) {
      delete otpStore[phoneNumber]; // Remove OTP after verification
      return res.status(200).json({ success: true, message: 'OTP verified' });
  }

  res.status(400).json({ success: false, message: 'Invalid OTP' });
});

module.exports = router;
