const express = require("express");
const axios = require("axios");

const router = express.Router();

// Message Central credentials
const AUTH_TOKEN = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJDLTc4OTRDRjQzNkE4QjQxOCIsImlhdCI6MTczMjcyMzY2NiwiZXhwIjoxODkwNDAzNjY2fQ.NeNRrvvDJbuCrIyhYNwO5REGi2DqKpw3ULdxSfqpO0o9ANee1LAsOikbD2Zqp8_dOpT8Bz4DaJcRRDkxMm25OA";
const CUSTOMER_ID = "C-7894CF436A8B418";
const BASE_URL = "https://cpaas.messagecentral.com/verification/v3";

// Route to send OTP
router.post("/send-otp", async (req, res) => {
    const { mobileNumber } = req.body; // Only mobile number required

    try {
        const response = await axios.post(
            `${BASE_URL}/send`,
            null,
            {
                params: {
                    countryCode: 91, // Hardcoded country code
                    customerId: CUSTOMER_ID,
                    flowType: "SMS",
                    mobileNumber: mobileNumber,
                },
                headers: {
                    authToken: AUTH_TOKEN,
                },
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
        console.error("Error in send-otp:", error.message);
        res.status(500).send({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
});

// Route to validate OTP
router.post("/verify-otp", async (req, res) => {
    const { verificationId, mobileNumber, otp } = req.body; // No countryCode required

    try {
        const response = await axios.get(
            `${BASE_URL}/validateOtp`,
            {
                params: {
                    countryCode: 91, // Hardcoded country code
                    mobileNumber: mobileNumber,
                    verificationId: verificationId,
                    code: otp,
                },
                headers: {
                    authToken: AUTH_TOKEN,
                },
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
        console.error("Error in validate-otp:", error.message);
        res.status(500).send({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
});

module.exports = router;
