# Gym Management Server

The backend API for the Gym Management E-Commerce Platform, built with Node.js, Express, and Prisma.

## 🛠️ Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MySQL** - Database
- **Prisma** - ORM (Object-Relational Mapping)
- **JWT** - Authentication (Access & Refresh tokens)
- **Bcrypt** - Password hashing
- **Nodemailer** - Email services
- **Multer** - File uploads

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- MySQL Server

### Installation

1.  Navigate to the server directory:
    ```bash
    cd server
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Set up Environment Variables:
    Create a `.env` file in the `server` directory with the following variables:

    ```env
    # Database Connection
    DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE_NAME"

    # JWT Secrets
    ACCESS_TOKEN_SECRET=your_jwt_secret
    ADMIN_ACCESS_TOKEN_SECRET=your_admin_jwt_secret

    # Server Port
    PORT=3000

    # Frontend URL (CORS)
    FRONTEND_URL=http://localhost:3001

    # Email Configuration
    AUTH_MAIL=your_email@gmail.com
    AUTH_PASS=your_app_password
    ```

4.  Database Setup (Prisma):
    ```bash
    # Generate Prisma Client
    npx prisma generate
    
    # Push schema to database (dev)
    npx prisma db push
    ```

### Running the Server

- **Development Mode** (with nodemon):
  ```bash
  npm run dev
  ```

- **Production Mode**:
  ```bash
  npm run Start
  ```

## 📂 Project Structure

```
server/
├── controllers/      # Route logic
├── middleware/       # Auth and file upload middleware
├── prisma/          # Database schema
├── routes/          # API route definitions
├── services/        # Business logic services
├── uploads/         # Static file inclusions
└── server.js        # Entry point
```

## 📚 API Endpoints

### Auth
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `POST /api/auth/verify-otp` - Verify email

### Products
- `GET /api/product/showAllProducts`
- `POST /api/product/showProductsByCategory`
- `POST /api/product/showProductDetails`
- `POST /api/product/searchProductsByName`

### Cart
- `GET /api/cart/viewCart`
- `POST /api/cart/addToCart`
- `DELETE /api/cart/removeFromCart`
- `POST /api/cart/confirmOrder`

### Admin
- `POST /api/admin/auth/login`
- `POST /api/admin/product/addProduct`
- `PUT /api/admin/product/updateProduct`
- `DELETE /api/admin/product/deleteProduct`
