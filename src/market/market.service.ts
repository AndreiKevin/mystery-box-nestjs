import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import type { EntityManager } from 'typeorm';
import type { TreasureType } from './treasure-type.entity';
import type { MysteryBox } from './mystery-box.entity';

@Injectable()
export class MarketService {
    constructor(
        @InjectEntityManager()
        private entityManager: EntityManager,
    ) {}
    
    async getInventory(): Promise<TreasureType[]> {
        return this.entityManager.query('SELECT * FROM treasure_types');
    }
    
    async purchaseMysteryBox(userId: number, mysteryBoxId: number): Promise<{treasureReceived: TreasureType, remainingCredits: number}> {
        try {
            const res = await this.entityManager.query('CALL PurchaseMysteryBox(?, ?)', [userId, mysteryBoxId]);
            return {
                treasureReceived: res[0][0],
                remainingCredits: res[0][0].remaining_credits
            }
        } catch (error) {
            if (error.sqlMessage?.includes('Not enough credits')) {
                throw new Error('Not enough credits');
            }
            throw new Error('Failed to purchase mystery box');
        }
    }

    async getMysteryBoxes(): Promise<MysteryBox[]> {
        return this.entityManager.query('SELECT * FROM mystery_boxes');
    }
}
