/* ---------------------------------------------------------------------
   ClientForm.jsx – version “pretty”
   ------------------------------------------------------------------ */

import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { Plus, CheckCircle, Loader2, UserPlus } from "lucide-react";

const vide = { nom: "", prenom: "", email: "", telephone: "", adresse: "" };

export default function ClientForm({ selected, onSaved }) {
  const [form, setForm] = useState(vide);
  const [loading, setLoading] = useState(false);

  /* Remplit le formulaire quand on clique ✏️ */
  useEffect(() => setForm(selected || vide), [selected]);

  const handleChange = ({ target }) =>
    setForm({ ...form, [target.name]: target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem("token");
    const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };

    try {
      if (selected) {
        await axios.put(`http://localhost:5000/clients/${selected.id}`, form, { headers });
        toast.success("Client modifié ✨");
      } else {
        await axios.post("http://localhost:5000/clients", form, { headers });
        toast.success("Client ajouté 🎉");
      }

      onSaved();          // ↻ recharge la table
      setForm(vide);      // ↺ reset
    } catch (err) {
      console.error(err);
      toast.error("Erreur API 😢");
    } finally {
      setLoading(false);
    }
  };

  /* petit helper pour le champ */
  const champ = (name, placeholder) => (
    <input
      key={name}
      name={name}
      value={form[name]}
      onChange={handleChange}
      placeholder={placeholder}
      className="border rounded p-2
               bg-white text-gray-900 placeholder-gray-400
               dark:bg-slate-700 dark:border-slate-600
               dark:text-gray-100 dark:placeholder-gray-400
               focus:outline-none focus:ring-2 focus:ring-indigo-500"
    />
  );

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="mb-8 grid gap-3 sm:grid-cols-3"
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      {champ("nom", "Nom")}
      {champ("prenom", "Prénom")}
      {champ("email", "Email")}
      {champ("telephone", "Téléphone")}
      {champ("adresse", "Adresse")}

      <button
        type="submit"
        className="col-span-3 sm:col-span-1 inline-flex items-center justify-center gap-2
                   rounded-md bg-indigo-600 px-4 py-2 font-medium text-white
                   hover:bg-indigo-700 transition"
        disabled={loading}
      >
        {loading ? <Loader2 className="flex items-center justify-center gap-2
              bg-indigo-600 hover:bg-indigo-700
              dark:bg-indigo-500 dark:hover:bg-indigo-600
              text-white font-medium py-2 rounded shadow" /> :
          selected ? <CheckCircle className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
        {selected ? "Enregistrer" : "Ajouter"}
      </button>
    </motion.form>
  );
}
