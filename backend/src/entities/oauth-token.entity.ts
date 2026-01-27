import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, UpdateDateColumn } from 'typeorm';
import { LinkedInAccount } from './linkedin-account.entity';

@Entity('oauth_tokens')
export class OAuthToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  access_token: string;

  @Column({ type: 'text', nullable: true }) // Sometimes refresh token may not be received
  refresh_token: string;

  @Column({ type: 'bigint' })
  expires_in: number;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToOne(() => LinkedInAccount, (account) => account.oauthToken)
  @JoinColumn()
  linkedinAccount: LinkedInAccount;
}