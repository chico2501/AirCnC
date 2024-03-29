const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const socketio = require('socket.io');
const http = require('http');


const routes = require('./routes');

const app = express();
const server = http.Server(app);
const io = socketio(server);

const connectedUsers = {};



mongoose.connect('mongodb+srv://chico2501:chico159@cluster0-oetyo.mongodb.net/omnistack9?retryWrites=true&w=majority',{
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

io.on('connection', socket => {

  const  { user_id } = socket.handshake.query;
  connectedUsers[user_id] = socket.id;
})

app.use((req, res, next) => {
  req.io = io;
  req.connectedUsers = connectedUsers;

  return next();
})

// GET, POST, PUT, DELETE

// req.query = Acessar query paramns (para filtros)
// req.params = Acessar route params (para edição e delete)
// req.body = Acessar corpo da requisição (para criação, edição)

app.use(cors());
app.use(express.json());
app.use('/files', express.static(path.resolve(__dirname, '..', 'uploads')));
app.use(routes);


server.listen(3333);