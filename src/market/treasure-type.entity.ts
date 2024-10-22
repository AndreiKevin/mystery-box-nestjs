import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('treasure_types')
export class TreasureType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  initial_quantity: number;

  @Column()
  remaining_quantity: number;

  @Column()
  image_url: string;

  @Column()
  created_at: Date;
}
