import {
  listarConsultas,
  buscarConsultaPorId,
  criarConsulta,
  atualizarConsulta,
  deletarConsulta,
} from '../models/consultaModel.js';

export async function getConsultas(req, res, next) {
  try {
    const consultas = await listarConsultas();
    return res.status(200).json(consultas);
  } catch (error) {
    next(error);
  }
}

export async function getConsultaPorId(req, res, next) {
  try {
    const { id } = req.params;

    const consulta = await buscarConsultaPorId(id);

    if (!consulta) {
      return res.status(404).json({ mensagem: 'Consulta não encontrada.' });
    }

    return res.status(200).json(consulta);
  } catch (error) {
    next(error);
  }
}

export async function postConsulta(req, res, next) {
  try {
    const { paciente_id, medico_id, data_consulta, descricao, status, observacao_status } = req.body;

    if (!paciente_id || !medico_id || !data_consulta) {
      return res.status(400).json({
        mensagem: 'Os campos paciente_id, medico_id e data_consulta são obrigatórios.',
      });
    }

    const novaConsulta = await criarConsulta(
      paciente_id,
      medico_id,
      data_consulta,
      descricao,
      status,
      observacao_status
    );

    return res.status(201).json({
      mensagem: 'Consulta cadastrada com sucesso.',
      consulta: novaConsulta,
    });
  } catch (error) {
    next(error);
  }
}

export async function putConsulta(req, res, next) {
  try {
    const { id } = req.params;
    const { paciente_id, medico_id, data_consulta, descricao, status, observacao_status } = req.body;

    if (!paciente_id || !medico_id || !data_consulta) {
      return res.status(400).json({
        mensagem: 'Os campos paciente_id, medico_id e data_consulta são obrigatórios.',
      });
    }

    const consultaAtualizada = await atualizarConsulta(
      id,
      paciente_id,
      medico_id,
      data_consulta,
      descricao,
      status,
      observacao_status
    );

    if (!consultaAtualizada) {
      return res.status(404).json({ mensagem: 'Consulta não encontrada.' });
    }

    return res.status(200).json({
      mensagem: 'Consulta atualizada com sucesso.',
      consulta: consultaAtualizada,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteConsulta(req, res, next) {
  try {
    const { id } = req.params;

    const removida = await deletarConsulta(id);

    if (!removida) {
      return res.status(404).json({ mensagem: 'Consulta não encontrada.' });
    }

    return res.status(200).json({
      mensagem: 'Consulta excluída com sucesso.',
    });
  } catch (error) {
    next(error);
  }
}