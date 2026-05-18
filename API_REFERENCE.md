# LampandGlow API Reference

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected endpoints require:
```
Header: Authorization: Bearer <JWT_TOKEN>
```

---

## 🔐 Authentication Endpoints

### 1. Sign Up (Register)
**POST** `/auth/signup`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

**Errors:**
- 400: Email already exists
- 400: Missing required fields
- 500: Server error

---

### 2. Sign In (Login)
**POST** `/auth/signin`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

**Errors:**
- 401: Invalid email or password
- 400: Missing fields
- 500: Server error

---

### 3. Get Current User
**GET** `/auth/me` [Protected]

**Response (200):**
```json
{
  "success": true,
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "address": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "role": "user",
    "createdAt": "2026-04-25T10:30:00Z"
  }
}
```

**Errors:**
- 401: No token provided
- 401: Invalid token
- 500: Server error

---

### 4. Update Profile
**PUT** `/auth/profile` [Protected]

**Request Body (all optional):**
```json
{
  "name": "John Doe",
  "phone": "+1234567890",
  "address": "123 Main St",
  "city": "New York",
  "state": "NY",
  "zipCode": "10001"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "address": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "role": "user"
  }
}
```

**Errors:**
- 400: Validation errors
- 401: Not authenticated
- 500: Server error

---

## 📦 Product Endpoints

### 1. Get All Products
**GET** `/products`

**Query Parameters (optional):**
- `category`: Filter by category
- `featured`: Get only featured products

**Response (200):**
```json
{
  "success": true,
  "products": [
    {
      "id": "507f1f77bcf86cd799439012",
      "name": "Amber Table Lamp",
      "description": "Beautiful warm light lamp",
      "price": 1299,
      "category": "Table Lamps",
      "image": "https://...",
      "images": ["https://...", "https://..."],
      "stock": 15,
      "rating": 4.5,
      "featured": true,
      "createdAt": "2026-04-20T10:30:00Z"
    }
  ]
}
```

---

### 2. Get Single Product
**GET** `/products/:id`

**Response (200):**
```json
{
  "success": true,
  "product": {
    "id": "507f1f77bcf86cd799439012",
    "name": "Amber Table Lamp",
    "description": "Beautiful warm light lamp",
    "price": 1299,
    "category": "Table Lamps",
    "image": "https://...",
    "images": ["https://...", "https://..."],
    "stock": 15,
    "rating": 4.5,
    "reviews": [
      {
        "userName": "John",
        "rating": 5,
        "comment": "Great product!",
        "createdAt": "2026-04-22T10:30:00Z"
      }
    ],
    "featured": true,
    "createdAt": "2026-04-20T10:30:00Z"
  }
}
```

**Errors:**
- 404: Product not found
- 500: Server error

---

### 3. Get Featured Products
**GET** `/products/featured`

**Response (200):**
```json
{
  "success": true,
  "products": [
    {
      "id": "507f1f77bcf86cd799439012",
      "name": "Amber Table Lamp",
      "price": 1299,
      "image": "https://...",
      "featured": true
    }
  ]
}
```

---

### 4. Create Product
**POST** `/products` [Protected - Admin Only]

**Request Body:**
```json
{
  "name": "Crystal Floor Lamp",
  "description": "Modern crystal floor lamp with LED",
  "price": 2999,
  "category": "Floor Lamps",
  "image": "https://...",
  "images": ["https://...", "https://..."],
  "stock": 10
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Product created successfully",
  "product": {
    "id": "507f1f77bcf86cd799439013",
    "name": "Crystal Floor Lamp",
    "description": "Modern crystal floor lamp with LED",
    "price": 2999,
    "category": "Floor Lamps",
    "image": "https://...",
    "stock": 10,
    "rating": 0,
    "featured": false,
    "createdAt": "2026-04-25T10:30:00Z"
  }
}
```

**Errors:**
- 403: Not admin
- 400: Validation errors
- 401: Not authenticated
- 500: Server error

---

### 5. Update Product
**PUT** `/products/:id` [Protected - Admin Only]

**Request Body (all optional):**
```json
{
  "name": "Crystal Floor Lamp Updated",
  "price": 3299,
  "stock": 20,
  "featured": true
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Product updated successfully",
  "product": {
    "id": "507f1f77bcf86cd799439013",
    "name": "Crystal Floor Lamp Updated",
    "price": 3299,
    "stock": 20,
    "featured": true
  }
}
```

**Errors:**
- 404: Product not found
- 403: Not admin
- 401: Not authenticated
- 500: Server error

---

### 6. Delete Product
**DELETE** `/products/:id` [Protected - Admin Only]

**Response (200):**
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

**Errors:**
- 404: Product not found
- 403: Not admin
- 401: Not authenticated
- 500: Server error

---

## 🛒 Order Endpoints

### 1. Create Order
**POST** `/orders` [Protected]

**Request Body:**
```json
{
  "items": [
    {
      "product": "507f1f77bcf86cd799439012",
      "name": "Amber Table Lamp",
      "price": 1299,
      "quantity": 2,
      "image": "https://..."
    }
  ],
  "totalAmount": 2598,
  "shippingAddress": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "address": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001"
  },
  "paymentMethod": "credit_card"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Order created successfully",
  "order": {
    "id": "507f1f77bcf86cd799439014",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "items": [
      {
        "product": "507f1f77bcf86cd799439012",
        "name": "Amber Table Lamp",
        "price": 1299,
        "quantity": 2,
        "image": "https://..."
      }
    ],
    "totalAmount": 2598,
    "shippingAddress": {...},
    "orderStatus": "pending",
    "paymentStatus": "pending",
    "paymentMethod": "credit_card",
    "createdAt": "2026-04-25T10:30:00Z"
  }
}
```

**Errors:**
- 400: Missing required fields
- 401: Not authenticated
- 500: Server error

---

### 2. Get User Orders
**GET** `/orders` [Protected]

**Response (200):**
```json
{
  "success": true,
  "orders": [
    {
      "id": "507f1f77bcf86cd799439014",
      "user": "507f1f77bcf86cd799439011",
      "items": [...],
      "totalAmount": 2598,
      "orderStatus": "shipped",
      "paymentStatus": "completed",
      "createdAt": "2026-04-25T10:30:00Z"
    }
  ]
}
```

---

### 3. Get Single Order
**GET** `/orders/:id` [Protected]

**Response (200):**
```json
{
  "success": true,
  "order": {
    "id": "507f1f77bcf86cd799439014",
    "user": {...},
    "items": [...],
    "totalAmount": 2598,
    "shippingAddress": {...},
    "orderStatus": "shipped",
    "paymentStatus": "completed",
    "paymentMethod": "credit_card",
    "createdAt": "2026-04-25T10:30:00Z",
    "updatedAt": "2026-04-25T14:30:00Z"
  }
}
```

**Errors:**
- 404: Order not found
- 403: Not authorized to view order
- 401: Not authenticated

---

### 4. Update Order Status
**PUT** `/orders/:id/status` [Protected - Admin Only]

**Request Body:**
```json
{
  "orderStatus": "shipped",
  "paymentStatus": "completed"
}
```

**Valid Status Values:**
- orderStatus: `pending`, `confirmed`, `shipped`, `delivered`, `cancelled`
- paymentStatus: `pending`, `completed`, `failed`

**Response (200):**
```json
{
  "success": true,
  "message": "Order status updated successfully",
  "order": {
    "id": "507f1f77bcf86cd799439014",
    "orderStatus": "shipped",
    "paymentStatus": "completed",
    "updatedAt": "2026-04-25T14:30:00Z"
  }
}
```

**Errors:**
- 404: Order not found
- 403: Not admin
- 401: Not authenticated
- 500: Server error

---

### 5. Cancel Order
**PUT** `/orders/:id/cancel` [Protected]

**Response (200):**
```json
{
  "success": true,
  "message": "Order cancelled successfully",
  "order": {
    "id": "507f1f77bcf86cd799439014",
    "orderStatus": "cancelled",
    "updatedAt": "2026-04-25T15:00:00Z"
  }
}
```

**Errors:**
- 404: Order not found
- 400: Cannot cancel this order
- 403: Not authorized
- 401: Not authenticated

---

## 👨‍💼 Admin Endpoints

### 1. Get Dashboard Stats
**GET** `/admin/stats` [Protected - Admin Only]

**Response (200):**
```json
{
  "success": true,
  "stats": {
    "totalUsers": 150,
    "totalProducts": 45,
    "totalOrders": 320,
    "totalRevenue": 156000,
    "recentOrders": [
      {
        "id": "507f1f77bcf86cd799439014",
        "user": {...},
        "totalAmount": 2598,
        "orderStatus": "shipped",
        "createdAt": "2026-04-25T10:30:00Z"
      }
    ]
  }
}
```

---

### 2. Get All Users
**GET** `/admin/users` [Protected - Admin Only]

**Response (200):**
```json
{
  "success": true,
  "users": [
    {
      "id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "role": "user",
      "createdAt": "2026-04-20T10:30:00Z"
    }
  ]
}
```

---

### 3. Get All Orders
**GET** `/admin/orders` [Protected - Admin Only]

**Response (200):**
```json
{
  "success": true,
  "orders": [
    {
      "id": "507f1f77bcf86cd799439014",
      "user": {...},
      "items": [...],
      "totalAmount": 2598,
      "orderStatus": "pending",
      "paymentStatus": "pending",
      "createdAt": "2026-04-25T10:30:00Z"
    }
  ]
}
```

---

### 4. Get Analytics
**GET** `/admin/analytics/sales` [Protected - Admin Only]

**Response (200):**
```json
{
  "success": true,
  "analytics": {
    "monthlySales": [
      {
        "month": "2026-01",
        "total": 45000,
        "count": 50
      }
    ],
    "orderStatusCount": [
      {
        "status": "delivered",
        "count": 250
      },
      {
        "status": "pending",
        "count": 30
      }
    ],
    "topProducts": [
      {
        "productName": "Amber Table Lamp",
        "totalSold": 120,
        "totalRevenue": 155880
      }
    ]
  }
}
```

---

## ❌ Error Responses

### 400 - Bad Request
```json
{
  "success": false,
  "message": "Invalid input",
  "errors": [
    {
      "param": "email",
      "msg": "Valid email is required"
    }
  ]
}
```

### 401 - Unauthorized
```json
{
  "success": false,
  "message": "No authentication token provided"
}
```

### 403 - Forbidden
```json
{
  "success": false,
  "message": "Access denied. Admin rights required."
}
```

### 404 - Not Found
```json
{
  "success": false,
  "message": "Product not found"
}
```

### 500 - Server Error
```json
{
  "success": false,
  "message": "Internal server error",
  "error": "Error details"
}
```

---

## 🧪 Testing with cURL

### Sign Up
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Get Products
```bash
curl http://localhost:5000/api/products
```

### Create Order (with token)
```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [...],
    "totalAmount": 2598,
    "shippingAddress": {...}
  }'
```

---

## 📊 Rate Limiting

Currently no rate limiting is implemented. For production, add:
- 100 requests per minute per IP
- 1000 requests per hour per authenticated user

---

## 🔄 Status Codes Reference

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - No/invalid token |
| 403 | Forbidden - No permission |
| 404 | Not Found - Resource doesn't exist |
| 500 | Server Error - Internal error |

---

**Last Updated:** April 25, 2026
**Version:** 1.0.0
