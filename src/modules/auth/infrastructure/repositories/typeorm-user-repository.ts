import { DataSource } from 'typeorm';

import { UserOrmEntity } from '../orm/entities/user.orm-entity';

export class TypeOrmUserRepository {
  constructor(private readonly dataSource: DataSource) {}

  async findByUsername(username: string): Promise<UserOrmEntity | null> {
    return this.dataSource.getRepository(UserOrmEntity).findOne({
      where: { username },
    });
  }

  async findById(id: string): Promise<UserOrmEntity | null> {
    return this.dataSource.getRepository(UserOrmEntity).findOne({
      where: { id },
    });
  }

  async save(user: UserOrmEntity): Promise<UserOrmEntity> {
    return this.dataSource.getRepository(UserOrmEntity).save(user);
  }
}
