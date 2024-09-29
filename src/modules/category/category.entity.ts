import { Entity, Filter, PrimaryKey, Property } from '@mikro-orm/core';
import { Timestamp } from '../../base/timestamp.entity';

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
