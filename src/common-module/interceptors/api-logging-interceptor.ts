import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';
import { RmqService } from '@app/rabbitmq';
import { LogType } from '@app/modules/admin-activity-log/enums';
import { getConfig, RabbitmqConfig } from '@app/config';
import { RequestContext } from '@app/request-context';
import { RequestUserContext } from '@app/request-context';
import { Reflector } from '@nestjs/core';

const rabbitmqConfig = getConfig<RabbitmqConfig>('rabbitmq');
const apiLogExchange = rabbitmqConfig.apiLogExchangeName;
const API_LOGS = rabbitmqConfig.apiLogsRouteName;

@Injectable()
export class ApiLoggingInterceptor implements NestInterceptor {
  constructor(
    private readonly rmqService: RmqService,
    private readonly reflector: Reflector
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest<Request>();
    const res = context.switchToHttp().getResponse<Response>();
    const startTime = Date.now();
    // Override res.json and res.send to capture the response body
    const originalJson = res.json.bind(res);

    res.json = (body: any) => {
      res.locals.responseBody = body; // Store the response body
      return originalJson(body);
    };

    const originalSend = res.send.bind(res);
    res.send = (body: any) => {
      if (typeof body === 'object') {
        res.locals.responseBody = body;
      }
      return originalSend(body);
    };

    const ipAddress = this.getClientIp(req);
    return next.handle().pipe(
      tap((data) => {
        const executionTime = Date.now() - startTime;
        const moduleName =
          this.reflector.get<string>('moduleName', context.getHandler()) ||
          'Module';
        const ctx: RequestUserContext = RequestContext.get();

        const requestBody = { ...req.body };
        const hashed = '***********';
        const sensitiveFields = [
          'password',
          'currentPassword',
          'newPassword',
          'confirmPassword'
        ];

        // Mask sensitive fields if they exist
        sensitiveFields.forEach((field) => {
          if (requestBody.hasOwnProperty(field)) {
            requestBody[field] = hashed;
          }
        });

        const transformedResponse = res.locals.responseBody || data || null;
        const reqData = {
          userId: ctx.user?.id,
          url: req.url,
          method: req.method,
          headers: req.headers,
          request_body: requestBody,
          ip: ipAddress,
          user_agent: req.headers['user-agent'],
          execution_time: executionTime,
          status_code: res.statusCode,
          response_body: transformedResponse
        };

        this.rmqService.publishMessage(apiLogExchange, API_LOGS, {
          ...reqData,
          status_code: res.statusCode,
          type: LogType.API_LOG,
          module: moduleName
        });
      })
    );
  }

  private getClientIp(req: Request): string {
    let ipAddress =
      req.headers?.['x-forwarded-for']?.toString() ??
      req.socket.remoteAddress ??
      req.ip;
    if (ipAddress && ipAddress.indexOf(',') !== -1) {
      ipAddress = ipAddress.split(',')[0];
    }
    return ipAddress;
  }
}
