# Gestion des clients

Application full‑stack (React + Flask) permettant de gérer une liste de clients avec authentification JWT.  
Elle sert d’exemple pédagogique : **CRUD**, pagination, recherche, dark‑mode, toasts de feedback et déploiement GitHub.

---

## ✨ Fonctionnalités

| Front‑end (React 18 / Vite) | Back‑end (Flask 2) | UX/UI |
|-----------------------------|--------------------|-------|
| 🔐 Login JWT -> stockage `localStorage` | 🔒 Auth protégée via `flask‑jwt‑extended` | ⚡ Toasts (`react‑hot‑toast`) |
| CRUD clients (add / edit / delete) | Endpoints REST (`/clients`) | 🌓 Dark / light toggle |
| Pagination + filtre nom | SQLite (SQLAlchemy) | Responsive Tailwind |
| Intercepteur Axios 401 → relogin | CORS activé | Logo perso dans le header |

---

## 🛠 Stack

* **Front** – React 18, Vite 7, Axios, Headless‑UI, TailwindCSS 3  
* **Back** – Python 3.11, Flask 2.x, Flask‑RESTful, SQLAlchemy, SQLite  
* **Outillage** – ESLint, Prettier, Git / GitHub

---

## 🚀 Installation rapide

### 1) Cloner & installer

```bash
git clone https://github.com/<ton‑profil>/gestion-clients.git
cd gestion-clients
# depuis /api
python create_user.py     # crée l’utilisateur admin / 123456
python app.py             # lance l’API : http://localhost:5000
# depuis /client-ui
npm run dev               # http://localhost:5173
L'Arborescence
gestion-clients/
├─ api/
│  ├─ app.py              # routes Flask
│  ├─ models.py           # SQLAlchemy
│  ├─ db.py               # config SQLite
│  └─ create_user.py      # script admin
└─ client-ui/
   ├─ src/
   │  ├─ components/
   │  │  ├─ ClientTable.jsx
   │  │  └─ ClientForm.jsx
   │  ├─ Login.jsx
   │  ├─ MainApp.jsx
   │  ├─ App.jsx
   │  └─ api.js
   └─ public/
      └─ logo.png


📝 Licence
MIT – utilisez, modifiez, partagez librement.
© 2025 Wael Najar
