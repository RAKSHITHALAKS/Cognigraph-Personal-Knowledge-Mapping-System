from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import Edge
from schemas import EdgeCreate, EdgeResponse

router = APIRouter(prefix="/edges", tags=["edges"])

@router.post("/", response_model=EdgeResponse)
def create_edge(edge: EdgeCreate, db: Session = Depends(get_db)):
    db_edge = Edge(from_node=edge.from_node, to_node=edge.to_node)
    db.add(db_edge)
    db.commit()
    db.refresh(db_edge)
    return db_edge

@router.get("/", response_model=list[EdgeResponse])
def get_edges(db: Session = Depends(get_db)):
    return db.query(Edge).all()
