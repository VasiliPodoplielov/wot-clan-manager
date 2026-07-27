import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityManager, QueryFailedError, Repository } from "typeorm";
import { Event } from "./entities/event.entity";
import { EventStatus } from "./event.models";
import { CreateEventDto, EventPublicDto } from "./event.types";

const POSTGRES_UNIQUE_VIOLATION = "23505";

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private eventsRepository: Repository<Event>,
  ) {}

  async getActive(): Promise<EventPublicDto | null> {
    const event = await this.eventsRepository.findOne({
      where: { status: EventStatus.ACTIVE },
    });
    return event ? EventPublicDto.fromEntity(event) : null;
  }

  async findById(id: number): Promise<Event | null> {
    return this.eventsRepository.findOne({ where: { id } });
  }

  async create(dto: CreateEventDto, createdByUserId: number): Promise<Event> {
    if (!dto.name?.trim()) {
      throw new BadRequestException("Назва події обов'язкова");
    }
    if (!dto.startDate || !dto.endDate) {
      throw new BadRequestException("Дати початку та завершення обов'язкові");
    }

    return this.runActivationSafe(async (manager) => {
      if (dto.status === EventStatus.ACTIVE) {
        await this.deactivateAllActive(manager);
      }

      const event = manager.create(Event, {
        name: dto.name,
        startDate: dto.startDate,
        endDate: dto.endDate,
        primeTime: dto.primeTime,
        status: dto.status ?? EventStatus.CLOSED,
        createdByUserId,
      });

      return manager.save(event);
    });
  }

  async setStatus(id: number, status: EventStatus): Promise<Event> {
    const event = await this.findById(id);
    if (!event) {
      throw new NotFoundException("Подію не знайдено");
    }

    return this.runActivationSafe(async (manager) => {
      if (status === EventStatus.ACTIVE) {
        await this.deactivateAllActive(manager);
      }

      event.status = status;
      return manager.save(event);
    });
  }

  // Деактивація попередньої активної події та активація нової виконуються
  // в одній транзакції — інваріант "лише одна активна подія" додатково
  // гарантований partial unique index на рівні БД (event.entity.ts).
  private async runActivationSafe(
    work: (manager: EntityManager) => Promise<Event>,
  ): Promise<Event> {
    try {
      return await this.eventsRepository.manager.transaction(work);
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        (error.driverError as { code?: string })?.code ===
          POSTGRES_UNIQUE_VIOLATION
      ) {
        throw new ConflictException("Вже є активна подія, спробуйте ще раз");
      }
      throw error;
    }
  }

  private async deactivateAllActive(manager: EntityManager): Promise<void> {
    await manager.update(
      Event,
      { status: EventStatus.ACTIVE },
      { status: EventStatus.CLOSED },
    );
  }
}
