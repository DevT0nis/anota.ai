import os
import time
import google.generativeai as genai

from app.templates import TEMPLATE_AGENT_CORRETOR_DE_TEXTO, TEMPLATE_TEXTO

genai.configure(api_key="AIzaSyD4D3q6oSVGGvKYnwyXOr9D6wy-B4IsueQ")


# Configurações de geração
generation_config = {
    "temperature": 1,
    "top_p": 0.95,
    "top_k": 64,
    "max_output_tokens": 8192,
    "response_mime_type": "text/plain",
}

# Nome do modelo e configuração de geração
model = genai.GenerativeModel(
    model_name="gemini-1.5-flash",
    generation_config=generation_config,
)

# Iniciar uma sessão de chat
chat_session = model.start_chat(history=[])

texto = TEMPLATE_TEXTO

prompt = TEMPLATE_AGENT_CORRETOR_DE_TEXTO.format(texto=texto)

response = chat_session.send_message(prompt)

# Criar uma pasta para as anotações se ainda não existir
pasta_anotacoes = "anotações"
if not os.path.exists(pasta_anotacoes):
    os.makedirs(pasta_anotacoes)

# Gerar um nome de arquivo único baseado no tempo atual
nome_arquivo = f"resposta_{int(time.time())}.txt"
caminho_arquivo = os.path.join(pasta_anotacoes, nome_arquivo)

with open(caminho_arquivo, "w", encoding="utf-8") as arquivo:
    arquivo.write(response.text)

print(f"Resposta salva em {caminho_arquivo}")