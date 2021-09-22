import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity({ tableName: 'releases' })
export class ReleaseEntity {
  @PrimaryKey()
  id: number;

  @Property()
  tag: string;

  @Property()
  notes: string;
}
