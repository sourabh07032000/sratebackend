const express = require('express');
const axios = require('axios');
const router = express.Router();

router.post('/create-order', async (req, res) => {
  const { order_amount, customer_details } = req.body;

  const orderData = {
    order_amount,
    order_currency: 'INR',
    customer_details,
    order_meta: {
      return_url: 'https://yourapp.com/return', // Adjust with your return URL
    },
  };

  try {
    const response = await fetch('https://api.cashfree.com/api/v2/order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-client-id': 'YOUR_CLIENT_ID',
        'x-client-secret': 'YOUR_CLIENT_SECRET',
      },
      body: JSON.stringify(orderData),
    });

    const data = await response.json();

    if (data.status === 'OK') {
      res.json({ order_token: data.order_token, order_id: data.order_id });
    } else {
      res.status(500).json({ error: 'Order creation failed' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
