import { ApiHeaderOptions } from '@nestjs/swagger';
import { COLOR_ID_HEADER } from './headers.conts';

export const API_COLOR_ID_HEADER: ApiHeaderOptions = {
  name: COLOR_ID_HEADER,
  required: true,
  description: 'ID da cor',
};
