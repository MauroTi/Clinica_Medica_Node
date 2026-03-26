import db from '../config/db.js';

export async function listarConsultas() {
  const [rows] = await db.query(`
    SELECT 
      c.id,
      c.paciente_id,
      c.medico_id,
      c.data_consulta,
      c.descricao,
      p.nome AS paciente_nome,
      m.nome AS medico_nome
    FROM consultas c
    LEFT JOIN pacientes p ON c.paciente_id = p.id
    LEFT JOIN medicos m ON c.medico_id = m.id
    ORDER BY c.id DESC
  `);

  return rows;
}

export async function buscarConsultaPorId(id) {
  const [rows] = await db.query(
    'SELECT * FROM consultas WHERE id = ?',
    [id]
  );

  return rows[0];
}

export async function criarConsulta(paciente_id, medico_id, data_consulta, descricao) {
  const [result] = await db.query(
    'INSERT INTO consultas (paciente_id, medico_id, data_consulta, descricao) VALUES (?, ?, ?, ?)',
    [paciente_id, medico_id, data_consulta, descricao]
  );

  return {
    id: result.insertId,
    paciente_id,
    medico_id,
    data_consulta,
    descricao
  };
}

export async function atualizarConsulta(id, paciente_id, medico_id, data_consulta, descricao) {
  const [result] = await db.query(
    'UPDATE consultas SET paciente_id = ?, medico_id = ?, data_consulta = ?, descricao = ? WHERE id = ?',
    [paciente_id, medico_id, data_consulta, descricao, id]
  );

  return result.affectedRows;
}

export async function deletarConsulta(id) {
  const [result] = await db.query(
    'DELETE FROM consultas WHERE id = ?',
    [id]
  );

  return result.affectedRows;
}