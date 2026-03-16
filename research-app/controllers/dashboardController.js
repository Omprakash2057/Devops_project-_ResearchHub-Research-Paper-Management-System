const Paper = require('../models/Paper');
const User = require('../models/User');

exports.getDashboard = async (req, res) => {
  try {
    const totalPapers = await Paper.countDocuments();
    const totalUsers = await User.countDocuments();

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentUploads = await Paper.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });

    const papers = await Paper.find().select('fileSize');
    const storageUsed = papers.reduce((acc, p) => acc + (p.fileSize || 0), 0);
    const storageUsedMB = (storageUsed / (1024 * 1024)).toFixed(2);

    const recentPapers = await Paper.find()
      .populate('uploadedBy', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    const now = new Date();
    const monthlyData = [];
    const monthLabels = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      const count = await Paper.countDocuments({ createdAt: { $gte: d, $lt: end } });
      monthLabels.push(d.toLocaleString('default', { month: 'short', year: '2-digit' }));
      monthlyData.push(count);
    }

    const categoryAgg = await Paper.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.render('dashboard/index', {
      title: 'Dashboard',
      totalPapers,
      totalUsers,
      recentUploads,
      storageUsedMB,
      recentPapers,
      monthLabels: JSON.stringify(monthLabels),
      monthlyData: JSON.stringify(monthlyData),
      categoryLabels: JSON.stringify(categoryAgg.map(c => c._id)),
      categoryData: JSON.stringify(categoryAgg.map(c => c.count))
    });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Error loading dashboard.');
    res.redirect('/auth/login');
  }
};
