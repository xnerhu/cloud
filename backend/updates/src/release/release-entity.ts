import { Column, Entity, ObjectIdColumn } from 'typeorm';
import { ObjectID } from 'mongodb';

@Entity({ name: 'releases' })
export class ReleaseEntity {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  tag: string;

  @Column()
  distribution: ObjectID;

  @Column()
  size: number;

  @Column()
  hash: string;

  @Column()
  patchSize: number;

  @Column()
  patchHash: string;
}
