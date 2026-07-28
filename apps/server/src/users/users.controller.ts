import { Body, Controller, Get, Param, ParseIntPipe, Patch, Query, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { UsersService } from './users.service';
import { UpdateUserRoleDto, UserAdminDto } from './user.types';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from './user.models';
import type { AuthJwtPayload } from '../auth/auth.types';
import { WargamingService } from '../wargaming/wargaming.service';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly wargamingService: WargamingService,
  ) {}

  @Get()
  async findAll(@Query('clanId') clanId?: string): Promise<UserAdminDto[]> {
    const users = await this.usersService.findAll();
    const wgRoleByAccountId = await this.getWgRoleMap(clanId);

    return users.map(user =>
      UserAdminDto.fromEntity(
        user,
        user.wgAccountId ? (wgRoleByAccountId.get(user.wgAccountId) ?? null) : null,
      ),
    );
  }

  @Patch(':id/role')
  async updateRole(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserRoleDto,
    @Req() req: Request & { user: AuthJwtPayload },
  ): Promise<UserAdminDto> {
    const user = await this.usersService.updateRole(id, dto.role, req.user.sub);
    return UserAdminDto.fromEntity(user);
  }

  private async getWgRoleMap(clanId?: string): Promise<Map<string, string>> {
    if (!clanId) {
      return new Map();
    }

    try {
      const clanMembers = await this.wargamingService.getClanMembers(clanId);
      return new Map(clanMembers.map(member => [String(member.accountId), member.role]));
    } catch {
      // WG API недоступне — не валимо адмін-список, лише лишаємо wgRole порожнім.
      return new Map();
    }
  }
}
