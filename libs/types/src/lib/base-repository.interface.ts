import {
  BaseEntity,
  DefaultPojoType,
  EntityIdType,
} from './base-entity.interface';

export interface BaseRepository<
  EntityType extends BaseEntity<EntityIdType, PojoType>,
  PojoType = DefaultPojoType
> {
  findById(id: EntityType['id']): Promise<EntityType | null>;
  save(entity: EntityType): Promise<EntityType>;
  update(id: EntityType['id'], entity: EntityType): Promise<EntityType>;
  deleteById(id: EntityType['id']): Promise<void>;
}
