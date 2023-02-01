import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAccountDto } from './dto/create-account.dto';
import { Account } from './accounts.entity';

@Injectable()
export class AccountsService {

  constructor(
    @InjectRepository(Account)
    private readonly accountsRepository: Repository<Account>,
  ) {}

  async createDto(createAccountDto: CreateAccountDto): Promise<Account> {
    const existAccount = await this.accountsRepository.findOneBy({ email: createAccountDto.email })
    if (existAccount == null) {
      const account = new Account();
      account.email = createAccountDto.email;
      return this.accountsRepository.save(account);
    } else {
      return existAccount;
    }
  }

  async getOrCreateByEmail(email: string): Promise<Account> {
    // Default Account for root
    // let id = 0;
    // let email = 'root';
    let account = await this.accountsRepository.findOneBy({email: email});
    if (!account) {
        account = new Account();
        // account.id = id;
        account.email = email;
        await this.accountsRepository.save(account);
    }
    return account;
  }

  // create(id: number, email: string): Promise<Account> {
  //   const account = new Account();
  //   account.id = id;
  //   account.email = email;
  //   return this.accountsRepository.save(account);
  // }

  async findAll(): Promise<Account[]> {
    return this.accountsRepository.find();
  }

  findOne(id: number): Promise<Account> {
    return this.accountsRepository.findOneBy({ id: id });
  }

  async remove(id: string): Promise<void> {
    await this.accountsRepository.delete(id);
  }
}
