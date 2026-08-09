import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  async login(email: string, password: string) {
    // MOCK: En el futuro esto llamará a PrismaClient para verificar la DB
    if (email === 'admin@yanapiriwawa.com' && password === 'admin') {
      return {
        access_token: 'mock-jwt-token-admin-123',
        user: { id: 'uuid-1', email, role: 'ADMIN', name: 'Administrador Principal' }
      };
    }

    return {
      access_token: 'mock-jwt-token-prof-456',
      user: { id: 'uuid-2', email, role: 'PROFESSIONAL', name: 'Profesional Médico' }
    };
  }

  async register(data: any) {
    // MOCK: Simulando inserción exitosa en PostgreSQL
    return {
      message: 'Usuario registrado exitosamente (Mock)',
      user: { id: 'uuid-3', email: data.email, name: data.name, role: data.role || 'PROFESSIONAL' }
    };
  }
}
