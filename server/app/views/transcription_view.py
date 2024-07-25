from flask import jsonify, request, current_app
import os
import logging
import string
import nltk
nltk.download('punkt')
nltk.download('stopwords')
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import PorterStemmer
from app.models.speech_recognition import Transcricao
from app.agents.agentCorrecao import correct_text

class TranscricaoView:
    @staticmethod
    def processar_texto(conteudo):
        tokens = word_tokenize(conteudo.lower())
        stop_words = set(stopwords.words('portuguese') + list(string.punctuation))
        tokens_filtrados = [palavra for palavra in tokens if palavra not in stop_words]
        stemmer = PorterStemmer()
        tokens_stemmizados = [stemmer.stem(palavra) for palavra in tokens_filtrados]
        conteudo_processado = ' '.join(tokens_stemmizados)
        return conteudo_processado

    @staticmethod
    def salvar_transcricao(arquivo):
        try:
            caminho_arquivo = Transcricao.salvar_arquivo(arquivo, current_app.config['UPLOAD_FOLDER'])
            logging.info(f"Arquivo salvo em {caminho_arquivo}")

            conteudo = Transcricao.ler_conteudo_arquivo(caminho_arquivo)
            logging.info("Conteúdo do arquivo lido com sucesso")

            # Processamento do documento usando o agente de processamento de texto
            conteudo_processado = TranscricaoView.processar_texto(conteudo)

            caminho_arquivo_corrigido = os.path.join(current_app.config['UPLOAD_FOLDER'], f"corrigido_{os.path.basename(caminho_arquivo)}")
            Transcricao.salvar_transcricao_editada(caminho_arquivo_corrigido, conteudo_processado)
            logging.info(f"Arquivo corrigido salvo em {caminho_arquivo_corrigido}")

            return jsonify({"mensagem": f"Arquivo salvo como {os.path.basename(caminho_arquivo)}", "arquivo_corrigido": f"corrigido_{os.path.basename(caminho_arquivo)}"}), 200

        except ValueError as e:
            logging.error(str(e))
            return jsonify({"erro": str(e)}), 400
        except Exception as e:
            logging.error(f"Falha ao salvar o arquivo: {str(e)}")
            return jsonify({"erro": f"Falha ao salvar o arquivo: {str(e)}"}), 500

    @staticmethod
    def gerar_perguntas(conteudo):
        perguntas = correct_text(conteudo)
        return perguntas

    @staticmethod
    def listar_transcricoes():
        try:
            arquivos = Transcricao.listar_arquivos(current_app.config['UPLOAD_FOLDER'])
            return jsonify({"transcricoes": arquivos}), 200
        except Exception as e:
            return jsonify({"erro": str(e)}), 500

    @staticmethod
    def obter_transcricao(filename):
        try:
            caminho_arquivo = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
            if os.path.exists(caminho_arquivo):
                conteudo = Transcricao.ler_transcricao(caminho_arquivo)
                return jsonify({"filename": filename, "content": conteudo}), 200
            else:
                return jsonify({"erro": "Arquivo não encontrado"}), 404
        except Exception as e:
            return jsonify({"erro": str(e)}), 500

    @staticmethod
    def salvar_transcricao_editada(filename, conteudo):
        try:
            caminho_arquivo = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
            Transcricao.salvar_transcricao_editada(caminho_arquivo, conteudo)
            return jsonify({"mensagem": f"Arquivo {filename} editado com sucesso"}), 200
        except Exception as e:
            return jsonify({"erro": str(e)}), 500

    @staticmethod
    def renomear_transcricao(old_filename, new_filename):
        try:
            antigo_caminho_arquivo = os.path.join(current_app.config['UPLOAD_FOLDER'], old_filename)
            novo_caminho_arquivo = os.path.join(current_app.config['UPLOAD_FOLDER'], new_filename)
            Transcricao.renomear_arquivo(antigo_caminho_arquivo, novo_caminho_arquivo)
            return jsonify({"mensagem": f"Arquivo {old_filename} renomeado para {new_filename}"}), 200
        except Exception as e:
            return jsonify({"erro": str(e)}), 500

    @staticmethod
    def excluir_transcricao(filename):
        try:
            caminho_arquivo = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
            if os.path.exists(caminho_arquivo):
                Transcricao.excluir_arquivo(caminho_arquivo)
                return jsonify({"mensagem": f"Arquivo {filename} deletado"}), 200
            else:
                return jsonify({"erro": "Arquivo não encontrado"}), 404
        except Exception as e:
            return jsonify({"erro": str(e)}), 500

    @staticmethod
    def gerar_perguntas_do_arquivo(filename):
        try:
            caminho_arquivo = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
            if os.path.exists(caminho_arquivo):
                conteudo = Transcricao.ler_conteudo_arquivo(caminho_arquivo)
                perguntas = Transcricao.processar_documento(conteudo)
                return jsonify({"perguntas": perguntas}), 200
            else:
                return jsonify({"erro": "Arquivo não encontrado"}), 404
        except Exception as e:
            return jsonify({"erro": str(e)}), 500
