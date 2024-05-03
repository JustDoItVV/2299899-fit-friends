import * as Joi from 'joi';

import { logger } from '@2299899-fit-friends/logger';
import { registerAs } from '@nestjs/config';

export interface BackendConfig {
  environment: string;
  host: string;
  appPort: number;
  uploadDirectory: string;
  accessTokenSecret: string;
  accessTokenExpiresIn: string;
  refreshTokenSecret: string;
  refreshTokenExpiresIn: string;
  mockPassword: string;
  publicDirectory: string;
}

const validationSchema = Joi.object({
  environment: Joi.string().default('development').label('NODE_ENV'),
  host: Joi.string().required().label('HOST'),
  appPort: Joi.number().port().required().label('BACKEND_PORT'),
  uploadDirectory: Joi.string().required().label('UPLOAD_DIRECTORY_PATH'),
  accessTokenSecret: Joi.string().required().label('JWT_ACCESS_TOKEN_SECRET'),
  accessTokenExpiresIn: Joi.string().required().label('JWT_ACCESS_TOKEN_EXPIRES_IN'),
  refreshTokenSecret: Joi.string().required().label('JWT_REFRESH_TOKEN_SECRET'),
  refreshTokenExpiresIn: Joi.string().required().label('JWT_REFRESH_TOKEN_EXPIRES_IN'),
  mockPassword: Joi.string().required().label('MOCK_PASSWORD'),
  publicDirectory: Joi.string().required().label('PUBLIC_DIRECTORY_PATH'),
});

function validateConvig(config: BackendConfig): void {
  const { error } = validationSchema.validate(config, { abortEarly: true });

  if (error) {
    const message = `[Backend config validation error]: ${error.message}`;
    logger.error(message, { context: 'Backend API' });
    process.exit(1);
  }
}

function getConfig(): BackendConfig {
  const config: BackendConfig = {
    environment: process.env.NODE_ENV,
    host: process.env.HOST,
    appPort: parseInt(process.env.BACKEND_PORT, 10),
    uploadDirectory: process.env.UPLOAD_DIRECTORY_PATH,
    accessTokenSecret: process.env.JWT_ACCESS_TOKEN_SECRET,
    accessTokenExpiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN,
    refreshTokenSecret: process.env.JWT_REFRESH_TOKEN_SECRET,
    refreshTokenExpiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN,
    mockPassword: process.env.MOCK_PASSWORD,
    publicDirectory: process.env.PUBLIC_DIRECTORY_PATH,
  };

  validateConvig(config);
  return config;
}

export default registerAs('app', getConfig);
