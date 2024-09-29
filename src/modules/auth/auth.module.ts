import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Module } from '@nestjs/common';
import { JwtAuthConfiguration } from 'src/config/configuration';
import { ExpiredJwtStrategy } from 'src/strategies/expired-jwt.strategy';
import { JwtStrategy } from 'src/strategies/jwt.strategy';
import { Users } from '../users/users.entity';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { LocalStrategy } from 'src/strategies/local.strategy';
import { AuthService } from './auth.service';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    ConfigModule.forFeature(JwtAuthConfiguration),
    JwtModule.registerAsync({
      imports: [ConfigModule.forFeature(JwtAuthConfiguration)],
      useFactory: (jwtAuthConfig: ConfigType<typeof JwtAuthConfiguration>) => ({
        secret: jwtAuthConfig.secretKey,
        signOptions: { expiresIn: '1h' },
      }),
      inject: [JwtAuthConfiguration.KEY],
    }),
    MikroOrmModule.forFeature({ entities: [Users] })
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, ExpiredJwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
