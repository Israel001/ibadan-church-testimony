import { Migration } from '@mikro-orm/migrations';

export class Migration20241119080706_ChangePhoneNumberToString extends Migration {

  override async up(): Promise<void> {
    this.addSql('alter table `testimonies` modify `phone_number` varchar(255) not null;');
  }

  override async down(): Promise<void> {
    this.addSql('alter table `testimonies` modify `phone_number` int not null;');
  }

}
