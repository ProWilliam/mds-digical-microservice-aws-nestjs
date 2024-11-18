import { Module } from '@nestjs/common';
import { AddService } from './add.service';
import { AddController } from './add.controller';

@Module({
  providers: [AddService],
  controllers: [AddController],
})
export class AddModule {}
