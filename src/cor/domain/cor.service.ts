import { BaseService, NullOutput } from '@/infrastructure/base.service';
import { ObjectUtils } from '@/infrastructure/utils';
import { Injectable } from '@nestjs/common';
import {
  CorAlreadyRegisteredException,
  CorNotRegisteredException,
} from '../application/cor.exception';
import { CorResponse } from '../application/cor.model';
import {
  CorAtualizadaNotifier,
  CorCriadaNotifier,
  CorDeletadaNotifier,
} from '../infrastructure/cor.notifier';
import { CorRepository } from '../infrastructure/cor.repository';
import { CorBuilder } from './cor.builder';
import { Cor } from './cor.domain';
import {
  AtualizarCorInput,
  DeletarCorInput,
  RegistrarCorInput,
} from './cor.input';

@Injectable()
export class RegistrarCorService extends BaseService<
  RegistrarCorInput,
  CorResponse
> {
  constructor(
    private readonly corRepository: CorRepository,
    private readonly corCriadaNotifier: CorCriadaNotifier,
  ) {
    super(RegistrarCorService.name);
  }

  protected async perform(input: RegistrarCorInput, output: CorResponse) {
    const cor: Cor = await this.corRepository.findOneByHexOrNome(
      input.hex,
      input.nome,
    );
    if (cor) {
      throw new CorAlreadyRegisteredException('Cor já registrada.');
    }

    const novaCor = this.construirNovaCor(input);
    const corRegistrada = await this.corRepository.save(novaCor);
    ObjectUtils.requireNonNull(corRegistrada, 'Cor não foi registrada');
    await this.corCriadaNotifier.notify(corRegistrada);
    output.handle(corRegistrada);
  }

  private construirNovaCor(input: RegistrarCorInput): Cor {
    const novaCor = CorBuilder.builder(input.hex, input.nome).withNewId();
    return novaCor.build();
  }
}

@Injectable()
export class AtualizarCorService extends BaseService<
  AtualizarCorInput,
  CorResponse
> {
  constructor(
    private readonly corRepository: CorRepository,
    private readonly corAtualizadaNotifier: CorAtualizadaNotifier,
  ) {
    super(AtualizarCorService.name);
  }

  protected async perform(input: AtualizarCorInput, output: CorResponse) {
    const cor: Cor = await this.corRepository.findOneById(input.id);
    if (ObjectUtils.isNull(cor)) {
      throw new CorNotRegisteredException('Cor não registrada.');
    }
    const novaCor = this.construirNovaCor(input);
    cor.atualizar(novaCor);
    const corRegistrada = await this.corRepository.save(cor);
    ObjectUtils.requireNonNull(corRegistrada, 'Cor não foi atualizada');
    await this.corAtualizadaNotifier.notify(corRegistrada);
    output.handle(corRegistrada);
  }

  private construirNovaCor(input: AtualizarCorInput): Cor {
    const novaCor = CorBuilder.builder(input.hex, input.nome).withNewId();
    return novaCor.build();
  }
}

@Injectable()
export class DeletarCorService extends BaseService<
  DeletarCorInput,
  NullOutput
> {
  constructor(
    private readonly corRepository: CorRepository,
    private readonly corDeletadaNotifier: CorDeletadaNotifier,
  ) {
    super(DeletarCorService.name);
  }

  protected async perform(input: DeletarCorInput) {
    const cor: Cor = await this.corRepository.findOneById(input.id);
    if (ObjectUtils.isNull(cor)) {
      throw new CorNotRegisteredException('Cor não registrada.');
    }
    await this.corRepository.delete(cor);
    await this.corDeletadaNotifier.notify(cor);
  }
}
