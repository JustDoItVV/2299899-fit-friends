export type EntityIdType = string;

export type DefaultPojoType = Record<string, unknown>;

export interface BaseEntity<T extends EntityIdType, PojoType = DefaultPojoType> {
  id?: T;
  toPOJO(): PojoType;
}
