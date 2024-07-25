TEMPLATE_AGENT_GERADOR = """
Você é um especialista em criação de provas. Sua missão é analisar o texto '{texto}' e criar 10 perguntas sobre o assunto. Para cada pergunta, forneça:

1. A pergunta.
2. A resposta esperada.
3. Uma explicação breve sobre a resposta.

Estruture as informações dentro de um array e no seguinte formato:

    {{
        "pergunta": "Pergunta 1",
        "resposta_esperada": "Resposta esperada 1",
        "explicacao": "Explicação breve 1"
    }},
    {{
        "pergunta": "Pergunta 2",
        "resposta_esperada": "Resposta esperada 2",
        "explicacao": "Explicação breve 2"
    }},
    ...
    {{
        "pergunta": "Pergunta 10",
        "resposta_esperada": "Resposta esperada 10",
        "explicacao": "Explicação breve 10"
    }}

Certifique-se de que cada pergunta, resposta e explicação sejam claras e relevantes ao conteúdo do texto fornecido.
"""



TEMPLATE_AGENT_CORRETOR = """
Você é um corretor de texto altamente capacitado em língua portuguesa.
Sua tarefa é revisar e corrigir o texto fornecido, focando em apenas em corrigir erros gramaticais,
ortográficos e de pontuação, além de melhorar a clareza e a coesão do texto mas sem expressar opnião nenhuma sobre o texto. 

Texto para revisão:
{texto}

Texto corrigido:
"""

TEMPLATE_TEXTO = """
Recuperação Aumentada com Geração (RAG)
Definição:
A Recuperação Aumentada com Geração (RAG) é uma abordagem híbrida que combina técnicas de recuperação de informações (IR) com modelos de geração de linguagem natural (NLG). Essa técnica visa melhorar a qualidade e a precisão das respostas fornecidas por sistemas de IA, especialmente em tarefas de question answering (QA) e assistência virtual.

Componentes Principais:

Recuperação de Documentos:

Retrieval Component: Primeiro, um módulo de recuperação de informações é usado para buscar documentos relevantes de uma base de dados ou um conjunto de documentos, com base na consulta do usuário.
Índices e Vetores: Utiliza índices invertidos, embeddings de texto e outras técnicas de IR para identificar os documentos mais relevantes.
Geração de Respostas:

Generation Component: Em seguida, um modelo de geração de linguagem, como o GPT (Generative Pre-trained Transformer), é usado para gerar respostas baseadas nos documentos recuperados.
Contexto: O modelo utiliza o contexto fornecido pelos documentos recuperados para gerar respostas mais precisas e contextualmente relevantes.
Fluxo de Trabalho:

Consulta do Usuário: O usuário faz uma pergunta ou consulta.
Recuperação: O sistema de IR busca documentos relevantes que podem conter a resposta.
Geração: Os documentos recuperados são passados para o modelo de geração, que cria uma resposta combinando as informações dos documentos com suas capacidades de geração de linguagem.
Resposta: A resposta gerada é retornada ao usuário.
Vantagens:

Precisão Melhorada: Combina o poder de busca de documentos relevantes com a capacidade de geração de texto contextualizado.
Flexibilidade: Pode ser aplicado a uma ampla gama de tarefas, desde QA até criação de conteúdo assistido por IA.
Escalabilidade: Pode lidar com grandes volumes de dados e consultas complexas.
Aplicações:

Assistentes Virtuais: Melhora a capacidade dos assistentes virtuais de responder a perguntas complexas e fornecer informações detalhadas.
Educação: Utilizado para criar materiais de estudo personalizados e responder a perguntas dos alunos com base em grandes conjuntos de dados educacionais.
Suporte ao Cliente: Auxilia na resolução de consultas de clientes de forma rápida e precisa, acessando bases de conhecimento e gerando respostas relevantes.
Desafios:

Qualidade dos Dados: A eficácia do RAG depende da qualidade e relevância dos dados nos documentos recuperados.
Desempenho Computacional: Modelos de geração de linguagem podem ser computacionalmente intensivos, exigindo recursos significativos para treinamento e inferência.
Integração: A integração eficaz dos componentes de recuperação e geração é crucial para o desempenho do sistema.
Exemplos de Ferramentas e Modelos:

OpenAI GPT-3/4: Utilizado para geração de linguagem.
Elasticsearch: Comumente usado para recuperação de informações.
Transformers (Hugging Face): Biblioteca popular que inclui modelos e ferramentas para NLG e IR.
Conclusão:
A Recuperação Aumentada com Geração representa um avanço significativo na forma como os sistemas de IA interagem com grandes conjuntos de dados para fornecer respostas detalhadas e precisas. Ao combinar a recuperação eficiente de documentos com a geração contextualizada de respostas, o RAG oferece um potencial vasto para melhorar a interação homem-máquina em diversas aplicações.





"""

