# 🐳 Docker - Tindev

Este projeto está configurado para rodar completamente em containers Docker, incluindo desenvolvimento e produção.

## 📋 Pré-requisitos

- Docker (versão 20.10+)
- Docker Compose (versão 2.0+)

## 🚀 Início Rápido

### Desenvolvimento
```bash
./start.sh dev
```

### Produção
```bash
./start.sh prod
```

### Parar serviços
```bash
./start.sh stop
```

## 📁 Estrutura dos Arquivos Docker

```
├── docker-compose.yml          # Produção
├── docker-compose.dev.yml      # Desenvolvimento
├── backend/
│   ├── Dockerfile             # Produção
│   ├── Dockerfile.dev         # Desenvolvimento
│   └── .dockerignore
├── frontend/
│   ├── Dockerfile             # Produção
│   ├── Dockerfile.dev         # Desenvolvimento
│   └── .dockerignore
├── mongo-init.js              # Script de inicialização do MongoDB
└── start.sh                   # Script de inicialização
```

## 🔧 Serviços

### Produção
- **MongoDB**: Banco de dados principal
- **Backend**: API Node.js (porta 3050)
- **Frontend**: React com Nginx (porta 80)
- **Redis**: Cache (porta 6379)
- **Nginx**: Reverse proxy (porta 443/80) - opcional

### Desenvolvimento
- **MongoDB**: Banco de dados de desenvolvimento
- **Backend**: API com hot reload (porta 3050)
- **Frontend**: React com hot reload (porta 3000)

## 🌐 URLs de Acesso

### Desenvolvimento
- Frontend: http://localhost:3000
- Backend: http://localhost:3050
- MongoDB: localhost:27017

### Produção
- Frontend: http://localhost:80
- Backend: http://localhost:3050
- MongoDB: localhost:27017

## 🔒 Configurações de Segurança

### Variáveis de Ambiente
As seguintes variáveis são configuradas automaticamente:

```env
# Backend
NODE_ENV=production
MONGODB_URI=mongodb://admin:password123@mongodb:27017/tindev?authSource=admin
PORT=3050
JWT_SECRET=your-super-secret-jwt-key-change-in-production
CORS_ORIGIN=http://localhost:3000,http://localhost:80
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# MongoDB
MONGO_INITDB_ROOT_USERNAME=admin
MONGO_INITDB_ROOT_PASSWORD=password123
MONGO_INITDB_DATABASE=tindev
```

### 🔐 Configuração Segura para Produção

1. **Criar arquivo .env**:
```bash
cp backend/env.example backend/.env
```

2. **Editar variáveis sensíveis**:
```env
MONGODB_URI=sua_uri_real_do_mongodb
JWT_SECRET=chave_super_secreta_muito_longa_e_complexa
CORS_ORIGIN=https://seu-dominio.com
```

## 📊 Comandos Úteis

### Ver logs
```bash
# Todos os serviços
docker-compose logs -f

# Serviço específico
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongodb
```

### Acessar container
```bash
# Backend
docker exec -it tindev-backend sh

# Frontend
docker exec -it tindev-frontend sh

# MongoDB
docker exec -it tindev-mongodb mongosh
```

### Verificar status
```bash
docker-compose ps
```

### Rebuild específico
```bash
# Backend
docker-compose build backend

# Frontend
docker-compose build frontend

# Todos
docker-compose build --no-cache
```

## 🧹 Limpeza

### Parar e remover containers
```bash
./start.sh clean
```

### Remover volumes (⚠️ perde dados)
```bash
docker-compose down -v
```

### Limpar imagens não utilizadas
```bash
docker system prune -a
```

## 🔍 Troubleshooting

### Porta já em uso
```bash
# Verificar o que está usando a porta
sudo lsof -i :3050
sudo lsof -i :3000
sudo lsof -i :27017

# Parar processo
sudo kill -9 <PID>
```

### Problemas de permissão
```bash
# Corrigir permissões
sudo chown -R $USER:$USER .
chmod +x start.sh
```

### MongoDB não conecta
```bash
# Verificar logs
docker-compose logs mongodb

# Reiniciar MongoDB
docker-compose restart mongodb
```

### Build falha
```bash
# Limpar cache
docker system prune -f
docker-compose build --no-cache
```

## 📈 Monitoramento

### Health Checks
Todos os serviços têm health checks configurados:
- Backend: http://localhost:3050/devs
- Frontend: http://localhost:80/health
- MongoDB: ping interno

### Métricas
```bash
# Uso de recursos
docker stats

# Espaço em disco
docker system df
```

## 🚀 Deploy em Produção

### 1. Configurar variáveis de ambiente
```bash
# Editar docker-compose.yml com suas configurações
# ou usar arquivo .env
```

### 2. Configurar SSL (opcional)
```bash
# Criar diretório para certificados
mkdir -p nginx/ssl

# Adicionar certificados
cp seu-certificado.crt nginx/ssl/
cp sua-chave.key nginx/ssl/
```

### 3. Iniciar em produção
```bash
./start.sh prod
```

### 4. Configurar backup
```bash
# Backup do MongoDB
docker exec tindev-mongodb mongodump --out /backup

# Restaurar backup
docker exec -i tindev-mongodb mongorestore < backup.tar
```

## 📝 Logs e Debugging

### Logs estruturados
```bash
# Logs com timestamp
docker-compose logs -f --timestamps

# Logs de erro apenas
docker-compose logs -f --tail=100 | grep ERROR
```

### Debugging
```bash
# Acessar container em modo debug
docker run -it --rm node:18-alpine sh

# Verificar variáveis de ambiente
docker exec tindev-backend env
```

## 🔄 CI/CD

### GitHub Actions (exemplo)
```yaml
name: Deploy to Production
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy with Docker
        run: |
          ./start.sh prod
```

## 📞 Suporte

Para problemas relacionados ao Docker:
1. Verificar logs: `./start.sh logs`
2. Verificar status: `docker-compose ps`
3. Rebuild: `docker-compose build --no-cache`
4. Limpar tudo: `./start.sh clean` 