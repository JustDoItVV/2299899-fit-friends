import { IsNotEmpty } from 'class-validator';

import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetFileQuery {
  @ApiPropertyOptional({ description: 'Относительный путь к файлу', type: String })
  @IsNotEmpty()
  public path: string;
}
