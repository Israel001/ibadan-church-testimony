import { Migration } from '@mikro-orm/migrations';

export class Migration20241126172758_AddUserToComments extends Migration {

  override async up(): Promise<void> {
    this.addSql('alter table `comments` add `user` varchar(255) not null;');
    this.addSql('alter table `comments` add constraint `comments_user_foreign` foreign key (`user`) references `users` (`uuid`) on update cascade;');
    this.addSql('alter table `comments` add index `comments_user_index`(`user`);');
  }

  override async down(): Promise<void> {
    this.addSql('alter table `comments` drop foreign key `comments_user_foreign`;');

    this.addSql('alter table `comments` drop index `comments_user_index`;');
    this.addSql('alter table `comments` drop column `user`;');
  }

}
