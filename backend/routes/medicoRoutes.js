import express from "express";
import {
  getMedicos,
  getMedicoPorId,
  postMedico,
  putMedico,
  deleteMedico,
} from "../controllers/medicoController.js";

const router = express.Router();

router.get("/", getMedicos);
router.get("/:id", getMedicoPorId);
router.post("/", postMedico);
router.put("/:id", putMedico);
router.delete("/:id", deleteMedico);

export default router;
