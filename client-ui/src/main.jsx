import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";       // chemin relatif
import "./index.css";          // ← important

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
