import uuid
from firebase_admin import storage
from django.conf import settings


def upload_image(file, folder):
    """
    Sube un archivo de imágen a Firebase Storage y devuelve su URL pública.
    
    Args:
        file: objeto de archivo recibido en el request (request.FILES["image"])
        folder: carpeta destino dentro del bucket ("events" o "inventory")
    
    Returns:
        URL pública del archivo subido.
    """ 
    bucket = storage.bucket(settings.FIREBASE_STORAGE_BUCKET)
    
    extension = file.name.split(".")[-1]
    filename = f"{folder}/{uuid.uuid4()}.{extension}"
    
    blob = bucket.blob(filename)
    blob.upload_from_file(file, content_type=file.content_type)
    blob.make_public()
    
    return blob.public_url


def delete_image(image_url):
    """
    Elimina una imagen de Firebase Storage dada su URL pública.
    """
    bucket = storage.bucket(settings.FIREBASE_STORAGE_BUCKET)
    
    # Extrae el path relativo de la URL pública
    # URL tiene forma: https://storage.googleapis.com/bucket-name/folder/uuid.ext
    path = image_url.split(f"{settings.FIREBASE_STORAGE_BUCKET}/")[-1]
    blob = bucket.blob(path)
    
    if blob.exists():
        blob.delete()
