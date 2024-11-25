import { Migration } from '@mikro-orm/migrations';

export class Migration20241124181039_AddRejectionReasonToTestimony extends Migration {

  override async up(): Promise<void> {
    this.addSql('drop table if exists `sessions`;');

    this.addSql('alter table `testimonies` add `rejection_reason` varchar(255) not null;');
  }

  override async down(): Promise<void> {
    this.addSql('create table `sessions` (`session_id` varchar(128) not null, `expires` int unsigned not null, `data` mediumtext null, primary key (`session_id`)) default character set utf8mb4 engine = InnoDB;');

    this.addSql('alter table `testimonies` drop column `rejection_reason`;');
  }

}
