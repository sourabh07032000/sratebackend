const express = require('express');
const axios = require('axios');
const router = express.Router();

router.post('/create-order', async (req, res) => {
  const { order_id, order_amount, customer_id, customer_email, customer_phone } = req.body;

  const data = {
    order_id: order_id,
    order_amount: order_amount,
    order_currency: "INR",
    customer_details: {
      customer_id: customer_id,
      customer_email: customer_email,
      customer_phone: customer_phone
    },
    order_meta: {
      return_url: "https://yourwebsite.com/return",
      notify_url: "https://yourwebsite.com/webhook"
    }
  };

  const headers = {
    'Authorization': 'Bearer YOUR_SECRET_KEY',  // Replace with your actual secret key
    'Content-Type': 'application/json',
    'x-client-id': 'YOUR_APP_ID'  // Replace with your actual app ID
  };

  try {
    const response = await axios.post('https://sandbox.cashfree.com/pg/orders', data, { headers });
    console.log("Order Created:", response.data);
    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Order creation failed" });
  }
});

module.exports = router;
