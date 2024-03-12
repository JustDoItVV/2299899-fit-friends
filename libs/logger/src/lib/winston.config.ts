import 'winston-daily-rotate-file';

import * as winston from 'winston';

const transports = [
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.colorize(),
      winston.format.printf(({ timestamp, level, message, context, trace }) => {
        return `${timestamp} [${context}] ${level}: ${message}${
          trace ? `\n${trace}` : ''
        }`;
      })
    ),
  }),
  new winston.transports.DailyRotateFile({
    filename: 'logs/backend-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
  }),
];

export const logger = winston.createLogger({
  transports,
});
