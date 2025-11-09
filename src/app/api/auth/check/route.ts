import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { authenticated: false, error: 'Токен отсутствует' },
        { status: 401 }
      );
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

    if (!user) {
      return NextResponse.json(
        { authenticated: false, error: 'Пользователь не найден' },
        { status: 401 }
      );
    }

    if (!user.admin) {
      return NextResponse.json(
        { authenticated: false, error: 'Доступ запрещен' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        login: user.login,
        admin: user.admin
      }
    });

  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json(
        { authenticated: false, error: 'Недействительный токен' },
        { status: 401 }
      );
    }

    console.error('Ошибка проверки аутентификации:', error);
    return NextResponse.json(
      { authenticated: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}