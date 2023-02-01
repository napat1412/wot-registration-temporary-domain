import { Column, OneToMany, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Domain } from '../domains/domains.entity';

@Entity("accounts")
export class Account {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column({ default: 0 })
  optout: number;

  @OneToMany(() => Domain, (domain) => domain.account)
  domains: Domain[]
}
