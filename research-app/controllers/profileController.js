const User = require('../models/User');
const fs = require('fs');
const path = require('path');

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    if (!user) {
      req.flash('error', 'User not found.');
      return res.redirect('/auth/login');
    }
    res.render('profile/index', { title: 'My Profile', profileUser: user });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Error loading profile.');
    res.redirect('/dashboard');
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await User.findById(req.session.userId);
    if (!user) {
      req.flash('error', 'User not found.');
      return res.redirect('/profile');
    }
    if (email !== user.email) {
      const existing = await User.findOne({ email: email.toLowerCase() });
      if (existing) {
        req.flash('error', 'Email already in use.');
        return res.redirect('/profile');
      }
    }
    if (req.file) {
      if (user.profilePicture) {
        const oldPath = path.join(__dirname, '../public/uploads/profiles', user.profilePicture);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      user.profilePicture = req.file.filename;
    }
    user.name = name;
    user.email = email.toLowerCase();
    await user.save();
    req.session.userName = user.name;
    req.session.userEmail = user.email;
    req.session.profilePicture = user.profilePicture;
    req.flash('success', 'Profile updated successfully!');
    res.redirect('/profile');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Error updating profile.');
    res.redirect('/profile');
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;
    const user = await User.findById(req.session.userId);
    if (!user) {
      req.flash('error', 'User not found.');
      return res.redirect('/profile');
    }
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      req.flash('error', 'Current password is incorrect.');
      return res.redirect('/profile');
    }
    if (newPassword !== confirmNewPassword) {
      req.flash('error', 'New passwords do not match.');
      return res.redirect('/profile');
    }
    if (newPassword.length < 6) {
      req.flash('error', 'New password must be at least 6 characters.');
      return res.redirect('/profile');
    }
    user.password = newPassword;
    await user.save();
    req.flash('success', 'Password changed successfully!');
    res.redirect('/profile');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Error changing password.');
    res.redirect('/profile');
  }
};
