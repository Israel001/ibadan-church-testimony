import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { SmtpConfiguration } from 'src/config/configuration';
import { NotificationTemplates } from 'src/entities/notification-templates.entity';
import { IEmailDto } from 'src/types';
import { replacer } from 'src/utils';
import mailer from 'nodemailer-promise';

@Injectable()
export class SharedService {
  constructor(
    @InjectRepository(NotificationTemplates)
    private readonly notificationTemplatesRepository: EntityRepository<NotificationTemplates>,
    @Inject(SmtpConfiguration.KEY)
    private readonly smtpConfig: ConfigType<typeof SmtpConfiguration>,
  ) {}

  async sendEmail(email: IEmailDto) {
    const sendMail = mailer.config({
      host: this.smtpConfig.host,
      port: this.smtpConfig.port,
      secure: true,
      auth: {
        user: this.smtpConfig.username,
        pass: this.smtpConfig.password,
      },
    });
    const notificationTemplate =
      await this.notificationTemplatesRepository.findOne({
        code: email.templateCode,
      });
    if (!notificationTemplate)
      throw new NotFoundException(
        `Notification template: ${email.templateCode} does not exist`,
      );
    email.html = email.data
      ? replacer(0, Object.entries(email.data), notificationTemplate.body)
      : notificationTemplate.body;
    delete email.templateCode;
    sendMail(email);
  }
}
