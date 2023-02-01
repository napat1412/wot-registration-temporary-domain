import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Domain } from './domains.entity';
import { DomainsController } from './domains.controller';
import { TemporaryDomainsController } from './temporaryDomains.controller';
import { DomainsService } from './domains.service';
import { AccountsModule } from 'src/accounts/accounts.module';
import { ConfigModule } from '@nestjs/config';
import configuration from 'src/config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      cache: true,
    }),
    TypeOrmModule.forFeature([Domain]), 
    AccountsModule
  ],
  providers: [DomainsService],
  controllers: [TemporaryDomainsController],
  // ### Disable DomainsController for Production ###
  // controllers: [DomainsController, TemporaryDomainsController],
})
export class DomainsModule {}
