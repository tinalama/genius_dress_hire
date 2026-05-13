import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { RequestContextService } from '../request-context';

/**
 * Interceptor to log all API requests and responses
 * Simplified version based on disaster-evacuation-node-api ApiLoggingInterceptor
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('API');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const { method, url } = request;
    const startTime = Date.now();

    const requestId = RequestContextService.get()?.requestId || 'unknown';
    const userId = RequestContextService.getUserId() || 'anonymous';
    const ipAddress = this.getClientIp(request);

    // Mask sensitive fields in request body
    const requestBody = this.sanitizeRequestBody(request.body);

    this.logger.log({
      requestId,
      userId,
      url,
      method,
      ip: ipAddress,
      userAgent: request.headers['user-agent'],
      request_body: requestBody,
      message: 'Incoming request',
    });

    return next.handle().pipe(
      tap({
        next: (data) => {
          const executionTime = Date.now() - startTime;

          this.logger.log({
            requestId,
            userId,
            url,
            method,
            ip: ipAddress,
            execution_time: executionTime,
            status_code: response.statusCode,
            message: 'Request completed',
          });
        },
        error: (error) => {
          const executionTime = Date.now() - startTime;
          const statusCode = error?.status || 500;

          this.logger.error({
            requestId,
            userId,
            url,
            method,
            ip: ipAddress,
            execution_time: executionTime,
            status_code: statusCode,
            error: error.message,
            message: 'Request failed',
          });
        },
      }),
    );
  }

  private getClientIp(request: any): string {
    let ipAddress =
      request.headers?.['x-forwarded-for']?.toString() ??
      request.socket.remoteAddress ??
      request.ip;

    if (ipAddress && ipAddress.indexOf(',') !== -1) {
      ipAddress = ipAddress.split(',')[0];
    }

    return ipAddress || 'unknown';
  }

  private sanitizeRequestBody(body: any): any {
    if (!body || typeof body !== 'object') {
      return body;
    }

    const sensitiveFields = [
      'password',
      'currentPassword',
      'newPassword',
      'confirmPassword',
    ];
    const sanitized = { ...body };

    sensitiveFields.forEach((field) => {
      if (field in sanitized) {
        sanitized[field] = '***********';
      }
    });

    return sanitized;
  }
}