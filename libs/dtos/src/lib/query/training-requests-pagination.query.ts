import { IsOptional, IsUUID } from 'class-validator';

import { ApiPropertyOptional } from '@nestjs/swagger';

import { PaginationQuery } from './pagination.query';

export class TrainingRequestsPaginationQuery extends PaginationQuery {
  @ApiPropertyOptional({ description: 'ID автора запроса', type: String })
  @IsUUID()
  @IsOptional()
  public authorId: string;

  @ApiPropertyOptional({ description: 'ID цели запроса', type: String })
  @IsUUID()
  @IsOptional()
  public targetId: string;
}
