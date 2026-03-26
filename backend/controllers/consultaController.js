import {
  listarConsultas,
  buscarConsultaPorId,
  criarConsulta,
  atualizarConsulta,
  deletarConsulta
} from '../models/consultaModel.js';

export async function getConsultas(req, res) {
  try {
    const consultas = await listarConsultas();
    res.status(200).json(consultas);
  } catch (error) {
    console.error('Erro ao listar consultas:', error);
    res.status(500).json({ erro: 'Erro ao listar consultas' });
  }
}

export async function getConsultaPorId(req, res) {
  try {
    const { id } = req.params;
    const consulta = await buscarConsultaPorId(id);

    if (!consulta) {
      return res.status(404).json({ erro: 'Consulta não encontrada' });
    }

    res.status(200).json(consulta);
  } catch (error) {
    console.error('Erro ao buscar consulta:', error);
    res.status(500).json({ erro: 'Erro ao buscar consulta' });
  }
}

export async function postConsulta(req, res) {
  try {
    const { paciente_id, medico_id, data_consulta, descricao } = req.body;

    if (!paciente_id || !medico_id || !data_consulta || descricao === undefined) {
      return res.status(400).json({
        erro: 'Paciente, médico, data da consulta e descrição são obrigatórios'
      });
    }

    const novaConsulta = await criarConsulta(
      paciente_id,
      medico_id,
      data_consulta,
      descricao
    );

    res.status(201).json(novaConsulta);
  } catch (error) {
    console.error('Erro ao cadastrar consulta:', error);
    res.status(500).json({ erro: 'Erro ao cadastrar consulta' });
  }
}

export async function putConsulta(req, res) {
  try {
    const { id } = req.params;
    const { paciente_id, medico_id, data_consulta, descricao } = req.body;

    if (!paciente_id || !medico_id || !data_consulta || descricao === undefined) {
      return res.status(400).json({
        erro: 'Paciente, médico, data da consulta e descrição são obrigatórios'
      });
    }

    const afetados = await atualizarConsulta(
      id,
      paciente_id,
      medico_id,
      data_consulta,
      descricao
    );

    if (afetados === 0) {
      return res.status(404).json({ erro: 'Consulta não encontrada' });
    }

    const consultaAtualizada = await buscarConsultaPorId(id);
    res.status(200).json(consultaAtualizada);
  } catch (error) {
    console.error('Erro ao atualizar consulta:', error);
    res.status(500).json({ erro: 'Erro ao atualizar consulta' });
  }
}

export async function deleteConsulta(req, res) {
  try {
    const { id } = req.params;

    const afetados = await deletarConsulta(id);

    if (afetados === 0) {
      return res.status(404).json({ erro: 'Consulta não encontrada' });
    }

    res.status(200).json({ mensagem: 'Consulta excluída com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir consulta:', error);
    res.status(500).json({ erro: 'Erro ao excluir consulta' });
  }
}