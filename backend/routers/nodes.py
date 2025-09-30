from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import Node
from schemas import NodeCreate, NodeResponse

router = APIRouter(prefix="/nodes", tags=["nodes"])

@router.post("/", response_model=NodeResponse)
def create_node(node: NodeCreate, db: Session = Depends(get_db)):
    db_node = Node(title=node.title, description=node.description, user_id=node.user_id)
    db.add(db_node)
    db.commit()
    db.refresh(db_node)
    return db_node

@router.get("/", response_model=list[NodeResponse])
def get_nodes(db: Session = Depends(get_db)):
    return db.query(Node).all()
