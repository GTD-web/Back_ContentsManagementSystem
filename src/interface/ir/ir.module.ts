import { Module } from '@nestjs/common';
import { IrController } from './ir.controller';
import { IRBusinessModule } from '@business/ir';

@Module({
  imports: [IRBusinessModule],
  controllers: [IrController],
})
export class IrInterfaceModule {}
