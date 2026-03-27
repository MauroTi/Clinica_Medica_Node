import db from '../../config/db.js';

export async function listarPacientes() {
  const [rows] = await db.execute(
    'SELECT id, nome, idade, telefone FROM pacientes ORDER BY id DESC'
  );
  return rows;
}

export async function buscarPacientePorId(id) {
  const [rows] = await db.execute(
    'SELECT id, nome, idade, telefone FROM pacientes WHERE id = ?',
    [id]
  );
  return rows[0] || null;
}

export async function criarPaciente(nome, idade, telefone) {
  const [result] = await db.execute(
    'INSERT INTO pacientes (nome, idade, telefone) VALUES (?, ?, ?)',
    [nome, idade, telefone]
  );

  return {
    id: result.insertId,
    nome,
    idade,
    telefone,
  };
}

export async function atualizarPaciente(id, nome, idade, telefone) {
  const [result] = await db.execute(
    'UPDATE pacientes SET nome = ?, idade = ?, telefone = ? WHERE id = ?',
    [nome, idade, telefone, id]
  );

  if (result.affectedRows === 0) {
    return null;
  }

  return {
    id: Number(id),
    nome,
    idade,
    telefone,
  };
}

export async function deletarPaciente(id) {
  const [result] = await db.execute(
    'DELETE FROM pacientes WHERE id = ?',
    [id]
  );

  return result.affectedRows > 0;
}