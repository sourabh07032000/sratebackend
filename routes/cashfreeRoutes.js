// routes/cashfreeRoutes.js
const express = require('express');
const https = require('https'); // Import the https module
const router = express.Router();

router.post('/webhook/cashfree', (req, res) => {
    const { order_id, order_amount, order_currency, customer_details, order_note, order_meta, version } = req.body;

    // Validate input data as necessary
    if (!order_id || !order_amount || !customer_details) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    const data = JSON.stringify({
        order_id,
        order_amount,
        order_currency,
        customer_details,
        order_note,
        order_meta,
        version,
    });

    const options = {
        hostname: 'api.cashfree.com', // Cashfree API hostname
        path: '/api/v2/cashfree', // API endpoint path
        method: 'POST',
        headers: {
            'x-client-id': process.env.CASHFREE_CLIENT_ID, // Use environment variables for sensitive info
            'x-client-secret': process.env.CASHFREE_CLIENT_SECRET,
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(data),
        },
    };

    const request = https.request(options, (response) => {
        let responseData = '';

        // Collect the response data
        response.on('data', (chunk) => {
            responseData += chunk;
        });

        // End of response
        response.on('end', () => {
            try {
                const parsedResponse = JSON.parse(responseData);
                return res.status(response.statusCode).json(parsedResponse);
            } catch (error) {
                console.error('Error parsing response:', error);
                return res.status(500).json({ message: 'Failed to parse response' });
            }
        });
    });

    // Handle request errors
    request.on('error', (error) => {
        console.error('Error during request:', error);
        return res.status(500).json({ message: 'Failed to create order', error: error.message });
    });

    // Write the data to request body
    request.write(data);
    request.end();
});

module.exports = router;
