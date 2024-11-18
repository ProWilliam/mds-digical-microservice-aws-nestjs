import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RetrieveModule } from './retrieve/retrieve.module';
import { AddModule } from './add/add.module';
import { UpdateModule } from './update/update.module';
import { AuthModule } from './auth/auth.module';
import { RemoveModule } from './remove/remove.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    RetrieveModule,
    AddModule,
    UpdateModule,
    AuthModule,
    RemoveModule,
  ],
})
export class AppModule {}
