import { User } from '../domain/user';
import { IUserRepository } from './user.repository';
import { CacheManager } from '../utils/cache.manager';

export class CachedUserRepository implements IUserRepository {
  private repository: IUserRepository;
  private cache: CacheManager;

  constructor(repository: IUserRepository, cache: CacheManager) {
    this.repository = repository;
    this.cache = cache;
  }

  async findById(id: string): Promise<User | null> {
    const cacheKey = `user:${id}`;

    // Intentar obtener del cache
    const cached = this.cache.get<User>(cacheKey);
    if (cached) {
      return cached;
    }

    // Si no está en cache, obtener del repository
    const user = await this.repository.findById(id);

    // Cachear si se encontró
    if (user) {
      this.cache.set(cacheKey, user, 300000); // 5 minutos
    }

    return user;
  }

  async save(user: User): Promise<void> {
    // Guardar en repository
    await this.repository.save(user);

    // Invalidar cache
    this.cache.invalidate(`user:${user.id}`);

    // Cachear la versión nueva
    this.cache.set(`user:${user.id}`, user, 300000);
  }

  async delete(id: string): Promise<void> {
    // Eliminar del repository
    await this.repository.delete(id);

    // Invalidar cache
    this.cache.invalidate(`user:${id}`);
  }

  // Método adicional para invalidar cache manualmente
  invalidateCache(id: string): void {
    this.cache.invalidate(`user:${id}`);
  }

  // Método para pre-cachear un usuario
  preCache(user: User): void {
    this.cache.set(`user:${user.id}`, user, 300000);
  }
}
