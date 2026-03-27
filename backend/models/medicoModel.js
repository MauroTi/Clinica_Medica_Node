import db from '../../config/db.js';

export async function listarMedicos() {
  const [rows] = await db.execute(
    'SELECT id, nome, especialidade FROM medicos ORDER BY id DESC'
  );
  return rows;
}

export async function buscarMedicoPorId(id) {
  const [rows] = await db.execute(
    'SELECT id, nome, especialidade FROM medicos WHERE id = ?',
    [id]
  );
  return rows[0] || null;
}

export async function criarMedico(nome, especialidade) {
  const [result] = await db.execute(
    'INSERT INTO medicos (nome, especialidade) VALUES (?, ?)',
    [nome, especialidade]
  );

  return {
    id: result.insertId,
    nome,
    especialidade,
  };
}

export async function atualizarMedico(id, nome, especialidade) {
  const [result] = await db.execute(
    'UPDATE medicos SET nome = ?, especialidade = ? WHERE id = ?',
    [nome, especialidade, id]
  );

  if (result.affectedRows === 0) {
    return null;
  }

  return {
    id: Number(id),
    nome,
    especialidade,
  };
}

export async function deletarMedico(id) {
  const [result] = await db.execute(
    'DELETE FROM medicos WHERE id = ?',
    [id]
  );

  return result.affectedRows > 0;
}