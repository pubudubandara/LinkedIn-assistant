import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('user_preferences')
export class UserPreference {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  role: string;

  @Column({ type: 'text' })
  goals: string;

  @Column({ type: 'text' })
  challenges: string;

  @Column()
  target_country: string;

  @Column()
  content_tone: string;

  @OneToOne(() => User, (user) => user.preference, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;
}