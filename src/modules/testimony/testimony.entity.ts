import {
  Entity,
  Filter,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Timestamp } from '../../base/timestamp.entity';
import { Users } from '../users/users.entity';
import { Category } from '../category/category.entity';

@Filter({
  name: 'notDeleted',
  cond: { deletedAt: null },
  default: true,
})
@Entity({ tableName: 'testimonies' })
export class Testimony extends Timestamp {
  @PrimaryKey()
  uuid: string;

  @Property()
  firstname: string;

  @Property()
  lastname: string;

  @Property()
  email: string;

  @Property()
  address: string;

  @Property()
  country: string;

  @ManyToOne(() => Category, {
    fieldName: 'category',
    referenceColumnName: 'uuid',
    joinColumn: 'uuid',
    columnType: 'varchar(255)',
    nullable: true,
    eager: true,
  })
  category: Category;

  @Property({ default: false })
  anonymous: boolean;

  @Property({ default: false })
  isFeatured: boolean;

  @Property({ default: false })
  published: boolean;

  @Property()
  image: string;

  @Property({ type: 'longtext' })
  testimony: string;

  @ManyToOne(() => Users, {
    fieldName: 'user',
    referenceColumnName: 'uuid',
    joinColumn: 'uuid',
    columnType: 'varchar(255)',
    nullable: true,
    eager: true,
  })
  user: Users;
}
