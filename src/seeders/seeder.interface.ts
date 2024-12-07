import { NotificationTemplates } from 'src/entities/notification-templates.entity';
import { AdminRoles } from 'src/modules/admin/admin.entities';
import { EntityRepository, Reference } from '@mikro-orm/core';

export interface ISeeder {
  run(): Promise<any>;
}

export interface ISeederConstructor {
  new (...args): ISeeder;
}

export interface IFindClassArgument {
  foundArgument: boolean;
  foundValue: boolean;
  argumentIndex?: number;
  className?: string;
}

export interface INotificationTemplatesSeed {
  uuid: string;
  code: string;
  body: string;
}


export interface ISeederRunnerArgs {
  templatesData?: INotificationTemplatesSeed[];
  notificationTemplateRepo?: EntityRepository<NotificationTemplates>;
}
