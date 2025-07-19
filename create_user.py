# create_user.py
"""
Crée l’utilisateur admin / 123456 si absent.
À lancer une seule fois :  python create_user.py
"""

from werkzeug.security import generate_password_hash
from app import app, db, User   # on récupère app, db et le modèle

with app.app_context():         # ← CONTEXTE OBLIGATOIRE
    db.create_all()             # crée les tables si pas encore faites

    if not User.query.filter_by(username="admin").first():
        admin = User(
            username="admin",
            password=generate_password_hash("123456")
        )
        db.session.add(admin)
        db.session.commit()
        print("✅ Utilisateur admin créé (login: admin / 123456)")
    else:
        print("ℹ️  L’utilisateur admin existe déjà.")
