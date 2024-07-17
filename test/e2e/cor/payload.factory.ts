import { faker } from '@faker-js/faker';

export const registrarCorPayload = {
  nome: faker.color.human(),
  hex: faker.color.rgb(),
};

export const atualizarCorPayload = {
  nome: faker.color.human(),
  hex: faker.color.rgb(),
};
