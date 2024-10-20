const express = require('express');
const router = express.Router();
const Signup = require('../models/Signup');

// POST: Signup route (Create)
router.post('/', async (req, res) => {
  console.log('Request Body:', req.body); // Log the request body

  const { firstName, lastName, email, phoneNumber, aadharNumber } = req.body;

  // Validation
  if (!firstName || !lastName || !email || !phoneNumber || !aadharNumber) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Check for existing email
    const existingSignup = await Signup.findOne({ email });
    if (existingSignup) {
      return res.status(400).json({ message: 'Signup already exists with this email' });
    }

    // Check for existing aadhar number
    const existingAadhar = await Signup.findOne({ aadharNumber });
    if (existingAadhar) {
      return res.status(400).json({ message: 'Aadhar number already exists' });
    }

    // Create new signup
    const signup = new Signup({ firstName, lastName, email, phoneNumber, aadharNumber });
    await signup.save();

    res.status(201).json({ message: 'Signup registered successfully', signup });
  } catch (error) {
    console.error('Signup Error:', error.message); // Log the error message
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

// PUT: Update a signup by ID with optional KYC information
router.put('/:id', async (req, res) => {
  const { 
    firstName, 
    lastName, 
    email, 
    phoneNumber, 
    aadharNumber, 
    panNumber, 
    occupation, 
    fullName, 
    nomineeName, 
    nomineeRelation, 
    nomineeAadharNumber, 
    selfie, 
    panPhoto, 
    aadharFrontPhoto, 
    aadharBackPhoto 
  } = req.body;

  // Validation: Ensure required fields are provided
  if (!firstName || !lastName || !email || !phoneNumber) {
    return res.status(400).json({ message: 'First name, last name, email, and phone number are required.' });
  }

  try {
    // Find the signup by ID and update it with provided fields
    const updatedSignup = await Signup.findByIdAndUpdate(
      req.params.id, 
      { 
        firstName, 
        lastName, 
        email, 
        phoneNumber, 
        aadharNumber, 
        panNumber, 
        occupation, 
        fullName, 
        nomineeName, 
        nomineeRelation, 
        nomineeAadharNumber, 
        selfie, 
        panPhoto, 
        aadharFrontPhoto, 
        aadharBackPhoto 
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

