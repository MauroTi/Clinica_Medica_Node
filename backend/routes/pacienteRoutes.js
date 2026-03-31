import express from "express";
import {
  getPacientes,
  getPacientePorId,
  postPaciente,
  putPaciente,
  deletePaciente,
} from "../controllers/pacienteController.js";

const router = express.Router();

router.get("/", getPacientes);
router.get("/:id", getPacientePorId);
router.post("/", postPaciente);
router.put("/:id", putPaciente);
router.delete("/:id", deletePaciente);

export default router;
