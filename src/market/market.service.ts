import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import { TreasureType } from './treasure-type.entity';

@Injectable()
export class MarketService {
  constructor(
    @InjectRepository(TreasureType)
    private treasureTypeRepository: Repository<TreasureType>,
  ) {}

  async getInventory(): Promise<TreasureType[]> {
    return this.treasureTypeRepository.find();
  }

  async purchaseTreasure(userId: number, quantity: number): Promise<any> {
    const queryRunner = this.treasureTypeRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const result = await queryRunner.query(
        'CALL purchase_treasure(?, @treasure_type_id)',
        [userId]
      );

      const treasureTypeId = await queryRunner.query('SELECT @treasure_type_id as treasureTypeId');
      const treasureReceived = await this.treasureTypeRepository.findOne(treasureTypeId[0].treasureTypeId);

      await queryRunner.commitTransaction();

      return {
        purchaseId: result[0][0].id,
        treasureReceived: {
          id: treasureReceived.id,
          type: treasureReceived.name,
          name: treasureReceived.name,
        },
        remainingCredits: result[0][0].remaining_credits,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
