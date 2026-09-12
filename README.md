# 🕉️ Marwadi Seervi Samaj — Community Portal

> A full-stack community platform connecting the Marwadi Seervi Samaj — matrimony, career mentorship, temple directory, women's empowerment, and community discussions, all in one place.

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38B2AC?logo=tailwind-css)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb)
![License](https://img.shields.io/badge/license-MIT-blue)

---

## ✨ Features

- 🔐 **Authentication** — JWT-based signup/login, forgot-password with OTP verification
- 💍 **Matrimony** — Browse, search, and create matrimony profiles
- 💼 **Career Help** — Job board, mentor directory, post-a-job flow
- 🛕 **Temple Directory** — Search temples by city/type, admin-managed listings, event calendar
- 💬 **Community Forum** — Ask questions, reply, like, and discuss
- 👩 **Women Empowerment** — Q&A feed, published articles, achievements carousel
- 🌐 **Bilingual** — Full English/Hindi language toggle
- 📱 **Responsive** — Works across desktop, tablet, and mobile

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router), React 18, Tailwind CSS |
| Backend | Node.js, Express |
| Database | MongoDB + Mongoose |
| Auth | JWT, bcrypt |
| i18n | react-i18next |

---

## 📁 Project Structure

```
marwadi-seervi-samaj/
├── web/              # Next.js frontend → deployed on Vercel
│   ├── app/          # App Router pages & layouts
│   ├── components/   # Shared UI components
│   ├── lib/          # Auth context, toast system, i18n config
│   └── locales/      # English & Hindi translations
│
└── server/           # Express backend → deployed on Render
    ├── models/       # Mongoose schemas
    ├── routes/       # API endpoints
    └── middleware/   # Auth middleware
```

---

## 🚀 Getting Started

### Backend
```bash
cd server
npm install
cp env.example .env      # add your JWT_SECRET, MONGODB_URI, CORS_ORIGIN
npm run dev              # runs on http://localhost:5000
```

### Frontend
```bash
cd web
npm install
cp .env.local.example .env.local   # set NEXT_PUBLIC_API_URL
npm run dev                        # runs on http://localhost:3000
```

---

## 🌍 Deployment

| Service | Platform |
|---|---|
| Frontend (`web/`) | [Vercel](https://vercel.com) — Root Directory: `web` |
| Backend (`server/`) | [Render](https://render.com) — Root Directory: `server` |
| Database | MongoDB Atlas |

---

## 📄 License

This project is licensed under the MIT License.

---

<p align="center">Built with ❤️ for the Marwadi Seervi Samaj community</p>
