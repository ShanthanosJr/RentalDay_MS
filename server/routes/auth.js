const express = require('express');
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcrypt');
const User = require('../models/User');

// Set up multer for avatar uploads during registration
const registerAvatarStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'avatar-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const registerAvatarUpload = multer({ storage: registerAvatarStorage });

const router = express.Router();

// Register route
router.post('/register', registerAvatarUpload.single('avatar'), async (req, res) => {
  try {
    const { username, email, password, profileDetails } = req.body;
    const avatarFile = req.file; // Avatar file from multer middleware

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });
    
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email or username' });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const user = new User({
      username,
      email,
      password: hashedPassword,
      profileDetails: {
        ...profileDetails,
        // Convert dateOfBirth string to Date object if it exists
        ...(profileDetails && profileDetails.dateOfBirth && { dateOfBirth: new Date(profileDetails.dateOfBirth) })
      }
    });

    // If there's an avatar file, save the path
    if (avatarFile) {
      user.avatar = `/uploads/${avatarFile.filename}`;
    }

    await user.save();

    // Return user object (without password)
    const userResponse = {
      _id: user._id,
      userId: user.userId,
      username: user.username,
      email: user.email,
      role: user.role,
      profileDetails: user.profileDetails,
      avatar: user.avatar
    };

    res.status(201).json(userResponse);
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Return user object (without password)
    const userResponse = {
      _id: user._id,
      userId: user.userId,
      username: user.username,
      email: user.email,
      role: user.role,
      profileDetails: user.profileDetails,
      avatar: user.avatar
    };

    res.json(userResponse);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
});

module.exports = router;