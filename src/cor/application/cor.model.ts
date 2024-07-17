import { ToString } from '@/infrastructure/decorators/to-string.decorator';
import {
  HEX_API_PROP,
  ID_API_PROP,
  NOME_API_PROP,
} from '@/infrastructure/rest/api-doc.property';
import { ApiProperty } from '@nestjs/swagger';
import { CorOutput } from '../domain/cor.output';
import { Cor } from '../domain/cor.domain';

@ToString()
export class RegistrarCorPayload {
  @ApiProperty(HEX_API_PROP)
  hex: string;

  @ApiProperty(NOME_API_PROP)
  nome: string;
}

@ToString()
export class AtualizarCorPayload extends RegistrarCorPayload {}

@ToString()
export class CorResponse extends RegistrarCorPayload implements CorOutput {
  @ApiProperty(ID_API_PROP)
  id: string;

  @ApiProperty(ID_API_PROP)
  rgb: string;

  @ApiProperty(ID_API_PROP)
  hsl: string;

  handle(cor: Cor): void {
    this.id = cor.id.value;
    this.nome = cor.nome.value;
    this.hex = cor.hex.getHex();
    this.rgb = cor.hex.getRGBString();
    this.hsl = cor.hex.getHSLString();
  }
}
