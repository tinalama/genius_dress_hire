import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException
} from '@nestjs/common';
import { Request } from 'express';
import { getConfig, ApiKeyConfig } from '@app/config';

const apiKeyConfig = getConfig<ApiKeyConfig>('apiKey');

@Injectable()
export class ApiKeyGuard implements CanActivate {
  private readonly validApiKey = apiKeyConfig.key;

  canActivate(context: ExecutionContext): boolean {
    const request: Request = context.switchToHttp().getRequest();
    const apiKey = request.headers['x-api-key'];

    if (!apiKey) {
      throw new UnauthorizedException('API key is missing');
    }

    if (apiKey !== this.validApiKey) {
      throw new UnauthorizedException('Invalid API key');
    }

    return true; // Allow request to proceed if API key is valid
  }
}
