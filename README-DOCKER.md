# 🐳 Tindev com Docker

## 🚀 Início Rápido

### 1. Desenvolvimento
```bash
./start.sh dev
```
- Frontend: http://localhost:3000
- Backend: http://localhost:3050
- MongoDB: localhost:27017

### 2. Produção
```bash
./start.sh prod
```
- Frontend: http://localhost:80
- Backend: http://localhost:3050
- MongoDB: localhost:27017

### 3. Parar serviços
```bash
./start.sh stop
```

## 📁 Arquivos Criados

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
│   ├── nginx.conf             # Configuração Nginx
│   └── .dockerignore
├── mongo-init.js              # Inicialização MongoDB
├── start.sh                   # Script de controle
└── DOCKER.md                  # Documentação completa
```

## 🔧 Serviços Incluídos

### Desenvolvimento
- **MongoDB**: Banco de dados local
- **Backend**: Node.js com hot reload
- **Frontend**: React com hot reload

### Produção
- **MongoDB**: Banco de dados persistente
- **Backend**: Node.js otimizado
- **Frontend**: React + Nginx
- **Redis**: Cache (opcional)

## 🔒 Segurança

- ✅ Credenciais em variáveis de ambiente
- ✅ Usuário não-root nos containers
- ✅ Health checks configurados
- ✅ Rate limiting ativo
- ✅ CORS configurado
- ✅ Headers de segurança

## 📊 Comandos Úteis

```bash
# Ver logs
./start.sh logs

# Limpar tudo
./start.sh clean

# Ver status
docker-compose ps

# Rebuild
docker-compose build --no-cache
```

## 🌐 URLs

| Ambiente | Frontend | Backend | MongoDB |
|----------|----------|---------|---------|
| Dev      | :3000    | :3050   | :27017  |
| Prod     | :80      | :3050   | :27017  |

## ⚠️ Importante

1. **Configure as variáveis de ambiente** antes de usar em produção
2. **Altere as senhas padrão** do MongoDB
3. **Use HTTPS** em produção
4. **Configure backups** do banco de dados

## 📞 Suporte

- Ver documentação completa: `DOCKER.md`
- Ver logs: `./start.sh logs`
- Verificar status: `docker-compose ps` 