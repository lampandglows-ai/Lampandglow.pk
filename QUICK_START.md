# 🚀 Quick Start - How to Run Your E-Commerce Website

## Prerequisites

- Node.js installed
- MongoDB connection string (update in backend/.env)
- All dependencies installed (run `npm install` in each folder)

---

## 🏃 Running the Application

### Step 1: Start Backend Server

Open a terminal and run:

```bash
cd backend
npm run dev
```

Expected output:
```
Backend is running on port 5000
MongoDB connected successfully
```

Backend API: `http://localhost:5000/api`

### Step 2: Start Frontend

Open a new terminal and run:

```bash
cd frontend
npm run dev
```

Frontend URL: `http://localhost:5173`

### Step 3: Start Admin Dashboard

Open another terminal and run:

```bash
cd admin
npm run dev
```

Admin URL: `http://localhost:5174`

---

## 🧪 Testing the Complete Flow

### 1. Create Admin User (One-time setup)

In MongoDB, create an admin user:

```javascript
db.users.insertOne({
  name: "Admin User",
  email: "admin@lampandglow.com",
  password: "$2a$10...", // hashed password
  role: "admin",
  createdAt: new Date()
})
```

Or use MongoDB Atlas interface to create one directly.

### 2. Admin: Upload Products

1. Go to `http://localhost:5174/admin/login`
2. Login with admin email and password
3. Go to "Products" page
4. Click "Add New Product"
5. Fill details:
   - Name: "LED Desk Lamp"
   - Price: 1299
   - Category: "Lamps"
   - Stock: 50
   - Description: "Beautiful LED desk lamp"
6. Upload an image (drag & drop)
7. Click "Create Product"

### 3. Customer: Create Account

1. Go to `http://localhost:5173`
2. Click "Sign Up"
3. Enter:
   - Name: "John Doe"
   - Email: "john@example.com"
   - Password: "password123"
4. Account created and auto-logged in

### 4. Customer: Browse & Purchase

1. Home page shows all products
2. Click any product to view details
3. Click "Add to Cart"
4. Click cart icon (top right)
5. Click "Checkout"
6. Fill shipping address:
   - Full Name: "John Doe"
   - Phone: "+91 98765 43210"
   - Address: "123 Main Street"
   - City: "New Delhi"
   - State: "Delhi"
   - Zip: "110001"
7. Click "Place Order"
8. ✅ Order placed! You get Order ID

### 5. Customer: View Orders

1. Click profile icon
2. Go to "Purchase History"
3. Click "View" on any order
4. See complete order details including:
   - Items purchased
   - Shipping address
   - Order status
   - Total amount

### 6. Admin: Track Orders

1. Go to `http://localhost:5174/admin/orders`
2. View all customer orders
3. Click "View" on any order to see details
4. Change order status:
   - Click dropdown
   - Select: Pending → Confirmed → Shipped → Delivered
5. See real-time order status updates

---

## ✅ Feature Checklist

### Admin Dashboard
- [ ] Login with admin credentials
- [ ] See dashboard statistics
- [ ] Upload product with image
- [ ] Edit product details
- [ ] Delete product
- [ ] View all orders
- [ ] Update order status
- [ ] View order details

### Frontend
- [ ] Sign up new account
- [ ] Login to existing account
- [ ] Browse all products
- [ ] View product details
- [ ] Add products to cart
- [ ] Proceed to checkout
- [ ] Enter shipping address
- [ ] Place order successfully
- [ ] View profile
- [ ] Edit profile information
- [ ] View purchase history
- [ ] View complete order details

---

## 🐛 Troubleshooting

### Backend won't start?
- Check MongoDB connection in `.env`
- Ensure MongoDB is running: `mongod`
- Try: `npm install` then `npm run dev`

### Frontend shows blank screen?
- Clear browser cache (Ctrl+Shift+Delete)
- Check browser console for errors (F12)
- Ensure backend is running on port 5000

### Can't upload products?
- Check image file is valid (PNG, JPG, GIF)
- File size should be < 10MB
- Ensure you're logged in as admin

### Orders not creating?
- Ensure cart has items
- Fill all required fields (marked with *)
- Check browser console for errors

### Image not displaying?
- Images are stored as base64, so should display automatically
- Try uploading again
- Check MongoDB for base64 data

---

## 📱 Mobile Testing

All pages are responsive! Test on mobile by:
1. Open DevTools (F12)
2. Click device toolbar icon
3. Select iPhone/Android device

---

## 🎯 What You Can Do Next

1. **Add More Products** - Upload various lamps and lighting products
2. **Test Multiple Orders** - Create several orders to see order management
3. **Customize Colors** - Change orange theme in Tailwind CSS
4. **Add Categories** - Create more product categories
5. **Test Admin Features** - Try all admin functionalities

---

## 📞 Common Questions

**Q: Where are images stored?**
A: As base64 strings in MongoDB database

**Q: How long do sessions last?**
A: 7 days (JWT expiration)

**Q: Can I use real payment?**
A: Current setup uses dummy payment. Integrate Stripe/Razorpay for real payments.

**Q: How to backup products?**
A: Use MongoDB export/backup tools

**Q: Can I customize product categories?**
A: Yes! Edit the select dropdown in ProductsPage.jsx

---

## 🎉 Success!

If everything works above, you have a **fully functional e-commerce website**! 

**Features Ready:**
- ✅ Product management
- ✅ User authentication
- ✅ Shopping cart
- ✅ Order checkout
- ✅ User profiles
- ✅ Order tracking
- ✅ Admin dashboard
- ✅ Order management

---

**Enjoy your complete e-commerce platform! 🚀**
