const express = require('express');
const router = express.Router();
const Signup = require('../models/Signup');

router.post('/:id/investments', async (req, res) => {
  const { planId, amount, dailyProfit } = req.body;

  if (!planId || !amount || !dailyProfit) {
    return res.status(400).json({ message: 'Plan ID, amount, and daily profit are required' });
  }

  try {
    const user = await Signup.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const now = new Date();

    // Add the new investment
    const newInvestment = {
      planId,
      amount,
      dailyProfit,
      investmentDate: now,
      lastProfitUpdate: now,
      totalProfit: 0,
      monthlyProfit: 0
    };

    user.investments.push(newInvestment);
    await user.save();

    res.status(201).json({ message: 'Investment added successfully', investment: newInvestment });
  } catch (error) {
    console.error('Error adding investment:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


// POST: Signup route (Create)
router.post('/', async (req, res) => {
  const { firstName, lastName, email, phoneNumber } = req.body;

  // Validation
  if (!firstName || !lastName || !email || !phoneNumber) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Check if signup already exists
    const existingSignup = await Signup.findOne({ email });
    if (existingSignup) {
      return res.status(400).json({ message: 'Signup already exists with this email' });
    }

    // Create new signup
    const signup = new Signup({ firstName, lastName, email, phoneNumber });
    await signup.save();

    res.status(201).json({ message: 'Signup registered successfully', signup });
  } catch (error) {
    console.error('Signup Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET: Retrieve all signups (Read)
router.get('/', async (req, res) => {
  try {
    const signups = await Signup.find();
    res.status(200).json(signups);
  } catch (error) {
    console.error('Error fetching signups:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET: Retrieve a single signup by ID
router.get('/:id', async (req, res) => {
  try {
    const signup = await Signup.findById(req.params.id);
    if (!signup) {
      return res.status(404).json({ message: 'Signup not found' });
    }
    res.status(200).json(signup);
  } catch (error) {
    console.error('Error fetching signup:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT: Update signup by ID with KYC and Investment Information
router.put('/:id', async (req, res) => {
  const {
    kycVerified,
    aadharNumber,
    panNumber,
    occupation,
    fullName,
    nomineeName,
    nomineeRelation,
    bankDetails,
    nomineeAadharNumber,
    selfie,
    panPhoto,
    aadharFrontPhoto,
    aadharBackPhoto,
    transactions,
    investments, // Should be an array
  } = req.body;

  const mongoose = require('mongoose');
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: 'Invalid ID format' });
  }

  try {
    // Find the existing record
    const signup = await Signup.findById(req.params.id);
    if (!signup) {
      return res.status(404).json({ message: 'Signup not found' });
    }

    // Validate and merge investments
    const updatedInvestments = Array.isArray(investments)
      ? [...(signup.investments || []), ...investments]
      : signup.investments;

    // Prepare update data
    const updateData = {
      ...(kycVerified !== undefined && { kycVerified }),
      ...(aadharNumber && { aadharNumber }),
      ...(panNumber && { panNumber }),
      ...(occupation && { occupation }),
      ...(fullName && { fullName }),
      ...(nomineeName && { nomineeName }),
      ...(bankDetails && { bankDetails }),
      ...(nomineeRelation && { nomineeRelation }),
      ...(nomineeAadharNumber && { nomineeAadharNumber }),
      ...(selfie && { selfie }),
      ...(panPhoto && { panPhoto }),
      ...(aadharFrontPhoto && { aadharFrontPhoto }),
      ...(aadharBackPhoto && { aadharBackPhoto }),
      ...(transactions && { transactions }),
      investments: updatedInvestments,
    };

    // Update the record
    const updatedSignup = await Signup.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true } // Return updated document
    );

    res.status(200).json({ message: 'Signup updated successfully', updatedSignup });
  } catch (error) {
    console.error('Error updating signup:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


// DELETE: Remove a signup by ID
router.delete('/:id', async (req, res) => {
  try {
    const signup = await Signup.findByIdAndDelete(req.params.id);
    if (!signup) {
      return res.status(404).json({ message: 'Signup not found' });
    }
    res.status(200).json({ message: 'Signup deleted successfully' });
  } catch (error) {
    console.error('Error deleting signup:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT: Update specific investment by user ID and investment ID
router.put('/:userId/investments/:investmentId', async (req, res) => {
  const { planId, amount, dailyProfit, monthlyProfit, totalProfit } = req.body;

  try {
    const user = await Signup.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find the specific investment by ID
    const investment = user.investments.id(req.params.investmentId);
    if (!investment) {
      return res.status(404).json({ message: 'Investment not found' });
    }

    // Update the investment fields
    if (planId) investment.planId = planId;
    if (amount) investment.amount = amount;
    if (dailyProfit) investment.dailyProfit = dailyProfit;
    if (monthlyProfit) investment.monthlyProfit = monthlyProfit;
    if (totalProfit) investment.totalProfit = totalProfit;

    // Save the updated user record
    await user.save();

    res.status(200).json({ message: 'Investment updated successfully', investment });
  } catch (error) {
    console.error('Error updating investment:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// DELETE: Remove a specific investment by user ID and investment ID
router.delete('/:userId/investments/:investmentId', async (req, res) => {
  try {
    const { userId, investmentId } = req.params;

    // Validate IDs
    if (!mongoose.isValidObjectId(userId) || !mongoose.isValidObjectId(investmentId)) {
      return res.status(400).json({ message: 'Invalid user ID or investment ID format' });
    }

    // Find the user by ID
    const user = await Signup.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Filter out the investment to delete
    const investmentExists = user.investments.some((inv) => inv._id.toString() === investmentId);
    if (!investmentExists) {
      return res.status(404).json({ message: 'Investment not found' });
    }

    user.investments = user.investments.filter((inv) => inv._id.toString() !== investmentId);

    // Save the updated user document
    await user.save();

    res.status(200).json({
      message: 'Investment deleted successfully',
      investments: user.investments,
    });
  } catch (error) {
    console.error('Error deleting investment:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});




module.exports = router;
