// cashfree.js
const express = require('express');
const router = express.Router();
const axios = require('axios');

const CASHFREE_CLIENT_ID = "TEST1033604142c07ce9bd2c017b30dc14063301"; // Replace with your client ID
const CASHFREE_CLIENT_SECRET = "cfsk_ma_test_b7d047e94e267dda8ad8b384c88d3ea7_3ef0727b"; // Replace with your secret key
const CASHFREE_ENVIRONMENT = "sandbox"; // Use "sandbox" or "production"

// Create an order endpoint
router.post('/create-order', async (req, res) => {
    const request = {
        order_amount: req.body.order_amount,
        order_currency: "INR",
        order_id: `devstudio_${new Date().getTime()}`, // Unique order ID
        customer_details: {
            customer_id: req.body.customer_id,
            customer_phone: req.body.customer_phone,
            customer_email: req.body.customer_email // Optional
        },
        order_meta: {
            return_url: req.body.return_url
        }
    };

    try {
        const response = await axios.post(`https://api.cashfree.com/api/v1/order/create`, request, {
            headers: {
                'X-Client-Id': CASHFREE_CLIENT_ID,
                'X-Client-Secret': CASHFREE_CLIENT_SECRET,
                'Content-Type': 'application/json'
            }
        });

        return res.status(200).json(response.data);
    } catch (error) {
        console.error('Error creating Cashfree order:', error.response ? error.response.data : error.message);
        return res.status(500).json({ error: 'Error creating Cashfree order' });
    }
});

module.exports = router;
