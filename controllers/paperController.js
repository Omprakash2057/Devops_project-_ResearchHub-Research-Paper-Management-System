// Paper controller
const Paper = require('../models/Paper');
const path = require('path');

exports.list = (req, res) => {
  res.render('papers/index');
};

exports.show = (req, res) => {
  res.render('papers/show');
};

exports.create = (req, res) => {
  res.render('papers/create');
};

exports.edit = (req, res) => {
  res.render('papers/edit');
};

exports.store = async (req, res) => {
  try {
    const { title, author, content } = req.body;
    
    if (!title || !author) {
      return res.status(400).json({ error: 'Title and author are required' });
    }

    const paperData = {
      title,
      author,
      content
    };

    // Handle file upload if present
    if (req.file) {
      paperData.filePath = `/uploads/${req.file.filename}`;
      paperData.fileName = req.file.originalname;
    }

    const paper = new Paper(paperData);
    await paper.save();

    res.status(201).json({ 
      message: 'Paper created successfully', 
      paperId: paper._id 
    });
  } catch (error) {
    console.error('Error creating paper:', error);
    res.status(500).json({ error: 'Failed to create paper' });
  }
};
