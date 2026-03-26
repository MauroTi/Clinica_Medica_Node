import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import pacienteRoutes from './backend/routes/pacienteRoutes.js';
import medicoRoutes from './backend/routes/medicoRoutes.js';
import consultaRoutes from './backend/routes/consultaRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Suporte ao __dirname em ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(bodyParser.json());

// SERVIR ARQUIVOS ESTÁTICOS DA PASTA FRONTEND
app.use(express.static(path.join(__dirname, 'frontend')));

// ROTAS DA API
app.use('/api/pacientes', pacienteRoutes);
app.use('/api/medicos', medicoRoutes);
app.use('/api/consultas', consultaRoutes);

// ROTA PRINCIPAL -> ABRE O HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

// Middleware para rota não encontrada (404)
app.use((req, res) => {
  res.status(404).json({
    mensagem: `Rota não encontrada: ${req.method} ${req.originalUrl}`
  });
});

// Middleware global de erro
function errorMiddleware(error, req, res, next) {
  console.error('❌ Erro capturado pelo middleware global:', error);

  const statusCode = error.statusCode || 500;

  res.status(statusCode).json({
    mensagem: error.message || 'Erro interno do servidor.'
  });
}

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});