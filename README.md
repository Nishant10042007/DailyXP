# ⚡ DailyXP — Gamified Habit Tracker

A full-stack habit tracking app with XP points, levels, streaks, badges, heatmaps, and charts.

---

## 🗂 Folder Structure

```
dailyxp/
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── habitController.js
│   │   ├── logController.js
│   │   └── statsController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Habit.js
│   │   └── HabitLog.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── habits.js
│   │   ├── logs.js
│   │   └── stats.js
│   ├── utils/
│   │   ├── gamification.js   ← Points, levels, badge logic
│   │   └── streaks.js        ← Streak calculation logic
│   ├── server.js
│   ├── .env.example
│   └── package.json
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── Layout.js           ← Sidebar + nav
    │   │   ├── StatCard.js         ← Reusable stat tile
    │   │   └── BadgeNotification.js← Popup when badge earned
    │   ├── context/
    │   │   └── AuthContext.js      ← Global auth state
    │   ├── pages/
    │   │   ├── Login.js
    │   │   ├── Signup.js
    │   │   ├── Dashboard.js        ← Stats, XP bar, badges
    │   │   ├── Habits.js           ← Create, check off, delete
    │   │   └── Analytics.js        ← Heatmap + charts
    │   ├── utils/
    │   │   └── api.js              ← Axios instance + interceptors
    │   ├── App.js
    │   ├── index.js
    │   └── index.css
    ├── tailwind.config.js
    └── package.json
```

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js 18+
- MongoDB (local or [MongoDB Atlas](https://cloud.mongodb.com))

---

### 1. Clone / Download
```bash
cd dailyxp
```

### 2. Backend Setup

```bash
cd backend
npm install

# Copy env file and fill in values
cp .env.example .env
```

Edit `.env`:
```
MONGO_URI=mongodb://localhost:27017/dailyxp
JWT_SECRET=change_this_to_a_long_random_secret
PORT=5000
CLIENT_URL=http://localhost:3000
```

Start backend:
```bash
npm run dev
```

Server starts at `http://localhost:5000`

---

### 3. Frontend Setup

```bash
cd ../frontend
npm install
npm start
```

App opens at `http://localhost:3000`

> The `"proxy": "http://localhost:5000"` in `package.json` routes all `/api` calls to the backend automatically.

---

## 🔌 API Reference

### Auth
| Method | Route | Body | Description |
|--------|-------|------|-------------|
| POST | `/api/auth/register` | `{ name, email, password }` | Create account |
| POST | `/api/auth/login` | `{ email, password }` | Login |
| GET | `/api/auth/me` | — | Get current user |

### Habits
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/habits` | Get all habits |
| POST | `/api/habits` | `{ title }` Create habit |
| DELETE | `/api/habits/:id` | Delete habit + logs |

### Logs
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/logs` | `{ habitId, date }` Mark complete |
| GET | `/api/logs/:habitId` | Get all logs for a habit |

### Stats
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/stats/dashboard` | Full dashboard stats |
| GET | `/api/stats/heatmap` | Last 365 days completion counts |

---

## 🎮 Sample API Responses

### POST /api/logs (mark complete)
```json
{
  "message": "Habit marked complete",
  "currentStreak": 7,
  "longestStreak": 14,
  "pointsEarned": 15,
  "totalPoints": 150,
  "level": 2,
  "newBadges": [
    { "id": "consistency_rookie", "label": "Consistency Rookie", "emoji": "⚡", "requiredStreak": 7 }
  ]
}
```

### GET /api/stats/dashboard
```json
{
  "totalHabits": 5,
  "completionToday": 60,
  "currentStreak": 7,
  "longestStreak": 14,
  "points": 150,
  "level": 2,
  "pointsToNextLevel": 50,
  "badges": [
    { "id": "starter_flame", "label": "Starter Flame", "emoji": "🔥", "requiredStreak": 3 }
  ],
  "totalCompletions": 47
}
```

---

## 🧠 Key Logic Explained

### Streak Calculation (`backend/utils/streaks.js`)
1. Collect all completion dates for a habit, normalize to `YYYY-MM-DD`
2. Sort and deduplicate
3. Walk backwards from today — if each consecutive day exists, increment streak
4. If last log was not today or yesterday → streak = 0 (broken)

### Points & Level
- **+10 XP** per habit completion
- **+5 bonus XP** at every 7-day streak milestone (7, 14, 21…)
- **Level = floor(totalPoints / 100)**, minimum level 1

### Badge System (`backend/utils/gamification.js`)
- 7 badges tied to streak milestones (3, 7, 14, 21, 30, 60, 100 days)
- Checked on every completion, only awarded once per user
- Stored as string IDs in `user.badges[]`
- Frontend shows popup notification via `BadgeNotification` component

---

## 🎨 Tech & Design
- **Dark theme** with purple accent (`#7c5cfc`)
- **Fonts**: Syne (display) + DM Sans (body) + JetBrains Mono (numbers)
- **Animations**: fade-in, slide-up, pop (badge unlock)
- Fully **responsive** — sidebar on desktop, hamburger on mobile
