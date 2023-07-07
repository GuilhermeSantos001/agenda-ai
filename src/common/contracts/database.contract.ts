import { v4 as uuidv4 } from 'uuid';

import { Id } from '../types/id.type';

export abstract class DatabaseContract<T, Result = T | false> {
  abstract create(data: T): Promise<Result>;
  abstract update(id: Id, data: Partial<T>): Promise<Result>;
  abstract findOne(id: Id): Promise<Result>;
  abstract findAll(): Promise<T[]>;
  abstract delete(id: Id): Promise<boolean>;
  public generateUUID(): string {
    return uuidv4();
  }
}
