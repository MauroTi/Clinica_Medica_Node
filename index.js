import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import pacienteRoutes from './backend/routes/pacienteRoutes.js';
import medicoRoutes from './backend/routes/medicoRoutes.js';
import consultaRoutes from './backend/routes/consultaRoutes.js';

import notFoundMiddleware from './backend/middlewares/notFoundMiddleware.js';
import errorMiddleware from './backend/middlewares/errorMiddleware.js';

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

// MIDDLEWARES GLOBAIS
app.use(notFoundMiddleware);
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});