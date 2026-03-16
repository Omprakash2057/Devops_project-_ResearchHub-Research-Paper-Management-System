# ResearchHub - Research Paper Management System

## Project Overview

ResearchHub is a comprehensive web-based research paper management system designed to help researchers, academics, and institutions organize, store, and manage research papers efficiently. The platform provides features for uploading, categorizing, searching, and collaborating on research papers with user role management and secure authentication.

## Features

- **User Authentication**: Secure login and registration system with role-based access control
- **Paper Management**: Create, read, update, and delete research papers
- **File Upload**: Upload research papers in PDF, DOC, and DOCX formats
- **User Management**: Admin panel to manage user accounts and roles
- **Dashboard**: Personalized dashboard for tracking papers and activities
- **Profile Management**: User profile customization and management
- **Search & Filter**: Search and categorize papers by various criteria
- **Responsive Design**: Mobile-friendly user interface

## Tech Stack

- **Backend**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Frontend**: EJS templating engine
- **File Upload**: Multer middleware for file handling
- **Session Management**: Express-session
- **Styling**: CSS with responsive design

## Folder Structure

```
research-app/
├── app.js                          # Main application entry point
├── package.json                    # Project dependencies and scripts
├── package-lock.json               # Locked dependency versions
├── README.md                       # Project documentation
│
├── config/                         # Configuration files
│   ├── db.js                       # Database connection configuration
│   └── session.js                  # Session configuration
│
├── controllers/                    # Business logic controllers
│   ├── authController.js           # Authentication logic (login, register)
│   ├── dashboardController.js      # Dashboard page rendering
│   ├── paperController.js          # Paper CRUD operations & file upload
│   ├── profileController.js        # User profile management
│   └── userController.js           # User management operations
│
├── middleware/                     # Custom middleware
│   ├── auth.js                     # Authentication middleware
│   └── multer.js                   # File upload configuration
│
├── models/                         # Database schemas
│   ├── Paper.js                    # Paper document schema
│   └── User.js                     # User document schema
│
├── routes/                         # API and page routes
│   ├── auth.js                     # Authentication routes
│   ├── dashboard.js                # Dashboard routes
│   ├── papers.js                   # Paper management routes
│   ├── profile.js                  # Profile management routes
│   └── users.js                    # User management routes
│
├── views/                          # EJS template files
│   ├── layout-top.ejs              # Common header template
│   ├── layout-bottom.ejs           # Common footer template
│   ├── 404.ejs                     # 404 error page
│   ├── 500.ejs                     # 500 error page
│   │
│   ├── auth/                       # Authentication pages
│   │   ├── login.ejs               # Login page
│   │   └── register.ejs            # Registration page
│   │
│   ├── dashboard/                  # Dashboard pages
│   │   └── index.ejs               # Dashboard home
│   │
│   ├── papers/                     # Paper management pages
│   │   ├── index.ejs               # Papers list view
│   │   ├── create.ejs              # Create new paper form
│   │   ├── edit.ejs                # Edit paper form
│   │   └── show.ejs                # Paper detail view
│   │
│   ├── profile/                    # Profile pages
│   │   └── index.ejs               # User profile page
│   │
│   └── users/                      # User management pages
│       ├── index.ejs               # Users list view
│       └── edit.ejs                # Edit user form
│
├── public/                         # Static assets
│   ├── css/
│   │   └── style.css               # Global styles
│   ├── js/                         # Client-side JavaScript
│   └── uploads/                    # Uploaded research papers directory
│
└── node_modules/                   # Project dependencies (auto-generated)
```

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)
- MongoDB (local or cloud instance)

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/Omprakash2057/Devops_project-_ResearchHub-Research-Paper-Management-System.git
   cd research-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure database**
   - Update `config/db.js` with your MongoDB connection string
   - Ensure MongoDB is running

4. **Set environment variables** (optional)
   - Create a `.env` file in the root directory
   - Add configuration as needed

5. **Start the application**
   ```bash
   npm start
   ```
   or
   ```bash
   node app.js
   ```

6. **Access the application**
   - Open your browser and navigate to `http://localhost:3000`

## Default Credentials

The application comes with demo credentials for testing:

| Username | Password | Role |
|----------|----------|------|
| admin | admin123 | Admin |
| john_smith | john123 | User |
| sarah_j | sarah123 | Editor |

**Note**: Change these credentials in production.

## API Routes

### Authentication Routes (`/auth`)
- `GET /auth/login` - Login page
- `POST /auth/login` - Login submission
- `GET /auth/register` - Registration page
- `POST /auth/register` - Registration submission

### Dashboard Routes (`/dashboard`)
- `GET /dashboard` - Dashboard home

### Paper Routes (`/papers`)
- `GET /papers` - List all papers
- `GET /papers/create` - Create paper form
- `POST /papers` - Upload/create paper
- `GET /papers/:id` - View paper details
- `GET /papers/:id/edit` - Edit paper form
- `PUT /papers/:id` - Update paper

### Profile Routes (`/profile`)
- `GET /profile` - User profile
- `PUT /profile` - Update profile

### User Routes (`/users`)
- `GET /users` - List all users
- `GET /users/:id/edit` - Edit user form
- `PUT /users/:id` - Update user

## File Upload Configuration

- **Supported formats**: PDF, DOC, DOCX
- **Max file size**: 10MB
- **Storage location**: `/public/uploads/`
- **File naming**: Timestamp-based with original extension

## Database Schema

### User Model
```javascript
{
  username: String (required),
  email: String (required),
  password: String (hashed),
  role: String (admin/editor/user),
  createdAt: Date
}
```

### Paper Model
```javascript
{
  title: String (required),
  author: String (required),
  content: String,
  filePath: String,
  fileName: String,
  createdAt: Date
}
```

## Session Configuration

- **Session Store**: Memory (suitable for development)
- **Secret Key**: 'your-secret-key' (change in production)
- **Cookie Settings**: Secure = false (enable in production)

## Security Considerations

1. **Production Deployment**:
   - Change session secret key
   - Enable secure cookies (HTTPS)
   - Implement password hashing
   - Use environment variables for sensitive data
   - Set up proper database authentication

2. **File Upload Security**:
   - Validate file types and sizes
   - Sanitize file names
   - Store uploads outside web root in production
   - Implement virus scanning

3. **Authentication**:
   - Use HTTPS only
   - Implement rate limiting
   - Add CSRF protection
   - Use strong password policies

## Development

### Running in Development Mode
```bash
npm start
```

### Project Structure Guidelines
- Controllers handle business logic
- Models define database schemas
- Routes define API endpoints
- Middleware handles cross-cutting concerns
- Views contain EJS templates

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in `config/db.js`

2. **File Upload Issues**
   - Verify `/public/uploads` directory exists
   - Check file permissions
   - Ensure file size is under 10MB

3. **Session Not Persisting**
   - Clear browser cookies
   - Restart the application
   - Check session configuration

## Future Enhancements

- Database session store
- Advanced search and filtering
- Paper collaboration features
- Comments and reviews system
- Notification system
- Password reset functionality
- Two-factor authentication
- Paper recommendations engine

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For questions or support, please reach out to the project maintainer or open an issue on GitHub.

---

**Last Updated**: March 16, 2026
**Version**: 1.0.0
