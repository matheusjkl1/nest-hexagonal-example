import { Output } from '@/infrastructure/base.service';
import { Cor } from './cor.domain';

export interface CorOutput extends Output {
  handle(cor: Cor): void;
}
