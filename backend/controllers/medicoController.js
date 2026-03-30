import {
  listarMedicos,
  buscarMedicoPorId,
  criarMedico,
  atualizarMedico,
  deletarMedico,
} from '../models/medicoModel.js';

export async function getMedicos(req, res, next) {
  try {
    const medicos = await listarMedicos();
    return res.status(200).json(medicos);
  } catch (error) {
    next(error);
  }
}

export async function getMedicoPorId(req, res, next) {
  try {
    const { id } = req.params;

    const medico = await buscarMedicoPorId(id);

    if (!medico) {
      return res.status(404).json({ mensagem: 'Médico não encontrado.' });
    }

    return res.status(200).json(medico);
  } catch (error) {
    next(error);
  }
}

export async function postMedico(req, res, next) {
  try {
    const { nome, especialidade, crm, email, telefone } = req.body;

    if (!nome || !especialidade) {
      return res.status(400).json({
        mensagem: 'Os campos nome e especialidade são obrigatórios.',
      });
    }

    const novoMedico = await criarMedico(nome, especialidade, crm, email, telefone);

    return res.status(201).json({
      mensagem: 'Médico cadastrado com sucesso.',
      medico: novoMedico,
    });
  } catch (error) {
    next(error);
  }
}

export async function putMedico(req, res, next) {
  try {
    const { id } = req.params;
    const { nome, especialidade, crm, email, telefone } = req.body;

    if (!nome || !especialidade) {
      return res.status(400).json({
        mensagem: 'Os campos nome e especialidade são obrigatórios.',
      });
    }

    const medicoAtualizado = await atualizarMedico(id, nome, especialidade, crm, email, telefone);

    if (!medicoAtualizado) {
      return res.status(404).json({ mensagem: 'Médico não encontrado.' });
    }

    return res.status(200).json({
      mensagem: 'Médico atualizado com sucesso.',
      medico: medicoAtualizado,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteMedico(req, res, next) {
  try {
    const { id } = req.params;

    const removido = await deletarMedico(id);

    if (!removido) {
      return res.status(404).json({ mensagem: 'Médico não encontrado.' });
    }

    return res.status(200).json({
      mensagem: 'Médico excluído com sucesso.',
    });
  } catch (error) {
    next(error);
  }
}