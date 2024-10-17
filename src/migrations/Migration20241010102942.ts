import { Migration } from '@mikro-orm/migrations';

export class Migration20241010102942 extends Migration {

  override async up(): Promise<void> {
    this.addSql('create table `comments` (`uuid` varchar(255) not null, `created_at` datetime not null default CURRENT_TIMESTAMP, `updated_at` datetime not null default CURRENT_TIMESTAMP, `deleted_at` datetime null, `name` varchar(255) not null, `email` varchar(255) not null, `comment` varchar(255) not null, `testimony` varchar(255) not null, primary key (`uuid`)) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `comments` add index `comments_testimony_index`(`testimony`);');

    this.addSql('alter table `comments` add constraint `comments_testimony_foreign` foreign key (`testimony`) references `testimonies` (`uuid`) on update cascade;');

    this.addSql('drop table if exists `sessions`;');

    this.addSql('alter table `testimonies` add `phone_number` int not null;');
  }

  override async down(): Promise<void> {
    this.addSql('create table `sessions` (`session_id` varchar(128) not null, `expires` int unsigned not null, `data` mediumtext null, primary key (`session_id`)) default character set utf8mb4 engine = InnoDB;');

    this.addSql('drop table if exists `comments`;');

    this.addSql('alter table `testimonies` drop column `phone_number`;');
  }

}
