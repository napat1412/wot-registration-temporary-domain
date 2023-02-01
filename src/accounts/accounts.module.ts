import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './accounts.entity';
import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';

@Module({
  imports: [TypeOrmModule.forFeature([Account])],
  providers: [AccountsService],
  exports: [AccountsService],
  // controllers: [AccountsController],
})
export class AccountsModule {}
