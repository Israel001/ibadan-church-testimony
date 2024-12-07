import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SmtpConfiguration } from 'src/config/configuration';
import { SharedService } from './shared.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { NotificationTemplates } from 'src/entities/notification-templates.entity';

@Module({
  imports: [
    ConfigModule.forFeature(SmtpConfiguration),
    MikroOrmModule.forFeature({
      entities: [NotificationTemplates],
    }),
  ],
  providers: [SharedService],
  exports: [SharedService],
})
export class SharedModule {}
