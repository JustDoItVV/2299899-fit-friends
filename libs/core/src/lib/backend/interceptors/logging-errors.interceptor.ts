import { Observable, tap } from 'rxjs';

import { BackendLoggerService } from '@2299899-fit-friends/logger';
import {
    CallHandler, ExecutionContext, HttpException, Injectable, NestInterceptor
} from '@nestjs/common';

@Injectable()
export class LoggingErrorsInterceptor implements NestInterceptor {
  constructor(private readonly loggerService: BackendLoggerService) {}

  intercept(_context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      tap({
        error: (error: HttpException) => {
          try {
            if (Array.isArray(error['response']['message'])) {
              error['response']['message'].map((message) =>
                this.loggerService.error(message)
              );
            } else {
              this.loggerService.error(error['response']['message']);
            }
          } catch {
            this.loggerService.error(error.message);
          }
        },
      })
    );
  }
}
