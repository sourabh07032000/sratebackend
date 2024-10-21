const express = require('express');
const router = express.Router();
const Investment = require('../models/Investment');
const { check, validationResult } = require('express-validator'); // For input validation

// POST route for creating a new investment
router.post('/investments', [
    check('userId').notEmpty().withMessage('User ID is required'),
    check('planId').notEmpty().withMessage('Plan ID is required'),
    check('amount').isNumeric().withMessage('Amount must be a number').isFloat({ min: 0 }).withMessage('Amount must be positive'),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { userId, planId, amount } = req.body;

    try {
        const investment = new Investment({ userId, planId, amount });
        await investment.save();
        res.status(201).json({ message: 'Investment created successfully', investment });
    } catch (error) {
        res.status(500).json({ message: 'Error creating investment', error });
    }
});

// GET route to fetch investments for a specific user
router.get('/investments/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const investments = await Investment.find({ userId }).populate('planId', 'planName'); // Populate with plan details
        res.status(200).json(investments);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching investments', error });
    }
});

// Optionally, you can add a GET route to fetch a specific investment by ID
router.get('/investments/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const investment = await Investment.findById(id).populate('planId', 'planName');
        if (!investment) {
            return res.status(404).json({ message: 'Investment not found' });
        }
        res.status(200).json(investment);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching investment', error });
    }
});

module.exports = router;
