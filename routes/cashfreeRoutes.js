// routes/cashfreeRoutes.js

const express = require('express');
const router = express.Router();

// Webhook route to handle Cashfree notifications
router.post('/webhook/cashfree', (req, res) => {
    const webhookData = req.body;

    // Log the webhook data
    console.log('Cashfree Webhook Received:', webhookData);

    // Handle the webhook data based on the event type
    switch (webhookData.event) {
        case 'PAYMENT_SUCCESS':
            // Handle successful payment
            console.log('Payment Successful:', webhookData);
            break;

        case 'PAYMENT_FAILED':
            // Handle failed payment
            console.log('Payment Failed:', webhookData);
            break;

        // Add more cases for different events as needed

        default:
            console.log('Unknown Event:', webhookData);
    }

    // Respond with a 200 status to acknowledge receipt of the webhook
    res.status(200).send('Webhook received');
});

module.exports = router;
