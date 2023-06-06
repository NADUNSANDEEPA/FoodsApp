const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Member = require('../model/member');

// Route to register a new member
router.post('/register', async (req, res) => {
    const { name, stdID, degree, password, country, email, phoneNumber, address } = req.body;
  
    try {
      // Check if member with the same email already exists
      let member = await Member.findOne({ email });
      if (member) {
        return res.status(400).json({ message: 'Member with this email already exists' });
      }
  
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      // Create a new member
      member = new Member({
        name,
        stdID,
        degree,
        password: hashedPassword,
        country,
        email,
        phoneNumber,
        address
      });
  
      await member.save();
  
      res.status(200).json({ message: 'Member registered successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred while registering the member' });
    }
  });
  

// Route to login a member
router.post('/login', async (req, res) => {
  const { student_id, password } = req.body;

  try {
    // Find the member by student ID
    const member = await Member.findOne({ stdID: student_id });
    console.log(member);

    // If the member doesn't exist, return an error
    if (!member) {
      return res.status(401).json({ message: 'Invalid student ID' });
    }

    // Compare the hashed password with the plain text password provided
    const isPasswordMatch = await bcrypt.compare(password, member.password);

    // If the passwords don't match, return an error
    if (!isPasswordMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    res.status(200).json({ message: 'Login successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while logging in' });
  }
});


// Route to get all members
router.get('/members', async (req, res) => {
  try {
    const members = await Member.find();
    res.json(members);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while retrieving members' });
  }
});

// Route to get a single member by std id
router.get('/oneMember/:stdID', async (req, res) => {
  try {
    const stdID = req.params.stdID;

    // Fetch the member data using stdID (replace this with your own logic)
    const member = await Member.findOne({ stdID: stdID });

    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }

    // Return the member data
    res.json(member);
  } catch (error) {
    console.error('Error fetching member data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// Route to update a member by ID
router.put('/members/:id', [
  check('name').notEmpty().withMessage('Name is required'),
  check('stdID').notEmpty().withMessage('Student ID is required'),
  check('degree').notEmpty().withMessage('Degree is required'),
  check('country').notEmpty().withMessage('Country is required'),
  check('email').isEmail().withMessage('Invalid email'),
  check('phoneNumber').notEmpty().withMessage('Phone number is required'),
  check('address').notEmpty().withMessage('Address is required'),
], async (req, res) => {
  const memberId = req.params.id;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, stdID, degree, country, email, phoneNumber, address } = req.body;

  try {
    const member = await Member.findById(memberId);

    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }

    member.name = name;
    member.stdID = stdID;
    member.degree = degree;
    member.country = country;
    member.email = email;
    member.phoneNumber = phoneNumber;
    member.address = address;

    await member.save();

    res.json({ message: 'Member updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while updating the member' });
  }
});

// Route to delete a member by ID
router.delete('/members/:id', async (req, res) => {
  const memberId = req.params.id;

  try {
    const member = await Member.findByIdAndDelete(memberId);

    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }

    res.json({ message: 'Member deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while deleting the member' });
  }
});

router.put('/passReset/:stdID', async (req, res) => {
  try {
    const stdID = req.params.stdID;
    const { password } = req.body;

    // Assuming you have a member model or database collection
    const member = await Member.findOne({ stdID: stdID });
    if (!member) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Encrypt the new password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the member's password with the hashed password
    member.password = hashedPassword;
    await member.save();

    // Password reset successful
    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    // Handle any errors that occur during the password reset process
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
