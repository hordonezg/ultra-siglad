import { pool } from '../config/database.js';
import { hashPassword } from '../utils/bcrypt.js';

export class User {
  static async findByEmail(email) {
    const query = `
      SELECT id, email, password, rol, activo 
      FROM usuarios 
      WHERE email = $1
    `;
    const result = await pool.query(query, [email]);
    return result.rows[0];
  }

  static async updateLastLogin(userId) {
    const query = `
      UPDATE usuarios 
      SET ultimo_login = NOW() 
      WHERE id = $1
    `;
    await pool.query(query, [userId]);
  }

  static async create(userData) {
    const hashedPassword = await hashPassword(userData.password);
    const query = `
      INSERT INTO usuarios (email, password, rol) 
      VALUES ($1, $2, $3) 
      RETURNING id, email, rol, activo
    `;
    const result = await pool.query(query, [
      userData.email,
      hashedPassword,
      userData.rol
    ]);
    return result.rows[0];
  }
}