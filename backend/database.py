from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Replace username and password with your MySQL credentials
SQLALCHEMY_DATABASE_URL = "mysql+pymysql://root:rakshitha@127.0.0.1:3306/knowledge_graph_db"


# Create engine and session
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()