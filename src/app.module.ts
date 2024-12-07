import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { validate } from './env.validator';
import { RequestLoggerMiddleware } from './middleware/request-logger-middleware';
import { TestimonyModule } from './modules/testimony/testimony.module';
import { CategoryModule } from './modules/category/category.module';
import { AppController } from './app.controller';
import { CommentModule } from './modules/comment/comment.module';
import { AdminModule } from './modules/admin/admin.module';
import { SharedModule } from './modules/shared/shared.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate, envFilePath: '.env' }),
    DatabaseModule.forRoot(),
    UsersModule,
    AuthModule,
    TestimonyModule,
    CategoryModule,
    CommentModule,
    AdminModule,
    SharedModule,
  ],
  controllers: [AppController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}
