def arquivo_permitido(nome_arquivo):
    EXTENSOES_PERMITIDAS = {'txt'}
    return '.' in nome_arquivo and nome_arquivo.rsplit('.', 1)[1].lower() in EXTENSOES_PERMITIDAS
