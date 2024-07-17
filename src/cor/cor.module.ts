import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CorController } from './application/cor.controller';
import {
  AtualizarCorService,
  DeletarCorService,
  RegistrarCorService,
} from './domain/cor.service';
import { CorEntity } from './infrastructure/cor.entity';
import {
  CorAtualizadaNotifier,
  CorCriadaNotifier,
  CorDeletadaNotifier,
} from './infrastructure/cor.notifier';
import { CorRepository } from './infrastructure/cor.repository';

@Module({
  controllers: [CorController],
  providers: [
    CorCriadaNotifier,
    CorAtualizadaNotifier,
    RegistrarCorService,
    AtualizarCorService,
    DeletarCorService,
    CorDeletadaNotifier,
    CorRepository,
  ],
  imports: [TypeOrmModule.forFeature([CorEntity])],
  exports: [CorRepository],
})
export class CorModule {}
