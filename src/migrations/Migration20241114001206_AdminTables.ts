import { Migration } from '@mikro-orm/migrations';

export class Migration20241114001206_AdminTables extends Migration {

  override async up(): Promise<void> {
    this.addSql('create table `admin_roles` (`uuid` varchar(255) not null, `created_at` datetime not null default CURRENT_TIMESTAMP, `updated_at` datetime not null default CURRENT_TIMESTAMP, `deleted_at` datetime null, `name` varchar(255) not null, primary key (`uuid`)) default character set utf8mb4 engine = InnoDB;');

    this.addSql('create table `admin_users` (`uuid` varchar(255) not null, `created_at` datetime not null default CURRENT_TIMESTAMP, `updated_at` datetime not null default CURRENT_TIMESTAMP, `deleted_at` datetime null, `full_name` varchar(255) not null, `email` varchar(255) not null, `password` varchar(255) not null, `phone` varchar(255) not null, `role` varchar(255) null, primary key (`uuid`)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `admin_users` add index `admin_users_role_index`(`role`);');

    this.addSql('alter table `admin_users` add constraint `admin_users_role_foreign` foreign key (`role`) references `admin_roles` (`uuid`) on update cascade on delete set null;');
  }

  override async down(): Promise<void> {
    this.addSql('alter table `admin_users` drop foreign key `admin_users_role_foreign`;');

    this.addSql('drop table if exists `admin_roles`;');

    this.addSql('drop table if exists `admin_users`;');
  }

}
