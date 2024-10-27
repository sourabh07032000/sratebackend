// routes/cashfreeRoutes.js
const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post('/webhook/cashfree', async (req, res) => {
    const { order_id, order_amount, order_currency, customer_details, order_note, order_meta, version } = req.body;

    // Validate input data as necessary
    if (!order_id || !order_amount || !customer_details) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    const data = {
        order_id,
        order_amount,
        order_currency,
        customer_details,
        order_note,
        order_meta,
        version,
    };

    try {
        // Make request to Cashfree API
        const response = await axios.post('https://api.cashfree.com/api/v2/cashfree', data, {
            headers: {
                'x-client-id': process.env.CASHFREE_CLIENT_ID, // Use environment variables for sensitive info
                'x-client-secret': process.env.CASHFREE_CLIENT_SECRET,
                'Content-Type': 'application/json',
            },
        });

        return res.status(200).json(response.data);
    } catch (error) {
        console.error('Error while creating order:', error.response.data);
        return res.status(500).json({ message: 'Failed to create order', error: error.response.data });
    }
});

module.exports = router;
