import express from "express";
import cors from "cors";
import routes from './routes.js';
import errorHandler from './_middleware/error-handler.js';

// Importando configuração e estabelecimento da conexão com o banco de dados
import sequelize from './config/database-connection.js';

const app = express();

// Configuração CORS mais permissiva - libera para qualquer origem
app.use(cors({
  origin: "*", // Permite qualquer origem
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["*"],
  credentials: false
}));

app.use(express.json());
app.use(routes);
app.use(errorHandler); // Manipulador de erro global (error handler)

app.listen(3333, () => {
  console.log('Servidor rodando na porta 3333');
});