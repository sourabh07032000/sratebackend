const express = require('express');
const axios = require('axios');
const router = express.Router();


router.post('/create-order', async (req, res) => {
  const { order_amount, customer_details } = req.body;

  const orderData = {
    order_id: `order_${Date.now()}`,  // Generate a unique order ID
    order_amount,
    order_currency: 'INR',
    customer_details,
    order_meta: {
      return_url: 'https://yourapp.com/return', // Replace with your actual return URL
    },
  };

  try {
    const response = await axios.post(
      'https://api.cashfree.com/pg/orders', // Use the correct environment URL
      orderData,
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

    if (data.order_status === 'ACTIVE') {
      // Send the payment session ID and order ID to the frontend
      res.json({ payment_session_id: data.payment_session_id, order_id: data.order_id });
    } else {
      console.error('Order Creation Failed:', data);
      res.status(500).json({ error: 'Order creation failed' });
    }
  } catch (error) {
    console.error('Server Error:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Server error' });
  }
});



module.exports = router;
