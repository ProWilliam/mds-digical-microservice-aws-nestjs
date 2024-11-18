import { Module } from '@nestjs/common';
import { UpdateService } from './update.service';
import { UpdateController } from './update.controller';

@Module({
  providers: [UpdateService],
  controllers: [UpdateController],
})
export class UpdateModule {}
