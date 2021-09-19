import { Column, Entity, ObjectIdColumn } from 'typeorm';
import { ObjectId } from 'mongodb';

@Entity({ name: 'releases' })
export class ReleaseEntity {
  @ObjectIdColumn()
  id: ObjectId;

  @Column()
  tag: string;

  @Column()
  distribution: ObjectId;

  @Column()
  size: number;

  @Column()
  hash: string;

  @Column()
  patchSize: number;

  @Column()
  patchHash: string;
}
