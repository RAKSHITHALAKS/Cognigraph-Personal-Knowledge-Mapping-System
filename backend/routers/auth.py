from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from database import SessionLocal
from models import User
from schemas import UserCreate, UserResponse, UserLogin  # include UserLogin

router = APIRouter(prefix="/auth", tags=["auth"])
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/signup", response_model=UserResponse)
def signup(user: UserCreate, db: Session = Depends(get_db)):
    password = user.password[:72]  # bcrypt limit
    hashed_password = pwd_context.hash(password)
    db_user = User(username=user.username, email=user.email, password=hashed_password)

    try:
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Error saving user: {e}")

    return db_user


@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    # Check user exists
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user:
        raise HTTPException(status_code=400, detail="Invalid email or password")

    # Verify password (bcrypt limit 72)
    if not pwd_context.verify(user.password[:72], db_user.password):
        raise HTTPException(status_code=400, detail="Invalid email or password")

    return {"message": "Login successful", "user": {"id": db_user.id, "email": db_user.email}}
