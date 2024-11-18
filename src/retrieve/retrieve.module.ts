import { Module } from '@nestjs/common';
import { RetrieveService } from './retrieve.service';
import { RetrieveController } from './retrieve.controller';
import { SharedModule } from '../shared/shared.module';

@Module({
  imports: [SharedModule],
  providers: [RetrieveService],
  controllers: [RetrieveController],
})
export class RetrieveModule {}
