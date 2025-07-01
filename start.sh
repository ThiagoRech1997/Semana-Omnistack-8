#!/bin/bash

# Script de inicialização do Tindev com Docker

set -e

echo "🚀 Iniciando Tindev com Docker..."

# Verificar se o Docker está rodando
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker não está rodando. Por favor, inicie o Docker primeiro."
    exit 1
fi

# Verificar se o Docker Compose está disponível
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose não está instalado."
    exit 1
fi

# Função para mostrar ajuda
show_help() {
    echo "Uso: ./start.sh [opção]"
    echo ""
    echo "Opções:"
    echo "  dev     - Iniciar em modo desenvolvimento"
    echo "  prod    - Iniciar em modo produção"
    echo "  stop    - Parar todos os containers"
    echo "  clean   - Parar e remover containers, volumes e imagens"
    echo "  logs    - Mostrar logs dos containers"
    echo "  help    - Mostrar esta ajuda"
    echo ""
    echo "Exemplo:"
    echo "  ./start.sh dev"
}

# Função para desenvolvimento
start_dev() {
    echo "🔧 Iniciando em modo desenvolvimento..."
    docker-compose -f docker-compose.dev.yml up --build -d
    echo "✅ Serviços iniciados!"
    echo ""
    echo "📱 Frontend: http://localhost:3000"
    echo "🔧 Backend:  http://localhost:3050"
    echo "🗄️  MongoDB:  localhost:27017"
    echo ""
    echo "📋 Para ver os logs: ./start.sh logs"
    echo "🛑 Para parar: ./start.sh stop"
}

# Função para produção
start_prod() {
    echo "🚀 Iniciando em modo produção..."
    docker-compose up --build -d
    echo "✅ Serviços iniciados!"
    echo ""
    echo "🌐 Frontend: http://localhost:80"
    echo "🔧 Backend:  http://localhost:3050"
    echo "🗄️  MongoDB:  localhost:27017"
    echo ""
    echo "📋 Para ver os logs: ./start.sh logs"
    echo "🛑 Para parar: ./start.sh stop"
}

# Função para parar
stop_services() {
    echo "🛑 Parando serviços..."
    docker-compose down
    docker-compose -f docker-compose.dev.yml down
    echo "✅ Serviços parados!"
}

# Função para limpar
clean_all() {
    echo "🧹 Limpando tudo..."
    docker-compose down -v --rmi all
    docker-compose -f docker-compose.dev.yml down -v --rmi all
    docker system prune -f
    echo "✅ Limpeza concluída!"
}

# Função para logs
show_logs() {
    echo "📋 Mostrando logs..."
    docker-compose logs -f
}

# Processar argumentos
case "${1:-help}" in
    "dev")
        start_dev
        ;;
    "prod")
        start_prod
        ;;
    "stop")
        stop_services
        ;;
    "clean")
        clean_all
        ;;
    "logs")
        show_logs
        ;;
    "help"|*)
        show_help
        ;;
esac 