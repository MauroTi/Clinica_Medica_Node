import express from 'express';
import {
  getConsultas,
  getConsultaPorId,
  postConsulta,
  putConsulta,
  deleteConsulta
} from '../controllers/consultaController.js';

const router = express.Router();

router.get('/', getConsultas);
router.get('/:id', getConsultaPorId);
router.post('/', postConsulta);
router.put('/:id', putConsulta);
router.delete('/:id', deleteConsulta);

export default router;