import { BaseException } from '../model/exception.model';

export interface Unique {
  hashCode(): string;
}

export class UniqueList {
  private constructor() {}

  static toUnique<T extends Unique>(list: Array<T>): T[] {
    if (!list) return list;
    const hashMap = new Map<string, T>();
    list.forEach((item) => {
      const hashCode = item.hashCode();
      if (!hashMap.has(hashCode)) {
        hashMap.set(hashCode, item);
      }
    });
    return Array.from(hashMap.values());
  }
}

export abstract class ObjectUtils {
  static isNull(obj?: any): boolean {
    return !obj;
  }
  static requireNonNull(obj?: any, msg?: string) {
    if (!obj) throw new BaseException(msg ?? 'Campo é obrigatório');
  }

  static requireNull(obj?: any, msg?: string) {
    if (!!obj) throw new BaseException(msg ?? 'Campo não é obrigatório');
  }

  static requireTrue(obj: boolean, msg?: string) {
    if (!obj) throw new BaseException(msg ?? 'Valor deve ser verdadeiro');
  }
}

export abstract class ArrayUtils {
  static requireNonEmpty(arr?: Array<any>, msg?: string) {
    if (!arr || !arr.length)
      throw new BaseException(msg ?? 'Items são obrigatório');
  }
}

export abstract class StringUtils {
  static toBase64(value: string): string {
    return btoa(value);
  }

  static removeWhitespaceAndNewlines(value: string): string {
    return value.replace(/\n/g, '');
  }

  static requireRegex(value: string, regex: RegExp, msg?: string) {
    ObjectUtils.requireNonNull(value, msg);
    if (!regex.test(value))
      throw new BaseException(msg ?? 'Campo está inválido');
  }
}

export abstract class EnumsUtils {
  static requireValue(value: string, enumerator: any, msg?: string) {
    if (!Object.values(enumerator).includes(value)) {
      throw new BaseException(msg ?? 'Campo está inválido');
    }
  }
}

export abstract class LoggerUtils {
  static stringify(value?: any) {
    return JSON.stringify(value ?? {});
  }
}

export abstract class Arrays {
  static requireNonEmpty(arr?: Array<any>, msg?: string) {
    if (!Arrays.hasLength(arr))
      throw new BaseException(msg ?? 'Items são obrigatórios');
  }

  static requireEmpty(arr?: Array<any>, msg?: string) {
    if (Arrays.hasLength(arr))
      throw new BaseException(msg ?? 'Items não são obrigatórios');
  }

  static hasLength(arr?: Array<any>) {
    return arr && arr.length;
  }
}
