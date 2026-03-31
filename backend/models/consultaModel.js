import db from "../../config/db.js";

export async function listarConsultas() {
  const [rows] = await db.execute(`
    SELECT 
      c.id,
      c.paciente_id,
      c.medico_id,
      c.data_consulta,
      c.descricao,
      c.status,
      c.observacao_status,
      c.data_criacao,
      c.data_atualizacao,
      p.nome AS paciente_nome,
      p.idade AS paciente_idade,
      p.telefone AS paciente_telefone,
      p.cpf AS paciente_cpf,
      p.email AS paciente_email,
      m.nome AS medico_nome,
      m.especialidade AS medico_especialidade,
      m.crm AS medico_crm,
      m.email AS medico_email,
      m.telefone AS medico_telefone
    FROM consultas c
    INNER JOIN pacientes p ON c.paciente_id = p.id
    INNER JOIN medicos m ON c.medico_id = m.id
    ORDER BY c.data_consulta DESC, c.id DESC
  `);

  return rows;
}

export async function buscarConsultaPorId(id) {
  const [rows] = await db.execute(
    `
    SELECT 
      c.id,
      c.paciente_id,
      c.medico_id,
      c.data_consulta,
      c.descricao,
      c.status,
      c.observacao_status,
      c.data_criacao,
      c.data_atualizacao,
      p.nome AS paciente_nome,
      p.idade AS paciente_idade,
      p.telefone AS paciente_telefone,
      p.cpf AS paciente_cpf,
      p.email AS paciente_email,
      m.nome AS medico_nome,
      m.especialidade AS medico_especialidade,
      m.crm AS medico_crm,
      m.email AS medico_email,
      m.telefone AS medico_telefone
    FROM consultas c
    INNER JOIN pacientes p ON c.paciente_id = p.id
    INNER JOIN medicos m ON c.medico_id = m.id
    WHERE c.id = ?
  `,
    [id],
  );

  return rows[0] || null;
}

export async function criarConsulta(
  paciente_id,
  medico_id,
  data_consulta,
  descricao,
  status = "agendada",
  observacao_status = null,
) {
  const [result] = await db.execute(
    "INSERT INTO consultas (paciente_id, medico_id, data_consulta, descricao, status, observacao_status) VALUES (?, ?, ?, ?, ?, ?)",
    [
      paciente_id,
      medico_id,
      data_consulta,
      descricao ?? null,
      status,
      observacao_status ?? null,
    ],
  );

  return buscarConsultaPorId(result.insertId);
}

export async function atualizarConsulta(
  id,
  paciente_id,
  medico_id,
  data_consulta,
  descricao,
  status = "agendada",
  observacao_status = null,
) {
  const [result] = await db.execute(
    "UPDATE consultas SET paciente_id = ?, medico_id = ?, data_consulta = ?, descricao = ?, status = ?, observacao_status = ? WHERE id = ?",
    [
      paciente_id,
      medico_id,
      data_consulta,
      descricao ?? null,
      status,
      observacao_status ?? null,
      id,
    ],
  );

  if (result.affectedRows === 0) {
    return null;
  }

  return buscarConsultaPorId(id);
}

export async function deletarConsulta(id) {
  const [result] = await db.execute("DELETE FROM consultas WHERE id = ?", [id]);

  return result.affectedRows > 0;
}
