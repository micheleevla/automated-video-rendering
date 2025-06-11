# automated-video-rendering
Automação para renderização em lote no After Effects usando dados de uma planilha do Google Sheets. Gera composições personalizadas e envia para o Media Encoder com nomes de arquivos baseados no conteúdo da planilha.

# Renderização Automática com After Effects + Google Sheets

Este projeto automatiza a criação e renderização de vídeos personalizados no After Effects com base em dados vindos de uma planilha do Google Sheets.

## ✨ Funcionalidades

- Conecta a uma planilha do Google via API.
- Lê abas e células com marcação de status (ex: "ok" ou "pacote").
- Gera um arquivo JSON com nomes e destinos dos vídeos.
- Cria automaticamente pastas com os nomes das abas da planilha.
- Salva cada vídeo renderizado na pasta correspondente à sua aba.
- Usa um script no After Effects para:
  - Duplicar composições.
  - Alterar dinamicamente o texto.
  - Enviar cada vídeo para renderização no Media Encoder.

## 🛠 Tecnologias e Ferramentas

- Python 3.13
- gspread + oauth2client (acesso ao Google Sheets)
- PyInstaller (geração de executável)
- Adobe After Effects
- Adobe Media Encoder
- ExtendScript (.jsx)

## 📁 Estrutura
AUTOMACAO/
├── leitor_planilha.py # Script Python para gerar JSON
├── automation_data.json # Arquivo gerado com dados de vídeos
├── render_script.jsx # Script para After Effects
├── PACOTES DE VIDEO/
│ └── Videos_Renderizados/
│ ├── Aba 1/
│ ├── Aba 2/
│ └── ... # Pastas com os nomes das abas
├── credentials.json # (Ignorado no repositório)

## 🚫 O que não está no repositório

- `credentials.json`: arquivo da conta de serviço (não deve ser exposto)
- Dados reais do cliente (planilhas ou vídeos)
- Vídeos renderizados

## ⚙️ Como usar

1. Clone o repositório.
2. Crie um `credentials.json` com uma conta de serviço do Google.
3. Compartilhe a planilha com o e-mail da conta de serviço.
4. Execute o script Python:
   ```bash
   python leitor_de_video.py
5. No After Effects, execute o script render_script.jsx com uma composição base selecionada.
6. Os vídeos serão enviados para o Media Encoder e renderizados automaticamente.

🧠 Autora
Desenvolvido por Michele Barbosa Alves 
Projeto com foco em automação criativa e integração de APIs.
