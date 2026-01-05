import { Module } from '@nestjs/common';
import { IrController } from './ir.controller';

@Module({
  controllers: [IrController],
})
export class IrInterfaceModule {}
