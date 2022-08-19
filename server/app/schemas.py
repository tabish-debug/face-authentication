from datetime import datetime
import uuid
from pydantic import BaseModel, EmailStr, constr


class UserBaseSchema(BaseModel):
    email: EmailStr

    class Config:
        orm_mode = True


class CreateUserSchema(UserBaseSchema):
    verified: bool = False


class UploadPhotoSchema(BaseModel):
    name: str
    user_id: uuid.UUID

    class Config:
        orm_mode = True

class FileResponse(UploadPhotoSchema):
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime

class LoginUserSchema(BaseModel):
    email: EmailStr

class UserResponse(UserBaseSchema):
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime
