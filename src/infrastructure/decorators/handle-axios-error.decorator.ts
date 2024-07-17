import axios from 'axios';
import { HttpStatus } from '@nestjs/common';

export type ErrorTypeResponse =
  | Record<string, any>
  | Array<Record<string, any>>
  | null;

type HandleAxiosErrorParams = {
  returnWhen4xxError?: ErrorTypeResponse;
};

export function HandleAxiosError(
  params: HandleAxiosErrorParams = {
    returnWhen4xxError: {},
  },
) {
  return function (target: any, __: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      try {
        if (this.logger) {
          this.logger.log(`func=${originalMethod.name} args=${args}`);
        }
        return await originalMethod.apply(this, args);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const statusCode = error.response && error.response.status;
          if (this.logger) {
            this.logger.error(`statusCode=${statusCode} error=${error}`);
          }
          if (
            statusCode >= HttpStatus.BAD_REQUEST &&
            statusCode < HttpStatus.INTERNAL_SERVER_ERROR
          ) {
            return params.returnWhen4xxError;
          } else {
            return null;
          }
        } else {
          return null;
        }
      }
    };
  };
}
