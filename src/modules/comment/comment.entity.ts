import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { Timestamp } from '../../base/timestamp.entity';
import { Testimony } from '../testimony/testimony.entity';

@Entity({ tableName: 'comments' })
export class Comment extends Timestamp {
  @PrimaryKey()
  uuid: string;

  @Property()
  name: string;

  @Property()
  email: string;

  @Property()
  comment: string;

  @ManyToOne(() => Testimony, {
    fieldName: 'testimony',
    referenceColumnName: 'uuid',
    joinColumn: 'uuid',
    nullable: false, 
    eager: true,
  })
  testimony: Testimony; 
}
