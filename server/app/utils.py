import uuid
import os
import face_recognition

def generate_filename(name):
    _, ext = name.rsplit('.', 1)
    return f'{uuid.uuid4()}.{ext}'

def face_detection(file):
    img = face_recognition.load_image_file(file)
    encodings = face_recognition.face_encodings(img)
    return len(encodings) > 0

def match_faces(filename: str, file):
    # file in folder
    known_file_path = os.path.abspath(os.path.join('upload', 'photos', f'{filename}'))
    known_img = face_recognition.load_image_file(known_file_path)
    known_face_encodings = face_recognition.face_encodings(known_img)
    
    # file from user
    unknown_img = face_recognition.load_image_file(file.file)
    unknown_face_encodings = face_recognition.face_encodings(unknown_img)
    
    face_found = False
    is_match = False

    if len(unknown_face_encodings) > 0:
        face_found = True
        match_results = face_recognition.compare_faces(
            known_face_encodings, unknown_face_encodings[0], tolerance=0.25)
        is_match = match_results[0]

    # Return the result
    return (face_found, is_match)
