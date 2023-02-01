import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  ParseIntPipe,
} from '@nestjs/common';
import { Domain } from 'src/domains/domains.entity';
import { DomainsService } from 'src/domains/domains.service';

@Controller('temporary-domain')
export class TemporaryDomainsController {
  constructor(private readonly domainsService: DomainsService) {}

  @Post()
  // create(): Promise<Domain> {
  //   return this.domainsService.generateTemporaryDomain();
  // }
  create(): Promise<String> {
    return this.domainsService.generateTemporaryDomainAsNgrok();
  }


  @Get()
  findAll(): Promise<Domain[]> {
    return this.domainsService.findAll();
  }

}