from sqlalchemy import create_engine, Column, String, Date, Text
from sqlalchemy.orm import declarative_base, sessionmaker
import datetime, uuid

# 1) Connexion → fichier SQLite
engine = create_engine("sqlite:///clients.db", echo=False, future=True)

# 2) Base déclarative
Base = declarative_base()

# 3) Modèle : table « clients »
class Client(Base):
    __tablename__ = "clients"
    id = Column(String(8),
                primary_key=True,
                default=lambda: uuid.uuid4().hex[:8])
    nom         = Column(String(50),  nullable=False)
    prenom      = Column(String(50),  nullable=False)
    telephone   = Column(String(20))
    email       = Column(String(120))
    adresse     = Column(Text)
    date_ajout  = Column(Date, default=datetime.date.today)

# 4) Crée physiquement la table si besoin
Base.metadata.create_all(engine)

# 5) Fabrique de sessions
SessionLocal = sessionmaker(bind=engine, autoflush=False, future=True)
