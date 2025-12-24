# Gym Management Client

The frontend application for the Gym Management E-Commerce Platform, built with React and Tailwind CSS.

## 🛠️ Tech Stack

- **React 19** - UI Library
- **React Router v7** - Routing
- **Tailwind CSS** - Styling
- **Axios** - API Integration
- **React Icons** & **Lucide React** - Icons
- **Recharts** - Data Visualization

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- NPM

### Installation

1.  Navigate to the client directory:
    ```bash
    cd client
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Configure Environment:
    Ensure your API endpoints in `src/services/api.js` (or similar) point to your running backend server (default: `http://localhost:3000`).

### Running the Application

- **Development Mode**:
  ```bash
  npm start
  ```
  Runs on [http://localhost:3001](http://localhost:3001) (if port 3000 is taken by server).

- **Build for Production**:
  ```bash
  npm run build
  ```

## 📂 Project Structure

```
client/
├── public/          # Static assets
├── src/
│   ├── components/  # Reusable UI components
│   ├── pages/       # Route pages
│   ├── services/    # API calls
│   └── App.js       # Main application component
```
