// Script de inicialização do MongoDB
db = db.getSiblingDB('tindev');

// Criar usuário para a aplicação
db.createUser({
  user: 'tindev_user',
  pwd: 'tindev_password',
  roles: [
    {
      role: 'readWrite',
      db: 'tindev'
    }
  ]
});

// Criar coleções iniciais
db.createCollection('devs');

// Criar índices para melhor performance
db.devs.createIndex({ "user": 1 }, { unique: true });
db.devs.createIndex({ "createdAt": -1 });

print('MongoDB inicializado com sucesso!');
print('Database: tindev');
print('Usuário: tindev_user'); 