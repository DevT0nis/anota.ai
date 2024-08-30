import time
import os
import re
import json
import logging
from flask import Blueprint, jsonify
import google.generativeai as genai
from app.templates import TEMPLATE_AGENT_GERADOR_AWS


# Configurando o Blueprint
perguntas_aws_bp = Blueprint('perguntas_aws_bp', __name__)
GENAI_API_KEY = "AIzaSyA3AWUh1RD2E_b3MprxZAlz4SE3jvVuccU"


@perguntas_aws_bp.route('/gerar-perguntas/<nivel_certificacao>', methods=['POST'])
def gerar_perguntas_aws(nivel_certificacao):
    try:
        # Mapeamento de níveis de certificação para templates
        templates_certificacao = {
            'cloud_practitioner': TEMPLATE_AGENT_GERADOR_AWS.replace("{nivel_certificacao}", "cloud_practitioner"),
            'associate': TEMPLATE_AGENT_GERADOR_AWS.replace("{nivel_certificacao}", "associate"),
            'professional': TEMPLATE_AGENT_GERADOR_AWS.replace("{nivel_certificacao}", "professional"),
            'ai_ml': TEMPLATE_AGENT_GERADOR_AWS.replace("{nivel_certificacao}", "ai_ml"),
        }

        if nivel_certificacao not in templates_certificacao:
            logging.error(f"Nível de certificação não reconhecido: {nivel_certificacao}")
            return jsonify({"erro": "Nível de certificação não reconhecido"}), 400

        # Seleciona o template correto com base no nível de certificação
        template_escolhido = templates_certificacao[nivel_certificacao]

        # Configuração da API
        genai.configure(api_key=GENAI_API_KEY) 

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

        prompt = template_escolhido
        logging.debug(f"Prompt enviado para o modelo: {prompt}")

        chat_session = model.start_chat(history=[])
        response = chat_session.send_message(prompt)

        logging.info(f"Resposta do modelo: {response}")

        if not response.candidates or not response.candidates[0].content:
            raise ValueError("A resposta do modelo está vazia ou malformada.")

        resposta_texto = response.candidates[0].content.parts[0].text
        logging.debug(f"Texto da resposta: {resposta_texto}")

   
    except Exception as e:
        logging.error(f"Erro ao gerar perguntas: {e}")
        return jsonify({"erro": str(e)}), 500