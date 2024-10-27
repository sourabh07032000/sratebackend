// cashfreeRoutes.js
import { Cashfree } from "cashfree-pg"; // Ensure you have cashfree-pg installed

// Set up Cashfree configuration
Cashfree.XClientId = "TEST1033604142c07ce9bd2c017b30dc14063301"; // Replace with your client ID
Cashfree.XClientSecret = "cfsk_ma_test_b7d047e94e267dda8ad8b384c88d3ea7_3ef0727b"; // Replace with your secret key
Cashfree.XEnvironment = Cashfree.Environment.SANDBOX; // Use .SANDBOX or .PRODUCTION as needed

// Function to create an order
export const createCashfreeOrder = async () => {
    const request = {
        "order_amount": 10.00,
        "order_currency": "INR",
        "order_id": "devstudio_" + new Date().getTime(), // Unique order ID
        "customer_details": {
            "customer_id": "devstudio_user",
            "customer_phone": "8878084604",
            "customer_email": "example@gmail.com" // Include email if needed
        },
        "order_meta": {
            "return_url": "https://www.cashfree.com/devstudio/preview/pg/mobile/hybrid?order_id={order_id}"
        }
    };

    try {
        const response = await Cashfree.PGCreateOrder("2023-08-01", request);
        console.log('Order created successfully:', response.data);
        return response.data; // Return order data for further use
    } catch (error) {
        console.error('Error creating order:', error.response.data.message);
        throw error; // Throw error for handling in the component
    }
};
