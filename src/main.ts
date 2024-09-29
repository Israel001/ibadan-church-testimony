import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { corsConfiguration } from './config/cors-configuration';
import { BasePaginatedResponseDto } from './base/dto';
import { AppModule } from './app.module';
import { join } from 'path';
import session from 'express-session';
const MySQLStore = require('express-mysql-session')(session);

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: corsConfiguration,
  });

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  app.enableShutdownHooks();

  const options = new DocumentBuilder()
    .setTitle('Testimony API')
    .setDescription('API documentation for testimony api')
    .setVersion('1.0')
    .addBearerAuth({ type: 'http' })
    .build();

  const document = SwaggerModule.createDocument(app, options, {
    extraModels: [BasePaginatedResponseDto],
  });
  SwaggerModule.setup('api-docs/', app, document);

  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('ejs');
  app.useStaticAssets(join(__dirname, '..', 'assets'));
  const sessionStore = new MySQLStore({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    port: process.env.DATABASE_PORT,
  });

  app.use(
    session({
      secret: 'secret',
      resave: false,
      saveUninitialized: false,
      store: sessionStore,
      cookie: { maxAge: 86400000 },
    }),
  );

  await app.listen(process.env.PORT || 8080, () => {
    new Logger().log(`API is started on PORT ${process.env.PORT || 8080}...`);
  });
}
bootstrap();
