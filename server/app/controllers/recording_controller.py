import os
from flask import Blueprint, app, request, jsonify, current_app
import google.generativeai as genai
from app.templates import TEMPLATE_AGENT_CORRETOR
import logging

recording_bp = Blueprint('recording', __name__)

@recording_bp.route('/salvar-transcricao', methods=['POST'])
def salvar_transcricao():
    if 'file' not in request.files:
        logging.error("Nenhum arquivo encontrado para salvar")
        return jsonify({"error": "Nenhum arquivo encontrado para salvar"}), 400

    file = request.files['file']
    file_path = os.path.join(current_app.config['UPLOAD_FOLDER'], file.filename)
    
    try:
        # Salvar temporariamente o arquivo
        temp_file_path = os.path.join(current_app.config['UPLOAD_FOLDER'], f"temp_{file.filename}")
        file.save(temp_file_path)
        logging.info(f"Arquivo salvo temporariamente em: {temp_file_path}")

        # Ler o conteúdo do arquivo
        with open(temp_file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # Configurar a API do Google Generative AI
        genai.configure(api_key="AIzaSyD4D3q6oSVGGvKYnwyXOr9D6wy-B4IsueQ") 

        
        generation_config = {
            "temperature": 1,
            "top_p": 0.95,
            "top_k": 64,
            "max_output_tokens": 8192,
            "response_mime_type": "text/plain",
        }

        model = genai.GenerativeModel(
            model_name="gemini-1.5-pro",
            generation_config=generation_config,
        )

        prompt = TEMPLATE_AGENT_CORRETOR.format(texto=content)
        logging.info(f"Prompt enviado para o modelo: {prompt}")

        chat_session = model.start_chat(history=[])
        response = chat_session.send_message(prompt)
        corrected_text = response.text

        logging.info(f"Resposta do modelo: {response}")

        # Salvar o texto corrigido em um novo arquivo
        corrected_file_path = os.path.join(current_app.config['UPLOAD_FOLDER'], f"corrigido_{file.filename}")
        with open(corrected_file_path, 'w', encoding='utf-8') as f:
            f.write(corrected_text)
        logging.info(f"Texto corrigido salvo em: {corrected_file_path}")

        return jsonify({"message": f"Arquivo {file.filename} salvo e corrigido com sucesso", "corrected_file": corrected_file_path})

    except Exception as e:
        logging.error(f"Erro ao processar o arquivo: {e}", exc_info=True)
        return jsonify({"error": "Erro interno do servidor"}), 500

if __name__ == '__main__':
    app.run(debug=True)