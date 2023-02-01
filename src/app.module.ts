import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountsModule } from './accounts/accounts.module';
import { DomainsModule } from './domains/domains.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { ConfigService } from '@nestjs/config';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      cache: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forRoot()],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        let url = configService.get('DATABASE.URL')
        let protocol = url.substring(0, url.indexOf(':'));
        let path = url.substring(url.indexOf(':') + 3);
        if (protocol == 'sqlite') {
          return {
            type: 'sqlite',
            database: path,
            autoLoadEntities: true,
            synchronize: configService.get('DATABASE.SYNCHRONIZE'),
            logging: configService.get('DATABASE.LOGGING'),
          }
        } else {
          return {
            type: protocol,
            url: url,
            autoLoadEntities: true,
            synchronize: configService.get('DATABASE.SYNCHRONIZE'),
            logging: configService.get('DATABASE.LOGGING'),
          }
        }
      },
    }),
    ScheduleModule.forRoot(),
    AccountsModule,
    DomainsModule,
  ],
})

export class AppModule {}