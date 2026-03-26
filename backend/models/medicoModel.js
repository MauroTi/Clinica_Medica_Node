import db from '../config/db.js';

export async function listarMedicos() {
  const [rows] = await db.query('SELECT * FROM medicos ORDER BY id DESC');
  return rows;
}

export async function buscarMedicoPorId(id) {
  const [rows] = await db.query('SELECT * FROM medicos WHERE id = ?', [id]);
  return rows[0];
}

export async function criarMedico(nome, especialidade) {
  const [result] = await db.query(
    'INSERT INTO medicos (nome, especialidade) VALUES (?, ?)',
    [nome, especialidade]
  );

  return {
    id: result.insertId,
    nome,
    especialidade
  };
}

export async function atualizarMedico(id, nome, especialidade) {
  const [result] = await db.query(
    'UPDATE medicos SET nome = ?, especialidade = ? WHERE id = ?',
    [nome, especialidade, id]
  );

  return result.affectedRows;
}

export async function deletarMedico(id) {
  const [result] = await db.query(
    'DELETE FROM medicos WHERE id = ?',
    [id]
  );

  return result.affectedRows;
}