import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { LinkedInAccount } from './linkedin-account.entity';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  content: string;

  @Column({ nullable: true })
  linkedin_post_id: string; // The ID received when the post is made

  @Column({ default: 'draft' }) // draft, published, failed
  status: string;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => LinkedInAccount, (account) => account.posts, { onDelete: 'CASCADE' })
  linkedinAccount: LinkedInAccount;
}