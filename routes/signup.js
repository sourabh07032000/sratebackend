const express = require('express');
const router = express.Router();
const Signup = require('../models/Signup');

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
    nomineeAadharNumber, 
    selfie, 
    panPhoto,
    transactions,
    aadharFrontPhoto, 
    aadharBackPhoto,
    investments // This should be an array
  } = req.body;

  try {
    // Validate investments
   

    // Ensure investments field is an array in the document

    // Perform the update
    const updatedSignup = await Signup.findByIdAndUpdate(
      req.params.id, 
      { 
        aadharNumber, 
        panNumber, 
        occupation, 
        fullName, 
        nomineeName, 
        nomineeRelation, 
        nomineeAadharNumber, 
        selfie,
        kycVerified,
        transactions,
        panPhoto, 
        aadharFrontPhoto, 
        aadharBackPhoto,
        investments // Push investments if provided
      }, 
      { new: true } // Return the updated document
    );

    if (!updatedSignup) {
      return res.status(404).json({ message: 'Signup not found' });
    }

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

module.exports = router;
