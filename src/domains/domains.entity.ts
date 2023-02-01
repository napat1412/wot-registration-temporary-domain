import { Column, ManyToOne, OneToMany, JoinColumn, BeforeInsert, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Account } from '../accounts/accounts.entity';

@Entity("domains")
export class Domain {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({type: "varchar", length: 253})
  name: string;

  @Column({type: "varchar", length: 36})
  token: string;

  @Column()
  description: string;

  // @Column()
  // timestamp: Date;
  @Column({type: 'bigint'})
  timestamp: string;

  @Column({type: "varchar", length: 63})
  dns_challenge: string

  @Column({type: "varchar", length: 36})
  reclamation_token: string;

  @Column({type: "varchar", length: 36, default: '0'})
  verification_token: string;

  @Column({ type: "tinyint", default: 0 })
  verified: number;
  
  @Column({type: "varchar", length: 63})
  continent: string;

  @Column({ default: 0 })
  mode: number;
  
  @Column({type: "varchar", length: 15})
  last_ip: string;

  // ChatGPT
  // @ManyToOne(type => User)
  // @JoinColumn({ name: "user_id" })
  // user: User;
  @ManyToOne(type => Account)
  @JoinColumn({ name: "account_id" })
  account: Account;
  domain: Promise<Account>;

  @BeforeInsert()
  stampTime() {
    this.timestamp = BigInt(Math.floor(Date.now() / 1000)).toString();
  }

}
