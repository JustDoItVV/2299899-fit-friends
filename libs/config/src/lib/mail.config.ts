import * as Joi from 'joi';

import { logger } from '@2299899-fit-friends/logger';
import { registerAs } from '@nestjs/config';

export interface MailConfig {
  mail: {
    host: string;
    port: number;
    user: string;
    password: string;
    from: string;
  };
}

const validationSchema = Joi.object({
  mail: Joi.object({
    host: Joi.string().required().label('MAIL_SMTP_HOST'),
    port: Joi.number().port().required().label('MAIL_SMTP_PORT'),
    user: Joi.string().required().label('MAIL_USER_NAME'),
    password: Joi.string().required().label('MAIL_USER_PASSWORD'),
    from: Joi.string().required().label('MAIL_FROM'),
  }),
});

function validateConfig(config: MailConfig): void {
  const { error } = validationSchema.validate(config, { abortEarly: true });

  if (error) {
    const message = `[Mail config validation error]: ${error.message}`;
    logger.error(message, { context: 'Backend API' });
    process.exit(1);
  }
}

function getConfig(): MailConfig {
  const config: MailConfig = {
    mail: {
      host: process.env.MAIL_SMTP_HOST,
      port: parseInt(process.env.MAIL_SMTP_PORT, 10),
      user: process.env.MAIL_USER_NAME,
      password: process.env.MAIL_USER_PASSWORD,
      from: process.env.MAIL_FROM,
    },
  };

  validateConfig(config);
  return config;
}

export default registerAs('mail', getConfig);
