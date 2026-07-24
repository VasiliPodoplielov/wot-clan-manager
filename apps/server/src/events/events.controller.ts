import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import type { Request } from "express";
import { EventsService } from "./events.service";
import type { CreateEventDto, UpdateEventStatusDto } from "./event.types";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { UserRole } from "../users/user.models";
import type { AuthJwtPayload } from "../auth/auth.types";

@Controller("events")
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get("active")
  getActive() {
    return this.eventsService.getActive();
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.OFFICER, UserRole.MODERATOR)
  create(
    @Body() dto: CreateEventDto,
    @Req() req: Request & { user: AuthJwtPayload },
  ) {
    return this.eventsService.create(dto, req.user.sub);
  }

  @Patch(":id/status")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.OFFICER, UserRole.MODERATOR)
  setStatus(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateEventStatusDto,
  ) {
    return this.eventsService.setStatus(id, dto.status);
  }
}
