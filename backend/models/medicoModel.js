import db from "../../config/db.js";

export async function listarMedicos() {
  const [rows] = await db.execute(
    "SELECT id, nome, especialidade, crm, email, telefone FROM medicos ORDER BY id DESC",
  );
  return rows;
}

export async function buscarMedicoPorId(id) {
  const [rows] = await db.execute(
    "SELECT id, nome, especialidade, crm, email, telefone FROM medicos WHERE id = ?",
    [id],
  );
  return rows[0] || null;
}

export async function criarMedico(
  nome,
  especialidade,
  crm = null,
  email = null,
  telefone = null,
) {
  const [result] = await db.execute(
    "INSERT INTO medicos (nome, especialidade, crm, email, telefone) VALUES (?, ?, ?, ?, ?)",
    [nome, especialidade, crm, email, telefone],
  );

  return {
    id: result.insertId,
    nome,
    especialidade,
    crm,
    email,
    telefone,
  };
}

export async function atualizarMedico(
  id,
  nome,
  especialidade,
  crm = null,
  email = null,
  telefone = null,
) {
  const [result] = await db.execute(
    "UPDATE medicos SET nome = ?, especialidade = ?, crm = ?, email = ?, telefone = ? WHERE id = ?",
    [nome, especialidade, crm, email, telefone, id],
  );

  if (result.affectedRows === 0) {
    return null;
  }

  return {
    id: Number(id),
    nome,
    especialidade,
    crm,
    email,
    telefone,
  };
}

export async function deletarMedico(id) {
  const [result] = await db.execute("DELETE FROM medicos WHERE id = ?", [id]);

  return result.affectedRows > 0;
}
