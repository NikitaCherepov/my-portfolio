import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface AuthenticatedUser {
  id: number;
  login: string;
  admin: boolean;
}

/**
 * Проверяет JWT токен и возвращает информацию о пользователе
 */
export async function authenticateToken(request: NextRequest): Promise<AuthenticatedUser | null> {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return null;
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET не настроен');
    }

    const decoded = jwt.verify(token, jwtSecret) as {
      userId: number;
      login: string;
      admin: boolean;
    };

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        login: true,
        admin: true
      }
    });

    if (!user || !user.admin) {
      return null;
    }

    return user;
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
}

/**
 * Проверяет, аутентифицирован ли пользователь и является ли он администратором
 */
export async function requireAuth(request: NextRequest): Promise<AuthenticatedUser> {
  const user = await authenticateToken(request);

  if (!user) {
    throw new Error('Authentication required');
  }

  if (!user.admin) {
    throw new Error('Admin access required');
  }

  return user;
}