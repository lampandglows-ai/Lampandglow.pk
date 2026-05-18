# API Documentation - Lamp and Glow E-Commerce

## Base URL

```
http://localhost:5000/api
```

---

## Authentication Endpoints

### 1. Sign Up
- **URL:** `POST /auth/signup`
- **Auth:** Not required
- **Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "token": "jwt_token_here",
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    }
  }
  ```

### 2. Sign In
- **URL:** `POST /auth/signin`
- **Auth:** Not required
- **Body:**
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response:** Same as Sign Up

### 3. Get Current User
- **URL:** `GET /auth/me`
- **Auth:** Required (Bearer token)
- **Response:**
  ```json
  {
    "success": true,
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+91 98765 43210",
      "address": "123 Main Street",
      "city": "New Delhi",
      "state": "Delhi",
      "zipCode": "110001",
      "role": "user"
    }
  }
  ```

### 4. Update Profile
- **URL:** `PUT /auth/profile`
- **Auth:** Required
- **Body:**
  ```json
  {
    "name": "John Doe",
    "phone": "+91 98765 43210",
    "address": "123 Main Street",
    "city": "New Delhi",
    "state": "Delhi",
    "zipCode": "110001"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Profile updated successfully",
    "user": { ...updated user object }
  }
  ```

---

## Product Endpoints

### 1. Get All Products
- **URL:** `GET /products`
- **Auth:** Not required
- **Query Params:** None
- **Response:**
  ```json
  {
    "success": true,
    "products": [
      {
        "_id": "product_id",
        "name": "LED Desk Lamp",
        "description": "Beautiful LED desk lamp",
        "price": 1299,
        "category": "Lamps",
        "image": "base64_string",
        "stock": 50,
        "rating": 4.5,
        "createdAt": "2024-05-12T10:30:00Z"
      }
    ]
  }
  ```

### 2. Get Single Product
- **URL:** `GET /products/:id`
- **Auth:** Not required
- **Params:** `id` - Product ID
- **Response:**
  ```json
  {
    "success": true,
    "product": { ...product object }
  }
  ```

### 3. Create Product (Admin only)
- **URL:** `POST /products`
- **Auth:** Required (Admin)
- **Body:**
  ```json
  {
    "name": "LED Desk Lamp",
    "description": "Beautiful LED desk lamp",
    "price": 1299,
    "category": "Lamps",
    "image": "base64_string_or_url",
    "stock": 50
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Product created successfully",
    "product": { ...created product }
  }
  ```

### 4. Update Product (Admin only)
- **URL:** `PUT /products/:id`
- **Auth:** Required (Admin)
- **Params:** `id` - Product ID
- **Body:** Same as Create Product (partial update allowed)
- **Response:**
  ```json
  {
    "success": true,
    "message": "Product updated successfully",
    "product": { ...updated product }
  }
  ```

### 5. Delete Product (Admin only)
- **URL:** `DELETE /products/:id`
- **Auth:** Required (Admin)
- **Params:** `id` - Product ID
- **Response:**
  ```json
  {
    "success": true,
    "message": "Product deleted successfully"
  }
  ```

### 6. Get Featured Products
- **URL:** `GET /products/featured`
- **Auth:** Not required
- **Response:** Same as Get All Products

---

## Order Endpoints

### 1. Create Order
- **URL:** `POST /orders`
- **Auth:** Required
- **Body:**
  ```json
  {
    "items": [
      {
        "product": "product_id",
        "name": "LED Desk Lamp",
        "price": 1299,
        "quantity": 1,
        "image": "image_url_or_base64"
      }
    ],
    "shippingAddress": {
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+91 98765 43210",
      "address": "123 Main Street",
      "city": "New Delhi",
      "state": "Delhi",
      "zipCode": "110001"
    },
    "totalAmount": 1349,
    "paymentMethod": "credit_card"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Order created successfully",
    "order": {
      "_id": "order_id",
      "user": "user_id",
      "items": [...],
      "totalAmount": 1349,
      "orderStatus": "pending",
      "paymentStatus": "pending",
      "createdAt": "2024-05-12T10:30:00Z"
    }
  }
  ```

### 2. Get User Orders
- **URL:** `GET /orders`
- **Auth:** Required
- **Response:**
  ```json
  {
    "success": true,
    "orders": [ ...array of orders ]
  }
  ```

### 3. Get Order Details
- **URL:** `GET /orders/:id`
- **Auth:** Required
- **Params:** `id` - Order ID
- **Response:**
  ```json
  {
    "success": true,
    "order": { ...order details }
  }
  ```

### 4. Update Order Status (Admin only)
- **URL:** `PUT /orders/:id/status`
- **Auth:** Required (Admin)
- **Params:** `id` - Order ID
- **Body:**
  ```json
  {
    "orderStatus": "confirmed",
    "paymentStatus": "completed"
  }
  ```
- **Valid Order Status:**
  - pending
  - confirmed
  - shipped
  - delivered
  - cancelled

- **Response:**
  ```json
  {
    "success": true,
    "message": "Order status updated successfully",
    "order": { ...updated order }
  }
  ```

### 5. Cancel Order
- **URL:** `PUT /orders/:id/cancel`
- **Auth:** Required
- **Params:** `id` - Order ID
- **Response:**
  ```json
  {
    "success": true,
    "message": "Order cancelled successfully",
    "order": { ...cancelled order }
  }
  ```

---

## Admin Endpoints

### 1. Get Dashboard Stats (Admin only)
- **URL:** `GET /admin/stats`
- **Auth:** Required (Admin)
- **Response:**
  ```json
  {
    "success": true,
    "stats": {
      "totalUsers": 150,
      "totalProducts": 45,
      "totalOrders": 320,
      "totalRevenue": 500000,
      "recentOrders": [ ...last 10 orders ]
    }
  }
  ```

### 2. Get All Users (Admin only)
- **URL:** `GET /admin/users`
- **Auth:** Required (Admin)
- **Response:**
  ```json
  {
    "success": true,
    "users": [ ...array of all users ]
  }
  ```

### 3. Get All Orders (Admin only)
- **URL:** `GET /admin/orders`
- **Auth:** Required (Admin)
- **Response:**
  ```json
  {
    "success": true,
    "orders": [ ...array of all orders ]
  }
  ```

### 4. Get Sales Analytics (Admin only)
- **URL:** `GET /admin/analytics/sales`
- **Auth:** Required (Admin)
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "monthlySales": [
        {
          "_id": "2024-05",
          "total": 50000,
          "count": 25
        }
      ],
      "orderStatusCount": [
        {
          "_id": "delivered",
          "count": 200
        }
      ]
    }
  }
  ```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Error description",
  "errors": [ ...validation errors ]
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "No authentication token provided"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Access denied. Admin rights required."
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error",
  "error": "error_details"
}
```

---

## Headers

### Required for authenticated requests:
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

### For file upload (if using multipart):
```
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data
```

---

## Example: Complete User Journey

### 1. User Signs Up
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### 2. User Gets Products
```bash
curl -X GET http://localhost:5000/api/products \
  -H "Authorization: Bearer <token>"
```

### 3. User Creates Order
```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [...],
    "shippingAddress": {...},
    "totalAmount": 1349,
    "paymentMethod": "credit_card"
  }'
```

### 4. User Gets Orders
```bash
curl -X GET http://localhost:5000/api/orders \
  -H "Authorization: Bearer <token>"
```

---

## Rate Limiting

Currently, no rate limiting is implemented. Consider adding:
- 100 requests per minute for public endpoints
- 1000 requests per minute for authenticated endpoints
- 10000 requests per minute for admin endpoints

---

## Pagination

To add pagination support, consider adding query parameters:
```
GET /products?page=1&limit=10&sort=-createdAt
```

---

## Sorting

Products can be sorted by:
- createdAt (default)
- price
- rating
- stock
- name

---

**For more information, visit the main documentation or check the server console for detailed logs.**
