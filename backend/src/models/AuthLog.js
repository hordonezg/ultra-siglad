import { pool } from '../config/database.js';

export class AuthLog {
  static async create(logData) {
    const query = `
      INSERT INTO bitacora_autenticacion 
      (usuario_id, fecha_hora, ip_origen, operacion, resultado)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id
    `;
    const result = await pool.query(query, [
      logData.usuario_id,
      new Date(),
      logData.ip_origen,
      logData.operacion,
      logData.resultado
    ]);
    return result.rows[0];
  }

  static async getLogs() {
    const query = `
      SELECT ba.*, u.email 
      FROM bitacora_autenticacion ba
      LEFT JOIN usuarios u ON ba.usuario_id = u.id
      ORDER BY ba.fecha_hora DESC
      LIMIT 100
    `;
    const result = await pool.query(query);
    return result.rows;
  }
}