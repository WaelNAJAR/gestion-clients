#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Gestion simple de fiches clients (CSV) :
CRUD, recherche/tri, import/export, statistiques graphiques.
"""

import csv
import uuid
import datetime as dt
import pandas as pd
import matplotlib.pyplot as plt
CSV_PATH = "clients.csv"

# ──────────────────────────────────────────────
# Helpers I/O
# ──────────────────────────────────────────────
def _load() -> pd.DataFrame:
    """Charge le CSV ou crée un DataFrame vide."""
    try:
        return pd.read_csv(CSV_PATH)
    except FileNotFoundError:
        cols = ["id", "nom", "prenom", "telephone",
                "email", "adresse", "date_ajout"]
        return pd.DataFrame(columns=cols)

def _save(df: pd.DataFrame):
    """Sauvegarde le DataFrame dans le CSV."""
    df.to_csv(CSV_PATH, index=False)

# ──────────────────────────────────────────────
# CRUD
# ──────────────────────────────────────────────
def ajouter(**infos):
    df = _load()
    infos["id"] = uuid.uuid4().hex[:8]          # identifiant unique court
    infos["date_ajout"] = dt.date.today().isoformat()
    _save(pd.concat([df, pd.DataFrame([infos])], ignore_index=True))
    print("✅ Client ajouté.")

def modifier(id_client):
    df = _load()
    idx = df.index[df["id"] == id_client]
    if idx.empty:
        print("❌ ID introuvable.")
        return
    for champ in ["nom", "prenom", "telephone", "email", "adresse"]:
        val = input(f"{champ} (vide pour garder actuel) : ").strip()
        if val:
            df.at[idx[0], champ] = val
    _save(df)
    print("✅ Client modifié.")

def supprimer(id_client):
    df = _load()
    _save(df[df["id"] != id_client])
    print("✅ Client supprimé (si trouvé).")

# ──────────────────────────────────────────────
# Recherche & tri
# ──────────────────────────────────────────────
def chercher(champ, valeur):
    df = _load()
    res = df[df[champ].astype(str).str.contains(valeur, case=False, na=False)]
    print(res.sort_values(champ))

def lister(tri="nom", asc=True):
    df = _load().sort_values(tri, ascending=asc)
    print(df)

# ──────────────────────────────────────────────
# Import / export CSV
# ──────────────────────────────────────────────
def importer(fichier):
    ext = pd.read_csv(fichier)
    df = pd.concat([_load(), ext], ignore_index=True).drop_duplicates("id")
    _save(df)
    print("✅ Import terminé.")

def exporter(fichier="export_clients.csv"):
    _load().to_csv(fichier, index=False)
    print(f"✅ Exporté vers {fichier}")

# ──────────────────────────────────────────────
# Statistiques
# ──────────────────────────────────────────────
def stats_par_mois():
    df = _load()
    if df.empty:
        print("Aucune donnée à afficher.")
        return
    df["mois"] = pd.to_datetime(df["date_ajout"]).dt.to_period("M")
    counts = df.groupby("mois").size()
    counts.plot(kind="bar")
    plt.title("Nouveaux clients par mois")
    plt.xlabel("Mois")
    plt.ylabel("Nombre de clients")
    plt.tight_layout()
    plt.show()

# ──────────────────────────────────────────────
# Interface CLI minimale
# ──────────────────────────────────────────────
MENU = """
[A]jouter  [M]odifier  [S]upprimer  [R]echercher
[L]ister   Im[P]ort    E[x]port      [V]isualiser stats   [Q]uitter
> """

def _action_ajouter():
    ajouter(
        nom=input("Nom : "),
        prenom=input("Prénom : "),
        telephone=input("Téléphone : "),
        email=input("Email : "),
        adresse=input("Adresse : ")
    )

ACTIONS = {
    "a": _action_ajouter,
    "m": lambda: modifier(input("ID à modifier : ")),
    "s": lambda: supprimer(input("ID à supprimer : ")),
    "r": lambda: chercher(input("Champ (nom/prenom/email/...) : "),
                          input("Valeur à chercher : ")),
    "l": lambda: lister(input("Trier par (nom/prenom/date_ajout) : ") or "nom",
                        True),
    "p": lambda: importer(input("Chemin du CSV à importer : ")),
    "x": exporter,
    "v": stats_par_mois,
}

if __name__ == "__main__":
    while (c := input(MENU).strip().lower()) != "q":
        ACTIONS.get(c, lambda: print("Commande inconnue."))()
