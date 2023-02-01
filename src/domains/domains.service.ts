import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Domain } from './domains.entity';
import { AccountsService } from 'src/accounts/accounts.service';
import { Account } from 'src/accounts/accounts.entity';
import { v4 as uuidv4 } from 'uuid';
import { Cron, CronExpression, Interval } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
// import { default as configuration } from 'src/config/configuration';
import configuration from 'src/config/configuration';


// ### For decorator @Interval from '@nestjs/schedule', we need to pass value that calculate 
// ### from process.env.TUNNEL_TTL. But we can't use decorator @Interval(this.VARIABLE).
// ### So, we set up `npm run start:dev` for use `env-cmd` to pre-load environment variable.
// ### INTERVAL = TTL/5
// const INTERVAL = parseInt(process.env.TUNNEL_TTL, 10)*1000/5 || 72000*1000/5
const CONFIG = configuration()
const INTERVAL = CONFIG.TUNNEL.TTL / 5 * 1000
console.log('Debug (domains.services): Process INTERVAL: ' + INTERVAL)

@Injectable()
export class DomainsService {

  constructor(
    @InjectRepository(Domain)
    private readonly domainsRepository: Repository<Domain>,
    @Inject(AccountsService)
    private accountsService: AccountsService,
    private configService: ConfigService
  ) {}

  // Initial Variable
  TUNNEL_OWNER = this.accountsService.getOrCreateByEmail(this.configService.get('TUNNEL.OWNER'))
  TUNNEL_DOMAIN = '.'+this.configService.get('TUNNEL.DOMAIN')
  TUNNEL_TTL  = this.configService.get<number>('TUNNEL.TTL')
  TUNNEL_MODE = this.configService.get<number>('TUNNEL.MODE')
  TUNNEL_RELAYS = this.configService.get('TUNNEL.RELAYS')
  TUNNEL_AUTO_REMOVE = this.configService.get('TUNNEL.AUTO_REMOVE')


  // @Cron('* 0 * * * *')    // check every hour at XX.00
  @Interval(INTERVAL)
  handleCronPattern() {
    console.log((new Date()).toISOString() + ' Auto Removing Tunnel: ' + this.TUNNEL_AUTO_REMOVE)
    if (this.TUNNEL_AUTO_REMOVE) {
      this.removeTemporaryDomain()
    }
  }

  async findAll(): Promise<Domain[]> {
    return this.domainsRepository.find({
      relations: {
        account: true,
      },
    });
  }

  findOne(id: number): Promise<Domain> {
    return this.domainsRepository.findOne({
      where: {
        id: id,
      },
      relations: {
        account: true,
      },
    });
  }

  async remove(id: string): Promise<void> {
    await this.domainsRepository.delete(id);
  }

  async generateTemporaryDomain(): Promise<Domain> {
    let name = 'tunnel-'+uuidv4()+this.TUNNEL_DOMAIN;
    let token = uuidv4();
    let relay = this.TUNNEL_RELAYS[Math.floor(Math.random() * this.TUNNEL_RELAYS.length)];

    let domain = new Domain();
    domain.name = name
    domain.token = token
    domain.reclamation_token = token
    domain.continent = relay
    domain.mode = this.TUNNEL_MODE
    domain.account = await this.TUNNEL_OWNER

    domain.description = 'Temporary Tunnel'
    domain.dns_challenge = '0'
    domain.verification_token = '0'
    domain.last_ip = ''

    return this.domainsRepository.save(domain);;
  }

  async generateTemporaryDomainAsNgrok(): Promise<String> {
    let name = 'tunnel-'+uuidv4() + this.TUNNEL_DOMAIN;
    let token = uuidv4();
    let relay = this.TUNNEL_RELAYS[Math.floor(Math.random() * this.TUNNEL_RELAYS.length)];

    let domain = new Domain();
    domain.name = name
    domain.token = token
    domain.reclamation_token = token
    domain.continent = relay
    domain.mode = this.TUNNEL_MODE
    domain.account = await this.TUNNEL_OWNER

    domain.description = 'Temporary Tunnel'
    domain.dns_challenge = '0'
    domain.verification_token = '0'
    domain.last_ip = ''

    this.domainsRepository.save(domain);

    // ### Format String like <domain_name>:<token>
    if (name.slice(-1) == '.') {
      return name.slice(0,-1)+':'+token
    } else {
      return name+':'+token
    }
  }

  async removeTemporaryDomain(): Promise<void> {
    let account = await this.TUNNEL_OWNER
    let domains = await this.domainsRepository.find({
      relations: {
        account: true,
      },
      where: {
        account: {
          id: account.id
        } 
      }
    });
    // console.log('TTL: '+ typeof(this.TUNNEL_TTL))
    // console.log('RELAYS ('+this.TUNNEL_RELAYS.length+'): '+this.TUNNEL_RELAYS)
    let expiration = BigInt(Math.floor(Date.now() / 1000) - this.TUNNEL_TTL)
    domains.forEach(domain => {
      if (BigInt(domain.timestamp) < expiration) {
        this.domainsRepository.delete(domain.id);
      }
    });
  }
}


