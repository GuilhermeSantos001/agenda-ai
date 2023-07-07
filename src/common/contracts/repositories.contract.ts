import { DatabaseContract } from './database.contract';
import { Id } from '../types/id.type';

export abstract class RepositoriesContract<T, Result = T | Error> {
  constructor(protected readonly database: DatabaseContract<T>) {}
  abstract register(data: T): Promise<Result>;
  abstract upgrade(id: Id, data: Partial<T>): Promise<Result>;
  abstract get(id: Id): Promise<Result>;
  abstract getAll(): Promise<T[]>;
  abstract unregister(id: Id): Promise<boolean>;
}
