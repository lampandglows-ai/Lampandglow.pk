# LampandGlow - Complete E-Commerce System

A full-stack e-commerce application with admin dashboard, user authentication, product management, and order processing.

## 🎯 System Architecture

```
├── backend/              # Node.js + Express + MongoDB
├── frontend/             # React + Vite + TailwindCSS
└── admin/                # React Admin Dashboard
```

## ✨ Features

### Frontend
- ✅ User Authentication (Sign Up / Sign In)
- ✅ User Profile Management
- ✅ Product Browsing
- ✅ Shopping Cart & Checkout
- ✅ Order Management
- ✅ User Dashboard with Order History
- ✅ Protected Routes (requires login)

### Admin Dashboard
- ✅ Admin Login (role-based access)
- ✅ Dashboard with Real-time Stats
- ✅ Product Management (CRUD)
- ✅ Order Management with Status Updates
- ✅ User Management
- ✅ Sales Analytics
- ✅ Monthly Revenue Tracking
- ✅ Top Selling Products

### Backend APIs
- ✅ Authentication (JWT-based)
- ✅ User Management
- ✅ Product CRUD
- ✅ Order Processing
- ✅ Admin-only endpoints
- ✅ MongoDB Integration

## 🚀 Quick Start

### Prerequisites
- Node.js v16+
- MongoDB (local or Atlas)
- npm or yarn

### 1️⃣ Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
MONGODB_URI=mongodb://localhost:27017/lampandglow
JWT_SECRET=your_secret_key_here
PORT=5000
NODE_ENV=development

# Start the server
npm run dev
```

**API Endpoints:**
- `POST /api/auth/signup` - Register user
- `POST /api/auth/signin` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `GET /api/products` - Get all products
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders
- `PUT /api/orders/:id/status` - Update order (admin)
- `GET /api/admin/stats` - Dashboard stats (admin)

### 2️⃣ Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file (optional)
VITE_API_URL=http://localhost:5000/api

# Start development server
npm run dev
```

**Key Pages:**
- `/` - Home
- `/login` - Login page
- `/signup` - Sign up page
- `/profile` - User profile & orders
- `/products` - Browse products
- `/checkout` - Checkout page

### 3️⃣ Admin Dashboard Setup

```bash
cd admin

# Install dependencies
npm install

# Create .env file (optional)
VITE_API_URL=http://localhost:5000/api

# Start development server
npm run dev
```

**Admin Endpoints:**
- `/login` - Admin login
- `/` - Dashboard
- `/products` - Product management
- `/orders` - Order management
- `/users` - User management
- `/analytics` - Sales analytics

## 📋 Database Models

### User Schema
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  address: String,
  city: String,
  state: String,
  zipCode: String,
  role: 'user' | 'admin',
  createdAt: Date
}
```

### Product Schema
```javascript
{
  name: String,
  description: String,
  price: Number,
  category: String,
  image: String,
  images: [String],
  stock: Number,
  rating: Number,
  featured: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Order Schema
```javascript
{
  user: ObjectId (ref: User),
  items: [{
    product: ObjectId (ref: Product),
    name: String,
    price: Number,
    quantity: Number,
    image: String
  }],
  totalAmount: Number,
  shippingAddress: {
    name, email, phone, address,
    city, state, zipCode
  },
  orderStatus: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled',
  paymentStatus: 'pending' | 'completed' | 'failed',
  paymentMethod: String,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔐 Authentication Flow

1. **User Signup**
   - POST `/api/auth/signup` with email & password
   - Backend hashes password with bcryptjs
   - JWT token generated and stored in localStorage

2. **User Login**
   - POST `/api/auth/signin`
   - JWT token returned
   - Token stored in localStorage
   - Token sent in Authorization header for all requests

3. **Admin Access**
   - Only users with `role: 'admin'` can access admin dashboard
   - Middleware checks role on admin routes
   - Automatic redirect to login if unauthorized

## 🛒 Order Flow

1. **User adds items to cart**
2. **Checkout → Create Order**
   - `POST /api/orders` with cart items
   - Order created in database
   - Product stock decreased
3. **Admin manages orders**
   - View all orders
   - Update order status
   - Track delivery

## 📊 Admin Features

### Dashboard
- Total users, products, orders
- Total revenue
- Recent orders list

### Products
- View all products
- Create new product
- Edit product details
- Delete products
- Search by name

### Orders
- View all orders with details
- Change order status (pending → confirmed → shipped → delivered)
- Track customer info
- Search orders

### Users
- View all registered users
- User details (email, phone, role)
- Admin identification

### Analytics
- Monthly sales data
- Order status distribution
- Top selling products
- Revenue tracking

## 🎨 UI/UX Features

- **Responsive Design** - Works on all devices
- **Tailwind CSS** - Modern styling
- **Lucide Icons** - Beautiful icons
- **Dark/Light modes** - Admin dashboard supports both
- **Form Validation** - Client & server-side
- **Error Handling** - User-friendly messages
- **Loading States** - Visual feedback

## 🔄 State Management

### Frontend
- React Context API for authentication
- localStorage for token persistence
- Axios interceptors for API calls

### Admin
- React Context API
- localStorage for admin token
- API-based state management

## 📝 Environment Variables

### Backend (.env)
```
MONGODB_URI=mongodb://localhost:27017/lampandglow
JWT_SECRET=your_secret_key_min_16_chars
PORT=5000
NODE_ENV=development
```

### Frontend (.env - optional)
```
VITE_API_URL=http://localhost:5000/api
```

### Admin (.env - optional)
```
VITE_API_URL=http://localhost:5000/api
```

## 🚀 Deployment

### Backend (Vercel/Heroku)
1. Push code to GitHub
2. Connect repository to hosting platform
3. Set environment variables
4. Deploy

### Frontend (Vercel/Netlify)
1. Build: `npm run build`
2. Connect to hosting
3. Deploy built files

### Database (MongoDB Atlas)
1. Create MongoDB Atlas cluster
2. Get connection string
3. Update `MONGODB_URI` in backend .env

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Find process using port 5000
lsof -i :5000

# Kill process
kill -9 <PID>
```

### MongoDB Connection Error
```bash
# Check MongoDB is running
mongod

# Or use MongoDB Atlas connection string
```

### CORS Issues
- Backend has CORS enabled for all origins
- Verify API_URL in frontend

### Authentication Issues
- Clear localStorage: `localStorage.clear()`
- Ensure token is valid
- Check JWT_SECRET matches backend

## 📱 Testing Credentials

### User Account
```
Email: user@test.com
Password: password123
```

### Admin Account
```
Email: admin@test.com
Password: admin123
```

## 🔗 API Response Format

**Success Response:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {...}
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error description",
  "errors": [...]
}
```

## 📞 Support

For issues or questions:
1. Check README
2. Review API endpoints
3. Check browser console for errors
4. Verify backend is running

## 📄 License

This project is licensed under the ISC License.

---

**Built with ❤️ by LampandGlow Development Team**
