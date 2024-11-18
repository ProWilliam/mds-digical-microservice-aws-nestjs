import { Module } from '@nestjs/common';
import { RemoveService } from './remove.service';
import { RemoveController } from './remove.controller';
import { SharedModule } from '../shared/shared.module';

@Module({
  imports: [SharedModule],
  providers: [RemoveService],
  controllers: [RemoveController],
})
export class RemoveModule {}
