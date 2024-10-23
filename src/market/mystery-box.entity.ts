import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('mystery_boxes')
export class MysteryBox {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    price: number;

    @Column()
    image_url: string;

    @Column()
    created_at: Date;

}