from flask import Flask, request, jsonify
import google.generativeai as gemini
import os

app = Flask(__name__)

# Configure sua API key do Google Gemini
gemini.configure(api_key='YOUR_GOOGLE_GEMINI_API_KEY')

@app.route('/gerar-perguntas/<filename>', methods=['POST'])
def gerar_perguntas(filename):
    try:
        # Caminho para o arquivo de transcrição
        caminho_arquivo = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        if not os.path.exists(caminho_arquivo):
            return jsonify({"erro": "Arquivo não encontrado"}), 404

        # Ler o conteúdo do arquivo
        with open(caminho_arquivo, 'r') as file:
            content = file.read()

        # Chamar o modelo do Google Gemini para gerar perguntas
        prompt = f"Baseado no seguinte texto, gere 10 perguntas: {content}"
        response = gemini.generate_text(prompt)

        # Assumindo que a resposta contenha uma lista de perguntas
        perguntas = response['generated_questions']

        return jsonify({"perguntas": perguntas}), 200
    except Exception as e:
        return jsonify({"erro": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
