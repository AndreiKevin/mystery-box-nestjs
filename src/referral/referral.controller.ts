import { Controller, Get, Query } from '@nestjs/common';
// biome-ignore lint/style/useImportType: <this is not used as a type. nestjs needs it to be imported as a class>
import { ReferralService } from './referral.service';

@Controller('api/v1/referral')
export class ReferralController {
  constructor(private readonly referralService: ReferralService) {}

  @Get('validate')
  async validateReferralCode(@Query('referralCode') referralCode: string) {
    const isValid = await this.referralService.validateReferralCode(referralCode);
    return { valid: isValid };
  }
}
