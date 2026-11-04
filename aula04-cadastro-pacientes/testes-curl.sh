#!/bin/bash
# Homologação da API da Clínica com cURL
# Uso: bash testes-curl.sh

API="https://api-clinica-luizsantiago.onrender.com/pacientes"

echo "=================================================="
echo "1. GET /pacientes (esperado: 200 OK)"
echo "=================================================="
curl -i -X GET "$API"
echo -e "\n"

echo "=================================================="
echo "2. POST /pacientes (esperado: 201 Created)"
echo "=================================================="
RESPOSTA=$(curl -i -s -X POST "$API" \
  -H "Content-Type: application/json" \
  -d '{"nome":"Paciente Teste CLI","email":"teste.cli@email.com","nascimento":"1998-05-20"}')
echo "$RESPOSTA"
echo -e "\n"

# Extrai o id do JSON retornado
ID=$(echo "$RESPOSTA" | grep -o '"id":[0-9]*' | head -1 | cut -d: -f2)
echo ">>> ID gerado: $ID"
echo -e "\n"

if [ -z "$ID" ]; then
  echo "Nao foi possivel obter o ID. Se o status foi 409, o e-mail ja existe: rode o DELETE manualmente."
  exit 1
fi

echo "=================================================="
echo "3. GET /pacientes/$ID (esperado: 200 OK)"
echo "=================================================="
curl -i -X GET "$API/$ID"
echo -e "\n"

echo "=================================================="
echo "4. PUT /pacientes/$ID (esperado: 200 OK)"
echo "=================================================="
curl -i -X PUT "$API/$ID" \
  -H "Content-Type: application/json" \
  -d '{"nome":"Paciente Atualizado CLI","email":"teste.cli@email.com","nascimento":"1998-05-20"}'
echo -e "\n"

echo "=================================================="
echo "5. DELETE /pacientes/$ID (esperado: 204 No Content)"
echo "=================================================="
curl -i -X DELETE "$API/$ID"
echo -e "\n"
