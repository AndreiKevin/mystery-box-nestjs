import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getBalance(userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const totalPurchases = await this.userRepository
      .createQueryBuilder('user')
      .leftJoin('mystery_purchases', 'mp', 'mp.user_id = user.id')
      .where('user.id = :userId', { userId })
      .select('COUNT(mp.id)', 'totalPurchases')
      .getRawOne();

    return {
      credits: user.credits,
      totalPurchases: totalPurchases.totalPurchases,
    };
  }
}
