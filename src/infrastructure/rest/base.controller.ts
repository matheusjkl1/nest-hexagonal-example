import { Logger, UseFilters, UseGuards } from '@nestjs/common';
import { ApiResponse, ApiSecurity } from '@nestjs/swagger';
import {
  ERRO_401_API_RESPONSE,
  ERRO_422_API_RESPONSE,
  ERRO_500_API_RESPONSE,
} from './api-doc';
import { ApiKeyGuard } from '../guards/api-key.guard';
import { HttpExceptionFilter } from '../filters/http-exception.filter';
import { API_KEY_HEADER } from './headers.conts';

@ApiResponse(ERRO_401_API_RESPONSE)
@ApiResponse(ERRO_422_API_RESPONSE)
@ApiResponse(ERRO_500_API_RESPONSE)
@ApiSecurity(API_KEY_HEADER)
@UseGuards(ApiKeyGuard)
@UseFilters(HttpExceptionFilter)
export abstract class BaseRestController {
  protected readonly logger = new Logger(this.name);

  constructor(private readonly name: string) {}
}
