/* ---------------------------------------------------------------------
   ClientTable.jsx – version “pretty” (toast, loader, pagination clean)
   ------------------------------------------------------------------ */

import React, { useEffect, useState } from "react";
import {
  ChevronLeft, ChevronRight, PenLine, Trash2, Loader2, Search
} from "lucide-react";
import { getClients, deleteClient } from "../api.js";
import { toast } from "react-hot-toast";
import { Dialog } from "@headlessui/react";
import { motion, AnimatePresence } from "framer-motion";

export default function ClientTable({ onEdit, refreshFlag }) {
  /* ÉTATS ------------------------------------------------------------ */
  const [rows, setRows]   = useState([]);
  const [page, setPage]   = useState(1);
  const [pages, setPages] = useState(1);
  const [nom, setNom]     = useState("");
  const [loading, setLoading] = useState(false);

  /* API -------------------------------------------------------------- */
  const fetchClients = async (p = 1, filter = "") => {
    setLoading(true);
    try {
      const { data } = await getClients({ page: p, limit: 5, nom: filter });
      setRows(data.items);
      setPage(data.page);
      setPages(data.pages);
    } catch (err) {
      console.error(err);
      toast.error("Impossible de charger les clients");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchClients(page, nom); /* eslint-disable-next-line */ }, [refreshFlag]);

  /* HANDLERS --------------------------------------------------------- */
  const handleSearch = (e) => { e.preventDefault(); fetchClients(1, nom); };

  const prev = () => page > 1     && fetchClients(page - 1, nom);
  const next = () => page < pages && fetchClients(page + 1, nom);

  /* --- suppression avec HeadlessUI Dialog -------------------------- */
  const [confirmId, setConfirmId] = useState(null);

  const handleDelete = async () => {
    if (!confirmId) return;
    try {
      await deleteClient(confirmId);
      toast.success("Client supprimé ✔️");
      // recalcule éventuellement la page
      const newPage = rows.length === 1 && page > 1 ? page - 1 : page;
      fetchClients(newPage, nom);
    } catch (err) {
      console.error(err);
      toast.error("Suppression impossible");
    } finally {
      setConfirmId(null);
    }
  };

  /* RENDU ------------------------------------------------------------ */
  return (
    <>
      {/* BARRE RECHERCHE */}
      <form onSubmit={handleSearch} className="mb-4 flex gap-2">
        <div className="relative flex-1">
          <input
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            placeholder="Filtrer par nom"
            className="w-full rounded-md border px-10 py-2 shadow-sm focus:ring-2 focus:ring-indigo-500 dark:bg-slate-700 dark:border-slate-600
              dark:text-gray-100 dark:placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        </div>
        <button className="inline-flex items-center gap-1 rounded-md bg-indigo-600 px-4 py-2 text-white
                           hover:bg-indigo-700">
          <Search className="h-4 w-4" /> Rechercher
        </button>
      </form>
 
      {/* TABLE */}
      <div className="overflow-x-auto rounded-lg border shadow">
        <table className="min-w-full text-sm                      /* taille */
             text-gray-700 dark:text-gray-200        /* texte clair ↔ sombre */
             bg-white dark:bg-slate-800              /* fond clair ↔ sombre */
             border dark:border-slate-700">
          <thead className="bg-indigo-50 dark:bg-indigo-700/60">
            <tr>
              {["Nom","Prénom","Email","Téléphone","Adresse","Actions"].map(h => (
                <th key={h} className="px-4 py-2 text-left text-sm font-semibold text-indigo-600">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm dark:divide-slate-600">
            {loading ? (
              <tr><td colSpan="6" className="py-6 text-center">
                <Loader2 className="mx-auto h-6 w-6 animate-spin text-indigo-600" />
              </td></tr>
            ) : rows.length ? rows.map(c => (
              <tr key={c.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 dark:text-slate-100">{c.nom}</td>
                <td className="px-4 py-2 dark:text-slate-100">{c.prenom}</td>
                <td className="px-4 py-2 dark:text-slate-100">{c.email}</td>
                <td className="px-4 py-2 dark:text-slate-100">{c.telephone}</td>
                <td className="px-4 py-2 dark:text-slate-100">{c.adresse}</td>
                <td className="px-4 py-2 flex gap-2">
                  <button onClick={() => onEdit(c)}
                          className="rounded bg-yellow-400 p-2 hover:bg-yellow-500 dark:bg-yellow-500 dark:hover:bg-yellow-400 rounded">
                    <PenLine className="h-4 w-4 text-white" />
                  </button>
                  <button onClick={() => setConfirmId(c.id)}
                          className="rounded bg-red-500 p-2 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-500 rounded">
                    <Trash2 className="h-4 w-4 text-white" />
                  </button>
                </td>
              </tr>
            )) : (
              <tr><td colSpan="6" className="py-6 text-center text-gray-500">Aucun client.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="mt-4 flex items-center justify-center gap-4 text-sm">
        <button onClick={prev} disabled={page === 1}
                className="rounded border p-2 disabled:opacity-40">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span>{page} / {pages}</span>
        <button onClick={next} disabled={page === pages}
                className="rounded border p-2 disabled:opacity-40">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* CONFIRM MODAL */}
      <AnimatePresence>
        {confirmId && (
          <Dialog static open onClose={() => setConfirmId(null)} className="fixed inset-0 z-50">
            <motion.div className="fixed inset-0 bg-black/30" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} />
            <motion.div
              className="fixed inset-0 flex items-center justify-center p-4"
              initial={{ scale:0.9, opacity:0 }} animate={{ scale:1, opacity:1 }} exit={{ scale:0.9, opacity:0 }}
            >
              <Dialog.Panel className="w-full max-w-sm rounded-lg bg-white p-6 shadow-xl">
                <Dialog.Title className="mb-2 text-lg font-semibold text-red-600">
                  Supprimer ce client ?
                </Dialog.Title>
                <Dialog.Description className="mb-6 text-sm text-gray-600">
                  Cette action est irréversible.
                </Dialog.Description>
                <div className="flex justify-end gap-2">
                  <button onClick={() => setConfirmId(null)}
                          className="rounded border px-3 py-1 text-sm">Annuler</button>
                  <button onClick={handleDelete}
                          className="inline-flex items-center gap-1 rounded bg-red-600 px-3 py-1 text-sm text-white
                                     hover:bg-red-700">
                    <Trash2 className="h-4 w-4" /> Supprimer
                  </button>
                </div>
              </Dialog.Panel>
            </motion.div>
          </Dialog>
        )}
      </AnimatePresence>
    </>
  );
}
