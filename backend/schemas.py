from pydantic import BaseModel, EmailStr

# ----- Node Schemas -----
class NodeCreate(BaseModel):
    title: str
    description: str
    user_id: int

class NodeResponse(NodeCreate):
    id: int
    class Config:
        from_attributes = True   # ✅ instead of orm_mode


# ----- Edge Schemas -----
class EdgeCreate(BaseModel):
    from_node: int
    to_node: int

class EdgeResponse(EdgeCreate):
    id: int
    class Config:
        from_attributes = True   # ✅


# ----- User Schemas -----
class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    username: str
    email: EmailStr
    class Config:
        from_attributes = True   # ✅
# ----- Login Schema -----
class UserLogin(BaseModel):
    email: EmailStr
    password: str
