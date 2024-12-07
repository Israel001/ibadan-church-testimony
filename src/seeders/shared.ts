import { Logger } from '@nestjs/common';
import {
  INotificationTemplatesSeed,
  ISeederRunnerArgs,
} from './seeder.interface';
import { EntityManager } from '@mikro-orm/core';
import { NotificationTemplates } from 'src/entities/notification-templates.entity';

const logger = new Logger('SeederRunner');

/**
 * Save a single notification template using EntityManager.
 */
const saveTemplate = async (
  template: INotificationTemplatesSeed,
  em: EntityManager,
) => {
  const templateModel = em.create(NotificationTemplates, {
    code: template.code,
    body: template.body,
  });
  await em.persistAndFlush(templateModel);
};

/**
 * Seeder runner for notification templates.
 */
export const seederRunner = async ({
  templatesData,
  em,
}: ISeederRunnerArgs & { em: EntityManager }) => {
  try {
    // Disable foreign key checks (specific to the database being used)
    await em.getConnection().execute('SET FOREIGN_KEY_CHECKS = 0;');

    // Clear existing data
    await em.nativeDelete(NotificationTemplates, {});

    // Seed templates
    if (templatesData && templatesData.length) {
      for (const template of templatesData) {
        await saveTemplate(template, em).catch((error) => {
          logger.error(
            `Error occurred when seeding template: '${template.code}'`,
            error.stack,
            'NotificationTemplateSeeder',
          );
        });
      }
    }

    // Re-enable foreign key checks
    await em.getConnection().execute('SET FOREIGN_KEY_CHECKS = 1;');
    logger.log('Notification templates seeding completed.');
  } catch (error) {
    logger.error(
      'An error occurred during the notification templates seeding process.',
      error.stack,
    );
  }
  return true;
};
