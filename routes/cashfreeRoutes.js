const express = require('express');
const axios = require('axios');
const router = express.Router();


router.post('/create-order', async (req, res) => {
  const { order_amount, customer_details } = req.body;

  // Validate incoming data
  if (!order_amount || isNaN(order_amount) || order_amount <= 0) {
    return res.status(400).json({ error: 'Invalid order amount' });
  }
  if (!customer_details || !customer_details.customer_email || !customer_details.customer_phone) {
    return res.status(400).json({ error: 'Invalid customer details' });
  }

  const orderData = {
    order_id: `order_${Date.now()}`,  // Unique order ID
    order_amount,
    order_currency: 'INR',
    customer_details,
    order_meta: {
      return_url: 'https://yourapp.com/return', // Adjust with your return URL
    },
  };

  try {
    const response = await axios.post(
      'https://sandbox.cashfree.com/pg/orders', // Use sandbox URL for testing
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
    console.error('Server Error:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Server error' });
  }
});


module.exports = router;

