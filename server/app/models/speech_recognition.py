import os
from werkzeug.utils import secure_filename
from app.agents.agentCorrecao import correct_text
from app.utils.helpers import arquivo_permitido



class Transcricao:

    @staticmethod
    def salvar_arquivo(arquivo, pasta_upload):
        if not arquivo_permitido(arquivo.filename):
            raise ValueError("Tipo de arquivo não permitido")

        nome_arquivo = secure_filename(arquivo.filename)
        caminho_arquivo = os.path.join(pasta_upload, nome_arquivo)
        arquivo.save(caminho_arquivo)
        return caminho_arquivo

    @staticmethod
    def ler_conteudo_arquivo(caminho_arquivo):
        with open(caminho_arquivo, 'r', encoding='utf-8') as f:
            conteudo = f.read()
        return conteudo

    @staticmethod
    def processar_documento(conteudo):
        return correct_text(conteudo)

    @staticmethod
    def salvar_documento_corrigido(documento, caminho_arquivo):
        try:
            documento.save(caminho_arquivo)
        except Exception as e:
            raise ValueError(f"Falha ao salvar o documento corrigido: {str(e)}")

    @staticmethod
    def listar_arquivos(pasta_upload):
        return os.listdir(pasta_upload)

    @staticmethod
    def ler_transcricao(caminho_arquivo):
        with open(caminho_arquivo, 'r', encoding='utf-8') as file:
            return file.read()

    @staticmethod
    def salvar_transcricao_editada(caminho_arquivo, conteudo):
        with open(caminho_arquivo, 'w', encoding='utf-8') as file:
            file.write(conteudo)

    @staticmethod
    def renomear_arquivo(antigo_caminho_arquivo, novo_caminho_arquivo):
        os.rename(antigo_caminho_arquivo, novo_caminho_arquivo)

    @staticmethod
    def excluir_arquivo(caminho_arquivo):
        os.remove(caminho_arquivo)
