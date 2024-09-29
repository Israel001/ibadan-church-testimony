import { registerAs } from '@nestjs/config';
import { SmtpConfig } from './types/smtp.config';
import { JwtAuthConfig } from './types/jwt-auth.config';

export const SmtpConfiguration = registerAs(
  'smtpConfig',
  (): SmtpConfig => ({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    username: process.env.SMTP_USERNAME,
    password: process.env.SMTP_PASSWORD,
  }),
);

export const JwtAuthConfiguration = registerAs(
  'jwtAuthConfig',
  (): JwtAuthConfig => ({
    secretKey: process.env.JWT_SECRET_KEY || 'secret',
    adminSecretKey: process.env.ADMIN_JWT_SECRET_KEY || 'admin-secret',
    resetPwdSecretKey:
      process.env.RESET_PWD_JWT_SECRET_KEY || 'reset-pwd-secret',
  }),
);
