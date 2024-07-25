from flask import Flask
from flask_cors import CORS
from app.controllers.recording_controller import recording_bp
from app.controllers.transcricao_controller import transcricao_bp
from config import Config

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    CORS(app)
    app.register_blueprint(recording_bp)
    app.register_blueprint(transcricao_bp)

    return app
