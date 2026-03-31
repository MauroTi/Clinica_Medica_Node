import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "clinica_medica_node",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export async function testarConexao() {
  try {
    const connection = await pool.getConnection();
    console.log("✅ Conectado ao MySQL com sucesso!");
    connection.release();
  } catch (error) {
    console.error("❌ Erro ao conectar no MySQL:", error.message);
  }
}

export default pool;
