import {
  Body,
  Controller,
  Get,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import type { Request } from "express";
import { ApplicationsService } from "./applications.service";
import { SubmitApplicationDto } from "./application.types";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import type { AuthJwtPayload } from "../auth/auth.types";

@Controller("applications")
@UseGuards(JwtAuthGuard)
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Post()
  submit(
    @Body() dto: SubmitApplicationDto,
    @Req() req: Request & { user: AuthJwtPayload },
  ) {
    return this.applicationsService.submit(dto, req.user);
  }

  @Get("mine")
  findMine(
    @Query("eventId", ParseIntPipe) eventId: number,
    @Req() req: Request & { user: AuthJwtPayload },
  ) {
    return this.applicationsService.findMine(req.user.sub, eventId);
  }
}
