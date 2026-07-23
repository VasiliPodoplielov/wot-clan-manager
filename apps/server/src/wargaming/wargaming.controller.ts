import { Controller, Get, Query } from '@nestjs/common';
import { WargamingService } from './wargaming.service';
import { ClanMemberStats } from './wargaming.models';

@Controller('wargaming')
export class WargamingController {
  constructor(private readonly wargamingService: WargamingService) {}

  @Get('clan-members')
  getClanMembers(@Query('clanId') clanId: string): Promise<ClanMemberStats[]> {
    return this.wargamingService.getClanMembers(clanId);
  }
}
