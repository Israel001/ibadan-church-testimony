import { Migration } from '@mikro-orm/migrations';

export class Migration20241202144722 extends Migration {

  override async up(): Promise<void> {
    this.addSql('drop table if exists `sessions`;');

    this.addSql('alter table `admin_users` modify `phone` varchar(255) null;');
  }

  override async down(): Promise<void> {
    this.addSql('create table `sessions` (`session_id` varchar(128) not null, `expires` int unsigned not null, `data` mediumtext null, primary key (`session_id`)) default character set utf8mb4 engine = InnoDB;');

    this.addSql('alter table `admin_users` modify `phone` varchar(255) not null;');
  }

}
