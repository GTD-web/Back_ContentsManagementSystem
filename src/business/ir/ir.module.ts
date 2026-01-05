import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IR } from '@domain/core/ir/ir.entity';
import { IRService } from './ir.service';

/**
 * IR 비즈니스 모듈
 *
 * @description
 * - IR 관련 비즈니스 서비스를 제공합니다.
 */
@Module({
  imports: [TypeOrmModule.forFeature([IR])],
  providers: [IRService],
  exports: [IRService],
})
export class IRBusinessModule {}
