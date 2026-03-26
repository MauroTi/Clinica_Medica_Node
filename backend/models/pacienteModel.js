import db from '../config/db.js';

export async function listarPacientes() {
  const [rows] = await db.query('SELECT * FROM pacientes ORDER BY id DESC');
  return rows;
}

export async function buscarPacientePorId(id) {
  const [rows] = await db.query('SELECT * FROM pacientes WHERE id = ?', [id]);
  return rows[0];
}

export async function criarPaciente(nome, idade, telefone) {
  const [result] = await db.query(
    'INSERT INTO pacientes (nome, idade, telefone) VALUES (?, ?, ?)',
    [nome, idade, telefone]
  );

  return {
    id: result.insertId,
    nome,
    idade,
    telefone
  };
}

export async function atualizarPaciente(id, nome, idade, telefone) {
  const [result] = await db.query(
    'UPDATE pacientes SET nome = ?, idade = ?, telefone = ? WHERE id = ?',
    [nome, idade, telefone, id]
  );

  return result.affectedRows;
}

export async function deletarPaciente(id) {
  const [result] = await db.query(
    'DELETE FROM pacientes WHERE id = ?',
    [id]
  );

  return result.affectedRows;
}