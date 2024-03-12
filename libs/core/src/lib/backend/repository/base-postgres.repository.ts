import { NOT_IMPLEMENTED_ERROR } from '@2299899-fit-friends/consts';
/* eslint-disable @typescript-eslint/no-unused-vars */
import { PrismaClientService } from '@2299899-fit-friends/models';
import {
  BaseEntity,
  BaseRepository,
  DefaultPojoType,
  EntityIdType,
} from '@2299899-fit-friends/types';

export abstract class BasePostgresRepository<
  EntityType extends BaseEntity<EntityIdType, DocumentType>,
  DocumentType = DefaultPojoType
> implements BaseRepository<EntityType, DocumentType>
{
  constructor(
    protected readonly client: PrismaClientService,
    private readonly createEntity: (document: DocumentType) => EntityType
  ) {}

  protected createEntityFromDocument(
    document: DocumentType
  ): EntityType | null {
    if (!document) {
      return null;
    }
    return this.createEntity(document);
  }

  public async save(_entity: EntityType): Promise<EntityType> {
    throw new Error(NOT_IMPLEMENTED_ERROR);
  }

  public async findById(_id: EntityType['id']): Promise<EntityType | null> {
    throw new Error(NOT_IMPLEMENTED_ERROR);
  }

  public async update(
    _id: EntityType['id'],
    _entity: EntityType
  ): Promise<EntityType> {
    throw new Error(NOT_IMPLEMENTED_ERROR);
  }

  public async deleteById(_id: EntityType['id']): Promise<void> {
    throw new Error(NOT_IMPLEMENTED_ERROR);
  }
}
