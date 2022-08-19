from fastapi import APIRouter, File, UploadFile, Form, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from .. import models, schemas
from ..utils import generate_filename, face_detection
import os

router = APIRouter()

@router.post("/upload", status_code=status.HTTP_201_CREATED, response_model=schemas.FileResponse)
def upload(user_id: str = Form(), file: UploadFile = File(), db: Session = Depends(get_db)):
    contents = file.file.read()

    # face detection 
    if not face_detection(file.file):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
            detail='image has no face')

    try:
        photo = db.query(models.Photo).filter(
            models.Photo.user_id == (user_id)).first()
        # save file in upload/photos
        filename = generate_filename(file.filename)
        path = os.path.abspath(os.path.join("upload", "photos", f"{filename}"))
        with open(path, 'wb') as f:
            f.write(contents)

        # if file with same user_id already 
        if photo:
            photo.name = filename
            db.commit()
            return photo

        # save in db
        new_file = models.Photo(
            name=filename,
            user_id=user_id
        )
        db.add(new_file)
        db.commit()
        db.refresh(new_file)
    
    except Exception:
        raise HTTPException(status_code=status.HTTP_406_NOT_ACCEPTABLE,
                            detail='file upload failed')
    finally:
        file.file.close()

    return new_file