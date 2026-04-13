import { Controller, Get, Param } from '@nestjs/common';
import { WargamingService } from './wargaming.service';
import { ClanMemberStats } from './wargaming.models';

@Controller('wargaming')
export class WargamingController {
  constructor(private readonly wargamingService: WargamingService) {}

  @Get('clan-members')
  getClanMembers(@Param() params: { clanId: string }): Promise<ClanMemberStats[]> {
    return this.wargamingService.getClanMembers(params.clanId);
  }
}
