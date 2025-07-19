
import axios from "axios";
import { toast } from "react-hot-toast";

const BASE = "http://localhost:5000";

// ──────────────────────────────────────────────────────────────────────────────
// Helpers génériques
// ──────────────────────────────────────────────────────────────────────────────
const authHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});
const api = axios.create({
  baseURL: "http://localhost:5000",
});
// ➜ ajoute le token automatiquement
api.interceptors.request.use((cfg) => {
  const token = sessionStorage.getItem("token") || localStorage.getItem("token");
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      sessionStorage.removeItem("token");
      localStorage.removeItem("token");
      toast.error("Session expirée. Veuillez‑vous reconnecter.");
      window.location.reload();
    }
    return Promise.reject(err);
  }
);

// ──────────────────────────────────────────────────────────────────────────────
// CRUD Clients
// ──────────────────────────────────────────────────────────────────────────────
export const addClient  = data   => api.post("/clients", data);          // ← utilisé par ClientForm
export const getClients = params => api.get("/clients", { params });

export const updateClient = (id, client) =>
  axios.put(`${BASE}/clients/${id}`, client, authHeaders());

export const deleteClient = (id)            => api.delete(`/clients/${id}`); 

// ──────────────────────────────────────────────────────────────────────────────
// Auth
// ──────────────────────────────────────────────────────────────────────────────
export const login = async (username, password) => {
  const res = await axios.post(`${BASE}/login`, { username, password });
  const { access_token } = res.data;
  localStorage.setItem("token", access_token);
  return access_token;
};

