from db import Client, SessionLocal
import datetime, uuid

# ─── CRUD ──────────────────────────────────────────────────────────
def ajouter(**infos):
    with SessionLocal() as db:
        c = Client(id=uuid.uuid4().hex[:8], date_ajout=datetime.date.today(), **infos)
        db.add(c)
        db.commit()
        print("✅ Client ajouté.")

def lister(tri="nom"):
    with SessionLocal() as db:
        res = db.query(Client).order_by(getattr(Client, tri)).all()
        for c in res:
            print(vars(c))

def chercher(champ, valeur):
    with SessionLocal() as db:
        col = getattr(Client, champ)
        res = db.query(Client).filter(col.ilike(f"%{valeur}%")).all()
        for c in res:
            print(vars(c))

def modifier(id_client, **champs):
    with SessionLocal() as db:
        c = db.get(Client, id_client)
        if not c:
            print("❌ ID introuvable"); return
        for k, v in champs.items():
            if v: setattr(c, k, v)
        db.commit(); print("✅ Modifié.")

def supprimer(id_client):
    with SessionLocal() as db:
        c = db.get(Client, id_client)
        if c:
            db.delete(c); db.commit()
            print("✅ Supprimé.")
