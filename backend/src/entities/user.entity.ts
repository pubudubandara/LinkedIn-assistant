import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToOne } from 'typeorm';
import { LinkedInAccount } from './linkedin-account.entity';
import { UserPreference } from './user-preference.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: true })
  email: string;

  @CreateDateColumn()
  created_at: Date;

  // Assuming a user has one LinkedIn Account
  @OneToOne(() => LinkedInAccount, (account) => account.user)
  linkedinAccount: LinkedInAccount;

  @OneToOne(() => UserPreference, (pref) => pref.user)
  preference: UserPreference;
}