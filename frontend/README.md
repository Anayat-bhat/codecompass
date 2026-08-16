# CodeCompass Frontend 💻

> React + Vite + Tailwind CSS User Interface for CodeCompass

This folder contains the Single Page Application (SPA) frontend for CodeCompass.

---

## 🛠 Tech Stack

- **Framework:** React 18 (via Vite)
- **Styling:** Tailwind CSS (Vanilla CSS utilities)
- **HTTP Client:** Fetch API with CORS integration
- **Deployment:** Vercel (via `vercel.json`)

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
The application will launch on `http://localhost:5173`.

### 3. Build for Production
```bash
npm run build
```
Builds static assets into the `dist/` directory ready for deployment.

---

## 🌐 Production Deployment (Vercel)

The frontend is configured with `vercel.json` for single-page routing:
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

To deploy:
1. Connect your repository to [Vercel](https://vercel.com).
2. Set the **Root Directory** to `frontend`.
3. Click **Deploy**.
