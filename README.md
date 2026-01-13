# Gym Management E-Commerce Platform

A full-stack e-commerce platform built with React and Node.js/Express for managing gym products and equipment. This project provides a complete solution for browsing, purchasing, and managing fitness products online with both user and admin interfaces.

## 🎯 Project Overview

This is a comprehensive e-commerce platform designed for gym and fitness equipment sales. The platform includes user authentication, product browsing, shopping cart functionality, order management, and a complete admin panel for product management.

## ✨ Features

### User Features
- **User Authentication**
  - User registration with email verification (OTP)
  - Secure login with JWT tokens
  - User profile management
  - Session management with HTTP-only cookies

- **Product Browsing**
  - Browse all available products
  - Filter products by category (Electronics, Clothing, Home & Garden, Sport, Books, etc.)
  - Search products by name with real-time filtering
  - View detailed product information with image galleries
  - Product stock availability tracking

- **Shopping Cart**
  - Add products to cart with quantity selection
  - View cart with product details and pricing
  - Update item quantities
  - Remove items from cart
  - Order confirmation with delivery information
  - Location selection (Wilaya, City, Address) for Algerian delivery

- **User Interface**
  - Modern, responsive design with Tailwind CSS
  - Beautiful gradient backgrounds and animations
  - Mobile-friendly interface
  - Intuitive navigation with breadcrumbs

### Admin Features
- **Admin Authentication**
  - Separate admin login system
  - Admin-specific JWT tokens
  - Protected admin routes

- **Product Management**
  - Add new products with images
  - Update existing products
  - Delete products
  - Manage product categories, prices, and stock
  - Image upload functionality with Multer

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern UI library
- **React Router v7** - Client-side routing
- **Tailwind CSS 3.4** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library
- **Axios** - HTTP client for API requests
- **React Icons** - Additional icon support

### Backend
- **Node.js** - Runtime environment
- **Express.js 5.1** - Web framework
- **MySQL2** - Database driver
- **Prisma** - ORM (Object-Relational Mapping)
- **JWT (jsonwebtoken)** - Authentication tokens
- **bcrypt** - Password hashing
- **cookie-parser** - Cookie management
- **CORS** - Cross-origin resource sharing
- **Multer** - File upload handling
- **Nodemailer** - Email service for OTP verification
- **dotenv** - Environment variable management

## 📦 Installation & Setup

### Prerequisites
- **Node.js** (v14 or higher recommended)
- **npm** or **yarn**
- **MySQL** database (v5.7 or higher)
- **Git**

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd Gym_Managment
```

### Step 2: Database Setup

1.  Navigate to the `server` directory.
2.  Create a `.env` file with your `DATABASE_URL`.
3.  Run the Prisma migration to set up your database schema:
    ```bash
    npx prisma db push
    ```


### Step 3: Backend Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the `server` directory:
```env
# Database Configuration
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=gym_management

# JWT Secrets
ACCESS_TOKEN_SECRET=your_jwt_secret_key_here_make_it_long_and_random
ADMIN_ACCESS_TOKEN_SECRET=your_admin_jwt_secret_key_here

# Server Configuration
PORT=3000

# Email Configuration (for OTP verification)
AUTH_MAIL=your_email@gmail.com
AUTH_PASS=your_app_specific_password
```

4. Start the development server:
```bash
npm run dev
```

The server will run on `http://localhost:3000`

### Step 4: Frontend Setup

1. Open a new terminal and navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Start the React development server:
```bash
npm start
```

The client will run on `http://localhost:3000` (or another available port if 3000 is taken)

### Step 5: Configuration

1. **CORS Configuration**: The CORS origin in `server/server.js` is set to `http://localhost:3001` by default. If your React app runs on a different port, update it accordingly.

2. **API Base URL**: The API base URL is configured in `client/src/services/api.js` as `http://localhost:3000/api`. Update if your server runs on a different port.

3. **Image Uploads**: Product images are stored in `server/uploads/products/`. Make sure this directory exists and has write permissions.

## 📚 API Documentation

### Authentication Endpoints

#### User Authentication
- `POST /api/auth/register` - Register a new user
  - Body: `{ username, email, password }`
  - Returns: User data and JWT token in HTTP-only cookie

- `POST /api/auth/login` - Login user
  - Body: `{ email, password }`
  - Returns: User data and JWT token in HTTP-only cookie

- `GET /api/auth/profile` - Get authenticated user profile (Protected)
  - Returns: User profile information

- `POST /api/auth/verify-otp` - Verify OTP for email verification
  - Body: `{ email, otp }`
  - Returns: Verification status

#### Admin Authentication
- `POST /api/admin/auth/login` - Admin login
  - Body: `{ email, password }`
  - Returns: Admin data and admin JWT token

### Product Endpoints

- `GET /api/product/showAllProducts` - Get all products (Protected)
  - Returns: Array of all products

- `POST /api/product/showProductsByCategory` - Get products by category (Protected)
  - Body: `{ category }`
  - Returns: Array of products in the specified category

- `POST /api/product/showProductDetails` - Get product details by ID (Protected)
  - Body: `{ productId }`
  - Returns: Detailed product information

- `POST /api/product/searchProductsByName` - Search products by name
  - Body: `{ productName }`
  - Returns: Array of matching products

### Cart Endpoints (All Protected)

- `POST /api/cart/addToCart` - Add item to cart
  - Body: `{ user_id, product_id, quantity }`
  - Returns: Cart item ID

- `GET /api/cart/viewCart` - View user's cart
  - Returns: Array of cart items with product details

- `PUT /api/cart/updateCartItem` - Update cart item quantity
  - Body: `{ cartItemId, newQuantity }`
  - Returns: Success message

- `DELETE /api/cart/removeFromCart` - Remove item from cart
  - Body: `{ cartItemId }`
  - Returns: Success message

- `POST /api/cart/confirmOrder` - Confirm and place order
  - Body: `{ cartItemId, userLocation, userMobile }`
  - Returns: Order confirmation

- `DELETE /api/cart/clearCart` - Clear entire cart (Protected)
  - Body: `{ userId }`
  - Returns: Success message

### Admin Product Management Endpoints (All Protected)

- `POST /api/admin/product/addProduct` - Add new product
  - Body: FormData with `name`, `category`, `description`, `current_price`, `old_price`, `stock`, `image` (file)
  - Returns: Created product data

- `PUT /api/admin/product/updateProduct` - Update existing product
  - Body: FormData with product fields and optional `image` (file)
  - Returns: Updated product data

- `DELETE /api/admin/product/deleteProduct` - Delete product
  - Body: `{ productId }`
  - Returns: Success message

## 📁 Project Structure

```
Gym_Managment/
├── client/                      # Frontend React application
│   ├── public/                  # Static files
│   │   ├── index.html
│   │   └── ...
│   ├── src/
│   │   ├── components/          # Reusable React components
│   │   │   ├── Categories/
│   │   │   ├── Footer/
│   │   │   ├── Hero/
│   │   │   └── Navbar/
│   │   ├── pages/               # Page components
│   │   │   ├── AdminAuthentication/
│   │   │   ├── AdminProductManagement/
│   │   │   ├── Authentication/
│   │   │   ├── Cart/
│   │   │   ├── Dashboard/
│   │   │   ├── OTPVerfivcation/
│   │   │   ├── SearchPageCat/
│   │   │   └── SeachPageId/
│   │   ├── services/            # API service configuration
│   │   │   └── api.js
│   │   ├── App.js               # Main app component with routing
│   │   ├── index.js             # React entry point
│   │   └── index.css            # Global styles
│   ├── tailwind.config.js       # Tailwind CSS configuration
│   ├── postcss.config.js        # PostCSS configuration
│   └── package.json
│
├── server/                       # Backend Express server
│   ├── controllers/              # Request handlers
│   │   ├── adminControllers/
│   │   │   ├── adminAuthController.js
│   │   │   └── adminProductController.js
│   │   ├── authController.js
│   │   ├── cartController.js
│   │   └── productController.js
│   ├── routes/                   # API route definitions
│   │   ├── adminRoutes/
│   │   │   ├── adminAuth.js
│   │   │   └── adminProduct.js
│   │   ├── auth.js
│   │   ├── cart.js
│   │   └── product.js
│   ├── middleware/               # Custom middleware
│   │   ├── AuthenticationToken.js
│   │   └── adminAuthenticateToken.js
│   ├── services/                # Utility services
│   │   └── db.js                 # Database connection
│   ├── uploads/                  # Uploaded files
│   │   └── products/             # Product images
│   ├── server.js                 # Express app entry point
│   └── package.json
│
└── README.md                     # This file
```

## 🔒 Authentication & Security

### User Authentication
- JWT tokens stored in HTTP-only cookies for enhanced security
- Password hashing using bcrypt
- Email verification with OTP system
- Protected routes require valid JWT tokens

### Admin Authentication
- Separate admin authentication system
- Admin-specific JWT tokens
- Protected admin routes with middleware

### Security Features
- CORS enabled for specific origins
- SQL injection prevention with parameterized queries
- Password hashing with bcrypt
- HTTP-only cookies prevent XSS attacks
- Input validation on all endpoints

## 🗄️ Database Schema

### Users Table
- `id` (INT, PRIMARY KEY, AUTO_INCREMENT)
- `username` (VARCHAR(255), UNIQUE, NOT NULL)
- `email` (VARCHAR(255), UNIQUE, NOT NULL)
- `password` (VARCHAR(255), NOT NULL) - Hashed with bcrypt
- `created_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)

### Products Table
- `id` (INT, PRIMARY KEY, AUTO_INCREMENT)
- `name` (VARCHAR(255), NOT NULL)
- `category` (VARCHAR(255), NOT NULL)
- `description` (TEXT)
- `current_price` (DECIMAL(10, 2), NOT NULL)
- `old_price` (DECIMAL(10, 2)) - For discount display
- `image_path` (VARCHAR(255)) - Main product image
- `images` (TEXT) - JSON array of additional images
- `stock` (INT, DEFAULT 0)
- `created_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)

### Cart Table
- `id` (INT, PRIMARY KEY, AUTO_INCREMENT)
- `user_id` (INT, FOREIGN KEY → users.id)
- `product_id` (INT, FOREIGN KEY → products.id)
- `quantity` (INT, NOT NULL, DEFAULT 1)
- `created_at` (DATE)

### Orders Table
- `id` (INT, PRIMARY KEY, AUTO_INCREMENT)
- `user_id` (INT, FOREIGN KEY → users.id)
- `product_id` (INT, FOREIGN KEY → products.id)
- `quantity` (INT, NOT NULL)
- `total_price` (DECIMAL(10, 2), NOT NULL)
- `user_location` (TEXT, NOT NULL) - Format: "Wilaya, City, Address"
- `user_mobile` (VARCHAR(20), NOT NULL)
- `status` (VARCHAR(50), DEFAULT 'pending')
- `created_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)

### Admins Table
- `id` (INT, PRIMARY KEY, AUTO_INCREMENT)
- `username` (VARCHAR(255), UNIQUE, NOT NULL)
- `email` (VARCHAR(255), UNIQUE, NOT NULL)
- `password` (VARCHAR(255), NOT NULL) - Hashed with bcrypt
- `created_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)

## 🎨 UI/UX Features

- **Modern Design**: Beautiful gradient backgrounds and smooth animations
- **Responsive Layout**: Works seamlessly on desktop, tablet, and mobile devices
- **Dark Theme**: Eye-friendly dark color scheme
- **Interactive Elements**: Hover effects, transitions, and visual feedback
- **Image Galleries**: Multiple product images with thumbnail navigation
- **Form Validation**: Real-time validation with user-friendly error messages
- **Loading States**: Visual feedback during API calls
- **Empty States**: Helpful messages when cart is empty or no products found

## 🚀 Available Scripts

### Frontend (client/)
- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App (irreversible)

### Backend (server/)
- `npm run dev` - Start development server with nodemon (auto-restart)
- `npm run Start` - Start production server

## 📝 Environment Variables

### Required Backend Environment Variables

Create a `.env` file in the `server/` directory:

```env
# Database
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=gym_management

# JWT Secrets (use long, random strings)
ACCESS_TOKEN_SECRET=your_super_secret_jwt_key_here
ADMIN_ACCESS_TOKEN_SECRET=your_super_secret_admin_jwt_key_here

# Server
PORT=3000

# Email (for OTP verification)
AUTH_MAIL=your_email@gmail.com
AUTH_PASS=your_app_specific_password
```

## 🔧 Configuration

### CORS Setup
The server is configured to accept requests from `http://localhost:3001` by default. To change this, update the `origin` in `server/server.js`:

```javascript
app.use(cors({
    origin: 'http://localhost:YOUR_PORT',
    credentials: true
}));
```

### API Base URL
The frontend API base URL is set in `client/src/services/api.js`. Update if your server runs on a different port or domain.

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Verify MySQL is running
   - Check database credentials in `.env`
   - Ensure database exists

2. **CORS Errors**
   - Verify CORS origin matches your frontend URL
   - Check that `credentials: true` is set

3. **Authentication Issues**
   - Clear browser cookies
   - Verify JWT secrets are set in `.env`
   - Check token expiration

4. **Image Upload Fails**
   - Ensure `server/uploads/products/` directory exists
   - Check file permissions
   - Verify Multer configuration

5. **Port Already in Use**
   - Change PORT in `.env` (backend)
   - React will automatically use next available port

## 🚧 Future Enhancements

### Planned Features
- [ ] Payment gateway integration
- [ ] Order tracking system
- [ ] Product reviews and ratings
- [ ] Wishlist functionality
- [ ] Email notifications for orders
- [ ] Advanced product filtering and sorting
- [ ] Pagination for product listings
- [ ] User profile editing
- [ ] Order history for users
- [ ] Admin order management dashboard
- [ ] Product variants (size, color, etc.)
- [ ] Discount codes and coupons
- [ ] Multi-language support
- [ ] Analytics dashboard

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Style
- Follow existing code formatting
- Use meaningful variable and function names
- Add comments for complex logic
- Test your changes before submitting

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👥 Authors

- YahiaBenlaoukli - Initial work

## 🙏 Acknowledgments

- React team for the amazing framework
- Express.js for the robust backend framework
- Tailwind CSS for the utility-first CSS framework
- All contributors and users of this project

---

**Note**: This is an active development project. Features and APIs may change. Always check the latest documentation before deploying to production.
