import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { OAuthToken } from './oauth-token.entity';
import { Post } from './post.entity';

@Entity('linkedin_accounts')
export class LinkedInAccount {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  linkedin_urn: string; 

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column({ nullable: true })
  headline: string;

  @Column({ nullable: true })
  profile_image: string;

  @OneToOne(() => User, (user) => user.linkedinAccount)
  @JoinColumn()
  user: User;

  @OneToOne(() => OAuthToken, (token) => token.linkedinAccount)
  oauthToken: OAuthToken;

  @OneToMany(() => Post, (post) => post.linkedinAccount)
  posts: Post[];
}