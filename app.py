# app.py ---------------------------------------------------------
from flask import Flask, request, jsonify, abort
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import (
    JWTManager, create_access_token, jwt_required
)
from flask_cors import CORS
from flask_restful import Api, Resource
from werkzeug.security import generate_password_hash, check_password_hash
import uuid
import datetime as dt        # ← alias dt pour les dates

# ─── CONFIG APP ────────────────────────────────────────────────
app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///clients.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["JWT_SECRET_KEY"] = "change‑this‑secret"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = dt.timedelta(days=1)

db   = SQLAlchemy(app)
jwt  = JWTManager(app)
CORS(app, supports_credentials=True)
api  = Api(app)

# ─── MODELS ────────────────────────────────────────────────────
class User(db.Model):
    id       = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)

class Client(db.Model):
    id         = db.Column(db.String(8), primary_key=True)
    nom        = db.Column(db.String(50), nullable=False)
    prenom     = db.Column(db.String(50), nullable=False)
    telephone  = db.Column(db.String(20))
    email      = db.Column(db.String(120))
    adresse    = db.Column(db.Text)
    date_ajout = db.Column(db.Date, default=dt.date.today)

# ─── HELPERS ───────────────────────────────────────────────────
def client_to_dict(c: Client):
    return {
        "id": c.id,
        "nom": c.nom,
        "prenom": c.prenom,
        "telephone": c.telephone,
        "email": c.email,
        "adresse": c.adresse,
        "date_ajout": c.date_ajout.isoformat() if c.date_ajout else None,
    }

# ─── AUTH ROUTE ────────────────────────────────────────────────
# app.py  ───── SECTION LOGIN ───────────────────────────────────────
@app.post("/auth/login")          # ← une seule méthode POST
def login():
    data = request.get_json(force=True) or {}

    user = User.query.filter_by(username=data.get("username")).first()

    if not user or not check_password_hash(user.password,
                                           data.get("password", "")):
        return {"msg": "Bad credentials"}, 401

    token = create_access_token(identity=str(user.id))   # sub = str
    return {"access_token": token}, 200




# ─── REST RESOURCES ────────────────────────────────────────────
class ClientList(Resource):
    @jwt_required()
    def get(self):
        page  = int(request.args.get("page", 1))
        limit = int(request.args.get("limit", 10))
        nom   = request.args.get("nom", "").strip().lower()

        query = Client.query
        if nom:
            query = query.filter(Client.nom.ilike(f"%{nom}%"))

        total = query.count()
        items = (query.order_by(Client.nom)
                      .offset((page - 1) * limit)
                      .limit(limit)
                      .all())
        return {
            "total": total,
            "page":  page,
            "pages": (total - 1) // limit + 1,
            "items": [client_to_dict(c) for c in items],
        }, 200

    @jwt_required()
    def post(self):
        data = request.get_json(force=True) or {}
        if not {"nom", "prenom"} <= data.keys():
            abort(400, "nom et prenom requis")

        c = Client(
            id=uuid.uuid4().hex[:8],
            nom=data["nom"],
            prenom=data["prenom"],
            telephone=data.get("telephone"),
            email=data.get("email"),
            adresse=data.get("adresse"),
        )
        db.session.add(c)
        db.session.commit()
        return client_to_dict(c), 201

class ClientItem(Resource):
    @jwt_required()
    def get(self, cid):
        c = Client.query.get_or_404(cid)
        return client_to_dict(c), 200

    @jwt_required()
    def put(self, cid):
        c = Client.query.get_or_404(cid)
        data = request.get_json(force=True) or {}
        for field in ["nom", "prenom", "telephone", "email", "adresse"]:
            if field in data:
                setattr(c, field, data[field])
        db.session.commit()
        return client_to_dict(c), 200

    @jwt_required()
    def delete(self, cid):
        c = Client.query.get_or_404(cid)
        db.session.delete(c)
        db.session.commit()
        return "", 204

api.add_resource(ClientList, "/clients")
api.add_resource(ClientItem, "/clients/<string:cid>")

# ─── MAIN ──────────────────────────────────────────────────────
if __name__ == "__main__":
    with app.app_context():
        db.create_all()          # crée tables si besoin
    app.run(debug=True)
