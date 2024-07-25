import os

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'my_secret_key')
    UPLOAD_FOLDER = 'anotações'
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16 MB
