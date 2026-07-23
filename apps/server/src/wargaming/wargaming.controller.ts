import { Controller, Get, Param } from '@nestjs/common';
import { WargamingService } from './wargaming.service';
import { ClanMemberStats } from './wargaming.models';

@Controller('wargaming')
export class WargamingController {
  constructor(private readonly wargamingService: WargamingService) {}

  @Get('clan-members/:clanId')
  getClanMembers(@Param('clanId') clanId: string): Promise<ClanMemberStats[]> {
    return this.wargamingService.getClanMembers(clanId);
  }
}
