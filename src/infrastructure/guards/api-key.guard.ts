import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { API_KEY_HEADER } from '../rest/headers.conts';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  private readonly key: string;

  constructor(configService: ConfigService) {
    this.key = configService.get<string>('API_KEY');
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const apiKey = request.headers[API_KEY_HEADER];
    if (!apiKey || apiKey !== this.key) {
      throw new UnauthorizedException('Não autorizado');
    }
    return true;
  }
}
