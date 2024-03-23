import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';

import { PaginationRdo } from '../rdo/pagination.rdo';

export const ApiOkResponsePaginated = <DataDto extends Type<unknown>>(dataDto: DataDto, description?: string) =>
  applyDecorators(
    ApiExtraModels(PaginationRdo, dataDto),
    ApiOkResponse({
      description,
      schema: {
        allOf: [
          { $ref: getSchemaPath(PaginationRdo) },
          {
            properties: {
              entities: {
                type: 'array',
                items: { $ref: getSchemaPath(dataDto) },
              },
            },
          },
        ],
      },
    }),
  )
