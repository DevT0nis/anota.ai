from flask import Flask
from app.controllers.transcricao_controller import transcricao_bp
from app.controllers.recording_controller import recording_bp
app = Flask(__name__)
app.register_blueprint(recording_bp)
app.register_blueprint(transcricao_bp)

if __name__ == '__main__':
    app.run(debug=True)
