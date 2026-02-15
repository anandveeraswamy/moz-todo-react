# React Todo Frontend

A modern React application for managing todos with user authentication. This is an ongoing project demonstrating how to build a full-stack application with React frontend and Django REST API backend.

> **Note:** This is a learning project and an example for students. It demonstrates best practices for setting up React applications with authentication and API integration, but is not meant to be production-perfect code.

## 🚀 Live Demo

The frontend is deployed on Render and accessible at:
**https://moz-todo-react.onrender.com**

⚠️ **Important:** The backend API on Render's free tier spins down after inactivity. The first API request may take up to **1 minute** to respond. Please be patient!

### Backend API

This frontend connects to the Django REST API backend:
**https://django-backend-aqrl.onrender.com/api**

Backend repository: https://github.com/anandveeraswamy/django-backend

You can test the API directly at: https://django-backend-aqrl.onrender.com/api/docs/

## 📋 Features

### Authentication
- **User Registration** - Create new account with username, email, and password
- **Login/Logout** - Secure JWT-based authentication
- **Password Reset** - Request password reset via email
- **Persistent Sessions** - Stay logged in across browser sessions
- **Profile Management** - View and update user profile with image uploads

### Todo Management
- **Create Todos** - Add new tasks
- **Mark Complete** - Toggle todo completion status
- **Edit Todos** - Update task names inline
- **Delete Todos** - Remove completed or unwanted tasks
- **Filter Todos** - View All, Active, or Completed tasks
- **Real-time Updates** - Changes reflect immediately

### User Experience
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Loading States** - Visual feedback during API calls
- **Error Handling** - User-friendly error messages
- **Protected Routes** - Automatic redirect to login for authenticated pages

## 🛠️ Tech Stack

- **React 18** - UI library
- **React Router** - Client-side routing
- **Vite** - Build tool and dev server
- **Axios** - HTTP client for API requests
- **JWT Authentication** - Token-based auth with localStorage
- **Cloudinary** - Image uploads for profile pictures
- **CSS** - Custom styling (no UI framework)

## 📁 Project Structure

```
moz-todo-react/
├── src/
│   ├── components/           # React components
│   │   ├── Authentication.jsx   # Login, Register, Password Reset
│   │   ├── Home.jsx            # Landing page
│   │   ├── TodoApp.jsx         # Main todo interface
│   │   ├── Todo.jsx            # Individual todo item
│   │   ├── Form.jsx            # Add todo form
│   │   ├── FilterButton.jsx   # Filter controls
│   │   ├── Navigation.jsx      # Navigation bar
│   │   └── Profile.jsx         # User profile page
│   ├── services/
│   │   └── api.js              # API client and endpoints
│   ├── hooks/
│   │   └── useTodos.js         # Custom hook for todo logic
│   ├── test/                   # Test setup files
│   ├── AuthContext.jsx         # Authentication context
│   ├── App.jsx                 # Main app component
│   ├── main.jsx                # Entry point
│   └── index.css               # Global styles
├── public/
│   └── _redirects              # Netlify/Render redirects
├── index.html                  # HTML template
├── vite.config.js              # Vite configuration
├── package.json                # Dependencies
└── .env                        # Environment variables
```

## 🚀 Local Setup Instructions

### Prerequisites

- Node.js 22.22.0 (might also work on later versions)
- npm (comes with Node.js)
- Git

### Step 1: Clone the Repository

```bash
git clone <your-repo-url>
cd moz-todo-react
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Set Up Environment Variables

Create a `.env` file in the `moz-todo-react` directory:

```env
VITE_DJANGO_API_URL=http://localhost:8000/api
VITE_CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
VITE_CLOUDINARY_UPLOAD_PRESET=your-upload-preset
```

**For local development:**
- `VITE_DJANGO_API_URL` should point to your local Django backend (default: `http://localhost:8000/api`)
- Cloudinary variables are optional (only needed for profile image uploads)

> **Note:** All Vite environment variables must start with `VITE_` to be accessible in the browser.

### Step 4: Start the Development Server

```bash
npm run dev
```

The app will be available at:
**http://localhost:3000**

### Step 5: Connect to Backend

**Option A: Use Local Backend (Recommended for Development)**

1. Follow the backend setup instructions in the backend README
2. Start the Django server: `python manage.py runserver`
3. Make sure `.env` has `VITE_DJANGO_API_URL=http://localhost:8000/api`

**Option B: Use Production Backend**

Update `.env` to use the deployed backend:
```env
VITE_DJANGO_API_URL=https://django-backend-aqrl.onrender.com/api
```

⚠️ Remember: Production backend may have 1-minute cold start delay!

## 🔗 How Backend and Frontend Work Together

### Architecture

```
┌─────────────────┐         HTTP/HTTPS          ┌─────────────────┐
│  React Frontend │  ◄────────────────────────► │  Django Backend │
│   (Port 3000)   │    JSON + JWT Tokens        │   (Port 8000)   │
└─────────────────┘                             └─────────────────┘
        │                                                  │
        │                                                  │
        ▼                                                  ▼
  Browser Storage                                  PostgreSQL DB
  (localStorage)                                   (Users + Todos)
```

### Authentication Flow

1. **User registers/logs in** → Frontend sends credentials to backend
2. **Backend validates** → Returns JWT access & refresh tokens
3. **Frontend stores tokens** → Saved in localStorage (namespaced)
4. **Subsequent requests** → Frontend includes token in Authorization header
5. **Backend verifies token** → Returns user-specific data

### API Communication

All API calls go through `src/services/api.js`:

```javascript
// Example: Fetching todos
GET https://django-backend-aqrl.onrender.com/api/todos/
Headers: { Authorization: "Bearer <access_token>" }

// Response: Array of todo objects
[
  { id: 1, name: "Learn React", completed: false, user: 5 },
  { id: 2, name: "Build project", completed: true, user: 5 }
]
```

### Key Integration Points

- **axios interceptor** - Automatically adds JWT token to protected endpoints
- **AuthContext** - Manages authentication state across components
- **Protected routes** - Redirects unauthenticated users to login
- **Error handling** - Displays API errors to users

## 🎯 Available Scripts

### Development

```bash
npm run dev          # Start dev server (http://localhost:3000)
npm run build        # Build for production
npm run preview      # Preview production build locally
```

### Testing

```bash
npm run test         # Run tests with Vitest
npm run coverage     # Generate test coverage report
```

### Linting

```bash
npm run lint         # Check for code issues
```

## 📡 API Integration

The frontend communicates with the backend through these key endpoints:

### Authentication Endpoints

| Action | Method | Endpoint | Description |
|--------|--------|----------|-------------|
| Register | POST | `/api/auth/register/` | Create new user account |
| Login | POST | `/api/auth/token/` | Get JWT tokens |
| Refresh Token | POST | `/api/auth/token/refresh/` | Refresh access token |
| Get Profile | GET | `/api/auth/profile/` | Fetch user profile |
| Update Profile | PATCH | `/api/auth/profile/` | Update user info/image |
| Password Reset | POST | `/api/auth/password-reset/` | Request reset email |
| Confirm Reset | POST | `/api/auth/password-reset-confirm/` | Set new password |

### Todo Endpoints

| Action | Method | Endpoint | Description |
|--------|--------|----------|-------------|
| List Todos | GET | `/api/todos/` | Get all user's todos |
| Create Todo | POST | `/api/todos/` | Add new todo |
| Update Todo | PUT/PATCH | `/api/todos/{id}/` | Modify todo |
| Delete Todo | DELETE | `/api/todos/{id}/` | Remove todo |

See the backend's Swagger documentation for detailed request/response formats:
**https://django-backend-aqrl.onrender.com/api/docs/**

## 🗂️ State Management

### Authentication State (AuthContext)

- Manages login status, username, tokens
- Persists authentication across page refreshes
- Uses namespaced localStorage (`appAuthentication.*`)

### Todo State (useTodos hook)

- Fetches todos from backend on component mount
- Handles CRUD operations with optimistic updates
- Manages loading and error states

## 🌐 Deployment (Render)

This project is deployed on Render as a static site.

### Environment Variables on Render

```
VITE_DJANGO_API_URL=https://django-backend-aqrl.onrender.com/api
VITE_CLOUDINARY_CLOUD_NAME=<your-cloudinary-name>
VITE_CLOUDINARY_UPLOAD_PRESET=<your-preset>
```

### Build Settings

**Build Command:**
```bash
npm install && npm run build
```

**Publish Directory:**
```
dist
```

### Redirects Configuration

The `public/_redirects` file handles client-side routing:

```
/*    /index.html   200
```

This ensures React Router works correctly on page refresh.

## 📝 Common Issues & Solutions

### Issue: "Network Error" or "Failed to fetch"

**Causes:**
- Backend server is not running
- Wrong API URL in `.env`
- CORS not configured on backend

**Solutions:**
1. Check backend is running at the URL in `.env`
2. Verify `VITE_DJANGO_API_URL` is correct
3. Check backend's `CORS_ALLOWED_ORIGINS` includes your frontend URL

### Issue: "401 Unauthorized" on todos page

**Cause:** Invalid or expired JWT token

**Solutions:**
1. Clear localStorage: `localStorage.clear()` in browser console
2. Log out and log back in
3. Check token is being sent in Authorization header (inspect Network tab)

### Issue: Changes not reflecting after updating `.env`

**Cause:** Vite doesn't hot-reload environment variables

**Solution:** Restart the dev server:
```bash
# Stop server (Ctrl+C)
npm run dev
```

### Issue: Profile image upload fails

**Cause:** Missing or incorrect Cloudinary configuration

**Solution:**
1. Verify `VITE_CLOUDINARY_CLOUD_NAME` is set
2. Verify `VITE_CLOUDINARY_UPLOAD_PRESET` is set
3. Check preset allows unsigned uploads in Cloudinary dashboard

### Issue: Backend takes forever to respond (production)

**Cause:** Render free tier cold start

**Solution:** Wait 30-60 seconds for the first request. Subsequent requests will be fast.

## 🧪 Testing

> **Note:** Testing is currently basic and limited. This project includes minimal test coverage as an example for students.

The project uses Vitest and React Testing Library for testing.

### Running Tests

```bash
npm run test         # Run all tests
npm run coverage     # Generate test coverage report
```

### Test Files

- `src/components/__tests__/` - Component tests (limited coverage)
- `src/hooks/__tests__/` - Custom hook tests
- Coverage reports appear in `coverage/` directory

## 📚 Learning Resources

- [React Documentation](https://react.dev/)
- [React Router](https://reactrouter.com/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Axios Documentation](https://axios-http.com/)
- [JWT Introduction](https://jwt.io/introduction)

## 🤝 For Students

This project demonstrates:
- ✅ React component architecture
- ✅ JWT authentication implementation
- ✅ API integration with axios
- ✅ React Router for navigation
- ✅ Custom hooks for reusable logic
- ✅ Context API for global state
- ✅ Protected routes
- ✅ Form handling and validation
- ✅ Conditional rendering
- ✅ Deployment to production

**What you can learn:**
1. How to structure a React application
2. How to integrate with a REST API
3. How to implement authentication flow
4. How to manage application state
5. How to handle errors gracefully
6. How to deploy a React app
7. How frontend and backend communicate

## 🔄 Development Workflow

### Working with Backend and Frontend

**Full-stack development:**

1. **Terminal 1:** Start backend
   ```bash
   cd django-todo-backend
   python manage.py runserver
   ```

2. **Terminal 2:** Start frontend
   ```bash
   cd moz-todo-react
   npm run dev
   ```

3. **Browser:** Visit http://localhost:3000
4. **API Testing:** Visit http://localhost:8000/api/docs/

**Making changes:**
- Frontend changes hot-reload automatically
- Backend changes require server restart (or use django-extensions)
- API changes should be tested in Swagger before updating frontend

## 📄 License

This is a student learning project. Feel free to use it as a reference for your own projects.

## 🐛 Known Issues

- Render free tier has cold start delays (~1 minute)
- Profile image upload requires Cloudinary setup
- No offline support (requires backend connection)
- Todos don't sync across multiple browser tabs

## 🎨 Screenshots & Demo

Register, login, and start managing your todos! The interface is clean and intuitive:

- **Home Page** - Welcome message with login/register options
- **Todo Dashboard** - Full CRUD interface with filter buttons
- **Profile Page** - View and update user information

Try it live: https://moz-todo-react.onrender.com

---

**Happy Coding! 🚀**

**Built with ❤️ by students, for students**
