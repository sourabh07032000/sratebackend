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
        'x-client-id': '78648954e1c85af916de5b9197984687',
        'x-client-secret': 'cfsk_ma_prod_ae9ddae7aa0bf21a2a4d37f69ece76e1_1e167998',
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
