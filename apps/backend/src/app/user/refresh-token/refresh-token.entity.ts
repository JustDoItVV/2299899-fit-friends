import { BaseEntity, RefreshToken } from '@2299899-fit-friends/types';

export class RefreshTokenEntity implements BaseEntity<string, RefreshToken> {
  public id?: string | undefined;
  public tokenId: string;
  public userId: string;
  public expiresIn: Date;
  [key: string]: unknown;

  constructor(refreshToken: RefreshToken) {
    this.populate(refreshToken);
  }

  public populate(data: RefreshToken): void {
    this.id = data.id || undefined;
    this.tokenId = data.tokenId;
    this.userId = data.userId;
    this.expiresIn = data.expiresIn;
  }

  public toPOJO(): RefreshTokenEntity {
    return { ...this };
  }

  static fromObject(data: RefreshToken): RefreshTokenEntity {
    return new RefreshTokenEntity(data);
  }
}
