import React, { useState } from "react";
import { FaUser, FaLock } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function Login({ onLogin }) {
  const [username, setUsername]   = useState("");
  const [password, setPassword]   = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async () => {
    if (!username || !password) {
      toast.error("Merci de remplir tous les champs."); return;
    }
    try {
      const { data } = await axios.post("http://localhost:5000/auth/login", {
        username,
        password,
      });

      /* stockage : session par défaut, local si « Remember » cochée */
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem("token", data.access_token);

      onLogin?.();                       // informe App.jsx que c’est OK
    } catch (err) {
      toast.error("Identifiant ou mot de passe incorrect.");
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
      <img
        src="/background-stars.png"
        alt="stars"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/70 via-pink-800/50 to-indigo-900/70" />
      <div className="relative z-10 bg-white/20 backdrop-blur-md rounded-xl p-8 w-full max-w-md shadow-2xl">
        <h1 className="text-3xl font-bold mb-6 text-white text-center tracking-wide">
          Login
        </h1>

        <div className="mb-4 relative">
          <FaUser className="absolute left-3 top-3 text-pink-300" />
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-full bg-white/20 text-white placeholder-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
        </div>

        <div className="mb-4 relative">
          <FaLock className="absolute left-3 top-3 text-pink-300" />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-full bg-white/20 text-white placeholder-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
        </div>

      

  <button
      type="button"
      onClick={handleSubmit}
      className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded-full transition"
    >
      Login
    </button>

        
      </div>
    </div>
  );
}
