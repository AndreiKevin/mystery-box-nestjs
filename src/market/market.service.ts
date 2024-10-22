import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import type { EntityManager } from 'typeorm';
import type { TreasureType } from './treasure-type.entity';

@Injectable()
export class MarketService {
  constructor(
    @InjectEntityManager()
    private entityManager: EntityManager,
  ) {}

  async getInventory(): Promise<TreasureType[]> {
    return this.entityManager.query('SELECT * FROM treasure_types');
  }

  async purchaseMysteryBox(userId: number): Promise<void> {
    await this.entityManager.query('CALL PurchaseMysteryBox(?)', [userId]);
  }
}
