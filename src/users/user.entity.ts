import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  password_hash: string;

  @Column()
  referral_code: string;

  @Column({ nullable: true })
  referrer_id: number;

  @Column('decimal', { precision: 10, scale: 2 })
  credits: number;

  @Column()
  member_level: number;

  @Column()
  created_at: Date;
}
