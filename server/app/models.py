import uuid
from .database import Base
from sqlalchemy import TIMESTAMP, Column, String, Boolean, text, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship, backref


class User(Base):
    __tablename__ = 'users'
    id = Column(UUID(as_uuid=True), primary_key=True, nullable=False,
                default=uuid.uuid4)
    email = Column(String, unique=True, nullable=False)
    verified = Column(Boolean, default=False)
    # role = Column(String, server_default='user', nullable=False)
    created_at = Column(TIMESTAMP(timezone=True),
                        nullable=False, server_default=text("now()"))
    updated_at = Column(TIMESTAMP(timezone=True),
                        nullable=False, server_default=text("now()"))
    photo = relationship("Photo", back_populates="user", uselist=False)

class Photo(Base):
    __tablename__ = 'photos'
    id = Column(UUID(as_uuid=True), primary_key=True, nullable=False,
        default=uuid.uuid4)
    name = Column(String(150), unique=True, nullable=False)
    user_id = Column('user_id', UUID(as_uuid=True), ForeignKey('users.id'), primary_key=True)
    created_at = Column(TIMESTAMP(timezone=True),
                        nullable=False, server_default=text("now()"))
    updated_at = Column(TIMESTAMP(timezone=True),
                        nullable=False, server_default=text("now()"))
    user = relationship("User", back_populates="photo")