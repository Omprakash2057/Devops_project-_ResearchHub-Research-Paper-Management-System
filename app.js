const express = require('express');
const path = require('path');
const session = require('express-session');
const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// Mock data
const mockPapers = [
  { id: 1, title: 'Machine Learning Fundamentals', author: 'John Smith', date: '2024-01-15', category: 'AI', status: 'published', views: 234 },
  { id: 2, title: 'Deep Learning in Neural Networks', author: 'Sarah Johnson', date: '2024-01-20', category: 'AI', status: 'published', views: 456 },
  { id: 3, title: 'Quantum Computing Overview', author: 'Mike Chen', date: '2024-02-10', category: 'Physics', status: 'draft', views: 89 },
  { id: 4, title: 'Blockchain Technology', author: 'Emma Davis', date: '2024-02-15', category: 'Tech', status: 'published', views: 567 },
  { id: 5, title: 'Climate Change Analysis', author: 'Alex Wilson', date: '2024-03-01', category: 'Science', status: 'published', views: 345 },
  { id: 6, title: 'Renewable Energy Systems', author: 'Lisa Brown', date: '2024-03-05', category: 'Energy', status: 'published', views: 278 },
  { id: 7, title: 'Cybersecurity Threats 2024', author: 'David Miller', date: '2024-03-10', category: 'Security', status: 'published', views: 612 },
];

const mockUsers = [
  { id: 1, username: 'admin', email: 'admin@research.com', role: 'admin', papers: 8, joined: '2023-01-15' },
  { id: 2, username: 'john_smith', email: 'john@research.com', role: 'user', papers: 3, joined: '2023-06-20' },
  { id: 3, username: 'sarah_j', email: 'sarah@research.com', role: 'editor', papers: 5, joined: '2023-04-10' },
  { id: 4, username: 'mike_chen', email: 'mike@research.com', role: 'user', papers: 2, joined: '2024-01-05' },
  { id: 5, username: 'emma_d', email: 'emma@research.com', role: 'user', papers: 4, joined: '2023-11-12' },
  { id: 6, username: 'alex_wilson', email: 'alex@research.com', role: 'editor', papers: 6, joined: '2023-03-22' },
  { id: 7, username: 'lisa_brown', email: 'lisa@research.com', role: 'user', papers: 3, joined: '2024-02-01' },
  { id: 8, username: 'david_m', email: 'david@research.com', role: 'user', papers: 5, joined: '2023-09-18' },
];

// Mock credentials - in a real app, these would be from a database
const validUsers = {
  'admin': { password: 'admin123', email: 'admin@research.com', role: 'admin', name: 'Admin User' },
  'john_smith': { password: 'john123', email: 'john@research.com', role: 'user', name: 'John Smith' },
  'sarah_j': { password: 'sarah123', email: 'sarah@research.com', role: 'editor', name: 'Sarah Johnson' },
};

// Middleware to check authentication
const requireAuth = (req, res, next) => {
  if (req.session && req.session.user) {
    next();
  } else {
    res.redirect('/auth/login');
  }
};

// LOGIN PAGE ROUTE
app.get('/auth/login', (req, res) => {
  const loginPage = `<!DOCTYPE html>
<html>
<head>
  <title>Login - ResearchHub</title>
  <link rel="stylesheet" href="/css/style.css">
  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
  <style>
    body { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; display: flex; align-items: center; justify-content: center; }
    .login-container { background: white; padding: 40px; border-radius: 12px; box-shadow: 0 10px 40px rgba(0,0,0,0.2); width: 100%; max-width: 400px; }
    .login-header { text-align: center; margin-bottom: 32px; }
    .login-icon { font-size: 48px; color: #667eea; margin-bottom: 16px; }
    .login-header h1 { font-size: 28px; font-weight: 600; color: #1f2937; margin: 0; }
    .login-header p { color: #6b7280; margin: 8px 0 0 0; }
    .form-group { margin-bottom: 24px; }
    label { display: block; font-size: 14px; font-weight: 600; color: #1f2937; margin-bottom: 8px; }
    input { width: 100%; padding: 10px 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px; font-family: inherit; }
    input:focus { outline: none; border-color: #667eea; box-shadow: 0 0 0 3px rgba(102,126,234,0.1); }
    .btn-login { width: 100%; padding: 10px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 6px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.3s ease; }
    .btn-login:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(102,126,234,0.3); }
    .error { color: #ef4444; font-size: 14px; margin-top: 8px; padding: 8px 12px; background: #fee2e2; border-radius: 6px; }
    .demo-users { margin-top: 24px; padding-top: 24px; border-top: 1px solid #e5e7eb; }
    .demo-users p { font-size: 12px; color: #6b7280; margin-bottom: 12px; font-weight: 600; }
    .demo-user { display: flex; justify-content: space-between; align-items: center; padding: 8px; background: #f9fafb; border-radius: 6px; margin-bottom: 8px; font-size: 12px; }
    .demo-user strong { color: #1f2937; }
    .demo-user code { color: #667eea; font-family: monospace; }
  </style>
</head>
<body>
  <div class="login-container">
    <div class="login-header">
      <div class="login-icon"><i class="fas fa-book"></i></div>
      <h1>ResearchHub</h1>
      <p>Research Paper Management System</p>
    </div>
    
    <form method="POST" action="/auth/login">
      <div class="form-group">
        <label>Username</label>
        <input type="text" name="username" placeholder="Enter username" required>
      </div>
      <div class="form-group">
        <label>Password</label>
        <input type="password" name="password" placeholder="Enter password" required>
      </div>
      ${req.query.error ? '<div class="error"><i class="fas fa-exclamation-circle"></i> Invalid username or password</div>' : ''}
      <button type="submit" class="btn-login"><i class="fas fa-sign-in-alt"></i> Login</button>
    </form>

    <div class="demo-users">
      <p>📝 Demo Credentials:</p>
      <div class="demo-user">
        <div><strong>admin</strong><br><code>admin123</code></div>
        <span class="badge badge-admin">Admin</span>
      </div>
      <div class="demo-user">
        <div><strong>john_smith</strong><br><code>john123</code></div>
        <span class="badge badge-user">User</span>
      </div>
      <div class="demo-user">
        <div><strong>sarah_j</strong><br><code>sarah123</code></div>
        <span class="badge badge-editor">Editor</span>
      </div>
    </div>
  </div>
</body>
</html>`;
  res.send(loginPage);
});

// LOGIN FORM SUBMISSION
app.post('/auth/login', (req, res) => {
  const { username, password } = req.body;
  
  if (validUsers[username] && validUsers[username].password === password) {
    req.session.user = {
      username: username,
      name: validUsers[username].name,
      role: validUsers[username].role,
      email: validUsers[username].email,
      initials: username.substring(0, 2).toUpperCase()
    };
    res.redirect('/');
  } else {
    res.redirect('/auth/login?error=1');
  }
});

// LOGOUT ROUTE
app.get('/auth/logout', (req, res) => {
  const logoutPage = `<!DOCTYPE html>
<html>
<head>
  <title>Logged Out - ResearchHub</title>
  <link rel="stylesheet" href="/css/style.css">
  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
  <style>
    body { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; display: flex; align-items: center; justify-content: center; }
    .logout-container { background: white; padding: 40px; border-radius: 12px; box-shadow: 0 10px 40px rgba(0,0,0,0.2); width: 100%; max-width: 400px; text-align: center; }
    .logout-icon { font-size: 64px; color: #10b981; margin-bottom: 24px; }
    h1 { font-size: 28px; font-weight: 600; color: #1f2937; margin-bottom: 12px; }
    p { color: #6b7280; margin-bottom: 24px; }
    .btn-login { display: inline-block; padding: 10px 24px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 6px; font-size: 14px; font-weight: 600; cursor: pointer; text-decoration: none; transition: all 0.3s ease; }
    .btn-login:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(102,126,234,0.3); }
  </style>
</head>
<body>
  <div class="logout-container">
    <div class="logout-icon"><i class="fas fa-check-circle"></i></div>
    <h1>Logged Out Successfully!</h1>
    <p>You have been logged out of ResearchHub. Thank you for using our platform.</p>
    <a href="/auth/login" class="btn-login"><i class="fas fa-sign-in-alt"></i> Login Again</a>
  </div>
</body>
</html>`;
  
  req.session.destroy((err) => {
    res.send(logoutPage);
  });
});

// Helper function to render layout
const getLayout = (title, pageContent, user = null) => {
  const userInfo = user || { username: 'Guest', role: 'guest', initials: 'G' };
  const roleColor = { admin: '#dc2626', editor: '#f59e0b', user: '#3b82f6', guest: '#9ca3af' };
  
  return `<!DOCTYPE html>
<html>
<head>
  <title>${title} - ResearchHub</title>
  <link rel="stylesheet" href="/css/style.css">
  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
</head>
<body>
<div class="container-app">
  <aside class="sidebar">
    <div class="sidebar-header">
      <div class="logo">
        <span class="logo-icon">R</span>
        <h2>ResearchHub</h2>
      </div>
    </div>
    <nav class="sidebar-nav">
      <div class="nav-section">
        <h3>MAIN</h3>
        <ul>
          <li><a href="/" ${title === 'Dashboard' ? 'class="active"' : ''}><i class="fas fa-home"></i> Dashboard</a></li>
          <li><a href="/papers" ${title === 'Research Papers' ? 'class="active"' : ''}><i class="fas fa-file-alt"></i> Research Papers</a></li>
          <li><a href="/papers/create" ${title === 'Upload Paper' ? 'class="active"' : ''}><i class="fas fa-upload"></i> Upload Paper</a></li>
        </ul>
      </div>
      <div class="nav-section">
        <h3>ADMIN</h3>
        <ul>
          <li><a href="/users" ${title === 'User Management' ? 'class="active"' : ''}><i class="fas fa-users"></i> User Management</a></li>
        </ul>
      </div>
      <div class="nav-section">
        <h3>ACCOUNT</h3>
        <ul>
          <li><a href="/profile" ${title === 'Profile' ? 'class="active"' : ''}><i class="fas fa-user-circle"></i> Profile</a></li>
          <li><a href="/auth/logout"><i class="fas fa-sign-out-alt"></i> Logout</a></li>
        </ul>
      </div>
    </nav>
  </aside>
  <main class="main-content">
    <div class="topbar">
      <h1>${title}</h1>
      <div class="user-profile">
        <div class="user-avatar">${userInfo.initials || userInfo.username.substring(0, 2).toUpperCase()}</div>
        <div class="user-info">
          <p class="user-name">${userInfo.name || userInfo.username}</p>
          <p class="user-role">${userInfo.role}</p>
        </div>
      </div>
    </div>
    <div class="dashboard-content">
      ${pageContent}
    </div>
  </main>
</div>
</body>
</html>`;
};

// Dashboard Route
app.get('/', requireAuth, (req, res) => {
  const content = `
    <div class="welcome-section">
      <h2>Welcome back, ${req.session.user.name}! Here's what's happening.</h2>
      <div class="info-banner"><i class="fas fa-info-circle"></i></div>
    </div>
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon papers"><i class="fas fa-file-lines"></i></div>
        <div class="stat-content"><h3>${mockPapers.length}</h3><p>Total Papers</p></div>
      </div>
      <div class="stat-card">
        <div class="stat-icon users"><i class="fas fa-users"></i></div>
        <div class="stat-content"><h3>${mockUsers.length}</h3><p>Total Users</p></div>
      </div>
      <div class="stat-card">
        <div class="stat-icon recent"><i class="fas fa-clock"></i></div>
        <div class="stat-content"><h3>6</h3><p>Recent (30d)</p></div>
      </div>
    </div>
    <div class="charts-grid">
      <div class="chart-card">
        <h3>Papers by Category</h3>
        <div class="chart-placeholder">📊 Bar Chart Visualization</div>
      </div>
      <div class="chart-card">
        <h3>Status Distribution</h3>
        <div class="chart-placeholder">🥧 Pie Chart Visualization</div>
      </div>
    </div>
    <div class="table-container">
      <div class="table-header">
        <h3>Recent Papers</h3>
      </div>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${mockPapers.slice(0, 5).map(paper => `
            <tr>
              <td>${paper.title}</td>
              <td>${paper.author}</td>
              <td>${new Date(paper.date).toLocaleDateString()}</td>
              <td><span class="badge ${paper.status === 'published' ? 'badge-admin' : 'badge-editor'}">${paper.status}</span></td>
              <td>
                <div class="action-buttons">
                  <a href="/papers/${paper.id}" class="btn btn-primary btn-sm"><i class="fas fa-eye"></i> View</a>
                  <button class="btn btn-danger btn-sm" onclick="if(confirm('Delete this paper?')) location.href='/papers/${paper.id}/delete'"><i class="fas fa-trash"></i> Delete</button>
                </div>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
  res.send(getLayout('Dashboard', content, req.session.user));
});

// Papers Route
app.get('/papers', requireAuth, (req, res) => {
  const content = `
    <div class="search-filter">
      <div class="search-box">
        <input type="text" placeholder="Search papers...">
        <i class="fas fa-search"></i>
      </div>
      <select class="filter-select">
        <option>All Categories</option>
        <option>AI</option>
        <option>Physics</option>
        <option>Tech</option>
        <option>Science</option>
        <option>Energy</option>
        <option>Security</option>
      </select>
      <a href="/papers/create" class="btn btn-primary"><i class="fas fa-plus"></i> Add Paper</a>
    </div>
    <div class="table-container">
      <div class="table-header">
        <h3>Research Papers</h3>
      </div>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Category</th>
            <th>Date</th>
            <th>Status</th>
            <th>Views</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${mockPapers.map(paper => `
            <tr>
              <td><strong>${paper.title}</strong></td>
              <td>${paper.author}</td>
              <td>${paper.category}</td>
              <td>${new Date(paper.date).toLocaleDateString()}</td>
              <td><span class="badge ${paper.status === 'published' ? 'badge-admin' : 'badge-editor'}">${paper.status}</span></td>
              <td>${paper.views}</td>
              <td>
                <div class="action-buttons">
                  <a href="/papers/${paper.id}" class="btn btn-primary btn-sm"><i class="fas fa-eye"></i></a>
                  <a href="/papers/${paper.id}/edit" class="btn btn-secondary btn-sm"><i class="fas fa-pen"></i></a>
                  <button class="btn btn-danger btn-sm" onclick="if(confirm('Delete this paper?')) location.href='/papers/${paper.id}/delete'"><i class="fas fa-trash"></i></button>
                </div>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
  res.send(getLayout('Research Papers', content, req.session.user));
});

// View Paper Route
app.get('/papers/:id', requireAuth, (req, res) => {
  const paper = mockPapers.find(p => p.id == req.params.id);
  if (!paper) return res.status(404).send('Paper not found');
  
  const content = `
    <div class="pdf-container">
      <h3>${paper.title}</h3>
      <div class="pdf-viewer">
        <div style="text-align: center; color: #999;">
          <i class="fas fa-file-pdf" style="font-size: 48px; display: block; margin-bottom: 16px;"></i>
          📄 PDF Preview: ${paper.title}
        </div>
      </div>
    </div>
    <div class="paper-details">
      <div class="paper-abstract">
        <h3>Abstract</h3>
        <p>This is a groundbreaking research paper on ${paper.category.toLowerCase()} that explores innovative approaches and provides valuable insights into the field. The study was conducted over several months with rigorous methodology and peer-reviewed analysis.</p>
        <br>
        <h3>Background</h3>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
      </div>
      <div class="paper-sidebar">
        <h4>Paper Info</h4>
        <p><strong>Title:</strong><br>${paper.title}</p>
        <p><strong>Author:</strong><br>${paper.author}</p>
        <p><strong>Category:</strong><br>${paper.category}</p>
        <p><strong>Published:</strong><br>${new Date(paper.date).toLocaleDateString()}</p>
        <p><strong>Status:</strong><br><span class="badge ${paper.status === 'published' ? 'badge-admin' : 'badge-editor'}">${paper.status}</span></p>
        <p><strong>Views:</strong><br>${paper.views}</p>
        <hr style="margin: 16px 0; border: none; border-top: 1px solid #e5e7eb;">
        <h4>Actions</h4>
        <div style="display: flex; gap: 8px; flex-direction: column;">
          <a href="/papers/${paper.id}/edit" class="btn btn-primary" style="text-align: center; width: 100%;"><i class="fas fa-pen"></i> Edit</a>
          <button onclick="if(confirm('Delete this paper?')) location.href='/papers/${paper.id}/delete'" class="btn btn-danger" style="text-align: center; width: 100%;"><i class="fas fa-trash"></i> Delete</button>
          <a href="/papers" class="btn btn-secondary" style="text-align: center; width: 100%;"><i class="fas fa-arrow-left"></i> Back</a>
        </div>
      </div>
    </div>
  `;
  res.send(getLayout('Paper Details', content, req.session.user));
});

// Create Paper Route
app.get('/papers/create', requireAuth, (req, res) => {
  const content = `
    <div class="form-container">
      <h2 style="margin-bottom: 24px;">Upload New Paper</h2>
      <form onsubmit="alert('Paper uploaded!'); location.href='/papers'; return false;">
        <div class="form-group">
          <label>Paper Title *</label>
          <input type="text" placeholder="Enter paper title" required>
        </div>
        <div class="form-group">
          <label>Author *</label>
          <input type="text" placeholder="Enter author name" required>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Category</label>
            <select required><option>AI</option><option>Physics</option><option>Tech</option><option>Science</option><option>Energy</option><option>Security</option></select>
          </div>
          <div class="form-group">
            <label>Status</label>
            <select required><option>Draft</option><option>Published</option></select>
          </div>
        </div>
        <div class="form-group">
          <label>Abstract</label>
          <textarea placeholder="Enter paper abstract..." required></textarea>
        </div>
        <div class="form-group">
          <label>Upload PDF *</label>
          <input type="file" accept=".pdf" required>
        </div>
        <div style="display: flex; gap: 12px;">
          <button type="submit" class="btn btn-primary"><i class="fas fa-upload"></i> Upload Paper</button>
          <a href="/papers" class="btn btn-secondary"><i class="fas fa-times"></i> Cancel</a>
        </div>
      </form>
    </div>
  `;
  res.send(getLayout('Upload Paper', content, req.session.user));
});

// Edit Paper Route
app.get('/papers/:id/edit', requireAuth, (req, res) => {
  const paper = mockPapers.find(p => p.id == req.params.id);
  if (!paper) return res.status(404).send('Paper not found');
  
  const content = `
    <div class="form-container">
      <h2 style="margin-bottom: 24px;">Edit Paper</h2>
      <form onsubmit="alert('Paper updated!'); location.href='/papers/${paper.id}'; return false;">
        <div class="form-group">
          <label>Paper Title</label>
          <input type="text" value="${paper.title}" required>
        </div>
        <div class="form-group">
          <label>Author</label>
          <input type="text" value="${paper.author}" required>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Category</label>
            <select required><option selected>${paper.category}</option><option>AI</option><option>Physics</option><option>Tech</option></select>
          </div>
          <div class="form-group">
            <label>Status</label>
            <select required><option selected>${paper.status}</option><option>Draft</option><option>Published</option></select>
          </div>
        </div>
        <div class="form-group">
          <label>Abstract</label>
          <textarea required>This is a groundbreaking research paper...</textarea>
        </div>
        <div style="display: flex; gap: 12px;">
          <button type="submit" class="btn btn-primary"><i class="fas fa-save"></i> Save Changes</button>
          <a href="/papers/${paper.id}" class="btn btn-secondary"><i class="fas fa-times"></i> Cancel</a>
        </div>
      </form>
    </div>
  `;
  res.send(getLayout('Edit Paper', content, req.session.user));
});

// Users Route
app.get('/users', requireAuth, (req, res) => {
  const content = `
    <div class="search-filter">
      <div class="search-box">
        <input type="text" placeholder="Search users...">
        <i class="fas fa-search"></i>
      </div>
      <select class="filter-select">
        <option>All Roles</option>
        <option>Admin</option>
        <option>Editor</option>
        <option>User</option>
      </select>
    </div>
    <div class="table-container">
      <div class="table-header">
        <h3>User Management</h3>
      </div>
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Papers</th>
            <th>Joined</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${mockUsers.map(user => `
            <tr>
              <td><strong>${user.username}</strong></td>
              <td>${user.email}</td>
              <td><span class="badge badge-${user.role === 'admin' ? 'admin' : user.role === 'editor' ? 'editor' : 'user'}">${user.role}</span></td>
              <td>${user.papers}</td>
              <td>${new Date(user.joined).toLocaleDateString()}</td>
              <td>
                <div class="action-buttons">
                  <a href="/users/${user.id}/edit" class="btn btn-primary btn-sm"><i class="fas fa-pen"></i> Edit</a>
                  <button class="btn btn-danger btn-sm" onclick="if(confirm('Delete user?')) location.href='/users/${user.id}/delete'"><i class="fas fa-trash"></i> Delete</button>
                </div>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
  res.send(getLayout('User Management', content, req.session.user));
});

// Edit User Route
app.get('/users/:id/edit', requireAuth, (req, res) => {
  const user = mockUsers.find(u => u.id == req.params.id);
  if (!user) return res.status(404).send('User not found');
  
  const content = `
    <div class="form-container">
      <h2 style="margin-bottom: 24px;">Edit User Role</h2>
      <form onsubmit="alert('User updated!'); location.href='/users'; return false;">
        <div class="form-group">
          <label>Username</label>
          <input type="text" value="${user.username}" disabled>
        </div>
        <div class="form-group">
          <label>Email</label>
          <input type="email" value="${user.email}" required>
        </div>
        <div class="form-group">
          <label>Role</label>
          <select required>
            <option value="user" ${user.role === 'user' ? 'selected' : ''}>User</option>
            <option value="editor" ${user.role === 'editor' ? 'selected' : ''}>Editor</option>
            <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Admin</option>
          </select>
        </div>
        <div style="display: flex; gap: 12px;">
          <button type="submit" class="btn btn-primary"><i class="fas fa-save"></i> Save Changes</button>
          <a href="/users" class="btn btn-secondary"><i class="fas fa-times"></i> Cancel</a>
        </div>
      </form>
    </div>
  `;
  res.send(getLayout('Edit User Role', content, req.session.user));
});

// Profile Route
app.get('/profile', requireAuth, (req, res) => {
  const content = `
    <div class="form-container">
      <h2 style="margin-bottom: 24px;">User Profile</h2>
      <div style="background: #f9fafb; padding: 24px; border-radius: 12px; margin-bottom: 24px;">
        <div style="display: flex; gap: 20px; align-items: center;">
          <div class="user-avatar" style="width: 64px; height: 64px; font-size: 24px;">${req.session.user.initials}</div>
          <div>
            <h3 style="margin: 0; font-size: 18px;">${req.session.user.name}</h3>
            <p style="margin: 4px 0 0 0; color: #6b7280;">${req.session.user.email}</p>
            <span class="badge badge-${req.session.user.role}">${req.session.user.role}</span>
          </div>
        </div>
      </div>

      <h3 style="margin-top: 32px; margin-bottom: 16px;">Edit Profile</h3>
      <form onsubmit="alert('Profile updated!'); return false;">
        <div class="form-row">
          <div class="form-group">
            <label>First Name</label>
            <input type="text" value="Admin" required>
          </div>
          <div class="form-group">
            <label>Last Name</label>
            <input type="text" value="User" required>
          </div>
        </div>
        <div class="form-group">
          <label>Email</label>
          <input type="email" value="admin@research.com" required>
        </div>
        <div class="form-group">
          <label>Bio</label>
          <textarea placeholder="Tell us about yourself...">Academic researcher and administrator</textarea>
        </div>
        <button type="submit" class="btn btn-primary"><i class="fas fa-save"></i> Save Profile</button>
      </form>

      <h3 style="margin-top: 32px; margin-bottom: 16px;">Change Password</h3>
      <form onsubmit="alert('Password changed!'); return false;">
        <div class="form-group">
          <label>Current Password</label>
          <input type="password" required>
        </div>
        <div class="form-group">
          <label>New Password</label>
          <input type="password" required>
        </div>
        <div class="form-group">
          <label>Confirm Password</label>
          <input type="password" required>
        </div>
        <button type="submit" class="btn btn-primary"><i class="fas fa-shield-alt"></i> Update Password</button>
      </form>

      <h3 style="margin-top: 32px; margin-bottom: 16px;">Account Statistics</h3>
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon papers"><i class="fas fa-file-lines"></i></div>
          <div class="stat-content"><h3>12</h3><p>Papers Published</p></div>
        </div>
        <div class="stat-card">
          <div class="stat-icon users"><i class="fas fa-eye"></i></div>
          <div class="stat-content"><h3>2.4K</h3><p>Total Views</p></div>
        </div>
        <div class="stat-card">
          <div class="stat-icon recent"><i class="fas fa-calendar"></i></div>
          <div class="stat-content"><h3>1Y</h3><p>Member Since</p></div>
        </div>
      </div>
    </div>
  `;
  res.send(getLayout('Profile', content, req.session.user));
});

// Delete routes (with confirmation)
app.get('/papers/:id/delete', requireAuth, (req, res) => {
  res.send(getLayout('Deleted', '<h2>Paper deleted successfully!</h2><p><a href="/papers" style="color: #667eea;">Back to Papers</a></p>', req.session.user));
});

app.get('/users/:id/delete', requireAuth, (req, res) => {
  res.send(getLayout('Deleted', '<h2>User deleted successfully!</h2><p><a href="/users" style="color: #667eea;">Back to Users</a></p>', req.session.user));
});

// Logout
app.get('/auth/logout', (req, res) => {
  res.send(getLayout('Logged Out', '<h2>Logged out successfully!</h2><p><a href="/" style="color: #667eea;">Return to Dashboard</a></p>'));
});

// 404 handler
app.use((req, res) => {
  res.status(404).send(getLayout('404', '<h2 style="color: #ef4444;">Page Not Found</h2><p><a href="/" style="color: #667eea;">Go to Dashboard</a></p>'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ ResearchHub running on http://localhost:${PORT}`);
});
