import { BasePostgresRepository } from '@2299899-fit-friends/core';
import { PrismaClientService } from '@2299899-fit-friends/models';
import { RefreshToken } from '@2299899-fit-friends/types';
import { Injectable } from '@nestjs/common';

import { RefreshTokenEntity } from './refresh-token.entity';

@Injectable()
export class RefreshTokenRepository extends BasePostgresRepository<
  RefreshTokenEntity,
  RefreshToken
> {
  constructor(protected readonly clientService: PrismaClientService) {
    super(clientService, RefreshTokenEntity.fromObject);
  }

  public async save(entity: RefreshTokenEntity): Promise<RefreshTokenEntity> {
    const pojoEntity = entity.toPOJO();
    const document = await this.clientService.refreshToken.create({
      data: { ...pojoEntity },
    });
    entity.id = document.id;
    return entity;
  }

  public async findByTokenId(
    tokenId: string
  ): Promise<RefreshTokenEntity | null> {
    const document = await this.clientService.refreshToken.findFirst({
      where: { tokenId },
    });
    return this.createEntityFromDocument(document);
  }

  public async deleteByTokenId(tokenId: string): Promise<void> {
    const document = await this.findByTokenId(tokenId);
    if (document) {
      await this.clientService.refreshToken.delete({
        where: { id: document.id },
      });
    }
  }

  public async deleteExpired() {
    await this.clientService.refreshToken.deleteMany({
      where: { expiresIn: { lt: new Date() } },
    });
  }
}
