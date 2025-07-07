# SleepLess-Stocks

SleepLess-Stocks is a full-stack web application for sharing stock opinions, tracking your favorite stocks, and managing a personal watchlist. The app features a modern UI, user authentication, threaded comments, and real-time stock data.

## Project Structure

- **FrontEnd** (Vite + React + TailwindCSS)
  - Modern, responsive UI
  - Stock search, watchlist, and profile management
  - Threaded comments and blog posts
  - API integration for real-time stock prices
- **BackEnd** (Node.js + Express + MongoDB)
  - REST API for user profiles, posts, comments, and authentication
  - MongoDB Atlas for persistent data storage
  - JWT-based authentication

## Features

### Blog
- View and read stock opinion posts.
- See real-time stock prices for each post's ticker.
- Like (favorite) posts and see your favorites at the top.
- Click "Comment" to view and join the discussion for each post.

### Comments
- Threaded (nested) comments: reply to posts or to other comments.
- Edit or delete your own comments.
- Like comments.
- Replies are visually nested for easy reading.

### Stock Search
- Search for any stock by ticker symbol.
- View real-time open and close prices.
- Save stocks from search to your watchlist (separate from favorites).

### Watchlist
- Two sections: Main Watchlist and "Saved from Search".
- Add stocks manually or from search.
- Set a price target for any stock in your watchlist.
- Remove stocks from your watchlist.
- Prevent duplicate entries with user-friendly notifications.

### Profile
- Create and edit your user profile.
- Manage your favorite stocks (separate from watchlist).
- Edit personal info and brokerage details.

### Authentication
- Sign up and log in securely.
- JWT-based authentication for all protected routes.

## Deployment
- **Frontend:** Vercel (`/SleeplessStocks/FrontEnd`)
- **Backend:** Render (`/SleeplessStocks/BackEnd`)
- **Database:** MongoDB Atlas

## How to Run Locally
1. Clone the repo and install dependencies in both `FrontEnd` and `BackEnd`.
2. Set up your `.env` file in `BackEnd` with your MongoDB URI and JWT secret.
3. Start the backend: `npm run dev` in `BackEnd`.
4. Start the frontend: `npm run dev` in `FrontEnd`.
5. Visit `http://localhost:5173` (or the port Vite shows) to use the app.

---

Enjoy sharing your stock opinions and managing your investments with SleepLess-Stocks!

[Live Demo](https://sleep-less-stocks-three.vercel.app/blog)
