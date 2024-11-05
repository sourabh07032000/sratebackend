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
      return_url: 'https://yourapp.com/return', // Replace with your actual return URL
    },
  };

  try {
    const response = await axios.post(
      'https://api.cashfree.com/api/v2/order/create',
      orderData,
      {
        headers: {
          'Content-Type': 'application/json',
          'x-client-id': process.env.CASHFREE_CLIENT_ID,
          'x-client-secret': process.env.CASHFREE_CLIENT_SECRET,
        },
      }
    );

    const data = response.data;

    if (data.status === 'OK') {
      res.json({ order_token: data.order_token, order_id: data.order_id });
    } else {
      console.error('Order Creation Failed:', data);
      res.status(500).json({ error: data.message || 'Order creation failed' });
    }
  } catch (error) {
    console.error('Server Error:', error.response ? error.response.data : error.message); // Log the error
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

