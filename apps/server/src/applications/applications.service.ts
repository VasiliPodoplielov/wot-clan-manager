import {
  BadRequestException,
  ConflictException,
  Injectable,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { QueryFailedError, Repository } from "typeorm";
import { Application } from "./entities/application.entity";
import { SubmitApplicationDto } from "./application.types";
import { EventsService } from "../events/events.service";
import { EventStatus } from "../events/event.models";
import { WargamingService } from "../wargaming/wargaming.service";
import { AuthJwtPayload } from "../auth/auth.types";

const POSTGRES_UNIQUE_VIOLATION = "23505";

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectRepository(Application)
    private applicationsRepository: Repository<Application>,
    private readonly eventsService: EventsService,
    private readonly wargamingService: WargamingService,
  ) {}

  async submit(
    dto: SubmitApplicationDto,
    user: AuthJwtPayload,
  ): Promise<Application> {
    if (!dto.isReadyForPrime) {
      throw new BadRequestException(
        "Потрібно підтвердити готовність до прайм-тайму",
      );
    }

    const event = await this.eventsService.findById(dto.eventId);
    if (!event || event.status !== EventStatus.ACTIVE) {
      throw new BadRequestException("Реєстрація на цю подію закрита");
    }

    const existing = await this.findMine(user.sub, dto.eventId);
    if (existing) {
      throw new ConflictException("Ви вже подали заявку на цю подію");
    }

    if (!user.wgAccountId) {
      throw new BadRequestException(
        "Прив'яжіть акаунт Wargaming, щоб подати заявку",
      );
    }

    const stats = await this.wargamingService.getPlayerStats(user.wgAccountId);

    const application = this.applicationsRepository.create({
      eventId: dto.eventId,
      userId: user.sub,
      isReadyForPrime: dto.isReadyForPrime,
      canLead: dto.canLead,
      additionalInfo: dto.additionalInfo,
      wgRating: stats.rating,
      battles: stats.battles,
      winRate: stats.winRate,
    });

    try {
      return await this.applicationsRepository.save(application);
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        (error.driverError as { code?: string })?.code ===
          POSTGRES_UNIQUE_VIOLATION
      ) {
        throw new ConflictException("Ви вже подали заявку на цю подію");
      }
      throw error;
    }
  }

  async findMine(userId: number, eventId: number): Promise<Application | null> {
    return this.applicationsRepository.findOne({ where: { userId, eventId } });
  }
}
