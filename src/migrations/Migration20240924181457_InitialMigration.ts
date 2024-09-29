import { Migration } from '@mikro-orm/migrations';

export class Migration20240924181457_InitialMigration extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `create table \`categories\` (\`uuid\` varchar(255) not null, \`created_at\` datetime not null default CURRENT_TIMESTAMP, \`updated_at\` datetime not null default CURRENT_TIMESTAMP, \`deleted_at\` datetime null, \`name\` varchar(255) not null, primary key (\`uuid\`)) default character set utf8mb4 engine = InnoDB;`,
    );

    this.addSql(
      `create table \`notification_templates\` (\`uuid\` varchar(255) not null, \`created_at\` datetime not null default CURRENT_TIMESTAMP, \`updated_at\` datetime not null default CURRENT_TIMESTAMP, \`deleted_at\` datetime null, \`code\` varchar(255) not null, \`body\` longtext not null, primary key (\`uuid\`)) default character set utf8mb4 engine = InnoDB;`,
    );
    this.addSql(
      `alter table \`notification_templates\` add unique \`notification_templates_code_unique\`(\`code\`);`,
    );

    this.addSql(
      `create table \`users\` (\`uuid\` varchar(255) not null, \`created_at\` datetime not null default CURRENT_TIMESTAMP, \`updated_at\` datetime not null default CURRENT_TIMESTAMP, \`deleted_at\` datetime null, \`fullname\` varchar(255) not null, \`email\` varchar(255) not null, \`password\` varchar(255) not null, primary key (\`uuid\`)) default character set utf8mb4 engine = InnoDB;`,
    );
    this.addSql(
      `alter table \`users\` add unique \`users_email_unique\`(\`email\`);`,
    );

    this.addSql(
      `create table \`testimonies\` (\`uuid\` varchar(255) not null, \`created_at\` datetime not null default CURRENT_TIMESTAMP, \`updated_at\` datetime not null default CURRENT_TIMESTAMP, \`deleted_at\` datetime null, \`firstname\` varchar(255) not null, \`lastname\` varchar(255) not null, \`email\` varchar(255) not null, \`address\` varchar(255) not null, \`country\` varchar(255) not null, \`category\` varchar(255) null, \`anonymous\` tinyint(1) not null default false, \`is_featured\` tinyint(1) not null default false, \`published\` tinyint(1) not null default false, \`image\` varchar(255) not null, \`testimony\` longtext not null, \`user\` varchar(255) null, primary key (\`uuid\`)) default character set utf8mb4 engine = InnoDB;`,
    );
    this.addSql(
      `alter table \`testimonies\` add index \`testimonies_category_index\`(\`category\`);`,
    );
    this.addSql(
      `alter table \`testimonies\` add index \`testimonies_user_index\`(\`user\`);`,
    );

    this.addSql(
      `alter table \`testimonies\` add constraint \`testimonies_category_foreign\` foreign key (\`category\`) references \`categories\` (\`uuid\`) on update cascade on delete set null;`,
    );
    this.addSql(
      `alter table \`testimonies\` add constraint \`testimonies_user_foreign\` foreign key (\`user\`) references \`users\` (\`uuid\`) on update cascade on delete set null;`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(
      `alter table \`testimonies\` drop foreign key \`testimonies_category_foreign\`;`,
    );

    this.addSql(
      `alter table \`testimonies\` drop foreign key \`testimonies_user_foreign\`;`,
    );

    this.addSql(`drop table if exists \`categories\`;`);

    this.addSql(`drop table if exists \`notification_templates\`;`);

    this.addSql(`drop table if exists \`users\`;`);

    this.addSql(`drop table if exists \`testimonies\`;`);
  }
}
