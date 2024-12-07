import { DynamicModule, Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { NotificationTemplates } from '../entities/notification-templates.entity';
import { AdminRoles } from '../modules/admin/admin.entities';
import { ISeederConstructor } from './seeder.interface';
import { DatabaseModule } from 'src/database.module';

@Module({
  imports: [
    DatabaseModule.forRoot(),
    MikroOrmModule.forFeature([NotificationTemplates, AdminRoles]),
  ],
})
export default class SeederModule {
  public static seederClasses: ISeederConstructor[] = [];

  static forRoot(seeders: ISeederConstructor[]): DynamicModule {
    SeederModule.seederClasses = seeders || [];
    return {
      global: true,
      module: SeederModule,
      providers: seeders, // Pass the seeder classes as providers
    };
  }
}
