# 🌴 Cey-Vacay — Your Trusted Vacation Consultant

A full-stack travel experience listing platform where users can discover
and share unique travel experiences across Sri Lanka and beyond.

🔗 **Live Demo:** https://cey-vacay.vercel.app
---

## 🛠 Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | Next.js 14, Tailwind CSS          |
| Backend    | Node.js, Express.js               |
| Database   | MongoDB Atlas (Mongoose ODM)      |
| Auth       | JWT (JSON Web Tokens) + bcryptjs  |
| Deployment | Vercel (frontend), Render (backend)|

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Git

### 1. Clone the repository
```bash
git clone https://github.com/ProVerted/cey-vacay.git
cd cey-vacay
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder:
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
```

Start the backend:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```

Create a `.env.local` file in the `frontend/` folder:
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Start the frontend:
```bash
npm run dev
```

Visit `http://localhost:3000`

---

## ✅ Features Implemented

### Core Features
- 🔐 User registration and login with JWT authentication
- 📝 Create travel experience listings
- 🌍 Public feed showing all listings (newest first)
- 🔍 Search listings by title or location
- 📄 Listing detail page with full information

### Optional Features
- ✏️ Edit listing (creator only)
- 🗑️ Delete listing (creator only)
- ❤️ Like a listing
- 📱 Responsive mobile UI
- 🔎 Search and filter listings

---

## 🏗 Architecture & Key Decisions

### Why this tech stack?
- **Next.js** was chosen for its file-based routing, fast performance,
  and seamless React integration — ideal for a feed-based UI.
- **Express + Node.js** provides a lightweight, flexible REST API that
  pairs naturally with a JavaScript frontend.
- **MongoDB** suits this project well because travel listings are
  document-shaped data with optional fields (e.g. price), and MongoDB's
  flexible schema handles this without friction.

### How authentication works
1. User registers → password is hashed with **bcryptjs** and saved
2. User logs in → server verifies password, returns a signed **JWT token**
3. Token is stored in **localStorage** on the frontend
4. Every protected request sends the token in the `Authorization` header
5. The `authMiddleware` on the backend verifies the token before
   allowing access to protected routes

### How listings are stored
Each listing document in MongoDB stores:
- Title, location, image URL, description, price
- A `creator` field referencing the User's `_id` (populated on fetch)
- `likes` count
- Auto-generated `createdAt` / `updatedAt` timestamps

### One improvement with more time
I would implement **image upload** using Cloudinary instead of requiring
users to paste an image URL. This would make the listing creation flow
much more user-friendly and ensure consistent image quality across all
listings.

---

## 💡 Product Thinking — Scaling to 10,000 Listings

If this platform had 10,000 travel listings, several changes would be
needed to maintain performance and a great user experience.

First, **pagination or infinite scroll** would be essential — loading all
10,000 listings at once would be extremely slow. I would implement
cursor-based pagination on the backend and infinite scroll on the
frontend using an Intersection Observer.

Second, **database indexing** on fields like `location`, `createdAt`, and
`title` would dramatically speed up search and sort queries in MongoDB.

Third, a **caching layer using Redis** would reduce repeated database hits
for the public feed — since the feed is read far more often than it is
written to, caching the top listings for 60 seconds would significantly
reduce server load.

Fourth, the **search feature** would need to be upgraded from basic regex
to a proper full-text search solution like **MongoDB Atlas Search** or
**Elasticsearch**, enabling faster and more relevant results.

Finally, **image optimization via a CDN** (like Cloudinary) would ensure
listing images load quickly regardless of the user's location, and
**API rate limiting** would protect the server from abuse at scale.