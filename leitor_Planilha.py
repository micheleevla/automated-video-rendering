# -*- coding: utf-8 -*-
import os
import json
import re
import gspread
import sys
from oauth2client.service_account import ServiceAccountCredentials

def sanitize_filename(text):
        return re.sub(r'[\\/*?:"<>|]', "", text).strip()

# Configurações
scope = ['https://spreadsheets.google.com/feeds', 'https://www.googleapis.com/auth/drive']

def get_base_path():
    if getattr(sys, 'frozen', False):
        return os.path.dirname(sys.executable)  # Caminho do .exe
    return os.path.dirname(os.path.abspath(__file__))  # Caminho do .py

# Caminhos
base_path = get_base_path()
cred_path = os.path.join(base_path, 'credentials.json')
json_path = os.path.join(base_path, 'automation_data.json')
PASTA_VIDEOS = os.path.join(base_path, 'PACOTES DE VIDEO', 'Videos_Renderizados')

# Garante que a pasta de saída existe
os.makedirs(PASTA_VIDEOS, exist_ok=True)

# Autenticação
creds = ServiceAccountCredentials.from_json_keyfile_name(cred_path, scope)
client = gspread.authorize(creds)

# Nome da planilha no Google Drive
NOME_PLANILHA = 'INSIRA O NOME DA PLANILHA AQUI'

try:
    sheet = client.open(NOME_PLANILHA)
    abas = sheet.worksheets()
    dados = []

    for aba in abas:
        nome_aba = aba.title
        registros = aba.get_all_values()
        
        for i, linha in enumerate(registros[1:], start=2):  # Pula cabeçalho
            if len(linha) >= 4:
                status = linha[3].strip().lower()
                
                if status in ['ok', 'pacote']:
                    texto = linha[2].strip()
                    if not texto:
                        continue
                    
                    pasta_saida = os.path.join(PASTA_VIDEOS, nome_aba)
                    os.makedirs(pasta_saida, exist_ok=True)
                    
                    nome_arquivo = sanitize_filename(texto) + '.mp4'
                    caminho_completo = os.path.join(pasta_saida, nome_arquivo)
                    
                    dados.append({
                        'texto': texto,
                        'saida': caminho_completo.replace("\\", "/")
                    })

    # Salva os dados em JSON
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(dados, f, ensure_ascii=False, indent=4)

    print(f'✅ {len(dados)} vídeos processados. Dados salvos em automation_data.json')
    print('Pronto para executar o script no After Effects!')

except Exception as e:
    print(f'❌ Erro: {str(e)}')
