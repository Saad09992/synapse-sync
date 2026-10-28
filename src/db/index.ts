import { Pool } from "pg";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

export const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER || "synapse_user",
  password: process.env.DB_PASSWORD || "synapse_password",
  database: process.env.DB_NAME || "synapse_db",
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export const initDB = async () => {
  try {
    const sqlPath = path.join(import.meta.dirname, "init.sql");
    const sql = fs.readFileSync(sqlPath, "utf8");
    await pool.query(sql);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};
