import { DynamicModule, INestApplicationContext } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import SeederModule from './seeder.module';
import { parseCommandLineForClassFlag, startSeeding } from './seed-functions';
import NotificationTemplatesSeed from './seeds/notification_templates.seed';

const SeederModuleRegister = (): DynamicModule => {
  return SeederModule.forRoot([NotificationTemplatesSeed]);
};

export async function bootstrap(fromCommandLine = true) {
  const appContext: INestApplicationContext =
    await NestFactory.createApplicationContext(SeederModuleRegister());
  const commandLineClass = parseCommandLineForClassFlag();
  await startSeeding(
    appContext,
    commandLineClass.foundValue ? commandLineClass.className : null,
  );
  appContext.close();
  if (fromCommandLine) process.exit();
}
