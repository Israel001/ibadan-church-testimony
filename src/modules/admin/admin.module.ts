import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { validate } from 'class-validator';
import { DatabaseModule } from '../../database.module';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';
import { TestimonyModule } from '../testimony/testimony.module';
import { CategoryModule } from '../category/category.module';
import { CommentModule } from '../comment/comment.module';
import { RequestLoggerMiddleware } from 'src/middleware/request-logger-middleware';
import { AdminService } from './admin.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Testimony } from '../testimony/testimony.entity';
import { Users } from '../users/users.entity';
import { Category } from '../category/category.entity';
import { Comment } from '../comment/comment.entity';
import { AdminRoles, AdminUser } from './admin.entities';
import { PassportModule } from '@nestjs/passport';
import { JwtAuthConfiguration } from 'src/config/configuration';
import { JwtModule } from '@nestjs/jwt';
import { AdminJwtStrategy } from './strategies/jwt.strategy';
import { AdminLocalStrategy } from './strategies/local.strategy';
import { AdminAuthGuard } from './guards/auth-guard';
import { SharedModule } from '../shared/shared.module';

@Module({
  imports: [
    MikroOrmModule.forFeature({
      entities: [Testimony, Users, Category, Comment, AdminUser, AdminRoles],
    }),
    ConfigModule.forRoot({ isGlobal: true, validate, envFilePath: '.env' }),
    DatabaseModule.forRoot(),
    UsersModule,
    AuthModule,
    TestimonyModule,
    CategoryModule,
    CommentModule,
    AdminModule,
    UsersModule,
    PassportModule.register({ session: true }),
    ConfigModule.forFeature(JwtAuthConfiguration),
    JwtModule.registerAsync({
      imports: [ConfigModule.forFeature(JwtAuthConfiguration)],
      useFactory: (jwtAuthConfig: ConfigType<typeof JwtAuthConfiguration>) => ({
        secret: jwtAuthConfig.secretKey,
        signOptions: { expiresIn: '1h' },
      }),
      inject: [JwtAuthConfiguration.KEY],
    }),
    SharedModule,
  ],
  providers: [
    AdminService,
    AdminJwtStrategy,
    AdminLocalStrategy,
    AdminAuthGuard,
  ],
  controllers: [AdminController],
  exports: [AdminService],
})
export class AdminModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}
