require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const routes = require('./routes');
const Dev = require('./models/Dev'); // Importar o model Dev

const app = express();

// Configuração de Rate Limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutos
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limite de 100 requisições por janela
  message: 'Muitas requisições deste IP, tente novamente mais tarde.'
});

// Middlewares de Segurança
app.use(helmet());
app.use(limiter);

// Configuração do CORS
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',')
  : ['http://localhost:3000'];

const corsOptions = {
  origin: function (origin, callback) {
    // Permite requests sem origin (ex: mobile, curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

const server = require('http').Server(app);

const io = require('socket.io')(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true
  }
});

const connectedUsers = {};
io.on('connection', async socket => {
    const { user } = socket.handshake.query;

    // Validação: só aceita se o usuário existir no banco
    if (user && await Dev.findById(user)) {
        connectedUsers[user] = socket.id;
    } else {
        socket.disconnect(true); // desconecta o socket se o usuário não existir
    }
});

// Conexão com MongoDB usando variável de ambiente
const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://semana:semana@cluster0-1ckxc.mongodb.net/omnistack8?retryWrites=true&w=majority';
mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Conectado ao MongoDB');
}).catch(err => {
    console.error('Erro ao conectar ao MongoDB:', err);
});

app.use((req, res, next) => {
    req.io = io;
    req.connectedUsers = connectedUsers;

    return next();
});

app.use(express.json({ limit: '10mb' }));

app.use(routes);

const PORT = process.env.PORT || 3050;
server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});