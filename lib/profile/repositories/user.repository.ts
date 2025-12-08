import { User } from '../domain/user';
import { UserData } from '../types/user.types';

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  save(user: User): Promise<void>;
  delete(id: string): Promise<void>;
}

export class ApiUserRepository implements IUserRepository {
  private baseUrl: string;

  constructor(baseUrl: string = '/api') {
    this.baseUrl = baseUrl;
  }

  async findById(id: string): Promise<User | null> {
    try {
      const response = await fetch(`${this.baseUrl}/users/${id}`);

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error('Error al obtener usuario');
      }

      const data: UserData = await response.json();
      return User.create(data);
    } catch (error) {
      console.error('Error en findById:', error);
      return null;
    }
  }

  async save(user: User): Promise<void> {
    const response = await fetch(`${this.baseUrl}/users/${user.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user.toJSON()),
    });

    if (!response.ok) {
      throw new Error('Error al guardar usuario');
    }
  }

  async delete(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/users/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Error al eliminar usuario');
    }
  }
}
