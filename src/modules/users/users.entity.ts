import { Entity, Filter, PrimaryKey, Property, Unique } from '@mikro-orm/core';
import { Timestamp } from '../../base/timestamp.entity';

@Filter({
  name: 'notDeleted',
  cond: { deletedAt: null },
  default: true,
})
@Entity({ tableName: 'users' })
export class Users extends Timestamp {
  @PrimaryKey()
  uuid: string;

  @Property()
  fullname: string;

  @Property()
  @Unique()
  email: string;

  @Property()
  password: string;
}
