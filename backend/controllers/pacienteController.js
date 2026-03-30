import {
  listarPacientes,
  buscarPacientePorId,
  criarPaciente,
  atualizarPaciente,
  deletarPaciente
} from '../models/pacienteModel.js';

export async function getPacientes(req, res, next) {
  try {
    const pacientes = await listarPacientes();
    res.status(200).json(pacientes);
  } catch (error) {
    next(error);
  }
}

export async function getPacientePorId(req, res, next) {
  try {
    const { id } = req.params;
    const paciente = await buscarPacientePorId(id);

    if (!paciente) {
      return res.status(404).json({ mensagem: 'Paciente não encontrado' });
    }

    res.status(200).json(paciente);
  } catch (error) {
    next(error);
  }
}

export async function postPaciente(req, res, next) {
  try {
    const { nome, idade, telefone, cpf, email } = req.body;

    if (!nome || idade === undefined || !telefone || !email) {
      return res.status(400).json({
        mensagem: 'Nome, idade, telefone e email são obrigatórios'
      });
    }

    const novoPaciente = await criarPaciente(nome, idade, telefone, cpf, email);
    res.status(201).json(novoPaciente);
  } catch (error) {
    next(error);
  }
}

export async function putPaciente(req, res, next) {
  try {
    const { id } = req.params;
    const { nome, idade, telefone, cpf, email } = req.body;

    if (!nome || idade === undefined || !telefone || !email) {
      return res.status(400).json({
        mensagem: 'Nome, idade, telefone e email são obrigatórios'
      });
    }

    const afetados = await atualizarPaciente(id, nome, idade, telefone, cpf, email);

    if (afetados === 0) {
      return res.status(404).json({ mensagem: 'Paciente não encontrado' });
    }

    const pacienteAtualizado = await buscarPacientePorId(id);
    res.status(200).json(pacienteAtualizado);
  } catch (error) {
    next(error);
  }
}

export async function deletePaciente(req, res, next) {
  try {
    const { id } = req.params;

    const afetados = await deletarPaciente(id);

    if (afetados === 0) {
      return res.status(404).json({ mensagem: 'Paciente não encontrado' });
    }

    res.status(200).json({
      mensagem: 'Paciente excluído com sucesso. Consultas vinculadas foram removidas automaticamente.'
    });
  } catch (error) {
    next(error);
  }
}