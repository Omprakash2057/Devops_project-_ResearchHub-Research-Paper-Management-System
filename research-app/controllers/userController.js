const User = require('../models/User');
const Paper = require('../models/Paper');
const fs = require('fs');
const path = require('path');

exports.index = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.render('users/index', { title: 'User Management', users });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Error loading users.');
    res.redirect('/dashboard');
  }
};

exports.getEdit = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      req.flash('error', 'User not found.');
      return res.redirect('/users');
    }
    res.render('users/edit', { title: 'Edit User', editUser: user });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Error loading user.');
    res.redirect('/users');
  }
};

exports.putEdit = async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) {
      req.flash('error', 'User not found.');
      return res.redirect('/users');
    }
    if (['admin', 'user'].includes(role)) {
      user.role = role;
      await user.save();
    }
    req.flash('success', 'User role updated.');
    res.redirect('/users');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Error updating user.');
    res.redirect('/users');
  }
};

exports.delete = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      req.flash('error', 'User not found.');
      return res.redirect('/users');
    }
    if (user._id.toString() === req.session.userId) {
      req.flash('error', 'You cannot delete your own account here.');
      return res.redirect('/users');
    }
    const userPapers = await Paper.find({ uploadedBy: user._id });
    for (const paper of userPapers) {
      const filePath = path.join(__dirname, '../public/uploads', paper.pdfFile);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      await paper.deleteOne();
    }
    await user.deleteOne();
    req.flash('success', 'User deleted successfully.');
    res.redirect('/users');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Error deleting user.');
    res.redirect('/users');
  }
};
