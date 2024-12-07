import { Injectable } from '@nestjs/common';
import { INotificationTemplatesSeed, ISeeder } from '../seeder.interface';
import { NotificationTemplates } from '../../entities/notification-templates.entity';
import { EntityManager } from '@mikro-orm/core';
import { readFileSync } from 'fs';
import { join } from 'path';
import { v4 } from 'uuid';

@Injectable()
export default class NotificationTemplatesSeed implements ISeeder {
  private templatesData: INotificationTemplatesSeed[] = [
    {
      uuid: v4(),
      code: 'testimony_approved',
      body: this.readTemplate('testimony_approved.html'),
    },
    {
      uuid: v4(),
      code: 'testimony_rejected',
      body: this.readTemplate('testimony_rejected.html'),
    },
  ];

  constructor(private readonly em: EntityManager) {}
  async run(): Promise<any> {
        for (const templateData of this.templatesData) {
          const existingTemplate = await this.em.findOne(
            NotificationTemplates,
            {
              code: templateData.code,
            },
          );

          if (!existingTemplate) {
            const template = this.em.create(
              NotificationTemplates,
              templateData,
            );
            await this.em.persistAndFlush(template);
          }
        }
  }

  private readTemplate(filename: string): string {
    try {
      const filePath = join(__dirname, '..', '..', '..', 'notification_templates', filename);
      return readFileSync(filePath, 'utf-8');
    } catch (error) {
      throw new Error(
        `Failed to read template file "${filename}": ${error.message}`,
      );
    }
  }

}
