import time
import os
import re
import json
import logging
from flask import Blueprint, current_app, jsonify, request
import google.generativeai as genai
from app.models.speech_recognition import Transcricao
from app.templates import TEMPLATE_AGENT_GERADOR, TEMPLATE_AGENT_AVALIADOR

import google.generativeai as genai

# Configurando o Blueprint
transcricao_bp = Blueprint('transcricao_bp', __name__)

# Configurar logging detalhado
logging.basicConfig(level=logging.INFO)

# Rota para listar transcrições
@transcricao_bp.route('/listar-transcricoes', methods=['GET'])
def listar_transcricoes():
    try:
        arquivos = Transcricao.listar_arquivos(current_app.config['UPLOAD_FOLDER'])
        return jsonify({"transcricoes": arquivos}), 200
    except Exception as e:
        logging.error(f"Erro ao listar transcrições: {e}")
        return jsonify({"erro": str(e)}), 500


# Rota para obter uma transcrição específica
@transcricao_bp.route('/obter-transcricao/<filename>', methods=['GET'])
def obter_transcricao(filename):
    try:
        caminho_arquivo = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
        if os.path.exists(caminho_arquivo):
            conteudo = Transcricao.ler_transcricao(caminho_arquivo)
            return jsonify({"filename": filename, "content": conteudo}), 200
        else:
            return jsonify({"erro": "Arquivo não encontrado"}), 404
    except Exception as e:
        logging.error(f"Erro ao obter transcrição: {e}")
        return jsonify({"erro": str(e)}), 500

# Rota para salvar uma transcrição editada
@transcricao_bp.route('/salvar-transcricao-editada/<filename>', methods=['POST'])
def salvar_transcricao_editada(filename):
    try:
        caminho_arquivo = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
        conteudo = request.json.get('content')
        Transcricao.salvar_transcricao_editada(caminho_arquivo, conteudo)
        return jsonify({"mensagem": f"Arquivo {filename} editado com sucesso"}), 200
    except Exception as e:
        logging.error(f"Erro ao salvar transcrição editada: {e}")
        return jsonify({"erro": str(e)}), 500

# Rota para renomear uma transcrição
@transcricao_bp.route('/renomear-transcricao/<old_filename>', methods=['POST'])
def renomear_transcricao(old_filename):
    try:
        novo_filename = request.json.get('new_filename')
        antigo_caminho_arquivo = os.path.join(current_app.config['UPLOAD_FOLDER'], old_filename)
        novo_caminho_arquivo = os.path.join(current_app.config['UPLOAD_FOLDER'], novo_filename)
        Transcricao.renomear_arquivo(antigo_caminho_arquivo, novo_caminho_arquivo)
        return jsonify({"mensagem": f"Arquivo {old_filename} renomeado para {novo_filename}"}), 200
    except Exception as e:
        logging.error(f"Erro ao renomear transcrição: {e}")
        return jsonify({"erro": str(e)}), 500

# Rota para excluir uma transcrição
@transcricao_bp.route('/excluir-transcricao/<filename>', methods=['DELETE'])
def excluir_transcricao(filename):
    try:
        caminho_arquivo = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
        if os.path.exists(caminho_arquivo):
            Transcricao.excluir_arquivo(caminho_arquivo)
            return jsonify({"mensagem": f"Arquivo {filename} deletado"}), 200
        else:
            return jsonify({"erro": "Arquivo não encontrado"}), 404
    except Exception as e:
        logging.error(f"Erro ao excluir transcrição: {e}")
        return jsonify({"erro": str(e)}), 500


def processar_resposta(resposta):
    try:
        logging.debug(f"Processando resposta: {resposta}")
        
        # Remover o bloco de código JSON e extrair o texto JSON
        resposta_limpa = re.sub(r'^```json\n|\n```$', '', resposta.strip())
        logging.debug(f"Resposta limpa: {resposta_limpa}")
        
        if not resposta_limpa:
            raise ValueError("Resposta vazia ou inválida.")
        
        # Substituir aspas duplas escapadas dentro de strings por aspas normais
        resposta_limpa = resposta_limpa.replace('\\"', '"')
        logging.debug(f"Resposta escapada: {resposta_limpa}")
        
        # Validar manualmente o JSON gerado
        try:
            perguntas = json.loads(resposta_limpa)
        except json.JSONDecodeError as e:
            logging.error(f"Erro ao decodificar a resposta JSON: {e}")
            logging.error(f"Resposta JSON malformada: {resposta_limpa}")
            raise

        logging.debug(f"Perguntas carregadas: {perguntas}")

        # Verificar se o formato está correto
        if not isinstance(perguntas, list) or len(perguntas) != 10:
            raise ValueError("O número de perguntas geradas está incorreto ou o formato não é uma lista de perguntas.")
        
        for pergunta in perguntas:
            if not all(key in pergunta for key in ["pergunta", "resposta_esperada", "explicacao"]):
                raise ValueError("Alguma pergunta gerada está com formato incorreto.")
        
        return perguntas

    except json.JSONDecodeError as e:
        logging.error(f"Erro ao decodificar a resposta JSON: {e}")
        raise
    except ValueError as e:
        logging.error(f"Erro de validação da resposta: {e}")
        raise
    except Exception as e:
        logging.error(f"Erro ao processar a resposta: {e}")
        raise


@transcricao_bp.route('/gerar-perguntas/<filename>', methods=['POST'])
def gerar_perguntas(filename):
    try:
        caminho_arquivo = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
        
        if not os.path.exists(caminho_arquivo):
            logging.error(f"Arquivo não encontrado: {caminho_arquivo}")
            return jsonify({"erro": "Arquivo não encontrado"}), 404

        def ler_arquivo(caminho, codificacoes=['utf-8', 'latin1', 'iso-8859-1']):
            for codificacao in codificacoes:
                try:
                    with open(caminho, 'r', encoding=codificacao) as file:
                        return file.read(), codificacao
                except UnicodeDecodeError as e:
                    logging.warning(f"Falha ao usar codificação {codificacao}: {e}")
            raise UnicodeDecodeError(f"Falha ao decodificar o arquivo {caminho} com as codificações fornecidas")

        content, codificacao_usada = ler_arquivo(caminho_arquivo)
        logging.info(f"Conteúdo do arquivo ({filename}) usando codificação {codificacao_usada}")


        # Configuração da API
        genai.configure(api_key="AIzaSyDocQvT1c2mJ5Jf_wMfVwDFLwvsv6QYezc") 

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

        prompt = TEMPLATE_AGENT_GERADOR.format(texto=content)
        logging.debug(f"Prompt enviado para o modelo: {prompt}")

        chat_session = model.start_chat(history=[])
        response = chat_session.send_message(prompt)

        logging.info(f"Resposta do modelo: {response}")

        if not response.candidates or not response.candidates[0].content:
            raise ValueError("A resposta do modelo está vazia ou malformada.")

        resposta_texto = response.candidates[0].content.parts[0].text
        logging.debug(f"Texto da resposta: {resposta_texto}")
        perguntas = processar_resposta(resposta_texto)

        logging.info(f"Perguntas geradas: {perguntas}")

        if not perguntas:
            logging.error("Nenhuma pergunta foi gerada")
            return jsonify({"erro": "Nenhuma pergunta foi gerada"}), 500

        pasta_anotacoes = "respostas"
        if not os.path.exists(pasta_anotacoes):
            os.makedirs(pasta_anotacoes)

        nome_arquivo = f"perguntas_{int(time.time())}.json"
        caminho_arquivo_perguntas = os.path.join(pasta_anotacoes, nome_arquivo)

        with open(caminho_arquivo_perguntas, "w", encoding="utf-8") as arquivo:
            json.dump(perguntas, arquivo, ensure_ascii=False, indent=4)

        return jsonify({"mensagem": f"Perguntas geradas e salvas em {caminho_arquivo_perguntas}"}), 200

    except Exception as e:
        logging.error(f"Erro ao gerar perguntas: {e}")
        return jsonify({"erro": str(e)}), 500
    
@transcricao_bp.route('/avaliar-resposta', methods=['POST'])
def avaliar_resposta():
    try:
       try:
        data = request.json
        resposta_usuario = data.get('resposta')
        texto_referencia = data.get('texto_referencia')

        if not texto_referencia:
            raise ValueError("'texto_referencia' está faltando")

  
        # Configuração da API
        genai.configure(api_key="AIzaSyDocQvT1c2mJ5Jf_wMfVwDFLwvsv6QYezc")

        evaluation_config = {
            "temperature": 0.7,
            "top_p": 0.9,
            "top_k": 50,
            "max_output_tokens": 4096,
            "response_mime_type": "text/plain",
        }

        model = genai.GenerativeModel(
            model_name="gemini-1.5-pro",
            generation_config=evaluation_config,
        )

        prompt = TEMPLATE_AGENT_AVALIADOR.format(resposta=resposta_usuario)
        logging.debug(f"Prompt enviado para o modelo: {prompt}")

        chat_session = model.start_chat(history=[])
        response = chat_session.send_message(prompt)

        logging.debug(f"Resposta do modelo: {response}")

        if not response.candidates or not response.candidates[0].content:
            logging.error("Resposta do modelo está vazia ou malformada.")
            return jsonify({"erro": "Resposta do modelo está vazia ou malformada."}), 500

        try:
            avaliacao = json.loads(response.candidates[0].content)
            if 'texto_referencia' not in avaliacao:
                logging.error("Chave 'texto_referencia' ausente na resposta do modelo.")
                return jsonify({"erro": "Chave 'texto_referencia' ausente na resposta do modelo."}), 500
        except json.JSONDecodeError as e:
            logging.error(f"Erro ao decodificar JSON: {e}")
            return jsonify({"erro": "Erro ao processar a resposta do modelo."}), 500

        nota = avaliacao.get('nota', 0)
        feedback = avaliacao.get('feedback', "Nenhum feedback disponível")

        if nota is None or feedback is None:
            logging.error("Avaliador não retornou nota ou feedback adequados")
            return jsonify({"erro": "Avaliador não retornou nota ou feedback adequados"}), 500

        logging.info(f"Nota: {nota}%, Feedback: {feedback}")
        
         nota = calcular_nota(resposta_usuario, texto_referencia)
        feedback = gerar_feedback(resposta_usuario, texto_referencia)

        return jsonify({'nota': nota, 'feedback': feedback})

        return jsonify({
            "nota": nota,
            "feedback": feedback
        }), 200

    except Exception as e:
        logging.error(f"Erro ao avaliar resposta: {e}")
        return jsonify({"erro": str(e)}), 500






@transcricao_bp.route('/listar-perguntas', methods=['GET'])
def listar_perguntas():
    try:
        pasta_anotacoes = "respostas"
        arquivos = [f for f in os.listdir(pasta_anotacoes) if f.startswith('perguntas_') and f.endswith('.json')]
        
        if not arquivos:
            return jsonify([]), 200

        # Carregar o arquivo mais recente
        arquivos.sort(reverse=True)
        caminho_arquivo_perguntas = os.path.join(pasta_anotacoes, arquivos[0])

        with open(caminho_arquivo_perguntas, "r", encoding="utf-8") as arquivo:
            perguntas = json.load(arquivo)

        return jsonify(perguntas), 200

    except Exception as e:
        logging.error(f"Erro ao listar perguntas: {e}")
        return jsonify({"erro": str(e)}), 500