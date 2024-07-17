import { ObjectUtils } from '@/infrastructure/utils';
import { ToString } from '@/infrastructure/decorators/to-string.decorator';

@ToString()
export class NomeVO {
  private constructor(readonly value: string) {}
  static of(nome: string) {
    ObjectUtils.requireNonNull(nome, 'Nome é requerido');
    if (nome.trim().length < 1) {
      ObjectUtils.requireNonNull(nome, 'Nome está inválido');
    }
    return new NomeVO(nome);
  }
}
