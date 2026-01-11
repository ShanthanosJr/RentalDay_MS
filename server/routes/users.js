const express = require('express');
const multer = require('multer');
const path = require('path');
const User = require('../models/User');

// Set up multer for avatar uploads
const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'avatar-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const avatarUpload = multer({ storage: avatarStorage });

const router = express.Router();

// Get all users (admin only)
router.get('/', async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 }); // Exclude password field only
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
});

// Get a specific user by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id, { password: 0 }); // Exclude password field only
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Error fetching user', error: error.message });
  }
});

// Create a new user (admin only)
router.post('/', async (req, res) => {
  try {
    const { username, email, password, role, profileDetails, userId } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });
    
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email or username' });
    }

    // Hash the password
    const bcrypt = require('bcrypt');
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = new User({
      // Don't use the userId from the request body - let the schema generate it
      username,
      email,
      password: hashedPassword,
      role: role || 'user',
      profileDetails: profileDetails || {}
    });

    await user.save();

    // Return user object (without password)
    const userResponse = {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      profileDetails: user.profileDetails,
      userId: user.userId
    };

    res.status(201).json(userResponse);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
});

// Update a user by ID
router.put('/:id', async (req, res) => {
  try {
    const { username, email, role, profileDetails } = req.body;

    // Check if user exists
    const existingUser = await User.findById(req.params.id);
    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if email/username is already taken by another user
    const duplicateUser = await User.findOne({
      $and: [
        { _id: { $ne: req.params.id } },
        { $or: [{ email }, { username }] }
      ]
    });
    
    if (duplicateUser) {
      return res.status(400).json({ message: 'Email or username already taken' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { username, email, role, profileDetails },
      { new: true, runValidators: true }
    );

    // Return user object (without password)
    const userResponse = {
      _id: updatedUser._id,
      userId: updatedUser.userId,
      username: updatedUser.username,
      email: updatedUser.email,
      role: updatedUser.role,
      profileDetails: updatedUser.profileDetails,
      avatar: updatedUser.avatar
    };

    res.json(userResponse);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Error updating user', error: error.message });
  }
});

// Update user profile (for the logged-in user)
router.put('/profile/:id', async (req, res) => {
  try {
    const { profileDetails } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { profileDetails },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return user object (without password)
    const userResponse = {
      _id: updatedUser._id,
      userId: updatedUser.userId,
      username: updatedUser.username,
      email: updatedUser.email,
      role: updatedUser.role,
      profileDetails: updatedUser.profileDetails,
      avatar: updatedUser.avatar
    };

    res.json(userResponse);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
});

// Delete a user by ID
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
});

// Upload user avatar
router.post('/:id/avatar', avatarUpload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No avatar file provided' });
    }

    const avatarPath = `/uploads/${req.file.filename}`;
    
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { avatar: avatarPath },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return user object (without password)
    const userResponse = {
      _id: updatedUser._id,
      userId: updatedUser.userId,
      username: updatedUser.username,
      email: updatedUser.email,
      role: updatedUser.role,
      profileDetails: updatedUser.profileDetails,
      avatar: updatedUser.avatar
    };

    res.json(userResponse);
  } catch (error) {
    console.error('Error uploading avatar:', error);
    res.status(500).json({ message: 'Error uploading avatar', error: error.message });
  }
});

module.exports = router;