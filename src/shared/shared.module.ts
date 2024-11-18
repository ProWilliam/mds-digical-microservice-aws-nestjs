import { Module } from '@nestjs/common';
import { ItemRepository } from './repositories/item.repository';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [ItemRepository, ConfigService],
  exports: [ItemRepository],
})
export class SharedModule {}
