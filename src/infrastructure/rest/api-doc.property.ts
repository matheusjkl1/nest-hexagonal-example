import { ApiPropertyOptions } from '@nestjs/swagger';

export const ID_API_PROP: ApiPropertyOptions = {
  example: '6dee0e22-f35f-46c6-8889-714cfbbf415c',
};

export const DESCRICAO_API_PROP: ApiPropertyOptions = {
  example: 'Isto é uma descrição',
};

export const NOME_API_PROP: ApiPropertyOptions = {
  example: 'Nome de uma cor.',
};

export const HEX_API_PROP: ApiPropertyOptions = {
  example: 'HEX de uma cor.',
};

export const RGB_API_PROP: ApiPropertyOptions = {
  example: 'RGB de uma cor.',
};

export const HSL_API_PROP: ApiPropertyOptions = {
  example: 'HSL de uma cor.',
};
