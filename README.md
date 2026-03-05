# 🍽️ Foodieland Server

A **production-ready Node.js + Express authentication server** with complete Role-Based Access Control (RBAC), JWT authentication, refresh tokens, and security best practices.

## 🌟 Features

✅ **User Authentication**
- Signup with email & password validation
- Signin with email or username
- Secure password hashing (bcryptjs)

✅ **JWT Tokens**
- Access tokens (short-lived: 15 minutes)
- Refresh tokens (long-lived: 7 days)
- Separate signing secrets for each token type
- Graceful token expiration & refresh

✅ **Role-Based Access Control**
- 3 built-in roles: `user`, `moderator`, `admin`
- Easy authorization middleware
- Flexible permission system

✅ **Database**
- MongoDB integration with Mongoose
- Automatic fallback to in-memory storage for testing
- Unique email & username constraints

✅ **Security**
- Input validation on all endpoints
- CORS configuration
- HttpOnly cookies for refresh tokens
- Proper HTTP status codes
- Secure error handling

✅ **Developer Experience**
- Complete TypeScript support
- Comprehensive documentation
- Postman collection included
- Example routes with different permission levels
- Easy to extend

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
# Edit .env with your settings
```

### 3. Start Server
```bash
npm start
```

Server runs on `http://localhost:5000`

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** | Installation, configuration, & basic usage |
| **[RBAC_AUTHENTICATION.md](./RBAC_AUTHENTICATION.md)** | Complete API endpoints & examples |
| **[TECHNICAL_ARCHITECTURE.md](./TECHNICAL_ARCHITECTURE.md)** | System design & implementation details |
| **[Postman_Collection.json](./Postman_Collection.json)** | Ready-to-import Postman requests |

## 📖 API Overview

### Authentication Endpoints
```
POST   /api/auth/signup              # Register user
POST   /api/auth/signin              # Login
POST   /api/auth/refresh-token       # Get new access token
POST   /api/auth/logout              # Logout
GET    /api/auth/me                  # Get current user
```

### Protected Routes (Examples)
```
GET    /api/test/public              # Public (no auth)
GET    /api/test/user                # Auth required
GET    /api/test/moderator           # Moderator+ role
GET    /api/test/admin               # Admin role only
```

## 🔑 Key Concepts

### User Model
```typescript
{
  _id: ObjectId,
  username: string,        // Unique, 3-20 alphanumeric
  email: string,          // Unique, valid email
  password: string,       // Hashed with bcryptjs
  roles: ["user"],        // Array of roles
  isActive: boolean,      // Account active status
  createdAt: Date,
  updatedAt: Date
}
```

### JWT Payload
```typescript
{
  id: string,
  username: string,
  email: string,
  roles: string[],
  iat: number,            // Issued at
  exp: number             // Expiration
}
```

## 🛡️ Security Implementation

| Feature | Details |
|---------|---------|
| **Passwords** | Hashed with bcryptjs (10 rounds) |
| **Access Token** | 15 min expiry, short-lived |
| **Refresh Token** | 7 day expiry, httpOnly cookie |
| **Validation** | All inputs validated |
| **CORS** | Frontend URL whitelisting |
| **Authorization** | Middleware-based role checking |

## 📁 Project Structure

```
src/
├── app.ts                   # Express app setup
├── server.ts                # Server startup
├── config/
│   └── auth.config.ts      # Auth configuration
├── controllers/
│   └── auth.controller.ts  # Auth logic
├── middleware/
│   ├── auth.middleware.ts
│   └── validation.middleware.ts
├── models/
│   └── user.model.ts       # User schema
├── routes/
│   ├── auth.routes.ts
│   └── test.routes.ts
└── utils/
    ├── jwt.ts
    ├── validation.ts
    └── errors.ts
```

## 💡 Usage Examples

### Create Protected Route
```typescript
import { Router } from "express";
import { verifyToken, authorize } from "./middleware/auth.middleware";

const router = Router();

// Any authenticated user
router.get("/profile", verifyToken, (req, res) => {
  res.json({ user: req.user });
});

// Admin only
router.delete("/users/:id", verifyToken, authorize("admin"), handler);

// Admin or moderator
router.patch(
  "/content/:id",
  verifyToken,
  authorize("admin", "moderator"),
  handler
);
```

### Frontend Integration
```javascript
// Signup
const response = await fetch('/api/auth/signup', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({ username, email, password })
});

// Login
const response = await fetch('/api/auth/signin', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({ emailOrUsername, password })
});

// Protected request
const response = await fetch('/api/test/user', {
  headers: { 'Authorization': `Bearer ${accessToken}` },
  credentials: 'include'
});
```

## ⚙️ Configuration

Key environment variables in `.env`:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/foodieland

JWT_ACCESS_SECRET=your-access-secret
JWT_ACCESS_EXPIRY=15m

JWT_REFRESH_SECRET=your-refresh-secret
JWT_REFRESH_EXPIRY=7d

FRONTEND_URL=http://localhost:3000
```

**⚠️ Important:** Generate strong secrets:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 🧪 Testing

### With Postman
1. Import `Postman_Collection.json`
2. Set `baseUrl` variable to `http://localhost:5000`
3. Run requests in order

### With curl
```bash
# Signup
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"john","email":"john@example.com","password":"pass123"}'

# Signin
curl -X POST http://localhost:5000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"emailOrUsername":"john","password":"pass123"}'

# Protected route
curl -X GET http://localhost:5000/api/test/user \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🚀 Deployment

### Environment Setup
- [ ] Change `JWT_ACCESS_SECRET` (strong random string)
- [ ] Change `JWT_REFRESH_SECRET` (strong random string)
- [ ] Set `NODE_ENV=production`
- [ ] Configure MongoDB (Atlas or self-hosted)
- [ ] Update `FRONTEND_URL`
- [ ] Enable HTTPS

### Deploy on Heroku
```bash
heroku create your-app
heroku config:set JWT_ACCESS_SECRET=...
heroku config:set MONGO_URI=...
git push heroku main
```

## 📚 Documentation Files

- **SETUP_GUIDE.md** - Step-by-step setup and basic usage
- **RBAC_AUTHENTICATION.md** - Complete API documentation with examples
- **TECHNICAL_ARCHITECTURE.md** - Deep dive into system design
- **Postman_Collection.json** - Ready-to-import API requests

## 🔗 Resources

- [JWT.io](https://jwt.io) - JWT information & debugger
- [bcryptjs](https://github.com/dcodeIO/bcrypt.js) - Password hashing
- [Express](https://expressjs.com) - Web framework
- [MongoDB](https://www.mongodb.com) - Database
- [OWASP](https://cheatsheetseries.owasp.org) - Security best practices

## 🤝 Support

For issues or questions:
1. Check **SETUP_GUIDE.md** for common problems
2. Review **RBAC_AUTHENTICATION.md** for API details
3. Read **TECHNICAL_ARCHITECTURE.md** for system design
4. Check console logs for error messages

## 📝 License

MIT

---

**Built with ❤️ for secure authentication** 🔐

Start with [SETUP_GUIDE.md](./SETUP_GUIDE.md) to get started!