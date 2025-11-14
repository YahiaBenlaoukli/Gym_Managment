# E-Commerce Website

A full-stack e-commerce platform built with React (frontend) and Node.js/Express (backend) with MySQL database. This project provides a complete solution for managing and browsing products online.

## 🎯 Project Goal

The goal of this project is to create a fully functional e-commerce website that allows users to:
- Register and authenticate securely
- Browse products by category
- Search for products by name
- View detailed product information
- Manage products (admin functionality)

## 🚀 Main Functionality

### User Authentication
- **User Registration**: New users can create an account with username, email, and password
- **User Login**: Secure authentication with JWT tokens
- **User Profile**: View authenticated user profile information

### Product Management
- **View All Products**: Display all available products in the system
- **Browse by Category**: Filter products by category (Electronics, Clothing, Home & Garden, Sport, Books, etc.)
- **Product Details**: View detailed information about a specific product
- **Search Products**: Search for products by name with real-time filtering
- **Category-based Search**: Search for products within a specific category

### Dashboard Interface
- Interactive dashboard with intuitive UI for product browsing
- Category selection dropdown
- Product search functionality
- Responsive design for mobile and desktop

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client for API requests
- **CSS Modules** - Scoped styling

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MySQL** - Database
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing
- **cookie-parser** - Cookie management
- **CORS** - Cross-origin resource sharing

## 📦 Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MySQL database
- Git

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd Gym_Managment
```

### Step 2: Database Setup
1. Create a MySQL database for the project
2. Create the required tables:
   - `users` table with fields: `id`, `username`, `email`, `password`
   - `products` table with fields: `id`, `name`, `category`, `price`, `description`, `image_path`

### Step 3: Backend Setup
1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the `server` directory with the following variables:
   ```env
   DB_HOST=localhost
   DB_USER=your_mysql_username
   DB_PASSWORD=your_mysql_password
   DB_NAME=your_database_name
   ACCESS_TOKEN_SECRET=your_jwt_secret_key_here
   PORT=3000
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
   The client will run on `http://localhost:3001` (or another available port)

### Step 5: Configuration
1. **CORS Configuration**: Make sure the CORS origin in `server/server.js` matches your React app's URL (default: `http://localhost:3001`)

2. **API Base URL**: The API base URL is configured in `client/src/services/api.js` as `http://localhost:3000/api`

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)

### Products
- `GET /api/product/showAllProducts` - Get all products (protected)
- `POST /api/product/showProductsByCategory` - Get products by category (protected)
- `POST /api/product/showProductDetails` - Get product details by ID (protected)
- `POST /api/product/searchProductsByName` - Search products by name

### Admin (Future)
- Admin product management routes available at `/api/admin/product`

## 📁 Project Structure

```
Gym_Managment/
├── server/                 # Backend server
│   ├── controllers/        # Request handlers
│   │   ├── authController.js
│   │   └── productController.js
│   ├── routes/            # API routes
│   │   ├── auth.js
│   │   └── product.js
│   ├── middleware/        # Authentication middleware
│   ├── services/          # Database connection
│   └── server.js          # Express app entry point
│
└── client/                # Frontend React app
    ├── src/
    │   ├── components/    # React components
    │   │   ├── Authentication/
    │   │   ├── Dashboard/
    │   │   └── Navbar/
    │   ├── services/      # API service
    │   └── App.js         # Main app component
    └── public/            # Static files
```

## 🔒 Authentication

The application uses JWT (JSON Web Tokens) for authentication. Tokens are stored in HTTP-only cookies for security. All product endpoints (except search) require authentication.

## 🗄️ Database Schema

### Users Table
- `id` (INT, PRIMARY KEY, AUTO_INCREMENT)
- `username` (VARCHAR, UNIQUE)
- `email` (VARCHAR, UNIQUE)
- `password` (VARCHAR, hashed with bcrypt)

### Products Table
- `id` (INT, PRIMARY KEY, AUTO_INCREMENT)
- `name` (VARCHAR)
- `category` (VARCHAR)
- `price` (DECIMAL)
- `description` (TEXT)
- `image_path` (VARCHAR)

## 🚧 Known Issues & Future Improvements

### Current Issues
- Token authentication needs to be consistent between cookie and header-based auth
- CORS origin may need adjustment based on your setup
- Database schema should be documented with SQL migration files

### Planned Features
- Shopping cart functionality
- Checkout and payment integration
- Order management
- Product reviews and ratings
- User profile management
- Admin dashboard for product management
- Image upload functionality
- Product filtering and sorting
- Pagination for product listings

## 📝 Notes

- The server runs on port 3000 by default
- The client runs on port 3001 by default (React default is 3000, but this project uses 3001)
- Make sure MySQL is running before starting the server
- All API requests from the client include credentials (cookies) automatically
- The project uses CSS Modules for component styling to avoid style conflicts

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.
