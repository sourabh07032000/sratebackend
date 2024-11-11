const express = require('express');
const axios = require('axios');
const router = express.Router();

router.post('/create-payment-link', async (req, res) => {
  const { order_amount, customer_details } = req.body;

  const linkData = {
    link_id: `link_${Date.now()}`, // Generate a unique link ID if required
    link_amount: order_amount,
    link_currency: 'INR',
    link_purpose: 'Investment Payment', // Add a purpose for the payment link
    customer_details,
    link_meta: {
      return_url: 'https://yourapp.com/return', // Replace with your actual return URL
    },
    link_notify: {
      send_sms: true, // Optional: Send SMS notification
      send_email: true, // Optional: Send email notification
    }
  };

  try {
    const response = await axios.post(
      'https://api.cashfree.com/pg/links', // Payment Links API endpoint
      linkData,
      {
        headers: {
          'Content-Type': 'application/json',
          'x-client-id': process.env.CASHFREE_CLIENT_ID,
          'x-client-secret': process.env.CASHFREE_CLIENT_SECRET,
          'x-api-version': '2023-08-01',
        },
      }
    );

    const data = response.data;

    if (data.status === 'OK' && data.link_status === 'ACTIVE') {
      // Send the payment link to the frontend
      res.json({ payment_link: data.link_url, link_id: data.link_id });
    } else {
      console.error('Payment Link Creation Failed:', data);
      res.status(500).json({ error: 'Payment link creation failed' });
    }
  } catch (error) {
    console.error('Server Error:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
