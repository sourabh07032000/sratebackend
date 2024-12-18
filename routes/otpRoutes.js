const express = require("express");
const axios = require("axios");

const router = express.Router();

// Replace with your Message Central credentials
const AUTH_TOKEN = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJDLTc4OTRDRjQzNkE4QjQxOCIsImlhdCI6MTczMjcyMzY2NiwiZXhwIjoxODkwNDAzNjY2fQ.NeNRrvvDJbuCrIyhYNwO5REGi2DqKpw3ULdxSfqpO0o9ANee1LAsOikbD2Zqp8_dOpT8Bz4DaJcRRDkxMm25OA";
const CUSTOMER_ID = "C-7894CF436A8B418";
const BASE_URL = "https://cpaas.messagecentral.com/verification/v3";

// Define tester numbers
const TESTER_NUMBERS = ["9876543210", "1234567890"];

// Middleware for checking required fields
const validateRequestFields = (requiredFields) => (req, res, next) => {
    for (const field of requiredFields) {
        if (!req.body[field]) {
            return res.status(400).send({
                success: false,
                message: `${field} is required.`,
            });
        }
    }
    next();
};

// Route to send OTP
router.post("/send-otp", validateRequestFields(["mobileNumber"]), async (req, res) => {
    const { mobileNumber, countryCode } = req.body;

    try {
        // Check for tester numbers
        if (TESTER_NUMBERS.includes(mobileNumber)) {
            console.log(`Tester number detected: ${mobileNumber}`);
            return res.status(200).send({
                success: true,
                message: "OTP bypassed for tester number",
                verificationId: "TEST_VERIFICATION_ID",
                otp: "1234", // Static OTP for tester numbers
            });
        }

        // Send OTP for regular users
        const response = await axios.post(
            `${BASE_URL}/send`,
            null,
            {
                params: {
                    countryCode: countryCode || 91,
                    customerId: CUSTOMER_ID,
                    flowType: "SMS",
                    mobileNumber,
                },
                headers: { authToken: AUTH_TOKEN },
            }
        );

        if (response.data.responseCode === 200) {
            res.status(200).send({
                success: true,
                message: "OTP sent successfully",
                verificationId: response.data.data.verificationId,
            });
        } else {
            res.status(400).send({
                success: false,
                message: response.data.message || "Failed to send OTP",
            });
        }
    } catch (error) {
        console.error("Error in send-otp:", error.response?.data || error.message);
        res.status(500).send({
            success: false,
            message: "Server error while sending OTP",
            error: error.response?.data?.message || error.message,
        });
    }
});

// Route to validate OTP
router.post("/validate-otp", validateRequestFields(["verificationId", "mobileNumber", "otp"]), async (req, res) => {
    const { verificationId, mobileNumber, otp, countryCode } = req.body;

    try {
        // Check for tester numbers
        if (TESTER_NUMBERS.includes(mobileNumber)) {
            console.log(`Tester number validation: ${mobileNumber}`);
            if (otp === "1234") {
                return res.status(200).send({
                    success: true,
                    message: "OTP verified successfully for tester number",
                });
            } else {
                return res.status(400).send({
                    success: false,
                    message: "Invalid OTP for tester number",
                });
            }
        }

        // Validate OTP for regular users
        const response = await axios.get(
            `${BASE_URL}/validateOtp`,
            {
                params: {
                    countryCode: countryCode || 91,
                    mobileNumber,
                    verificationId,
                    code: otp,
                },
                headers: { authToken: AUTH_TOKEN },
            }
        );

        if (response.data.responseCode === 200 && response.data.data.verificationStatus === "VERIFICATION_COMPLETED") {
            res.status(200).send({
                success: true,
                message: "OTP verified successfully",
            });
        } else {
            res.status(400).send({
                success: false,
                message: "Invalid OTP or verification failed",
            });
        }
    } catch (error) {
        console.error("Error in validate-otp:", error.response?.data || error.message);
        res.status(500).send({
            success: false,
            message: "Server error while verifying OTP",
            error: error.response?.data?.message || error.message,
        });
    }
});

module.exports = router;
