import {
  listarPacientes,
  buscarPacientePorId,
  criarPaciente,
  atualizarPaciente,
  deletarPaciente
} from '../models/pacienteModel.js';

export async function getPacientes(req, res) {
  try {
    const pacientes = await listarPacientes();
    res.status(200).json(pacientes);
  } catch (error) {
    console.error('Erro ao listar pacientes:', error);
    res.status(500).json({ erro: 'Erro ao listar pacientes' });
  }
}

export async function getPacientePorId(req, res) {
  try {
    const { id } = req.params;
    const paciente = await buscarPacientePorId(id);

    if (!paciente) {
      return res.status(404).json({ erro: 'Paciente não encontrado' });
    }

    res.status(200).json(paciente);
  } catch (error) {
    console.error('Erro ao buscar paciente:', error);
    res.status(500).json({ erro: 'Erro ao buscar paciente' });
  }
}

export async function postPaciente(req, res) {
  try {
    const { nome, idade, telefone } = req.body;

    if (!nome || idade === undefined || !telefone) {
      return res.status(400).json({ erro: 'Nome, idade e telefone são obrigatórios' });
    }

    const novoPaciente = await criarPaciente(nome, idade, telefone);
    res.status(201).json(novoPaciente);
  } catch (error) {
    console.error('Erro ao cadastrar paciente:', error);
    res.status(500).json({ erro: 'Erro ao cadastrar paciente' });
  }
}

export async function putPaciente(req, res) {
  try {
    const { id } = req.params;
    const { nome, idade, telefone } = req.body;

    if (!nome || idade === undefined || !telefone) {
      return res.status(400).json({ erro: 'Nome, idade e telefone são obrigatórios' });
    }

    const afetados = await atualizarPaciente(id, nome, idade, telefone);

    if (afetados === 0) {
      return res.status(404).json({ erro: 'Paciente não encontrado' });
    }

    const pacienteAtualizado = await buscarPacientePorId(id);
    res.status(200).json(pacienteAtualizado);
  } catch (error) {
    console.error('Erro ao atualizar paciente:', error);
    res.status(500).json({ erro: 'Erro ao atualizar paciente' });
  }
}

export async function deletePaciente(req, res) {
  try {
    const { id } = req.params;

    const afetados = await deletarPaciente(id);

    if (afetados === 0) {
      return res.status(404).json({ erro: 'Paciente não encontrado' });
    }

    res.status(200).json({ mensagem: 'Paciente excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir paciente:', error);

    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
      return res.status(400).json({
        erro: 'Não é possível excluir este paciente porque ele possui consultas vinculadas'
      });
    }

    res.status(500).json({ erro: 'Erro ao excluir paciente' });
  }
}