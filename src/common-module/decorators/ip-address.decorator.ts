import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import requestIp from 'request-ip';

export const IpAddress = createParamDecorator((data, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest<Request>();
  if (req.clientIp) {
    return req.clientIp;
  }
  return requestIp.getClientIp(req); // In case we forgot to include requestIp.mw() in main.ts
});
