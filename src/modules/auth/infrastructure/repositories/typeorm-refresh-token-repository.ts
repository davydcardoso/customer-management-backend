import { DataSource, IsNull } from 'typeorm';

import { RefreshTokenOrmEntity } from '../orm/entities/refresh-token.orm-entity';

export class TypeOrmRefreshTokenRepository {
  constructor(private readonly dataSource: DataSource) {}

  async create(token: RefreshTokenOrmEntity): Promise<RefreshTokenOrmEntity> {
    return this.dataSource.getRepository(RefreshTokenOrmEntity).save(token);
  }

  async findActiveByHash(tokenHash: string): Promise<RefreshTokenOrmEntity | null> {
    return this.dataSource.getRepository(RefreshTokenOrmEntity).findOne({
      where: {
        tokenHash,
        revokedAt: IsNull(),
      },
    });
  }

  async revoke(tokenId: string): Promise<void> {
    await this.dataSource.getRepository(RefreshTokenOrmEntity).update(tokenId, {
      revokedAt: new Date(),
    });
  }
}
