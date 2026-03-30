import db from '../../config/db.js';

export async function listarPacientes() {
  const [rows] = await db.execute(
    'SELECT id, nome, idade, telefone, cpf, email FROM pacientes ORDER BY id DESC'
  );
  return rows;
}

export async function buscarPacientePorId(id) {
  const [rows] = await db.execute(
    'SELECT id, nome, idade, telefone, cpf, email FROM pacientes WHERE id = ?',
    [id]
  );
  return rows[0] || null;
}

export async function criarPaciente(nome, idade, telefone, cpf = null, email = null) {
  const [result] = await db.execute(
    'INSERT INTO pacientes (nome, idade, telefone, cpf, email) VALUES (?, ?, ?, ?, ?)',
    [nome, idade, telefone, cpf, email]
  );

  return {
    id: result.insertId,
    nome,
    idade,
    telefone,
    cpf,
    email
  };
}

export async function atualizarPaciente(id, nome, idade, telefone, cpf = null, email = null) {
  const [result] = await db.execute(
    'UPDATE pacientes SET nome = ?, idade = ?, telefone = ?, cpf = ?, email = ? WHERE id = ?',
    [nome, idade, telefone, cpf, email, id]
  );

  if (result.affectedRows === 0) {
    return null;
  }

  return {
    id: Number(id),
    nome,
    idade,
    telefone,
    cpf,
    email
  };
}

export async function deletarPaciente(id) {
  const [result] = await db.execute(
    'DELETE FROM pacientes WHERE id = ?',
    [id]
  );

  return result.affectedRows > 0;
}