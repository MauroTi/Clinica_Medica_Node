// scripts/seed.js
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'clinica_medica_node',
};

async function seed() {
  const connection = await mysql.createConnection(dbConfig);
  try {
    console.log('🚀 Iniciando seed...');

    // Desabilitar foreign key checks
    await connection.query('SET FOREIGN_KEY_CHECKS = 0');

    // Limpar tabelas
    await connection.query('DELETE FROM consultas');
    await connection.query('DELETE FROM medicos');
    await connection.query('DELETE FROM pacientes');

    // Resetar auto-increment
    await connection.query('ALTER TABLE pacientes AUTO_INCREMENT = 1');
    await connection.query('ALTER TABLE medicos AUTO_INCREMENT = 1');
    await connection.query('ALTER TABLE consultas AUTO_INCREMENT = 1');

    console.log('🧹 Tabelas limpas.');

    // Reabilitar foreign key checks
    await connection.query('SET FOREIGN_KEY_CHECKS = 1');

    // Inserir pacientes
    const pacientes = [
      { nome: 'João Silva', idade: 30, telefone: '11999999999', cpf: '12345678900', email: 'joao.silva@exemplo.com' },
      { nome: 'Maria Souza', idade: 25, telefone: '11988888888', cpf: '98765432100', email: 'maria.souza@exemplo.com' },
      { nome: 'Carlos Oliveira', idade: 40, telefone: '11977777777', cpf: '11122233344', email: 'carlos.oliveira@exemplo.com' },
    ];

    for (const p of pacientes) {
      await connection.query(
        'INSERT INTO pacientes (nome, idade, telefone, cpf, email) VALUES (?, ?, ?, ?, ?)',
        [p.nome, p.idade, p.telefone, p.cpf, p.email]
      );
    }

    // Inserir médicos
    const medicos = [
      { nome: 'Dr. Ana Pereira', especialidade: 'Cardiologia', crm: 'CRM12345', email: 'ana.pereira@clinica.com', telefone: '11987654321' },
      { nome: 'Dr. Paulo Lima', especialidade: 'Dermatologia', crm: 'CRM67890', email: 'paulo.lima@clinica.com', telefone: '11987654322' },
    ];

    for (const m of medicos) {
      await connection.query(
        'INSERT INTO medicos (nome, especialidade, crm, email, telefone) VALUES (?, ?, ?, ?, ?)',
        [m.nome, m.especialidade, m.crm, m.email, m.telefone]
      );
    }

    // Inserir consultas (exemplo simples)
    const consultas = [
      { paciente_id: 1, medico_id: 1, data_consulta: '2026-03-25 10:00:00', descricao: 'Consulta de rotina' },
      { paciente_id: 2, medico_id: 2, data_consulta: '2026-03-26 14:00:00', descricao: 'Acompanhamento dermatológico' },
    ];

    for (const c of consultas) {
      await connection.query(
        'INSERT INTO consultas (paciente_id, medico_id, data_consulta, descricao) VALUES (?, ?, ?, ?)',
        [c.paciente_id, c.medico_id, c.data_consulta, c.descricao]
      );
    }

    console.log('✅ Seed concluído com sucesso!');
  } catch (err) {
    console.error('❌ Erro no seed:', err);
  } finally {
    await connection.end();
  }
}

seed();