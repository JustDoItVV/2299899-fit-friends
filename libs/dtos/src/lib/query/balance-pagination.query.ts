import { IsNumber, IsOptional, IsUUID } from 'class-validator';

import { ApiPropertyOptional } from '@nestjs/swagger';

import { PaginationQuery } from './pagination.query';

export class BalancePaginationQuery extends PaginationQuery {
  @ApiPropertyOptional({ description: 'Идентификатор тренировки', type: String })
  @IsUUID()
  @IsOptional()
  public trainingId?: string;

  @ApiPropertyOptional({ description: 'Количество доступных тренировок', type: String })
  @IsNumber()
  @IsOptional()
  public availableMin?: number;
}
