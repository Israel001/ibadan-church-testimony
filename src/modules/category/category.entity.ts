import { Collection, Entity, Filter, OneToMany, PrimaryKey, Property } from '@mikro-orm/core';
import { Timestamp } from '../../base/timestamp.entity';
import { Testimony } from '../testimony/testimony.entity';

@Filter({
  name: 'notDeleted',
  cond: { deletedAt: null },
  default: true,
})
@Entity({ tableName: 'categories' })
export class Category extends Timestamp {
  @PrimaryKey()
  uuid: string;

  @Property()
  name: string;

}


