import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  ParseIntPipe,
} from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { Account } from './accounts.entity';
import { AccountsService } from './accounts.service';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  create(@Body() createAccountDto: CreateAccountDto): Promise<Account> {
    return this.accountsService.createDto(createAccountDto);
  }

  @Get()
  findAll(): Promise<Account[]> {
    return this.accountsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Account> {
    return this.accountsService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.accountsService.remove(id);
  }
}
