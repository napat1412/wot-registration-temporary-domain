import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  ParseIntPipe,
} from '@nestjs/common';
import { Domain } from './domains.entity';
import { DomainsService } from './domains.service';

@Controller('domains')
export class DomainsController {
  constructor(private readonly domainsService: DomainsService) {}

  @Get()
  findAll(): Promise<Domain[]> {
    return this.domainsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Domain> {
    return this.domainsService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.domainsService.remove(id);
  }
}
