import { Migration } from '@mikro-orm/migrations';

export class Migration20241125173336_makeRejectionReasonNullable extends Migration {

  override async up(): Promise<void> {
    this.addSql('drop table if exists `sessions`;');

    this.addSql('alter table `admin_users` modify `role` varchar(255);');

    this.addSql('alter table `testimonies` modify `category` varchar(255), modify `user` varchar(255), modify `rejection_reason` varchar(255) null;');
  }

  override async down(): Promise<void> {
    this.addSql('create table `sessions` (`session_id` varchar(128) not null, `expires` int unsigned not null, `data` mediumtext null default NULL, primary key (`session_id`)) default character set utf8mb4 engine = InnoDB;');

    this.addSql('alter table `testimonies` modify `category` varchar(255) default \'NULL\', modify `rejection_reason` varchar(255) not null, modify `user` varchar(255) default \'NULL\';');

    this.addSql('alter table `admin_users` modify `role` varchar(255) default \'NULL\';');
  }

}
