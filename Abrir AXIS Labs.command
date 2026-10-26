#!/bin/bash
# Atalho de um clique (macOS): sobe o Escritório AXIS Labs e abre o navegador.
# Dois cliques neste arquivo no Finder. Para desligar, feche a janela do Terminal.

cd "$(dirname "$0")" || exit 1

# garante que o Node seja encontrado mesmo quando aberto pelo Finder
export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"
[ -s "$HOME/.nvm/nvm.sh" ] && . "$HOME/.nvm/nvm.sh" >/dev/null 2>&1

URL="http://localhost:4321"

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js não foi encontrado."
  echo "Instale em https://nodejs.org (versão 18 ou mais nova) e tente de novo."
  echo ""
  echo "Pressione Enter para fechar."
  read -r _
  exit 1
fi

# já está no ar? só abre o navegador
if curl -s -o /dev/null "$URL" 2>/dev/null; then
  echo "O escritório já estava no ar. Abrindo o navegador..."
  open "$URL"
  exit 0
fi

echo "Subindo o Escritório AXIS Labs..."
echo ""
npm start &
PID=$!

# espera a porta responder (até ~30s)
for _ in $(seq 1 60); do
  curl -s -o /dev/null "$URL" 2>/dev/null && break
  sleep 0.5
done

open "$URL"
echo ""
echo "----------------------------------------------------"
echo "  Escritório no ar em $URL"
echo "  Feche esta janela (ou Ctrl+C) para desligar."
echo "----------------------------------------------------"
wait "$PID"
