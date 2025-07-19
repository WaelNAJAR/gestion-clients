from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy import Column, Integer, String
from db import Base

class User(Base):
    __tablename__ = "users"

    id       = Column(Integer, primary_key=True)
    username = Column(String(80), unique=True, nullable=False)
    password = Column(String(200), nullable=False)

    @staticmethod
    def create(db, username, raw_pwd):
        db.add(User(username=username,
                    password=generate_password_hash(raw_pwd)))
        db.commit()
