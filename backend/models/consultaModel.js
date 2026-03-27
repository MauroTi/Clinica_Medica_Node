import db from '../../config/db.js';

export async function listarConsultas() {
  const [rows] = await db.execute(`
    SELECT 
      c.id,
      c.paciente_id,
      c.medico_id,
      c.data_consulta,
      c.descricao,
      p.nome AS paciente_nome,
      m.nome AS medico_nome
    FROM consultas c
    INNER JOIN pacientes p ON c.paciente_id = p.id
    INNER JOIN medicos m ON c.medico_id = m.id
    ORDER BY c.data_consulta DESC, c.id DESC
  `);

  return rows;
}

export async function buscarConsultaPorId(id) {
  const [rows] = await db.execute(`
    SELECT 
      c.id,
      c.paciente_id,
      c.medico_id,
      c.data_consulta,
      c.descricao,
      p.nome AS paciente_nome,
      m.nome AS medico_nome
    FROM consultas c
    INNER JOIN pacientes p ON c.paciente_id = p.id
    INNER JOIN medicos m ON c.medico_id = m.id
    WHERE c.id = ?
  `, [id]);

  return rows[0] || null;
}

export async function criarConsulta(paciente_id, medico_id, data_consulta, descricao) {
  const [result] = await db.execute(
    'INSERT INTO consultas (paciente_id, medico_id, data_consulta, descricao) VALUES (?, ?, ?, ?)',
    [paciente_id, medico_id, data_consulta, descricao ?? null]
  );

  return buscarConsultaPorId(result.insertId);
}

export async function atualizarConsulta(id, paciente_id, medico_id, data_consulta, descricao) {
  const [result] = await db.execute(
    'UPDATE consultas SET paciente_id = ?, medico_id = ?, data_consulta = ?, descricao = ? WHERE id = ?',
    [paciente_id, medico_id, data_consulta, descricao ?? null, id]
  );

  if (result.affectedRows === 0) {
    return null;
  }

  return buscarConsultaPorId(id);
}

export async function deletarConsulta(id) {
  const [result] = await db.execute(
    'DELETE FROM consultas WHERE id = ?',
    [id]
  );

  return result.affectedRows > 0;
}