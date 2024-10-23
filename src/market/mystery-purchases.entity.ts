import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { TreasureType } from './treasure-type.entity';

@Entity('mystery_purchases')
export class MysteryPurchase {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column()
  treasure_type_id: number;

  @Column()
  price: number;

  @Column()
  purchased_at: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => TreasureType)
  @JoinColumn({ name: 'treasure_type_id' })
  treasure_type: TreasureType;
}
