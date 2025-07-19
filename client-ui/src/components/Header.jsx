import React from "react";
import logo from "/logo.png";         // image mise dans /public

export default function Header() {
  return (
    <header
      className="sticky top-0 z-40 backdrop-blur bg‑white/70 dark:bg‑slate‑900/70"
    >
      {/* bloc gauche = logo + nom */}
      <div className="mx‑auto flex items‑center gap‑4 px‑6 py‑3 max‑w‑7xl">
        <img
          src={"./logo.png"}
          alt="Logo Wael Najar"
          className="h-16 w-auto select-none"
        />
       
      </div>

      {/* bouton thème unique */}
      
    </header>
  );
}
