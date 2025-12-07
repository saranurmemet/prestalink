# PrestaLink Backend API

Backend API for PrestaLink - International Talent Platform for global talent and EU recruiters.

## Features

- 🔐 User authentication with JWT
- 👥 Multi-role support (user, recruiter, admin, superadmin)
- 💼 Job management
- 📝 Application management with file uploads
- 🔔 Notification system
- 📄 CV and certificate upload support

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database with Mongoose ODM
- **JWT** - Authentication
- **Multer** - File uploads
- **Bcrypt** - Password hashing

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

## Installation

1. Clone the repository and navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:
```env
MONGO_URI=mongodb://localhost:27017/prestalink
JWT_SECRET=your-super-secret-jwt-key-change-in-production
PORT=5000
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

## Running the Application

### Development Mode
```bash
npm run dev
```
Starts the server with nodemon for auto-reloading on file changes.

### Production Mode
```bash
npm start
```

### Seed Database
To populate the database with test data:
```bash
npm run seed
```

This will create:
- Test users (candidate, recruiter, admin)
- Sample jobs
- Default password: `Test123!`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Universal login
- `POST /api/auth/user/login` - User role login
- `POST /api/auth/recruiter/login` - Recruiter role login
- `POST /api/auth/admin/login` - Admin role login
- `POST /api/auth/superadmin/login` - Superadmin role login
- `GET /api/auth/me` - Get current user profile

### Jobs
- `GET /api/jobs` - Get all jobs (optional query: `?language=EN`)
- `GET /api/jobs/:id` - Get job by ID
- `POST /api/jobs` - Create job (recruiter, admin, superadmin only)
- `PUT /api/jobs/:id` - Update job (owner or admin only)
- `DELETE /api/jobs/:id` - Delete job (owner or admin only)

### Applications
- `POST /api/applications` - Submit application with CV and certificates
- `GET /api/applications/user/:id` - Get user's applications
- `GET /api/applications/job/:id` - Get applications for a job (recruiter/admin only)
- `PUT /api/applications/:id/status` - Update application status (recruiter/admin only)

### Notifications
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/mark-read` - Mark all notifications as read

## File Uploads

- **CV**: Maximum 5MB, allowed types: PDF, PNG, JPEG, JPG
- **Certificates**: Up to 5 files, maximum 5MB each, allowed types: PDF, PNG, JPEG, JPG

Uploaded files are stored in:
- CVs: `backend/uploads/cvs/`
- Certificates: `backend/uploads/certificates/`

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGO_URI` | MongoDB connection string | Required |
| `JWT_SECRET` | Secret key for JWT tokens | Required |
| `PORT` | Server port | 5000 |
| `CLIENT_URL` | Frontend URL(s) for CORS (comma-separated) | http://localhost:3000 |
| `NODE_ENV` | Environment (development/production) | development |

## Project Structure

```
backend/
├── config/          # Database configuration
├── controllers/     # Route controllers
├── middleware/      # Auth and error middleware
├── models/          # Mongoose models
├── routes/          # API routes
├── scripts/         # Utility scripts (seed)
├── uploads/         # File uploads directory
├── utils/           # Utility functions
└── server.js        # Application entry point
```

## Error Handling

The API uses centralized error handling middleware that:
- Handles validation errors
- Manages duplicate key errors
- Handles JWT errors
- Returns appropriate HTTP status codes

## Security

- Passwords are hashed using bcrypt (10 rounds)
- JWT tokens expire after 7 days
- File uploads are validated for type and size
- CORS is configured for allowed origins only

## Development

### Adding New Routes

1. Create controller in `controllers/`
2. Create route file in `routes/`
3. Register route in `server.js`

### Adding New Models

1. Create schema in `models/`
2. Export Mongoose model

## License

ISC

## Support

For issues and questions, please contact the development team.



