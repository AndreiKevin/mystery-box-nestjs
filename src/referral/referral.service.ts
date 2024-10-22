import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import { User } from '../users/user.entity';

@Injectable()
export class ReferralService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async validateReferralCode(referralCode: string): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { referral_code: referralCode } });
    return !!user;
  }
}
