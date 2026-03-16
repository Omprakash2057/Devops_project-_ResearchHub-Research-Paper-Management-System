// User controller
exports.list = (req, res) => {
  res.render('users/index');
};

exports.edit = (req, res) => {
  res.render('users/edit');
};
