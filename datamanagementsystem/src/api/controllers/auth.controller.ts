import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import { getPool } from '../services/mysql';
import { HttpError } from '../utils/httpError';

type LoginRole = 'staff' | 'pos' | 'manager';
type UserRole = LoginRole | 'admin';

type UserRow = RowDataPacket & {
  id: number;
  username: string;
  email: string;
  password: string;
  role: UserRole;
  fullName: string | null;
  isActive: 0 | 1;
};

export class AuthController {
  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { identifier, password, role } = req.body as {
        identifier: string;
        password: string;
        role: LoginRole;
      };

      const pool = getPool();

      const [rows] = await pool.query<UserRow[]>(
        `
          SELECT 
            id,
            username,
            email,
            password,
            role,
            full_name as fullName,
            is_active as isActive
          FROM users
          WHERE username = ? OR email = ?
          LIMIT 1
        `,
        [identifier, identifier]
      );

      if (rows.length === 0) {
        throw new HttpError(401, 'INVALID_CREDENTIALS', 'Sai tài khoản hoặc mật khẩu');
      }

      const user = rows[0];

      if (!user.isActive) {
        throw new HttpError(403, 'USER_INACTIVE', 'Tài khoản đã bị khóa');
      }

      const passwordOk = await bcrypt.compare(password, user.password);
      if (!passwordOk) {
        throw new HttpError(401, 'INVALID_CREDENTIALS', 'Sai tài khoản hoặc mật khẩu');
      }

      if (user.role !== 'admin' && user.role !== role) {
        throw new HttpError(403, 'ROLE_NOT_ALLOWED', 'Tài khoản không có quyền đăng nhập vai trò này');
      }

      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        throw new HttpError(500, 'JWT_SECRET_MISSING', 'JWT_SECRET chưa được cấu hình');
      }

      const secret: Secret = jwtSecret;
      const expiresIn = (process.env.JWT_EXPIRES_IN || '7d') as SignOptions['expiresIn'];

      const token = jwt.sign(
        { userId: user.id, role: user.role },
        secret,
        { expiresIn }
      );

      const { password: _password, ...safeUser } = user;

      res.json({
        success: true,
        message: 'LOGIN_SUCCESS',
        data: {
          token,
          user: {
            ...safeUser,
            isActive: Boolean(safeUser.isActive),
          },
        },
      });
    } catch (error) {
      next(error);
    }
  };

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { username, password, email, role, fullName } = req.body as {
        username: string;
        password: string;
        email: string;
        role: LoginRole;
        fullName?: string;
      };

      const pool = getPool();

      const [existing] = await pool.query<RowDataPacket[]>(
        `SELECT id FROM users WHERE username = ? OR email = ? LIMIT 1`,
        [username, email]
      );

      if (existing.length > 0) {
        throw new HttpError(409, 'USER_EXISTS', 'Username hoặc email đã tồn tại');
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const [result] = await pool.query<ResultSetHeader>(
        `
          INSERT INTO users (username, email, password, role, full_name, is_active)
          VALUES (?, ?, ?, ?, ?, true)
        `,
        [username, email, hashedPassword, role, fullName || null]
      );

      const [createdRows] = await pool.query<RowDataPacket[]>(
        `
          SELECT
            id,
            username,
            email,
            role,
            full_name as fullName,
            is_active as isActive,
            created_at as createdAt,
            updated_at as updatedAt
          FROM users
          WHERE id = ?
          LIMIT 1
        `,
        [result.insertId]
      );

      const createdUser = createdRows[0];

      res.status(201).json({
        success: true,
        message: 'REGISTER_SUCCESS',
        data: {
          user: {
            ...createdUser,
            isActive: Boolean(createdUser.isActive),
          },
        },
      });
    } catch (error) {
      next(error);
    }
  };

  logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json({
        success: true,
        message: 'Logged out successfully'
      });
    } catch (error) {
      next(error);
    }
  };

  refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json({
        success: true,
        message: 'Refresh token endpoint - To be implemented'
      });
    } catch (error) {
      next(error);
    }
  };
}
