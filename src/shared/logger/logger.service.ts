import { Injectable, Scope } from '@nestjs/common';
import { createLogger, format, Logger, transports } from 'winston';

@Injectable({
  scope: Scope.TRANSIENT,
})
export class AppLoggerService {
  private context?: string;
  private logger: Logger;

  public setContext(context: string): void {
    this.context = context;
  }

  constructor() {
    this.logger = createLogger({
      level: process.env.LOGGER_LEVEL,
      format: format.combine(
        format.timestamp(),
        format.prettyPrint({
          colorize: true,
        }),
      ),
      transports: [
        new transports.Console(),
        new transports.File({
          filename: 'logs/error.log',
          level: 'error',
        }),
        new transports.File({
          filename: 'logs/combined.log',
        }),
      ],
    });
  }

  error(ctx: any, message: string, meta?: Record<string, any>): Logger {
    return this.logger.error({
      message,
      contextName: this.context,
      ...meta,
      ctx,
    });
  }
  warn(ctx: any, message: string, meta?: Record<string, any>): Logger {
    return this.logger.warn({
      message,
      contextName: this.context,
      ctx,
      ...meta,
    });
  }

  debug(ctx: any, message: string, meta?: Record<string, any>): Logger {
    return this.logger.debug({
      message,
      contextName: this.context,
      ctx,
      ...meta,
    });
  }

  info(ctx: any, message: string, meta?: Record<string, any>): Logger {
    return this.logger.info({
      message,
      contextName: this.context,
      ctx,
      ...meta,
    });
  }
}
