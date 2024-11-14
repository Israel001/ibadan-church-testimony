import { Entity, Filter, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { Timestamp } from '../../base/timestamp.entity';


@Filter({
  name: 'notDeleted',
  cond: { deletedAt: null },
  default: true,
})
@Entity({ tableName: 'admin_roles' })
export class AdminRoles extends Timestamp {
  @PrimaryKey()
  uuid: string;

  @Property()
  name: string;
}

@Filter({
  name: 'notDeleted',
  cond: { deletedAt: null },
  default: true,
})
@Entity({ tableName: 'admin_users' })
export class AdminUser extends Timestamp {
  @PrimaryKey()
  uuid: string;

  @Property()
  fullName: string;

  @Property()
  email: string;

  @Property()
  password: string;

  @Property()
  phone: string;

  @ManyToOne(() => AdminRoles, {
    fieldName: 'role',
    referenceColumnName: 'uuid',
    joinColumn: 'uuid',
    columnType: 'varchar(255)',
    nullable: true,
    eager: true,
  })
  role: AdminRoles;
}
