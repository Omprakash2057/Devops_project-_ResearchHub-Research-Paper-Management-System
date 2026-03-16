const Paper = require('../models/Paper');
const User = require('../models/User');
const fs = require('fs');
const path = require('path');

exports.index = async (req, res) => {
  try {
    const { search, category, year, sort } = req.query;
    let query = {};
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
        { abstract: { $regex: search, $options: 'i' } }
      ];
    }
    if (category) query.category = category;
    if (year) query.year = parseInt(year);

    let sortOption = { createdAt: -1 };
    if (sort === 'title') sortOption = { title: 1 };
    else if (sort === 'year') sortOption = { year: -1 };
    else if (sort === 'author') sortOption = { author: 1 };

    const papers = await Paper.find(query)
      .populate('uploadedBy', 'name')
      .sort(sortOption);

    const categories = ['Deep Learning', 'Machine Learning', 'Computer Vision', 'NLP', 'Healthcare AI', 'Robotics', 'Data Science', 'Other'];
    res.render('papers/index', { title: 'Research Papers', papers, categories, search, category, year, sort });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Error loading papers.');
    res.redirect('/dashboard');
  }
};

exports.getCreate = (req, res) => {
  const categories = ['Deep Learning', 'Machine Learning', 'Computer Vision', 'NLP', 'Healthcare AI', 'Robotics', 'Data Science', 'Other'];
  res.render('papers/create', { title: 'Upload Paper', categories });
};

exports.postCreate = async (req, res) => {
  try {
    if (!req.file) {
      req.flash('error', 'Please upload a PDF file.');
      return res.redirect('/papers/create');
    }
    const { title, author, category, abstract, year } = req.body;
    if (!title || !author || !category || !abstract || !year) {
      fs.unlinkSync(req.file.path);
      req.flash('error', 'Please fill in all fields.');
      return res.redirect('/papers/create');
    }
    const paper = await Paper.create({
      title, author, category, abstract,
      year: parseInt(year),
      pdfFile: req.file.filename,
      fileSize: req.file.size,
      uploadedBy: req.session.userId
    });
    await User.findByIdAndUpdate(req.session.userId, { $inc: { papersUploaded: 1 } });
    req.flash('success', 'Paper uploaded successfully!');
    res.redirect(`/papers/${paper._id}`);
  } catch (err) {
    console.error(err);
    if (req.file) fs.unlinkSync(req.file.path);
    req.flash('error', 'Error uploading paper.');
    res.redirect('/papers/create');
  }
};

exports.show = async (req, res) => {
  try {
    const paper = await Paper.findById(req.params.id).populate('uploadedBy', 'name email');
    if (!paper) {
      req.flash('error', 'Paper not found.');
      return res.redirect('/papers');
    }
    res.render('papers/show', { title: paper.title, paper });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Error loading paper.');
    res.redirect('/papers');
  }
};

exports.getEdit = async (req, res) => {
  try {
    const paper = await Paper.findById(req.params.id);
    if (!paper) {
      req.flash('error', 'Paper not found.');
      return res.redirect('/papers');
    }
    const isOwner = paper.uploadedBy.toString() === req.session.userId;
    const isAdmin = req.session.role === 'admin';
    if (!isOwner && !isAdmin) {
      req.flash('error', 'You are not authorized to edit this paper.');
      return res.redirect('/papers');
    }
    const categories = ['Deep Learning', 'Machine Learning', 'Computer Vision', 'NLP', 'Healthcare AI', 'Robotics', 'Data Science', 'Other'];
    res.render('papers/edit', { title: 'Edit Paper', paper, categories });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Error loading paper.');
    res.redirect('/papers');
  }
};

exports.putEdit = async (req, res) => {
  try {
    const paper = await Paper.findById(req.params.id);
    if (!paper) {
      req.flash('error', 'Paper not found.');
      return res.redirect('/papers');
    }
    const isOwner = paper.uploadedBy.toString() === req.session.userId;
    const isAdmin = req.session.role === 'admin';
    if (!isOwner && !isAdmin) {
      req.flash('error', 'You are not authorized to edit this paper.');
      return res.redirect('/papers');
    }
    const { title, author, category, abstract, year } = req.body;
    paper.title = title;
    paper.author = author;
    paper.category = category;
    paper.abstract = abstract;
    paper.year = parseInt(year);
    await paper.save();
    req.flash('success', 'Paper updated successfully!');
    res.redirect(`/papers/${paper._id}`);
  } catch (err) {
    console.error(err);
    req.flash('error', 'Error updating paper.');
    res.redirect('/papers');
  }
};

exports.delete = async (req, res) => {
  try {
    const paper = await Paper.findById(req.params.id);
    if (!paper) {
      req.flash('error', 'Paper not found.');
      return res.redirect('/papers');
    }
    const isOwner = paper.uploadedBy.toString() === req.session.userId;
    const isAdmin = req.session.role === 'admin';
    if (!isOwner && !isAdmin) {
      req.flash('error', 'You are not authorized to delete this paper.');
      return res.redirect('/papers');
    }
    const filePath = path.join(__dirname, '../public/uploads', paper.pdfFile);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    await User.findByIdAndUpdate(paper.uploadedBy, { $inc: { papersUploaded: -1 } });
    await paper.deleteOne();
    req.flash('success', 'Paper deleted successfully!');
    res.redirect('/papers');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Error deleting paper.');
    res.redirect('/papers');
  }
};
