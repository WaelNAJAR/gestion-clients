// src/App.jsx
import React, { useState, useEffect } from "react";
import Login      from "./Login.jsx";
import MainApp    from "./MainApp.jsx";
import { Toaster } from "react-hot-toast";
import { Sun, Moon } from "lucide-react";
import axios from "axios";
import Header  from "./components/Header.jsx";

/* ───────────────────────────────────────────
   Composant bascule Jour / Nuit
   ─────────────────────────────────────────── */
function ThemeToggle() {
  const [dark, setDark] = useState(
    document.documentElement.classList.contains("dark")
  );

  const toggle = () => {
    document.documentElement.classList.toggle("dark");
    setDark(!dark);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      title="Basculer thème"
      className="fixed bottom-6 right-6 p-3 rounded-full shadow-lg
                 bg-slate-200 text-yellow-600 hover:scale-105
                 dark:bg-slate-700 transition"
    >
      {dark ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}

/* ───────────────────────────────────────────
   App racine
   ─────────────────────────────────────────── */
export default function App() {
  /* 1)  État de connexion basé sur la présence du token */
  const [logged, setLogged] = useState(!!localStorage.getItem("token"));

  /* 2) Intercepteur axios : déconnexion automatique si 401 */
  useEffect(() => {
    const id = axios.interceptors.response.use(
      (r) => r,
      (err) => {
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          setLogged(false);
        }
        return Promise.reject(err);
      }
    );
    return () => axios.interceptors.response.eject(id);
  }, []);

  /* 3) Rendu conditionnel */
  return (
    <>
    {logged && <Header />}
      {logged ? (
        <MainApp onLogout={() => setLogged(false)} />
      ) : (
        <Login onLogin={() => setLogged(true)} />
      )}

      {/* Toaster global (une seule instance dans l’app) */}
      <Toaster position="top-right" />

      {/* Bouton thème toujours présent */}
      <ThemeToggle />
    </>
  );
}
