import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Post,
  Put,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ApiHeader, ApiResponse, ApiTags } from '@nestjs/swagger';

import { API_COLOR_ID_HEADER } from '@/infrastructure/rest/api-doc.header';
import { BaseRestController } from '@/infrastructure/rest/base.controller';
import {
  AtualizarCorInput,
  DeletarCorInput,
  RegistrarCorInput,
} from '../domain/cor.input';
import {
  AtualizarCorService,
  DeletarCorService,
  RegistrarCorService,
} from '../domain/cor.service';
import { HexVO } from '../vos/hex.vo';
import { NomeVO } from '../vos/nome.vo';
import {
  AtualizarCorPayload,
  CorResponse,
  RegistrarCorPayload,
} from './cor.model';
import { COLOR_ID_HEADER } from '@/infrastructure/rest/headers.conts';
import { CorRepository } from '../infrastructure/cor.repository';
import { IdVO } from '../vos/id.vo';
import { CorNotRegisteredException } from './cor.exception';

@ApiTags('API - Cores')
@Controller(CorController.BASE_URL)
export class CorController extends BaseRestController {
  static BASE_URL = '/v1/cor';
  readonly cloudFrontUrl: string;

  constructor(
    private readonly registrarCorService: RegistrarCorService,
    private readonly atualizarCorService: AtualizarCorService,
    private readonly deletarCorService: DeletarCorService,
    private readonly corRepository: CorRepository,
  ) {
    super(CorController.name);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    type: CorResponse,
  })
  @ApiHeader(API_COLOR_ID_HEADER)
  async getById(@Headers(COLOR_ID_HEADER) id: string): Promise<CorResponse> {
    this.logger.log(`func=getById params=${id}`);
    if (!id) throw new BadRequestException('Id da Cor não informada!');
    const cor = await this.corRepository.findOneById(IdVO.of(id));
    if (!cor) {
      throw new NotFoundException('Cor não registrada.');
    }
    const output = new CorResponse();
    output.handle(cor);
    return output;
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK, type: CorResponse })
  @ApiHeader(API_COLOR_ID_HEADER)
  async registrar(@Body() payload: RegistrarCorPayload) {
    const output = new CorResponse();
    const { hex, nome } = payload;
    const input = new RegistrarCorInput(NomeVO.of(nome), HexVO.of(hex));
    await this.registrarCorService.execute(input, output);
    return output;
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK, type: CorResponse })
  @ApiHeader(API_COLOR_ID_HEADER)
  async atualizar(
    @Headers(COLOR_ID_HEADER) id: string,
    @Body() payload: AtualizarCorPayload,
  ) {
    if (!id) throw new BadRequestException('Id da Cor não informada!');
    const output = new CorResponse();
    const { hex, nome } = payload;
    const input = new AtualizarCorInput(
      IdVO.of(id),
      NomeVO.of(nome),
      HexVO.of(hex),
    );
    await this.atualizarCorService.execute(input, output);
    return output;
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @ApiHeader(API_COLOR_ID_HEADER)
  async deletar(@Headers(COLOR_ID_HEADER) id: string) {
    try {
      if (!id) throw new BadRequestException('Id da Cor não informada!');
      const input = new DeletarCorInput(IdVO.of(id));
      await this.deletarCorService.execute(input);
    } catch (error) {
      this.handleException(error);
    }
  }

  private handleException(e: CorNotRegisteredException | Error) {
    if (e instanceof CorNotRegisteredException) {
      throw new NotFoundException(e.message);
    }
    throw new UnprocessableEntityException(e.message);
  }
}
