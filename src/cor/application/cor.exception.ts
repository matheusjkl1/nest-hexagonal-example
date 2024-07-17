import { BaseException } from '@/infrastructure/model/exception.model';

export class CorAlreadyRegisteredException extends BaseException {}

export class CorNotRegisteredException extends BaseException {}
